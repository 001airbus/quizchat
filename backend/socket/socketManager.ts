import { Server, Socket } from "socket.io";
import { handleUser, userLeave } from "./userHandler";
import { handleQuiz } from "./quizHandler";
import { handleMessage } from './messageHandler';
import { handleVote } from './voteHandler';
import { setRedisValue } from "../utils/redis";

export const setupSocketIO = (io : Server) => {
    io.on('connection', async (socket : Socket) => {
        console.log('새로운 클라이언트 연결됨');
        socket.data.hasJoined = false;
        
        const connectedSockets = await io.fetchSockets();
        const actualUserCount = connectedSockets.filter(s => s.data.hasJoined).length;

        await setRedisValue('currentUsers', actualUserCount.toString());

        socket.on('disconnecting', () => {
            if(socket.data.hasJoined){ 
                userLeave(io, socket);
            }
        });

        socket.on('error', (error) => {
            console.error('소켓 에러:', error);
        });

        handleUser(io, socket);
        handleMessage(io, socket);
        handleVote(io, socket);
        handleQuiz(io, socket);
    });
}