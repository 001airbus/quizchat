import './App.css'
import { useEffect, useState } from 'react'
import { useMessageHandler } from './socket/messageHandler';
import { useVoteHandler } from './socket/voteHandler';
import { useUserHandler } from './socket/userHandler';
import { useQuizHandler } from './socket/quizHandler';
import type { VoteItem } from '../../common/types';

function App() {
  // 유저 관련
  const { nickName, setNickName, updateNickName, requestJoinRoom } = useUserHandler();

  // 프론트 TODO : 로컬 스토리지에 user의 Id를 저장해서 새로고침했을 때 id가 존재한다면 join하지 않도록 처리
  useEffect(() => {
    requestJoinRoom("테스트유저");
  }, []); 

  // 퀴즈 관련
  const { requestStartQuiz, answer, setAnswer, requestAnswer } = useQuizHandler();

  // 메시지 관련
  const { message, setMessage, messages, sendMessage } = useMessageHandler();

  // 투표 관련
  const { vote, startVote, submitVote, endVote } = useVoteHandler();
  const [newTitle, setNewTitle] = useState('');
  const [newItems, setNewItems] = useState<string[]>(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const handleVoteClick = (itemId: number) => {
    if(!vote || !vote.isActive) return;

    const update = new Set(selectedItems);

    if(update.has(itemId)){
      update.delete(itemId);
    }else{
      if(!vote?.isMultiple){
        update.clear();
      }
      update.add(itemId);
    }

    setSelectedItems(update);
    submitVote(Array.from(update));
  }

  const handleStartVote = () => {
    const formattedItems: VoteItem[] = newItems
      .filter(itemText => itemText.trim() !== '')
      .map((itemText, index) => ({
        itemId: index,
        text: itemText,
        count: 0
      }));
    
    if(!newTitle.trim()){
      alert('투표 제목을 입력해주세요.');
      return;
    }
    if(formattedItems.length ===0){
      alert('투표 항목을 최소 하나 이상 입력해주세요.');
      return;
    }

    startVote(newTitle, formattedItems, allowMultiple); // 변환된 데이터 startVote 함수에 전달

    // 투표 시작 후 입력 필드 초기화
    setNewTitle('');
    setNewItems(['', '']);
    setAllowMultiple(false);
  }

  return (
    <>
      {/* 유저 */}
      <div>
        <input type='text' value={nickName} onChange={(e) => setNickName(e.target.value)} />
        <button onClick={updateNickName}>닉네임 변경</button>
      </div>

      {/* 퀴즈 */}
      <div>
        <button onClick={requestStartQuiz}>퀴즈 시작</button>
        <input type='text' value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button onClick={requestAnswer}>정답 보내기</button>
      </div>

      {/* 메시지 */}
      <div>
        <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>메세지 보내기</button>
      </div>
      {/* 투표 */}
      <div>
        <h3>투표 생성하기</h3>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='투표 제목'/>
        {newItems.map((item, index) => (
            <input key={index} value={item}
              onChange={(e) => {
                const newArray = [...newItems];
                newArray[index] = e.target.value;
                setNewItems(newArray);
              }}
              placeholder={`항목 ${index + 1}`}/>
        ))}
        <button onClick={() => setNewItems([...newItems, ''])}>항목 추가</button>
        <label>
          <input type='checkbox' checked={allowMultiple} onChange={(e) => setAllowMultiple(e.target.checked)}/>
          중복 투표 가능
        </label>
        <button onClick={handleStartVote}>투표 시작</button>

        {/* 현재 투표 상태 */}
        {vote && (
          <div>
            <h3>{vote.title}</h3>
            {vote.items.map((item) => (
              <div key={item.itemId}>
                <button onClick={() => handleVoteClick(item.itemId)}
                  // style={{ backgroundColor: selectedItems.has(item.itemId) ? 'gray' : 'transparent'}}
                >
                  {item.text} ({item.count})
                </button>
              </div>
            ))}
            {vote.isActive && <button onClick={endVote}>투표 종료</button>}
          </div>
        )}
      </div>
    </>
  )
}

export default App;