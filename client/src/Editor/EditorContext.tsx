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
    },
    renderedView: {
        renderedViewDivRef: RefObject<HTMLDivElement>;
        renderedTextValue: string;
    },
    editorExplorer: {
        files: MDFile[];
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

        setCurrOpenFile: Function;
        clearEditorForNewFile: Function;

        createNewEditorFile: Function;
        saveCurrentOpenFile: Function;
        downloadCurrentOpenFile: Function;

        setIsUnsaved: Function;
        setNotSavedDiagOpen: Function;
        closeNotSavedDiag: Function & any;
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

        if (request.status === 200 && !request.redirected) {
            fetchUserFiles();
        }
    }

    const renameFile = async (fileName: string, fileID: string) => {
        if (!fileName || !fileID) {
            return;
        }

        let requestBody = new URLSearchParams();
        requestBody.append('name', fileName);

        let request = await fetch(`/api/files/${fileID}`, { method: "PUT", body: requestBody });

        if (request.status === 200 && !request.redirected) {
            fetchUserFiles();
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

    const closeNotSavedDiag = ()=>{
        setNotSavedDiagOpen(false);
    }
    
    const clearEditorForNewFile = () => {
        setCurrOpenFile(defaultMDFile);
        setEditorTextValue('');
        setIsUnsaved(false);
    }

    const saveCurrentOpenFile = () => {
        if (isLoggedIn) {
            console.log('is saving');
        } else {
            /* Download file */
        }

        setIsUnsaved(false);
    }

    const createNewEditorFile = () => {
        if(isUnsaved){
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
        },
        renderedView: {
            renderedViewDivRef,
            renderedTextValue,
        },
        editorExplorer: {
            files: editorFiles
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
        closeNotSavedDiag
    };

    useEffect(() => {
        let newText = sampleResponse;

        setEditorTextValue(newText);
    }, [])

    return (
        <EditorContext.Provider value={{ editorState: state, editorFunctions }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export { EditorContext, EditorContextProvider }