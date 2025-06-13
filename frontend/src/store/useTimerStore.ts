import { create } from 'zustand';

interface TimerState {
	isTimerActive: boolean;
	timeLeft: number;
	startTimer: () => void;
	tick: () => void;
	resetTimer: () => void;
}

const MINUTES_IN_MS = 60 * 1000;
const STORAGE_KEY = "shared-timer";

export const useTimerStore = create<TimerState>((set, get) => ({
	isTimerActive: false,
	timeLeft: MINUTES_IN_MS,

	startTimer: () => {
		const startTime = Date.now();
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime }));
		set({ isTimerActive: true });
	},

	resetTimer: () => {
		localStorage.removeItem(STORAGE_KEY);
		set({ timeLeft: MINUTES_IN_MS });
	},
	tick: () => {
		const { timeLeft } = get();
		if (timeLeft <= 1000) {
			set({ timeLeft: 0, isTimerActive: false });
			localStorage.removeItem(STORAGE_KEY);
		} else {
			set({ timeLeft: timeLeft - 1000 });
		}
	}
}));