import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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

const ExplorerFile = () => {

    const controlButtonRef = useRef<HTMLDivElement>(null);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const onControlClick = () => {
        setMenuOpen(true);
    }

    const handleRenameFile = ()=>{
        console.log('renaming')
    }

    const handleDeleteFile = ()=>{
        console.log('deleting');
    }

    useEffect(()=>{

        const hideOnOutsideClick = (e: MouseEvent & {target: any})=>{
            if(menuRef.current && controlButtonRef.current){
                if(!menuRef.current.contains(e.target) && !controlButtonRef.current.contains(e.target)){

                    setMenuOpen(false);
                }
            }
        }

        document.addEventListener('click', hideOnOutsideClick);

        return function cleanup(){
            document.removeEventListener('click', hideOnOutsideClick);
        }

    }, [menuOpen, menuRef, controlButtonRef])

    return (
        <ExplorerFileDiv>
            <div className="fileicon-container">
                <img src="/fileicon.svg" alt="fileicon" />
            </div>

            <div className="text-container">
                <b className="file-title">Exampledddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</b>
                <b className="file-last-md">Last Modified: 04/04/2022</b>
            </div>

            <div className="control-button" onClick={onControlClick} ref={controlButtonRef}>
                <img src="kebabmenu.svg" alt="filesettings menu" />

            </div>

            <div className="control-menu" style={{opacity: menuOpen ? '1' : '0', visibility: menuOpen ? 'visible' : 'hidden'}}
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

const EditorFileExplorer: React.FC = (props) => {
    return (
        <>
            <EditorFileExplorerDiv>
                <FileList>
                    <ExplorerFile />
                    <ExplorerFile />
                    <ExplorerFile />
                    <ExplorerFile />
                    <ExplorerFile />
                    <ExplorerFile />
                    <ExplorerFile />
                    <ExplorerFile />
                    <ExplorerFile />
                    <ExplorerFile />
                </FileList>
            </EditorFileExplorerDiv>
        </>
    )
}

export default EditorFileExplorer;