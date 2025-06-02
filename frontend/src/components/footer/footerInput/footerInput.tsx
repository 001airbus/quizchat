import * as S from "@/components/footer/footerInput/footerInput.style";
import {BiSend} from "react-icons/bi";
import {FiPlusCircle} from "react-icons/fi";
import {Dispatch, SetStateAction, useState} from "react";

interface FooterInputProps {
	isExpanded: boolean;
	setIsExpanded: Dispatch<SetStateAction<boolean>>;
}


const FooterInput = ({isExpanded,setIsExpanded}: FooterInputProps) => {
	const [isRotated, setIsRotated] = useState(false);


	const handleClick = () => {
		setIsRotated(!isRotated);
		setIsExpanded(!isExpanded);
	};

	return (
		<S.FooterInputContainer>
			<S.IconWrapper>
				<S.RotatingIcon
					isRotated={isRotated}
					onClick={handleClick}
				>
					<FiPlusCircle/>
				</S.RotatingIcon>
			</S.IconWrapper>
			<S.FooterInputWrapper>
				<S.FooterInput type="text" placeholder="메세지를 입력하세요"/>
				<BiSend/>
			</S.FooterInputWrapper>
		</S.FooterInputContainer>
	);
};

export default FooterInput;