import { sha1 } from "./engine.core/interface/sha1";

class SolarEngine {
	
	/* module version info */
	readonly majorVersion: number = 0;
	readonly minorversion: number = 0;
	readonly revisionVersion: number = 1;
	readonly releaseType: string = "a";
	
	/* imported modules */
	private EngineCore: any = require("./engine.core/engineCore");
	private EngineServer: any = require("./engine.server/server");
	private EngineClient: any = require("./engine.client/client");
	private Crystal: any = require("./shared/crystalClock");
	
	/* module variables */
	private engine: any;
	private server: any;
	private client: any;
	private assetKeys: any = [];
	private crystal: any;
	
	constructor(options?:any) {
		
		let engineStartTime = Date.now();
		
		console.log(this.version());
		
		console.group();
		
		this.engine = new this.EngineCore(options);
		
		this.server = new this.EngineServer();
		
		this.client = new this.EngineClient();
		
		/* timer module initialization */
		// let that = this;
		// this.crystal = new this.Crystal(250);
		// this.crystal.onUpdate(that.tick, that);
		
		console.groupEnd();
		
		console.log("Start Up Time:", Date.now() - engineStartTime, "ms");
		
		console.log("------------------------------");
		
	}
	
	/* log the application name and the current version */
	version(): string {
		
		let version = "Solar Engine v" 
			+ this.majorVersion.toString() + "."
			+ this.majorVersion.toString() + "."
			+ this.revisionVersion.toString()
			+ this.releaseType;
		
		return version;
		
	}
	
	/*----------------------------------------------\
	|	EngineCore Functionality.
	\----------------------------------------------*/
	
	loadAsset(assetData: any) {
		
		let assetKey = null;
		
		assetKey = this.engine.loadAsset(assetData);
		
		this.assetKeys.push(assetKey)
		
		return assetKey;
		
	}
	
	dumpAsset(shakey: sha1) {
		
		this.engine.dumpAsset(shakey);
		
	}
	
	play(shakey: sha1) {
		
		this.engine.play(shakey);
		
	}
	
	pause(shakey: sha1) {
		
		this.engine.pause(shakey);
		
	}
	
	/*----------------------------------------------\
	|	Server Functionality
	\----------------------------------------------*/
	
	/*----------------------------------------------\
	|	Client Functionality
	\----------------------------------------------*/
	
	/*----------------------------------------------\
	|	Private Module Functions.
	\----------------------------------------------*/
	
	// private tick(that) {
		
	// }
	
}

export = SolarEngine;