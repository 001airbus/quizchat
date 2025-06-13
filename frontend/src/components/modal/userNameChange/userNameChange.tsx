import * as S from "./userNameChange.style";
import {useUserStore} from "@/store/useUserStore";

interface UserNameChangeProps {
  onSave: (nickName: string) => void;
}

const UserNameChange = ({  onSave }: UserNameChangeProps) => {
  const { nickName, setNickName} = useUserStore();
  const handleSave = () => {
    const trimmedNickName = nickName.trim();
    if (!trimmedNickName) {
      alert("닉네임이 빈칸입니다");
      return;
    }
    onSave(trimmedNickName);

  };
  return (
    <S.Modal>
      <S.ModalContainer>
        <S.ModalTitle>사용할 닉네임을 입력해주세요</S.ModalTitle>
        <S.ModalInput
          type="text"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          placeholder="닉네임 입력"
        />
        <S.ConfirmButton onClick={handleSave}>완료</S.ConfirmButton>
      </S.ModalContainer>
    </S.Modal>
  );
};

export default UserNameChange;