"use strict";
class AssetManager {
    constructor(perf) {
        this.activeManifest = [];
        this.AssetStore = require("./assetStore");
        this.AssetPlayhead = require("./assetPlayhead");
        this.Crypto = require("crypto");
        this._assetNames = new Map();
        this._assetKeys = [];
        this._assetCount = 0;
        console.log("MANAGER::STARTING");
        console.group();
        this._store = new this.AssetStore(perf);
        this._playhead = new this.AssetPlayhead(perf);
        console.groupEnd();
    }
    update() {
        this._playhead.update();
        this.activeManifest = this.generateActiveAssetManifest();
    }
    loadAsset(assetData) {
        let shakey;
        shakey = this.generateAssetSHA1(assetData);
        this._assetCount++;
        this._assetNames.set(shakey, assetData.assetID);
        this._assetKeys.push(shakey);
        this._store.loadTrack(shakey, assetData);
        this._playhead.loadTimeline(shakey, assetData.cueTimeline);
        return shakey;
    }
    dumpAsset(shakey) {
        this._store.dumpTrack(shakey);
        this._playhead.dumpTimeline(shakey);
        let keyIndex = this._assetKeys.indexOf(shakey);
        if (keyIndex !== -1) {
            this._assetKeys.splice(keyIndex, 1);
        }
    }
    getState(shakey) {
        let assetObj = {
            cue: {},
            previousCue: {},
            playhead: {}
        };
        let cue = this.getCue(shakey);
        let previousCue = this.getPreviousCue(shakey);
        let playhead = this.getPlayhead(shakey);
        if (typeof cue !== null) {
            assetObj.cue = cue;
            assetObj.previousCue = previousCue;
            assetObj.playhead = playhead;
            return assetObj;
        }
        else {
            return null;
        }
    }
    getManifest() {
        return this.activeManifest;
    }
    getCue(shakey) {
        let currentIndex = this._playhead.getIndex(shakey);
        if (typeof currentIndex !== null) {
            return this._store.getCue(shakey, currentIndex);
        }
        else {
            return null;
        }
    }
    getPreviousCue(shakey) {
        let playhead = this._playhead.getPlayhead(shakey);
        let currentIndex = playhead.index;
        if (currentIndex <= playhead.indexMax && currentIndex > 0) {
            return this._store.getCue(shakey, currentIndex - 1);
        }
        else {
            return {
                red: 0,
                green: 0,
                blue: 0
            };
        }
    }
    getPlayhead(shakey) {
        return this._playhead.getPlayhead(shakey);
    }
    getProgress(shakey) {
        return this._playhead.getProgress(shakey);
    }
    play(shakey) {
        this._playhead.play(shakey);
        this.activeManifest = this.generateActiveAssetManifest();
    }
    pause(shakey) {
        this._playhead.pause(shakey);
        this.activeManifest = this.generateActiveAssetManifest();
    }
    generateActiveAssetManifest() {
        var manifest = [];
        let keysLength = this._assetKeys.length;
        for (let i = 0; i < keysLength; i++) {
            let playhead = this._playhead.getPlayhead(this._assetKeys[i]);
            if (playhead.state === "PLAY") {
                manifest.push(this._assetKeys[i]);
            }
        }
        return manifest;
    }
    generateAssetSHA1(assetData) {
        let shaSum = this.Crypto.createHash("sha1");
        let shaReturn = "0";
        let shaIn = assetData.assetID.toString()
            + "=="
            + assetData.cueTimeline.length.toString()
            + "x"
            + assetData.cueTrack.length.toString()
            + ":"
            + assetData.cueTrackMeta.length.toString()
            + "@"
            + this._assetCount.toString();
        shaSum.update(shaIn);
        shaReturn = shaSum.digest("hex");
        return {
            hex: shaReturn,
            short: shaReturn.toString().substring(0, 10)
        };
    }
}
module.exports = AssetManager;
//# sourceMappingURL=assetManager.js.map