import {useModalStore} from "@/store/useModalStore";
import {useVoteStore} from "@/store/useVoteStore";
import {useVoteHandler} from "@/socket/voteHandler";
import {useUserStore} from "@/store/useUserStore";
import {useTimerStore} from "@/store/useTimerStore";

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
		setIsEditMode, // 편집 모드 setter 추가
	} = useVoteStore();
	const { userId } = useUserStore();

	const { startVote, submitVote, editVote } = useVoteHandler();
	const { startTimer } = useTimerStore();

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
			startVote(data);
		} catch (error) {
			console.error('투표 시작 오류:', error);
			setIsSave(false);
			setIsTimerActive(false);
			alert('투표 시작 중 오류가 발생했습니다.');
		}
	};

	const edit = async (data: any) => {
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

			setIsEditMode(false); // 🔄 편집 모드 해제
			closeModal("vote");
			editVote(data); // 서버에 수정 요청
		} catch (error) {
			console.error('투표 수정 오류:', error);
			alert('투표 수정 중 오류가 발생했습니다.');
		}
	};

	const cancel = () => {
		closeModal("vote");
		resetVote();
		setIsEditMode(false);
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