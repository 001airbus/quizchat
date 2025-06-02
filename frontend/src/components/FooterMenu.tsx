import styled from "styled-components";
import { RiFileListLine } from "react-icons/ri";
import { RiUserLine } from "react-icons/ri";

type FooterMenuProps = {
    openVoteModal: () => void;
    setChatAutoInput: React.Dispatch<React.SetStateAction<string>>;
};

function FooterMenu({openVoteModal, setChatAutoInput }: FooterMenuProps){
    return (
        <FooterMenuContainer>
            <MenuItem>
                <FooterMenuFirst onClick={openVoteModal} />
                <FooterMenuText>투표</FooterMenuText>
            </MenuItem>
            <MenuItem>
                <FooterMenuSecond onClick={() => setChatAutoInput("/quiz 문제: 정답: 제한시간: ")}/>
                <FooterMenuText>퀴즈</FooterMenuText>
            </MenuItem>

        </FooterMenuContainer>
    )
}

const FooterMenuFirst = styled(RiFileListLine)`
    font-size: 20px;
    color: #5A8BD9;
    background:none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
`

const FooterMenuSecond = styled(RiUserLine)`
    font-size: 20px;
    color: #5A8BD9;
    background:none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
`

const FooterMenuText = styled.p`
    font-size: 12px;
    color: #5A8BD9;
    text-align: center;
`

const MenuItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
`

const FooterMenuContainer = styled.div`
    width: 323px;
    min-height: 40px;

    background-color: #FFFFFF;
    
    display: flex;
    justify-content: center;
    align-itmes: center;
    gap: 40px;
    margin-top: 10px;
    margin-bottom: 4px;
`

export default FooterMenu;