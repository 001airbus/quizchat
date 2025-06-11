import { useState } from "react";
import ChatRoom from "./pages/ChatRoom";
import { GlobalStyle } from "./styles/global.style";
import VoteModal from "./pages/components/VoteModal";
import type { VoteData } from "./pages/components/VoteModal"; // VoteData 타입 임포트

function App() {

  // 투표 모달 상태관리
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [voteMode, setVoteMode] = useState<'create' | 'owner' | 'participant'>('create');
  const [activeVote, setActiveVote] = useState<VoteData | null>(null);
  const [voteOwnerNickname, setVoteOwnerNickname] = useState<string | undefined>(undefined);
  const [lastVoteEvent, setLastVoteEvent] = useState<{
    type: 'closed';
    title: string;
    winningOptions?: string[];
    maxVotes?: number;
    noVotes?: boolean;
  } | null>(null);
  const [currentUserForVote, setCurrentUserForVote] = useState<string | undefined>(undefined);

  // 퀴즈 상태관리
  const [chatAutoInput, setChatAutoInput] = useState("");

  const handleInitiateCreateVote = (currentEstablishedNickname? : string) => {
    setVoteMode('create');
    setVoteOwnerNickname(currentEstablishedNickname);
    setCurrentUserForVote(currentEstablishedNickname);
    setIsVoteModalOpen(true);
  };

  const handleCreateVoteSuccess = (newVoteData: Omit<VoteData, 'ownerNickname' | 'id'>) => {
    const voteDataWithDetails: VoteData = {
      id: `vote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // 고유 ID 생성

      ...newVoteData,
      ownerNickname: voteOwnerNickname,
      voters: {},
    };
    setActiveVote(voteDataWithDetails);
    setIsVoteModalOpen(false);
    setVoteOwnerNickname(undefined);
  };

  const handleUpdateVoteSuccess = (updatedVoteData: VoteData) => {
    setActiveVote(updatedVoteData);
    setIsVoteModalOpen(false);
  };

  const handleCloseVoteRequest = (voteTitle: string) => {
    let winningOptionsTexts: string[] = [];
    let maxVotes = 0;
    let noVotesCast = true;

    if (activeVote && activeVote.options.length > 0) {
      // 총 투표 수 확인 및 최대 득표수 계산
      const totalVotesOnOptions = activeVote.options.reduce((sum, opt) => sum + (opt.count || 0), 0);
      if (totalVotesOnOptions > 0) {
        noVotesCast = false;
        activeVote.options.forEach(option => {
          const currentCount = option.count || 0;
          if (currentCount > maxVotes) {
            maxVotes = currentCount;
            winningOptionsTexts = [option.text];
          } else if (currentCount === maxVotes && currentCount > 0) {
            winningOptionsTexts.push(option.text);
          }
        });
      }
    }

    setActiveVote(null);
    setLastVoteEvent({
      type: 'closed',
      title: voteTitle,
      winningOptions: noVotesCast ? undefined : winningOptionsTexts,
      maxVotes: noVotesCast ? undefined : maxVotes,
      noVotes: noVotesCast,
    });
    setIsVoteModalOpen(false); // 그 다음에 모달을 닫음
  };

  const handleVoteEventProcessed = () => {
    setLastVoteEvent(null);
  };

  const handleSubmitVote = (voteId: string, selectedOptionIndices: number[]) => {
    if (!activeVote || activeVote.id !== voteId) {
      console.error("투표 제출 오류: 활성 투표를 찾을 수 없거나 ID가 일치하지 않습니다.", { voteId, activeVoteId: activeVote?.id });
      console.error("투표 제출 오류: 활성 투표 ID 불일치", { voteId, activeVoteId: activeVote?.id });
      return;
    }
    if (!currentUserForVote) {
      console.error("투표 제출 오류: 현재 사용자 닉네임이 없습니다.");
      return;
    }

    const newOptions = activeVote.options.map(opt => ({ ...opt })); // 옵션 배열 복사
    const newVoters = activeVote.voters ? { ...activeVote.voters } : {};

    // 사용자의 이전 투표가 있었는지 확인하고, 있었다면 이전 투표 수 감소
    const previousUserSelection = newVoters[currentUserForVote];
    if (previousUserSelection) {
      previousUserSelection.forEach(idx => {
        if (newOptions[idx]) {
          newOptions[idx].count = Math.max(0, (newOptions[idx].count || 0) - 1);
        }
      });
    }

    // 새로운 투표 수 증가
    selectedOptionIndices.forEach(idx => {
      if (newOptions[idx]) {
        newOptions[idx].count = (newOptions[idx].count || 0) + 1;
      }
    });

    // 사용자의 투표 기록 업데이트 (이전 투표 여부와 관계없이 항상 실행)
    newVoters[currentUserForVote] = selectedOptionIndices;

    const updatedVoteData: VoteData = {
      ...activeVote,
      options: newOptions,
      voters: newVoters,
    };
    setActiveVote(updatedVoteData);
    setIsVoteModalOpen(false); // 투표 후 모달 닫기
  };

  return (
    <>
      <GlobalStyle />
      <ChatRoom
        onInitiateCreateVote={handleInitiateCreateVote}
        chatAutoInput={chatAutoInput} // chatAutoInput 상태 값 전달
        setChatAutoInput={setChatAutoInput}
        activeVote={activeVote}
        onOpenVoteForViewing={(voteData, mode, nickname) => {
          setVoteMode(mode);
          setCurrentUserForVote(nickname);
          setIsVoteModalOpen(true);
        }}
        lastVoteEvent={lastVoteEvent}
        onVoteEventProcessed={handleVoteEventProcessed}
      />
      
      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => {
          setIsVoteModalOpen(false);
          setCurrentUserForVote(undefined);
        }}
        mode={voteMode}
        initialVoteData={activeVote || undefined}
        onCreateVoteSuccess={handleCreateVoteSuccess}
        onUpdateVoteSuccess={handleUpdateVoteSuccess}
        onCloseVoteRequest={handleCloseVoteRequest}
        onSubmitVote={handleSubmitVote}
        currentUserNickname={currentUserForVote}
      />
    </>
  )
}

export default App;
