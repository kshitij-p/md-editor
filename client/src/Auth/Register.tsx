import React, { ChangeEvent, EventHandler, FormEvent, useState } from 'react';



const Login: React.FC = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeUsername = (e: React.FormEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    }

    const handleChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    }

    return (
        <>
            <form method='POST' action='/api/register'>

                <input type="text" value={username} onChange={handleChangeUsername} />
                <input type="password" value={password} onChange={handleChangePassword} />
                <button>Register</button>
            </form>
        </>
    );
};

export default Login;
