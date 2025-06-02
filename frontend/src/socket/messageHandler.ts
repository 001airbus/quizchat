import { useEffect, useState } from 'react';
import { socket } from './socketManager';
import type { MessagePayload } from '../../../common/types';

export const useMessageHandler = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<MessagePayload[]>([]);

    const [userId, setUserId] = useState<number>(1); // 임시 사용자 ID
    const [nickName, setNickName] = useState<string>('tester'); // 임시 사용자 닉네임

    useEffect(() => {
        // 메시지 수신
        socket.on('RECEIVE_MESSAGE', (msg: MessagePayload) => {
            console.log('서버로부터 메시지 수신:', msg);
            setMessages(prevMessages => [...prevMessages, msg]); 
        });

        return () => {
            socket.off('RECEIVE_MESSAGE');
        };
    }, []);

    const sendMessage = () => {
        if (socket && message.trim() !== '') {
            const sendMessage: MessagePayload = {
                userId: userId,
                nickName: nickName,
                content: message,
                timestamp: new Date().toISOString()
            };

            setMessages(prevMessages => [...prevMessages, sendMessage]);

            socket.emit('SEND_MESSAGE', message);
            setMessage('');

            setMessage(''); // 메시지 전송 후 입력 필드 초기화
        }
    };

    return { message, setMessage, messages, sendMessage};
}