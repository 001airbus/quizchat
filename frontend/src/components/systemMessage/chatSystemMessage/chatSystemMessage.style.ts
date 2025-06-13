import styled from "@emotion/styled";

export const SystemMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem 0;
`;

export const ChatSystemMessageContainer = styled.div(({ theme }) => ({
  width: "100%",
  color: theme.color.gray30,
  fontSize: theme.fontSize.s,
  display: "flex",
  padding: "0.25rem",
  justifyContent: "center",
}));

export const TimeLabel = styled.span`
  font-size: 0.7rem;
  color: #a0a0a0;
  margin-top: 0.25rem;
`;
