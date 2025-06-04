import styled from "styled-components";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";
import OptionButton from "../../components/OptionButton";

type VoteModalProps = {
  mode: "create" | "owner" | "participant"; // 진행중인 투표가 없는 경우 투표만들기 | 투표 생성자 | 투표 참여자
  isOpen: boolean;
  onClose: () => void;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  /*min-width: 280px;*/
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

function VoteModal({ mode, isOpen, onClose }: VoteModalProps) {
  // create
  const [voteTitle, setVoteTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // owner
  const [isEditing, setIsEditing] = useState(false);

  return (
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
              <input type="checkbox" name="anonymous" />
              익명 투표
            </CheckboxLabel>

            <ButtonGroup marginTop={40}>
              <HalfButton text="완료" variant="primary" onClick={() => {}} />
              <HalfButton text="취소" variant="primary" onClick={onClose} />
            </ButtonGroup>
          </>
        )}

        {mode === "owner" && (
          <>
            <Title>투표정보</Title>

            <Input
              placeholder="투표 제목"
              value={voteTitle}
              readOnly={!isEditing}
              onChange={(e) => setVoteTitle(e.target.value)}
            />

            {options.map((option, index) => (
              <Input
                key={index}
                placeholder="항목 입력"
                value={option}
                readOnly={!isEditing}
                onChange={(e) => {
                  if (!isEditing) return;
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
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
                onClick={() => {}}
              />
              <HalfButton
                text={isEditing ? "저장" : "수정"}
                variant="primary"
                onClick={() => {
                    if (isEditing) {
                        console.log("수정된 제목", voteTitle)
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
            <Input value={voteTitle} readOnly placeholder="투표 제목" />

            {options.map((option, index) => (
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
            <p>복수선택 가능</p> 
            <ButtonGroup marginTop={40}>
              <HalfButton text="완료" variant="primary" onClick={() => {}} />
              <HalfButton text="닫기" variant="primary" onClick={onClose} />
            </ButtonGroup>
          </>
        )}
      </Container>
    </Modal>
  );
}

export default VoteModal;
