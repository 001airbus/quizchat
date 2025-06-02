import { useEffect, useState } from 'react';
import { socket } from './socketManager';
import type { QuizState, VoteState } from '../../../common/types';

export const useUserHandler = () => {
    const [nickName, setNickName] = useState<string>('');

    useEffect(() => {
        socket.on('SEND_NICKNAME', sendNickName);
        socket.on('SEND_NICKNAME_SUCCESS', responseMessage);
        socket.on('SEND_JOINED', updateUserCnt);
        socket.on('SEND_JOINED_SUCCESS', joinRoom);
        socket.on('SEND_LEAVED', updateUserCnt);


        return () => {
            socket.off('SEND_NICKNAME', sendNickName);
            socket.off('SEND_NICKNAME_SUCCESS', responseMessage);
            socket.off('SEND_JOINED', updateUserCnt);
            socket.off('SEND_JOINED_SUCCESS', joinRoom);
            socket.off('SEND_LEAVED', updateUserCnt);
        };
    }, []);

    /* 유저 관련 */
    const requestJoinRoom = (nickName : string) => {
        console.log(`${nickName} 님이 방에 입장했습니다.`);
        socket.emit('JOIN_ROOM', { nickName : nickName });
    }

    const updateUserCnt = (data : { currentUsers : number, userId : number, nickName : string }) => {
        console.log(`${data.nickName} 님이 방에 참여했습니다. 현재 인원: ${data.currentUsers}`);
        // 프론트 TODO : 모든 클라이언트의 전체 유저 수를 업데이트 & 방 참여 또는 퇴장 알림
        // SEND_JOINED, SEND_LEAVED를 분리해도 무방
    }

    const joinRoom = (data : { userId : number, nickName : string, roomState : { quizState : QuizState, voteState : VoteState } }) => {
        console.log(`${data.nickName}님, 현재 퀴즈`)
        // 방 참여에 성공한 유저에게 roomState (quizState, voteState)를 전달
        // 프론트 TODO : 퀴즈나 투표가 있다면 해당 유저의 화면에 표시
    }

    /* 닉네임 변경 관련 */ 
    const sendNickName = (data : { userId : number, nickName : string}) => {
        console.log(`${data.userId}의 닉네임이 ${data.nickName}으로 변경됨`);
        // 프론트 TODO :해당 유저가 보낸 채팅의 닉네임 변경하는 로직 추라
    }

    const responseMessage = (data : { message : string }) => {
        alert(data.message);
    }

    const updateNickName = () => {
        // userId 체크하는 로직 필요
        if(nickName.trim() === '') {
          alert('닉네임을 입력해주세요.');
          return;
        }

        socket.emit('UPDATE_NICKNAME', { userId : 1, nickName : nickName });
        setNickName('');
    }

    return { nickName, setNickName, updateNickName, requestJoinRoom };
}