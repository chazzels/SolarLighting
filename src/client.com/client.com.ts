/*
*	websocket server to distrubute styling data. 
*/

import { sha1 } from "./interface/sha1";

class ClientCom {
	
	private WebSocketServer: any = require("./websocketServer");
	private ClientTracker: any = require("./clientTracker");
	private ClientMeta: any = require("./clientMeta");
	
	
	private server: any;
	private tracker: any;
	private meta: any;
	
	constructor() {
		
		var that = this;
		
		this.server = new this.WebSocketServer();
		
		this.tracker = new this.ClientTracker();
		
	}
	
}

export = ClientCom;