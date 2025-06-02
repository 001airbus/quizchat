
import React from 'react';
import {GlobalStyle} from "@/styles/global";
import {Global} from "@emotion/react"
import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme"
import {Outlet} from "react-router-dom"
import Layout from "@/components/layout/layout";
const App:React.FC =()=>{
  return(

      <ThemeProvider theme={theme}>
        <Global styles={GlobalStyle}/>
        <Layout>
          <Outlet />
        </Layout>
      </ThemeProvider>
  )
}

export default App;