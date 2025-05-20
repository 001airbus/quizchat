import styled from "styled-components";

function Header(){
    return(
        <HeaderStyle>
            <Indicator />
            <h1>채팅방</h1>
        </HeaderStyle>
    )
}

const HeaderStyle = styled.div`
    height: 107px;
    width: 100%;
    border-bottom: 8px solid #E9F1FF;
    display: flex;
    align-items: center;
    flex-direction: column;

    h1{
        font-size: 20px;
        color: #5A8BD9;
        margin-top: 15px;
    }
`;
const Indicator = styled.div`
    width: 100%;
    height: 41px;
    background-color: #5A8BD9;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
`

export default Header;