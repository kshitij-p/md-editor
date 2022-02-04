import React, { useEffect } from 'react';
import './reset.css'
import styled from 'styled-components'
import Editor from './Editor/Editor';
import { EditorContextProvider } from './Editor/EditorContext';
import { Route, Routes } from 'react-router-dom';
import FileTest from './fileTest';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logout from './Auth/Logout';

const AppDiv = styled.div`
 
`

const App: React.FC = () => {

  
  
  return (
    <EditorContextProvider>
      <AppDiv>

        <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/test" element={<FileTest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        </Routes>

      </AppDiv>
    </EditorContextProvider>
  );
}

export default App;
