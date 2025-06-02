import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:8888';
// const [socket, setSocket] = useState<Socket | null>(null);

// 소켓 생성
export const socket = io(SOCKET_SERVER_URL, {
    withCredentials: true,
});

// 소켓 연결 이벤트
socket.on('connect', () => {
    console.log('서버에 연결됨!');
});

socket.on('disconnect', () => {
    console.log('서버 연결 끊김');
});

socket.on('error', (err) => {
    console.error('소켓 에러:', err);
});