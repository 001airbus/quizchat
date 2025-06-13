import * as S from "@/components/footer/footer.style";
import FooterInput from "@/components/footer/footerInput/footerInput";
import FooterUserName from "@/components/footer/footerUserName/footerUserName";
import FooterMenu from "@/components/footer/footerMenu/footerMenu";
import UserNameChange from "@/components/modal/userNameChange/userNameChange";
import React, { useState } from "react";
import {useAuth} from "@/hooks/useAuth";


const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpenModal, handleSave ,openModal} = useAuth();



  return (
    <>
      <S.FooterContainer isExpanded={isExpanded}>
        <FooterUserName onClick={() => openModal('nickName')}/>
        <FooterInput isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        {isExpanded && <FooterMenu />}
      </S.FooterContainer>
      {isOpenModal.nickName && (
        <UserNameChange onSave={handleSave} />
      )}
    </>
  );
};

export default Footer;