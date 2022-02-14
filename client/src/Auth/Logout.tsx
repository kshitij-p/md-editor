import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import redirectTo from '../utils/redirectTo';
import { AuthContext } from './AuthContext';

const Logout: React.FC = (props) => {

    let navigate = useNavigate();

    const { setIsLoggedIn } = useContext(AuthContext);

    useEffect(() => {

        const requestLogout = async () => {
            let request = await fetch('/api/logout', { method: "POST" });
            setIsLoggedIn(false);

            navigate(redirectTo(request.url));
        }
        requestLogout()
    }, [])

    return (
        <>
            Logging out
        </>
    );
};

export default Logout;
