import React, { ChangeEvent, useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import * as S from "./content.style";
import Button from "@/components/button/button";
import InputWithIcon from "@/components/vote/Input/input";
import RadioBtn from "@/components/radioBtn/radioBtn";

import { useVote } from "@/hooks/useVote";
import { useVoteStore } from "@/store/useVoteStore";
import { useModalStore } from "@/store/useModalStore";

import {useUserStore} from "@/store/useUserStore";
import {useTimerStore} from "@/store/useTimerStore";
import {useVoteHandler} from "@/socket/voteHandler";
import { useQuizStore } from "@/store/useQuizStore";

const Content = () => {
	const { save, edit, vote } = useVote(); // vote 함수 다시 추가 (서버 전송용)
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
		isVote, // store의 상태 업데이트용
		voteState
	} = useVoteStore();
	const { quizState }=useQuizStore();
	const { resetTimer } = useTimerStore();
	const { startVote, endVote } = useVoteHandler();
	const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

	useEffect(() => {
		setSelectedItems(new Set(selectedVoteId));
	}, [selectedVoteId]);


	const isCreator = isVoteCreator();
	const handleVoteClick = (id: number) => {

		if (!isSave) return;
		if (isVoteEnded) return;
		vote(id);
	};

	const handleItemChange = (id: number, value: string) => {
		if (isSave) return;
		setVoteItems((prev) =>
			prev.map((item) => (item.itemId === id ? { ...item, text: value } : item))
		);
	};

	const handleItemDelete = (id: number) => {
		if (isSave || voteItems.length <= 2) return;
		deleteVoteItem(id);
	};

	const addVoteItem = () => {
		if (isSave) return;
		setVoteItems((prev) => [...prev, { itemId: Date.now(), text: "", count: 0 }]);
	};

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (isSave) return;
		setTitle(e.target.value);
	};

	const onSaveClick = () => {
		const hasActive = (voteState?.isActive && !voteState?.isEnded) || (quizState?.isActive && !quizState?.isEnded);

		// if (isCreator && isTimerActive) {
		// 	alert("이게 맞나?");
		// 	return;
		// }

		if (isCreator && isTimerActive) {
			alert("크리에이터이며 타이머가 활성화.");
			return;
		} else if (hasActive) {
			alert("수정되었습니다.");
		}

		const data = {
			title,
			items: voteItems,
			isMultiple: isDuplicated,
		};
		save(data);
	};

	const onEdit = () => {
		const data = {
			title,
			items: voteItems.map((item) => ({
				itemId: item.itemId,
				text: item.text,
			})),
			isMultiple: isDuplicated,
		};
		edit(selectedVoteId[0], data);
	};

	const handleCloseModal = () => {
		closeModal("vote");
	};

	return (
		<S.VoteInputContainer>
			<InputWithIcon
				inputComponent={S.LargeInput}
				placeholder="제목"
				value={title}
				onChange={handleTitleChange}
				readOnly={isSave}
			/>

			{voteItems.map((item, index) => (
				<InputWithIcon
					key={item.itemId}
					readOnly={isSave}
					isSelected={isSave && selectedItems.has(item.itemId)}
					inputComponent={S.MediumInput}
					placeholder={`항목 ${index + 1}`}
					value={item.text}
					onChange={(e) => {
						if (!isSave) handleItemChange(item.itemId, e.target.value);
					}}
					onClick={() => handleVoteClick(item.itemId)}
					icon={
						!isSave && voteItems.length > 2 ? (
							<IoIosCloseCircleOutline
								onClick={() => handleItemDelete(item.itemId)}
								style={{ cursor: "pointer" }}
							/>
						) : null
					}
				/>
			))}

			{!isSave && (
				<S.AddText onClick={addVoteItem}>+ 항목 추가</S.AddText>
			)}

			{!isSave && <RadioBtn />}
			<S.ButtonWrapper>
				{!isSave ? (
					<>
						<Button onClick={onSaveClick}>완료</Button>
						<Button onClick={handleCloseModal}>취소</Button>
					</>
				) : (
					<>
						{isCreator && isTimerActive && !isVoteEnded && (
							<Button onClick={onEdit}>수정</Button>
						)}
						<Button onClick={handleCloseModal}>닫기</Button>

					</>
				)}
			</S.ButtonWrapper>

		</S.VoteInputContainer>
	);
};

export default Content;