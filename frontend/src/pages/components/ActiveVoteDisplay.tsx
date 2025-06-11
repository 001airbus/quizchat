import styled from "styled-components";
import type { VoteData } from "./VoteModal";

interface ActiveVoteDisplayProps {
    voteData: VoteData;
}
function ActiveVoteDisplay({ voteData }: ActiveVoteDisplayProps) {
    const totalVotes = voteData.options.reduce((sum, option) => sum + (option.count || 0), 0);
    return (
        <ActiveVoteContainer>
            <VoteTitle>🗳️ "{voteData.title}" 투표가 진행중입니다!</VoteTitle>
            <VoteInfo>
                {voteData.allowMultipleSelections ? "복수 선택 가능" : "단일 선택"}
                {voteData.isAnonymous && ", 익명 투표"}

                {totalVotes > 0 && `, 현재 ${totalVotes}명 참여`}
            </VoteInfo>
            {/* 필요에 따라 더 많은 정보 (예: 참여 버튼)를 추가할 수 있습니다. */}
        </ActiveVoteContainer>
    );
}

const ActiveVoteContainer = styled.div`
    width: 80vw;

    border-radius: 10px;
    border: 1px solid #DDE3EB;
    background: #FFF;
    box-shadow: 0px 4px 4px 0px rgba(224, 212, 253, 0.25);
    padding: 12px 16px;
    margin: 10px 0;
    text-align: center;
`;

const VoteTitle = styled.h3`
    color: #5a8bd9; /* 테마 색상 */
    font-size: 16px;
    font-weight: 600;
`;
const VoteInfo = styled.p`
    font-size: 12px;
    color: #5f6b7a;
    margin: 0;
`;


export default ActiveVoteDisplay;
