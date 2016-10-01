function Clock(duration, increment, granularity) {
    this.duration = duration;
    this.increment = increment;
    this.startTime = null;
    this.granularity = granularity || 100;
    this.tickFtns = [];
    this.running = false;
    this.expired = false;
}

Clock.prototype.run = function() {
    var that = this, diff, obj;

    (function timer() {
        if(that.running) {
            diff = that.duration - (Date.now() - that.startTime);
            if (diff > 0) {
                setTimeout(timer, that.granularity);
            } else {
                diff = 0;
                that.running = false;
                that.expired = true;
            }
            obj = Clock.parse(diff);
            that.tickFtns.forEach(function (ftn) {
                ftn.call(this, obj.minutes, obj.seconds, obj.deciseconds);
            }, that);
        }
    }());
};

Clock.prototype.toggle = function(incomingTime) {
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

Clock.prototype.onTick = function(ftn) {
    if (typeof ftn === 'function') {
        this.tickFtns.push(ftn);
    }
    return this;
};

Clock.prototype.isExpired = function() {
    return this.expired;
};

Clock.parse = function(milliseconds) {
    return {
        'minutes': ((milliseconds / (1000*60)) % 60) | 0,
        'seconds': ((milliseconds / 1000) % 60) | 0,
        'deciseconds': ((milliseconds / 100) % 10) | 0
    };
};