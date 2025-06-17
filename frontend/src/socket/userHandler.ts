import { useEffect } from 'react';
import { socket } from './socketManager';
import {useUserStore} from "@/store/useUserStore";
import type { VoteState, QuizState } from '@/common/types';
import {useVoteStore} from "@/store/useVoteStore";
import { useQuizStore } from "@/store/useQuizStore";
import { initializeQuizSocket } from './quizHandler';
import {useTimerStore} from "@/store/useTimerStore";
let isSocketInitialized = false;

export const useUserHandlers = () => {
    const { nickName, userId, setNickName, setSystemMessage,setUserId} = useUserStore();
    const { setCurrentUsers, updateSenderNickName } = useUserStore.getState();
    
    const { setQuizState } = useQuizStore.getState();
    const { setVoteState,updateFromServer} = useVoteStore();
    const { startTimer } = useTimerStore();
    useEffect(() => {
        if (isSocketInitialized) return;
        isSocketInitialized = true;

        socket.on('SEND_NICKNAME', sendNickName); // 전체 메세지
        socket.on('SEND_NICKNAME_SUCCESS', responseMessage); // 요청한 사람한테만
        socket.on('SEND_NICKNAME_FAIL', responseMessage);
        socket.on('SEND_JOINED', userJoined);
        socket.on('SEND_JOINED_SUCCESS', joinRoom);
        socket.on('SEND_LEAVED', userLeaved);

        return () => {
            socket.off('SEND_NICKNAME', sendNickName);
            socket.off('SEND_NICKNAME_SUCCESS', responseMessage);
            socket.off('SEND_NICKNAME_FAIL', responseMessage);
            socket.off('SEND_JOINED', userJoined);
            socket.off('SEND_JOINED_SUCCESS', joinRoom);
            socket.off('SEND_LEAVED', userLeaved);
            isSocketInitialized = false;
        };
    }, []);

    const requestJoinRoom = (data: { nickName: string}) => {
        socket.emit('JOIN_ROOM', { nickName: data.nickName});
    };

    const userLeaved = (data: { currentUsers: number, userId: number, nickName: string }) => {
        setCurrentUsers(data.currentUsers);
        setSystemMessage(`'${data.nickName}' 님이 퇴장하셨습니다.`);
    }

    const userJoined = (data: { currentUsers: number; userId: number; nickName: string }) => {
        setCurrentUsers(data.currentUsers);
        setSystemMessage(`'${data.nickName}' 님이 입장하셨습니다.`);
    };
    const joinRoom = (data: {
        userId: number,
        nickName: string,
        roomState: { quizState: QuizState, voteState: VoteState }
    }) => {
        console.log("[joinRoom] 전달받은 데이터:", data);
        if(data.roomState.quizState){
            setQuizState(data.roomState.quizState);
        }
        setUserId(data.userId);
        if(data.roomState.voteState){
            updateFromServer(data.roomState.voteState);
            setVoteState(data.roomState.voteState);

            const voteState = data.roomState.voteState;
            if (voteState.isActive && voteState.startedAt) {
                const remainingTime = 60 - Math.floor((Date.now() - voteState.startedAt) / 1000);
                if (remainingTime > 0) {
                    console.log(`[joinRoom] 타이머 시작: ${remainingTime}초 남음`);
                    useVoteStore.getState().setStartedAt(voteState.startedAt);
                    startTimer(remainingTime);
                }
            }}
        useVoteStore.getState().setCurrentUserId(data.userId);
        initializeQuizSocket()
    };

    /* 닉네임 변경 관련 */
    const sendNickName = (data: { userId: number, prevNickName: string, newNickName: string }) => {
        updateSenderNickName(data.userId, data.newNickName);
        setSystemMessage(`'${data.prevNickName}' 님이 '${data.newNickName}' 님으로 이름이 변경되었습니다.`);
    }

    const responseMessage = (data: { message: string, newNickName?: string }) => {
        alert(data.message);
        
        if(data.newNickName){
            setNickName(data.newNickName);
        }
    }

    const updateNickName = (data: { nickName: string }) => {
        const trimmed = data.nickName.trim();
        if (trimmed === '') {
            alert("닉네임이 빈칸입니다.");
            return;
        }

        socket.emit('UPDATE_NICKNAME', { nickName: trimmed });
    }

    return {nickName, setNickName, updateNickName, requestJoinRoom, userJoined, userLeaved,joinRoom};
}