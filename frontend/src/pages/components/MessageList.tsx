import styled from "styled-components";
import type { ChatMessage } from "../ChatRoom";
import { useEffect, useRef } from "react";

interface MessageListProps {
    messages: ChatMessage[];
    currentNickname: string;
}

function MessageList({ messages, currentNickname }: MessageListProps){
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return(
        <MessageListStyle>
            {messages.map((msg) => (
                <MessageItem key={msg.id} $isMine={msg.nickname === currentNickname}>
                    <Nickname $isMine={msg.nickname === currentNickname}>{msg.nickname}</Nickname>
                    <Bubble $isMine={msg.nickname === currentNickname}>
                        <Text>{msg.text}</Text>
                    </Bubble>
                    {/* <Timestamp $isMine={msg.nickname === currentNickname}>{new Date(msg.timestamp).toLocaleTimeString()}</Timestamp> */}
                    <Timestamp $isMine={msg.nickname === currentNickname}>{msg.timestamp}</Timestamp>
                    {/* <Timestamp $isMine={msg.nickname === currentNickname}>{dayjs.utc(msg.timestamp).tz('Asia/Seoul').format('HH:mm')}</Timestamp> */}
                </MessageItem>
            ))}
            <div ref={messagesEndRef} />
        </MessageListStyle>
    )
}

const MessageListStyle = styled.div`
    flex: 1 1 0; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
    overflow-y: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const MessageItem = styled.div<{ $isMine: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: ${({ $isMine }) => $isMine ? 'flex-end' : 'flex-start'};
    margin-bottom: 8px;
    ${({ $isMine }) => $isMine ?
        `padding-right: 5px;`
        :
        `padding-left: 5px;`
    };

`;

const Nickname = styled.div<{ $isMine: boolean }>`
    font-size: 12px;
    color: #888;
    margin-bottom: 4px;
    margin-left: ${({ $isMine }) => $isMine ? '0' : '5px'};
    margin-right: ${({ $isMine }) => $isMine ? '5px' : '0'};
`;

const Bubble = styled.div<{ $isMine: boolean }>`
    background-color: ${({ $isMine }) => $isMine ? '#D5E4FF' : '#EAF1FF'};
    color: #1F1F1F;
    padding: 8px 12px;
    border-radius: 12px;
    max-width: 70%;
    word-wrap: break-word;
`;

const Text = styled.p`
    margin: 0;
    font-size: 14px;
`;

const Timestamp = styled.div<{ $isMine: boolean }>`
    font-size: 10px;
    color: #aaa;
    margin-top: 4px;
    margin-left: ${({ $isMine }) => $isMine ? '0' : '5px'};
    margin-right: ${({ $isMine }) => $isMine ? '5px' : '0'};
`;

export default MessageList;