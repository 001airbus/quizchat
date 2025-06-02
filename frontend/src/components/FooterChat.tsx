import styled from "styled-components";
import { RiSendPlane2Line } from "react-icons/ri";
import { PiBoxArrowUp } from "react-icons/pi";

type FooterChatProps = {
  value?: string;
  placeholder?: string;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendClick?: () => void;
};

function FooterChat({
  value,
  placeholder = "무엇이든지 물어보세요",
  onChange,
  onSendClick,
}: FooterChatProps) {
  return (
    <FooterChatContainer>
      <VoteSlideIconButton />
      <ChatStyled value={value} placeholder={placeholder} onChange={onChange} />
      <ChatSendIconButton onClick={onSendClick} />
    </FooterChatContainer>
  );
}

const ChatStyled = styled.input`
  width: 323px;
  height: 44px;

  background-color: #eaf1ff;
  color: #5f6b7a;
  font-size: 14px;
  border: none;
  border-radius: 34px;

  padding: 4px 32px 4px 16px;

  &:focus {
    outline: none;
  }
`;
const ChatSendIconButton = styled(RiSendPlane2Line)`
  position: absolute;
  right: 12px;

  font-size: 24px;
  color: #5A8BD9;
  background: none;
  border: none;
  padding: 0;
  margin: 0;

  display: inline-block;
  cursor: pointer;
`;

const VoteSlideIconButton = styled(PiBoxArrowUp)`
  font-size: 40px;
  color: #5A8BD9;
  background: none;
  border:none;
  padding: 0;
  margin: 0;

  display: inline-block;
  cursor: pointer;
`;

const FooterChatContainer = styled.div`
    position: relative;
    width: 323px;
    height: 80px;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
`

export default FooterChat;
