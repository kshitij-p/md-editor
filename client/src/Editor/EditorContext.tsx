import { createContext, HtmlHTMLAttributes, RefObject, useReducer, useRef, useState } from "react";

type EditorContextState = {
    editor: {
        inEditorMode: boolean;
        editorTextValue: string;
        renderedTextValue: string;
        editorTextAreaRef: RefObject<HTMLTextAreaElement>;
    },
    renderedView: {
        renderedViewDivRef: RefObject<HTMLDivElement>;
    }
}

type EditorContextType = {
    editorState: EditorContextState;
    editorFunctions: {
        setInEditorMode: Function;
        setEditorTextValue: Function;
        setRenderedTextValue: Function;
        
    },
    
}

const EditorContext = createContext({} as EditorContextType);



const EditorContextProvider: React.FC = (props) => {

    const [inEditorMode, setInEditorMode] = useState(false);
    const [editorTextValue, setEditorTextValue] = useState('');
    const editorTextAreaRef = useRef<HTMLTextAreaElement>(null);

    const [renderedTextValue, setRenderedTextValue] = useState('');
    const renderedViewDivRef = useRef<HTMLDivElement>(null)


    const state: EditorContextState = {
        editor: {
            inEditorMode,
            editorTextValue,
            renderedTextValue,
            editorTextAreaRef,
            
        },
        renderedView: {
            renderedViewDivRef
        }

    }

    const editorFunctions = { setInEditorMode, setEditorTextValue, setRenderedTextValue};

    return (
        <EditorContext.Provider value={{ editorState: state, editorFunctions }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export { EditorContext, EditorContextProvider }