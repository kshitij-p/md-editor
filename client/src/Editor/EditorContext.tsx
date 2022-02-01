import { marked } from "marked";
import { createContext, HtmlHTMLAttributes, RefObject, useEffect, useReducer, useRef, useState } from "react";
import customRenderer from "../utils/marked/customRenderer";

type EditorContextState = {
    editor: {
        inEditorMode: boolean;
        editorTextValue: string;
        
        editorRef: RefObject<any>;
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
        setRenderedTextValue: Function;
        parseEditorText: Function;
        
    },
    
}

const EditorContext = createContext({} as EditorContextType);

marked.use({ renderer: customRenderer });


const EditorContextProvider: React.FC = (props) => {

    

    const [inEditorMode, setInEditorMode] = useState(true);
    const [editorTextValue, setEditorTextValue] = useState('');
    const editorRef = useRef<any>(null);

    const [renderedTextValue, setRenderedTextValue] = useState('');
    const renderedViewDivRef = useRef<HTMLDivElement>(null)

    const parseEditorText = ()=>{
        let parsed = marked.parse(editorTextValue);
        setRenderedTextValue(parsed);
    }    

    const state: EditorContextState = {
        editor: {
            inEditorMode,
            editorTextValue,
            editorRef,
            
        },
        renderedView: {
            renderedViewDivRef,
            renderedTextValue,
        }

    }

    const editorFunctions = { setInEditorMode, setEditorTextValue, setRenderedTextValue, parseEditorText};

    useEffect(()=>{
        parseEditorText();
    }, [editorTextValue])

    useEffect(()=>{

        if(renderedViewDivRef.current){
            renderedViewDivRef.current.innerHTML = renderedTextValue;
        }

    }, [renderedTextValue])

   

    return (
        <EditorContext.Provider value={{ editorState: state, editorFunctions }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export { EditorContext, EditorContextProvider }