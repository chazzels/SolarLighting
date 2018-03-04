/*
*	websocket server to distrubute styling data. 
*/

class ClientCom {
	
	private WebSocketServer: any = require("./websocketServer");
	private ClientTracker: any = require("./clientTracker");
	private ClientMeta: any = require("./clientMeta");
	
	
	private server: any;
	
	constructor() {
		
		this.server = new this.WebSocketServer();
		
	}
	
}

export = ClientCom;