import { socket } from "./socketManager";
import { useQuizStore } from "@/store/useQuizStore";
import { useUserStore } from "@/store/useUserStore";
// import { sendSystemMessage } from "./messageHandler";
import { QuizState } from "@/common/types";
import { useChatStore } from "@/store/useChatStore";

// const getCurrentTime = () => {
//   const now = new Date();
//   return now.toTimeString().slice(0, 5);
// };

let isInitialized = false;

// 소켓 이벤트 리스너 한 번만 등록
export const initializeQuizSocket = () => {
  if (isInitialized) return;
  isInitialized = true;

  const { setQuizState, setQuizResult } = useQuizStore.getState();
  const { setSystemMessages } = useChatStore.getState();

  // 시스템 메세지 서버에서 받아오기
  socket.on("SYSTEM_MESSAGE", (msg) => {
    console.log("시스템메세지",msg )
    setSystemMessages(msg);
});
  
  const startQuiz = (data: QuizState) => {
    console.log(`퀴즈 시작 - 문제 : ${data.question}`);
    setQuizState(data);
  };

  const endQuiz = (data: {
    winnerId: number;
    winnerNickName: string;
    answer: string;
  }) => {
    console.log(
      `퀴즈 종료 - 정답자 : ${data.winnerNickName}, 정답 : ${data.answer}`
    );

    setQuizResult(data.winnerNickName, data.answer);
    setQuizState(null);

  };

  const responseMessage = (data: { message: string }) => {
    alert(data.message);
  };

  socket.on("START_QUIZ", startQuiz);
  socket.on("START_QUIZ_ERROR", responseMessage);
  socket.on("ANSWER_QUIZ_ERROR", responseMessage);
  socket.on("END_QUIZ", endQuiz);
};

// 퀴즈 시작 요청 함수
export const requestStartQuiz = () => {
  console.log("퀴즈 시작 요청");
  socket.emit("START_QUIZ");
};

// 퀴즈 정답 제출 함수
export const requestAnswer = (answer: string) => {
  const { userId } = useUserStore.getState();
  console.log(`퀴즈 정답 제출 : ${answer}`);
  socket.emit("ANSWER_QUIZ", { userId, answer });
};

export const requestEndQuiz = () => {
  const { userId, nickName } = useUserStore.getState();
  socket.emit("END_QUIZ", {
    winnerId: userId,
    winnerNickName: nickName,
  });
};
