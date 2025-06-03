import { useState } from "react";
import styled from "styled-components";
import Input from "../../components/Input";
import Menu from "../../assets/menu.svg?react";
import NameChange from "../../assets/nameChange.svg?react";
import Send from "../../assets/send.svg?react";
import Menu_Vote from "../../assets/menu_vote.svg?react";
import Menu_Quiz from "../../assets/menu_quiz.svg?react";

function MessageInput(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <MessageInputStyle>
            <NameRow>
                <p>닉네임 표기 부분</p>
                <StyledNameChangeIcon />
            </NameRow>
            <InputRow>
                <StyledMenuIcon onClick={toggleMenu} $isMenuOpen={isMenuOpen} />
                <Input placeholder="채팅을 시작해보세요!" variant="chat" width="100%"/>
                <StyledSendIcon onClick={() => console.log("Send clicked")} />
            </InputRow>
            <ActionMenuContainer $isOpen={isMenuOpen}>
                <MenuItem onClick={() => console.log("설정 클릭")}>
                    <Menu_Vote />
                    투표
                </MenuItem>
                <MenuItem onClick={() => console.log("도움말 클릭")}>
                    <Menu_Quiz />
                    퀴즈
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
        /* 필요에 따라 추가 스타일링 */
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
    width: 100%; /* 부모 컴포넌트의 너비를 따름 */
    overflow: hidden; /* 내부 콘텐츠가 넘칠 경우 숨김 (애니메이션에 중요) */
    
    /* 애니메이션을 위한 트랜지션 */
    transition: max-height 0.35s ease-in-out, opacity 0.3s ease-in-out, padding 0.35s ease-in-out;
    
    /* 초기 상태 (닫혀 있을 때) */
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;

    ${({ $isOpen }) =>
        $isOpen &&
        `
        max-height: 200px; /* 메뉴 내용에 따라 충분한 높이로 조절 */
        opacity: 1;
        padding-top: 10px; /* 메뉴가 열렸을 때 상단 패딩 */
        padding-bottom: 10px; /* 메뉴가 열렸을 때 하단 패딩 */
    `}
    
    display: flex;
    flex-direction: row;
    gap: 48px;
    justify-content: center;
`;

const MenuItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledSendIcon = styled(Send)`
    ${iconStyle}
    position: absolute;
    right: 8px;
`;

export default MessageInput;