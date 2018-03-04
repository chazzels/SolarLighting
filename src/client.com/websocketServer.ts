/*
*	module for starting a websocket server.
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
	private clientSyncStatus: boolean = true;
	private connectionCounter: number = 0;
	
	public domain: string = "";
	public port: number = -1;
	
	constructor(wsOpt?: any) {
		
		console.log("SOCKET_SERVER::STARTING");
		
		this.initExpress();
		
		this.initHTTPServer();
		
		this.initWebSocketServer();
		
		this.initWebSocketConnection();
		
		this.HTTPServerListen();
		
	}
	
	/*----------------------------------------------\
	|	Client Functions
	\----------------------------------------------*/
	
	send() {
		
		
		
	}
	
	/*----------------------------------------------\
	|	Server Functions
	\----------------------------------------------*/
	
	syncStatus() : boolean {
		
		return this.clientSyncStatus;
		
	}
	
	updateClients() {
		
		return 
		
	}
	
	private 
	
	/*----------------------------------------------\
	|	WebSocket Server Initialization. 
	\----------------------------------------------*/
	
	/* start the express app instance.  */
	private initExpress() {
		
		this.app = this.express();
		
		this.app.use(function(req, res) {
			
			res.send("ws server up!!!");
			
		});
		
	}
	
	/* create a http server. */
	private initHTTPServer() {
		
		this.server = this.http.createServer(this.app);
		
	}
	
	/* start server listening on given ip and port. */
	private HTTPServerListen() {
		
		this.server.listen(8420, '0.0.0.0', function httpServerListening() {
			
			console.log("SOCKET_SERVER::LISTENING:", 
				this.address().address+":", 
				this.address().port);
			
		});
		
	}
	
	 /* start the websocket server from the express/http server. */
	private initWebSocketServer() {
		
		this.wss = new this.WebSocket.Server({ server: this.server });
		
	}
	
	/* code to execute when a client has connected. */
	private initWebSocketConnection() {
		
		let that = this;
		
		this.wss.on('connection', function socketConnect(ws: any, req: any) {
			
			that.connectionCounter++;
			
			let shakey = that.generateAssetSHA1({
				ip: that.server.address().address,
				port: that.server.address().port,
				count: that.connectionCounter
			});
			
			that.clients.set(shakey, ws);
			
			that.clientSyncStatus = false;
			
			ws.on('message', function socketMessage(message: any) {
				
				console.log(message);
				
				ws.send(message);
				
			});
			
			ws.send(shakey.hex.toString());
			
		});
		
	}
	
	/*----------------------------------------------\
	|	Utility Functions. 
	\----------------------------------------------*/
	
	/* generates a SHA1 hex string based on server settings. */
	private generateAssetSHA1(data: any) {
		
		let shaSum = this.Crypto.createHash("sha1");
		
		let shaReturn = "0";
		
		let shaIn = data.ip.toString()
			+ data.port.toString()
			+ data.count.toString();
		
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