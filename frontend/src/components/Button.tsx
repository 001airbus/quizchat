import type React from "react";
import styled from "styled-components";

interface Props{
    onClick: () => void;
    children: React.ReactNode;
}

function Button({onClick, children}: Props){
    return(
        <ButtonStyle onClick={onClick}>
            {children}
        </ButtonStyle>
    )
}

const ButtonStyle = styled.button`
    display: flex;
    width: 241px;
    height: 40px;
    padding: 10px 14px;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 8px;
    flex-shrink: 0;
    flex-wrap: wrap;
    border: 0;
    border-radius: 8px;
    background: #D5E4FF;

    &:hover{
        background: #8BB2F2;
    }
`;

export default Button;