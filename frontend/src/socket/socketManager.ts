import { io } from 'socket.io-client';
const SOCKET_SERVER_URL = import.meta.env.VITE_BACK_SERVER_URL;

export const socket = io(SOCKET_SERVER_URL, {
    withCredentials: true,
});

socket.on('connect', () => {
    console.log('서버에 연결됨!');
});

socket.on('disconnect', () => {
    console.log('서버 연결 끊김');
});

socket.on('error', (err) => {
    console.error('소켓 에러:', err);
});