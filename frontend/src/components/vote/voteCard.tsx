import * as S from "@/components/vote/voteCard.style";
import CountDown from "@/components/countdown/countDown";
import Content from "@/components/vote/content/content";
import {Label} from "@/constants/label";
const VoteCard=()=>{
		return (
				<S.VoteContainer>
					<S.VoteTitle>{Label.VOTE_TITLE}</S.VoteTitle>
					<S.VoteCountDownWrapper>
						<CountDown/>
					</S.VoteCountDownWrapper>
					<Content/>
				</S.VoteContainer>
		);
}
export default VoteCard;