import React from 'react';
import { ModalProps } from 'react-overlays/esm/Modal';
import BasicDialog from '../../BasicDialog';

type CreateRenameDiagProps = ModalProps & {
    renaming: boolean;
    editingID: string | null;
}

const CreateRenameDiag: React.FC<CreateRenameDiagProps> = (props) => {



    return (
        <>
            <BasicDialog show={props.show} onHide={props.onHide}>
                <>
                    <b>File name</b>
                    <input />
                </>
            </BasicDialog>
        </>
    );
};

export default CreateRenameDiag;
