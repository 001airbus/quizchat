import React from "react";
import * as S from "./radioBtn.style";
import { Label } from "@/constants/label";
import { useVoteStore } from "@/store/useVoteStore";

const RadioButton = () => {
	const { isDuplicated, setIsDuplicated, isSave } = useVoteStore();

	const handleDuplicateChange = () => {
		setIsDuplicated(!isDuplicated);
	};

	if (isSave) {
		return (
			<S.RadioStatusText>
				{isDuplicated ? "중복 선택 가능" : "중복 선택 불가능"}
			</S.RadioStatusText>
		);
	}

	return (
		<S.RadioWrapper>
			<S.RadioInput
				type="radio"
				id="r1"
				name="rr"
				checked={isDuplicated}
				readOnly
			/>
			<S.RadioLabel htmlFor="r1" checked={isDuplicated} onClick={handleDuplicateChange}>
				{Label.DUPLICATE_OPTION}
			</S.RadioLabel>
		</S.RadioWrapper>
	);
};

export default RadioButton;