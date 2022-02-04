import React, { ChangeEvent, EventHandler, FormEvent, useState } from 'react';



const Register: React.FC = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeUsername = (e: React.FormEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    }

    const handleChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        if(!password || !username){
            e.preventDefault();
        }
    }

    return (
        <>
            <form method='POST' action='/api/register' onSubmit={handleSubmit}>

                <input type="text" value={username} onChange={handleChangeUsername} name="email" />
                <input type="password" value={password} onChange={handleChangePassword} name="password" />
                <button>Register</button>
            </form>
        </>
    );
};

export default Register;
