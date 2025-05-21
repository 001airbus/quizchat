import styled from "styled-components";

type InputProps = {
    value?: string;
    variant?: keyof typeof variantStyles;
    placeholder?: string;

    width?: string; // 고정값 or 유니언 타입으로? primary | vote 
    height?: string;
}

type variantStyle = {
    background: string;
    border: string;
    color: string;
}

const variantStyles: Record<string, variantStyle> = {
    primary: {
        background: '#FFFFFF',
        border: '1px solid #5A8BD9',
        color: '#1F1F1F',
    },
}



function Input({value, variant = 'primary', placeholder = '입력해주세요'}: InputProps) {
    return (
        <InputStyle 
            value={value}
            placeholder={placeholder}
            $variant={variant}
        />
    )
}

const InputStyle = styled.input<{$variant: keyof typeof variantStyles}>`
    width: 241px;
    height: 40px;
    padding: 4px 8px 4px 8px;
    box-sizing: border-box; 

    background-color: ${({$variant}) => variantStyles[$variant].background};
    color: ${({$variant}) => variantStyles[$variant].color};

    border: ${({$variant}) => variantStyles[$variant].border};
    border-radius: 8px;
    cursor: pointer;

`;

export default Input;