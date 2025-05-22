import * as S from "@/components/footer/footerInput/footerInput.style";
import { BiSend } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";

const Footer = () => {
	return (
		<S.FooterInputContainer>
			<S.IconWrapper>
				<FiPlusCircle />
			</S.IconWrapper>
			<S.FooterInputWrapper>
				<S.FooterInput type="text" placeholder="메세지를 입력하세요" />
				<BiSend />
			</S.FooterInputWrapper>
		</S.FooterInputContainer>
	);
};

export default Footer;