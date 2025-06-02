// 메세지 관련
export interface MessagePayload {
    userId: number;
    nickName: string;
    content: string;
    timestamp: string;
}

// 투표 관련
export interface StartVotePayload {
    title: string;
    items: VoteItem[];
    isMultiple: boolean;
}

export interface VoteItem { // 각 항목 식별 id, 내용, 투표 수
    itemId: number;
    text: string;
    count: number;
};

export interface VoteState { // 투표 제목, 항목, 현재 유효한지 여부, 중복 가능 여부
    title: string;
    items: VoteItem[];
    isActive: boolean;
    isMultiple: boolean;
};

// 퀴즈 관련련
export interface QuizItem { // 퀴즈 id, 문제, 정답
    id : number;
    question : string;
    answer : string;
}

export interface QuizState {
    isActive : boolean;
    quizData : QuizItem | null;
}