import * as S from "./chatSystemMessage.style";
import React from "react";

interface ChatSystemMessageProps {
  message: {
    content: string;
    time: number; // 11시 수정
  };
}

const ChatSystemMessage: React.FC<ChatSystemMessageProps> = ({ message }) => {
  return (
    <S.SystemMessageWrapper>
      <S.ChatSystemMessageContainer>
        {message.content}
      </S.ChatSystemMessageContainer>
    </S.SystemMessageWrapper>
  );
};

export default ChatSystemMessage;
