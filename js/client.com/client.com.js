"use strict";
class ClientCom {
    constructor() {
        this.WebSocketServer = require("./websocketServer");
        this.ClientTracker = require("./clientTracker");
        this.ClientMeta = require("./clientMeta");
        this.server = new this.WebSocketServer();
    }
}
module.exports = ClientCom;
//# sourceMappingURL=client.com.js.map