import React, { useContext } from 'react'
import styled from 'styled-components'
import { SnackbarContext } from './SnackbarContext'

const SnackbarDiv = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    width: 80%;
    height: max-content;

    max-width: 20em;

    padding: 1rem;

    inset: 90% 0 0 3%;
    
    background-color: hsl(0, 0%, 10%);
    border-radius: 5px;
    color: white;
    font-size: 2em;

    transition: 0.15s ease-in-out;
    z-index: 1041;

    b {

        margin-left: 0.5em;

        text-transform: capitalize;
        text-overflow: ellipsis;
        min-width: 0;
        white-space: pre;
        overflow: hidden;

    }


    button {
        appearance: none;
        border: none;
        outline: none;

        height: max-content;
        margin-right: 0.5em;
        
        padding: 0.25em;
        
        display: flex;
        justify-content: center;
        align-items: center;

        background-color: hsl(0, 0%, 30%);
        border-radius: 50%;

        transition: 0.15s ease-in-out;

        :hover {
            background-color: hsl(0, 0%, 50%);
        }

        img {
            width: 2em;
            height: 2em;
        }

         
    }

`

const Snackbar = () => {

    const { snackbarState, snackbarFunctions } = useContext(SnackbarContext);
    const { open, message } = snackbarState;

    const handleCloseOnClick = () => {
        snackbarFunctions.closeSnackbar();
    }

    return (
        <SnackbarDiv style={{ visibility: `${open ? 'visible' : 'hidden'}`, opacity: `${open ? '1' : '0'}` }}>

            <b>{message}</b>
            <button onClick={handleCloseOnClick}>
                <img src="xmark.svg" alt="" />
            </button>

        </SnackbarDiv>
    )
}

export default Snackbar