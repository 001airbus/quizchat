import { useTimer } from '@/hooks/useTimer';
import { useVoteStore } from '@/store/useVoteStore';
import * as S from './countDown.style';

const CountDown = () => {
	const { formattedMinutes, formattedSeconds ,isActive} = useTimer();
	const { isSave } = useVoteStore();
	if (!isSave || !isActive) {
		return (
			<S.CountDownContainer>
				1:00
			</S.CountDownContainer>
		);
	}
	return (
		<S.CountDownContainer>
			{formattedMinutes}:{formattedSeconds}
		</S.CountDownContainer>
	);
};

export default CountDown;