import React from "react";
import { GlobalStyle } from "@/styles/global";
import { Global } from "@emotion/react";
import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme";
import { Outlet } from "react-router-dom";
import Layout from "@/components/layout/layout";
import UserNameChange from "@/components/modal/userNameChange/userNameChange";
import {useAuth} from "@/hooks/useAuth"
import {useVoteHandler} from "@/socket/voteHandler";
import VoteCard from "@/components/vote/voteCard";


const App: React.FC = () => {
  const { isOpenModal, handleSave } = useAuth();
  useVoteHandler();
  
  return (
    <ThemeProvider theme={theme}>
      <Global styles={GlobalStyle} />
      <Layout>

        <Outlet />
        {isOpenModal.vote && <VoteCard />}
        {isOpenModal.nickName && (
          <UserNameChange onSave={handleSave} />
        )}
      </Layout>
    </ThemeProvider>
  );
};

export default App;