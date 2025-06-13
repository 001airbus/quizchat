import React from "react";
import * as S from "@/components/vote/Input/Input.style";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
	inputComponent?: React.ElementType;
	isSelected?: boolean;
}

const InputWithIcon = ({ icon, isSelected,inputComponent: Input = "input", ...props }: Props) => {
	return (
		<S.Container >
			<Input {...props} isSelected={isSelected} />
			{icon && <S.IconWrapper>{icon}</S.IconWrapper>}
		</S.Container>
	);

};

export default InputWithIcon;