import React, { useEffect, useState } from "react";
import SystemMessage from "@/components/systemMessage/SystemMessage";
import BubbleHeader from "@/components/bubbleHeader/bubbleHeader";

const Quiz = () => {
  const [showCorrect, setShowCorrect] = useState(true);
  const [showVoteStart, setShowVoteStart] = useState(true);
  const [showVoteEnd, setShowVoteEnd] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCorrect(false), 5000);
    const t2 = setTimeout(() => setShowVoteStart(false), 5000);
    const t3 = setTimeout(() => setShowVoteEnd(false), 5000);
    const t4 = setTimeout(() => setShowWarning(false), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <>
      <BubbleHeader
        type="quiz"
        question="이것은 퀴즈내용 아직 없다"
        time="00:30"
      />
      {showCorrect && (
        <SystemMessage type="correct" nickname="사용자" time="00:30" />
      )}
      {showVoteStart && <SystemMessage type="voteStart" time="00:30" />}
      {showVoteEnd && <SystemMessage type="voteEnd" time="00:30" />}
      {showWarning && <SystemMessage type="warning" time="00:30" />}
    </>
  );
};

export default Quiz;