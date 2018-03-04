"use strict";
class AssetRender {
    constructor(perf) {
        this.Crystal = require("./crystalClock");
        this._manifest = [];
        this._manifestLength = 0;
        this._manifestIndex = -1;
        this.ASSETCALC = "AssetCalc";
        console.log("RENDER::STARTING");
        console.group();
        this.perf = perf;
        perf.registerParameter(this.ASSETCALC);
        console.groupEnd();
    }
    update(assetObj) {
        return this.tick(assetObj);
    }
    next() {
        if (this._manifestIndex + 1 < this._manifestLength) {
            this._manifestIndex++;
        }
    }
    getCurrentKey() {
        if (this._manifestIndex < this._manifestLength
            && this._manifestIndex >= 0) {
            return this._manifest[this._manifestIndex];
        }
        else {
            return false;
        }
    }
    getLoopCount() {
        return this._manifestLength;
    }
    updateManifest(manifest) {
        this._manifest = manifest;
        this._manifestLength = manifest.length;
        this._manifestIndex = -1;
    }
    tick(assetObj) {
        let manifestLength = this._manifest.length;
        if (manifestLength > 0) {
            return this.updateAsset(assetObj);
        }
        else {
            return false;
        }
    }
    updateAsset(assetObj) {
        let playhead = assetObj.playhead;
        let cue = assetObj.cue;
        let prevCue = assetObj.previousCue;
        let progress = this.calcProgress(playhead);
        let calcCue = this.calcCue(prevCue, cue, progress);
        return calcCue;
    }
    calcCue(prevCue, curCue, progress) {
        let calcCue = {
            red: 0,
            green: 0,
            blue: 0
        };
        calcCue.red = this.calcParameter(prevCue.red, curCue.red, progress);
        calcCue.green = this.calcParameter(prevCue.green, curCue.green, progress);
        calcCue.blue = this.calcParameter(prevCue.blue, curCue.blue, progress);
        this.perf.hit(this.ASSETCALC);
        return calcCue;
    }
    calcParameter(startVal, endVal, progress) {
        let signed = (endVal < startVal);
        let valueRange = Math.abs(endVal - startVal);
        let result = valueRange * progress;
        if (signed) {
            result = startVal - result;
        }
        result = Math.floor(result);
        return result;
    }
    calcProgress(playhead) {
        let progress = playhead.current / playhead.timing;
        let factor = Math.pow(10, 2);
        progress = Math.round(progress * factor) / factor;
        return progress;
    }
}
module.exports = AssetRender;
//# sourceMappingURL=assetRender.js.map