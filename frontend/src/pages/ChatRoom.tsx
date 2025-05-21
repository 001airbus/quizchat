import Header from '../components/Header';
import  * as S from './ChatRoom.style'
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';

function ChatRoom(){
    return(
        <S.ChatRoomStyle>
            <Header />
            <MessageList />
            <MessageInput />
        </S.ChatRoomStyle>
    )
}

export default ChatRoom;