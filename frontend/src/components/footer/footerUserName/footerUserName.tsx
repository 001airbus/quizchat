import * as S from "@/components/footer/footerUserName/footerUserName.style";
import React from "react";
import { PiPencilSimpleLine } from "react-icons/pi";
import {useUserStore} from "@/store/useUserStore";
const FooterUserName = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const {nickName}=useUserStore();

	return (
		<S.FooterUserNameContainer {...props} >
			{nickName} 님
			<PiPencilSimpleLine size={"14"}/>
		</S.FooterUserNameContainer>
	);
};

export default FooterUserName;