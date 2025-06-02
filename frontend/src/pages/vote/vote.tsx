
import BubbleHeader from "@/components/bubbleHeader/bubbleHeader";
import VoteCard from "@/components/vote/voteCard";
import {Label} from "@/constants/label";
import { useModalStore } from "@/store/useModalStore";
import * as S from "@/pages/vote/vote.style"
import {useVoteStore} from "@/store/useVoteStore";
const Vote = () => {
	const { isOpenModal } = useModalStore();
	const {title} = useVoteStore();
	const VoteHeader=title.trim()?title:"생성된 투표가 없습니다"
	return (
		<>
			<BubbleHeader type="vote" question={VoteHeader} hasVote={!!title.trim()}/>
			{isOpenModal.vote && <VoteCard />}

		</>
	);
};
export default Vote;