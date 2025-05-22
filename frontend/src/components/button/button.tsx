import * as S from "@/components/button/button.style"
import React from "react";


const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return <S.ButtonContainer {...props}>{children}</S.ButtonContainer>;
};

export default Button;