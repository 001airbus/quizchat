import React, {ChangeEvent, useEffect, useState} from "react";
import {IoIosCloseCircleOutline} from "react-icons/io";
import * as S from "./content.style";
import Button from "@/components/button/button";
import InputWithIcon from "@/components/vote/Input/input";
import RadioBtn from "@/components/radioBtn/radioBtn";

import {useVote} from "@/hooks/useVote";
import {useVoteStore} from "@/store/useVoteStore";
import {useModalStore} from "@/store/useModalStore";

import {useUserStore} from "@/store/useUserStore";
import {useTimerStore} from "@/store/useTimerStore";
import {useVoteHandler} from "@/socket/voteHandler";
import {useQuizStore} from "@/store/useQuizStore";

const Content = () => {
	const { save, edit, vote } = useVote();
	const { closeModal } = useModalStore();
	const { userId } = useUserStore();

	const {
		title,
		voteItems,
		deleteVoteItem,
		isSave,
		isDuplicated,
		setTitle,
		setVoteItems,
		selectedVoteId,
		isTimerActive,
		setIsTimerActive,
		isVoteEnded,
		resetVote,
		isVoteCreator,
		voteCreatorId,
		setVoteCreatorId,
		isVote,
		voteState,
		// 🔄 편집 모드 상태 추가 (store에 없다면 useState로 대체)
		isEditMode, // 또는 useState로 관리
		setIsEditMode // 또는 useState로 관리
	} = useVoteStore();

	const { quizState }=useQuizStore();
	const { resetTimer } = useTimerStore();
	const { startVote, endVote } = useVoteHandler();
	const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

	// 🔄 store에 isEditMode가 없다면 이렇게 local state로 관리
	// const [isEditMode, setIsEditMode] = useState(false);

	useEffect(() => {
		setSelectedItems(new Set(selectedVoteId));
	}, [selectedVoteId]);

	const isCreator = isVoteCreator();

	const handleVoteClick = (id: number) => {
		if (!isSave) return;
		if (isVoteEnded) return;
		if (isEditMode) return; // 편집 모드에서는 투표 불가
		vote(id);
	};

	const handleItemChange = (id: number, value: string) => {
		if (isSave && !isEditMode) return; // 편집 모드가 아닌 저장된 상태에서는 변경 불가
		setVoteItems((prev) =>
			prev.map((item) => (item.itemId === id ? { ...item, text: value } : item))
		);
	};

	const handleItemDelete = (id: number) => {
		if ((isSave && !isEditMode) || voteItems.length <= 2) return;
		deleteVoteItem(id);
	};

	const addVoteItem = () => {
		if (isSave && !isEditMode) return;
		setVoteItems((prev) => [...prev, { itemId: Date.now(), text: "", count: 0 }]);
	};

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (isSave && !isEditMode) return;
		setTitle(e.target.value);
	};

	const onCompleteClick = () => {
		const data = {
			title,
			items: voteItems.map((item) => ({
				itemId: item.itemId,
				text: item.text,
			})),
			isMultiple: isDuplicated,
		};

		if (isEditMode) {
			edit(data);
		} else {
			const saveData = {
				title,
				items: voteItems,
				isMultiple: isDuplicated,
			};
			save(saveData);
		}
	};

	const onEditClick = () => {
		setIsEditMode(true);
		// setIsSave(false);
	};

	const handleCloseModal = () => {
		setIsEditMode(false);
		closeModal("vote");
	};

	const handleCancel = () => {
		if (isEditMode) {
			setIsEditMode(false);
		} else {
			handleCloseModal();
		}
	};

	return (
		<S.VoteInputContainer>
			<InputWithIcon
				inputComponent={S.LargeInput}
				placeholder="제목"
				value={title}
				onChange={handleTitleChange}
				readOnly={isSave && !isEditMode}
			/>

			{voteItems.map((item, index) => (
				<InputWithIcon
					key={item.itemId}
					readOnly={isSave && !isEditMode}
					isSelected={isSave && !isEditMode && selectedItems.has(item.itemId)}
					inputComponent={S.MediumInput}
					placeholder={`항목 ${index + 1}`}
					value={item.text}
					onChange={(e) => {
						if (isSave && !isEditMode) return;
						handleItemChange(item.itemId, e.target.value);
					}}
					onClick={() => handleVoteClick(item.itemId)}
					icon={
						(!isSave || isEditMode) && voteItems.length > 2 ? (
							<IoIosCloseCircleOutline
								onClick={() => handleItemDelete(item.itemId)}
								style={{ cursor: "pointer" }}
							/>
						) : null
					}
				/>
			))}

			{(!isSave || isEditMode) && (
				<S.AddText onClick={addVoteItem}>+ 항목 추가</S.AddText>
			)}

			<RadioBtn/>

			<S.ButtonWrapper>
				{!isSave || isEditMode ? (
					<>
						<Button onClick={onCompleteClick}>
							{isEditMode ? "수정 완료" : "완료"}
						</Button>
						<Button onClick={handleCancel}>취소</Button>
					</>
				) : (
					<>
						{isCreator && isTimerActive && !isVoteEnded && (
							<Button onClick={onEditClick}>수정</Button>
						)}
						<Button onClick={handleCloseModal}>닫기</Button>
					</>
				)}
			</S.ButtonWrapper>
		</S.VoteInputContainer>
	);
};

export default Content;