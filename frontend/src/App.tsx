import { useState } from "react";
import ChatRoom from "./pages/ChatRoom";
import VoteModal from "./pages/components/VoteModal";
import { GlobalStyle } from "./styles/global.style";
import Footer from "./components/Footer";

function App() {

  // 투표 모달 상태관리
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [voteMode, setVoteMode] = useState<'create' | 'owner' | 'participant'>('create');

  // 퀴즈 상태관리
  const [chatAutoInput, setChatAutoInput] = useState("");

  return (
    <>
      <GlobalStyle />
      <ChatRoom />

      {/* 투표 (생성/수정/투표자) 테스트 버튼 */}
      <div style={{display:'flex', gap: 8, marginBottom: 16}}>
        <button onClick={() => setVoteMode('create')}>Create 모드</button>
        <button onClick={() => setVoteMode('owner')}>Owner 모드</button>
        <button onClick={() => setVoteMode('participant')}>Participant 모드</button>
      </div>
      <button onClick={()=>setIsVoteModalOpen(true)}>투표 만들기</button>
      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        mode={voteMode}
      />

      <Footer 
        openVoteModal={() => setIsVoteModalOpen(true)}
        chatAutoInput={chatAutoInput}
        setChatAutoInput={setChatAutoInput}
      />
    </>
  )
}

export default App;
