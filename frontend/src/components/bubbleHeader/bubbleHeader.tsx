import React, { useState } from "react";
import * as S from "./bubbleHeader.style";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "../button/button";
import CountDown from "@/components/countdown/countDown";
import { useModalStore } from "@/store/useModalStore";
import { useVoteStore } from "@/store/useVoteStore";

interface BubbleHeaderProps {
  type: "quiz" | "vote";
  question: string;
  hasVote?: boolean;
  time?: string;
}

const BubbleHeader: React.FC<BubbleHeaderProps> = ({
                                                     type,
                                                     question,
                                                     hasVote = false,
                                                   }) => {
  const [expanded, setExpanded] = useState(false);
  const { openModal } = useModalStore();
  const { isSave, setIsTimerActive } = useVoteStore();

  const handleCreateVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("vote");
  };


  const handleVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal("vote");
  };


  const handleEndVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTimerActive(false);
    console.log("투표가 종료되었습니다.");
  };

  return (
    <S.BalloonContainer onClick={() => setExpanded(!expanded)}>
      <S.ContentRow expanded={expanded}>
        <S.QuestionSection>
          {type === "quiz" ? <S.QLabel>Q</S.QLabel> : <S.VoteIcon />}
          {expanded ? (
            <S.QuestionTextExpanded>{question}</S.QuestionTextExpanded>
          ) : (
            <S.QuestionText title={question}>{question}</S.QuestionText>
          )}

          {hasVote && isSave && <CountDown />}
        </S.QuestionSection>

        <S.ToggleIcon>
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </S.ToggleIcon>
      </S.ContentRow>


      {expanded && (
        <S.ButtonContainer>
          {!hasVote ? (
            <Button onClick={handleCreateVoteClick}>
              투표 만들기
            </Button>
          ) : (
            <S.VoteButtonGroup>
              <Button onClick={handleVoteClick}>
                투표하기
              </Button>
              {isSave && (
                <Button onClick={handleEndVoteClick} >
                  투표 종료
                </Button>
              )}
            </S.VoteButtonGroup>
          )}
        </S.ButtonContainer>
      )}
    </S.BalloonContainer>
  );
};

export default BubbleHeader;