import React from "react";
import * as S from "./SystemMessage.style";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaVoteYea,
} from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
import { SystemMessageProps, MessageType } from "@/common/types";

const messageMap: {
  [key in MessageType]: {
    IconComponent: React.ElementType;
    getText: (nickName?: string, text?) => string;
  };
} = {
  correct: {
    IconComponent: FaCheckCircle,
    getText: (nickName = "사용자") => `'${nickName}'님 정답입니다!`,
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
  quizStart: {
    IconComponent: FaExclamationTriangle,
    getText: () => "퀴즈가 시작되었습니다.",
  },
  quizEnd: {
    IconComponent: FaExclamationTriangle,
    getText: () => "퀴즈가 종료되었습니다.",
  },
  voteResult: {
    IconComponent: FaExclamationTriangle,
    getText: () => "투표 결과",
  },
};

const SystemMessage: React.FC<SystemMessageProps> = ({
  type,
  nickName = "사용자",
  time,
  items,
  answer,
}) => {
  const { IconComponent, getText } = messageMap[type];
  console.log("voteResult items:", items);
  return (
    <S.Wrapper>
      <S.Icon type={type}>
        <IconComponent />
      </S.Icon>
      <S.Text>
        {type === "quizEnd" && answer ? (
          <div>
            퀴즈가 종료되었습니다. <br/>
            정답: <strong>{answer}</strong>
          </div>
        ) :
        type === "voteResult" && items ? (
          <div>
            투표 결과
            <ul>
              {items.map((item) => (
                <li key={item.itemId}>
                  {item.text} - {item.count}표
                </li>
              ))}
            </ul>
          </div>
        ) : (
          getText(nickName)
        )}
      </S.Text>
      <S.Time>
        {" "}
        {new Date(time).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </S.Time>
    </S.Wrapper>
  );
};

export default SystemMessage;
