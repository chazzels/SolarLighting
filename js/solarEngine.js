"use strict";
class SolarEngine {
    constructor() {
        this.majorVersion = 0;
        this.minorversion = 0;
        this.revisionVersion = 1;
        this.releaseType = "a";
        this.EngineCore = require("./engine.core/engine.alpha");
        this.ClientCom = require("./engine.server/server");
        this.ControllerCom = require("./engine.client/client");
        this.Crystal = require("./engine.core/crystalClock");
        this._assetKeys = [];
        console.log(this.version());
        console.group();
        this._engine = new this.EngineCore();
        this._clients = new this.ClientCom();
        this._controller = new this.ControllerCom();
        let that = this;
        this._crystal = new this.Crystal(250);
        this._crystal.onUpdate(that.tick, that);
        console.groupEnd();
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
        assetKey = this._engine.loadAsset(assetData);
        this._assetKeys.push(assetKey);
        return assetKey;
    }
    dumpAsset(shakey) {
        this._engine.dumpAsset(shakey);
    }
    play(shakey) {
        this._engine.play(shakey);
    }
    pause(shakey) {
        this._engine.pause(shakey);
    }
    tick(that) {
    }
}
module.exports = SolarEngine;
//# sourceMappingURL=solarEngine.js.map