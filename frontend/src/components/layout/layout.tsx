import React from 'react';
import * as S from "@/components/layout/layout.style"
import Header from "@/components/header/header"
import Footer from "@/components/footer/footer";
import QuizHeader from '../quizHeader/quizHeader';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<S.LayoutWrapper>
			<Header />
			<QuizHeader question="사과는 어떤 과일일까요? 보기: 빨갛고, 둥글며..." time="00:30" />
			<S.LayoutContainer>
				{children}
			</S.LayoutContainer>
			<Footer />
		</S.LayoutWrapper>
	);
};

export default Layout;