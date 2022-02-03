import React, { ChangeEvent } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";


import { EditorContext } from "./EditorContext";
import styled from "styled-components";
import { bracketKeys } from "../utils/helperKeys";
import wrapSelectedWord from "../utils/wrapSelectedWord";
import "codemirror/lib/codemirror.css";
import './overrides.css';

require('codemirror/theme/material.css');

require('codemirror/mode/xml/xml');


type EditorTextAreaProps = {
    textEditorOpen: boolean;
}
const StyledEditor = styled(CodeMirror) <EditorTextAreaProps>`
    
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


const EditorTextArea = styled.textarea<EditorTextAreaProps>`
    border: none;
        outline: none;
        height: 95%;
        width: 100%;
      

        background-color: hsla(0, 0%, 10%, 0.1);

        font-size: 2em;
        color: white;
        
        visibility: ${props => props.textEditorOpen ? 'visible' : 'hidden'};
        opacity: ${props => props.textEditorOpen ? '1' : '0'};

        display: ${props => props.textEditorOpen ? 'inline-block' : 'none'};

        :focus {
            border: none;
            outline: none;
            box-shadow: none;
        }
    
`

type CodeMirrorEditorProps = {
    instance: any;
}

class CodeMirrorEditor extends React.PureComponent {

    instance: any;

    static contextType = EditorContext;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: CodeMirrorEditorProps) {
        super(props);
    }

    handleBeforeChange = (event: ChangeEvent, data: any, value: string) => {
        this.context.editorFunctions.setEditorTextValue(value);
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

    handleOnDrop = (editor: CodeMirrorEditor, event: DragEvent)=>{
        if(this.context.editorState.inEditorMode === false){

            event.preventDefault();
        }
    }

    render() {
        return (
            <>
                <StyledEditor
                    onBeforeChange={this.handleBeforeChange}
                    value={this.context.editorState.editor.editorTextValue}
                    onBlur={this.handleOnBlur}
                    onFocus={this.handleOnFocus}
                    ref={this.context.editorState.editor.editorRef}
                    onKeyUp={this.handleKeyUp}
                    onKeyDown={this.handleKeyDown}
                    textEditorOpen={this.context.editorState.editor.inEditorMode}
                    autoCursor={true}
                    options={
                        {
                            autoFocus: true,
                            theme: 'material',
                            lineNumbers: true,
                            mode: 'gfm',
                            lineWrapping: true

                        }
                    }
                />

            </>
        )
    }
}

export default CodeMirrorEditor;