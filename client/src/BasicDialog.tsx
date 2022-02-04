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

  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  z-index: 1040;
  
  animation: fade-in ease-in-out;
  animation-duration: 0.25s;

  :focus, :active {
    border: none;
    outline: none;
  };

  
`;

const renderBackdrop = (props: RenderModalBackdropProps) => <Backdrop {...props} />;

const BasicDialog: React.FC<BaseModalProps> = (props) => {
  return (
    <BasicModal show={props.show} renderBackdrop={renderBackdrop} onHide={props.onHide}>
      {props.children}
    </BasicModal>
  )
};

export default BasicDialog;
