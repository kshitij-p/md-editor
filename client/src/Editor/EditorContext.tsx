import { marked } from "marked";
import { createContext, RefObject, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import defaultMDFile from "../utils/defaultMDFile";
import customRenderer from "../utils/marked/customRenderer";
import { sampleResponse } from "../utils/sampleResponse";
import { MDFile } from "../utils/types";

type EditorContextState = {
    editor: {
        inEditorMode: boolean;
        editorTextValue: string;
        editorHeight: number;

        editorRef: RefObject<any>;

        editorPaneRef: RefObject<HTMLDivElement>;
        isDraggingSplitter: boolean;

        currOpenFile: MDFile;
        isUnsaved: boolean;
        notSavedDiagOpen: boolean;

        autoSaveTimeout: ReturnType<typeof setTimeout> | undefined;
    },
    renderedView: {
        renderedViewDivRef: RefObject<HTMLDivElement>;
        renderedTextValue: string;
    },
    editorExplorer: {
        files: MDFile[];
        createRenameDiagOpen: boolean;

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
        setEditorFiles: Function;

        fetchUserFiles: Function;
        createFile: Function;
        renameFile: Function;
        deleteFile: Function;
        overwriteFile: Function;

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

    const [editorFiles, setEditorFiles] = useState([]);

    const [currOpenFile, setCurrOpenFile] = useState(defaultMDFile);

    const [isUnsaved, setIsUnsaved] = useState(false);
    const [notSavedDiagOpen, setNotSavedDiagOpen] = useState(false);

    const [createRenameDiagOpen, setCreateRenameDiagOpen] = useState(false);

    const [autoSaveTimeout, setAutoSaveTimeout] = useState(undefined);

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
        let response = await request.json();

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

        if(fileID === currOpenFile._id){
            return;
        }

        if (isUnsaved) {
            setNotSavedDiagOpen(true);
            return;
        }

        let request = await fetch(`/api/files/${fileID}/parse`, { method: "POST" });

        let response = await request.json();

        if (request.status === 200 && !request.redirected && response.requestedFile) {
            setCurrOpenFile(response.requestedFile);
            setEditorTextValue(response.parsedFile.content);
        }

    }


    const state: EditorContextState = {
        editor: {
            inEditorMode,
            editorTextValue,
            editorHeight,

            editorRef,
            editorPaneRef,
            isDraggingSplitter,

            currOpenFile,
            isUnsaved,
            notSavedDiagOpen,
            autoSaveTimeout,
        },
        renderedView: {
            renderedViewDivRef,
            renderedTextValue,
        },
        editorExplorer: {
            files: editorFiles,
            createRenameDiagOpen,
        }

    }

    const editorFunctions = {
        setInEditorMode, setEditorTextValue, setEditorHeight, setRenderedTextValue,
        parseEditorText, setIsDraggingSplitter,
        setEditorFiles, fetchUserFiles, createFile, renameFile, deleteFile,
        setCurrOpenFile,
        clearEditorForNewFile, createNewEditorFile, saveCurrentOpenFile, downloadCurrentOpenFile,
        setIsUnsaved,
        setNotSavedDiagOpen,
        closeNotSavedDiag,
        setCreateRenameDiagOpen,
        overwriteFile,
        setAutoSaveTimeout,
        openCloudFile,
    };

    /* TEMP */
    useEffect(() => {
        let newText = sampleResponse;

        setEditorTextValue(newText);
    }, [])
    /* TEMP */

    return (
        <EditorContext.Provider value={{ editorState: state, editorFunctions }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export { EditorContext, EditorContextProvider }