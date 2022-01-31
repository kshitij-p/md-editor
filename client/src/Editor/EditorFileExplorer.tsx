import styled from "styled-components";

const EditorFileExplorerDiv = styled.div`
    width: 20%;
    min-height: 100vh;
    
    padding: 2em;
    background: 
    linear-gradient(180deg, rgba(158, 158, 158, 0.3) 0%, rgba(46, 46, 46, 0.1) 100%);
   

    backdrop-filter: blur(50px);
    box-shadow: 0px 0px 16px 0px hsla(0, 0%, 100%, 0.2);

    position: relative;

    
`

const EditorFileExplorer: React.FC = (props)=>{
    return (
        <>
            <EditorFileExplorerDiv>

            </EditorFileExplorerDiv>
        </>
    )
}

export default EditorFileExplorer;