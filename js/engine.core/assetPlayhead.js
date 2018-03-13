"use strict";
class AssetPlayhead {
    constructor(perf) {
        this.PlayheadLogic = require("./playheadLogic");
        this._playheads = new Map();
        this._playheadsMeta = new Map();
        this._playheadKeys = [];
        this._totalAssets = 0;
        this.STATUS_PAUSED = "PAUSE";
        this.STATUS_PLAY = "PLAY";
        this.MODE_HOLD = "HOLD";
        this.MODE_FOLLOW = "FOLLOW";
        this.MODE_END = "END";
        this.PLAYUPDATE = "PlayheadUpdate";
        console.log("PLAYHEAD::STARTING");
        console.group();
        this._logic = new this.PlayheadLogic(this._playheads, this._playheadsMeta);
        this.perf = perf;
        perf.registerParameter(this.PLAYUPDATE);
        console.groupEnd();
    }
    update() {
        this.tick();
    }
    loadTimeline(shakey, assetTimeline) {
        let nextCueMode = assetTimeline[1].cueMode || "END";
        let playhead = {
            index: 0,
            indexMax: assetTimeline.length - 1,
            timing: parseInt(assetTimeline[0].timing),
            current: 0,
            last: Date.now(),
            state: this.STATUS_PAUSED,
            nextCueMode: nextCueMode
        };
        let meta = assetTimeline;
        this._playheads.set(shakey, playhead);
        this._playheadsMeta.set(shakey, meta);
        this._playheadKeys.push(shakey);
        this._totalAssets++;
        console.log("PLAYHEAD::LOAD:", shakey.hex);
    }
    dumpTimeline(shakey) {
        let playheadStatus = this._playheads.delete(shakey);
        let metaStatus = this._playheadsMeta.delete(shakey);
        let keyIndex = this._playheadKeys.indexOf(shakey);
        if (keyIndex !== -1) {
            this._playheadKeys.splice(keyIndex, 1);
        }
        if (playheadStatus && metaStatus) {
            console.log("PLAYHEAD::DUMP:", shakey.hex);
        }
    }
    getPlayhead(shakey) {
        return this._playheads.get(shakey);
    }
    getProgress(shakey) {
        let playhead = this._playheads.get(shakey);
        let val = playhead.current / playhead.timing;
        let factor = Math.pow(10, 2);
        val = Math.round(val * factor) / factor;
        return val;
    }
    getIndex(shakey) {
        let index = this._playheads.get(shakey);
        if (typeof index !== 'undefined') {
            return index.index;
        }
        else {
            return null;
        }
    }
    play(shakey) {
        let playhead = this._playheads.get(shakey);
        if (playhead.state === this.STATUS_PAUSED) {
            playhead.last = Date.now();
            playhead.state = this.STATUS_PLAY;
            console.log("PLAYHEAD::PLAYED:", shakey.hex);
        }
        else {
            console.log("PLAYHEAD::PLAY_STATE_UNEXPECTED:", playhead.state);
        }
    }
    pause(shakey) {
        let playhead = this._playheads.get(shakey);
        if (playhead.state === this.STATUS_PLAY) {
            playhead.state = this.STATUS_PAUSED;
        }
        console.log("PLAYHEAD::PAUSED:", shakey.hex);
    }
    tick() {
        let keysLength = this._playheadKeys.length;
        ;
        for (let i = 0; i < keysLength; i++) {
            this._updatePlayhead(this._playheadKeys[i]);
            this.perf.hit(this.PLAYUPDATE);
        }
        return true;
    }
    _updatePlayhead(shakey) {
        let now = Date.now();
        let playhead = this._playheads.get(shakey);
        let diff = now - playhead.last;
        if (playhead.state === this.STATUS_PLAY) {
            playhead.current += diff;
            if (playhead.current >= playhead.timing) {
                this._advancePlayhead(playhead, shakey);
            }
            playhead.last = Date.now();
        }
    }
    _advancePlayhead(playhead, shakey) {
        if (playhead.nextCueMode === this.MODE_FOLLOW) {
            this._logic.modeFollow(playhead, shakey);
        }
        else if (playhead.nextCueMode === this.MODE_HOLD) {
            this._logic.modeHold(playhead, shakey);
        }
        else if (playhead.nextCueMode === this.MODE_END) {
            this._logic.modeEnd(playhead, shakey);
        }
        else {
            console.log("PLAYHEAD::MODE_UNKNOWN:", playhead.nextCueMode, shakey.hex);
        }
    }
}
module.exports = AssetPlayhead;
//# sourceMappingURL=assetPlayhead.js.map