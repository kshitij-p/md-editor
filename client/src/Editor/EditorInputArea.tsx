import React, { useContext, useEffect, } from 'react';
import styled from 'styled-components';
import { EditorContext } from './EditorContext';
import CodeMirrorEditor from './CodeMirrorEditor';


const EditorInputAreaDiv = styled.div`
    width: 100%;
    min-height: 100vh;

    display: flex;
    flex-direction: column;

    .menubar {
        height: 1em;
        background-color: hsla(0, 0%, 90%, 0.2);
    }

    .inputarea-wrapper {
        height: 95%;
        width: 100%;

        display: flex;
        /* Change me for different dock mode */
        flex-direction: column;

        flex-grow: 1;

        
        position: relative;
    }
`

type RenderedTextDivProps = {
    textEditorOpen: boolean;
}


const RenderedTextDiv = styled.div<RenderedTextDivProps>`
    width: 100%;

    /* Padding for our splitter */
    padding-top: 5px ; /* Change me when orientatiobn changes */
    
    padding-left: 1em;

    background-color: hsla(0, 0%, 70%, 0.1);

    font-size: 2em;
    font-weight: 300;
    white-space: pre-wrap;

    /* For hide option */
    /* visibility: ${props => !props.textEditorOpen ? 'visible' : 'hidden'};
    opacity: ${props => !props.textEditorOpen ? '1' : '0'};

    display: ${props => !props.textEditorOpen ? 'inline-block' : 'none'}; */

    overflow-y: scroll;
    scrollbar-width: none;

    
    transition: 0.1s;

    ::-webkit-scrollbar {

    }

    p {
        margin: 1em 0;
        font-weight: 200;
    }

    strong {
        font-weight: 500;
    }

    em {
        font-style: italic;
    }

    code {
        background-color: hsl( 0,0%, 30%);
        border-radius: 10px;
        height: max-content;
        padding: 0.25em;
        line-height: 170%;
    }

    .rendered-heading {
        margin: 1.8em 0;
    }

    .rendered-heading-1 {
        font-size: 1.6em;
        font-weight: 700;
    }

    .rendered-heading-2 {
        font-size: 1.5em;
        font-weight: 500;
    }

    .rendered-heading-3 {
        font-size: 1.4em;
        font-weight: 400;
    }

    .rendered-heading-4 {
        font-size: 1.3em;
    }

    .rendered-heading-5 {
        font-size: 1.2em;
    }

    .rendered-heading-6 {
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

        /* For centering */
        top: 0.1em;

        
        display: inline-block;
        
        background-color: var(--bg-color);
        border-radius: 5px;

        box-shadow: var(--bg-boxshadow);

        position: relative;
        
        .tickmark-svg {
            position: absolute;
            inset: 0 0 0 0;
            width: 100%;
        }
    }
     
   

`


const CodeMirrorEditorPane = styled.div`
    /* Temp height */
    position: relative;
    transition: 0.1s;
`


const PaneSplitterDiv = styled.div`
    border: none;
    outline: none;
    position: absolute;

    height: 5px;
    width: 100%;

    
    background-color: hsla(0, 0%, 100%, 0.35);

    box-shadow: 0px 0px 8px hsla(0, 0%, 100%, 0.2);
    backdrop-filter: blur(25px);

    transition: 0.1s;
    z-index: 999999;


    div.pane-splitter-thumb {
        position: absolute;
        content: '';
        left: 50%;

        height: 20px;
        width: 20px;

        margin-top: -8px;
        margin-left: -20px;

        border-radius: 50%;
        background-color: hsla(0, 0%, 100%, 1);
        box-shadow: 0px 0px 8px hsla(0, 0%, 90%, 0.3);
        
        backdrop-filter: blur(25px);

        z-index: 9999;
        cursor: grab;
    }
`

