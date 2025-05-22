import React, { useState } from "react";
import * as S from "./quizHeader.style";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "../button/button";

interface QuizHeaderProps {
  question: string;
  time: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ question, time }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <S.BalloonContainer onClick={() => setExpanded(!expanded)}>
      <S.ContentRow expanded={expanded}>
        <S.QuestionSection>
          <S.QLabel>Q</S.QLabel>
          {expanded ? (
            <S.QuestionTextExpanded>{question}</S.QuestionTextExpanded>
          ) : (
            <S.QuestionText title={question}>{question}</S.QuestionText>
          )}
          <S.TimeText>{time}</S.TimeText>
        </S.QuestionSection>

        <S.ToggleIcon>
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </S.ToggleIcon>
      </S.ContentRow>

      {expanded && <Button />}
    </S.BalloonContainer>
  );
};

export default QuizHeader;
