import styled from "styled-components";

type InputProps = {
    value?: string;
    variant?: keyof typeof variantStyles;
    placeholder?: string;

    width?: string; // 고정값 or 유니언 타입으로? primary | vote 
    height?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
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
    chat: {
        background: '#EAF1FF',
        border: '0',
        color: '#5F6B7A',
    }
}



function Input({value, variant = 'primary', placeholder, width, onChange, readOnly}: InputProps) {
    return (
        <InputStyle 
            value={value}
            placeholder={placeholder}
            $variant={variant}
            width={width}
            onChange={onChange} // 전달받은 onChange 핸들러를 InputStyle에 연결
            readOnly={readOnly}   // readOnly prop도 일관성을 위해 전달
        />
    )
}

const InputStyle = styled.input<{$variant: keyof typeof variantStyles, width?: string}>`
    width: ${({ width }) => width || '241px'};
    height: 40px;
    padding: 4px 8px 4px 8px;
    box-sizing: border-box; 

    background-color: ${({$variant}) => variantStyles[$variant].background};
    color: ${({$variant}) => variantStyles[$variant].color};

    border: ${({$variant}) => variantStyles[$variant].border};
    border-radius: 8px;
    cursor: pointer;

    &:focus{
    outline: none;
    box-shadow: 0 0 0 3px #5A8BD9;
    }

`;

export default Input;