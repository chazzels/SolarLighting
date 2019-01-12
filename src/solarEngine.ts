/*
*	module to serve as a main management API to engine subsystems. 
*	TODO: implement a task runner to automate build process for developement.
*	TODO: build logging module.
*/

import { sha1 } from "./engine.engine/interface/sha1";

class SolarEngine {
	
	/* module version info */
	readonly majorVersion: number = 0;
	readonly minorversion: number = 0;
	readonly revisionVersion: number = 2;
	readonly releaseType: string = "a";
	
	/* imported modules */
	private EngineCore: any = require("./engine.engine/engineCore");
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
		
		console.log("------------------------------");
		
		console.log(this.version());
		
		console.log("------------------------------");
		
		this.engine = new this.EngineCore(options);
		
		this.server = new this.EngineServer(options.server);
		
		this.client = new this.EngineClient(options.client);
		
		console.log("------------------------------");
		
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
	
}

export = SolarEngine;