const TEN_MINUTES = 10 * 60 * 1000;
export default class Timer {
	timeLeft: number = $state(0);
	timerInterval;
	isRunning = $state(false);

	getTimer() {
		return this.timeLeft;
	}

	setTimer(newValue: number) {
		if (newValue > TEN_MINUTES) {
			return TEN_MINUTES;
		}
		if (newValue < 0) {
			return 0;
		}
		return newValue;
	}

	update = () => {
		// Using arrow function to preserve 'this' context
		this.timeLeft -= 1000;

		// Check if the timer has finished
		if (this.timeLeft <= 0) {
			this.stop();
			console.log("Time's up!");
		}
	};

	start(time: number) {
		this.timeLeft = time;
		if (!this.isRunning) {
			this.isRunning = true;
			this.timerInterval = setInterval(this.update, 1000);
		}
	}

	stop() {
		if (this.isRunning) {
			clearInterval(this.timerInterval);
			this.isRunning = false;
		}
	}

	reset() {
		this.stop();
		this.timeLeft = TEN_MINUTES;
	}

	pause() {
		if (this.isRunning) {
			clearInterval(this.timerInterval);
			this.isRunning = false;
		}
	}

	resume() {
		if (!this.isRunning && this.timeLeft > 0) {
			this.isRunning = true;
			this.timerInterval = setInterval(this.update, 1000);
		}
	}

	show() {
		const totalSeconds = Math.floor(this.timeLeft / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
}
