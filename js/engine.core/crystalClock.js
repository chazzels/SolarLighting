"use strict";
class CrsytalClock {
    constructor(delay, argCallback) {
        this.timerTarget = 1000;
        this.targetRefrashRate = -1;
        this.onUpdateArray = [];
        this.onUpdateContext = [];
        this.timerTarget = delay;
        this.targetRefrashRate = Math.floor(1000 / delay);
        if (typeof argCallback === "function") {
            this.callback = argCallback;
        }
        else {
            this.callback = null;
        }
        this.startTimer();
    }
    onUpdate(callback, context) {
        if (typeof callback === "function") {
            this.onUpdateArray.push(callback);
        }
        this.onUpdateContext.push(context);
    }
    startTimer() {
        let that = this;
        let timerTarget = this.timerTarget;
        let callback = this.callback;
        timeout();
        function timeout() {
            let start = Date.now();
            setTimeout(function () {
                if (typeof callback === "function") {
                    callback();
                }
                that.fireOnUpdate();
                timeout();
            }, timerTarget);
        }
    }
    fireOnUpdate() {
        let length = this.onUpdateArray.length;
        for (let i = 0; i < length; i++) {
            this.onUpdateArray[i](this.onUpdateContext[i]);
        }
    }
}
module.exports = CrsytalClock;
//# sourceMappingURL=crystalClock.js.map