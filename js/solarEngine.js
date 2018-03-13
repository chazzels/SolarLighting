"use strict";
class SolarEngine {
    constructor() {
        this._majorVersion = 0;
        this._minorversion = 0;
        this._revisionVersion = 1;
        this._releaseType = "a";
        this.EngineCore = require("./engine.core/engine.alpha");
        this.ClientCom = require("./client.com/client.com");
        this.ControllerCom = require("./controller.com/controller.com");
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
        let version = "Solar Engine"
            + this._majorVersion.toString() + "."
            + this._majorVersion.toString() + "."
            + this._revisionVersion.toString()
            + this._releaseType;
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