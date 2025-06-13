import * as S from "@/components/header/header.style";
import { FiUser } from "react-icons/fi";
import {useUserStore} from "@/store/useUserStore";


const Header = () => {
  const currentUsers = useUserStore((state) => state.currentUsers);
  return (
    <S.HeaderContainer>
      <S.Title>채팅방</S.Title>
      <S.UserInfo>
        <FiUser size={20} />
         <span>{currentUsers}</span>
      </S.UserInfo>
    </S.HeaderContainer>
  );
};

export default Header;