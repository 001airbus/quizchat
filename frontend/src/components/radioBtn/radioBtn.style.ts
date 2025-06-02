import styled from "@emotion/styled";

export const RadioWrapper = styled.div`
 	 display: flex;
  	align-items: center;
		width: 100%;
    gap:0.5rem;
		margin-bottom: 0.5rem;
		margin-left:0.5rem;
		justify-content: flex-start;
`;
export const RadioStatusText= styled.div(({ theme }) => ({
	color: theme.color.gray50,
	fontSize: theme.fontSize.s,
	fontWeight: theme.fontWeight.s,
	width: "100%",
	justifyContent: "flex-start",
	padding: "0.5rem",
}))

export const RadioInput = styled.input`
    appearance: none;
    width: 1rem;
    height: 1rem;
    border: 2px solid #5a8bd9;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
    &:checked::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0.5rem;
        height: 0.5rem;
        background-color: #5a8bd9;
        border-radius: 50%;
    }
`;
export const RadioLabel = styled.label`
  font-size: 0.875rem;
  color: #333;
  cursor: pointer;

  span {
    margin-left: 0.5rem;
  }
`;