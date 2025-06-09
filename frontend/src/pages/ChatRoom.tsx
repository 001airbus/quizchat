import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import  * as S from './ChatRoom.style'
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import Button from '../components/Button';
import Input from '../components/Input';

export interface ChatMessage {
    id: string; // 메시지 고유 id
    nickname: string;
    text: string;
    timestamp: string;
}

type ChatRoomProps = {
    onInitiateCreateVote: () => void;
    chatAutoInput: string;
    setChatAutoInput: React.Dispatch<React.SetStateAction<string>>;
}

function ChatRoom({onInitiateCreateVote, chatAutoInput, setChatAutoInput} : ChatRoomProps){
    const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(true);
    const [nickname, setNickname] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    // 더미 메시지
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'dummy-1',
            nickname: '나의닉네임',
            text: '이것은 내가 보낸 더미 메시지입니다.',
            timestamp: new Date().toISOString(),
        },
        {
            id: 'dummy-2',
            nickname: '다른사용자', // 다른 사용자의 닉네임
            text: '이것은 다른 사용자가 보낸 더미 메시지입니다.',
            timestamp: new Date().toISOString(),
        },
    ]);

    const webSocket = useRef<WebSocket | null>(null);

    useEffect(() => {
        // 닉네임이 설정된 후에 웹소켓 연결 시도
        if (nickname && !webSocket.current) {
            // 백엔드 서버 배포 URL로 변경합니다.
            // 서버가 특정 경로를 사용한다면 해당 경로를 추가해야 합니다. 예: /ws 또는 /chat
            const ws = new WebSocket('ws://ec2-3-35-99-106.ap-northeast-2.compute.amazonaws.com:3000/YOUR_WEBSOCKET_PATH'); // YOUR_WEBSOCKET_PATH를 실제 경로로 변경

            ws.onopen = () => {
                console.log('WebSocket Connected');
                // 서버에 사용자 정보 전송 (예: 닉네임)
                ws.send(JSON.stringify({ type: 'join', nickname: nickname }));
            };

            ws.onmessage = (event) => {
                try {
                    const receivedMessage = JSON.parse(event.data as string);
                    // 서버에서 오는 메시지 형식에 따라 ChatMessage 타입으로 변환
                    // 예시: 서버가 ChatMessage 형식을 그대로 보내거나,
                    //       type 필드를 통해 메시지 종류를 구분할 수 있습니다.
                    if (receivedMessage.type === 'message') {
                        setMessages((prevMessages) => [...prevMessages, receivedMessage.payload as ChatMessage]);
                    } else if (receivedMessage.type === 'history') { // 예시: 이전 대화내역
                        setMessages(receivedMessage.payload as ChatMessage[]);
                    }
                    // 다른 타입의 메시지 처리 (예: 사용자 입장/퇴장 알림)
                } catch (error) {
                    console.error('Error parsing message or invalid message format:', event.data, error);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                webSocket.current = null; // 연결 종료 시 참조 제거
            };

            webSocket.current = ws;
        }

        // 컴포넌트 언마운트 시 또는 닉네임 변경으로 재연결 필요 시 웹소켓 연결 해제
        return () => {
            if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
                webSocket.current.close();
            }
        };
    }, [nickname]); // nickname이 변경되면 useEffect 재실행 (연결 재시도 로직 포함 가능)

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

        // 더미 메시지의 '나의닉네임'을 실제 사용자가 입력한 닉네임으로 업데이트
        setMessages(prevMessages => prevMessages.map(msg => msg.id === 'dummy-1' ? { ...msg, nickname: nickname } : msg));
    };

    const handleRequestNicknameChange = () => {
        setIsNicknameModalOpen(true);
    };

    const handleSendMessage = (text: string) => {
        if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN && text.trim()) {
            const messageToSend: Omit<ChatMessage, 'id' | 'timestamp'> & { type: string } = {
                type: 'message',
                nickname: nickname,
                text: text,
            };
            webSocket.current.send(JSON.stringify(messageToSend));
        } else {
            console.error('WebSocket is not connected or message is empty.');
        }
    };

    return(
        <>
            <Modal
                isOpen={isNicknameModalOpen}
                title='사용할 닉네임을 입력해주세요.'
                onClose={() => {}}
            >
                <Input
                    placeholder='닉네임 (2자 이상)'
                    variant='primary'
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                {nicknameError && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{nicknameError}</p>}
                <Button onClick={handleNicknameSubmit} text='확인' />
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
    )
}

export default ChatRoom;