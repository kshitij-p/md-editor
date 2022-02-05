import React, { useContext } from 'react';
import { ModalProps } from 'react-overlays/esm/Modal';
import styled from 'styled-components';
import BasicDialog from '../../BasicDialog';
import { EditorContext } from '../EditorContext';


type DeleteDiagProps = ModalProps & {
    editingID: string;
    onHide: Function;
    setEditingID: Function;
}

const DeleteDiagWrapper = styled.div`
    min-height: 100%;

    display: flex; 
    justify-content: space-evenly;
    align-items: center;

    button {
        border: none;
        outline: none;

        width: 30%;
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

        background-color: hsl(345, 100%, 50%);
        box-shadow: 0px 0px 16px hsl(345, 100%, 50%);
    }
    
`

const DeleteDiag: React.FC<DeleteDiagProps> = (props) => {

    const { editorFunctions } = useContext(EditorContext);

    const handleDeleteOnClick = () => {
        props.onHide();
        editorFunctions.deleteFile(props.editingID);
    }

    const handleBack = () => {
        props.onHide();
    }

    return (
        <>
            <BasicDialog show={props.show} onHide={props.onHide} custom={`display: flex; flex-direction: column;
            background-color: hsla(0, 0%, 3%, 0.4); backdrop-filter: blur(10px)`} >
                <DeleteDiagWrapper>
                    <button onClick={handleBack}
                        aria-label='Go back and close dialog'>Back</button>
                    <button className='accept' onClick={handleDeleteOnClick}
                        aria-label='Delete file'>Delete</button>
                </DeleteDiagWrapper>
            </BasicDialog>
        </>
    );
};

export default DeleteDiag;
