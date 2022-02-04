import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import redirectTo from '../utils/redirectTo';

const Logout = () => {
  
    let navigate = useNavigate();
    
    useEffect(()=>{

        const requestLogout = async()=>{
            let request = await fetch('/api/logout', {method: "POST"});

            console.log(request);


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
