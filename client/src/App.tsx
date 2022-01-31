import React from 'react';
import './reset.css'
import styled from 'styled-components'
import Editor from './Editor/Editor';
import { EditorContext, EditorContextProvider } from './Editor/EditorContext';

const AppDiv = styled.div`
 
`

const App: React.FC = () => {
  return (
    <AppDiv>
      <EditorContextProvider>

        <Editor />
      </EditorContextProvider>
    </AppDiv>
  );
}

export default App;
