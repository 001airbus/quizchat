import { useEffect, useState, useRef } from "react";
import { useVoteStore } from "@/store/useVoteStore";
import { useVoteHandler } from "@/socket/voteHandler";
import { useTimerStore } from "@/store/useTimerStore";

const MINUTES_IN_MS = 60 * 1000;
const INTERVAL = 1000;

export const useTimer = () => {
	const [timeLeft, setTimeLeft] = useState<number>(MINUTES_IN_MS);
	const { isTimerActive, voteItems, startedAt, setIsTimerActive, resetVote } = useVoteStore();
	const { resetTimer } = useTimerStore();
	const { endVote } = useVoteHandler();
	const hasEndedRef = useRef(false);

	useEffect(() => {
		if (!isTimerActive || !startedAt) return;
		console.log("타이머 useEffect 진입", { isTimerActive, startedAt });

		const updateTimeLeft = () => {
			const elapsed = Date.now() - startedAt;
			const remaining = Math.max(MINUTES_IN_MS - elapsed, 0);
			setTimeLeft(remaining);
		};

		updateTimeLeft();
		const timer = setInterval(() => {
			updateTimeLeft();
		}, INTERVAL);

		return () => clearInterval(timer);
	}, [isTimerActive]);

	useEffect(() => {
		if (timeLeft <= 0 && isTimerActive && !hasEndedRef.current) {
			setIsTimerActive(false);
			endVote(voteItems);
			resetVote();
			resetTimer();
			hasEndedRef.current = true;
		}
	}, [timeLeft, isTimerActive, endVote]);

	const minutes = Math.floor(timeLeft / (1000 * 60));
	const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
	const formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
	const formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

	return {
		formattedMinutes,
		formattedSeconds,
		timeLeft,
		isActive: isTimerActive,
	};
};