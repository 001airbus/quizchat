import { FiUser } from "react-icons/fi";
import { RiFileListLine } from "react-icons/ri";
import * as S from "@/components/footer/footerMenu/footerMenu.style";
import { Label } from "@/constants/label";
import { useNavigate } from "react-router-dom";
import { useQuizHandler } from "@/socket/quizHandler";

const FooterMenu = () => {
  const nav = useNavigate();
  const { requestStartQuiz } = useQuizHandler();

  const handleVoteClick = () => {
    nav("/vote");
  };
  const handleQuizClick = () => {
    requestStartQuiz();
    nav("/quiz");
  };

  return (
    <S.FooterMenuContainer>
      <S.FooterMenuWrapper>
        {" "}
        <RiFileListLine onClick={handleVoteClick} />
        <S.FooterMenuLabel> {Label.VOTE}</S.FooterMenuLabel>
      </S.FooterMenuWrapper>
      <S.FooterMenuWrapper>
        <FiUser onClick={handleQuizClick} />
        <S.FooterMenuLabel>{Label.QUIZ}</S.FooterMenuLabel>
      </S.FooterMenuWrapper>
    </S.FooterMenuContainer>
  );
};
export default FooterMenu;
