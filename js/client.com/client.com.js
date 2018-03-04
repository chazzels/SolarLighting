"use strict";
class ClientCom {
    constructor() {
        this.WebSocketServer = require("./websocketServer");
        this.ClientTracker = require("./clientTracker");
        this.ClientMeta = require("./clientMeta");
        var that = this;
        this.server = new this.WebSocketServer();
        this.tracker = new this.ClientTracker();
    }
}
module.exports = ClientCom;
//# sourceMappingURL=client.com.js.map