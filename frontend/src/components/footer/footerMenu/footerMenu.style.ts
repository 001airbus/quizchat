
import styled from "@emotion/styled";
export const FooterMenuContainer = styled.div(({ theme }) => ({
	display: "flex",
	gap:"2rem",
	textAlign: "center",
	alignItems: "center",
	justifyContent: "center",
	marginTop:"1.3rem",
svg:{
	color: theme.color.darkblue,
	cursor: "pointer",
	width: "1.5rem",
	height: "1.5rem",
}
}));

export const FooterMenuWrapper= styled.div(({ theme }) => ({
display: "flex",
	textAlign: "center",
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",
}))

export const FooterMenuLabel=styled.div(({ theme }) => ({
	color: theme.color.darkblue,
	textAlign: "center",
	alignItems: "center",
	justifyContent: "center",
	fontSize: theme.fontSize.s,
	fontWeight: theme.fontWeight.m,
	margin: "0.63rem",
}))