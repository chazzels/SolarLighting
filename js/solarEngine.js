"use strict";
class SolarEngine {
    constructor() {
        this.EngineCore = require("./engine.core/engine.alpha");
        this.ClientCom = require("./client.com/client.com");
        this.ControllerCom = require("./controller.com/controller.com");
        this.Crystal = require("./engine.core/crystalClock");
        this._assetKeys = [];
        this._engine = new this.EngineCore();
        this._clients = new this.ClientCom();
        this._controller = new this.ControllerCom();
        let that = this;
        this._crystal = new this.Crystal(250);
        this._crystal.onUpdate(that.tick, that);
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