import styled from "@emotion/styled";


export const Container = styled.div`
    position: relative;
		width: fit-content;

`;

export const IconWrapper = styled.div(({ theme }) => ({
	position: "absolute",
	right: "1rem",
	top: "55%",
	transform: "translateY(-50%)",
	cursor: "pointer",

	svg: {
		color: theme.color.darkblue,
		width: "1.2rem",
		height: "1.2rem",
	},
}));