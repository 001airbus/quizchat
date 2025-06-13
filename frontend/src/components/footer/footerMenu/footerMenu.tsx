import { FiUser } from "react-icons/fi";
import { RiFileListLine } from "react-icons/ri";
import * as S from "@/components/footer/footerMenu/footerMenu.style";
import { Label } from "@/constants/label";
import { useModalStore } from "@/store/useModalStore";
import {useVoteStore} from "@/store/useVoteStore";
import {useQuizStore} from "@/store/useQuizStore";
import { requestStartQuiz } from "@/socket/quizHandler";

const FooterMenu = () => {
   const { voteState } = useVoteStore();
   const { quizState }=useQuizStore();
  const { openModal } = useModalStore();


  const handleVoteClick = () => {
    const hasActive = (voteState?.isActive && !voteState?.isEnded) || (quizState?.isActive && !quizState?.isEnded);

    if (hasActive) {
      alert("진행 중인 투표 또는 퀴즈가 있습니다.");
      return;
    }

    openModal("vote");
  };

  const handleQuizClick = () => {
    console.log("퀴즈버튼클릭")
    const hasActive = (voteState?.isActive && !voteState?.isEnded) || (quizState?.isActive && !quizState?.isEnded);

    if (hasActive) {
      alert("진행 중인 투표 또는 퀴즈가 있습니다.");
      return;
    }
    requestStartQuiz();
  };

  return (
    <S.FooterMenuContainer>
      <S.FooterMenuWrapper>
        <RiFileListLine onClick={handleVoteClick} />
        <S.FooterMenuLabel>{Label.VOTE}</S.FooterMenuLabel>
      </S.FooterMenuWrapper>
      <S.FooterMenuWrapper>
        <FiUser onClick={handleQuizClick} />
        <S.FooterMenuLabel>{Label.QUIZ}</S.FooterMenuLabel>
      </S.FooterMenuWrapper>
    </S.FooterMenuContainer>
  );
};

export default FooterMenu;