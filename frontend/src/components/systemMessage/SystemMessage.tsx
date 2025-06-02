import React from "react";
import * as S from "./SystemMessage.style"
import { FaCheckCircle, FaExclamationTriangle, FaVoteYea } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md"


type MessageType = "correct" | "voteStart" | "voteEnd" | "warning";

interface SystemMessageProps {
  type: MessageType;
  nickname?: string;
  time: string;
}

const messageMap: {
  [key in MessageType]: {
    IconComponent: React.ElementType;
    getText: (nickname?: string) => string;
  };
} = {
  correct: {
    IconComponent: FaCheckCircle,
    getText: (nickname = "사용자") => `'${nickname}'님 정답입니다!`,
  },
  voteStart: {
    IconComponent: MdHowToVote,
    getText: () => "투표가 시작되었습니다.",
  },
  voteEnd: {
    IconComponent: FaVoteYea,
    getText: () => "투표가 종료되었습니다.",
  },
  warning: {
    IconComponent: FaExclamationTriangle,
    getText: () => "투표 또는 퀴즈가 진행중입니다.",
  },
};

const SystemMessage: React.FC<SystemMessageProps> = ({ type, nickname = "사용자", time }) => {
  const { IconComponent, getText } = messageMap[type];

  return (
    <S.Wrapper>
      <S.Icon type={type}>
        <IconComponent />
      </S.Icon>
      <S.Text>{type === "correct" ? getText(nickname) : getText()}</S.Text>
      <S.Time>{time}</S.Time>
    </S.Wrapper>
  );
};



export default SystemMessage;
