// 퀴즈 투표 관련 시스템 메시지

import { create } from "zustand";
import { SystemMessageProps } from "@/common/types";

interface ChatStore {
  systemMessages: SystemMessageProps[];
  setSystemMessages: (msg: SystemMessageProps) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  systemMessages: [],
  setSystemMessages: (msg) =>
    set((state) => ({
      systemMessages: [...state.systemMessages, msg],
    })),
}));
