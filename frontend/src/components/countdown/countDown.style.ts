import styled from "@emotion/styled";
export const CountDownContainer = styled.div(({ theme }) => ({
	display: "flex",
	color: theme.color.gray30,
	textAlign: "center",
	alignItems: "center",
	justifyContent: "center",
	fontSize: theme.fontSize.xs,
	fontWeight: theme.fontWeight.m,
}));