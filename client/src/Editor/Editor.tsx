import styled from "styled-components";
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

    color: white;
`



const Editor = () => {
  return (
      <>
    <EditorDiv>
        <EditorFileExplorer />

        <EditorInputArea />

    </EditorDiv>
      </>
  );
};

export default Editor;
