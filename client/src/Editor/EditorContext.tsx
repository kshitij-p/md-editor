import { marked } from "marked";
import { createContext, RefObject, useEffect, useRef, useState } from "react";
import customRenderer from "../utils/marked/customRenderer";
import { sampleResponse } from "../utils/sampleResponse";

type EditorContextState = {
    editor: {
        inEditorMode: boolean;
        editorTextValue: string;
        editorHeight: number;
        
        editorRef: RefObject<any>;

        editorPaneRef: RefObject<HTMLDivElement>;

        isDraggingSplitter: boolean;
    },
    renderedView: {
        renderedViewDivRef: RefObject<HTMLDivElement>;
        renderedTextValue: string;
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
    },
    
}

const EditorContext = createContext({} as EditorContextType);


marked.use({ renderer: customRenderer, breaks: true, gfm: true});


const EditorContextProvider: React.FC = (props) => {

    

    const [inEditorMode, setInEditorMode] = useState(false);
    const [editorTextValue, setEditorTextValue] = useState('');
    const editorRef = useRef<any>(null);

    const [renderedTextValue, setRenderedTextValue] = useState('');
    const renderedViewDivRef = useRef<HTMLDivElement>(null)

    const editorPaneRef = useRef<HTMLDivElement>(null);

    const [editorHeight, setEditorHeight] = useState(50);

    const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);

    const parseEditorText = ()=>{
        let replacedBreaks = editorTextValue.replace(/\n(?=\n)/g, "<br>");
        let parsed = marked.parse(replacedBreaks);
        console.log({parsed});
        setRenderedTextValue(parsed);
    }    

    const state: EditorContextState = {
        editor: {
            inEditorMode,
            editorTextValue,
            editorHeight,

            editorRef,
            editorPaneRef,
            isDraggingSplitter,
        },
        renderedView: {
            renderedViewDivRef,
            renderedTextValue,
        }

    }

    const editorFunctions = { setInEditorMode, setEditorTextValue, setEditorHeight, setRenderedTextValue, parseEditorText, setIsDraggingSplitter};
    
    useEffect(()=>{
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