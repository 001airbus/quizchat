import * as S from "@/components/footer/footer.style";
import FooterInput from "@/components/footer/footerInput/footerInput";
import FooterUserName from "@/components/footer/footerUserName/footerUserName";
import FooterMenu from "@/components/footer/footerMenu/footerMenu";
import UserNameChange from "@/components/modal/userNameChange/userNameChange";
import { useState } from "react";

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [nickname, setNickname] = useState("척척박사 정진영");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <S.FooterContainer isExpanded={isExpanded}>
        <FooterUserName onClick={() => setIsModalOpen(true)}>
          {nickname}
        </FooterUserName>
		
        <FooterInput isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        {isExpanded && <FooterMenu />}
      </S.FooterContainer>

      {isModalOpen && (
        <UserNameChange
          onClose={() => setIsModalOpen(false)}
          onSave={(newName) => setNickname(newName)}
        />
      )}
    </>
  );
};

export default Footer;
