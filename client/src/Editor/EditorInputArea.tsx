import React, { useContext, useEffect, } from 'react';
import styled from 'styled-components';
import { EditorContext } from './EditorContext';
import CodeMirrorEditor from './CodeMirrorEditor';
import { AuthContext } from '../Auth/AuthContext';
import NotSavedDiag from './Dialogs/NotSavedDiag';
import PrefsDialog from './Dialogs/PrefsDialog';
import { EditorColorTheme } from '../utils/types';


const EditorInputAreaDiv = styled.div`
    width: 100%;
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    
    .menubar {
        min-height: 2em;

        display: flex;
        align-items: center;

        background-color: hsla(0, 0%, 90%, 0.2);

        position: relative;

        > b {
            margin-right: auto;
            font-weight: 700;
        }

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

type CurrFileNameProps = {
    saved: boolean;
}

const CurrFileName = styled.b<CurrFileNameProps>`
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -0.25em;

    ::after {
        content: '';

        height: 0.75em;
        width: 0.75em;

        margin-left: 0.25em;
        top: 50%;
        margin-top: -0.4em;

        background-color: white;
        border-radius: 50%;
        z-index: 999;
        position: absolute;

        display: ${props => props.saved ? 'inline-block' : 'none'};

    }
`

type FileBarProps = {
    isLoggedIn: boolean;
}

const FileBar = styled.div<FileBarProps>`
    
    margin-left: 1em;
    margin-right: auto;
    font-weight: 600;

            
    position: relative;

    button.MenubarButton {
        border: none;
        outline: none;

        background-color: transparent;

        font-size: 1em;
        color: white;
        letter-spacing: 0.05em;
            :hover {
                background-color: hsl(0, 0%, 45%);
            }
    }

    .file-menu {
        
        min-width: 5em;

        top: 0;
        left: 50%;

        display: flex;
        flex-direction: column;
        align-items: center;

        background-color: hsl(0, 0%, 30%);
        border-radius: 2px;
        
        
        opacity: 1;
        visibility: visible;
        
        z-index: 9999;
        position: absolute;
        
        b {
            width: 100%;
            padding: 0.5em 2em;
            
            box-sizing: border-box;

            white-space: pre;
            font-size: 1.25em;
            
            background-color: hsl(0, 0%, 30%);
            :hover {
                background-color: hsl(0, 0%, 15%);
            }
        }

        
        b.save-btn {
            color: ${props => props.isLoggedIn ? 'auto' : 'hsl(0, 0%, 60%)'};

            :hover {
                background-color: ${props => props.isLoggedIn ? 'auto' : 'hsl(0, 0%, 30%)'};
            }
        }
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

type CodeMirrorEditorPaneProps = {
    theme: EditorColorTheme
}

const CodeMirrorEditorPane = styled.div<CodeMirrorEditorPaneProps>`
    /* Temp height */
    position: relative;
    transition: 0.1s;

    position: relative;

    .visible {
        visibility: visible;
    }

    .CodeMirror {
        background-color: ${props => props.theme.colors[0].color ? props.theme.colors[0].color : 'auto'};
        color: ${props => props.theme.colors[1].color ? props.theme.colors[1].color : 'auto'};
    }

    .CodeMirror-gutter {
        background-color: ${props => props.theme.colors[2].color ? props.theme.colors[2].color : 'auto'};
        color: ${props => props.theme.colors[3].color ? props.theme.colors[3].color : 'auto'};
    }
`

const EditorDropZone = styled.div`
    
    
    position: absolute;
    height: 100%;
    width: 100%;
    
    background-color: hsla(0, 0%, 0%, 0.5);
    box-shadow: inset 0px 0px 100px 1px hsl(235, 50%, 10%);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 10em;
    font-weight: 200;
    

    backdrop-filter: blur(10px);
    

    z-index: 1;
    visibility: hidden;
        
    :before {
            
        content: 'Drop here';
        text-shadow: -2px 0px 2px red;

        animation: shake 4s linear infinite;
        animation-direction: alternate-reverse;
        position: absolute;
        
    }

    :after {
            content: 'Drop here';
            text-shadow:  2px 0px 2px cyan;

            animation: shake 4s linear infintie;
            animation-direction: alternate;
        }

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

    const { isLoggedIn } = useContext(AuthContext);
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

    const handleOnNewClick = () => {
        editorFunctions.createNewEditorFile();
    }

    const handleDownloadClick = () => {
        editorFunctions.downloadCurrentOpenFile();
    }

    const handleSaveClick = () => {
        editorFunctions.saveCurrentOpenFile();
    }

    const handleOpenClick = () => {
        if (!editor.openFileInputRef.current) {
            return;
        }

        if (editor.isUnsaved) {
            editorFunctions.setNotSavedDiagOpen(true);
            return;
        }

        editor.openFileInputRef.current.click();


    }

    const handleOpenFileInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /* To avoid processing empty event */
        if (!e.currentTarget.files?.length) {
            return;
        }

        editorFunctions.openLocalFile(e.currentTarget.files);
    }

    /* Used to prevent default behavior and also set context value */
    const handleEditorDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        editorFunctions.setIsDraggingToOpen(true);
    }

    const handleEditorDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleEditorDragLeave = () => {
        editorFunctions.setIsDraggingToOpen(false);
    }

    const handleEditorDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        /* Is called early to prevent it from blocking the screen in case of validation failures */
        editorFunctions.setIsDraggingToOpen(false);

        if (editor.isUnsaved) {
            editorFunctions.setNotSavedDiagOpen(true);
            return;
        }

        let files = e.dataTransfer.files;

        /* Validate files */
        if (files.length > 1) {
            return;
        }

        let extension = files[0].name.split('.').pop();

        if (extension === 'txt' || extension === 'md') {

            editorFunctions.openLocalFile(files);
        }



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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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


    useEffect(() => {

        const saveBeforeUnload = (e: any) => {
            if (editor.isUnsaved) {

                let dialogText = 'Save changes before leaving or wait 1-2 seconds for autosave to save them';
                e.returnValue = dialogText;
                return dialogText;
            }

        }

        window.addEventListener('beforeunload', saveBeforeUnload)

        return function cleanup() {
            window.removeEventListener('beforeunload', saveBeforeUnload);
        }

    }, [editor.isUnsaved])

    useEffect(() => {

        const closeOnOutsideClick = (e: any) => {
            if (!e.target.classList.contains('MenubarOpener')) {
                editorFunctions.closeMenubar();
            }
        }

        if (editor.currMenubarOption >= 0) {
            document.addEventListener('click', closeOnOutsideClick);
        }

        return function cleaup() {
            document.removeEventListener('click', closeOnOutsideClick);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor.currMenubarOption])


    return (
        <EditorInputAreaDiv>
            <div className='menubar'>
                <FileBar isLoggedIn={isLoggedIn}>
                    <button onClick={editorFunctions.openMenubarFileMenu} className="MenubarButton MenubarOpener">File</button>
                    <button onClick={editorFunctions.openPrefsDiag} className="MenubarButton ">Preferences</button>

                    <div className='file-menu'
                        style={{ opacity: `${editor.currMenubarOption === 0 ? '1' : '0'}`, visibility: `${editor.currMenubarOption === 0 ? 'visible' : 'hidden'}` }}>
                        <b onClick={handleOpenClick}>Open Local File</b>
                        <b className='save-btn' onClick={handleSaveClick}>Save</b>
                        <b onClick={handleOnNewClick}>New</b>
                        <b onClick={handleDownloadClick}>Download File</b>
                    </div>


                </FileBar>
                <CurrFileName saved={editorState.editor.isUnsaved}>
                    {editorState.editor.currOpenFile.name}
                </CurrFileName>
            </div>

            <div className='inputarea-wrapper'>


                <CodeMirrorEditorPane draggable={true}
                    onDragEnter={handleEditorDragEnter}

                    ref={editor.editorPaneRef} theme={editor.preferences.themes[editor.preferences.selectedTheme]}
                    className='CodeMirrorEditorPane' style={{ height: `${editor.editorHeight}%`, cursor: `${editor.isDraggingSplitter ? 'grabbing' : 'auto'}` }}>

                    <EditorDropZone onDragOver={handleEditorDragOver} onDragLeave={handleEditorDragLeave} onDrop={handleEditorDrop}
                        style={{ opacity: `${editor.isDraggingToOpen ? '1' : '0'}`, visibility: `${editor.isDraggingToOpen ? 'visible' : 'hidden'}` }}

                    />

                    <CodeMirrorEditor />
                </CodeMirrorEditorPane>

                <PaneSplitterDiv tabIndex={3} draggable={true} className='PaneSplitterDiv'
                    style={{ top: `${editor.editorHeight}%`, display: `${editor.isLoading ? 'none' : 'block'}` }}>
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

            <NotSavedDiag show={editor.notSavedDiagOpen} onHide={editorFunctions.closeNotSavedDiag} />

            <PrefsDialog show={editor.prefsDiagOpen} onHide={editorFunctions.closePrefsDiag} />

            <input type="file" multiple={false} accept=".md, .txt" className='EditorFileInput' style={{ display: 'none' }} onChange={handleOpenFileInputOnChange} ref={editor.openFileInputRef} />

        </EditorInputAreaDiv>
    );
};

export default EditorInputArea;
