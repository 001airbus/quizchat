import styled from "@emotion/styled";

export const Wrapper = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  backgroundColor: theme.color.gray,
  padding: "0.75rem",
  borderRadius: theme.borderRadius.s,
  width: "fit-content",
  maxWidth: "90%",
  margin: "0.35rem 0.5rem",
}));

export const Icon = styled.div<{ type: string }>(({ theme, type }) => {
  const colors = {
    correct: theme.color.darkblue,
    voteStart: theme.color.darkblue,
    voteEnd: theme.color.darkblue,
    warning: theme.color.darkblue,
  };
  return {
    color: colors[type as keyof typeof colors],
    fontSize: "1.2rem",
  };
});

export const Text = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.s,
  color: theme.color.black,
}));

export const Time = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.xs,
  color: theme.color.gray50,
  marginLeft: "auto",
}));