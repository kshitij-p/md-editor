import React, { ChangeEvent, PropsWithChildren } from "react";
import { Controlled as CodeMirror, ICodeMirror, IControlledCodeMirror } from "react-codemirror2";


import { EditorContext } from "./EditorContext";
import styled from "styled-components";
import { bracketKeys } from "../utils/helperKeys";
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

            /* Check if a selection is present */
            if (cmInstance.getSelection()) {

                if (bracketKeys.includes(event.key)) {
                    event.preventDefault();

                    let selectedWord = cmInstance.getSelection();

                    cmInstance.replaceSelection(wrapSelectedWord(event.key, selectedWord, true), 'around');
                }
            }

        }
    }

    handleKeyUp = (cmInstance: any, event: KeyboardEvent) => {
        if (this.context.editorState.editor.inEditorMode) {

            /* CHECK FOR SHORTCUTS THAT NEED ALT HELD */
            if (event.altKey) {

                if (event.code === "ArrowUp") {

                    event.preventDefault();
                    event.stopPropagation();

                    let currPos = cmInstance.doc.getCursor();

                    let currLine = currPos.line;
                    let prevLine = currLine - 1;

                    let currLineContent = cmInstance.doc.getLine(currLine);
                    let prevLineContent = cmInstance.doc.getLine(prevLine);

                    /* If shift is also held, duplicate instead of moving */
                    if (event.shiftKey) {

                        cmInstance.doc.replaceRange('\n', { line: prevLine });
                        cmInstance.doc.replaceRange(currLineContent, { line: currLine });

                        cmInstance.doc.setCursor({ line: currLine });
                        return;
                    }

                    cmInstance.doc.replaceRange(currLineContent, { line: prevLine, ch: 0 }, { line: prevLine, ch: prevLineContent.length });
                    cmInstance.doc.replaceRange(prevLineContent, { line: currLine, ch: 0 }, { line: currLine, ch: currLineContent.length });

                    /* We switch to the previous line since thats the position our original line has gone to */
                    cmInstance.doc.setCursor({ line: prevLine });

                } else if (event.code === "ArrowDown") {
                    event.preventDefault();
                    event.stopPropagation();

                    let currPos = cmInstance.doc.getCursor();

                    let currLine = currPos.line;
                    let nextLine = currLine + 1;

                    let currLineContent = cmInstance.doc.getLine(currLine);
                    let nextLineContent = cmInstance.doc.getLine(nextLine);

                    /* If shift is also held, duplicate instead of moving */
                    if (event.shiftKey) {

                        cmInstance.doc.replaceRange('\n', { line: currLine });
                        cmInstance.doc.replaceRange(currLineContent, { line: nextLine });

                    } else {

                        cmInstance.doc.replaceRange(currLineContent, { line: nextLine, ch: 0 }, { line: nextLine, ch: nextLineContent.length });
                        cmInstance.doc.replaceRange(nextLineContent, { line: currLine, ch: 0 }, { line: currLine, ch: currLineContent.length });
                    }

                    /* We switch to the next line since thats the position our original line has gone to */
                    cmInstance.doc.setCursor({ line: nextLine });
                }

            }
            /* CHECK FOR SHORTCUTS THAT NEED ALT HELD */

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