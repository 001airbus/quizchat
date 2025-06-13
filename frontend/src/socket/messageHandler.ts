import { useEffect } from "react";
import { socket } from "./socketManager";
import type { MessagePayload, SystemMessageProps } from "../common/types";
import { useUserStore } from "@/store/useUserStore";
import { useChatStore } from "@/store/useChatStore"; 

export const sendSystemMessage = (msg: SystemMessageProps) => {
  socket.emit("REQUEST_SYSTEM_MSG", msg);
};

export const useMessageHandler = () => {
  const {
    userId,
    nickName,
    setUserMessage
  } = useUserStore();

  const { setSystemMessages } = useChatStore();

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", (msg: MessagePayload) => {
      if (msg.userId !== userId) {
        setUserMessage(msg);
      }
    });

    // 시스템 메시지 수신
    socket.on("RECEIVE_SYSTEM_MSG", (msg: SystemMessageProps) => {
      if (!msg || !msg.type) {
        console.warn("⚠️ 시스템 메시지 형식이 이상함:", msg);
      }
      setSystemMessages(msg);
    });

    return () => {
      socket.off("RECEIVE_MESSAGE");
      socket.off("RECEIVE_SYSTEM_MSG");
    };
  }, [userId, setUserMessage, setSystemMessages]);

  const sendMessage = (msg: string) => {
    if (socket && msg.trim() !== "") {
      const payload: MessagePayload = {
        userId,
        nickName,
        content: msg,
        timestamp: Date.now(),
      };
      
      setUserMessage(payload);
      socket.emit("SEND_MESSAGE", payload);
    }
  };

  return { sendMessage };
};
