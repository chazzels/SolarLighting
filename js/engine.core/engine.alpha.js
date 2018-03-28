"use strict";
class EngineCoreAlpha {
    constructor(options) {
        this.SimplePerf = require("../shared/simplePerf");
        this.Crystal = require("../shared/crystalClock");
        this.AssetManager = require("./assetManager");
        this.AssetRender = require("./assetRender");
        this.RenderCache = require("./renderCache");
        this.ENGINELOOP = "EngineLoop";
        console.log("ENGINE_CORE::STARTING");
        console.group();
        if (options === undefined || options === null) {
            options = {};
        }
        this._simplePerf = new this.SimplePerf(options.perf);
        this._simplePerf.registerParameter(this.ENGINELOOP);
        let that = this;
        this._crystal = new this.Crystal(10);
        this._crystal.onUpdate(that.tick, that);
        this._assetManager = new this.AssetManager(this._simplePerf);
        this._renderCache = new this.RenderCache(this._simplePerf);
        this._assetRender = new this.AssetRender(this._simplePerf);
        console.groupEnd();
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