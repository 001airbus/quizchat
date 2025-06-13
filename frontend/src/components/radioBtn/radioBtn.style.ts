

import styled from "@emotion/styled";

export const RadioWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
    justify-content: flex-start;
`;

export const RadioInput = styled.input`
    display: none;
`;

export const RadioLabel = styled.label<{ checked: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #333;
    cursor: pointer;
    position: relative;
    padding-left: 1.5rem;
    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1rem;
        height: 1rem;
        border: 2px solid #5a8bd9;
        border-radius: 50%;
        background-color: white; 
    }
		
    ${({ checked }) =>
            checked &&
            `
    &::after {
      content: "";
      position: absolute;
      left: 0.25rem;
      top: 50%;
      transform: translateY(-50%);
      width: 0.5rem;
      height: 0.5rem;
      background-color: #5a8bd9;
      border-radius: 50%;
    }
  `}
`;
export const RadioStatusText= styled.div(({ theme }) => ({
	color: theme.color.gray50,
	fontSize: theme.fontSize.s,
	fontWeight: theme.fontWeight.s,
	width: "100%",
	justifyContent: "flex-start",
	padding: "0.5rem",
}))