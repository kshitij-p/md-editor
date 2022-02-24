import React, { ChangeEvent } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";


import { EditorContext } from "./EditorContext";
import styled from "styled-components";
import { bracketKeys, quoteKeys } from "../utils/helperKeys";
import wrapSelectedWord from "../utils/wrapSelectedWord";
import "codemirror/lib/codemirror.css";
import './overrides.css';

require('codemirror/theme/material.css');

require('codemirror/mode/xml/xml');


type StyledEditorProps = {
    textEditorOpen: boolean;
}
const StyledEditor = styled(CodeMirror) <StyledEditorProps>`
    
    /* For hide option */
    /* visibility: ${props => props.textEditorOpen ? 'visible' : 'hidden'};
        opacity: ${props => props.textEditorOpen ? '1' : '0'};

        display: ${props => props.textEditorOpen ? 'inline-block' : 'none'};
         */

    height: 100%;
    width: 100%;

    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    
`

type CodeMirrorEditorProps = {
    syncScroll: React.MouseEventHandler<HTMLDivElement>;
}

class CodeMirrorEditor extends React.PureComponent<{ syncScroll: React.MouseEventHandler<HTMLDivElement> }> {

    instance: any;

    static contextType = EditorContext;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: CodeMirrorEditorProps) {
        super(props);
    }

    handleBeforeChange = (event: ChangeEvent, data: any, value: string) => {
        clearTimeout(this.context.editorState.editor.autoSaveTimeoutRef.current);

        this.context.editorFunctions.setEditorTextValue(value);

        if (this.context.editorState.editor.isUnsaved !== true) {
            this.context.editorFunctions.setIsUnsaved(true);
        }
        /* To avoid random issues, this time out is cleared whenever saveCurrentOpenFile() runes as well */
        let timeoutID = setTimeout(() => {

            this.context.editorFunctions.saveCurrentOpenFile(true);


        }, 3000)

        this.context.editorFunctions.setAutoSaveTimeout(timeoutID);

    }

    handleOnBlur = (cmInstance: CodeMirror, event: InputEvent) => {
        if (this.context.editorState.inEditorMode !== false) {

            this.context.editorFunctions.setInEditorMode(false);
        }

    }

    handleKeyDown = (cmInstance: any, event: KeyboardEvent) => {
        if (this.context.editorState.editor.inEditorMode) {


            /* CHECK FOR SHORTCUTS THAT NEED ALT HELD */
            if (event.altKey) {
                /* Disable mutli selection crosshair */
                event.preventDefault();

                if (event.code === "ArrowUp") {

                    event.stopPropagation();

                    let currPos = cmInstance.doc.getCursor(true);
                    let lastPos = cmInstance.doc.getCursor(false);

                    if (currPos.line <= 0) {
                        return;
                    }

                    let currLine = currPos.line;
                    let lastLine = lastPos.line;
                    let prevLine = currLine - 1;


                    let currLineContent = cmInstance.doc.getLine(currLine);
                    let prevLineContent = cmInstance.doc.getLine(prevLine);
                    let lastLineContent = cmInstance.doc.getLine(lastLine);

                    let isSelected = cmInstance.doc.somethingSelected();

                    let newContent = isSelected ? cmInstance.doc.getSelection() : currLineContent;

                    /* If shift is also held, duplicate instead of moving */
                    if (event.shiftKey) {

                        cmInstance.doc.replaceRange('\n', { line: prevLine });
                        cmInstance.doc.replaceRange(newContent, { line: currLine });

                        if (isSelected) {
                            cmInstance.doc.setSelection({ line: currLine, ch: 0 }, { line: lastLine })
                        } else {
                            cmInstance.doc.setCursor({ line: currLine, ch: currPos.ch });
                        }

                        return;
                    }

                    cmInstance.doc.replaceRange(newContent, { line: currLine - 1, ch: 0 }, { line: lastLine - 1 });
                    cmInstance.doc.replaceRange(prevLineContent, { line: lastLine, ch: 0 }, { line: lastLine, ch: lastLineContent.length });


                    if (isSelected) {
                        cmInstance.doc.setSelection({ line: currLine - 1, ch: 0 }, { line: lastLine - 1 });
                    } else {

                        cmInstance.doc.setCursor({ line: prevLine, ch: currPos.ch });
                    }


                } else if (event.code === "ArrowDown") {
                    event.stopPropagation();

                    let currPos = cmInstance.doc.getCursor(true);
                    let lastPos = cmInstance.doc.getCursor(false);

                    let currLine = currPos.line;
                    let lastLine = lastPos.line;

                    let nextLine = lastLine + 1;

                    let currLineContent = cmInstance.doc.getLine(currLine);
                    let nextLineContent = cmInstance.doc.getLine(nextLine);

                    let isSelected = cmInstance.doc.somethingSelected();

                    let newContent = isSelected ? cmInstance.doc.getSelection() : currLineContent;

                    if (event.shiftKey) {

                        cmInstance.doc.replaceRange('\n', { line: nextLine });
                        cmInstance.doc.replaceRange(newContent, { line: nextLine });

                        if (isSelected) {
                            let linesSelected = lastLine - currLine;
                            let duplicatedLineStart = lastLine + 1;
                            cmInstance.doc.setSelection({ line: duplicatedLineStart + linesSelected })
                        } else {
                            cmInstance.doc.setCursor({ line: nextLine, ch: currPos.ch });
                        }

                        return;

                    }

                    cmInstance.doc.replaceRange(newContent, { line: currLine + 1, ch: 0 }, { line: lastLine + 1 })
                    cmInstance.doc.replaceRange(nextLineContent, { line: currLine, ch: 0 }, { line: currLine, ch: currLineContent.length });

                    if (isSelected) {

                        cmInstance.doc.setSelection({ line: currLine + 1, ch: 0 }, { line: lastLine + 1 });
                    } else {
                        cmInstance.doc.setCursor({ line: nextLine, ch: currPos.ch });
                    }

                    return;


                }

            }
            /* ^ CHECK FOR SHORTCUTS THAT NEED ALT HELD ^ */

            /* CHECK FOR SHORTCUTS THAT NEED CTRL HELD */
            if (event.ctrlKey) {

                if (event.shiftKey) {

                    if (event.code === "KeyK") {


                        let currPos = cmInstance.doc.getCursor(true);
                        let lastPos = cmInstance.doc.getCursor(false);

                        let currLine = currPos.line;
                        let lastLine = lastPos.line;

                        cmInstance.doc.replaceRange('', { line: currLine, ch: 0 }, { line: lastLine + 1, ch: 0 });
                        cmInstance.doc.setCursor({ line: currLine, ch: currPos.ch })
                    }
                }

            }
            /* ^ CHECK FOR SHORTCUTS THAT NEED ALT HELD ^ */

            /* Wrap words with brackets and quotes */
            if (cmInstance.somethingSelected()) {

                if (bracketKeys.includes(event.key) && !event.altKey && !event.ctrlKey) {
                    event.preventDefault();

                    let selectedWord = cmInstance.getSelection();

                    cmInstance.replaceSelection(wrapSelectedWord(event.key, selectedWord, true), 'around');
                }

                if (quoteKeys.includes(event.key) && !event.altKey && !event.ctrlKey) {
                    event.preventDefault();

                    let selectedWord = cmInstance.getSelection();

                    cmInstance.replaceSelection(wrapSelectedWord(event.key, selectedWord, false), 'around');

                }
            }
            /* ^ Wrap words with brackets and quotes ^ */

        }
    }

    handleKeyUp = (cmInstance: any, event: KeyboardEvent) => {
        if (this.context.editorState.editor.inEditorMode) {

            if (event.code === "Escape") {
                this.context.editorFunctions.setInEditorMode(false);
            }


        }
    }

    handleOnFocus = () => {
        if (this.context.editorState.editor.inEditorMode !== true) {
            this.context.editorFunctions.setInEditorMode(true);
        }
    }

    handleSyncScroll = (cmInstance: any, event: React.MouseEvent<HTMLDivElement>) => {

        this.props.syncScroll(event);


    }

    render() {
        return (
            <>
                <StyledEditor
                    onBeforeChange={this.handleBeforeChange}
                    value={this.context.editorState.editor.editorTextValue}
                    ref={this.context.editorState.editor.editorRef}
                    onBlur={this.handleOnBlur}
                    onFocus={this.handleOnFocus}
                    onKeyUp={this.handleKeyUp}
                    onKeyDown={this.handleKeyDown}
                    onScroll={this.handleSyncScroll}
                    textEditorOpen={this.context.editorState.editor.inEditorMode}
                    autoCursor={true}
                    options={
                        {
                            autoFocus: true,
                            theme: 'material',
                            lineNumbers: true,
                            mode: 'gfm',
                            lineWrapping: true,
                            /* Drag and drop is disabled for custom drag and drop */
                            dragDrop: false

                        }
                    }
                />

            </>
        )
    }
}

export default CodeMirrorEditor;