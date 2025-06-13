import { create } from "zustand";
import type {VoteItem, VoteState} from "@/common/types";


interface VoteStore {
	voteState: VoteState | null;
	title: string;
	voteItems: VoteItem[];
	isSave: boolean;
	isDuplicated: boolean;
	selectedVoteId: number[];
	isTimerActive: boolean;
	isVoteEnded: boolean;
	voteCreatorId: number | null;
	currentUserId: number | null;
	setVoteState: (newState: VoteState) => void
	setIsSave: (state: boolean) => void;
	setTitle: (title: string) => void;
	setVoteItems: (fn: (prev: VoteItem[]) => VoteItem[]) => void;
	setIsDuplicated: (value: boolean) => void;
	deleteVoteItem: (id: number) => void;
	setSelectedVoteId: (fn: (prev: number[]) => number[]) => void;
	isVote: (id: number) => void;
	setIsTimerActive: (active: boolean) => void;
	endVote: () => void;
	resetVote: () => void;
	setCurrentUserId: (userId: number) => void;
	isVoteCreator: () => boolean;
	setVoteCreatorId: (userId: number) => void;

	updateFromServer: (data: {
		title: string;
		items: Array<{ itemId: number; text: string; count: number }>;
		isMultiple: boolean;
		isActive: boolean;
		isEnded: boolean;
		userId?: number;
		timeLeft?: number;
	}) => void;
}

export const useVoteStore = create<VoteStore>((set, get) => ({
	voteState: null,
	title: "",
	voteItems: [
		{ itemId: Date.now(), text: "", count: 0 },
		{ itemId: Date.now() + 1, text: "", count: 0 },
	],
	isSave: false,
	isDuplicated: false,
	selectedVoteId: [],
	isTimerActive: false,
	isVoteEnded: false,
	voteCreatorId: null,
	currentUserId: null,

	setTitle: (title) => {
		set({ title });
	},

	setVoteItems: (fn) =>
		set((state) => {
			const newItems = fn(state.voteItems);
			return { voteItems: newItems };
		}),

	setIsDuplicated: (value) => {
		set({ isDuplicated: value });
	},
	setVoteState: (newState) => {
		set({ voteState: newState });
	},
	deleteVoteItem: (itemId) =>
		set((state) => {
			const newItems = state.voteItems.filter((item) => item.itemId !== itemId);
			return { voteItems: newItems };
		}),

	setIsSave: (isSave: boolean) => {
		set({ isSave });
	},

	setSelectedVoteId: (fn) =>
		set((state) => {
			const newSelected = fn(state.selectedVoteId);
			return { selectedVoteId: newSelected };
		}),

	setIsTimerActive: (active) => {
		set({ isTimerActive: active });
	},

	setCurrentUserId: (userId) => {
		set({ currentUserId: userId });
	},

	isVoteCreator: () => {
		const { voteCreatorId, currentUserId } = get();
		return voteCreatorId !== null && currentUserId !== null && voteCreatorId === currentUserId;
	},

	endVote: () => {
		set({
			isTimerActive: false,
			isVoteEnded: true
		});
	},

	resetVote: () => {
		set({
			title: "",
			voteItems: [
				{ itemId: Date.now(), text: "", count: 0 },
				{ itemId: Date.now() + 1, text: "", count: 0 },
			],
			isSave: false,
			isDuplicated: false,
			selectedVoteId: [],
			isTimerActive: false,
			isVoteEnded: false,
			voteCreatorId: null,
		});
	},
	updateFromServer: (data) => {
		set({
			title: data.title,
			voteItems: data.items,
			isDuplicated: data.isMultiple,
			isSave: data.isActive,
			isTimerActive: data.isActive && !data.isEnded,
			isVoteEnded: data.isEnded,
			voteCreatorId: data.userId || null

		});
	},
	isVote: (id) => {
		const { isDuplicated, setSelectedVoteId} = get();

		if (isDuplicated) {
			setSelectedVoteId((prev) =>
				prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
			);
		} else {
			setSelectedVoteId(() => [id]);
		}
	},
	setVoteCreatorId: (userId:number) => set({ voteCreatorId: userId}),
}));