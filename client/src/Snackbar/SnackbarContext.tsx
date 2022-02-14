import React, { createContext, useRef, useState } from 'react'

type SnackbarContextType = {

    snackbarState: {

        message: string;

        open: boolean;
        snackbarTimeout: ReturnType<typeof setTimeout> | undefined;
    }
    snackbarFunctions: {
        closeSnackbar: Function;
        openSnackbar: Function;
    }
}

const SnackbarContext = createContext({} as SnackbarContextType);


const SnackbarProvider: React.FC = (props) => {


    const [message, setMessage] = useState('');

    const [open, setOpen] = useState(false);
    const [snackbarTimeout, setSetSnackbarTimeout] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
    const snackbarTimeoutRef = useRef(snackbarTimeout);
    snackbarTimeoutRef.current = snackbarTimeout;

    const closeSnackbar = () => {

        if (snackbarTimeoutRef.current) {

            clearTimeout(snackbarTimeoutRef.current);
        }



        setOpen(false);

    }

    const openSnackbar = (message: string, autoHide: boolean = true) => {


        if (snackbarTimeoutRef.current) {

            clearTimeout(snackbarTimeoutRef.current);
        }


        setMessage(message);
        setOpen(true);

        if (autoHide) {

            let timeout = setTimeout(() => {
                closeSnackbar();
            }, 3000)
            setSetSnackbarTimeout(timeout);

        }

    }


    const snackbarState = { message, snackbarTimeout, open }
    const snackbarFunctions = { closeSnackbar, openSnackbar };

    return (
        <SnackbarContext.Provider value={{ snackbarState, snackbarFunctions }}>
            {props.children}
        </SnackbarContext.Provider>
    )
}

export { SnackbarContext, SnackbarProvider }