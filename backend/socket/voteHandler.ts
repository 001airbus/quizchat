import {Server, Socket} from "socket.io";
import type {StartVotePayload, VoteState} from "../common/types";
import {delRedisValue, getRedisValue, setRedisValue} from "../utils/redis";

let currentVote: VoteState | null = null;
let userVotes = new Map<number, Set<number>>();

async function loadCurrentVoteFromRedis(): Promise<VoteState | null> {
    const voteStateRaw = await getRedisValue('voteState');
    return voteStateRaw ? JSON.parse(voteStateRaw) : null;
}

async function saveCurrentVoteToRedis(voteState: VoteState | null){
    if(voteState){
        await setRedisValue('voteState', JSON.stringify(voteState), 60 * 60 * 24);
    }else{
        await delRedisValue('voteState');
    }
}

async function loadUserVotesFromRedis(): Promise<Map<number, Set<number>>>{
    const userVotesMap = new Map<number, Set<number>>();
    const allVotesRaw = await getRedisValue('user_votes_hash');

    if(allVotesRaw){
        const parsed = JSON.parse(allVotesRaw);
        for (const userIdStr in parsed){
            userVotesMap.set(parseInt(userIdStr, 10), new Set<number>(parsed[userIdStr]));
        }
    }

    return userVotesMap;
}

async function saveUserVotesToRedis(userVotes: Map<number, Set<number>>){
    const plainObject: {[key: number]: number[]} = {};
    userVotes.forEach((votedItems, userId) => {
        plainObject[userId] = Array.from(votedItems);
    });

    await setRedisValue('user_votes_hash', JSON.stringify(plainObject), 60 * 60 * 24);
}

export function handleVote(io: Server, socket: Socket) {
    socket.on('START_VOTE', async ({title, items, isMultiple}: StartVotePayload) => {
        currentVote = {
            userId: socket.data.userId,
            title,
            items: items.map(item => ({
                itemId: item.itemId,
                text: item.text,
                count: 0
            })),
            isActive: true,
            isMultiple,
            startedAt: Date.now(),
        };

        userVotes.clear();
        await delRedisValue('user_votes_hash');
        await saveCurrentVoteToRedis(currentVote);

        io.emit('START_VOTE', currentVote);
        io.emit('UPDATE_VOTE', currentVote);
    });

    socket.on('SUBMIT_VOTE', async (itemIds: number[]) => {
        const userId: number = socket.data.userId;

        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            console.warn('유효하지 않은 itemIds:', itemIds);
            return;
        }

        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
            userVotes = await loadUserVotesFromRedis();
        }

        if (!currentVote || !currentVote.isActive) {
            console.log('투표가 활성화되지 않음');
            return;
        }

        const validItemIds = itemIds.filter(itemId => {
            const exists = currentVote!.items.some(item => item.itemId === itemId);
            if (!exists) {
                console.warn(`존재하지 않는 itemId: ${itemId}`);
            }
            return exists;
        });

        if (validItemIds.length === 0) {
            console.warn('유효한 투표 항목이 없습니다');
            return;
        }

        const prevVotes = userVotes.get(userId) ?? new Set<number>();
        const nextVotes = new Set<number>();
        let hasVoteChanged = false;

        if (currentVote.isMultiple) {
            validItemIds.forEach(itemId => {
                nextVotes.add(itemId);
            });

            const prevArray = Array.from(prevVotes).sort();
            const nextArray = Array.from(nextVotes).sort();
            hasVoteChanged = JSON.stringify(prevArray) !== JSON.stringify(nextArray);

        } else {
            const newItemId = validItemIds[0];

            nextVotes.add(newItemId);
            hasVoteChanged = prevVotes.size !== 1 || !prevVotes.has(newItemId);
        }

        if (hasVoteChanged) {
            if (nextVotes.size === 0) {
                userVotes.delete(userId);
            } else {
                userVotes.set(userId, nextVotes);
            }

            currentVote.items.forEach(item => {
                item.count = 0;
            });

            userVotes.forEach(votedItems => {
                votedItems.forEach(itemId => {
                    const item = currentVote!.items.find(i => i.itemId === itemId);
                    if (item) {
                        item.count++;
                    }
                });
            });

            await saveCurrentVoteToRedis(currentVote);
            await saveUserVotesToRedis(userVotes);

            io.emit('UPDATE_VOTE', currentVote);
        }
    });

    socket.on('END_VOTE', async () => {
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
        }

        if(currentVote && currentVote.isActive) {
            currentVote.isActive = false;
            currentVote = null;
            userVotes.clear();

            await saveCurrentVoteToRedis(null);
            await delRedisValue('user_votes_hash');

            io.emit('END_VOTE', null);
        }
    });
    socket.on('EDIT_VOTE', async ({title, items, isMultiple}: StartVotePayload) => {
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
        }

        if (!currentVote || !currentVote.isActive) {
            console.log('수정할 투표가 없거나 비활성화됨');
            return;
        }

        // 투표 생성자만 수정 가능하도록 권한 체크
        if (currentVote.userId !== socket.data.userId) {
            console.log('투표 수정 권한 없음');
            return;
        }

        // 투표 정보 업데이트 (기존 투표 수를 유지하면서)
        const updatedItems = items.map(newItem => {
            const existingItem = currentVote!.items.find(item => item.itemId === newItem.itemId);
            return {
                itemId: newItem.itemId,
                text: newItem.text,
                count: existingItem ? existingItem.count : 0 // 기존 투표 수 유지
            };
        });

        currentVote = {
            ...currentVote,
            title,
            items: updatedItems,
            isMultiple
        };

        await saveCurrentVoteToRedis(currentVote);

        // 모든 클라이언트에게 수정된 투표 정보 전송
        io.emit('EDIT_VOTE', currentVote);
        io.emit('UPDATE_VOTE', currentVote);
    });

    socket.on('GET_CURRENT_VOTE', async () => {
        if (!currentVote) {
            currentVote = await loadCurrentVoteFromRedis();
            userVotes = await loadUserVotesFromRedis();
        }

        if (currentVote) {
            socket.emit("CURRENT_VOTE", currentVote);
        }
    });
}