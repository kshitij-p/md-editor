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
        clearTimeout(this.context.editorState.editor.autoSaveTimeout);

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

                    cmInstance.replaceSelection(wrapSelectedWord(event.key, selectedWord, true));
                }
            }

        }
    }

    handleKeyUp = (cmInstance: CodeMirror, event: KeyboardEvent) => {
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