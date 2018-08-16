/*
*	module for starting a websocket server.
*	TODO return splash page for http hit.
*/

import { sha1 } from "./interface/sha1";

class WebSocketServer {
	
	/* node/npm modules */
	private express: any = require("express");	
	private http: any = require('http');
	private WebSocket: any = require("ws");
	private Crypto: any = require("crypto");
	
	/* module variables */
	private app: any;
	private server: any;
	private wss: any;
	private clients: any = new Map();
	private clientKeys: any = [];
	private connectionCounter: number = 0;
	
	/* module constants */
	private readonly STATEMETA: string = "StateMeta";
	private readonly STATEDATA: string = "StateMeta";
	
	constructor(wsOpt?: any) {
		
		console.log("SOCKET_SERVER::STARTING");
		
		this.initExpress();
		
		this.initHTTPServer();
		
		this.initWebSocketServer();
		
		this.initWebSocketConnection();
		
		this.HTTPServerListen();
		
	}
	
	/* code to execute when a client has connected. */
	/* this is center logic to this module. */
	private initWebSocketConnection() {
		
		let server = this;
		
		/* new websocket connection event */
		this.wss.on('connection', socketConnect);
		
		function socketConnect(ws: any, req: any) {
			
			server.createKey(ws);
			
			ws.state = server.STATEMETA;
			
			console.log("SOCKET_SERVER::NEW_CONNECTION:", ws.key);
			
			ws.on('message', socketMessage);
			
			ws.on('close', socketClose);
			
			function socketMessage(message: any) {
				
				// On new Message event.
				
				// if(ws.state = server.STATEMETA) {} function validateMetaMessage() {}
				
			}
			
			function socketClose(message: any) {
				
				console.log("SOCKET_SERVER::DISCONNECTED:", this.key);
				
				server.removeSocket(this.key);
				
			}
			
			
			ws.send(server.clientKeys.length);
			
		}
		
	}
	
	/*----------------------------------------------\
	|	Client Functions
	\----------------------------------------------*/
	
	/* send a message to a sepecific websocket. */
	/* @param {string} shakey - sha1 key used to reference a socket. */
	/* @param {string|number|array} data - data to be send to socket */
	send(shakey: sha1, data: any) {
		
		let ws = this.clients.get(shakey);
		
		if(ws.state === this.STATEDATA) {
		
			ws.send(data);
		
		}
		
	}
	
	/* return array of the client keys. */
	getClientManifest() {
		
		const manifest =  this.clientKeys;
		
		return manifest;
		
	}
	
	/* removes socket reference and object from websocket server module. */
	/* @param {string} shakey - sha1 key used to reference a socket */
	private removeSocket(shakey: sha1) {
		
		/* delete key from client map. return false if failed. */
		let clientStatus = this.clients.delete(shakey);
		
		/* delete key from clientKeys array. returns -1 if failed. s*/
		let keyIndex = this.clientKeys.indexOf(shakey);
		
		if(keyIndex !== -1 && keyIndex >= 0) {
			
			this.clientKeys.splice(keyIndex, 1);
			
		}
		
		let clientKeysStatus = (this.clientKeys.indexOf(shakey) === -1);
		
		/* return false if either removal operation failed.*/
		if(clientStatus && clientKeysStatus) {
			
			return true;
			
		} else {
			
			return false;
			
		}
		
	}
	
	/* creat an sha1 key for a socket. */
	/* @param {any} ws - websocket to assign key too. */
	private createKey(ws: any) {
		
		/* advance connection counter */
		this.connectionCounter++;
		
		/* generate and save key. */
		let shakey = this.generateSocketSHA1({
			ip: this.server.address().address,
			port: this.server.address().port,
			count: this.connectionCounter
		});
		
		/* store key on the websocket. */
		ws.key = shakey.hex;
		
		/* add new websocket to tracking system. */
		this.clients.set(ws.key, ws);
		
		this.clientKeys.push(ws.key);
		
	}
	
	/*----------------------------------------------\
	|	WebSocket Server Initialization Functions. 
	\----------------------------------------------*/
	
	/* start the express app instance.  */
	private initExpress() {
		
		this.app = this.express();
		
		this.app.use(function(req, res) {
			
			res.status(500).end();
			
		});
		
	}
	
	/* create a http server. */
	private initHTTPServer() {
		
		this.server = this.http.createServer(this.app);
		
	}
	
	/* start server listening on given ip and port. */
	private HTTPServerListen() {
		
		this.server.listen(8081, '0.0.0.0', function httpServerListening() {
			
			console.log("SOCKET_SERVER::LISTENING:", 
				this.address().address+":", 
				this.address().port);
			
		});
		
	}
	
	 /* start the websocket server from the express/http server. */
	private initWebSocketServer() {
		
		this.wss = new this.WebSocket.Server({server: this.server});
		
	}
	
	/*----------------------------------------------\
	|	Utility Functions. 
	\----------------------------------------------*/
	
	/* generates a SHA1 hex string based on server settings. */
	/* @param {object} data - data need to create a sha1 key.*/
	private generateSocketSHA1(data: any) {
		
		let shaSum = this.Crypto.createHash("sha1");
		
		let shaReturn = "0";
		
		let shaIn = data.ip.toString()
			+ data.port.toString()
			+ data.count.toString()
			+ Date.now();
		
		/* generate sha1 from input string */
		shaSum.update(shaIn);
		
		/* save a hex value of the sha1 */
		shaReturn = shaSum.digest("hex");
		
		return {
			hex: shaReturn,
			short: shaReturn.toString().substring(0,10)
		}
		
	}

}

export = WebSocketServer;