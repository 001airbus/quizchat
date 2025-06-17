// 메세지 관련
export interface MessagePayload {
    userId: number;    // 메세지 보내는 유저의 id
    nickName: string;  // 메세지 보내는 유저의 닉네임
    content: string;   // 메세지 내용
    timestamp: string; // 메세지 보낸 시간
}

// 투표 관련
export interface VoteItem {
    itemId: number; // 각 항목 식별 id
    text: string;   // 각 항목 내용
    count: number;  // 각 항목 투표 수
};

export interface StartVotePayload {
    title: string;       // 투표 제목
    items: VoteItem[];   // 투표 항목들
    isMultiple: boolean; // 중복 투표 가능 여부
}

export interface VoteState {
    userId: number;      // 투표를 생성한 유저의 id
    title: string;       // 투표 제목
    items: VoteItem[];   // 투표 항목들
    isActive: boolean;   // 투표 활성화 여부
    isMultiple: boolean; // 중복 투표 가능 여부
};

// 퀴즈 관련
export interface QuizItem {
    id : number;       // 퀴즈 id
    question : string; // 문제
    answer : string;   // 정답
}

export interface QuizState {
    isActive : boolean;
    quizData : QuizItem | null;
    isEnded : boolean;
}

type MessageType =
  | "correct"
  | "voteStart"
  | "voteEnd"
  | "warning"
  | "quizStart"
  | "quizEnd";

export interface SystemMessageProps {
  type: MessageType;
  nickName?: string;
  time: string;
  items?: VoteItem[];
}