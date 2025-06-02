import * as S from "@/components/footer/footerUserName/footerUserName.style";
import React from "react";
import { PiPencilSimpleLine } from "react-icons/pi";
const FooterUserName = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<S.FooterUserNameContainer {...props}>
			{children} 님
			<PiPencilSimpleLine size={"14"}/>
		</S.FooterUserNameContainer>
	);
};

export default FooterUserName;