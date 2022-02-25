import DOMPurify from "dompurify";
import { marked } from "marked";
import React, { ChangeEvent, ChangeEventHandler, createContext, MouseEventHandler, RefObject, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import { SnackbarContext } from "../Snackbar/SnackbarContext";
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

        autoSaveTimeoutRef: RefObject<ReturnType<typeof setTimeout> | undefined>;
        openFileInputRef: RefObject<HTMLInputElement>;

        isLoading: boolean;

        currMenubarOption: number;

        prefsDiagOpen: boolean;
        prefsSaveTimeout: ReturnType<typeof setTimeout> & number | undefined;
        prefsSaveTimeoutRef: RefObject<ReturnType<typeof setTimeout> & number | undefined>;

        preferences: EditorPreferencesType
        customTheme: EditorColorTheme;

        syntaxHelpDiagOpen: boolean;

    },
    renderedView: {
        renderedViewDivRef: RefObject<HTMLDivElement>;
        renderedTextValue: string;
    },
    editorExplorer: {
        explorerCollapsed: boolean;

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

        setExplorerCollapsed: Function;
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
        setPrefsDiagOpen: Function;
        closePrefsDiag: Function & (() => void);
        openPrefsDiag: Function & MouseEventHandler<HTMLButtonElement>;

        setPrefsSaveTimeout: Function;

        setCustomTheme: Function;
        setSelectedTheme: Function;

        setSyncScrollingOn: Function

        savePreferences: Function;
        resetPreferences: Function;

        closeSyntaxHelpDiag: Function & (() => void);
        openSyntaxHelpDiag: Function;

    },

}

const EditorContext = createContext({} as EditorContextType);


marked.use({ renderer: customRenderer, breaks: true, gfm: true });


