import type {Theme} from "@emotion/react";

const color={
	blue10:"#D5E4FF",
	blue0:"#EAF1FF",
	black: "#1F1F1F",
	white: "#FFFFFF",
	gray50:"#5F6B7A",
	gray10:"#D5E4FF",
	blue20:"#D5E4FF",
	darkblue:"#5A8BD9",
	blue30:"#8BB2F2",
	gray30:"#989898",
	gray: "#F4F6FA",
	chatBlue: "#BFD5FF"

}

const fontSize={
	xs:"0.625rem",//10px
	s:"0.75rem",//12px
	sm:"0.875rem",	//"14px"
	md:"0.938rem",//15px
	lg:"1rem",//16px
	xl:"1.25rem",//20px
}
const fontWeight={
	s:"400",
	m:"500",
	lg:"600",
	xl:"700",

}
const borderRadius ={
	xx:"0.5rem",//8px
	x:"0.625rem",//10px
	s:"0.75rem",//12px
	m:"1.5rem",//24px
}
const buttonScheme = {
	default: {
		color: color.black,
		backgroundColor: color.blue20,
	"&:hover": {
		color: color.black,
		backgroundColor: color.blue30,
	},
	},
} as const;

export type ColorTypes=typeof color;
export type FontSizeTypes=typeof fontSize;
export type FontWeightTypes=typeof fontWeight;
export type BorderRadiusTypes =typeof borderRadius;
export type ButtonScheme=typeof buttonScheme;
const theme:Theme={
	color,
	fontSize,
	borderRadius,
	buttonScheme,
	fontWeight,
}
export default theme;