import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Header from '../components/Header';
import Modal from '../components/Modal';
import * as S from './ChatRoom.style';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import Button from '../components/Button';
import Input from '../components/Input';

export interface ChatMessage {
  id: string;
  nickname: string;
  text: string;
  timestamp: string;
}

type ChatRoomProps = {
  onInitiateCreateVote: () => void;
  chatAutoInput: string;
  setChatAutoInput: React.Dispatch<React.SetStateAction<string>>;
};

function ChatRoom({ onInitiateCreateVote, chatAutoInput, setChatAutoInput }: ChatRoomProps) {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(true);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'dummy-1',
      nickname: '나의닉네임',
      text: '이것은 내가 보낸 더미 메시지입니다.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'dummy-2',
      nickname: '다른사용자',
      text: '이것은 다른 사용자가 보낸 더미 메시지입니다.',
      timestamp: new Date().toISOString(),
    },
  ]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (nickname && !socketRef.current) {
      const socket = io('http://ec2-3-35-99-106.ap-northeast-2.compute.amazonaws.com:3000', {
        transports: ['websocket'], // 필요에 따라 추가
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket.IO Connected');
        socket.emit('join', { nickname });
      });

      socket.on('message', (payload: ChatMessage) => {
        setMessages(prev => [...prev, payload]);
      });

      socket.on('history', (payload: ChatMessage[]) => {
        setMessages(payload);
      });

      socket.on('disconnect', () => {
        console.log('Socket.IO Disconnected');
      });

      socket.on('connect_error', (err) => {
        console.error('Connection Error:', err);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [nickname]);

  const handleNicknameSubmit = () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (nickname.trim().length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다.');
      return;
    }
    setNicknameError('');
    setIsNicknameModalOpen(false);

    setMessages(prevMessages =>
      prevMessages.map(msg => (msg.id === 'dummy-1' ? { ...msg, nickname } : msg))
    );
  };

  const handleRequestNicknameChange = () => {
    setIsNicknameModalOpen(true);
  };

  const handleSendMessage = (text: string) => {
    if (socketRef.current && text.trim()) {
      const messageToSend = {
        type: 'message',
        nickname,
        text,
      };
      socketRef.current.emit('message', messageToSend);
    } else {
      console.error('Socket.IO is not connected or message is empty.');
    }
  };

  return (
    <>
      <Modal
        isOpen={isNicknameModalOpen}
        title="사용할 닉네임을 입력해주세요."
        onClose={() => {}}
      >
        <Input
          placeholder="닉네임 (2자 이상)"
          variant="primary"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        {nicknameError && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{nicknameError}</p>
        )}
        <Button onClick={handleNicknameSubmit} text="확인" />
      </Modal>
      <S.ChatRoomStyle>
        <Header />
        <MessageList messages={messages} currentNickname={nickname} />
        <MessageInput
          onInitiateCreateVote={onInitiateCreateVote}
          chatAutoInput={chatAutoInput}
          setChatAutoInput={setChatAutoInput}
          currentNickname={nickname}
          onRequestNicknameChange={handleRequestNicknameChange}
          onSendMessage={handleSendMessage}
        />
      </S.ChatRoomStyle>
    </>
  );
}

export default ChatRoom;
