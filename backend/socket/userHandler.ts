import { Server, Socket } from "socket.io";
import { getRedisValue, setRedisValue } from '../utils/redis';

interface userPayload {
    userId?: number;
    nickName : string;
};

export function handleUser(io : Server, socket : Socket) {
    socket.on('UPDATE_NICKNAME', async ({ nickName } : userPayload) => {
        const userId = socket.data.userId;
        const prevNickName = socket.data.nickName;

        if(prevNickName === nickName){
            socket.emit('SEND_NICKNAME_FAIL', { message : '현재 닉네임과 동일합니다.'});
            return;
        }

        socket.data.nickName = nickName;

        io.emit('SEND_NICKNAME', { userId : userId, prevNickName : prevNickName, newNickName : nickName });
        socket.emit('SEND_NICKNAME_SUCCESS', { message : '닉네임이 성공적으로 변경되었습니다.', newNickName : nickName });
    });

    socket.on('JOIN_ROOM', async ({ nickName } : userPayload) => {
        if(socket.data.userId){
            return;
        }

        const nextUserId = await getRedisValue('nextUserId') || 1;
        const userId = nextUserId;
        setRedisValue('nextUserId', (Number(nextUserId) + 1).toString());

        socket.data.userId = userId;
        socket.data.nickName = nickName;
        socket.data.hasJoined = true;

        const currentUsers = await getRedisValue('currentUsers');
        const userCnt = currentUsers ? parseInt(currentUsers) + 1 : 1;
        setRedisValue('currentUsers', userCnt.toString());

        io.emit('SEND_JOINED', {
            currentUsers : userCnt,
            userId : userId,
            nickName : nickName,
        });

        const quizStateRaw = await getRedisValue('quizState');
        const voteStateRaw = await getRedisValue('voteState');
        const quizState = quizStateRaw ? JSON.parse(quizStateRaw) : null;
        const voteState = voteStateRaw ? JSON.parse(voteStateRaw) : null;

        socket.emit('SEND_JOINED_SUCCESS', {
            userId : socket.data.userId,
            nickName : socket.data.nickName,
            roomState : {
                quizState : {
                    isActive : quizState ? quizState.isActive : false,
                    question : (quizState && quizState.isActive) ? quizState.quizData.question : '',
                    isEnded : quizState ? quizState.isEnded : false,
                },
                voteState,
            }
        });
    });

    socket.on('LEAVE_ROOM', async () => {
        if(socket.data.userId) {
            userLeave(io, socket);
        }
    });
}

export const userLeave = async (io : Server, socket : Socket) : Promise<void> => {
    const currentUsers = await getRedisValue('currentUsers');
    const userCnt = currentUsers ? Math.max(parseInt(currentUsers) - 1, 0) : 0; 
    await setRedisValue('currentUsers', userCnt.toString());

    io.emit('SEND_LEAVED', {
        currentUsers : userCnt,
        userId : socket.data.userId,
        nickName : socket.data.nickName,
    });
}