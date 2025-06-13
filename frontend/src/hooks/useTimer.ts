import { useEffect, useState, useRef } from "react";
import { useVoteStore } from "@/store/useVoteStore";
import { useVoteHandler } from "@/socket/voteHandler";
import {useModalStore} from "@/store/useModalStore";
import {useTimerStore} from "@/store/useTimerStore";

const STORAGE_KEY = "shared-timer";
const MINUTES_IN_MS = 60 * 1000;
const INTERVAL = 1000;

export const useTimer = () => {
	const [timeLeft, setTimeLeft] = useState<number>(MINUTES_IN_MS);
	const { isTimerActive,voteItems } = useVoteStore();
	const { endVote } = useVoteHandler();
	const hasEndedRef = useRef(false);
	const [showResult, setShowResult] = useState(false);

	const {
		voteState,
		setIsTimerActive,
		resetVote,

	} = useVoteStore();

	const { resetTimer } = useTimerStore();

	useEffect(() => {
		const checkTimer = () => {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const { startTime } = JSON.parse(saved);
				const elapsed = Date.now() - startTime;
				const remaining = Math.max(MINUTES_IN_MS - elapsed, 0);
				setTimeLeft(remaining);
			} else {
				setTimeLeft(MINUTES_IN_MS);
			}
		};

		checkTimer();

		const timer = setInterval(() => {
			checkTimer();
		}, INTERVAL);

		return () => clearInterval(timer);
	}, [isTimerActive]);


	useEffect(() => {
		if (timeLeft <= 0 && isTimerActive && !hasEndedRef.current) {
			setIsTimerActive(false);
			endVote(voteItems);
			resetVote();
			setShowResult(true);
			resetTimer()
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