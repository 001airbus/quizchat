import React from "react";
import * as S from "./radioBtn.style";
import { Label } from "@/constants/label";
import {useVoteStore} from "@/store/useVoteStore";
const RadioButton = () => {
	const {isDuplicated, setIsDuplicated,isSave}= useVoteStore();
	if(isSave) {
		return (
			<S.RadioStatusText>
				{isDuplicated ? "중복 선택 가능" : "중복 선택 불가능"}
			</S.RadioStatusText>
		)
	}
	const handleDuplicateChange = () => {
		setIsDuplicated(!isDuplicated);
	}
	return (
		<S.RadioWrapper onClick={handleDuplicateChange}>
			<S.RadioInput type="radio" id="r1" name="rr" checked={isDuplicated} onChange={handleDuplicateChange} />
			<S.RadioLabel htmlFor="r1">
				{Label.DUPLICATE_OPTION}
			</S.RadioLabel>
		</S.RadioWrapper>
	);
};

export default RadioButton;