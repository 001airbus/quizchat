import { create } from 'zustand';
interface TimerState {
	isTimerActive: boolean;
	timeLeft: number;
	startTime: number | null;
	endTime: number | null;
	startTimer: (remainingTime: number) => void;
	tick: () => void;
	resetTimer: () => void;
	setTimerState: (state: Partial<TimerState>) => void; // ✅ 이 줄 추가
}

const MINUTES_IN_MS = 60 * 1000;
export const useTimerStore = create<TimerState>((set, get) => ({
	isTimerActive: false,
	timeLeft: MINUTES_IN_MS,
	startTime: null,
	endTime: null,

	startTimer: (remainingTime: number) => {
		const now = Date.now();
		set({
			isTimerActive: true,
			timeLeft: remainingTime * 1000,
			startTime: now,
			endTime: now + remainingTime * 1000,
		});
	},
	resetTimer: () => {
		set({
			timeLeft: MINUTES_IN_MS,
			startTime: null,
			endTime: null,
		});
	},
	tick: () => {
		const { timeLeft } = get();
		if (timeLeft <= 1000) {
			set({ timeLeft: 0, isTimerActive: false });
		} else {
			set({ timeLeft: timeLeft - 1000 });
		}
	},
	setTimerState: (state) => set((prev) => ({ ...prev, ...state })) // ✅ 구현 추가
}));