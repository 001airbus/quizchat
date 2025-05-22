import * as S from "@/components/header/header.style";
import { FiUser } from "react-icons/fi";

// interface HeaderProps {
//   userCount: number;
// }

const Header = (
	// { userCount }: HeaderProps
) => {
  return (
    <S.HeaderContainer>
      <S.Title>채팅방</S.Title>
      <S.UserInfo>
        <FiUser size={20} />
        {/* <span>{userCount}</span> */}
        <span>30</span>
      </S.UserInfo>
    </S.HeaderContainer>
  );
};

export default Header;