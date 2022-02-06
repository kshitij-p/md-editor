import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../Auth/AuthContext";
import { MDFile } from "../utils/types";
import CreateRenameDiag from "./Dialogs/CreateRenameDiag";
import DeleteDiag from "./Dialogs/DeleteDiag";
import { EditorContext } from "./EditorContext";

const EditorFileExplorerDiv = styled.div`
    width: 30%;

    min-width: 20em;

    height: 100vh;
    
    padding: 4.5em 1em;
    background: radial-gradient(28.5% 21.44% at 40.53% 25.05%, rgba(62, 248, 204, 0.048) 0%, rgba(126, 246, 217, 0) 100%), radial-gradient(66.14% 66.14% at 92.9% 112.43%, rgba(255, 188, 57, 0.17) 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(62.5% 36.37% at 40.34% 62.19%, rgba(249, 0, 62, 0.132) 0%, rgba(203, 11, 11, 0) 100%), radial-gradient(67.42% 36.2% at 88.54% 22.93%, rgba(0, 190, 238, 0.156) 0%, rgba(31, 89, 103, 0) 100%), linear-gradient(180deg, rgba(8, 8, 8, 0.3) 0%, rgba(26, 26, 26, 0.1) 100%);
   
    overflow-y: scroll;
    
    ::-webkit-scrollbar {
        display: none;
    }

    z-index: 999;

    box-shadow: 0px 0px 24px hsla(0, 0%, 0%, 0.5);

    position: relative;

    
`

const ExplorerFileDiv = styled.div`


    height: 10em;
    width: 100%;

    display: flex;
    align-items: center;


    background: rgba(0, 0, 0, 0.59);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 0px 2px rgba(255, 255, 255, 0.2);
    border-radius: 10px;

    position: relative;
    
    > * {
        margin-left: 20px;
    }

    .text-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
       
        overflow: hidden;

        .file-title {
            margin-bottom: 0.25em;

            font-size: 36px;
            font-weight: 700;
            
            width: 90%;

            display: inline-block;
            text-overflow: ellipsis;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
        }

        .file-last-md {
            font-size: 18px;
            font-weight: 200;
        }

        

    }

    :hover {
        .control-button {
            opacity: 0.5;
        }
    }

    .control-button {
            position: absolute;

            margin-top: 1em;
            margin-left: -1em;
            left: 98%;

            align-self: flex-start;
            
            opacity: 0;
            z-index: 999;

            transition: 0.15s ease-in-out;
            cursor: pointer;

            :hover {
                opacity: 1;
            }
        }
        
    
    .control-menu {
        position: absolute;

        margin-left: calc(-1em + -200px);
        margin-top: 1em;
        left: 98%;

        width: 12em;
        height: 86px;

        align-self: flex-start;

        display: flex;
        flex-direction: column;

        background: radial-gradient(39% 210.92% at 91.5% 88.37%, rgba(118, 129, 226, 0.12) 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(60% 324.5% at 8.5% 26.16%, rgba(255, 36, 76, 0.03) 0%, rgba(41, 212, 171, 0) 100%), rgba(0, 0, 0, 0.75);
        border-radius: 5px;

        
        box-shadow: 0px 4px 5px hsla(0, 0%, 0%, 0.5);

        div.option {
            width: 100%;
            height: 50%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(20px);

            border-radius: 5px 5px 0px 0px;
            display: flex;
            align-items: center;
            justify-content: center;

            cursor: pointer;

            :hover {
                background: rgba(129, 129, 129, 0.25);
            backdrop-filter: blur(20px);
            }

            b {
                text-align: center;
                font-weight: 300;

                color: hsl(0, 0%, 80%);
            }

            
        }
    }

`

type ExplorerFileProps = {
    file: MDFile;
    setCreateRenameDiagOpen: Function;
    setIsRenaming: Function;
    setEditingFile: Function;
    openDeleteDiag: Function;
}

