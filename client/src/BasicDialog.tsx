import React from 'react';
import styled from 'styled-components';
import Modal, { BaseModalProps, RenderModalBackdropProps } from 'react-overlays/Modal';

const Backdrop = styled("div")`
  position: fixed;
  z-index: 1040;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  opacity: 0.5;
`;

const BasicModal = styled(Modal)`
  position: fixed;
  width: 50vw;
  height: 50vh;

  margin-top: -25vh;
  margin-left: -25vw;

  padding: 1em;
  top: 50%;
  left: 50%;

  background-color: white;
  border-radius: 5px;

  box-shadow: 0 0px 64px hsl(0, 0%, 0%, 1), inset 0px 0px 2px hsla(0, 0%, 90%, 0.3);
  
  z-index: 1040;
  
  animation: fade-in ease-in-out;
  animation-duration: 0.25s;

  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  :focus, :active {
    border: none;
    outline: none;
  };

  ${props => props.custom ? props.custom : ''};

`;

const renderBackdrop = (props: RenderModalBackdropProps) => <Backdrop {...props} />;

type BasicDialogProps = BaseModalProps & {
  custom?: string
  onHide: Function;
}

const BasicDialog: React.FC<BasicDialogProps> = (props) => {
  return (
    <BasicModal show={props.show} renderBackdrop={renderBackdrop} onHide={props.onHide} custom={props.custom} >
      {props.children}
    </BasicModal>
  )
};

export default BasicDialog;
