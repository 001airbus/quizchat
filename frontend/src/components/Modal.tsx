import type { ReactNode } from "react";
import styled from "styled-components";
import Button from "./Button";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Overlay = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const ModalStyle = styled.div`
    background: #FFFFFF;
    padding: 20px;
    border-radius: 8px;

    min-width: 260px;
    position: relative;
`;


function Modal({isOpen, onClose, children}: ModalProps) {

    if (!isOpen) return null;
    return (
        <Overlay onClick={onClose}>
            <ModalStyle onClick={e => e.stopPropagation()}>
                <Button text="버튼(닫기)" variant="primary" onClick={onClose} />
                {/* <CloseButton onClick={onClose}>&times;</CloseButton> */}
                {children}
            </ModalStyle>
        </Overlay>

    )
}


export default Modal;