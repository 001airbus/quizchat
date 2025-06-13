import styled from "@emotion/styled";

export const VoteInputContainer = styled.div`
		display: flex;
		flex-direction: column;
		gap:0.62rem;
		justify-content: center;
		align-items: center;`

export const BaseInput = styled.input<{ isSelected?: boolean }>(({ isSelected, theme }) => ({
	border: `1px solid ${theme.color.darkblue}`,
	borderRadius: theme.borderRadius.xx,
	padding: "0.25rem 0.75rem",
	backgroundColor: isSelected ? theme.color.darkblue : "white",
	color: isSelected ? "white" : theme.color.black,
}));
export const LargeInput = styled(BaseInput)(({ theme }) => ({
	width: "17rem",
	height: "3.5rem",
	fontSize: theme.fontSize.lg,
	fontWeight: theme.fontWeight.lg,
}))
export const MediumInput = styled(BaseInput)(({ theme }) => ({
	width: "16rem",
	height: "2.5rem",
	fontSize: theme.fontSize.sm,
	fontWeight: theme.fontWeight.s,
}))

export const AddText = styled.div(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	color: theme.color.darkblue,
	textAlign: "center",
	fontSize: theme.fontSize.xs,
	fontWeight: theme.fontWeight.m,
	width: "100%",
	gap: "0.5rem",
	marginBottom: "0.5rem",
}));
export const ButtonWrapper=styled.div`
    display: flex;
    flex-direction: column;
    margin-Bottom: 2rem;
		gap:0.62rem;
`