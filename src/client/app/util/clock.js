function Clock(duration, increment, granularity) {
	this.duration = duration;
	this.increment = increment;
	this.startTime = null;
	this.granularity = granularity || 100;
	this.tickFtns = [];
	this.running = false;
	this.expired = false;
}

Clock.prototype.run = () => {
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
				that.expired = true;
			}
			obj = Clock.parse(diff);
			that.tickFtns.forEach(ftn => {
				ftn.call(this, obj.minutes, obj.seconds, obj.deciseconds);
			}, that);
		}
	}());
};

Clock.prototype.toggle = incomingTime => {
	if (this.running) {
		this.running = false;
		this.duration += this.increment;
        // may need to cal tick format function here
	} else {
		this.running = true;
		this.duration -= incomingTime;
		this.startTime = Date.now();
		this.run();
	}
};

Clock.prototype.onTick = ftn => {
	if (typeof ftn === 'function') {
		this.tickFtns.push(ftn);
	}
	return this;
};

Clock.prototype.isExpired = () => this.expired;

Clock.parse = milliseconds => ({
	minutes: (milliseconds / (1000 * 60)) % 60,
	seconds: (milliseconds / 1000) % 60,
	deciseconds: (milliseconds / 100) % 10
});
