import { Server, Socket } from 'socket.io';
import type { StartVotePayload, VoteState } from '../../common/types';
import { getRedisValue, setRedisValue, delRedisValue } from '../utils/redis';

let currentVote: VoteState | null = null;

// Redis : 최신 투표 상태 로드
async function loadCurrentVoteFromRedis(): Promise<VoteState | null> {
    const voteStateRaw = await getRedisValue('vote_state');
    return voteStateRaw ? JSON.parse(voteStateRaw) : null;
}

// Redis : 투표 상태 저장
async function saveCurrentVoteToRedis(voteState: VoteState | null){
    if(voteState){
        await setRedisValue('vote_state', JSON.stringify(voteState), 60 * 60 * 24); // 24시간 유지
    }else{
        await delRedisValue('vote_state'); // 투표 종료 시 삭제
    }
}

// Redis : 모든 유저의 투표 로드
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

// Redis : 모든 유저의 투표 저장
async function saveUserVotesToRedis(userVotes: Map<number, Set<number>>){
    const plainObject: {[key: number]: number[]} = {};
    userVotes.forEach((votedItems, userId) => {
        plainObject[userId] = Array.from(votedItems);
    });
    await setRedisValue('user_votes_hash', JSON.stringify(plainObject), 60 * 60 * 24); // 24시간 유지
}

// 
function validateItem(currentVote: VoteState, itemId: number, userId: number): boolean {
    const isValidItem = currentVote.items.some(item => item.itemId === itemId);
    if(!isValidItem){
        console.warn(userId, ':유효하지 않은 투표 항목 ', itemId);
    }
    return isValidItem;
}

export function handleVote(io: Server, socket: Socket) {
    // 투표 생성(시작)
    socket.on('START_VOTE', async ({title, items, isMultiple}: StartVotePayload) => {
        console.log('투표 시작:', {title, items, isMultiple});
        currentVote = {
            title,
            items: items.map(item => ({
                itemId: item.itemId,
                text: item.text,
                count: 0
            })),
            isActive: true,
            isMultiple
        };

        // userVotes.clear();
        await delRedisValue('user_votes_hash'); // 모든 유저 투표 기록 삭제
        await saveCurrentVoteToRedis(currentVote); // Redis에 현재 투표 상태 저장

        io.emit('UPDATE_VOTE', currentVote);
    });

    // 투표 참여
    socket.on('SUBMIT_VOTE', async (itemIds: number[]) => {
        const userId: number = socket.data.userId;
        
        currentVote = await loadCurrentVoteFromRedis(); // Redis에서 현재 투표 상태 로드
        const userVotes = await loadUserVotesFromRedis(); // Redis에서 모든 유저 투표 기록 로드

        if(!currentVote || !currentVote.isActive) return;

        console.log('투표 참여:', itemIds);

        const prevVotes = userVotes.get(userId) ?? new Set<number>();
        const nextVotes = new Set<number>();
        let hasVoteChanged = false;

        const validItemIds = itemIds.filter(itemId => validateItem(currentVote!, itemId, userId));

        if(currentVote.isMultiple){ // 중복 투표 모드
            for(const itemId of validItemIds){
                nextVotes.add(itemId);
            }
            const prevArray = Array.from(prevVotes);
            const nextArray = Array.from(nextVotes);
            hasVoteChanged = !(prevArray.length === nextArray.length && prevArray.every(item => nextVotes.has(item)))
        }else{ // 단일 투표 모드
            const newItemId = itemIds[0];

            if(prevVotes.has(newItemId) && validItemIds.length ===1){ // 이미 투표한 항목을 다시 선택한 경우
                nextVotes.clear();
                hasVoteChanged = true;
            }else if(validItemIds.length === 1){ // 새 항목 선택
                nextVotes.add(newItemId);
                hasVoteChanged = true;
            }else{ // 유효하지 않은 항목 선택 or 여러 항목 선택 -> 무시
                hasVoteChanged = false; 
            }
        }

        // 변경 사항이 있을 때만 처리
        if(hasVoteChanged) {
            userVotes.set(userId, nextVotes); // userId 기준으로 투표 기록 업데이트
            currentVote.items.forEach(item => {item.count = 0;}); // 모든 항목 카운트 초기화

            // 모든 유저의 투표 다시 집계계
            userVotes.forEach(votedItems => {
                votedItems.forEach(itemId => {
                    const item = currentVote!.items.find(i => i.itemId === itemId);
                    if(item) item.count++;
                });
            });

            await saveCurrentVoteToRedis(currentVote); // Redis에 현재 투표 상태 저장
            await saveUserVotesToRedis(userVotes); // Redis에 모든 유저 투표 기록 저장

            io.emit('UPDATE_VOTE', currentVote);
        }
    });

    // 투표 종료
    socket.on('END_VOTE', async () => {
        currentVote = await loadCurrentVoteFromRedis(); // Redis에서 현재 투표 상태 로드

        if(currentVote && currentVote.isActive) {
            currentVote.isActive = false;
            
            await saveCurrentVoteToRedis(null); // Redis에서 투표 상태 삭제
            await delRedisValue('user_votes_hash'); // 모든 유저 투표 기록 삭제

            console.log('투표 종료', currentVote);
            io.emit('END_VOTE', currentVote);
        }
    });
}