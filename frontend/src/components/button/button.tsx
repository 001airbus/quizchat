import * as S from "@/components/button/button.style";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <S.ButtonContainer className={className} {...props}>
      {children}
    </S.ButtonContainer>
  );
};

export default Button;
