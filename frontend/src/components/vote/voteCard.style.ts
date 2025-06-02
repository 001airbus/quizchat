import styled from "@emotion/styled";

export const VoteContainer = styled.div(({ theme }) => ({
	display: "flex",

	padding: "0rem 1rem",
	flexDirection: "column",
		margin: "2rem",
	gap: "0.625rem",
	borderRadius: "0.75rem",
	border: "1px solid #5A8BD9",
	boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
		overflow: "auto",
	}
))

export const VoteTitle = styled.div(({ theme }) => ({
	color: theme.color.darkblue,
	textAlign: "center",
	marginTop: "2.75rem" as string,
	fontSize: theme.fontSize.md,
	fontWeight: theme.fontWeight.lg,
}))
export const VoteCountDownWrapper = styled.div(({ theme }) => ({
	display: "flex",
	width: "100%",
	justifyContent: "flex-end",
	alignItems: "center",
	gap: "0.5rem",
	marginBottom: "0.5rem",
}))