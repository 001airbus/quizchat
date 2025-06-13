import styled from "@emotion/styled";

export const MessageWrapper = styled.div<{ isMine: boolean }>(({ isMine }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: isMine ? "flex-end" : "flex-start",
  margin: "0.35rem 0.5rem",
}));

export const SenderLabel = styled.div<{ isMine: boolean }>(({ theme }) => ({
  fontSize: theme.fontSize.xs,
  color: theme.color.gray50,
  marginBottom: "0.2rem",
}));

export const BubbleRow = styled.div<{ isMine: boolean }>(({ isMine }) => ({
  display: "flex",
  flexDirection: isMine ? "row-reverse" : "row",
  alignItems: "flex-end",
  gap: "0.3rem",
}));

export const ChatUserMessageContainer = styled.div<{ isMine: boolean }>(({ theme, isMine }) => ({
  backgroundColor: isMine ? theme.color.chatBlue : theme.color.gray10,
  color: theme.color.black,
  fontSize: theme.fontSize.s,
  padding: "0.75rem 1rem",
  borderRadius: theme.borderRadius.s,
  maxWidth: "70%",
  wordBreak: "break-word",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
}));

export const TimeLabel = styled.div<{ isMine: boolean }>(({ theme }) => ({
  fontSize: theme.fontSize.xs,
  color: theme.color.gray50,
  marginBottom: "0.2rem",
}));