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
  const [currentNickname, setCurrentNickname] = useState('');
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



    

    // // 닉네임 등록 후 연결
    // if (nickname) {
    //   socket.emit('set_nickname', nickname);
    // }

    // 일반 채팅 메시지 수신
    socket.on('chat_message', (data: { nickname: string; message: string; time: string }) => {
      //const formattedTime = dayjs(data.time).tz('Asia/Seoul').format('HH:mm'); //dayjs
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
        //socket.disconnect();
        setNickname(currentNickname);
      }
    });

    socket.on('quiz_error', (msg) => {
        setMessages((prev) => [
            ...prev,
            {
                nickname: 'SYSTEM',
                text: `퀴즈 오류: ${msg}`,
                timestamp: new Date().toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
        ]);
    });

    socket.on('quiz_info', ({ question, remainingTime, startedByName }) => {
        setMessages((prev) => [
            ...prev,
            {
                nickname: 'SYSTEM',
                text: `${startedByName}님이 퀴즈를 출제했습니다.\n문제: ${question}\n제한 시간: ${remainingTime}초`,
                timestamp: new Date().toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
        ]);
    });







    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNicknameSubmit = () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (nickname.trim().length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다.');
      return;
    }
    if (nickname.trim() === currentNickname) {
        setIsNicknameModalOpen(false);
        return;
    }

    setNicknameError('');
    setIsNicknameModalOpen(false);
  

  if (socketRef.current?.connected) {
    if (!currentNickname) {
        socketRef.current.emit('set_nickname', nickname.trim());
    } else {
        socketRef.current.emit('change_nickname', nickname.trim());
    }

    setCurrentNickname(nickname.trim());
} else {
    console.error('소켓 연결이 되지 않았습니다.')
  }
};

  const handleRequestNicknameChange = () => {
    setIsNicknameModalOpen(true);
  };

  const handleSendMessage = (text: string) => {
    // 제출 알림 (temp)
    if (socketRef.current && text.trim()) {
        // /answer 명령어 입력 시 사용자에게 제출 알림 메시지 띄우기
        if (text.startsWith('/answer')) {
            setMessages((prev) => [
                ...prev,
                {
                nickname: 'SYSTEM',
                text: '정답을 제출했어요! 결과를 기다리는 중...',
                timestamp: new Date().toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
        ]);
    }


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
        onClose={() => setIsNicknameModalOpen(false)}
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
        <MessageList messages={messages} currentNickname={currentNickname} />
        <MessageInput
          onInitiateCreateVote={onInitiateCreateVote}
          chatAutoInput={chatAutoInput}
          setChatAutoInput={setChatAutoInput}
          currentNickname={currentNickname}
          onRequestNicknameChange={handleRequestNicknameChange}
          onSendMessage={handleSendMessage}
        />
      </S.ChatRoomStyle>
    </>
  );
}

export default ChatRoom;
