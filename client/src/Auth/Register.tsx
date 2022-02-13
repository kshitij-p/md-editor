import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { responsiveSizes } from '../utils/responsiveSizes';

const RegisterDiv = styled.div`
    min-height: 100vh;
    width: 100%;

    

    display: flex;
    align-items: center;
    
    background-image: url('/register/bg-lg.png');
    background-color: hsla(0, 0%, 45%);
    background-blend-mode: overlay;
    background-size: cover;
    background-repeat: no-repeat;

    @media (max-width: 576px) {
        background-image: url('/register/bg-sm.png');
        background-size: cover;
        background-repeat: no-repeat;
    }

        
`

const RegisterCard = styled.div`
    width: 80%;
    max-width: 50rem;
    min-height: 30rem;

    margin-left: 10rem;

    display: flex;
    flex-direction: column;
            

    background: radial-gradient(74% 120% at 8% 90%, hsla(244, 90%, 52%, 0.088) 0%, 
    rgba(0, 0, 0, 0) 100%), radial-gradient(71% 78% at 95% 6%, rgba(50, 243, 231, 0.078) 0%, 
    rgba(0, 0, 0, 0) 100%), linear-gradient(180.72deg, rgba(84, 84, 84, 0.85) -18.09%, rgba(112, 112, 112, 0.21) 108%, rgba(49, 49, 49, 0.35) 108%);
    
    box-shadow: 0px 0px 64px 0px hsl(0, 0%, 0%);
    filter: brightness(1.25);
    backdrop-filter: blur(10px);
    border-radius: 20px;

    color: white;

    @media (max-width: ${responsiveSizes.tablet}) {
        min-height: 20rem;
        width: 90%;

        margin: 0 auto;

        border-radius: 10px;
       
    }

    > * {
        
        margin-left: 4.75rem;

        @media (max-width: ${responsiveSizes.phone}){
            margin-left: 2rem;
        }
    }


    h1.title-text {
        
        margin-top: 2em;
        margin-left: 0.85em;

        font-family: Montserrat;
        font-weight: 600;
        font-size: 4em;

        line-height: 120%;
        text-shadow: -4px 4px 0px rgba(33, 250, 167, 0.25);

        @media (max-width: ${responsiveSizes.phone}){
            font-size: 1.75em;
        }
    }

    p.subtitle {

        margin-top: 1em;
        margin-bottom: 1em;

        font-family: Montserrat;
        font-size: 1.5em;
        line-height: 120%;
        letter-spacing: 0.15em;

        @media (max-width: ${responsiveSizes.phone}){
            font-size: 0.75em;
        }

        .subtitle-link {
            font-family: Montserrat;

            text-decoration: none;

            color: #7DEFD3;

            :hover, :focus, :active {
                font-weight: 600;
                font-style: italic;
                text-decoration: italic;
            }
        }

    }

    form {
        display: flex;
        flex-direction: column;

        gap: 2em;

        @media (max-width: ${responsiveSizes.phone}){
            
            gap: 0;
            
            > * {
                margin-bottom: 1.75em;
            }

            > *:last-of-type {
                margin-bottom: 1em;
            }
        }

        div.input-wrapper {
            position: relative;

            display: flex;
            align-items: center;

            img {

                position: absolute;
                left: 1em;

                @media (max-width: ${responsiveSizes.phone}){
                    width: 1em;

                    left: 0.75em;
                }
            }
            
        }

        input {

            border: none;
            outline: none;

            width: 70%;
            max-width: 15em;
            min-height: 2.25em;

            padding-left: 2em;

            background: rgba(249, 249, 249, 0.58);
            background: rgba(249, 249, 249, 0.58);
            box-shadow: 0px 0px 9px rgba(254, 254, 254, 0.28);
            border-radius: 10px;
            
            font-size: 1.75em;

            transition: 0.15s ease-in-out;

            
            :focus, :active {
                background: rgba(249, 249, 249, 0.78);
                box-shadow: 0px 0px 9px rgba(254, 254, 254, 0.28), 0px 0px 24px -8px white;
            }

            @media (max-width: ${responsiveSizes.phone}){
                font-size: 0.875em;
                padding-left: 2.5em;
            }
        }

        button {
            border: none;
            outline: none;

            width: 50%;
            max-width: 7.5em;
            min-height: 2.15em;

            margin-bottom: 2em;
            padding: 0;

            background: rgba(0, 0, 0, 0.59);
            border-radius: 5px;
            color: white;

            font-size: 2.25em;

            transition: 0.15s ease-in-out;
            cursor: pointer;

            :focus, :hover {
                transform: translateY(-2px);
                background-color: hsl(0, 0%, 80%);
                color: black;
                box-shadow: 0px 2px 16px 0px hsla(0, 0%, 100%, 0.5);
            }

            @media (max-width: ${responsiveSizes.phone}){
                font-size: 1.25em;
            }

        }
        

    }

    
    
`

const Register: React.FC = (props) => {

    const [username, setUsername] = useState('ee');
    const [password, setPassword] = useState('');

    const handleChangeUsername = (e: React.FormEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    }

    const handleChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!password || !username) {
            e.preventDefault();
        }
    }

    return (
        <RegisterDiv>
            <RegisterCard>

                <h1 className='title-text'>Create an account</h1>
                <p className='subtitle'>Already registered? <Link className='subtitle-link' to={'/login'}>Login</Link></p>
                <form method='POST' action='/api/register' onSubmit={handleSubmit}>

                    <div className='input-wrapper'>
                        <input type="text" value={username} onChange={handleChangeUsername} name="email" />
                        <img src='/register/email-icon-lg.svg' alt='' />
                    </div>

                    <div className='input-wrapper'>

                        <input type="password" value={password} onChange={handleChangePassword} name="password" />
                        <img src='/register/lock-icon-lg.svg' alt='' />
                    </div>
                    <button>Register</button>

                </form>

            </RegisterCard>
        </RegisterDiv>
    );
};

export default Register;
