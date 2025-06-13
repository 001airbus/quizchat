import styled from "@emotion/styled";

export const HeaderContainer = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center; 
  position: relative; 
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 8px solid #E9F1FF;
`;

export const Title = styled.p(({ theme }) => ({
  margin: 0,
  fontWeight: "bold",
  fontSize: theme.fontSize.xl,
  color: theme.color.darkblue,
  textAlign: "center",
  flex: 1,
}));

export const UserInfo = styled.div(({ theme }) => ({
  position: "absolute",
  right: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: theme.fontSize.sm,
  color: theme.color.darkblue,
  span: {
    color: theme.color.darkblue,
    fontWeight: 500,
  },
}));