import '@emotion/react'
import {ColorTypes, FontSizeTypes, BorderRadiusTypes, ButtonScheme, FontWeightTypes} from "@/styles/theme";

declare module '@emotion/react' {
	export interface Theme {
		color:ColorTypes
		fontSize:FontSizeTypes,
		borderRadius:BorderRadiusTypes,
		buttonScheme:ButtonScheme,
		fontWeight:FontWeightTypes,
	}
}