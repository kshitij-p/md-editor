import React, { useContext, useEffect } from 'react';
import './reset.css'
import styled from 'styled-components'
import Editor from './Editor/Editor';
import { EditorContext } from './Editor/EditorContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logout from './Auth/Logout';
import { AuthContext } from './Auth/AuthContext';
import Snackbar from './Snackbar/Snackbar';

const AppDiv = styled.div`
 
`

const App: React.FC = () => {

  const { setIsLoggedIn, isLoggedIn } = useContext(AuthContext);

  const { editorFunctions } = useContext(EditorContext);

  /* Check if logged in or not whenever loggedin is set to false (this makes it so when the window is closed and if the login session has expired, the user
    wont still be loggedin) */
  useEffect(() => {

    const updateLoggedIn = async () => {
      if (isLoggedIn) {
        return;
      }

      let request;
      editorFunctions.setSearchResultsLoading(true);
      try {

        request = await fetch('/api/isLogged');

      } catch (e) {
        setIsLoggedIn(false);
        return;
      }

      if (request.status !== 200 || request.redirected === true) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      editorFunctions.setSearchResultsLoading(false);

    }

    updateLoggedIn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const alreadyLoggedRoute = (Target: React.FC) => {
    return !isLoggedIn ? <Target /> : <Navigate to="/" />
  }

  const protectedRoute = (Target: React.FC) => {
    return isLoggedIn ? <Target /> : <Navigate to="/" />
  }

  return (

    <AppDiv>

      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/login" element={alreadyLoggedRoute(Login)} />
        <Route path="/register" element={alreadyLoggedRoute(Register)} />
        <Route path="/logout" element={protectedRoute(Logout)} />
      </Routes>
      <Snackbar />
    </AppDiv>

  );
}

export default App;
