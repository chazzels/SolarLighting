import { sha1 } from "./engine.core/interface/sha1";

class SolarEngine {
	
	/* imported modules */
	private EngineCore: any = require("./engine.core/engine.alpha");
	private ClientCom: any = require("./client.com/client.com");
	private ControllerCom: any = require("./controller.com/controller.com");
	
	/* module variables */
	private _engine: any;
	private _client: any;
	private _controller: any;
	
	constructor() {
		
		this._engine = new this.EngineCore();
		
		this._client = new this.ClientCom();
		
		this._controller = new this.ControllerCom();
		
	}
	
	/*----------------------------------------------\
	|	EngineCore Functionality.
	\----------------------------------------------*/
	
	loadAsset(assetData: any) {
		
		return this._engine.loadAsset(assetData);
		
	}
	
	dumpAsset(shakey: sha1) {
		
		this._engine.dumpAsset(shakey);
		
	}
	
	play(shakey: sha1) {
		
		this._engine.play(shakey);
		
	}
	
	pause(shakey: sha1) {
		
		this._engine.pause(shakey);
		
	}
	
	/*----------------------------------------------\
	|	ClientCom Functionality
	\----------------------------------------------*/
	
	/*----------------------------------------------\
	|	Controller Com Functionality
	\----------------------------------------------*/
	
}

export = SolarEngine;