import { useState } from "react";
import styled from "styled-components";
import Input from "../../components/Input";
import Menu from "../../assets/menu.svg?react";
import NameChange from "../../assets/nameChange.svg?react";
import Send from "../../assets/send.svg?react";
import Menu_Vote from "../../assets/menu_vote.svg?react";
import Menu_Quiz from "../../assets/menu_quiz.svg?react";

type MessageInputProps = {
    onInitiateCreateVote: () => void;
    chatAutoInput: string;
    setChatAutoInput: React.Dispatch<React.SetStateAction<string>>;
    currentNickname: string;
    onRequestNicknameChange: () => void;
    onSendMessage: (messageText: string) => void;
};

function MessageInput({ onInitiateCreateVote, chatAutoInput, setChatAutoInput, currentNickname, onRequestNicknameChange, onSendMessage }: MessageInputProps){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(chatAutoInput);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleVoteClick = () => {
        onInitiateCreateVote();
        setIsMenuOpen(false);
    };

    const handleQuizClick = () => {
        setChatAutoInput("/quiz 문제: 정답: 제한시간: ");
        setCurrentMessage("/quiz 문제: 정답: 제한시간: ");
        setIsMenuOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMessage(e.target.value);
        setChatAutoInput(e.target.value);
    };

    const handleSendClick = () => {
        onSendMessage(currentMessage);
        setCurrentMessage("");
        setChatAutoInput("");
    };

    return (
        <MessageInputStyle>
            <NameRow>
                <p>{currentNickname || '닉네임 설정 필요'}</p> {/* 닉네임 표시, 없으면 기본 텍스트 */}
                <StyledNameChangeIcon onClick={onRequestNicknameChange} />
            </NameRow>
            <InputRow>
                <StyledMenuIcon onClick={toggleMenu} $isMenuOpen={isMenuOpen} />
                <Input
                    placeholder="채팅을 시작해보세요!"
                    variant="chat"
                    width="100%"
                    value={currentMessage}
                    onChange={handleInputChange}
                />
                <StyledSendIcon onClick={handleSendClick} />
            </InputRow>
            <ActionMenuContainer $isOpen={isMenuOpen}>
                <MenuItem onClick={handleVoteClick}>
                    <Menu_Vote />
                    <span>투표</span>
                </MenuItem>
                <MenuItem onClick={handleQuizClick}>
                    <Menu_Quiz />
                    <span>퀴즈</span>
                </MenuItem>
            </ActionMenuContainer>
        </MessageInputStyle>
    )
}

const MessageInputStyle = styled.div`
    min-height: 100px;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    border-radius: 12px 12px 0px 0px;
    background: #FFF;
    box-shadow: 0px 0px 3px 0px #DDE3EB;

    p {
        margin: 0 0 4px 0;
        font-size: 14px;
        color: #5F6B7A;
    }
`;

const NameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const InputRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    position: relative;
`;

const iconStyle = `
    width: 24px; /* 아이콘 크기 설정 */
    height: 24px; /* 아이콘 크기 설정 */
    cursor: pointer;
`;

const StyledNameChangeIcon = styled(NameChange)`
`;

const StyledMenuIcon = styled(Menu)<{ $isMenuOpen: boolean }>`
    ${iconStyle}
    transition: transform 0.3s ease-in-out;
    transform: ${({ $isMenuOpen }) => $isMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
`;

const ActionMenuContainer = styled.div<{ $isOpen: boolean }>`
    width: 100%;
    overflow: hidden;
    
    transition: max-height 0.35s ease-in-out, opacity 0.3s ease-in-out, padding 0.35s ease-in-out;
    
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;

    ${({ $isOpen }) =>
        $isOpen &&
        `
        max-height: 200px;
        opacity: 1;
        padding-top: 10px;
        padding-bottom: 10px;
    `}
    
    display: flex;
    flex-direction: row;
    gap: 48px;
    justify-content: center;
`;

const MenuItem = styled.div`
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;

    span{
        color: #5A8BD9;
        font-size: 12px;
    }

    svg{
        fill: #5A8BD9;
    }
`;

const StyledSendIcon = styled(Send)`
    ${iconStyle}
    position: absolute;
    right: 8px;
`;

export default MessageInput;