import React, { useContext, useEffect, } from 'react';
import styled from 'styled-components';
import { EditorContext } from './EditorContext';
import CodeMirrorEditor from './CodeMirrorEditor';
import { AuthContext } from '../Auth/AuthContext';
import NotSavedDiag from './Dialogs/NotSavedDiag';
import PrefsDialog from './Dialogs/PrefsDialog';
import { EditorColorTheme } from '../utils/types';
import { SnackbarContext } from '../Snackbar/SnackbarContext';
import SyntaxDiag from './Dialogs/Help/SyntaxDiag';
import { useNavigate } from 'react-router-dom';


const EditorInputAreaDiv = styled.div<{ explorerCollapsed: boolean }>`
    width: 100%;
    min-height: 100vh;

    padding-left: ${props => props.explorerCollapsed ? '1.75em' : '25%'};

    display: flex;
    flex-direction: column;

    transition: 0.25s ease-in-out;

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

    .menu-container {
        
        min-width: 5em;

        top: 1em;
        left: 1em;

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

            cursor: pointer;

            :hover {
                background-color: hsl(0, 0%, 15%);
            }
        }
        
        
    }
    
    .authorised-only {
        color: ${props => props.isLoggedIn ? '' : 'hsl(0, 0%, 60%)'};

        pointer-events: ${props => props.isLoggedIn ? '' : 'none'};

        :hover {
            background-color: ${props => props.isLoggedIn ? '' : 'hsl(0, 0%, 30%)'};
        }

    }

    .unauthorised-only {
        color: ${props => !props.isLoggedIn ? 'auto' : 'hsl(0, 0%, 60%)'};

        pointer-events: ${props => !props.isLoggedIn ? '' : 'none'};

        :hover {
            background-color: ${props => !props.isLoggedIn ? 'auto' : 'hsl(0, 0%, 30%)'};
        }
        
    }
`

type RenderedTextDivProps = {
    textEditorOpen: boolean;
}


