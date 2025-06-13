import styled from "@emotion/styled";

export const FooterContainer = styled.div<{ isExpanded: boolean }>(({ isExpanded }) => ({
	width: "23.4375rem",
	height: isExpanded ? "10rem" : "8rem",
	bottom: 0,
	zIndex: 10,
	transition: "height 0.3s ease",
}));