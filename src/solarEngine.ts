import { sha1 } from "./engine.core/interface/sha1";

class SolarEngine {
	
	/* module version info */
	private readonly _majorVersion: number = 0;
	private readonly _minorversion: number = 0;
	private readonly _revisionVersion: number = 1;
	private readonly _releaseType: string = "a";
	
	/* imported modules */
	private EngineCore: any = require("./engine.core/engine.alpha");
	private ClientCom: any = require("./client.com/client.com");
	private ControllerCom: any = require("./controller.com/controller.com");
	private Crystal: any = require("./engine.core/crystalClock");
	
	/* module variables */
	private _engine: any;
	private _clients: any;
	private _controller: any;
	private _assetKeys: any = [];
	private _crystal: any;
	
	constructor() {
		
		console.log(this.version());
		console.group();
		
		this._engine = new this.EngineCore();
		
		this._clients = new this.ClientCom();
		
		this._controller = new this.ControllerCom();
		
		/* timer module initialization */
		let that = this;
		this._crystal = new this.Crystal(250);
		this._crystal.onUpdate(that.tick, that);
		
		console.groupEnd();
		console.log("------------------------------");
		
	}
	
	/* log the component and what version it is currently running on. */
	version(): string {
		
		let version = "Solar Engine" 
		+ this._majorVersion.toString() + "."
		+ this._majorVersion.toString() + "."
		+ this._revisionVersion.toString()
		+ this._releaseType;
		
		return version;
		
	}
	
	/*----------------------------------------------\
	|	EngineCore Functionality.
	\----------------------------------------------*/
	
	loadAsset(assetData: any) {
		
		let assetKey = null;
		
		assetKey = this._engine.loadAsset(assetData);
		
		this._assetKeys.push(assetKey)
		
		return assetKey
		
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
	
	/*----------------------------------------------\
	|	Private Module Functions.
	\----------------------------------------------*/
	
	private tick(that) {
		
	}
	
}

export = SolarEngine;