import { create } from "zustand";

type ModalType = 'quiz' | 'nickname' | 'vote';

type ModalState = {
	[key in ModalType]: boolean;
};

interface ModalStore {
	isOpenModal: ModalState;
	openModal: (type: ModalType) => void;
	closeModal: (type: ModalType) => void;
	toggleModal: (type: ModalType) => void;
}

const defaultState: ModalState = {
	quiz: false,
	nickname: false,
	vote: false,
};

export const useModalStore = create<ModalStore>((set) => ({
	isOpenModal: defaultState,
	openModal: (type) =>
		set((state) => ({
			isOpenModal: { ...state.isOpenModal, [type]: true },
		})),
	closeModal: (type) =>
		set((state) => ({
			isOpenModal: { ...state.isOpenModal, [type]: false },
		})),
	toggleModal: (type) =>
		set((state) => ({
			isOpenModal: {
				...state.isOpenModal,
				[type]: !state.isOpenModal[type],
			},
		})),
}));