import React, { useContext } from 'react';
import { ModalProps } from 'react-overlays/esm/Modal';
import styled from 'styled-components';
import { AuthContext } from '../../Auth/AuthContext';
import BasicDialog from '../../BasicDialog';
import { EditorContext } from '../EditorContext';

type NotSavedDiagProps = ModalProps & {
  show: boolean;

  onHide: Function;
}

const NotSavedWrapper = styled.div`
    min-height: 100%;

    display: flex; 
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    div{
      width: 100%;
      display: flex; 
    justify-content: space-evenly;
    align-items: center;
    }

    strong {
      font-size: 2em;
      color: white;
      text-align: center;
    }

    button {
        border: none;
        outline: none;

        min-width: 20%;
        padding: 0.25em;

        border-radius: 5px;

        font-size: 3em;
        font-weight: 600;
        letter-spacing: 0.05em;

        transform: translateY(0px);
        transition: 0.15s ease-in-out;

        cursor: pointer;

        :hover {
            transform: translateY(-2px);
        }
    }

    .accept {

        color: hsl(0, 0%, 90%);

        background-color: hsl(127, 80%, 31%);
        box-shadow: 0px 0px 16px hsl(127, 80%, 31%);
    }
    
`

const NotSavedDiag: React.FC<NotSavedDiagProps> = (props) => {

  const { isLoggedIn } = useContext(AuthContext);

  const { editorState, editorFunctions } = useContext(EditorContext);

  const handleBack = () => {
    props.onHide();
  }

  const handleDiscard = () => {
    editorFunctions.clearEditorForNewFile();

    props.onHide();
  }

  const handleOnAccept = () => {
    props.onHide();
    if (isLoggedIn) {

      editorFunctions.saveCurrentOpenFile();
    } else {
      editorFunctions.downloadCurrentOpenFile();
      if (editorState.editor.isUnsaved) {

        editorFunctions.setIsUnsaved(false);
      }
    }



  }

  return (
    <BasicDialog show={props.show} onHide={props.onHide} custom={`display: flex; flex-direction: column;
    background-color: hsla(0, 0%, 3%, 0.4); backdrop-filter: blur(10px)`}>

      <NotSavedWrapper>
        <strong>

          {isLoggedIn ? 'You must save before you can do that' : 'You will lose your document if you dont download your file. You can signup and save it on cloud instead.'}
        </strong>
        <div>
          <button className='accept' onClick={handleOnAccept}
            aria-label={`${isLoggedIn ? 'Save' : 'Download'} file`}>{`${isLoggedIn ? 'Save' : 'Download'}`}</button>
          <button onClick={handleDiscard}>
            Discard File
          </button>

          <button
            aria-label='Go back and close dialog' onClick={handleBack}>Back</button>
        </div>
      </NotSavedWrapper>

    </BasicDialog>
  )
};

export default NotSavedDiag;