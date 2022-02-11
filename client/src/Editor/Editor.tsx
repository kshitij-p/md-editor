import { useContext } from "react";
import styled from "styled-components";
import Loader from "../Loader";
import { EditorContext } from "./EditorContext";
import EditorFileExplorer from "./EditorFileExplorer";

import EditorInputArea from "./EditorInputArea";

const EditorDiv = styled.div`
    min-height: 100vh;
    height: 100%;
    width: 100%;

    display: flex;

    background-color: hsl(0, 0%, 0%);
    color: hsl(0, 0%, 85%);
    
    z-index: 1;
    position: relative;

    > .collapse-btn {
      border: none;
      outline: none;

      position: absolute;
      width: 2em;
      height: 100%;

      top: 0%;
      background-color: transparent;

      img {
        position: absolute;
        width: 3em;

        left: 25%;
        margin-left: -50%;

        opacity: 0.5;
        transition: 0.15s ease-in-out;
      }

      

      :hover, :focus {
        img {
          opacity: 1;
        }
      }

    }
`


const Editor = () => {

  const { editorState, editorFunctions } = useContext(EditorContext);

  const { explorerCollapsed } = editorState.editorExplorer;

  const openExplorer = () => {
    editorFunctions.setExplorerCollapsed(false);
  }

  return (
    <>
      <EditorDiv>

        <Loader loading={editorState.editor.isLoading} />

        <EditorFileExplorer />

        <EditorInputArea />

        <button className="collapse-btn" onClick={openExplorer}
          style={{
            transitionDelay: '0.25s',
            visibility: `${explorerCollapsed ? 'visible' : 'hidden'}`, opacity: `${explorerCollapsed ? '1' : '0'}`
          }}>
          <img src="chevronright.svg" />
        </button>

      </EditorDiv>
    </>
  );
};

export default Editor;
