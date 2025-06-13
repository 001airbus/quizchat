import pool from "../db/mariadb";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Server, Socket } from "socket.io";
import { getRedisValue, setRedisValue } from "../utils/redis";
import { QuizItem, QuizState } from "../common/types";

interface answerPayload {
  userId: number;
  answer: string;
}

export function handleQuiz(io: Server, socket: Socket) {
  socket.on("START_QUIZ", async () => {
    // const result = await selectQuiz();
    const result = {
      id: 1,
      question: "논리적 데이터베이스를 구성하는 기본 단위는?",
      answer: "테이블/table/Table",
    };

    if (result) {
      const quizState: QuizState = {
        isActive: true,
        quizData: result,
        isEnded: false,
      };

      await setRedisValue("quizState", JSON.stringify(quizState), 60 * 60);
      io.emit("START_QUIZ", {
        isActive: true,
        question: result.question,
        isEnded: false,
      });
      io.emit("SYSTEM_MESSAGE", {
        type: "quizStart",
        time: Date.now(),
      });
    } else {
      socket.emit("START_QUIZ_ERROR", { message: "퀴즈가 존재하지 않습니다." });
      return;
    }
  });

  socket.on("ANSWER_QUIZ", async ({ userId, answer }: answerPayload) => {
    // if절로 퀴즈가 진행되고 있을때만 아래 로직을 수행
    const currentQuiz = await getCurrentQuizState();
    if (currentQuiz && currentQuiz.isActive) {
      if (!currentQuiz.quizData) {
        return socket.emit("ANSWER_QUIZ_ERROR", {
          message: "퀴즈 데이터가 없습니다.",
        });
      }

      // 서버가 가지고 있는 정답과 일치하는지 체크
      const isCorrect = currentQuiz.quizData
        ? checkAnswer(answer, currentQuiz.quizData.answer)
        : false;

      console.log("퀴즈 정답 체크", isCorrect);

      // 정답일 경우
      if (isCorrect) {
        // redis에 퀴즈 상태를 업데이트
        const quizState: QuizState = {
          isActive: false,
          quizData: null,
          isEnded: true,
        };

        await setRedisValue("quizState", JSON.stringify(quizState), 60 * 60);

        const winnerId = socket.data.userId;
        const winnerNickName = socket.data.nickName;
        const answer = currentQuiz.quizData.answer;

        // 서버 내부에서 퀴즈 종료 후 클라이언트에게 퀴즈 종료 신호와 정답자, 정답 전달
        io.emit("END_QUIZ", {
          winnerId: winnerId,
          winnerNickName: winnerNickName,
          answer: answer,
        });

        io.emit("SYSTEM_MESSAGE", {
          type: "correct",
          nickName: winnerNickName,
          time: Date.now(),
        });

        io.emit("SYSTEM_MESSAGE", {
          type: "quizEnd",
          time: Date.now(),
        });
      } else {
        console.log("정답 아님");
        // 별도의 처리 X, 논의 후 수정
      }
    } else {
      return socket.emit("ANSWER_QUIZ_ERROR", {
        message: "퀴즈가 진행중이지 않습니다.",
      });
    }
  });

   socket.on("END_QUIZ", async () => {
    const currentQuiz = await getCurrentQuizState();

    if (currentQuiz?.isActive && currentQuiz.quizData) {
      const quizState: QuizState = {
        isActive: false,
        quizData: null,
        isEnded: true,
      };
      await setRedisValue("quizState", JSON.stringify(quizState), 60 * 60);

      // 정답자 없이 종료
      io.emit("END_QUIZ", {
        winnerId: null,
        winnerNickName: null,
        answer: currentQuiz.quizData.answer,
      });

      io.emit("SYSTEM_MESSAGE", {
        type: "quizEnd",
        time: Date.now(),
        answer: currentQuiz.quizData.answer, 
      });
    }
  });

}

const selectQuiz = async (): Promise<QuizItem | null> => {
  const query =
    "SELECT id, question, answer FROM quizzes ORDER BY RAND() LIMIT 1";

  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query<RowDataPacket[]>(query);

    if (results.length > 0) {
      const quiz = results[0];
      return quiz as QuizItem;
    } else {
      console.log("조회할 퀴즈가 없습니다.");
      return null;
    }
  } catch (err) {
    console.error("DB 에러 - 퀴즈 조회 중 에러 발생", err);
    throw err;
  }
};

const getCurrentQuizState = async (): Promise<QuizState | null> => {
  console.log("현재 퀴즈 상태를 가져오기");
  const quizState = await getRedisValue("quizState");

  if (quizState) {
    return JSON.parse(quizState) as QuizState;
  } else {
    return null;
  }
};

const checkAnswer = (submitAnswer: string, correctAnswer: string): boolean => {
  const answers = correctAnswer.split("/");
  return answers.some((ans) => submitAnswer.includes(ans));
};
