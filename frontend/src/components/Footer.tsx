import styled from "styled-components";
import FooterChat from "./FooterChat";
import FooterUserName from "./FooterUserName";
import FooterMenu from "./FooterMenu";

type FooterProps = {
    openVoteModal: () => void;
    chatAutoInput: string;
    setChatAutoInput: React.Dispatch<React.SetStateAction<string>>;
};

function Footer({openVoteModal, chatAutoInput, setChatAutoInput}: FooterProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatAutoInput(e.target.value);
    }

    return(
        <FooterWrapper>
            <FooterUserName text="UserID" value="test" />
            <FooterContainer>
                <FooterChat
                    value={chatAutoInput}
                    onChange={handleChange}

                />
            </FooterContainer>
            <FooterMenu openVoteModal={openVoteModal} setChatAutoInput={setChatAutoInput} />
        </FooterWrapper>

    )
}

const FooterWrapper = styled.div`
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    /*background: lightgrey;*/
`

const FooterContainer = styled.div`
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
`

export default Footer;