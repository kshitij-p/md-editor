import { marked } from "marked";
import React, { ChangeEvent, ChangeEventHandler, createContext, MouseEventHandler, RefObject, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import defaultMDFile from "../utils/defaultMDFile";
import { defaultCustomTheme, defaultThemes } from "../utils/defaultThemes";
import customRenderer from "../utils/marked/customRenderer";
import { sampleResponse } from "../utils/sampleResponse";
import { EditorColorTheme, EditorPreferencesType, MDFile } from "../utils/types";


type EditorContextState = {
    editor: {
        inEditorMode: boolean;
        editorTextValue: string;
        editorHeight: number;

        editorRef: RefObject<any>;

        editorPaneRef: RefObject<HTMLDivElement>;

        isDraggingSplitter: boolean;
        isDraggingToOpen: boolean;

        currOpenFile: MDFile;
        isUnsaved: boolean;
        notSavedDiagOpen: boolean;

        autoSaveTimeout: ReturnType<typeof setTimeout> | undefined;
        openFileInputRef: RefObject<HTMLInputElement>;

        isLoading: boolean;

        currMenubarOption: number;

        prefsDiagOpen: boolean;
        preferences: EditorPreferencesType
        customTheme: EditorColorTheme;

    },
    renderedView: {
        renderedViewDivRef: RefObject<HTMLDivElement>;
        renderedTextValue: string;
    },
    editorExplorer: {
        files: MDFile[];
        createRenameDiagOpen: boolean;
        editorSearchQuery: string;
        editorSearchResults: MDFile[];
        searchResultsLoading: boolean;
    }
}

type EditorContextType = {
    editorState: EditorContextState;
    editorFunctions: {
        setInEditorMode: Function;
        setEditorTextValue: Function;
        setEditorHeight: Function;

        setRenderedTextValue: Function;
        parseEditorText: Function;

        setIsDraggingSplitter: Function;
        setIsDraggingToOpen: Function;

        setEditorFiles: Function;

        fetchUserFiles: Function;
        createFile: Function;
        renameFile: Function;
        deleteFile: Function;
        overwriteFile: Function;

        setEditorSearchQuery: Function;
        setEditorSearchResults: Function;
        setSearchResultsLoading: Function;

        setCurrOpenFile: Function;
        clearEditorForNewFile: Function;

        createNewEditorFile: Function;
        saveCurrentOpenFile: Function;
        downloadCurrentOpenFile: Function;

        setIsUnsaved: Function;
        setNotSavedDiagOpen: Function;
        closeNotSavedDiag: Function & any;
        setCreateRenameDiagOpen: Function;

        openCloudFile: Function;
        openLocalFile: Function;

        setIsLoading: Function;

        setCurrMenubarOption: Function;
        closeMenubar: Function;
        openMenubarFileMenu: MouseEventHandler<HTMLButtonElement>;
        setPrefsDiagOpen: Function;
        closePrefsDiag: Function;
        openPrefsDiag: Function & MouseEventHandler<HTMLButtonElement>;

        setCustomTheme: Function;
        setSelectedTheme: Function;

        savePreferences: Function;

    },

}

const EditorContext = createContext({} as EditorContextType);


marked.use({ renderer: customRenderer, breaks: true, gfm: true });


const EditorContextProvider: React.FC = (props) => {

    const { isLoggedIn } = useContext(AuthContext);

    const [inEditorMode, setInEditorMode] = useState(false);
    const [editorTextValue, setEditorTextValue] = useState('');
    const editorRef = useRef<any>(null);

    const [renderedTextValue, setRenderedTextValue] = useState('');
    const renderedViewDivRef = useRef<HTMLDivElement>(null)

    const editorPaneRef = useRef<HTMLDivElement>(null);

    const [editorHeight, setEditorHeight] = useState(50);

    const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);
    const [isDraggingToOpen, setIsDraggingToOpen] = useState(false);

    const [editorFiles, setEditorFiles] = useState([]);

    const [editorSearchQuery, setEditorSearchQuery] = useState('');
    const [editorSearchResults, setEditorSearchResults] = useState([]);
    const [searchResultsLoading, setSearchResultsLoading] = useState(false);

    const [currOpenFile, setCurrOpenFile] = useState(defaultMDFile);

    const [isUnsaved, setIsUnsaved] = useState(false);
    const [notSavedDiagOpen, setNotSavedDiagOpen] = useState(false);

    const [createRenameDiagOpen, setCreateRenameDiagOpen] = useState(false);

    const [autoSaveTimeout, setAutoSaveTimeout] = useState(undefined);

    const openFileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [currMenubarOption, setCurrMenubarOption] = useState(-1);

    const [prefsDiagOpen, setPrefsDiagOpen] = useState(false);

    const [customTheme, setCustomTheme] = useState(defaultCustomTheme);

    const [selectedTheme, setSelectedTheme] = useState(0);

    const preferences = {
        selectedTheme: selectedTheme,
        themes: [...defaultThemes, customTheme]
    }

    const parseEditorText = () => {
        let parsed = marked.parse(editorTextValue);
        setRenderedTextValue(parsed);
    }

    const fetchUserFiles = async () => {
        let request = await fetch('/api/files');

        if (request.status === 200 && !request.redirected) {
            let response = await request.json();

            setEditorFiles(response.files);
        }
    }

    const createFile = async (fileName: string) => {

        if (!fileName) {
            return;
        }

        let requestBody = new URLSearchParams();
        requestBody.append('name', fileName);
        requestBody.append('fileData', editorTextValue);

        let request = await fetch('/api/files', { method: "POST", body: requestBody });
        let response = await request.json();

        if (request.status === 200 && !request.redirected && response.createdFile) {

            fetchUserFiles();
            setCurrOpenFile(response.createdFile);
            setIsUnsaved(false);

        }

    }

    const renameFile = async (fileName: string, fileID: string) => {
        if (!fileName || !fileID) {
            return;
        }

        let requestBody = new URLSearchParams();
        requestBody.append('name', fileName);

        let request = await fetch(`/api/files/${fileID}`, { method: "PUT", body: requestBody });
        let response = await request.json();
        if (request.status === 200 && !request.redirected && response.editedFile) {
            fetchUserFiles();
            if (response.editedFile._id === currOpenFile._id) {
                setCurrOpenFile(response.editedFile);
            }
        }
    }

    const deleteFile = async (fileID: string) => {
        if (!fileID) {
            return;
        }

        let request = await fetch(`/api/files/${fileID}`, { method: "DELETE" });

        if (request.status === 200 && !request.redirected) {
            fetchUserFiles();
        }

    }

    const overwriteFile = async (fileID: string) => {
        if (!fileID) {
            return;
        }

        let requestData = new URLSearchParams();
        requestData.append('fileData', editorTextValue);

        let request = await fetch(`/api/files/${fileID}`, { method: "PATCH", body: requestData })


        if (request.status === 200 && !request.redirected) {
            fetchUserFiles();
        }

    }

    const closeNotSavedDiag = () => {
        setNotSavedDiagOpen(false);
    }

    const clearEditorForNewFile = () => {
        setCurrOpenFile(defaultMDFile);
        setEditorTextValue('');
        setIsUnsaved(false);
    }

    const closeMenubar = () => {
        setCurrMenubarOption(-1);
    }

    const openMenubarFileMenu = () => {
        setCurrMenubarOption(0);
    }


    /* To avoid random issues, this time out is cleared whenever saveCurrentOpenFile() runes as well */
    const saveCurrentOpenFile = (autoTriggered = false) => {
        /* To avoid random issues, this time out is cleared whenever saveCurrentOpenFile() runes as well */
        clearTimeout(autoSaveTimeout);
        if (currOpenFile.path && !isUnsaved) {
            /* Provide some visual feedback here */
            return;
        }

        if (isLoggedIn) {

            if (!currOpenFile.path) {

                /* We dont set unsaved to false in here because we only want it to set if the user 
                creates file, if he just escapes the dialog we dont want it to get triggered */
                if (!autoTriggered) {

                    setCreateRenameDiagOpen(true);
                }
            } else {
                overwriteFile(currOpenFile._id);
                setIsUnsaved(false);
            }

        }

    }

    const createNewEditorFile = () => {

        /* If not saved we always want to show not saved dialog  */
        if (isUnsaved) {
            setNotSavedDiagOpen(true);
            return;
        }

        saveCurrentOpenFile();
        clearEditorForNewFile();

    }

    const downloadCurrentOpenFile = () => {
        let link = document.createElement('a');
        link.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(editorTextValue));
        link.setAttribute('download', currOpenFile.name + '.md');

        link.style.display = 'none';
        document.body.appendChild(link);

        link.click();
        link.remove();


    }

    const openCloudFile = async (fileID: string) => {

        if (!fileID) {
            return;
        }

        if (fileID === currOpenFile._id) {
            return;
        }

        if (isUnsaved) {
            setNotSavedDiagOpen(true);
            return;
        }

        setIsLoading(true);

        try {

            let request = await fetch(`/api/files/${fileID}/parse`, { method: "POST" });

            let response = await request.json();

            if (request.status === 200 && !request.redirected && response.requestedFile) {
                setCurrOpenFile(response.requestedFile);
                setEditorTextValue(response.parsedFile.content);
            }
        } catch (e) {
            console.log('error while opening cloud file', e);
        }

        setIsLoading(false);
    }

    const openLocalFile = async (files: FileList) => {

        /* Since this event triggers when file input is emptied we check for this */
        let fileInput = openFileInputRef.current;

        if (!fileInput || !files.length) {
            return;
        }

        let requestData = new FormData();
        requestData.append('file', files[0]);

        setIsLoading(true);

        try {

            let request = await fetch('/api/parsefile', { method: "POST", body: requestData });
            let response = await request.json();

            /* To clean up in case this is being called from file input on change */
            fileInput.value = '';

            if (request.status === 200 && response.parsedFile) {

                clearEditorForNewFile();
                setEditorTextValue(response.parsedFile.content);
            }
        } catch (e) {
            console.log('error while opening local file', e);
        }

        setIsLoading(false);

    }

    const closePrefsDiag = () => {
        setPrefsDiagOpen(false);

    }

    const openPrefsDiag = () => {
        setPrefsDiagOpen(true);
    }

    const savePreferences = async (newPreferences: { newCustomTheme: EditorColorTheme, newSelectedTheme: number }) => {

        let { newCustomTheme, newSelectedTheme } = newPreferences;

        let themes = {
            customTheme: newCustomTheme || customTheme,
            selectedTheme: newSelectedTheme || selectedTheme,
        }

        if (isLoggedIn) {


            let requestData = new URLSearchParams();
            requestData.append('preferences', JSON.stringify(themes));

            let request = await fetch('/api/preferences', { method: "PUT", body: requestData });

            let response = await request.json();

            if (request.status === 200 && !request.redirected) {
                /* Snackbar feedback */
            }
        } else {
            window.localStorage.setItem('preferences', JSON.stringify(themes));

        }
    }

    /* TEMP */
    useEffect(() => {
        let newText = sampleResponse;

        setEditorTextValue(newText);
    }, [])
    /* TEMP */

    /* Get preferences */
    useEffect(() => {

        const fetchPrefs = async () => {

            if (isLoggedIn) {


                let request = await fetch('/api/preferences');

                let response = await request.json();

                let { preferences } = response;

                if (request.status === 200 && !request.redirected && preferences.customTheme) {
                    setCustomTheme(preferences.customTheme);
                    setSelectedTheme(preferences.selectedTheme);
                }

            } else {
                let storageVal = window.localStorage.getItem('preferences');

                if (!storageVal) {
                    return;
                }

                let prefs = JSON.parse(storageVal);
                if (prefs && prefs.customTheme && prefs.selectedTheme) {
                    setCustomTheme(prefs.customTheme);
                    setSelectedTheme(prefs.selectedTheme);
                }
            }
        }

        fetchPrefs();


    }, [isLoggedIn])

    const state: EditorContextState = {
        editor: {
            inEditorMode,
            editorTextValue,
            editorHeight,

            editorRef,
            editorPaneRef,

            isDraggingSplitter,
            isDraggingToOpen,

            currOpenFile,
            isUnsaved,
            notSavedDiagOpen,
            autoSaveTimeout,
            openFileInputRef,

            isLoading,

            currMenubarOption,

            prefsDiagOpen,
            customTheme,
            preferences: preferences
        },
        renderedView: {
            renderedViewDivRef,
            renderedTextValue,
        },
        editorExplorer: {
            files: editorFiles,
            createRenameDiagOpen,
            editorSearchQuery,
            editorSearchResults,
            searchResultsLoading,
        }

    }

    const editorFunctions = {
        setInEditorMode, setEditorTextValue, setEditorHeight, setRenderedTextValue,
        parseEditorText,
        setIsDraggingSplitter, setIsDraggingToOpen,

        setEditorFiles, fetchUserFiles, createFile, renameFile, deleteFile,
        setCurrOpenFile,
        clearEditorForNewFile, createNewEditorFile, saveCurrentOpenFile, downloadCurrentOpenFile,
        setIsUnsaved,
        setNotSavedDiagOpen,
        closeNotSavedDiag,
        setCreateRenameDiagOpen,
        overwriteFile,

        setEditorSearchQuery,
        setEditorSearchResults,
        setSearchResultsLoading,

        setAutoSaveTimeout,
        openCloudFile,
        openLocalFile,

        setIsLoading,

        setCurrMenubarOption,
        closeMenubar,
        openMenubarFileMenu,
        setPrefsDiagOpen,
        closePrefsDiag,
        openPrefsDiag,
        setCustomTheme,
        setSelectedTheme,
        savePreferences,
    };


    return (
        <EditorContext.Provider value={{ editorState: state, editorFunctions }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export { EditorContext, EditorContextProvider }