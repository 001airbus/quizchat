import { socket } from "./socketManager";
import {useEffect, useState} from "react";
import type { VoteItem, VoteState } from "@/common/types";
import { useVoteStore } from "@/store/useVoteStore";
import { sendSystemMessage } from "./messageHandler";
import {useTimerStore} from "@/store/useTimerStore";
import {useChatStore} from "@/store/useChatStore";

let isVoteSocketInitialized = false;

export const useVoteHandler = () => {
    const { setVoteState , setIsTimerActive} = useVoteStore();
    const { setSystemMessages } = useChatStore();

    const [showResult, setShowResult] = useState(false);
    const {
        voteState,
        resetVote,
        isVoteCreator,
        voteItems
    } = useVoteStore();
    const isCreator = isVoteCreator();
    const { resetTimer,startTimer } = useTimerStore();
    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    const updateFromServer=useVoteStore((state) => state.updateFromServer);
//   const { sendSystemMessage } = useMessageHandler();
    const handleTimerStart = (voteData: VoteState) => {
        const remainingTime = 60 - Math.floor((Date.now() - voteData.startedAt) / 1000);
        if (remainingTime > 0) {
            console.log(`[타이머 시작] ${remainingTime}초 남음`);
            useVoteStore.getState().setStartedAt(voteData.startedAt);
            startTimer(remainingTime);
        }
    };
    
    useEffect(() => {
        if (isVoteSocketInitialized) return;
        isVoteSocketInitialized = true;
        socket.emit("GET_CURRENT_VOTE");

        socket.on("START_VOTE", (data: VoteState) => {
            console.log("[소켓] START_VOTE 수신:", data);
            setVoteState(data);
            updateFromServer(data);
            useVoteStore.getState().setVoteState(data);
            useVoteStore.getState().updateFromServer(data);
            const remainingTime = 60 - Math.floor((Date.now() - data.startedAt) / 1000);

            if (data.isActive && data.startedAt) {
                handleTimerStart(data);
            }
        });
        socket.on("CURRENT_VOTE", (data: VoteState) => {
            setVoteState(data);
            updateFromServer(data);
            console.log("[소켓] CURRENT_VOTE 수신:", data);
            const remainingTime = 60 - Math.floor((Date.now() - data.startedAt) / 1000);
            if (data.isActive && data.startedAt) {
                handleTimerStart(data);
            }
        });
        // 투표 업데이트 이벤트
        socket.on('UPDATE_VOTE', (data: VoteState) => {
            setVoteState(data);
            updateFromServer(data);
        });
        // 투표 종료 이벤트
        socket.on('END_VOTE', (data: VoteState) => {
            setVoteState(data);
            setIsTimerActive(false);
            resetVote()
        });

        return () => {
            socket.off("START_VOTE");
            socket.off('UPDATE_VOTE');
            socket.off('END_VOTE');
            isVoteSocketInitialized = false;
        };
    }, []);

    const startVote = (data: { title: string, items: VoteItem[], isMultiple: boolean }) => {
        sendSystemMessage({
            items: [],
            type: "voteStart",
            time: Date.now(),
        });

        socket.emit('START_VOTE', data);
    };

    // 투표 참여
    const submitVote = (itemIds: number[]) => {
        socket.emit('SUBMIT_VOTE',  itemIds);
    };

    const endVote = (items:VoteItem[]) => {
        sendSystemMessage({
            items: [],
            type: "voteEnd",
            time: Date.now(),
        });

        sendSystemMessage({
            items: items,
            type: "voteResult",
            time: Date.now(),
        });
        socket.emit('END_VOTE');
    };

    return { startVote, submitVote, endVote };
};