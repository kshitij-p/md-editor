import React, { ChangeEvent } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";


import { EditorContext } from "./EditorContext";
import styled from "styled-components";
import { marked } from "marked";


require("codemirror/lib/codemirror.css");
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
    
    constructor(props: CodeMirrorEditorProps){
        super(props);
    }

    handleBeforeChange = (event: ChangeEvent, data: any, value: string) => {
        this.context.editorFunctions.setEditorTextValue(value);
    }

    onBlur = (cmInstance: CodeMirror, event: InputEvent) => {
        this.context.editorFunctions.setInEditorMode(false);
        
    }

    handleKeyUp = (cmInstance: CodeMirror, event: KeyboardEvent) => {
        if(this.context.editorState.editor.inEditorMode){

            if(event.code === "Escape"){
                this.context.editorFunctions.setInEditorMode(false);
            }
        }
    }

    componentDidUpdate(){

    }

    render() {
        return (
            <>
                <StyledEditor
                    onBeforeChange={this.handleBeforeChange}
                    value={this.context.editorState.editor.editorTextValue}
                    onBlur={this.onBlur}
                    ref={this.context.editorState.editor.editorRef}
                    onKeyUp={this.handleKeyUp}
                    textEditorOpen={this.context.editorState.editor.inEditorMode}
                    autoCursor={true}
                    options={
                        {
                            autoFocus: true,
                            theme: 'material',
                            lineNumbers: true
                        }
                    }
                />

            </>
        )
    }
}

export default CodeMirrorEditor;