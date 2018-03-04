import { sha1 } from "./engine.core/interface/sha1";

class SolarEngine {
	
	/* imported modules */
	private EngineCore: any = require("./engine.core/engine.alpha");
	private ClientCom: any;
	
	/* module variables */
	private _engine: any;
	
	constructor() {
		
		this._engine = new this.EngineCore();
		
	}
	
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
	
}

export = SolarEngine;