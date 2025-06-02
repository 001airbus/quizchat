import { useEffect, useState } from 'react';
import { socket } from './socketManager';

export const useQuizHandler = () => {
    const [answer, setAnswer] = useState<string>('');

    useEffect(() => {
        socket.on('START_QUIZ', startQuiz);
        socket.on('START_QUIZ_ERROR', responseMessage);
        socket.on('ANSWER_QUIZ_ERROR', responseMessage);
        socket.on('END_QUIZ', endQuiz);

        return () => {
            socket.off('START_QUIZ', startQuiz);
            socket.off('START_QUIZ_ERROR', responseMessage);
            socket.off('ANSWER_QUIZ_ERROR', responseMessage);
            socket.off('END_QUIZ', endQuiz);
        };
    }, []);

    const startQuiz = (data : { question : string }) => {
        console.log(`퀴즈 시작 - 문제 : ${data.question}`);
        // 프론트 TODO : 퀴즈 시작 알림을 채팅에 전달, 화면 상단에 표시
    }

    const endQuiz = (data : { winnerId : number, winnerNickName : string, answer : string }) => {
        console.log(`퀴즈 종료 - 정답자 : ${data.winnerNickName}, 정답 : ${data.answer}`);
        // 정답의 경우 여러 키워드를 '/'로 구분하여 전달합니다.
        // 프론트 TODO : 화면 상단의 퀴즈 삭제, 채팅에 퀴즈 종료 알림 전달
    }

    const requestStartQuiz = () => {
        console.log('퀴즈 시작 요청');
        socket.emit('START_QUIZ');
    }

    const requestAnswer = () => {
        if(answer.trim() === '') {
            return;
        }
        
        console.log(`퀴즈 정답 제출 : ${answer}`);
        socket.emit('ANSWER_QUIZ', { userId : 1, answer : answer });
        setAnswer('');
    }

    const responseMessage = (data : { message : string }) => {
        alert(data.message);
    }

    return { answer, setAnswer, startQuiz, requestStartQuiz, requestAnswer };
}