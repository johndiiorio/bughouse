function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
    this.startTime = null;
}

CountDownTimer.prototype.run = function () {
    var that = this, diff, obj;

    (function timer() {
        if(that.running) {
            diff = that.duration - (((Date.now() - that.startTime) / 1000) | 0);

            if (diff > 0) {
                setTimeout(timer, that.granularity);
            } else {
                diff = 0;
                that.running = false;
            }

            obj = CountDownTimer.parse(diff);
            that.tickFtns.forEach(function (ftn) {
                ftn.call(this, obj.minutes, obj.seconds);
            }, that);
        }
    }());
};

CountDownTimer.prototype.start = function () {
    this.running = true;
    this.startTime = Date.now();
    this.run();
};

CountDownTimer.prototype.toggle = function () {
    if(this.running){
        this.running = false;
        this.duration = this.duration - (((Date.now() - this.startTime) / 1000) | 0);
        console.log(this.duration);

    }
    else {
        this.running = true;
        this.startTime = Date.now();
        this.run();
    }
};

CountDownTimer.prototype.onTick = function (ftn) {
    if (typeof ftn === 'function') {
        this.tickFtns.push(ftn);
    }
    return this;
};

CountDownTimer.prototype.expired = function () {
    return !this.running;
};

CountDownTimer.parse = function (seconds) {
    return {
        'minutes': (seconds / 60) | 0,
        'seconds': (seconds % 60) | 0
    };
};