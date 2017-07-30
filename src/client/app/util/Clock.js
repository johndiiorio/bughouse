export default class Clock {
	constructor(minutes, increment, gameSocket, gameId) {
		this.duration = minutes;
		this.minutes = minutes;
		this.increment = increment;
		this.gameSocket = gameSocket;
		this.gameId = gameId;
		this.intervalStartTime = null;
		this.tickFtns = [];
		this.running = false;
		this.toggle = this.toggle.bind(this);
		this.onTick = this.onTick.bind(this);
		this.parse = this.parse.bind(this);
		this.isRunning = this.isRunning.bind(this);
	}

	toggle(incomingTime = 0) {
		if (this.running) {
			this.running = false;
			const diff = this.minutes - incomingTime;
			const obj = this.parse(diff);
			this.tickFtns.forEach(ftn => {
				ftn.call(this, obj.minutes, obj.seconds, obj.deciseconds);
			}, this);
		} else {
			this.running = true;
			this.duration = this.minutes - incomingTime;
			this.intervalStartTime = Date.now();
			const that = this;
			let diff;
			(function timer() {
				if (that.running) {
					diff = that.duration - (Date.now() - that.intervalStartTime);
					if (diff > 0) {
						setTimeout(timer, 100);
					} else {
						diff = 0;
						that.running = false;
						that.gameSocket.emit('time out', {
							id: that.gameId,
							token: localStorage.getItem('token')
						});
					}
					const obj = that.parse(diff);
					that.tickFtns.forEach(ftn => {
						ftn.call(this, obj.minutes, obj.seconds, obj.deciseconds);
					}, that);
				}
			}());
		}
	}

	setDuration(duration) {
		this.duration = duration;
		const obj = this.parse(duration);
		this.tickFtns.forEach(ftn => {
			ftn.call(this, obj.minutes, obj.seconds, obj.deciseconds);
		});
	}

	onTick(ftn) {
		if (typeof ftn === 'function') {
			this.tickFtns.push(ftn);
		}
		return this;
	}

	parse(milliseconds) {
		return {
			minutes: Math.floor((milliseconds / (1000 * 60)) % 60),
			seconds: Math.floor((milliseconds / 1000) % 60),
			deciseconds: Math.floor((milliseconds / 100) % 10)
		};
	}

	isRunning() {
		return this.running;
	}
}
