"use strict";
class WebSocketServer {
    constructor(wsOpt) {
        this.express = require("express");
        this.http = require('http');
        this.WebSocket = require("ws");
        this.Crypto = require("crypto");
        this.connectionCounter = 0;
        this._onNewConnection = [];
        this.domain = "";
        this.port = -1;
        console.log("SOCKET_SERVER::STARTING");
        this.initExpress();
        this.initHTTPServer();
        this.initWebSocketServer();
        this.initWebSocketConnection();
        this.HTTPServerListen();
    }
    onNewConnection(callback) {
        if (typeof callback === "function") {
            this._onNewConnection.push(callback);
        }
    }
    initExpress() {
        this.app = this.express();
        this.app.use(function (req, res) {
            res.send("ws server up!!!");
        });
    }
    initHTTPServer() {
        this.server = this.http.createServer(this.app);
    }
    HTTPServerListen() {
        this.server.listen(8420, '0.0.0.0', function httpServerListening() {
            console.log("SOCKET_SERVER::LISTENING:", this.address().address + ":", this.address().port);
        });
    }
    initWebSocketServer() {
        this.wss = new this.WebSocket.Server({ server: this.server });
    }
    initWebSocketConnection() {
        let that = this;
        this.wss.on('connection', function socketConnection(ws, req) {
            that.connectionCounter++;
            let shakey = that.generateAssetSHA1({
                ip: that.server.address().address,
                port: that.server.address().port,
                count: that.connectionCounter
            });
            ws.on('message', function socketMessage(message) {
                ws.send(message);
            });
            ws.send(shakey.hex.toString());
        });
    }
    generateAssetSHA1(data) {
        let shaSum = this.Crypto.createHash("sha1");
        let shaReturn = "0";
        let shaIn = data.ip.toString()
            + data.port.toString()
            + data.count.toString();
        shaSum.update(shaIn);
        shaReturn = shaSum.digest("hex");
        return {
            hex: shaReturn,
            short: shaReturn.toString().substring(0, 10)
        };
    }
}
module.exports = WebSocketServer;
//# sourceMappingURL=websocketServer.js.map