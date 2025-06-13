import SystemMessage from "@/components/systemMessage/SystemMessage";
import { ChatContainer } from "./chat.style";
import ChatSystemMessage from "@/components/systemMessage/chatSystemMessage/chatSystemMessage";
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import ChatUserMessage from "@/components/systemMessage/chatUserMessage/chatUserMessage";
import { useEffect, useRef, useMemo } from "react";
import { MessageType, SystemMessageProps, VoteItem } from "@/common/types";

interface ChatSystemMessage {
  content: string;
  time: number; 
}

interface SystemMsg extends SystemMessageProps {
  type: MessageType;
  nickName?: string;
  time: number; 
  items?: VoteItem[];
}

interface UserMsg {
  content: string;
  sender?: string;
  time: number; 
  userId?: number;
}

type MessageWithMeta =
  | { source: "chatSystem"; message: ChatSystemMessage; timestamp: number }
  | { source: "system"; message: SystemMsg; timestamp: number }
  | { source: "user"; message: UserMsg; timestamp: number };

const Chat = () => {
  const { systemMessages } = useChatStore();
  const userMessages = useUserStore((state) => state.userMessages);
  const chatSystemMessages = useUserStore((state) => state.systemMessages);
  const containerRef = useRef<HTMLDivElement>(null);

  function parseAndIndex(
    arr: (ChatSystemMessage | SystemMsg | UserMsg)[],
    source: "chatSystem" | "system" | "user"
  ): MessageWithMeta[] {
    return arr.map((msg, idx) => {
      const time = Number(msg.time);
      const timestamp = !isNaN(time) ? time + idx : Date.now(); 

      return {
        source,
        message: msg as any,
        timestamp,
      };
    });
  }

  const sortedMessages = useMemo(() => {
    const chatSysMsgs = parseAndIndex(chatSystemMessages, "chatSystem");
    const sysMsgs = parseAndIndex(systemMessages, "system");
    const userMsgs = parseAndIndex(userMessages, "user");

    const combined = [...chatSysMsgs, ...sysMsgs, ...userMsgs];
    return combined.sort((a, b) => a.timestamp - b.timestamp);
  }, [chatSystemMessages, systemMessages, userMessages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [sortedMessages]);

  return (
    <ChatContainer ref={containerRef}>
      {sortedMessages.map((entry, idx) => {
        switch (entry.source) {
          case "chatSystem":
            return <ChatSystemMessage key={idx} message={entry.message} />;
          case "system":
            return (
              <SystemMessage
                key={idx}
                type={entry.message.type}
                nickName={entry.message.nickName}
                time={entry.message.time}
                items={entry.message.items}
                answer={entry.message.answer} 
              />
            );
          case "user":
            return <ChatUserMessage key={idx} message={entry.message} />;
          default:
            return null;
        }
      })}
    </ChatContainer>
  );
};

export default Chat;
