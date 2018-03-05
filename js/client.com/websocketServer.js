"use strict";
class WebSocketServer {
    constructor(wsOpt) {
        this.express = require("express");
        this.http = require('http');
        this.WebSocket = require("ws");
        this.Crypto = require("crypto");
        this.clients = new Map();
        this.clientKeys = [];
        this.connectionCounter = 0;
        this.STATEMETA = "StateMeta";
        this.STATEDATA = "StateMeta";
        console.log("SOCKET_SERVER::STARTING");
        this.initExpress();
        this.initHTTPServer();
        this.initWebSocketServer();
        this.initWebSocketConnection();
        this.HTTPServerListen();
    }
    initWebSocketConnection() {
        let that = this;
        this.wss.on('connection', function socketConnect(ws, req) {
            that.createKey(ws);
            ws.state = that.STATEMETA;
            console.log("SOCKET_SERVER::NEW_CONNECTION:", ws.key);
            ws.on('message', function socketMessage(message) {
            });
            ws.on('close', function socketClose(message) {
                console.log("SOCKET_SERVER::DISCONNECTED:", this.key);
                that.removeSocket(this.key);
            });
            ws.send(that.clientKeys.length);
        });
    }
    send(shakey, data) {
        let ws = this.clients.get(shakey);
        if (ws.state === this.STATEDATA) {
            ws.send(data);
        }
    }
    getClientManifest() {
        const manifest = this.clientKeys;
        return manifest;
    }
    removeSocket(shakey) {
        let clientStatus = this.clients.delete(shakey);
        let keyIndex = this.clientKeys.indexOf(shakey);
        if (keyIndex !== -1 && keyIndex >= 0) {
            this.clientKeys.splice(keyIndex, 1);
        }
        let clientKeysStatus = (this.clientKeys.indexOf(shakey) === -1);
        if (clientStatus && clientKeysStatus) {
            return true;
        }
        else {
            return false;
        }
    }
    createKey(ws) {
        this.connectionCounter++;
        let shakey = this.generateSocketSHA1({
            ip: this.server.address().address,
            port: this.server.address().port,
            count: this.connectionCounter
        });
        ws.key = shakey.hex;
        this.clients.set(ws.key, ws);
        this.clientKeys.push(ws.key);
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
    generateSocketSHA1(data) {
        let shaSum = this.Crypto.createHash("sha1");
        let shaReturn = "0";
        let shaIn = data.ip.toString()
            + data.port.toString()
            + data.count.toString()
            + Date.now();
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