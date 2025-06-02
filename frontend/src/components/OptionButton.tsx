import styled from "styled-components"

type OptionButtonProps = {
    text: string;
    isSelected: boolean;
    onClick: () => void;
}

function OptionButton({text, isSelected, onClick}:OptionButtonProps) {
    return(
        <OptionButtonStyle selected={isSelected} onClick={onClick}>{text}</OptionButtonStyle>
    )
}

const OptionButtonStyle = styled.button<{selected?: boolean}>`
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    background-color: ${({selected}) => selected ? "#8BB2F2" : "white"};
    color: ${({selected}) => selected ? "white" : "#1F1F1F"};
    border-radius: 8px;
    border: 1px solid #5A8BD9;
    padding: 4px 8px 4px 8px;
    cursor: pointer;
    `

export default OptionButton;