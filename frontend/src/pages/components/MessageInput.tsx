import styled from "styled-components";

function MessageInput(){
    return(
        <MessageInputStyle>
            <p>닉네임 표기 부분</p>
            <div>
                <button>예시</button>
                <input type="text" placeholder="예시"/>
            </div>
        </MessageInputStyle>
    )
}

const MessageInputStyle = styled.div`
    min-height: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 12px 12px 0px 0px;
    background: #FFF;
    box-shadow: 0px 0px 3px 0px #DDE3EB;
`;

export default MessageInput;