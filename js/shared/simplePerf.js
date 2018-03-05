"use strict";
class SimplePerf {
    constructor(option) {
        this.VERBOSE = false;
        this._parameterNames = [];
        this._parameterHit = [];
        this._parameterHitMin = [];
        this._parameterHitMax = [];
        this._parameterTail = [];
        this._autoLogIndexes = [];
        this.TIMERDELAY = 1000;
        this.TAILLENGTH = 5;
        this.Crystal = require("./crystalClock");
        if (option && option.hasOwnProperty("verbose")) {
            this.VERBOSE = option.verbose;
        }
        let that = this;
        let triggerCallback = this.trigger(that);
        let crystal = new this.Crystal(1000, triggerCallback);
    }
    trigger(that) {
        return function () {
            let parameterLength = that._parameterNames.length;
            for (let i = 0; i < parameterLength; i++) {
                that._parameterTail[i].shift();
                that._parameterTail[i].push(that._parameterHit[i]);
                if (that._parameterHit[i] >= 0
                    && that._parameterHit[i] < that._parameterHitMin[i]) {
                    that._parameterHitMin[i] = that._parameterHit[i];
                }
                if (that._parameterHit[i] > that._parameterHitMax[i]) {
                    that._parameterHitMax[i] = that._parameterHit[i];
                }
                that._parameterHit[i] = 0;
                if (that._autoLogIndexes[i] === 1) {
                    if (that.VERBOSE) {
                        console.log(that._parameterNames[i]
                            + " "
                            + that._rateOfIndex(i)
                            + " /second [min: "
                            + that._parameterHitMin[i]
                            + " ][max: "
                            + that._parameterHitMax[i]
                            + " ]");
                    }
                }
            }
        };
    }
    registerParameter(name) {
        let parameterLength = this._parameterIndex("name");
        if (parameterLength === -1) {
            this._parameterNames.push(name);
            this._parameterHit.push(0);
            this._parameterHitMin.push(1000000);
            this._parameterHitMax.push(0);
            this._parameterTail.push(new Array(this.TAILLENGTH));
            this._autoLogIndexes.push(0);
            if (this.VERBOSE) {
                console.log("SIMPLEPERF::REGISTER_PARAMETER: " + name);
            }
        }
    }
    autoLog(name) {
        let targetIndex = this._parameterIndex(name);
        if (targetIndex >= 0) {
            this._autoLogIndexes[targetIndex] = 1;
            return true;
        }
        return false;
    }
    hit(name) {
        var start = Date.now();
        let nameIndex = this._parameterNames.indexOf(name);
        if (nameIndex >= 0) {
            this._parameterHit[nameIndex]++;
        }
    }
    _parameterIndex(name) {
        let targetIndex = -1;
        let parameterLength = this._parameterNames.length;
        for (let i = 0; i < parameterLength; i++) {
            if (this._parameterNames[i] === name) {
                targetIndex = i;
                i = parameterLength + 1;
            }
        }
        return targetIndex;
    }
    _rateOfParameter(name) {
        let targetIndex = this._parameterIndex(name);
        let readIndex = this.TAILLENGTH - 1;
        return this._parameterTail[targetIndex][readIndex];
    }
    _rateOfIndex(targetIndex) {
        let readIndex = this.TAILLENGTH - 1;
        return this._parameterTail[targetIndex][readIndex];
    }
}
module.exports = SimplePerf;
//# sourceMappingURL=simplePerf.js.map