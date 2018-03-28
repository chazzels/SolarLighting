"use strict";
class ClientCom {
    constructor() {
        this.Crystal = require('../shared/crystalClock');
        this.SimplePerf = require('../shared/simplePerf');
        this.WebSocketServer = require("./websocketServer");
        this.ClientMeta = require("./clientMeta");
        this.REFRESH_RESOLUTION = 100;
        console.log("CLIENT.COM::STARTING");
        console.group();
        this.perf = new this.SimplePerf();
        let that = this;
        this.crystal = new this.Crystal(this.REFRESH_RESOLUTION);
        this.crystal.onUpdate(that.tick, that);
        this.server = new this.WebSocketServer();
        this.meta = new this.ClientMeta(this.perf);
        console.groupEnd();
    }
    tick(that) {
        let manifest = that.server.getClientManifest();
        that.meta.updateKeys(manifest);
    }
}
module.exports = ClientCom;
//# sourceMappingURL=server.js.map