import { createContext, useState } from "react"

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: Function;
}

const AuthContext = createContext({} as AuthContextType);

const AuthContextProvider: React.FC = (props)=>{
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    return (
        <AuthContext.Provider value={{isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthContextProvider}