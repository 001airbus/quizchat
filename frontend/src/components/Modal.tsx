import type React from "react";
import styled from "styled-components";

interface Props{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

function Modal({isOpen, onClose, title, children}: Props){

    if(!isOpen){
        return null;
    }

    return(
        <ModalOverlay>
            <ModalContent>
                {title && (
                    <ModalHeader>
                        <h2>{title}</h2>
                    </ModalHeader>
                )}
                <ModalBody>
                    {children}
                </ModalBody>

            </ModalContent>

        </ModalOverlay>
    )
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.50);
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 37px 10px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 300px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    justify-content: center;

    h2 {
        color: #1F1F1F;
        text-align: center;
        font-family: Roboto;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%;
        letter-spacing: -0.28px;
    }
`;

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 22px;
    align-items: center;
    justify-content: center;
`;


export default Modal;