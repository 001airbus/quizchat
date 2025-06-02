import { socket } from "./socketManager";
import { useEffect, useState } from "react";
import type { VoteItem, VoteState } from '../../../common/types';

export const useVoteHandler = () => {
    const [vote, setVote] = useState<VoteState | null>(null);
    // const [selectedItem, setSelectedItem] = useState<string | null>(null);

    useEffect(() => {
        // 투표 업데이트
        socket.on('UPDATE_VOTE', (data: VoteState) => {
            console.log('투표 업데이트:', data);
            setVote(data);
        });

        // 투표 종료
        socket.on('END_VOTE', (data: VoteState) => {
            console.log('투표 종료:', data);
            setVote(data);
        });

        return () => {
            socket.off('UPDATE_VOTE');
            socket.off('END_VOTE');
        };
    }, []);

    const startVote = (title: string, items: VoteItem[], isMultiple: boolean) => {
        socket.emit('START_VOTE', {title, items, isMultiple});
    };

    const submitVote = (itemIds: number[]) => {
        socket.emit('SUBMIT_VOTE', itemIds);
    };

    const endVote = () => {
        socket.emit('END_VOTE');
    };

    return { vote, startVote, submitVote, endVote };
};