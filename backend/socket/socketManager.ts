import { Server, Socket } from "socket.io";
import { handleUser, userLeave } from "./userHandler";
import { handleQuiz } from "./quizHandler";
import { handleMessage } from './messageHandler';
import { handleVote } from './voteHandler';

export const setupSocketIO = (io : Server) => {
    io.on('connection', (socket : Socket) => {
        console.log('새로운 클라이언트 연결됨');

        // 연결이 끊어졌을 때
        socket.on('disconnect', () => {
            console.log('클라이언트 연결 끊김');
            userLeave(io, socket);
        });

        // 에러 발생 시
        socket.on('error', (error) => {
            console.error('소켓 에러:', error);
        });

        // handler 등록
        handleMessage(io, socket);
        handleVote(io, socket);
        handleUser(io, socket);
        handleQuiz(io, socket);
    });
}