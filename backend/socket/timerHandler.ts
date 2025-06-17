import { Server, Socket } from 'socket.io';
import { getRedisValue, setRedisValue, delRedisValue } from '../utils/redis';

interface TimerState {
	isActive: boolean;
	startTime: number;
	duration: number; // 밀리초 단위
	endTime: number;
}

let currentTimer: TimerState | null = null;
let timerInterval: NodeJS.Timeout | null = null;

const TIMER_DURATION = 60 * 1000; // 1분
const TIMER_REDIS_KEY = 'shared_timer';

async function loadTimerFromRedis(): Promise<TimerState | null> {
	const timerData = await getRedisValue(TIMER_REDIS_KEY);
	return timerData ? JSON.parse(timerData) : null;
}

async function saveTimerToRedis(timer: TimerState | null) {
	if (timer) {
		await setRedisValue(TIMER_REDIS_KEY, JSON.stringify(timer), 60 * 60);
	} else {
		await delRedisValue(TIMER_REDIS_KEY);
	}
}

function broadcastTimerUpdate(io: Server) {
	if (!currentTimer) return;

	const now = Date.now();
	const timeLeft = Math.max(0, currentTimer.endTime - now);

	io.emit('TIMER_UPDATE', {
		isActive: currentTimer.isActive,
		timeLeft,
		startTime: currentTimer.startTime,
		endTime: currentTimer.endTime
	});

	// 타이머 종료 처리
	if (timeLeft <= 0 && currentTimer.isActive) {
		currentTimer.isActive = false;
		io.emit('TIMER_ENDED');
		stopTimer();
	}
}

function startTimerBroadcast(io: Server) {
	if (timerInterval) {
		clearInterval(timerInterval);
	}

	timerInterval = setInterval(() => {
		broadcastTimerUpdate(io);
	}, 1000);
}

function stopTimer() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
	currentTimer = null;
	saveTimerToRedis(null);
}

export function handleTimer(io: Server, socket: Socket) {

	// 타이머 시작
	socket.on('START_TIMER', async (duration?: number) => {
		const now = Date.now();
		const timerDuration = duration || TIMER_DURATION;

		currentTimer = {
			isActive: true,
			startTime: now,
			duration: timerDuration,
			endTime: now + timerDuration
		};

		await saveTimerToRedis(currentTimer);
		startTimerBroadcast(io);

		io.emit('TIMER_STARTED', {
			startTime: currentTimer.startTime,
			endTime: currentTimer.endTime,
			duration: currentTimer.duration
		});
	});

	// 타이머 중지
	socket.on('STOP_TIMER', async () => {
		if (currentTimer) {
			currentTimer.isActive = false;
			await saveTimerToRedis(currentTimer);

			io.emit('TIMER_STOPPED');
			stopTimer();
		}
	});

	// 타이머 리셋
	socket.on('RESET_TIMER', async () => {
		stopTimer();
		io.emit('TIMER_RESET');
	});

	// 현재 타이머 상태 요청
	socket.on('GET_TIMER_STATE', async () => {
		if (!currentTimer) {
			currentTimer = await loadTimerFromRedis();
		}

		if (currentTimer && currentTimer.isActive) {
			const now = Date.now();
			const timeLeft = Math.max(0, currentTimer.endTime - now);

			if (timeLeft > 0) {
				socket.emit('TIMER_STATE', {
					isActive: true,
					timeLeft,
					startTime: currentTimer.startTime,
					endTime: currentTimer.endTime
				});
			} else {
				// 타이머가 이미 종료됨
				currentTimer.isActive = false;
				await saveTimerToRedis(currentTimer);
				socket.emit('TIMER_STATE', {
					isActive: false,
					timeLeft: 0
				});
			}
		} else {
			socket.emit('TIMER_STATE', {
				isActive: false,
				timeLeft: 0
			});
		}
	});

	// 연결 해제 시 정리
	socket.on('disconnect', () => {
		// 필요시 정리 작업
	});
}

// 서버 시작 시 타이머 복구
export async function initializeTimer(io: Server) {
	currentTimer = await loadTimerFromRedis();

	if (currentTimer && currentTimer.isActive) {
		const now = Date.now();
		const timeLeft = Math.max(0, currentTimer.endTime - now);

		if (timeLeft > 0) {
			startTimerBroadcast(io);
		} else {
			// 타이머가 이미 종료됨
			currentTimer.isActive = false;
			await saveTimerToRedis(currentTimer);
		}
	}
}