const EditorContextProvider: React.FC = (props) => {

    const { isLoggedIn } = useContext(AuthContext);
    const { snackbarFunctions } = useContext(SnackbarContext);

    const [inEditorMode, setInEditorMode] = useState(false);
    const [editorTextValue, setEditorTextValue] = useState('');
    const editorRef = useRef<any>(null);

    const [renderedTextValue, setRenderedTextValue] = useState('');
    const renderedViewDivRef = useRef<HTMLDivElement>(null)

    const editorPaneRef = useRef<HTMLDivElement>(null);

    const [editorHeight, setEditorHeight] = useState(50);

    const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);
    const [isDraggingToOpen, setIsDraggingToOpen] = useState(false);

    const [explorerCollapsed, setExplorerCollapsed] = useState(false);
    const [editorFiles, setEditorFiles] = useState([]);

    const [editorSearchQuery, setEditorSearchQuery] = useState('');
    const [editorSearchResults, setEditorSearchResults] = useState([]);
    const [searchResultsLoading, setSearchResultsLoading] = useState(false);

    const [currOpenFile, setCurrOpenFile] = useState(defaultMDFile);

    const [isUnsaved, setIsUnsaved] = useState(false);
    const [notSavedDiagOpen, setNotSavedDiagOpen] = useState(false);

    const [createRenameDiagOpen, setCreateRenameDiagOpen] = useState(false);

    const [autoSaveTimeout, setAutoSaveTimeout] = useState(undefined);
    const autoSaveTimeoutRef = useRef(autoSaveTimeout);
    autoSaveTimeoutRef.current = autoSaveTimeout;

    const openFileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [currMenubarOption, setCurrMenubarOption] = useState(-1);

    const [prefsDiagOpen, setPrefsDiagOpen] = useState(false);

    const [prefsSaveTimeout, setPrefsSaveTimeout] = useState(undefined);
    const prefsSaveTimeoutRef = useRef(prefsSaveTimeout);
    prefsSaveTimeoutRef.current = prefsSaveTimeout;

    const [customTheme, setCustomTheme] = useState(defaultCustomTheme);
    const [selectedTheme, setSelectedTheme] = useState(0);

    const [syncScrollingOn, setSyncScrollingOn] = useState(false);

    const [syntaxHelpDiagOpen, setSyntaxHelpDiagOpen] = useState(false);

    const preferences = {
        selectedTheme: selectedTheme,
        themes: [...defaultThemes, customTheme],
        misc: {

            syncScrollingOn: syncScrollingOn,
        }
    }

    const parseEditorText = () => {
        let parsed = DOMPurify.sanitize(marked.parse(editorTextValue));
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

            snackbarFunctions.openSnackbar('Created file');

        } else if (response.message === 'No duplicate file names allowed') {

            snackbarFunctions.openSnackbar('No duplicate names allowed')

        } else {
            snackbarFunctions.openSnackbar('Failed to create')
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

            /* Update current open file if its the one being edited */
            if (response.editedFile._id === currOpenFile._id) {
                setCurrOpenFile(response.editedFile);
                snackbarFunctions.openSnackbar('Renamed file');
            }

        } else if (response.message === "No duplicate file names allowed") {
            snackbarFunctions.openSnackbar('No duplicate file names allowed')
        } else {
            snackbarFunctions.openSnackbar('Failed to rename')
        }

    }

    const deleteFile = async (fileID: string) => {
        if (!fileID) {
            return;
        }

        let request = await fetch(`/api/files/${fileID}`, { method: "DELETE" });

        if (request.status === 200 && !request.redirected) {
            fetchUserFiles();
            snackbarFunctions.openSnackbar('Deleted file');
        } else {
            snackbarFunctions.openSnackbar('Failed to delete');
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


    /* To avoid random issues, this time out is cleared whenever saveCurrentOpenFile() runes as well */
    const saveCurrentOpenFile = (autoTriggered = false) => {
        /* To avoid random issues, this time out is cleared whenever saveCurrentOpenFile() runes as well */
        clearTimeout(autoSaveTimeoutRef.current);
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

        if (editorRef.current && editorRef.current.editor) {
            editorRef.current.editor.doc.markClean();
        }
    }

    const createNewEditorFile = () => {

        /* If not saved we always want to show not saved dialog  */
        if (isUnsaved) {
            setNotSavedDiagOpen(true);
            return;
        }

        /* If file is a cloud file we save then open new file otherwise we dont (the save also opens set not saved diag) */
        if (currOpenFile._id) {

            saveCurrentOpenFile();
            clearEditorForNewFile();
            return
        }

        /* If not a cloud file and value is empty, we dont show the prompt  */
        if (!editorTextValue) {
            clearEditorForNewFile();
            return;
        }

        /* Else we show not saved diag as someone might want to save the result */
        setNotSavedDiagOpen(true);
        return;


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
                snackbarFunctions.openSnackbar('Opened file');
            }
        } catch (e) {
            console.log('error while opening cloud file', e);
            snackbarFunctions.openSnackbar('Failed to open file')
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
                snackbarFunctions.openSnackbar('Opened filed');
            }
        } catch (e) {
            console.log('error while opening local file', e);
            snackbarFunctions.openSnackbar('Failed to open file')
        }

        setIsLoading(false);

    }

    const closePrefsDiag = () => {
        setPrefsDiagOpen(false);

    }

    const openPrefsDiag = () => {
        setPrefsDiagOpen(true);
    }

    const savePreferences = async (newPreferences: { newCustomTheme?: EditorColorTheme, newSelectedTheme?: number, newSyncScrolling?: boolean }, showSnackbar: boolean = true) => {

        clearTimeout(prefsSaveTimeoutRef.current);
        let { newCustomTheme, newSelectedTheme, newSyncScrolling } = newPreferences;

        let prefs = {
            themes: {

                customTheme: newCustomTheme !== undefined ? newCustomTheme : customTheme,
                selectedTheme: newSelectedTheme !== undefined ? newSelectedTheme : selectedTheme,
            },
            misc: {
                syncScrollingOn: newSyncScrolling !== undefined ? newSyncScrolling : syncScrollingOn
            }
        }


        if (isLoggedIn) {


            let requestData = new URLSearchParams();
            requestData.append('preferences', JSON.stringify(prefs));

            let request = await fetch('/api/preferences', { method: "PUT", body: requestData });


            if (request.status === 200 && !request.redirected && showSnackbar) {
                snackbarFunctions.openSnackbar('Saved preferences')
            }

        } else {
            window.localStorage.setItem('preferences', JSON.stringify(prefs));

            if (showSnackbar) {

                snackbarFunctions.openSnackbar('Saved preferences')
            }

        }
        setPrefsSaveTimeout(undefined);
    }

    const fetchPreferences = async () => {

        setIsLoading(true);
        if (isLoggedIn) {

            let request = await fetch('/api/preferences');


            if (request.status === 200 && !request.redirected && preferences) {
                let response = await request.json();

                let { preferences: prefs } = response;


                let { customTheme: newCustomTheme, selectedTheme: newSelectedTheme } = prefs.themes;
                let { syncScrollingOn: newSyncScrollingOn } = prefs.misc;

                setCustomTheme(newCustomTheme);
                setSelectedTheme(parseInt(newSelectedTheme));
                setSyncScrollingOn(newSyncScrollingOn);
            }

        } else {
            let storageVal = window.localStorage.getItem('preferences');

            if (!storageVal) {
                setIsLoading(false);
                return;
            }

            let prefs = JSON.parse(storageVal);

            if (!prefs) {
                setIsLoading(false);
                return;
            }

            let { customTheme: newCustomTheme, selectedTheme: newSelectedTheme } = prefs.themes;
            let { syncScrollingOn: newSyncScrollingOn } = prefs.misc;

            setCustomTheme(newCustomTheme);
            setSelectedTheme(parseInt(newSelectedTheme));
            setSyncScrollingOn(newSyncScrollingOn);
        }

        setIsLoading(false);
    }

    const resetPreferences = async () => {

        clearTimeout(prefsSaveTimeoutRef.current);

        setCustomTheme(defaultCustomTheme);
        savePreferences({ newCustomTheme: defaultCustomTheme }, false);

        snackbarFunctions.openSnackbar('Reset custom theme');
    }

    const closeSyntaxHelpDiag = () => {
        setSyntaxHelpDiagOpen(false);
    }

    const openSyntaxHelpDiag = () => {
        setSyntaxHelpDiagOpen(true);
    }

    /* For development */
    /* useEffect(() => {
        let newText = sampleResponse;

        setEditorTextValue(newText);
    }, []) */
    /* For development */

    /* Get preferences */
    useEffect(() => {

        fetchPreferences();

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
            autoSaveTimeoutRef,
            openFileInputRef,

            isLoading,

            currMenubarOption,

            prefsDiagOpen,
            customTheme,
            preferences: preferences,
            prefsSaveTimeout,
            prefsSaveTimeoutRef,

            syntaxHelpDiagOpen,
        },
        renderedView: {
            renderedViewDivRef,
            renderedTextValue,
        },
        editorExplorer: {
            explorerCollapsed: explorerCollapsed,
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

        setExplorerCollapsed,

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

        setPrefsDiagOpen,
        setPrefsSaveTimeout,


        closePrefsDiag,
        openPrefsDiag,
        setCustomTheme,
        setSelectedTheme,
        savePreferences,
        resetPreferences,
        setSyncScrollingOn,

        closeSyntaxHelpDiag,
        openSyntaxHelpDiag,
    };


    return (
        <EditorContext.Provider value={{ editorState: state, editorFunctions }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export { EditorContext, EditorContextProvider }