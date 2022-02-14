import { createContext, useEffect, useState } from "react"

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: Function;
}

const AuthContext = createContext({} as AuthContextType);

const AuthContextProvider: React.FC = (props) => {


    let check: boolean = sessionStorage.getItem('loggedin') ? true : false;

    const [isLoggedIn, setIsLoggedIn] = useState(check || false);

    useEffect(() => {

        if (isLoggedIn) {

            if (!sessionStorage.getItem('loggedin')) {

                sessionStorage.setItem('loggedin', 'true');
            }

        } else {

            if (sessionStorage.getItem('loggedin')) {

                sessionStorage.removeItem('loggedin');
            }

        }

    }, [isLoggedIn])

    return (
        <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }