import React from 'react';
import styled from 'styled-components';

type LoaderProps = {
    loading: boolean;
    custom?: string;
}

type LoaderDivProps = {
    custom?: string;
}

const LoaderDiv = styled.div<LoaderDivProps>`
    width: 100%;
    height: 100%;
    
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: black;
    position: absolute;

    z-index: 999;


    div {
        height: 10em;
        width: 10em;

        background-color: transparent;
        border: 25px solid hsl(0, 0%, 40%);
        border-top: 25px solid hsl(0, 0%, 80%);
        border-radius: 50%;

        animation: loader 1s linear infinite;

        @keyframes loader {
            0% {transform: rotate(0deg)}
            100% {transform: rotate(360deg)}
        }
        
    }

    ${props => props.custom ? props.custom : ''};
`

const Loader: React.FC<LoaderProps> = (props) => {
    return (

        <>
            {props.loading ?

                <LoaderDiv custom={props.custom}>
                    <div></div>
                </LoaderDiv>

                : <></>}



        </>
    );
};

export default Loader;
