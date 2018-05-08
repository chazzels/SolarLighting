"use strict";
class SolarEngine {
    constructor() {
        this.majorVersion = 0;
        this.minorversion = 0;
        this.revisionVersion = 1;
        this.releaseType = "a";
        this.EngineCore = require("./engine.core/engine.alpha");
        this.EngineServer = require("./engine.server/server");
        this.EngineClient = require("./engine.client/client");
        this.Crystal = require("./engine.core/crystalClock");
        this.assetKeys = [];
        let engineStartTime = Date.now();
        console.log(this.version());
        console.group();
        this.engine = new this.EngineCore();
        this.server = new this.EngineServer();
        this.client = new this.EngineClient();
        let that = this;
        this.crystal = new this.Crystal(250);
        this.crystal.onUpdate(that.tick, that);
        console.groupEnd();
        console.log("Start Up Time:", Date.now() - engineStartTime, "ms");
        console.log("------------------------------");
    }
    version() {
        let version = "Solar Engine v"
            + this.majorVersion.toString() + "."
            + this.majorVersion.toString() + "."
            + this.revisionVersion.toString()
            + this.releaseType;
        return version;
    }
    loadAsset(assetData) {
        let assetKey = null;
        assetKey = this.engine.loadAsset(assetData);
        this.assetKeys.push(assetKey);
        return assetKey;
    }
    dumpAsset(shakey) {
        this.engine.dumpAsset(shakey);
    }
    play(shakey) {
        this.engine.play(shakey);
    }
    pause(shakey) {
        this.engine.pause(shakey);
    }
    tick(that) {
    }
}
module.exports = SolarEngine;
//# sourceMappingURL=solarEngine.js.map