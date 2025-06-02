import { Server, Socket } from "socket.io";
import { getRedisValue, setRedisValue } from '../utils/redis';

let nextUserId = 1;

interface userPayload {
    userId?: number;
    nickName : string;
};

export function handleUser(io : Server, socket : Socket) {
    socket.on('UPDATE_NICKNAME', async ({ userId, nickName } : userPayload) => {
        console.log('닉네임 변경 요청:', userId, nickName);
        socket.data.nickName = nickName;
        io.emit('SEND_NICKNAME', { userId : userId, nickName : nickName });
        socket.emit('SEND_NICKNAME_SUCCESS', { message : '닉네임이 성공적으로 변경되었습니다.'});
    });

    socket.on('JOIN_ROOM', async ({ nickName } : userPayload) => {
        console.log('채팅방 참여 요청', nickName)
        const userId = nextUserId++;

        socket.data.userId = userId;
        socket.data.nickName = nickName;

        const currentUsers = await getRedisValue('currentUsers');
        const userCnt = currentUsers ? parseInt(currentUsers) + 1 : 1;
        setRedisValue('currentUsers', userCnt.toString(), 60 * 60);
        
        // 이 때 잔여 인원 수를 함께 전달 (Redis)
        io.emit('SEND_JOINED', { 
            currentUsers : userCnt,
            userId : userId,
            nickName : nickName,
        });
        
        // 퀴즈/투표가 진행중인지, 진행중이라면 내용을 전달 (Redis)
        const quizStateRaw = await getRedisValue('quizState');
        const voteStateRaw = await getRedisValue('voteState');
        const quizState = quizStateRaw ? JSON.parse(quizStateRaw) : null;
        const voteState = voteStateRaw ? JSON.parse(voteStateRaw) : null;

        // JOIN_ROOM 을 보낸 클라이언트에게만 전달
        socket.emit('SEND_JOINED_SUCCESS', {
            userId : socket.data.userId,
            nickName : socket.data.nickName,
            roomState : {
                quizState,
                voteState,
            }
        });
    });

    socket.on('LEAVE_ROOM', async ({ userId, nickName } : userPayload) => {
        if(userId) {
            userLeave(io, socket);
        }
    });
}

export const userLeave = async (io : Server, socket : Socket) : Promise<void> => {
    console.log('방 나가기', socket.data.userId);
    const currentUsers = await getRedisValue('currentUsers');
    const userCnt = currentUsers ? parseInt(currentUsers) - 1 : 0;
    setRedisValue('currentUsers', userCnt.toString(), 60 * 60);

    io.emit('SEND_LEAVED', { 
        currentUsers : userCnt,
        userId : socket.data.userId,
        nickName : socket.data.nickName,
    });
}
