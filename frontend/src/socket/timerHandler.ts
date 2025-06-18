import { socket } from "./socketManager";
import { useEffect } from "react";
import { useTimerStore } from "@/store/useTimerStore";

let isTimerSocketInitialized = false;

export const useTimerHandler = () => {
	const { 	setTimerState, resetTimer } = useTimerStore();

	useEffect(() => {
		if (isTimerSocketInitialized) return;
		isTimerSocketInitialized = true;

		// 서버에 현재 타이머 상태 요청
		socket.emit("GET_TIMER_STATE");

		// 타이머 시작 이벤트
		socket.on("TIMER_STARTED", (data) => {
			setTimerState({
				isTimerActive: true,
				startTime: data.startTime,
				endTime: data.endTime,
				timeLeft: data.endTime - Date.now()
			});
		});

		// 타이머 업데이트 이벤트
		socket.on("TIMER_UPDATE", (data) => {
			setTimerState({
				isTimerActive: data.isActive,
				timeLeft: data.timeLeft,
				startTime: data.startTime,
				endTime: data.endTime
			});
		});

		// 타이머 종료 이벤트
		socket.on("TIMER_ENDED", () => {
			setTimerState({
				isTimerActive: false,
				timeLeft: 0
			});
		});

		// 타이머 중지 이벤트
		socket.on("TIMER_STOPPED", () => {
			setTimerState({
				isTimerActive: false
			});
		});

		// 타이머 리셋 이벤트
		socket.on("TIMER_RESET", () => {
			resetTimer();
		});

		// 타이머 상태 응답
		socket.on("TIMER_STATE", (data) => {
			setTimerState({
				isTimerActive: data.isActive,
				timeLeft: data.timeLeft,
				startTime: data.startTime || null,
				endTime: data.endTime || null
			});
		});

		return () => {
			socket.off("TIMER_STARTED");
			socket.off("TIMER_UPDATE");
			socket.off("TIMER_ENDED");
			socket.off("TIMER_STOPPED");
			socket.off("TIMER_RESET");
			socket.off("TIMER_STATE");
			isTimerSocketInitialized = false;
		};
	}, [setTimerState, resetTimer]);

	const startTimer = (duration?: number) => {
		socket.emit('START_TIMER', duration);
	};

	const stopTimer = () => {
		socket.emit('STOP_TIMER');
	};

	const resetTimerServer = () => {
		socket.emit('RESET_TIMER');
	};

	return { startTimer, stopTimer, resetTimer: resetTimerServer };
};