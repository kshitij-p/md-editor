import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './Auth/AuthContext';
import { EditorContextProvider } from './Editor/EditorContext';
import { SnackbarProvider } from './Snackbar/SnackbarContext';

ReactDOM.render(

  <BrowserRouter>
    <React.StrictMode>
      <AuthContextProvider>
        <SnackbarProvider>
          <EditorContextProvider>

            <App />

          </EditorContextProvider>
        </SnackbarProvider>
      </AuthContextProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
