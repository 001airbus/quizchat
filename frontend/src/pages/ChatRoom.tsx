import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import * as S from './ChatRoom.style';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import Button from '../components/Button';
import Input from '../components/Input';
import { io, Socket } from 'socket.io-client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { VoteData } from './components/VoteModal';
import ActiveVoteDisplay from './components/ActiveVoteDisplay';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface ChatMessage {
  id?: string; // socket.io 서버에서는 id 자동 생성되지 않을 수 있음
  nickname: string;
  text: string;
  timestamp: string;
}

type ChatRoomProps = {
  onInitiateCreateVote: (currentEstablishedNickname?: string) => void;
  chatAutoInput: string;
  setChatAutoInput: React.Dispatch<React.SetStateAction<string>>;
  activeVote: VoteData | null;
  onOpenVoteForViewing: (voteData: VoteData, mode: 'owner' | 'participant', nickname?: string) => void;
  lastVoteEvent: {
    type: 'closed';
    title: string;
    winningOptions?: string[];
    maxVotes?: number;
    noVotes?: boolean;
  } | null;
  onVoteEventProcessed: () => void;
};

function ChatRoom({ onInitiateCreateVote, chatAutoInput, setChatAutoInput, activeVote, onOpenVoteForViewing, lastVoteEvent, onVoteEventProcessed}: ChatRoomProps) {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(true);
  const [nickname, setNickname] = useState('');
  const [establishedNickname, setEstablishedNickname] = useState(''); 
  const [nicknameError, setNicknameError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);

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
      let timestampUtc: string;
      try{
        const timeString = data.time;
        const parts = timeString.split(' ');
        if (parts.length !== 2) throw new Error("Invalid KST time string format");
        
        const amPm = parts[0];
        const timeParts = parts[1].split(':');
        if (timeParts.length !== 2) throw new Error("Invalid KST time string format (time part)");

        let hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);

        if (isNaN(hours) || isNaN(minutes)) throw new Error("Invalid number in KST time string");

        if (amPm === '오후' && hours !== 12) hours += 12;
        if (amPm === '오전' && hours === 12) hours = 0;

        let kstTime = dayjs().tz("Asia/Seoul").hour(hours).minute(minutes).second(0).millisecond(0);
        kstTime = kstTime.add(9, 'hour');

        timestampUtc = kstTime.utc().toISOString();

      }catch(error){
        console.error("Error parsing KST time with dayjs:", error, "Original time:", data.time);
        timestampUtc = dayjs().utc().toISOString();
      }
      setMessages((prev) => [
        ...prev,
        {
          nickname: data.nickname,
          text: data.message,
          timestamp: timestampUtc,
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
          timestamp: dayjs().utc().toISOString(),
        },
      ]);
    });

    // 닉네임 중복 에러
    socket.on('nickname_error', (payload) => {
      if (payload.source === 'join') {
        setNicknameError(payload.msg);
        setIsNicknameModalOpen(true);
        //socket.disconnect();
        setNickname(establishedNickname);
      }
    });

    socket.on('quiz_error', (msg) => {
        setMessages((prev) => [
            ...prev,
            {
                nickname: 'SYSTEM',
                text: `퀴즈 오류: ${msg}`,
                timestamp: dayjs().utc().toISOString(),
            },
        ]);
    });

    socket.on('quiz_info', ({ question, remainingTime, startedByName }) => {
        const text = `${startedByName}님이 퀴즈를 출제했습니다.\n문제: ${question}\n제한 시간: ${remainingTime}초`;
        setMessages((prev) => [
            ...prev,
            {
                nickname: 'SYSTEM',
                text: text,
                timestamp: dayjs().utc().toISOString(),
            },
        ]);
    });

    // 정답여부 알림
    socket.on('quiz_ended', ({ answer, result }) => {
      const myId = socket.id; // 현재 접속자의 socket.id
      const me = result.find((r) => r.socketId === myId);// 정답자의 아이디에 있는지 비교

      if (me) {
        if (me.isCorrect) {
          setMessages((prev) => [
            ...prev,
            {
              nickname: 'SYSTEM',
              text: `🎉 정답입니다! 정답 : ${me.submitted}`,
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              nickname: 'SYSTEM',
              text: `❌ 오답입니다. 제출한 답: "${me.submitted}", 정답은 "${answer}"입니다.`,
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            nickname: 'SYSTEM',
            text: `정답을 제출하지 않았습니다. 정답은 "${answer}"였습니다.`,
            timestamp: new Date().toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      }
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (lastVoteEvent?.type === 'closed' && lastVoteEvent.title) {
      let resultMessage = `투표 '${lastVoteEvent.title}'가 종료되었습니다.`;
      if (lastVoteEvent.noVotes) {
        resultMessage += " 아무도 투표하지 않았습니다.";
      } else if (lastVoteEvent.winningOptions && lastVoteEvent.winningOptions.length > 0 && lastVoteEvent.maxVotes !== undefined) {
        if (lastVoteEvent.winningOptions.length === 1) {
          resultMessage += ` 가장 많은 표를 받은 항목은 "${lastVoteEvent.winningOptions[0]}" (${lastVoteEvent.maxVotes}표) 입니다.`;
        } else {
          resultMessage += ` 가장 많은 표를 받은 항목은 "${lastVoteEvent.winningOptions.join('", "')}" (각 ${lastVoteEvent.maxVotes}표) 입니다.`;
        }
      } else {
        // 이 경우는 noVotes가 false인데 winningOptions나 maxVotes가 없는 경우, 예외 처리 또는 기본 메시지
        resultMessage += " 투표 결과 집계 중 오류가 발생했거나, 투표 항목이 없었습니다.";
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `system-vote-closed-${Date.now()}-${Math.random()}`,
          nickname: 'SYSTEM',
          text: resultMessage,
          timestamp: dayjs().utc().toISOString(),

        },
      ]);
      onVoteEventProcessed(); // 이벤트 처리 완료 알림
    }

  }, [lastVoteEvent, onVoteEventProcessed]);


  const handleActiveVoteClick = () => {
    if(activeVote) {
      if(!establishedNickname){
        console.warn("닉네임이 설정되지 않아 투표 모드를 결정할 수 없습니다. 참여자 모드로 시도합니다.");
      }
      const mode = establishedNickname === activeVote.ownerNickname ? 'owner' : 'participant';
      onOpenVoteForViewing(activeVote, mode, establishedNickname);
    
    }
  }

  const handleNicknameSubmit = () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (nickname.trim().length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다.');
      return;
    }
    if (nickname.trim() === establishedNickname) {
        setIsNicknameModalOpen(false);
        return;
    }

    setNicknameError('');
    setIsNicknameModalOpen(false);
  

  if (socketRef.current?.connected) {
    if (!establishedNickname) {
        socketRef.current.emit('set_nickname', nickname.trim());
    } else {
        socketRef.current.emit('change_nickname', nickname.trim());
    }

    setEstablishedNickname(nickname.trim());
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
                timestamp: dayjs().utc().toISOString(),

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
        {activeVote && (
          <div onClick={handleActiveVoteClick} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <ActiveVoteDisplay voteData={activeVote} />
          </div>
        )}

        <MessageList messages={messages} currentNickname={establishedNickname} />
        <MessageInput
          onInitiateCreateVote={() => onInitiateCreateVote(establishedNickname)} // establishedNickname 전달
          chatAutoInput={chatAutoInput}
          setChatAutoInput={setChatAutoInput}
          currentNickname={establishedNickname}
          onRequestNicknameChange={handleRequestNicknameChange}
          onSendMessage={handleSendMessage}
        />
      </S.ChatRoomStyle>
    </>
  );
}

export default ChatRoom;