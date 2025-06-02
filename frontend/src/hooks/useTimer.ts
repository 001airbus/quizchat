import { useEffect, useState } from "react";
import { useVoteStore } from "@/store/useVoteStore";

export const useTimer = () => {
	const MINUTES_IN_MS = 10 * 60 * 1000;
	const INTERVAL = 1000;
	const [timeLeft, setTimeLeft] = useState<number>(MINUTES_IN_MS);
	const { isTimerActive } = useVoteStore();

	useEffect(() => {
		if (!isTimerActive) {
			setTimeLeft(MINUTES_IN_MS);
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= INTERVAL) {
					console.log("타이머 종료");
					return 0;
				}
				return prevTime - INTERVAL;
			});
		}, INTERVAL);

		return () => clearInterval(timer);
	}, [isTimerActive]);

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