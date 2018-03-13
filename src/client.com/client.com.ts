/*
*	websocket server to distrubute styling data. 
*/

import { sha1 } from "./interface/sha1";

class ClientCom {
	
	/* imported modules */
	private Crystal: any = require('../shared/crystalClock');
	private SimplePerf: any = require('../shared/simplePerf');
	private WebSocketServer: any = require("./websocketServer");
	private ClientMeta: any = require("./clientMeta");
	
	/* module variables */
	private crystal: any;
	private perf: any;
	private server: any;
	private meta: any;
	
	/* module constants */
	private readonly REFRESH_RESOLUTION: number = 100;
	
	constructor() {
		
		this.perf = new this.SimplePerf();
		
		/* timer module initialization. */
		let that = this;
		
		this.crystal = new this.Crystal(this.REFRESH_RESOLUTION);
		
		this.crystal.onUpdate(that.tick, that);
		
		/* websocket server initialization. */
		this.server = new this.WebSocketServer();
		
		this.meta = new this.ClientMeta(this.perf);
		
	}
	
	private tick(that: any) {
		
		let manifest = that.server.getClientManifest();
		
		that.meta.updateKeys(manifest);
		
	}
	
}

export = ClientCom;