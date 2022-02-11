import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './Auth/AuthContext';
import { EditorContextProvider } from './Editor/EditorContext';

ReactDOM.render(

  <BrowserRouter>
    <React.StrictMode>
      <AuthContextProvider>
        <EditorContextProvider>

          <App />
        </EditorContextProvider>
      </AuthContextProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