const ExplorerFile: React.FC<ExplorerFileProps> = (props) => {

    const { name, lastModified, author, path, _id: id } = props.file;

    const controlButtonRef = useRef<HTMLDivElement>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const getLastModifiedDate = () => {
        let currDate = new Date(lastModified);
        return `${currDate.getDate()}/${currDate.getMonth() + 1}/${currDate.getFullYear()}`
    }

    const onControlClick = () => {
        setMenuOpen(true);
    }

    const handleRenameFile = () => {
        setMenuOpen(false);
        props.setEditingFile(id);
        props.setIsRenaming(true);
        props.setCreateRenameDiagOpen(true);
    }

    const handleDeleteFile = () => {
        setMenuOpen(false);
        props.setEditingFile(id);
        props.openDeleteDiag(true);
    }

    useEffect(() => {

        const hideOnOutsideClick = (e: MouseEvent & { target: any }) => {
            if (menuRef.current && controlButtonRef.current) {
                if (!menuRef.current.contains(e.target) && !controlButtonRef.current.contains(e.target)) {

                    setMenuOpen(false);
                }
            }
        }

        document.addEventListener('click', hideOnOutsideClick);

        return function cleanup() {
            document.removeEventListener('click', hideOnOutsideClick);
        }

    }, [menuOpen, menuRef, controlButtonRef])

    return (
        <ExplorerFileDiv>
            <div className="fileicon-container">
                <img src="/fileicon.svg" alt="fileicon" />
            </div>

            <div className="text-container">
                <b className="file-title">{name}</b>
                <b className="file-last-md">{`Last Modified: ${getLastModifiedDate()}`}</b>
            </div>

            <div className="control-button" onClick={onControlClick} ref={controlButtonRef}>
                <img src="kebabmenu.svg" alt="filesettings menu" />

            </div>

            <div className="control-menu" style={{ opacity: menuOpen ? '1' : '0', visibility: menuOpen ? 'visible' : 'hidden' }}
                ref={menuRef}>
                <div className="option" onClick={handleRenameFile}>
                    <b>Rename File</b>

                </div>
                <div className="option" onClick={handleDeleteFile}>
                    <b>Delete File</b>

                </div>
            </div>

        </ExplorerFileDiv>
    )
}

const FileList = styled.div`
    

    margin: 0 auto;

    width: 100%;
    min-height: 100%;

    > * {
        margin-top: 1.75em;
    }

    > *:first-of-type {
        margin: 0;
    }
   
`

const ExplorerControlsDiv = styled.div`
    
    
    
    margin-bottom: 1.25em;
    
    display: flex;


    .search-bar  {
        
        width: 80%;
        padding: 0.25em 1em;
        margin-left: 1em;

        background: rgba(138, 138, 138, 0.3);
        border-radius: 500px;

        display: flex;
        align-items: center;

        box-shadow: 0px 0px 14px 0px hsla(0, 0%, 0%);

        img {
            width: 1.25em;
        }

        input {

            outline: none;
            border: none;

            width: 100%;
            padding-left: 0.45em;

            background-color: transparent;

            color: hsl(0, 0%, 80%);

            font-size: 24px;
        }
    }

    .add-btn {
        border: none;
        outline: none;
        margin-left: auto;

        background-color: transparent;
        opacity: 0.5;

        
        transition: 0.15s ease-in-out;
        cursor: pointer;

        :hover, :focus {
            opacity: 1;
        }
    }
    
`

const EditorFileExplorer: React.FC = (props) => {

    const { isLoggedIn } = useContext(AuthContext);

    const { editorFunctions, editorState } = useContext(EditorContext);
    const { files } = editorState.editorExplorer;

    const { createRenameDiagOpen } = editorState.editorExplorer;
    const { setCreateRenameDiagOpen } = editorFunctions;

    const [isRenaming, setIsRenaming] = useState(false);


    const [editingFile, setEditingFile] = useState('');

    const [deleteDiagOpen, setDeleteDiagOpen] = useState(false);

    const closeCreateRenameDiag = () => {
        setCreateRenameDiagOpen(false);

        if (editingFile) {

            setEditingFile('');
        }

        if (isRenaming) {

            setIsRenaming(false);
        }
    }

    const openCreateRenameDiag = () => {
        setCreateRenameDiagOpen(true);

    }

    const closeDeleteDiag = () => {
        setDeleteDiagOpen(false);
        setEditingFile('');
    }

    const openDeleteDiag = () => {
        setDeleteDiagOpen(true);
    }

    const handleAddOnClick = () => {
        if (isLoggedIn) {

            openCreateRenameDiag();

            if (isRenaming) {

                setIsRenaming(false);
            }
        }
    }

    useEffect(() => {

        if (isLoggedIn) {

            editorFunctions.fetchUserFiles();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        if (isLoggedIn) {
            editorFunctions.fetchUserFiles();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn])

    return (
        <>
            <EditorFileExplorerDiv>

                <ExplorerControlsDiv>

                    <div className="search-bar">
                        <img src="searchicon.svg" alt="" />
                        <input type="text" />
                    </div>

                    <button className="add-btn" aria-label="Create new document button" onClick={handleAddOnClick}>
                        <img src="plusicon.svg" alt="plus icon" />
                    </button>

                </ExplorerControlsDiv>

                <FileList>
                    {files.map((x, index) => <ExplorerFile key={index} file={x}
                        setCreateRenameDiagOpen={setCreateRenameDiagOpen} setIsRenaming={setIsRenaming}
                        setEditingFile={setEditingFile} openDeleteDiag={openDeleteDiag} />)}
                </FileList>

                <CreateRenameDiag renaming={isRenaming} editingID={editingFile} show={createRenameDiagOpen} onHide={closeCreateRenameDiag} />

                <DeleteDiag show={deleteDiagOpen} onHide={closeDeleteDiag} editingID={editingFile} setEditingID={setEditingFile} />

            </EditorFileExplorerDiv>
        </>
    )
}

export default EditorFileExplorer;