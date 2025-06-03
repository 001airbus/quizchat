import styled from "styled-components";

function MessageList(){
    return(
        <MessageListStyle>
            <h2>MessageList</h2>
        </MessageListStyle>
    )
}

const MessageListStyle = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    /* padding: 5px; */
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
`;

export default MessageList;