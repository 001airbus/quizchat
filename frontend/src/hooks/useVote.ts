// import { useModalStore } from "@/store/useModalStore";
// import { useVoteStore } from "@/store/useVoteStore";
// import { useVoteHandler } from "@/socket/voteHandler";
// import {useUserStore} from "@/store/useUserStore";
// import {useTimerStore} from "@/store/useTimerStore";
//
// export const useVote = () => {
// 	const { closeModal } = useModalStore();
// 	const {
// 		isSave,
// 		setIsSave,
// 		setIsTimerActive,
// 		resetVote,
// 		setSelectedVoteId,
// 		isDuplicated,
// 		selectedVoteId,
// 		setCurrentUserId,
// 		setVoteCreatorId,
// 	} = useVoteStore();
// 	const { userId } = useUserStore();
//
// 	const { startVote, submitVote } = useVoteHandler();
// 	const { startTimer } = useTimerStore();
//
// 	const save = async (data: any) => {
// 		if (!data.title.trim()) {
// 			alert('투표 제목을 입력해주세요.');
// 			return;
// 		}
//
// 		if (data.items.length < 2) {
// 			alert('투표 항목은 최소 2개 이상이어야 합니다.');
// 			return;
// 		}
//
// 		if (data.items.some((item: any) => !item.text.trim())) {
// 			alert('모든 투표 항목을 입력해주세요.');
// 			return;
// 		}
//
// 		try {
// 			setVoteCreatorId(userId);
// 			setIsSave(true);
// 			closeModal("vote");
// 			setIsTimerActive(true);
// 			startVote(data);
//
// 		startTimer()
// 		} catch (error) {
// 			console.error('투표 시작 오류:', error);
// 			setIsSave(false);
// 			setIsTimerActive(false);
// 			alert('투표 시작 중 오류가 발생했습니다.');
// 		}
// 	};
//
// 	const edit = async (id: number, data: any) => {
// 		setIsSave(false);
// 		setIsTimerActive(false);
// 	};
//
// 	const cancel = () => {
// 		closeModal("vote");
// 		resetVote();
// 	};
//
// 	const vote = (id: number) => {
// 		if (isDuplicated) {
// 			setSelectedVoteId((prev) => {
// 				const updated = prev.includes(id)
// 					? prev.filter((v) => v !== id)
// 					: [...prev, id];
// 				submitVote(updated);
// 				return updated;
// 			});
// 		} else {
// 			const updated = [id];
//
// 			setSelectedVoteId(() => {
// 				return updated;
// 			});
// 			closeModal("vote");
// 			setCurrentUserId(userId);
// 			submitVote(updated);
// 		}
// 	};
//
// 	return {
// 		isSave,
// 		save,
// 		edit,
// 		cancel,
// 		vote,
// 	};
// };
import { useModalStore } from "@/store/useModalStore";
import { useVoteStore } from "@/store/useVoteStore";
import { useVoteHandler } from "@/socket/voteHandler";
import { useUserStore } from "@/store/useUserStore";
import { useTimerHandler } from "@/socket/timerHandler";

export const useVote = () => {
	const { closeModal } = useModalStore();
	const {
		isSave,
		setIsSave,
		setIsTimerActive,
		resetVote,
		setSelectedVoteId,
		isDuplicated,
		selectedVoteId,
		setCurrentUserId,
		setVoteCreatorId,
	} = useVoteStore();
	const { userId } = useUserStore();

	const { startVote, submitVote } = useVoteHandler();
	const { startTimer, resetTimer } = useTimerHandler();

	const save = async (data: any) => {
		if (!data.title.trim()) {
			alert('투표 제목을 입력해주세요.');
			return;
		}

		if (data.items.length < 2) {
			alert('투표 항목은 최소 2개 이상이어야 합니다.');
			return;
		}

		if (data.items.some((item: any) => !item.text.trim())) {
			alert('모든 투표 항목을 입력해주세요.');
			return;
		}

		try {
			setVoteCreatorId(userId);
			setIsSave(true);
			closeModal("vote");
			setIsTimerActive(true);

			// 서버에서 관리하는 타이머 시작
			startTimer(60 * 1000); // 1분 타이머

			startVote(data);
		} catch (error) {
			console.error('투표 시작 오류:', error);
			setIsSave(false);
			resetTimer();
			setIsTimerActive(false);
			alert('투표 시작 중 오류가 발생했습니다.');
		}
	};

	const edit = async (id: number, data: any) => {
		setIsSave(false);
		setIsTimerActive(false);
	};

	const cancel = () => {
		closeModal("vote");
		resetVote();
	};

	const vote = (id: number) => {
		if (isDuplicated) {
			setSelectedVoteId((prev) => {
				const updated = prev.includes(id)
					? prev.filter((v) => v !== id)
					: [...prev, id];
				submitVote(updated);
				return updated;
			});
		} else {
			const updated = [id];

			setSelectedVoteId(() => {
				return updated;
			});
			closeModal("vote");
			setCurrentUserId(userId);
			submitVote(updated);
		}
	};

	return {
		isSave,
		save,
		edit,
		cancel,
		vote,
	};
};