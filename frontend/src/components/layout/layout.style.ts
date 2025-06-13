import styled from "@emotion/styled";

export const LayoutWrapper = styled.div({
	display: "grid",
	gridTemplateRows: "0fr 1fr 0fr",
	height: "100vh",
	overflow: "hidden",
});

export const LayoutContainer = styled.div({
	width: "100%",
	backgroundColor: "#ffffff",
	overflow: "hidden",
	display: "flex",
flexDirection: "column",
});