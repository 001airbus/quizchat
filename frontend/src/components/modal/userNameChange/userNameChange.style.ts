import styled from "@emotion/styled";
import Button from "@/components/button/button";

export const Modal = styled.div({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
});

export const ModalContainer = styled.div(({ theme }) => ({
  backgroundColor: theme.color.white,
  padding: "1.5rem",
  borderRadius: theme.borderRadius.x,
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
  width: "260px",
  height: "200px",
  justifyContent: "center",
  alignItems: "center",
}));

export const ModalTitle = styled.h2(({ theme }) => ({
  fontSize: theme.fontSize.sm,
  fontWeight: theme.fontWeight.lg,
  color: theme.color.black,
}));

export const ModalInput = styled.input(({ theme }) => ({
  padding: "0.6rem",
  width: "100%",
  fontSize: theme.fontSize.sm,
  border: `1px solid ${theme.color.darkblue}`,
  borderRadius: theme.borderRadius.x,
}));

export const ConfirmButton = styled(Button)`
  width: 100%;
  height: 2.5rem;
`;