import { create } from 'zustand';

interface TimerState {
	isTimerActive: boolean;
	timeLeft: number;
	startTimer: (remainingTime: number) => void;
	tick: () => void;
	resetTimer: () => void;
}

const MINUTES_IN_MS = 60 * 1000;


export const useTimerStore = create<TimerState>((set, get) => ({
	isTimerActive: false,
	timeLeft: MINUTES_IN_MS,

	startTimer: (remainingTime: number) => {
		set({
			isTimerActive: true,
			timeLeft: remainingTime * 1000,
		});
	},
	resetTimer: () => {
		set({ timeLeft: MINUTES_IN_MS });
	},
	tick: () => {
		const { timeLeft } = get();
		if (timeLeft <= 1000) {
			set({ timeLeft: 0, isTimerActive: false });
		} else {
			set({ timeLeft: timeLeft - 1000 });
		}
	}
}));