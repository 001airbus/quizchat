import styled from "@emotion/styled";

export const ButtonContainer = styled.button(({ theme }) => ({
  ...theme.buttonScheme.default,
  display: "flex",
  width: "16.875rem",
  height: "2.76044rem",
  padding: "0.625rem 0.875rem",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
  gap: "0.5rem",
  fontSize: theme.fontSize.sm,
  borderRadius: theme.borderRadius.xx,
}));
