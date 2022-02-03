import styled from "styled-components";

const EditorFileExplorerDiv = styled.div`
    width: 30%;
    min-height: 100vh;
    
    padding: 2em;
    background: radial-gradient(28.5% 21.44% at 40.53% 25.05%, rgba(62, 248, 204, 0.048) 0%, rgba(126, 246, 217, 0) 100%), radial-gradient(66.14% 66.14% at 92.9% 112.43%, rgba(255, 188, 57, 0.17) 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(62.5% 36.37% at 40.34% 62.19%, rgba(249, 0, 62, 0.132) 0%, rgba(203, 11, 11, 0) 100%), radial-gradient(67.42% 36.2% at 88.54% 22.93%, rgba(0, 190, 238, 0.156) 0%, rgba(31, 89, 103, 0) 100%), linear-gradient(180deg, rgba(8, 8, 8, 0.3) 0%, rgba(26, 26, 26, 0.1) 100%);
   


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