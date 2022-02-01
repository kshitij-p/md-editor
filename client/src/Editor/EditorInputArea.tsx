import React, { useContext, useEffect, } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import customRenderer from '../utils/marked/customRenderer'
import { EditorContext } from './EditorContext';
import CodeMirrorEditor from './CodeMirrorEditor';


const EditorInputAreaDiv = styled.div`
    width: 100%;
    
    display: flex;
    flex-direction: column;

    .menubar {
        height: 5%;
        background-color: hsla(0, 0%, 90%, 0.2);
    }

    
`

type RenderedTextDivProps = {
    textEditorOpen: boolean;
}


const RenderedTextDiv = styled.div<RenderedTextDivProps>`
    height: 100%;
    width: 100%;

    background-color: hsla(0, 0%, 10%, 0.1);

    font-size: 2em;
    font-weight: 300;

    /* For hide option */
    /* visibility: ${props => !props.textEditorOpen ? 'visible' : 'hidden'};
    opacity: ${props => !props.textEditorOpen ? '1' : '0'};

    display: ${props => !props.textEditorOpen ? 'inline-block' : 'none'}; */

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

    span.rendered-link-wrapper {
        position: relative;
    }
    
    a.rendered-link {
        
        position: relative;

        color: hsl(207, 90%, 64%);
        text-decoration: none;

        :hover + span.rendered-link-tooltip {
            opacity: 1;
            visibility: visible;
        }

        :hover {
            text-decoration: underline;
        }
        
    }

    span.rendered-link-tooltip {
        position: absolute;
            height: 100%;
            width: 100%;
            padding: 0.75em 1.25em;

            top: 75%;
            left: 60%;

            display: flex;
            justify-content: center;
            align-items: center;

            background-color: hsl(0, 0%, 30%);
            border-radius: 5px;
            color: white;
            
            opacity: 0;
            visibility: hidden;


            transition: 0.1s ease-in-out;
            transition-delay: 1s;
        
        :hover {
            opacity: 1;
            visibility: visible;

            
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

    .rendered-checkbox-text {
        display: inline;
    }

    b.rendered-checkbox-text {
        white-space: pre-wrap;
    }

`


const EditorInputArea: React.FC = () => {


    const { editorState, editorFunctions } = useContext(EditorContext);

    const { editor } = editorState;

    const { renderedView } = editorState;

    const openEditorOnClick = () => {
        editorFunctions.setInEditorMode(true);

    }

    useEffect(() => {

        if (editor.inEditorMode) {
            if (editor.editorRef.current && editor.editorRef.current.editor.state.focused === false) {
                editor.editorRef.current.editor.focus();
            }
        } else {
            if (editor.editorRef.current && editor.editorRef.current.editor.state.focused === true) {
                editor.editorRef.current.editor.display.input.blur();
            }
        }

    }, [editor.inEditorMode])

    

    return (
        <EditorInputAreaDiv>
            <div className='menubar'>

            </div>

            

                <CodeMirrorEditor />

                <RenderedTextDiv tabIndex={2} onClick={openEditorOnClick} ref={renderedView.renderedViewDivRef}
                    textEditorOpen={editorState.editor.inEditorMode} >
                </RenderedTextDiv>
           
            




        </EditorInputAreaDiv>
    );
};

export default EditorInputArea;
