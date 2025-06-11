import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import * as S from './ChatRoom.style';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import Button from '../components/Button';
import Input from '../components/Input';
import { io, Socket } from 'socket.io-client';
import type { VoteData } from './components/VoteModal'; // VoteData 타입 임포트
import ActiveVoteDisplay from './components/ActiveVoteDisplay'; // ActiveVoteDisplay 임포트


export interface ChatMessage {
  id: string; // 모든 메시지에 고유 ID 보장
  nickname: string;
  text: string;
  timestamp: string;
}

type ChatRoomProps = {
  onInitiateCreateVote: () => void;
  chatAutoInput: string;
  setChatAutoInput: React.Dispatch<React.SetStateAction<string>>;
  activeVote: VoteData | null; 
};

// 서버에서 "오전/오후 HH:MM" 형식으로 보내주는 UTC 시간을 ISO 8601 형식으로 변환하는 함수
function parseKoreanFormattedUtcTime(timeString: string): string {
  const parts = timeString.split(' ');
  if (parts.length !== 2) {
    console.error("Invalid timeString format for parseKoreanFormattedUtcTime:", timeString);
    return new Date().toISOString();
  }
  const amPm = parts[0];
  const timeParts = parts[1].split(':');
  if (timeParts.length !== 2) {
    console.error("Invalid timeString format for parseKoreanFormattedUtcTime (time part):", timeString);
    return new Date().toISOString();
  }
  let hoursUtc = parseInt(timeParts[0], 10);
  const minutesUtc = parseInt(timeParts[1], 10);
  if (isNaN(hoursUtc) || isNaN(minutesUtc)) {
    console.error("Invalid number format in timeString for parseKoreanFormattedUtcTime:", timeString);
    return new Date().toISOString();
  }
  if (amPm === '오후' && hoursUtc !== 12) hoursUtc += 12;
  if (amPm === '오전' && hoursUtc === 12) hoursUtc = 0;
  const targetDate = new Date();
  targetDate.setUTCHours(hoursUtc, minutesUtc, 0, 0);
  return targetDate.toISOString();
}

