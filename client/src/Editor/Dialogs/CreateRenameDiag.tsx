import React, { useContext, useState } from 'react';
import { ModalProps } from 'react-overlays/esm/Modal';
import styled from 'styled-components';
import BasicDialog from '../../BasicDialog';
import isValidFileName from '../../utils/isValidFileName';
import { EditorContext } from '../EditorContext';

type CreateRenameDiagProps = ModalProps & {
    renaming: boolean;
    editingID: string;
    onHide: Function;
}

const CreateRenameDiagWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100%;

    strong {
        
        margin-top: 1em;
        margin-bottom: 0.5em;

        color: hsl(0, 0%, 90%);
        font-size: 5em;
        font-weight: 700;
        letter-spacing: 0.08em;
    }

    input {
        border: none;
        outline: none;

        width: 90%;
        margin-left: 1%;
        padding: 0.25em;

        background-color: hsla(0, 0%, 80%, 0.15);
        border-radius: 10px;

        font-size: 2.5em;
        color: white;

        transition: 0.15s ease-in-out;

        :focus {
            box-shadow: 0px 0px 16px hsla(0, 0%, 80%, 0.6);
        }
    }

    button {
        outline: none;
        border: none;

        width: 60%;
        padding: 0.5em 0;
        max-width: 15rem;

        align-self: center;
        margin-top: 2.5em;

        background-color: hsl(0, 0%, 100%);
        box-shadow: 0px 0px 6px white;
        border-radius: 3px;

        font-size: 2em;
        font-weight: 600;

        cursor: pointer;

        transition: 0.15s ease-in-out;

        :hover {
            background-color: hsl(0, 0%, 10%);
            box-shadow: 0px 0px 4px white;
            color: white;
        }
    }
`


const CreateRenameDiag: React.FC<CreateRenameDiagProps> = (props) => {

    const { editorFunctions } = useContext(EditorContext);

    const [newName, setNewName] = useState<string>('');

    const handleOnChangeName = (e: React.FormEvent<HTMLInputElement>) => {
        setNewName(e.currentTarget.value);
    }

    const handleOnClick = () => {

        if (!newName) {
            return;
        }

        if (!isValidFileName(newName)) {
            return;
        }

        if (!props.renaming) {

            editorFunctions.createFile(newName);

            props.onHide();

        } else {
            if (props.editingID) {
                editorFunctions.renameFile(newName, props.editingID);

                props.onHide();
            }
        }

        setNewName('');
    }

    return (
        <>
            <BasicDialog show={props.show} onHide={props.onHide} custom={`display: flex; flex-direction: column; 
            background-color: hsla(0, 0%, 3%, 0.4); backdrop-filter: blur(10px)`}>
                <CreateRenameDiagWrapper>
                    <strong>{`${props.renaming ? 'Renaming' : 'Creating'} file`}</strong>
                    <input value={newName} onChange={handleOnChangeName} />
                    <button onClick={handleOnClick}>{props.renaming ? 'Rename' : 'Create'}</button>
                </CreateRenameDiagWrapper>
            </BasicDialog>
        </>
    );
};

export default CreateRenameDiag;
