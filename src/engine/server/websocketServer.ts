/*
*	module for creating a websocket server.
*	TODO: return splash page for http hit.
*	TODO: add unique server id which is tied to installation or pre-assigned. created unless found.
*	TODO: provide event system to hook in additional functionality.
*	TODO: create ability to update fixture meta. 
*	TODO: expand ip/port/network options to configure.
*/

import { sha1 } from "./interface/sha1";

import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import * as Crypto from "crypto";
import * as Events from "events";

class WebSocketServer {
	
	/* module variables */
	private app: any;
	private server: any;
	private wss: any;
	private emitter: any;
	private clients: any = new Map();
	private clientKeys: any = [];
	private deviceIds: any = new Map();
	private connectionCounter: number = 0;
	
	/* module constants */
	private readonly STATEMETA: string = "StateMeta";
	private readonly STATEDATA: string = "StateData";
	
	constructor(wsOpt?: any) {
		
		console.log("SOCKET_SERVER::STARTING");
		
		this.initExpress();
		
		this.initHTTPServer();
		
		this.initWebSocketServer();
		
		this.initWebSocketConnection();
		
		this.HTTPServerListen();
		
		// create event emitter for module.
		this.emitter = new Events();
		
	}
	
	// links to the event emitter in the this class. 
	registerHandler(eventName: string, eventFunc: any) {
		
		this.emitter.on(String(eventName), eventFunc);
		
		console.log(eventName, 'registered');
		
	}
	
	/* code to execute when a client has connected. */
	/* this is main logic to this module. */
	private initWebSocketConnection() {
		
		let server = this;
		
		// new websocket connection event.
		server.wss.on("connection", socketConnect);
		
		// handle new socket connection.
		function socketConnect(ws: any, req: any) {
			
			let clientId,
				deviceId;
			
			server.createKey(ws);
			
			// set new websocket state.
			ws.state = server.STATEMETA;
			
			// bind function to message event.
			ws.on("message", socketMessage);
			
			// bind function to close event.
			ws.on("close", socketClose);
			
			// trigger socket connection event for hook system.
			server.emitter.emit('socketManifestChange', server.clientKeys);
			
			// socket message handler.
			function socketMessage(message: any) {
				
				let messageData;
				
				// if the message is a string execute the correct function.
				if(typeof message === "string") {
					
					if(ws.state === server.STATEMETA
						&& typeof clientId === "undefined"
						&& typeof deviceId === "undefined") {
							
							message = message.trim().split(',');
							
							console.log(typeof message);
							console.log(message);
							
							deviceId = message[0];
							
							clientId = ws.key;
							
							server.deviceIds.set(deviceId, clientId);
							
							ws.state = server.STATEDATA;
							
							// TODO: actually pass real meta data.
							server.emitter.emit('socketConnection', ws.key, clientId);
							
					}
					
				} else if(typeof message === 'object') {
					// if the message is a object relay the data.
					
					messageData = message.toJSON();
					
					console.log(messageData);
					
				}
				
			}
			
			// function called on close event.
			function socketClose(message: any) {
				
				console.log("SOCKET_SERVER::DISCONNECTED:", this.key);
				
				server.removeSocket(this.key);
				
			}
			
			// log new connection.
			console.log("SOCKET_SERVER::NEW_CONNECTION:", ws.key);
			
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
			
			return true
			
		} 
		
		return false;
		
	}
	
	/* return array of the client keys. */
	getClientManifest() {
		
		const manifest =  this.clientKeys;
		
		return manifest;
		
	}
	
	/* removes socket reference and object from websocket server module. */
	/* @param {string} shakey - sha1 key used to reference a socket */
	private removeSocket(shakey: sha1) {
		
		// delete key from client map. returns false if failed.
		let clientStatus = this.clients.delete(shakey);
		
		// check index of the key in the client key array. returns -1 if failed.
		let keyIndex = this.clientKeys.indexOf(shakey);
		
		// check the returned key index is valid.
		// keyIndex == -1 means no results
		if(keyIndex !== -1 && keyIndex >= 0) {
			
			// remove key from client keys array.
			this.clientKeys.splice(keyIndex, 1);
			
		}
		
		// confirm the client key has been removed.
		let clientKeysStatus = (this.clientKeys.indexOf(shakey) === -1);
		
		// return false if either removal operation failed.
		if(clientStatus && clientKeysStatus) {
			
			return true;
			
		} else {
			
			return false;
			
		}
		
	}
	
	/* creat an sha1 key for a socket. */
	/* @param {any} ws - websocket to assign key too. */
	private createKey(ws: any) {
		
		// advance connection counter.
		this.connectionCounter++;
		
		// generate and save key.
		let shakey = this.generateSocketSHA1({
			ip: this.server.address().address,
			port: this.server.address().port,
			count: this.connectionCounter
		});
		
		// store key on the websocket.
		Object.defineProperty(ws, 'key', {
			value: shakey.hex,
			writable: false
		});
		
		// add new websocket to the clients map.
		this.clients.set(ws.key, ws);
		
		// add the new key to the client keys array/manifest.
		this.clientKeys.push(ws.key);
		
	}
	
	/*----------------------------------------------\
	|	WebSocket Server Initialization Functions. 
	\----------------------------------------------*/
	
	/* start the express app instance.  */
	private initExpress() {
		
		// create an express app object.
		this.app = express();
		
		// set the port property of the application.
		this.app.set('port', process.env.PORT || 8080);
		
		this.app.use(function(req, res) {
			
			res.status(500).end();
			
		});
		
	}
	
	/* create a http server. */
	private initHTTPServer() {
		
		this.server = http.createServer(this.app);
		
	}
	
	/* start server listening on given ip and port. */
	private HTTPServerListen() {
		
		this.server.listen(8080, '0.0.0.0', function httpServerListening() {
			
			console.log("SOCKET_SERVER::LISTENING:",
				this.address().address+":" +
				this.address().port);
			
		});
		
	}
	
	/* start the websocket server from the express/http server. */
	private initWebSocketServer() {
		
		this.wss = new WebSocket.Server({server: this.server});
		
	}
	
	/*----------------------------------------------\
	|	Utility Functions. 
	\----------------------------------------------*/
	
	/* generates a SHA1 hex string based on server settings. */
	/* @param {object} data - data need to create a sha1 key.*/
	private generateSocketSHA1(data: any) {
		
		let shaSum = Crypto.createHash("sha1");
		
		let shaReturn = "0";
		
		let shaIn = data.ip.toString()
			+ data.port.toString()
			+ data.count.toString()
			+ Date.now();
		
		// generate sha1 from input string.
		shaSum.update(shaIn);
		
		// save a hex value of the sha1.
		shaReturn = shaSum.digest("hex");
		
		return {
			hex: shaReturn,
			short: shaReturn.toString().substring(0,10)
		}
		
	}

}

export { WebSocketServer };