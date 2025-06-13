import styled from "@emotion/styled";

export const FooterInputContainer = styled.div(({ theme }) => ({
  display: "flex",
  gap: "0.3rem",
  paddingLeft: "0.5rem",
  alignItems: "center",
  justifyContent: "flex-start",
  svg: {
    width: "1.5rem",
    color: theme.color.darkblue,
    height: "1.5rem",
    cursor: "pointer",
  },
}));
export const FooterInputWrapper = styled.div(({ theme }) => ({
  borderRadius: theme.borderRadius.m,
  background: theme.color.blue0,
  display: "flex",
  padding: "0.85rem",
  alignContent: "center",
  alignItems: "center",
}));
export const FooterInput = styled.input(({ theme }) => ({
  background: theme.color.blue0,
  width: "17rem",
}));

export const IconWrapper = styled.div(({ theme }) => ({
  display: "flex",
  gap: "1rem",
}));

export const RotatingIcon = styled.div<{ isRotated: boolean }>(
  ({ isRotated }) => ({
    display: "flex",
    transition: "transform 0.3s ease",
    transform: isRotated ? "rotate(45deg)" : "rotate(0deg)",
    cursor: "pointer",
  })
);
