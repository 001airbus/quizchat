import React from 'react';
import * as S from "@/components/layout/layout.style"
import Header from "@/components/header/header"
import Footer from "@/components/footer/footer";
import BubbleHeader from "@/pageHeader/pageHeader";
import { useVoteStore } from "@/store/useVoteStore";
import {useQuizStore} from "@/store/useQuizStore";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	const { voteState } = useVoteStore();
	const { quizState } = useQuizStore();
	const isVoteActive = voteState?.isActive && !voteState?.isEnded;

const isQuizActive = quizState?.isActive && !quizState?.isEnded;
	return (
		<S.LayoutWrapper>
			<Header />
			<S.LayoutContainer>
				{isVoteActive && (
					<BubbleHeader
						type="vote"
						question={voteState.title}
						hasVote={true}
					/>
				)}
				{isQuizActive && (
					<BubbleHeader
						type="quiz"
						question={quizState.question}
hasVote={false}
					/>
				)}
				{children}
			</S.LayoutContainer>
			<Footer />
		</S.LayoutWrapper>
	);
};

export default Layout;