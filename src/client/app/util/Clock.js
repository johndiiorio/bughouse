export default class Clock {
	constructor(duration, increment, granularity = 100) {
		this.duration = duration;
		this.increment = increment;
		this.startTime = null;
		this.granularity = granularity;
		this.tickFtns = [];
		this.running = false;
		this.run = this.run.bind(this);
		this.toggle = this.toggle.bind(this);
		this.onTick = this.onTick.bind(this);
		this.parse = this.parse.bind(this);
		this.isRunning = this.isRunning.bind(this);
	}

	toggle(incomingTime = 0) {
		if (this.running) {
			this.running = false;
			this.duration += this.increment;
			const diff = this.duration - (Date.now() - this.startTime);
			const obj = this.parse(diff);
			this.tickFtns.forEach(ftn => {
				ftn.call(this, obj.minutes, obj.seconds, obj.deciseconds);
			}, this);
		} else {
			this.running = true;
			this.duration -= incomingTime;
			this.startTime = Date.now();
			this.run();
		}
	}

	run() {
		const that = this;
		let diff;
		let obj;
		(function timer() {
			if (that.running) {
				diff = that.duration - (Date.now() - that.startTime);
				if (diff > 0) {
					setTimeout(timer, that.granularity);
				} else {
					diff = 0;
					that.running = false;
					// TODO emit game over
				}
				obj = that.parse(diff);
				that.tickFtns.forEach(ftn => {
					ftn.call(this, obj.minutes, obj.seconds, obj.deciseconds);
				}, that);
			}
		}());
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
