"use strict";
class SolarEngine {
    constructor() {
        this.EngineCore = require("./engine.core/engine.alpha");
        this._engine = new this.EngineCore();
    }
    loadAsset(assetData) {
        return this._engine.loadAsset(assetData);
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
}
module.exports = SolarEngine;
//# sourceMappingURL=SolarEngine.js.map