const RenderedTextDiv = styled.div<RenderedTextDivProps>`
    width: 100%;

    /* Padding for our splitter */
    padding-top: 5px ; 
    
    padding-left: 1em;

    background-color: hsl(0, 0%, 5%);

    font-size: 2em;
    font-weight: 300;
    white-space: pre-wrap;

    overflow-y: scroll;
    scrollbar-width: none;

    
    transition: 0.1s;

    ::-webkit-scrollbar {

    }

    > * {
        max-width: 99%;
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
        padding: 0 0.25em;
        line-height: 170%;
    }

    blockquote {

        padding: 0.5em 0.5em;
        padding-right: 0;

        blockquote {

            margin: 1em 0;
        }

        background-color: hsl(0, 0%, 30%);
        border-left: 0.25em solid white;

        display: flex;
        flex-direction: column;
        justify-content: center;

        p {
            margin: 0;
        }
        

    }

    ol, ul {
        margin-left: 1em;
    }

    ol {
        display: flex;
        flex-direction: column;
        list-style: auto;
    }

    ul {

        display: flex;
        flex-direction: column;
      
        list-style: disc;
    }

    li {
        ul, ol {

            /* Compensate for the margin added by li (cant change li's display property or the bullet next to it will be removed) */
            margin-bottom: -1em;
            /* ^ Compensate for the margin added by li (cant change li's display property or the bullet next to it will be removed) ^ */
        }
        ul {
            list-style: circle;
            
        }
    }

    table {
        font-size: 0.75em;
        * {
            border: 1px solid white;
            padding: 0.5em;
        }
    }

    .rendered-heading {
        margin: 1em 0;
    }

    .rendered-heading-1 {
        font-size: 1.6em;
        font-weight: 800;
    }

    .rendered-heading-2 {
        font-size: 1.5em;
        font-weight: 700;
    }

    .rendered-heading-3 {
        font-size: 1.4em;
        font-weight: 600;
    }

    .rendered-heading-4 {
        font-size: 1.3em;
        font-weight: 500;
    }

    .rendered-heading-5 {
        font-size: 1.2em;
        font-weight: 400;
    }

    .rendered-heading-6 {
        font-size: 1.1em;
    }

    span.rendered-link-wrapper {

        position: relative;
        white-space: pre;
        width: max-content;

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
            padding: 0.75em 0.5em;

            top: 75%;
            left: 50%;

            display: flex;
            align-items: center;

            
            background-color: hsl(0, 0%, 30%);
            border-radius: 5px;
            color: white;
            
            opacity: 0;
            visibility: hidden;

            transition: 0.1s ease-in-out;
            transition-delay: 1s;
            
            b {
                text-overflow: ellipsis;
                min-width: 0;
                overflow: hidden;
                width: 20rem;
            }

            :hover {
                opacity: 1;
                visibility: visible;
            }
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

    div.rendered-inline {
        display: inline-block;
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

    .CodeMirror-selected {
        background-color: ${props => props.theme.colors[4].color ? props.theme.colors[4].color : 'auto'} !important;
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
    const { snackbarFunctions } = useContext(SnackbarContext);

    const { editor } = editorState;

    const { renderedView } = editorState;

    const navigate = useNavigate();

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

    const handleFileMenuOnClick = () => {
        if (editor.currMenubarOption === 0) {
            editorFunctions.closeMenubar();
            return;
        }

        editorFunctions.setCurrMenubarOption(0);
    }

    const handleHelpMenuOnClick = () => {
        if (editor.currMenubarOption === 3) {
            editorFunctions.closeMenubar();
            return;
        }

        editorFunctions.setCurrMenubarOption(3);
    }

    const handleSyntaxHelpOnClick = () => {
        editorFunctions.openSyntaxHelpDiag(true);
    }

    const handleAccountOnClick = () => {
        if (editor.currMenubarOption === 2) {
            editorFunctions.closeMenubar();
            return;
        }

        editorFunctions.setCurrMenubarOption(2);
    }

    const handleLoginOnClick = () => {
        if (isLoggedIn) {
            return;
        }
        navigate('/login');
    }

    const handleRegisterOnClick = () => {
        if (isLoggedIn) {
            return;
        }
        navigate('/register');
    }

    const handleLogoutOnClick = () => {
        if (!isLoggedIn) {
            return;
        }
        navigate('/logout');
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

        /* This event also runs when splitter is being dragged around */
        if (editor.isDraggingSplitter) {
            return;
        }

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

        if (!e.dataTransfer.files.length) {
            return;
        }

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

    const syncScroll = (e: React.MouseEvent<HTMLDivElement> | any) => {


        if (!editor.editorRef.current || !renderedView.renderedViewDivRef.current || !editor.preferences.misc.syncScrollingOn) {
            return;
        }

        let targetScrollPos: number;
        let { doc: cmEditor } = editor.editorRef.current.editor;
        let { current: renderedViewDom } = renderedView.renderedViewDivRef;

        let maxEditorScrollHeight = e.height - e.clientHeight;

        targetScrollPos = (cmEditor.scrollTop / maxEditorScrollHeight);
        renderedViewDom.scrollTop = renderedView.renderedViewDivRef.current.scrollHeight * targetScrollPos;
        return;

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

        const resizePanels = () => {

            let editorHeight = document.querySelector('.inputarea-wrapper')?.clientHeight;

            if (editorHeight && editor.editorPaneRef.current && renderedView.renderedViewDivRef.current) {
                let maxHeight = editorHeight * (editor.editorHeight / 100);
                editor.editorPaneRef.current.style.maxHeight = `${maxHeight}px`;

                editor.editorPaneRef.current.style.maxHeight = `${maxHeight}px`;

                renderedView.renderedViewDivRef.current.style.maxHeight = `${editorHeight - maxHeight >= 10 ? editorHeight - maxHeight : 10}px`

            }
        }

        resizePanels();
        window.addEventListener('resize', resizePanels);

        return function cleanup() {
            window.removeEventListener('resize', resizePanels);
        }

    }, [editor.editorPaneRef, editor.editorHeight, renderedView.renderedViewDivRef])

    /* Show warning that reminds of losing progress when prefs or file is unsaved */
    useEffect(() => {

        const saveBeforeUnload = (e: any) => {
            if (editor.isUnsaved || editor.prefsSaveTimeout !== undefined) {
                e.preventDefault();
                e.returnValue = '';
            }

        }

        window.addEventListener('beforeunload', saveBeforeUnload)

        return function cleanup() {
            window.removeEventListener('beforeunload', saveBeforeUnload);
        }

    }, [editor.isUnsaved, editor.prefsSaveTimeout])

    /* Close menubar when clicking outside */
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
        <EditorInputAreaDiv explorerCollapsed={editorState.editorExplorer.explorerCollapsed}>
            <div className='menubar'>
                <FileBar isLoggedIn={isLoggedIn}>
                    <div style={{ display: 'inline-block', position: 'relative' }}>

                        <button onClick={handleFileMenuOnClick} className="MenubarButton MenubarOpener">File</button>

                        <div className='file-menu menu-container'
                            style={{ opacity: `${editor.currMenubarOption === 0 ? '1' : '0'}`, visibility: `${editor.currMenubarOption === 0 ? 'visible' : 'hidden'}` }}>
                            <b onClick={handleOpenClick}>Open Local File</b>
                            <b className='authorised-only' onClick={handleSaveClick}>Save</b>
                            <b onClick={handleOnNewClick}>New</b>
                            <b onClick={handleDownloadClick}>Download File</b>
                        </div>

                    </div>

                    <div style={{ display: 'inline-block', position: 'relative' }}>
                        <button onClick={editorFunctions.openPrefsDiag} className="MenubarButton ">Preferences</button>
                    </div>

                    <div style={{ display: 'inline-block', position: 'relative' }}>

                        <button onClick={handleAccountOnClick} className="MenubarButton MenubarOpener">Account</button>
                        <div className='account-menu menu-container'
                            style={{ opacity: `${editor.currMenubarOption === 2 ? '1' : '0'}`, visibility: `${editor.currMenubarOption === 2 ? 'visible' : 'hidden'}` }}>
                            <b onClick={handleLoginOnClick} className="unauthorised-only">Login</b>
                            <b onClick={handleRegisterOnClick} className="unauthorised-only">Register</b>
                            <b onClick={handleLogoutOnClick} className="authorised-only">Logout</b>
                        </div>
                    </div>

                    <div style={{ display: 'inline-block', position: 'relative' }}>

                        <button onClick={handleHelpMenuOnClick} className="MenubarButton MenubarOpener">Help</button>
                        <div className='help-menu menu-container'
                            style={{ opacity: `${editor.currMenubarOption === 3 ? '1' : '0'}`, visibility: `${editor.currMenubarOption === 3 ? 'visible' : 'hidden'}` }}>
                            <b onClick={handleSyntaxHelpOnClick}>MD Syntax</b>
                        </div>
                    </div>




                </FileBar>
                <CurrFileName saved={editorState.editor.isUnsaved}>
                    {editorState.editor.currOpenFile.name}
                </CurrFileName>
            </div>

            <div className='inputarea-wrapper'>


                <CodeMirrorEditorPane draggable={false}
                    onDragEnter={handleEditorDragEnter}

                    ref={editor.editorPaneRef} theme={editor.preferences.themes[editor.preferences.selectedTheme]}
                    className='CodeMirrorEditorPane' style={{ height: `${editor.editorHeight}%`, cursor: `${editor.isDraggingSplitter ? 'grabbing' : 'auto'}` }}>

                    <EditorDropZone onDragOver={handleEditorDragOver} onDragLeave={handleEditorDragLeave} onDrop={handleEditorDrop}
                        style={{ opacity: `${editor.isDraggingToOpen ? '1' : '0'}`, visibility: `${editor.isDraggingToOpen ? 'visible' : 'hidden'}` }}

                    />

                    <CodeMirrorEditor syncScroll={syncScroll} />
                </CodeMirrorEditorPane>

                <PaneSplitterDiv tabIndex={3} draggable={false} className='PaneSplitterDiv'
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

            <SyntaxDiag show={editor.syntaxHelpDiagOpen} onHide={editorFunctions.closeSyntaxHelpDiag} />

            <input type="file" multiple={false} accept=".md, .txt" className='EditorFileInput' style={{ display: 'none' }} onChange={handleOpenFileInputOnChange} ref={editor.openFileInputRef} />

        </EditorInputAreaDiv>
    );
};

export default EditorInputArea;