function ChatRoom({ onInitiateCreateVote, chatAutoInput, setChatAutoInput, activeVote }: ChatRoomProps) {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(true);
  const [nickname, setNickname] = useState(''); // 사용자가 입력 필드에 입력 중인 닉네임
  const [establishedNickname, setEstablishedNickname] = useState(''); // 서버에서 확정된 현재 닉네임
  const [nicknameError, setNicknameError] = useState('');
  const [isSubmittingNickname, setIsSubmittingNickname] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // nickname 입력 필드의 최신 값을 참조하기 위한 ref (nickname_error 핸들러 등에서 사용)
  const nicknameInputRef = useRef(nickname);
  useEffect(() => {
    nicknameInputRef.current = nickname;
  }, [nickname]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    const handleConnect = () => console.log('WebSocket 연결 성공:', socket.id);
    const handleConnectError = (err: Error) => console.error('WebSocket 연결 실패:', err.message);

    const handleChatMessage = (data: { nickname: string; message: string; time: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `chat-${Date.now()}-${Math.random()}`, // 고유 ID 생성
          nickname: data.nickname,
          text: data.message,
          timestamp: parseKoreanFormattedUtcTime(data.time),
        },
      ]);
    };

    const handleSystemMessage = (msg: string) => {
      console.log('[ChatRoom] Received system_message:', msg); // 수신된 모든 시스템 메시지 확인
      const joinMessageRegex = /^(.*?)님이 입장했습니다\.$/; // 닉네임 캡처
      const match = msg.match(joinMessageRegex);
      const newlyConfirmedNickname = match ? match[1] : null;
      console.log('[ChatRoom] Regex match for join message:', match, 'Captured nickname:', newlyConfirmedNickname);

      if (newlyConfirmedNickname) {
        console.log('[ChatRoom] Join message detected. Newly confirmed nickname:', newlyConfirmedNickname, 'Previous establishedNickname:', establishedNickname);
        // 이 시점의 establishedNickname은 "이전" 확정 닉네임임
        if (establishedNickname && establishedNickname !== newlyConfirmedNickname) {
          // 닉네임 변경 시 이전 메시지 업데이트
          const oldNickname = establishedNickname;
          setMessages(prevMessages =>
            prevMessages.map(m => {
              if (m.nickname === oldNickname) {
                return { ...m, nickname: newlyConfirmedNickname };
              }
              return m;
            })
          );
        }
        console.log('[ChatRoom] Setting establishedNickname to:', newlyConfirmedNickname);
        setEstablishedNickname(newlyConfirmedNickname); // 새 닉네임으로 확정
        setIsNicknameModalOpen(false);
        setNicknameError('');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}-${Math.random()}`, // 고유 ID 생성
          nickname: 'SYSTEM',
          text: msg,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsSubmittingNickname(false);
    };

    const handleNicknameError = (payload: { source: string; msg: string }) => {
      if (payload.source === 'join') {
        console.log('[ChatRoom] Received nickname_error:', payload);
        setNicknameError(payload.msg);
        setIsNicknameModalOpen(true);
        setIsSubmittingNickname(false);
        // 만약 오류가 발생한 닉네임(nicknameInputRef.current)이
        // 이전에 성공적으로 설정된 establishedNickname과 같다면,
        // 이는 서버 상태 변경 등으로 인해 기존 닉네임을 다시 사용할 수 없게 된 경우일 수 있음.
        // 이 경우 establishedNickname을 초기화하여 사용자가 새 닉네임을 설정하도록 유도.
        if (establishedNickname && nicknameInputRef.current.trim() === establishedNickname) {
            setEstablishedNickname('');
        }
      }
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('chat_message', handleChatMessage);
    socket.on('system_message', handleSystemMessage);
    socket.on('nickname_error', handleNicknameError);

    return () => {
      // 컴포넌트 언마운트 시 또는 establishedNickname 변경으로 useEffect가 다시 실행되기 전 리스너 정리
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('chat_message', handleChatMessage);
      socket.off('system_message', handleSystemMessage);
      socket.off('nickname_error', handleNicknameError);
      socket.disconnect();
    };
  }, [establishedNickname]); // establishedNickname을 의존성 배열에 추가

  const handleNicknameSubmit = () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (trimmedNickname.length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    // 이미 설정된 닉네임과 동일한 경우, 서버 요청 없이 모달만 닫음
    if (establishedNickname && trimmedNickname === establishedNickname) {
      setIsNicknameModalOpen(false);
      console.log('[ChatRoom] Nickname submitted is same as established. Closing modal.');
      setNicknameError('');
      console.log('Nickname is the same as the established one. No server request needed.');
      return;
    }

    if (socketRef.current && socketRef.current.connected) {
      setIsSubmittingNickname(true);
      console.log('[ChatRoom] Emitting set_nickname with:', trimmedNickname);
      setNicknameError(''); // 이전 에러 메시지 초기화
      socketRef.current.emit('set_nickname', trimmedNickname);
      // 모달 닫기는 system_message 핸들러에서 서버 응답 후 처리
    } else {
      setNicknameError('서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      console.error('소켓이 연결되지 않아 닉네임을 설정할 수 없습니다.');
      setIsSubmittingNickname(false);
    }
  };

  const handleRequestNicknameChange = () => {
    // 닉네임 변경 요청 시, 입력 필드에 현재 확정된 닉네임을 기본값으로 설정
    setNickname(establishedNickname);
    setIsNicknameModalOpen(true);
  };

  const handleActiveVoteClick = () => {
    if (activeVote) {
      // App.tsx에 정의된 함수를 호출하여 VoteModal을 열도록 요청
      // 이 함수는 App.tsx에서 voteMode와 initialVoteData를 설정해야 함
      // 예시: props.onOpenVoteModal(mode, activeVote);
      // 현재 establishedNickname과 activeVote.ownerNickname을 비교하여 mode 결정
      const mode = establishedNickname === activeVote.ownerNickname ? 'owner' : 'participant';
      console.log(`Opening vote modal in ${mode} mode for vote:`, activeVote.title);
      // App.tsx에 있는 함수를 호출하여 모달을 열고, mode와 activeVote 데이터를 전달해야 합니다.
      // 예를 들어 App.tsx에 openVoteDisplayModal(mode, voteData) 같은 함수를 만들고 prop으로 전달받아 호출
      // 여기서는 onInitiateCreateVote를 재활용하기보다는 명시적인 함수를 App.tsx에 만드는 것이 좋음
      // 지금은 onInitiateCreateVote가 'create' 모드로만 열기 때문에, App.tsx 수정이 필요함.
    }
  };

  const handleSendMessage = (text: string) => {
    console.log('[ChatRoom] handleSendMessage called. Text:', text, 'Established Nickname:', establishedNickname, 'Socket Connected:', socketRef.current?.connected);
    if (!socketRef.current) {
      console.error('소켓 참조가 없습니다. 메시지를 보낼 수 없습니다.');
      return;
    }
    if (socketRef.current.connected && text.trim() && establishedNickname) { // 확정된 닉네임이 있을 때만 전송
      console.log('[ChatRoom] Emitting chat_message:', text); // 메시지 발송 직전 로그 추가
      socketRef.current.emit('chat_message', text);
    } else if (!establishedNickname) {
      console.error('닉네임이 설정되지 않아 메시지를 보낼 수 없습니다.');
      // 필요하다면 사용자에게 알림 (예: 닉네임 설정 모달 다시 열기)
    } else {
      console.error('소켓이 연결되지 않았거나 메시지가 비어 있어 전송할 수 없습니다.');
    }
  };

  return (
    <>
      <Modal
        isOpen={isNicknameModalOpen}
        title="사용할 닉네임을 입력해주세요."
        onClose={() => {
            // 사용자가 모달의 닫기 버튼(만약 있다면)을 눌렀을 때의 동작
            // 현재 확정된 닉네임이 있다면 입력 필드를 그 값으로 되돌림
            if (establishedNickname) {
                setNickname(establishedNickname);
            }
            // 이 onClose는 사용자가 명시적으로 모달을 닫을 때만 호출되도록 설계하는 것이 좋음
            // setIsNicknameModalOpen(false); // 필요에 따라 주석 해제
        }}
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
        <Button onClick={handleNicknameSubmit} text={isSubmittingNickname ? "확인 중..." : "확인"} disabled={isSubmittingNickname} />
      </Modal>
      <S.ChatRoomStyle>
        <Header />
        {activeVote && (
          <div onClick={handleActiveVoteClick} style={{ cursor: 'pointer' }}> {/* 클릭 가능하도록 div로 감싸기 */}
            <ActiveVoteDisplay voteData={activeVote} />
          </div>
        )}
        <MessageList messages={messages} currentNickname={establishedNickname} />
        <MessageInput
          onInitiateCreateVote={onInitiateCreateVote}
          chatAutoInput={chatAutoInput}
          setChatAutoInput={setChatAutoInput}
          currentNickname={establishedNickname} // 확정된 닉네임 전달
          onRequestNicknameChange={handleRequestNicknameChange}
          onSendMessage={handleSendMessage}
        />
      </S.ChatRoomStyle>
    </>
  );
}

export default ChatRoom;
