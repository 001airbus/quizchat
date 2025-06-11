import styled from "styled-components";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";
import OptionButton from "../../components/OptionButton";

// 투표 옵션의 타입을 정의합니다.
export interface VoteOptionConfig {
  text: string;
  // 필요에 따라 id, 투표 수 등의 필드를 추가할 수 있습니다.
}

export interface VoteData {
  title: string;
  options: VoteOptionConfig[];
  isAnonymous: boolean;
  ownerNickname?: string; // 투표 생성자 닉네임 추가
  allowMultipleSelections: boolean;
}

type VoteModalProps = {
  mode: "create" | "owner" | "participant"; // 진행중인 투표가 없는 경우 투표만들기 | 투표 생성자 | 투표 참여자
  isOpen: boolean;
  onClose: () => void;
  onCreateVoteSuccess?: (voteData: VoteData) => void;
  initialVoteData?: VoteData; // owner, participant 모드 또는 create 모드 수정 시 초기 데이터
};



function VoteModal({ mode, isOpen, onClose, onCreateVoteSuccess }: VoteModalProps) {
  // create 모드 상태
  // initialVoteData prop을 추가하여 owner/participant 모드에서 데이터 표시
  const [voteTitle, setVoteTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  // create 모드 체크박스 상태
  const [isAnonymousChecked, setIsAnonymousChecked] = useState(false);
  const [allowMultipleSelectionsChecked, setAllowMultipleSelectionsChecked] = useState(false);

  // owner 모드 상태
  const [isEditing, setIsEditing] = useState(false);

  // Alert Modal 상태
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");

  const openAlertModal = (message: string) => {
    setAlertModalMessage(message);
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const handleCreateVote = () => {
    if (!voteTitle.trim()) {
      openAlertModal("투표 제목을 입력해주세요.");
      return;
    }
    const filledOptions = options.filter(opt => opt.trim() !== "");
    if (filledOptions.length === 0) {
      openAlertModal("최소 한 개 이상의 투표 항목을 입력해주세요.");
      return;
    }

    const voteDetails: VoteData = {
      title: voteTitle,
      options: filledOptions.map(text => ({ text })),
      isAnonymous: isAnonymousChecked,
      // ownerNickname은 App.tsx의 handleCreateVoteSuccess에서 establishedNickname을 사용하여 추가
      allowMultipleSelections: allowMultipleSelectionsChecked,
    };

    onCreateVoteSuccess?.(voteDetails);
    // onClose(); // App.tsx에서 모달을 닫도록 변경
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Container>
          {mode === "create" && (
            <>
              <Title>투표 작성하기</Title>
              <Input
                placeholder="투표 제목"
                value={voteTitle}
                onChange={(e) => setVoteTitle(e.target.value)}
              />
              {options.map((option, index) => (
                <Input
                  key={index}
                  placeholder="항목 입력"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                />
              ))}
              {options.length < 3 && (
                <Button
                  text="항목 추가"
                  variant="primary"
                  onClick={() => {
                    setOptions([...options, ""]);
                  }}
                />
              )}
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={isAnonymousChecked}
                  onChange={(e) => setIsAnonymousChecked(e.target.checked)}
                />
                익명 투표
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={allowMultipleSelectionsChecked}
                  onChange={(e) => setAllowMultipleSelectionsChecked(e.target.checked)}
                />
                복수 선택 허용
              </CheckboxLabel>
              <ButtonGroup marginTop={40}>
                <HalfButton text="완료" variant="primary" onClick={handleCreateVote} />
                <HalfButton text="취소" variant="primary" onClick={onClose} />
              </ButtonGroup>
            </>
          )}

          {mode === "owner" && (
            <>
              <Title>투표정보</Title>
              <Input
                placeholder="투표 제목"
                value={voteTitle} // 실제 데이터 바인딩 필요
                readOnly={!isEditing}
                onChange={(e) => setVoteTitle(e.target.value)} // 실제 데이터 바인딩 필요
              />
              {options.map((option, index) => ( // 실제 데이터 바인딩 필요
                <Input
                  key={index}
                  placeholder="항목 입력"
                  value={option} // 실제 데이터 바인딩 필요
                  readOnly={!isEditing}
                  onChange={(e) => {
                    if (!isEditing) return;
                    const newOptions = [...options]; // 실제 데이터 바인딩 필요
                    newOptions[index] = e.target.value;
                    setOptions(newOptions); // 실제 데이터 바인딩 필요
                  }}
                />
              ))}
              <CheckboxLabel>
                <input type="checkbox" name="anonymous" disabled={!isEditing} />
                복수선택 가능
              </CheckboxLabel>
              <ButtonGroup>
                <HalfButton
                  text="투표 종료"
                  variant="primary"
                  onClick={() => { /* TODO: 투표 종료 로직 */ }}
                />
                <HalfButton
                  text={isEditing ? "저장" : "수정"}
                  variant="primary"
                  onClick={() => {
                    if (isEditing) {
                      // TODO: 수정 저장 로직
                      console.log("수정된 제목", voteTitle);
                      console.log("수정된 항목", options);
                    }
                    setIsEditing(!isEditing);
                  }}
                />
              </ButtonGroup>
              <ButtonGroup marginTop={-4}>
                <Button text="닫기" variant="primary" onClick={onClose} />
              </ButtonGroup>
            </>
          )}

          {mode === "participant" && (
            <>
              <Title>투표하기</Title>
              <Input value={"실제 투표 제목"} readOnly placeholder="투표 제목" /> {/* 실제 데이터 바인딩 필요 */}
              {["항목1", "항목2"].map((option, index) => ( // 실제 데이터 바인딩 필요
                <OptionButton
                  key={index}
                  text={option}
                  isSelected={selectedOptions.includes(index)}
                  onClick={() => {
                    setSelectedOptions((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index]
                    );
                  }}
                />
              ))}
              <p>복수선택 가능</p> {/* 실제 데이터 바인딩 필요 */}
              <ButtonGroup marginTop={40}>
                <HalfButton text="완료" variant="primary" onClick={() => { /* TODO: 투표 제출 로직 */ }} />
                <HalfButton text="닫기" variant="primary" onClick={onClose} />
              </ButtonGroup>
            </>
          )}
        </Container>
      </Modal>

      <Modal
        isOpen={isAlertModalOpen}
        onClose={closeAlertModal}
        title="알림"
      >
        <AlertModalContent>
          <p>{alertModalMessage}</p>
          <Button text="확인" onClick={closeAlertModal} />
        </AlertModalContent>
      </Modal>
    </>
  );
}

export default VoteModal;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
`;

const Title = styled.h2`
  text-align: center;
  color: #5a8bd9;
  font-size: 15px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonGroup = styled.div<{ marginTop?: number }>`
  width: 241px;
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  margin-top: ${({ marginTop }) => marginTop}px;
  flex-direction: column;
`;


const HalfButton = styled(Button)`
  flex: 1 1 0;
  min-width: 0;
`;

// 알림 모달 내부 컨텐츠 스타일
const AlertModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px;
  text-align: center;
`;
