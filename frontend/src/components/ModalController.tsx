import { useState } from "react";
import Modal from "./Modal";

function ModalOpen() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <div>
            <button onClick={handleOpen}>모달</button>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <p>modal</p>
            </Modal>
        </div>
    )
}

export default ModalOpen;