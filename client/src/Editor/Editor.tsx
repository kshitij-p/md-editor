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
    z-index: 1;
    position: relative;

    color: hsl(0, 0%, 85%);
`



const Editor = () => {

  const { editorState } = useContext(EditorContext);

  return (
    <>
      <EditorDiv>

        <Loader loading={editorState.editor.isLoading} />

        <EditorFileExplorer />

        <EditorInputArea />

      </EditorDiv>
    </>
  );
};

export default Editor;
