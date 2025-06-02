import styled from "styled-components";

type FooterUserName = {
    text?: string;
    value: string;
}

function FooterUserName({text, value}: FooterUserName) {
    return (
        <FooterUserNameStyle>
            {text} : {value}
        </FooterUserNameStyle>
    )
}

const FooterUserNameStyle = styled.p`
    width: 323px;
    height: 16px;

    color: #5F6B7A;

    padding: 4px;
    margin-bottom: 2px;

`

export default FooterUserName;