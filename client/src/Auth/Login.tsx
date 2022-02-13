import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { responsiveSizes } from '../utils/responsiveSizes';


const LoginDiv = styled.div`
    width: 100%;
    min-height: 100vh;

    display: flex;
    align-items: center;

    background-image: url('/login/bg-lg.jpg');
    background-size: cover;
    background-position: right;

    @media (max-width: ${responsiveSizes.phone}){
        background-image: url('/login/bg-sm.jpg');        
    }
`

const LoginCard = styled.div`

    width: 90%;
    max-width: 37rem;

    margin-left: 8rem;
    padding: 8.75rem 0;

    background: radial-gradient(139.88% 97.3% at 125.8% 118.07%, rgba(11, 29, 51, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(180deg, rgba(79, 79, 79, 0.85) 1.62%, rgba(112, 112, 112, 0.21) 100%, rgba(11, 14, 19, 0.81) 100%), rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    border-radius: 10px;
    color: white;

    font-size: 1.375em;

    > * {
        margin-left: 3rem;
        margin-bottom: 2rem;
    }

    @media (max-width: ${responsiveSizes.tablet}){
        margin: 0 auto;
        
    }

    @media (max-width: ${responsiveSizes.phone}){
        min-width: 17rem;
        width: 85%;
        
        padding: 5.5rem 0;
        padding: 3.5rem 0;
        box-sizing: content-box;

        > * {
            margin-bottom: 0.95rem;
            margin-left: 1.25rem;
        }
    }

    h1.title-text {
        margin-bottom: 1.5rem;
        
        color: white;

        font-weight: 600;
        font-size: 2.95em;
        line-height: 1.25em;
        text-shadow: -4px 4px 0px rgba(79, 223, 255, 0.25);

        @media (max-width: ${responsiveSizes.phone}){
            margin-bottom: 0.5rem;
            font-size: 1.5em;
        }        
    }

    p.subtitle-text {
        font-size: 1em;
        line-height: 1.2em;

        letter-spacing: 0.15em;

        a {
            color: hsla(166, 78%, 71%, 1);
            text-decoration: none;

            :hover, :focus, :active {
                font-weight: 600;
                font-style: italic;
                text-decoration: italic;
            }
        }

        @media (max-width: ${responsiveSizes.phone}){
            font-size: 0.5em;   
        }
    }

    form {

        > * {
            margin-bottom: 1.35rem;
        }

        .input-wrapper {

            display: flex;
            align-items: center;

            position: relative;

            input {
                border: none;
                outline: none;

                min-height: 2.75em;
                width: 17.5em;
                
                padding-left: 2.25em;

                background: rgba(249, 249, 249, 0.58);
                box-shadow: 0px 0px 9px rgba(254, 254, 254, 0.28);
                border-radius: 10px;
                
                color: #0B0B0B;

                font-size: 1em;
                line-height: 1.25em;

                transition: 0.15s ease-in-out;

                :focus, :active {
                    background: rgba(249, 249, 249, 0.78);
                    box-shadow: 0px 0px 9px rgba(254, 254, 254, 0.28), 0px 0px 24px -8px white;
                }

                @media (max-width: ${responsiveSizes.phone}){
                    width: 11rem;
                    font-size: 0.5em;
                    font-size: 0.65em;

                    padding-left: 2.5em;
                }

            }

            img {
                position: absolute;
                left: 0.55em;
                width: 1.25em;

                @media (max-width: ${responsiveSizes.phone}){
                    width: 0.75em;
                    left: 0.55em;
                }
            }
        }

        button {
            border: none;
            outline: none;
            width: 6.5em;
            min-height: 2.5em;

            background-color: hsla(0, 0%, 0%, 0.59);

            font-size: 1.45em;
            text-transform: uppercase;
            color: white;

            transition: 0.15s ease-in-out;

            cursor: pointer;

            :focus, :hover {
                transform: translateY(-2px);
                background-color: hsl(0, 0%, 80%);
                color: black;
                box-shadow: 0px 2px 16px 0px hsla(0, 0%, 100%, 0.5);
            }

            @media (max-width: ${responsiveSizes.phone}){
                font-size: 0.75em;
                width: 5.75em;
            }

        }
    }

`

const Login: React.FC = (props) => {

    const [username, setUsername] = useState('');
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
        <LoginDiv>

            <LoginCard>
                <h1 className='title-text'>Login</h1>
                <p className='subtitle-text'>Don't have an account? <Link to={'/register'}>Register</Link></p>
                <form method='POST' action='/api/login' onSubmit={handleSubmit}>

                    <div className='input-wrapper'>
                        <input type="text" value={username} onChange={handleChangeUsername} name="email" />
                        <img src="/login/email-lg-icon.svg" alt="" />
                    </div>

                    <div className='input-wrapper'>
                        <input type="password" value={password} onChange={handleChangePassword} name="password" />
                        <img src="/login/lock-lg-icon.svg" alt="" />
                    </div>

                    <button>Login</button>

                </form>

            </LoginCard>

        </LoginDiv>
    );
};

export default Login;
