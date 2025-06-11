import styled from "styled-components";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import React, { useState } from "react";
import OptionButton from "../../components/OptionButton";

export interface VoteOptionConfig {
  text: string;
  count?: number;
}

export interface VoteData {
  id?: string;
  title: string;
  options: VoteOptionConfig[];
  isAnonymous: boolean;
  ownerNickname?: string;
  allowMultipleSelections: boolean;
  voters?: { [nickname: string]: number[] };
}

type VoteModalProps = {
  mode: "create" | "owner" | "participant"; // 진행중인 투표가 없는 경우 투표만들기 | 투표 생성자 | 투표 참여자
  isOpen: boolean;
  onClose: () => void;
  onCreateVoteSuccess?: (voteData: Omit<VoteData, 'ownerNickname'>) => void;
  onUpdateVoteSuccess?: (updateVoteData: VoteData) => void;
  onCloseVoteRequest?: (voteTitle: string) => void;
  onSubmitVote?: (voteId: string, selectedOptionIndices: number[]) => void;
  currentUserNickname?: string;
  initialVoteData?: VoteData; // owner, participant 모드 또는 create 모드 수정 시 초기 데이터
};



function VoteModal({ mode, isOpen, onClose, onCreateVoteSuccess, onUpdateVoteSuccess, onCloseVoteRequest, onSubmitVote, currentUserNickname, initialVoteData }: VoteModalProps) {
  // create 모드 상태
  const [voteTitle, setVoteTitle] = useState(initialVoteData?.title || "");
  const [options, setOptions] = useState(initialVoteData?.options.map(o => o.text) || ["", ""]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  // create 모드 체크박스 상태
  const [isAnonymousChecked, setIsAnonymousChecked] = useState(initialVoteData?.isAnonymous || false);
  const [allowMultipleSelectionsChecked, setAllowMultipleSelectionsChecked] = useState(initialVoteData?.allowMultipleSelections || false);

  // owner 모드 상태
  const [isEditing, setIsEditing] = useState(false);

  // Alert Modal 상태
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");

  // 모달이 열리거나 mode/initialVoteData가 변경될 때 상태 업데이트
  React.useEffect(() => {
    if (isOpen) {
      if ((mode === 'owner' || mode === 'participant') && initialVoteData) {
        // 공통 초기화
        setVoteTitle(initialVoteData.title);
        setOptions(initialVoteData.options.map(o => o.text));
        setIsAnonymousChecked(initialVoteData.isAnonymous);
        setAllowMultipleSelectionsChecked(initialVoteData.allowMultipleSelections);
        // 참여자 모드일 때, 현재 사용자의 이전 투표 선택 로드
        if (mode === 'participant' && currentUserNickname && initialVoteData.voters?.[currentUserNickname]) {
          setSelectedOptions(initialVoteData.voters[currentUserNickname]);
        }else{
          setSelectedOptions([]);
        }
        setIsEditing(false);    // 오너 모드 수정 상태 초기화
      } else if (mode === 'create' && !initialVoteData) { // initialVoteData가 없는 create 모드일 때 초기화
        setVoteTitle("");
        setOptions(["", ""]);
        setIsAnonymousChecked(false);
        setAllowMultipleSelectionsChecked(false);
      }
    }
  }, [isOpen, mode, initialVoteData, currentUserNickname]);

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

    const voteDetails: Omit<VoteData, 'ownerNickname' | 'id'> = {
      title: voteTitle,
      options: filledOptions.map(text => ({ text, count: 0 })),
      isAnonymous: isAnonymousChecked,
      allowMultipleSelections: allowMultipleSelectionsChecked,
    };

    onCreateVoteSuccess?.(voteDetails);
    // App.tsx에서 성공 후 모달 닫기
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
              <ButtonGroup>
                <HalfButton text="완료" variant="primary" onClick={handleCreateVote} />
                <HalfButton text="취소" variant="primary" onClick={onClose} />
              </ButtonGroup>
            </>
          )}

          {mode === "owner" && initialVoteData &&(
            <>
              <Title>투표정보</Title>
              <Input
                placeholder="투표 제목"
                value={isEditing ? voteTitle : initialVoteData.title}
                readOnly={!isEditing}
                onChange={(e) => {
                  if(isEditing) setVoteTitle(e.target.value);
                }}
              />
              {(isEditing ? options : initialVoteData.options.map(o => o.text)).map((option, index) => (
                <Input
                  key={index}
                  placeholder="항목 입력"
                  value={option}
                  readOnly={!isEditing}
                  onChange={(e) => {
                    if (!isEditing) return;
                    const newOptions = [...options]; // 실제 데이터 바인딩 필요
                    newOptions[index] = e.target.value;
                    setOptions(newOptions); // 실제 데이터 바인딩 필요
                  }}
                />
              ))}
              {isEditing && options.length < 5 && ( // 예시: 최대 5개 항목까지 추가 가능
                <Button
                  text="항목 추가"
                  variant="primary"
                  onClick={() => setOptions([...options, ""])}
                />
              )}
              <CheckboxLabel>
                <input type="checkbox" checked={isEditing ? isAnonymousChecked : initialVoteData.isAnonymous} disabled={!isEditing} onChange={(e) => {if(isEditing) setIsAnonymousChecked(e.target.checked)}} />
                익명 투표
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={isEditing ? allowMultipleSelectionsChecked : initialVoteData.allowMultipleSelections}
                  disabled={!isEditing} onChange={(e) => {if(isEditing) setAllowMultipleSelectionsChecked(e.target.checked)}}
                />
                복수 선택 허용
              </CheckboxLabel>
              <ButtonGroup>
                <HalfButton
                  text="투표 종료"
                  variant="primary"
                  onClick={() => {
                    if (initialVoteData?.title) {
                      onCloseVoteRequest?.(initialVoteData.title);
                    }
                  }}

                />
                <HalfButton
                  text={isEditing ? "저장" : "수정"}
                  variant="primary"
                  onClick={() => {
                    if (isEditing) {
                      // 유효성 검사
                      if (!voteTitle.trim()) {
                        openAlertModal("투표 제목을 입력해주세요.");
                        return;
                      }
                      const filledOptions = options.filter(opt => opt.trim() !== "");
                      if (filledOptions.length === 0) {
                        openAlertModal("최소 한 개 이상의 투표 항목을 입력해주세요.");
                        return;
                      }

                      const updatedVoteDetails: VoteData = {
                        title: voteTitle,
                        options: filledOptions.map(text => {
                          const existingOption = initialVoteData?.options.find(opt => opt.text === text);
                          return { text, count: existingOption?.count || 0 }; // 기존 count 유지 또는 0으로 초기화
                        }),

                        isAnonymous: isAnonymousChecked,
                        allowMultipleSelections: allowMultipleSelectionsChecked,
                        ownerNickname: initialVoteData?.ownerNickname,
                        voters: initialVoteData?.voters,
                      };
                      onUpdateVoteSuccess?.(updatedVoteDetails);
                      // 모달 닫기는 App.tsx의 onUpdateVoteSuccess에서 처리하므로 여기서는 isEditing만 변경
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

          {mode === "participant" && initialVoteData && (
            <> {/* Participant Mode UI */}
              <Title>투표하기: {initialVoteData.title}</Title>
              {initialVoteData.options.map((option, index) => (
                <OptionButton
                  key={index}
                  text={`${option.text} (${option.count || 0}표)`}
                  isSelected={selectedOptions.includes(index)}
                  // disabled={!canVote} // 사용자가 이미 투표했는지 여부에 따라 비활성화 고려
                  onClick={() => {
                    if (initialVoteData.allowMultipleSelections) {
                      setSelectedOptions((prev) =>
                        prev.includes(index)
                          ? prev.filter((i) => i !== index)
                          : [...prev, index]
                      );
                    } else {
                      // 단일 선택
                      setSelectedOptions(prev => prev.includes(index) ? [] : [index]);
                    }
                  }}
                />
              ))}
              <VoteInfoText>
                {initialVoteData.isAnonymous && "이 투표는 익명으로 진행됩니다."}
                {initialVoteData.isAnonymous && initialVoteData.allowMultipleSelections && <br />}
                {initialVoteData.allowMultipleSelections ? "여러 항목에 투표할 수 있습니다." : "한 항목에만 투표할 수 있습니다."}
              </VoteInfoText>
              <ButtonGroup>
                <HalfButton
                  text={(currentUserNickname && initialVoteData?.voters?.[currentUserNickname]) ? "투표 수정" : "투표 완료"}
                  variant="primary"
                  onClick={() => {

                  if (!initialVoteData || !initialVoteData.id) {
                    openAlertModal("투표 정보를 찾을 수 없습니다.");
                    return;
                  }
                  if (selectedOptions.length === 0) {
                    openAlertModal("항목을 선택해주세요.");
                    return;
                  }
                  onSubmitVote?.(initialVoteData.id, selectedOptions);
                }} />
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
  margin-top: 20px;
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

const VoteInfoText = styled.p`
  font-size: 12px;
  color: #5f6b7a;
  text-align: center;
  margin-top: 10px;
`
