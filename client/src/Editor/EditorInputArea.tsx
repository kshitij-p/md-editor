import React, { EventHandler, FormEvent, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import customRenderer from '../utils/marked/customRenderer'
import { EditorContext } from './EditorContext';


const EditorInputAreaDiv = styled.div`
    width: 100%;
    
    display: flex;
    flex-direction: column;
    justify-content: center;

    .menubar {
        height: 5%;
        background-color: hsla(0, 0%, 90%, 0.2);
    }

    
`

type EditorTextAreaProps = {
    textEditorOpen: boolean;
}

type RenderedTextDivProps = {
    textEditorOpen: boolean;
}

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

const RenderedTextDiv = styled.div<RenderedTextDivProps>`
    height: 100%;
    width: 100%;

    background-color: hsla(0, 0%, 10%, 0.1);

    font-size: 2em;
    font-weight: 300;

    visibility: ${props => !props.textEditorOpen ? 'visible' : 'hidden'};
    opacity: ${props => !props.textEditorOpen ? '1' : '0'};

    display: ${props => !props.textEditorOpen ? 'inline-block' : 'none'};

    overflow-y: scroll;
    scrollbar-width: none;

    ::-webkit-scrollbar {
        display: none;
    }

    .rendered-heading-1 {
        font-size: 1.6em;
    }

    h2.rendered-heading-2 {
        font-size: 1.5em;
    }

    h3.rendered-heading-3 {
        font-size: 1.4em;
    }

    h4.rendered-heading-4 {
        font-size: 1.3em;
    }

    h5.rendered-heading-5 {
        font-size: 1.2em;
    }

    h6.rendered-heading-6 {
        font-size: 1.1em;
    }

    a.rendered-link {
        color: hsl(202, 90%, 47%);

        position: relative;

        :before {
            content: attr(data-title);
            
            position: absolute;
            height: 100%;
            width: 100%;
            padding: 0.25em 0.5em;

            top: 50%;
            left: 50%;

            display: flex;
            justify-content: center;
            align-items: center;

            background-color: hsl(0, 0%, 30%);
            border-radius: 5px;
            color: white;
            
            opacity: 0;
            visibility: hidden;


            transition: 0.1s ease-in-out;
        }

        :hover, :focus-within {
            :before {
                opacity: 1;
                visibility: visible;
            }
        }

        
    }

    div.rendered-checkbox {
        
        height: 1em;
        width: 1em;
        display: inline-block;
        
        background-color: var(--bg-color);
        position: relative;
        
        border: var(--bg-border);

        .tickmark-svg {
            position: absolute;
            inset: 0 0 0 0;
            width: 100%;
        }
    }

    b.rendered-checkbox-text {
        white-space: pre-wrap;
    }

`

marked.use({ renderer: customRenderer, sanitize: true });

const EditorInputArea: React.FC = () => {


    const { editorState, editorFunctions } = useContext(EditorContext);

    const { editor } = editorState;
    const { renderedView } = editorState;


    const handleOnChange = (e: FormEvent<HTMLTextAreaElement>) => {
        editorFunctions.setEditorTextValue(e.currentTarget.value);
    }


    const escapeToBlur: EventHandler<React.KeyboardEvent> = (e) => {
        if (e.code === "Escape") {
            if (editor.editorTextAreaRef.current && document.activeElement === editor.editorTextAreaRef.current) {

                editorFunctions.setInEditorMode(false);

            }
        }
    }

    const parseOnBlur = () => {
        if (editor.inEditorMode) {

            editorFunctions.setInEditorMode(false);
        }
        let tokens = marked.lexer(editor.editorTextValue);
        console.log(tokens);


        let parsed = marked.parse(editor.editorTextValue);

        if (renderedView.renderedViewDivRef.current) {

            renderedView.renderedViewDivRef.current.innerHTML = parsed;
        }

    }


    const openEditorOnClick = () => {
        editorFunctions.setInEditorMode(true);

    }

    useEffect(() => {

        if (editor.editorTextAreaRef.current) {

            if (editor.inEditorMode) {

                editor.editorTextAreaRef.current.focus();

            } else {
                editor.editorTextAreaRef.current.blur();
            }
        }

    }, [editor.inEditorMode, editor.editorTextAreaRef])

    useEffect(() => {

        if (renderedView.renderedViewDivRef.current) {
            renderedView.renderedViewDivRef.current.innerHTML = editor.renderedTextValue;
        }

    }, [editor.renderedTextValue])

    console.log(renderedView.renderedViewDivRef.current?.innerHTML);

    return (
        <EditorInputAreaDiv>
            <div className='menubar'>

            </div>


            <EditorTextArea onKeyUp={escapeToBlur} ref={editorState.editor.editorTextAreaRef} value={editor.editorTextValue} onChange={handleOnChange} onBlur={parseOnBlur}
                textEditorOpen={editor.inEditorMode} />

            <RenderedTextDiv tabIndex={2} onClick={openEditorOnClick} ref={renderedView.renderedViewDivRef}
                textEditorOpen={editor.inEditorMode} >
            </RenderedTextDiv>





        </EditorInputAreaDiv>
    );
};

export default EditorInputArea;
