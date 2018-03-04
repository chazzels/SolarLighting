"use strict";
class EngineCoreAlpha {
    constructor(options) {
        this._majorVersion = 0;
        this._minorversion = 0;
        this._revisionVersion = 1;
        this._releaseType = "a";
        this.SimplePerf = require("./simplePerf");
        this.AssetManager = require("./assetManager");
        this.AssetRender = require("./assetRender");
        this.RenderCache = require("./renderCache");
        this.Crystal = require("./crystalClock");
        this.ENGINELOOP = "EngineLoop";
        console.log(this.version());
        console.log("ENGINE::LOAD_START");
        console.group();
        if (options === undefined || options === null) {
            options = {};
        }
        this._simplePerf = new this.SimplePerf(options.perf);
        this._simplePerf.registerParameter(this.ENGINELOOP);
        let that = this;
        this._crystal = new this.Crystal(10);
        this._crystal.onUpdate(that.tick, that);
        console.groupEnd();
        this._assetManager = new this.AssetManager(this._simplePerf);
        this._renderCache = new this.RenderCache(this._simplePerf);
        this._assetRender = new this.AssetRender(this._simplePerf);
        console.log("ENGINE::LOAD_END");
    }
    loadAsset(assetData) {
        return this._assetManager.loadAsset(assetData);
    }
    dumpAsset(shakey) {
        this._assetManager.dumpAsset(shakey);
    }
    play(shakey) {
        this._assetManager.play(shakey);
    }
    pause(shakey) {
        this._assetManager.pause(shakey);
    }
    read(shakey) {
        return this._renderCache.read(shakey);
    }
    version() {
        let version = "Engine v"
            + this._majorVersion.toString() + "."
            + this._majorVersion.toString() + "."
            + this._revisionVersion.toString()
            + this._releaseType;
        return version;
    }
    tick(that) {
        let tickStart = Date.now(), tickDiff;
        let manifestLength, currentKey, assetObj, updatedCueState;
        that._assetManager.update();
        that._assetRender.updateManifest(that._assetManager.getManifest());
        manifestLength = that._assetRender.getLoopCount();
        for (let i = 0; i < manifestLength; i++) {
            that._assetRender.next();
            currentKey = that._assetRender.getCurrentKey();
            assetObj = that._assetManager.getState(currentKey);
            if (assetObj !== null) {
                updatedCueState = that._assetRender.update(assetObj);
                that._renderCache.write(currentKey.hex, updatedCueState);
            }
            else {
                console.log("ENGINE::ASSET_NULL:", currentKey.hex);
            }
        }
        that._simplePerf.hit(that.ENGINELOOP);
        tickDiff = Date.now() - tickStart;
    }
}
module.exports = EngineCoreAlpha;
//# sourceMappingURL=engine.alpha.js.map