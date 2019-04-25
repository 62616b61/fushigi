class Timer {
  constructor({ tickCallback }) {
    // callback that is executed every second when counting down
    this.tickCallback = tickCallback;

    // basic timer
    this.timer = null;

    // 1-second countdown interval
    this.countdown = null;

    // provided time in ms
    this.time = null;

    // countdown counter from this.time to 0 by seconds
    this.counter = null;
  }

  set(time, callback) {
    this.clear();
    this.counter = time / 1000;

    this.timer = setTimeout(() => {
      this.clear();
      callback();
    }, time);

    this.tickCallback(this.counter);
    this.countdown = setInterval(() => {
      this.counter -= 1;

      this.tickCallback(this.counter);
    }, 1000);
  }

  clear() {
    clearTimeout(this.timer);
    clearInterval(this.countdown);

    this.counter = null;
  }
}

module.exports = Timer;
