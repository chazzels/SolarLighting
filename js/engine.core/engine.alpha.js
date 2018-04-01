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
        this.simplePerf = new this.SimplePerf(options.perf);
        this.simplePerf.registerParameter(this.ENGINELOOP);
        let that = this;
        this.crystal = new this.Crystal(10);
        this.crystal.onUpdate(that.tick, that);
        this.assetManger = new this.AssetManager(this.simplePerf);
        this.renderCache = new this.RenderCache(this.simplePerf);
        this.assetRender = new this.AssetRender(this.simplePerf);
        console.groupEnd();
    }
    loadAsset(assetData) {
        return this.assetManger.loadAsset(assetData);
    }
    dumpAsset(shakey) {
        this.assetManger.dumpAsset(shakey);
    }
    play(shakey) {
        this.assetManger.play(shakey);
    }
    pause(shakey) {
        this.assetManger.pause(shakey);
    }
    read(shakey) {
        return this.renderCache.read(shakey);
    }
    tick(that) {
        let tickStart = Date.now(), tickDiff;
        let manifestLength, currentKey, assetObj, updatedCueState;
        that.assetManger.update();
        that.assetRender.updateManifest(that.assetManger.getManifest());
        manifestLength = that.assetRender.getLoopCount();
        for (let i = 0; i < manifestLength; i++) {
            that.assetRender.next();
            currentKey = that.assetRender.getCurrentKey();
            assetObj = that.assetManger.getState(currentKey);
            if (assetObj !== null) {
                updatedCueState = that.assetRender.update(assetObj);
                that.renderCache.write(currentKey.hex, updatedCueState);
            }
            else {
                console.log("ENGINE::ASSET_NULL:", currentKey.hex);
            }
        }
        that.simplePerf.hit(that.ENGINELOOP);
        tickDiff = Date.now() - tickStart;
    }
}
module.exports = EngineCoreAlpha;
//# sourceMappingURL=engine.alpha.js.map