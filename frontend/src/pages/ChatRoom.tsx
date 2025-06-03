import { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import  * as S from './ChatRoom.style'
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import Button from '../components/Button';
import Input from '../components/Input';

function ChatRoom(){

    const [isModalOpen, setIsModalOpen] = useState(true);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return(
        <>
            <Modal
                isOpen={isModalOpen}
                title='사용할 닉네임을 입력해주세요.'
                onClose={closeModal}
            >
                <Input placeholder='닉네임' variant='primary'/>
                <Button onClick={closeModal}>확인</Button>
            </Modal>
            <S.ChatRoomStyle>
                <Header />
                <MessageList />
                <MessageInput />
            </S.ChatRoomStyle>
        </>
    )
}

export default ChatRoom;