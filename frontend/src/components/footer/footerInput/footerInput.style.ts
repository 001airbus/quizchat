import styled from "@emotion/styled";

export const FooterInputContainer= styled.div(({theme}) =>({
	display: "flex",
	gap:"0.3rem",
	paddingLeft:"0.5rem",
	alignItems: "center",
	height:"2rem",
	justifyContent: "flex-start",
 svg:{
	 width: "1.5rem",
	 color:theme.color.darkblue,
	 height: "1.5rem",
 }
}))
export const FooterInputWrapper =styled.div(({theme})=>({
	borderRadius: theme.borderRadius.m,
	background: theme.color.blue0,
	display: "flex",
	padding: "1rem",
	alignContent: "center",
	alignItems: "center",

}))
export const FooterInput=styled.input(({theme})=>({
	background: theme.color.blue0,
	width:"17rem",
}))

export const IconWrapper =styled.div(({theme})=>({
	display: "flex",
	gap:"1rem",
}))