const EditorInputArea: React.FC = () => {


    const { editorState, editorFunctions } = useContext(EditorContext);

    const { editor } = editorState;

    const { renderedView } = editorState;

    const openEditorOnClick = () => {
        editorFunctions.setInEditorMode(true);

    }

    const onSplitterClick = () => {
        editorFunctions.setInEditorMode(false);
    }

    const onSplitterDragStart = (event: any) => {


        let newGhostImg: HTMLDivElement = event.target.parentElement;

        if (!newGhostImg) {
            return
        }


        editorFunctions.setIsDraggingSplitter(true);
        event.dataTransfer.setDragImage(newGhostImg, Math.round(newGhostImg.clientWidth / 2), 0);
    }

    const onSplitterDrag = (event: any) => {
        if (!event.clientY) {
            return;
        }

        let newY = event.clientY;

        let totalEditorHeight = document.querySelector('.inputarea-wrapper')?.clientHeight;

        if (totalEditorHeight) {

            let newHeight = Math.round((newY * 100) / totalEditorHeight);


            if (Math.abs(newHeight - editor.editorHeight) >= 2) {

                editorFunctions.setEditorHeight(newHeight);


            }
        }





    }

    const onSplitterDragEnd = () => {
        editorFunctions.setIsDraggingSplitter(false);
    }

    /* Focus and blur editor whenever inEditorMode changes */
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

    }, [editor.inEditorMode, editor.editorRef])

    /* Parse text i.e. parsed using marked and then setRenderedText to it whenever editorTextValue changes */
    useEffect(() => {
        editorFunctions.parseEditorText();
    }, [editor.editorTextValue])

    /* Append new content to renderedVIew whenever renderedText updates */
    useEffect(() => {

        if (renderedView.renderedViewDivRef.current) {
            renderedView.renderedViewDivRef.current.innerHTML = renderedView.renderedTextValue;
        }

    }, [renderedView.renderedTextValue, renderedView.renderedViewDivRef])

    /* Set max heights to avoid overflows */
    useEffect(() => {

        let editorHeight = document.querySelector('.inputarea-wrapper')?.clientHeight;

        if (editorHeight && editor.editorPaneRef.current && renderedView.renderedViewDivRef.current) {
            let maxHeight = editorHeight * (editor.editorHeight / 100);
            editor.editorPaneRef.current.style.maxHeight = `${maxHeight}px`;

            editor.editorPaneRef.current.style.maxHeight = `${maxHeight}px`;

            renderedView.renderedViewDivRef.current.style.maxHeight = `${editorHeight - maxHeight >= 10 ? editorHeight - maxHeight : 10}px`

        }

    }, [editor.editorPaneRef, editor.editorHeight, renderedView.renderedViewDivRef])


    const onTouchStart = (event: any) => {
        event.preventDefault();
        /*  document.body.style.overflow = 'hidden'; */
        /*   document.body.style.touchAction = 'none'; */
    }

    const onTouchMove = (event: any) => {
        event.preventDefault();
        if (!event.targetTouches.length) {
            return;
        }


        let newY = event.targetTouches[0].clientY;

        let totalEditorHeight = document.querySelector('.inputarea-wrapper')?.clientHeight;

        if (totalEditorHeight) {

            let newHeight = Math.round((newY * 100) / totalEditorHeight);

            if (Math.abs(newHeight - editor.editorHeight) >= 2) {

                editorFunctions.setEditorHeight(newHeight);

            }
        }

    }

    const onTouchEnd = () => {
        /*  document.body.style.overflow = ''; */
        /*  document.body.style.touchAction = ''; */
    }

    return (
        <EditorInputAreaDiv>
            <div className='menubar'>

            </div>

            <div className='inputarea-wrapper'>


                <CodeMirrorEditorPane ref={editor.editorPaneRef}
                    className='CodeMirrorEditorPane' style={{ height: `${editor.editorHeight}%`, cursor: `${editor.isDraggingSplitter ? 'grabbing' : 'auto'}` }}>

                    <CodeMirrorEditor />
                </CodeMirrorEditorPane>

                <PaneSplitterDiv tabIndex={3} draggable={true} className='PaneSplitterDiv'
                    style={{ top: `${editor.editorHeight}%` }}>
                    <div className='pane-splitter-thumb' onDrag={onSplitterDrag} onDragStart={onSplitterDragStart}
                        onDragEnd={onSplitterDragEnd}
                        draggable={true} onClick={onSplitterClick}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}></div>
                </PaneSplitterDiv>

                <RenderedTextDiv tabIndex={2} onClick={openEditorOnClick} ref={renderedView.renderedViewDivRef}
                    textEditorOpen={editorState.editor.inEditorMode} style={{ height: `${(100 - editor.editorHeight) || 50}%`, cursor: `${editor.isDraggingSplitter ? 'grabbing' : 'auto'}` }}
                    className='RenderedTextPane'>
                </RenderedTextDiv>


            </div>



        </EditorInputAreaDiv>
    );
};

export default EditorInputArea;
