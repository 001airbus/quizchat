import styled from "styled-components";

type ButtonProps = {
    text: string;
    variant?: 'primary' | 'section' | 'hover' | 'active' | 'warning';
    onClick?: () => void;
}
type VariantStyle = {
    background: string;
    color: string;
    hoverBackground?: string;
    activeBackground?: string;
}


const variantStyles: Record<string, VariantStyle> = {
    primary: {
        background: '#BFD5FF',
        color: '#1F1F1F',
        hoverBackground: '#D5E4FF',
        activeBackground: '#8BB2F2',
    },
    section: {
        background: '#EAF1FF',
        color: '#1F1F1F',
    },
    hover: {
        background: '#D5E4FF',
        color: '#1F1F1F',
    },
    active: {
        background: '#8BB2F2',
        color: '#1F1F1F',
    },
    warning: {
        background: '#FFBEBE',
        color: '#1F1F1F',
    }
}



function Button({text, variant = 'primary', onClick}:  ButtonProps) {
    return (
        <ButtonStyle $variant={variant} onClick={onClick}>{text}</ButtonStyle>
    )
}

const ButtonStyle = styled.button<{$variant: keyof typeof variantStyles}>`
    width: 241px;
    height: 40px;

    background-color: ${({$variant}) => variantStyles[$variant].background};
    color: ${({$variant}) => variantStyles[$variant].color};
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {background-color: ${({ $variant }) => variantStyles[$variant].hoverBackground};}
    &:active {background-color: ${({ $variant }) => variantStyles[$variant].activeBackground};}
`

export default Button;