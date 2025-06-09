import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import * as S from './ChatRoom.style';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import Button from '../components/Button';
import Input from '../components/Input';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id?: string; // socket.io 서버에서는 id 자동 생성되지 않을 수 있음
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;
    
    // 소켓 연결 확인
    socket.on('connect', () => {
        console.log('WebSocket 연결 성공:', socket.id);
    });

    socket.on('connect_error', (err) => {
        console.error('WebSocket 연결 실패:', err.message);
    });


    

    // 닉네임 등록 후 연결
    if (nickname) {
      socket.emit('set_nickname', nickname);
    }

    // 일반 채팅 메시지 수신
    socket.on('chat_message', (data: { nickname: string; message: string; time: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          nickname: data.nickname,
          text: data.message,
          timestamp: data.time,
        },
      ]);
    });

    // 시스템 메시지 수신 (입장/퇴장 등)
    socket.on('system_message', (msg: string) => {
      setMessages((prev) => [
        ...prev,
        {
          nickname: 'SYSTEM',
          text: msg,
          timestamp: new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    });

    // 닉네임 중복 에러
    socket.on('nickname_error', (payload) => {
      if (payload.source === 'join') {
        setNicknameError(payload.msg);
        setIsNicknameModalOpen(true);
        socket.disconnect();
      }
    });

    return () => {
      socket.disconnect();
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
  };

  const handleRequestNicknameChange = () => {
    setIsNicknameModalOpen(true);
  };

  const handleSendMessage = (text: string) => {
    if (socketRef.current && text.trim()) {
      socketRef.current.emit('chat_message', text);
    } else {
      console.error('소켓이 연결되지 않았거나 메시지가 비어 있습니다.');
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
