/*
*	module to serve as a main management API to engine subsystems. 
*	TODO: implement a task runner to automate build process for developement.
*	TODO: implement logging module.
*	TODO: make asset properties modular.
*	TODO: build more interfaces for the engine.
*	TODO: make simplePerf optional functionality. (not always useful).
*/

import { sha1 } from "./engine/interface/sha1";
import { assetData } from "./engine/interface/assetData";

import { EngineCore } from "./engine/engineCore";
import { ControllerCom } from "./server/server";
import { ClientCom } from "./client/client";

class SolarEngine {
	
	/* module version info */
	static readonly majorVersion: number = 0;
	static readonly minorversion: number = 0;
	static readonly revisionVersion: number = 3;
	static readonly releaseType: string = "a";
	
	/* module variables */
	private engine: any;
	private server: any;
	private client: any;
	private assetKeys: any = [];
	
	constructor(options?:any) {
		
		let engineStartTime = Date.now();
		
		console.log("------------------------------");
		
		console.log(this.version());
		
		console.log("------------------------------");
		
		this.engine = new EngineCore(options);
		
		this.server = new ControllerCom(options.server);
		
		this.client = new ClientCom(options.client);
		
		console.log("------------------------------");
		
		console.log("Start Up Time:", Date.now() - engineStartTime, "ms");
		
		console.log("------------------------------");
		
	}
	
	/* log the application name and the current version */
	version(): string {
		
		let version = "Solar Engine v" 
			+ SolarEngine.majorVersion.toString() + "."
			+ SolarEngine.majorVersion.toString() + "."
			+ SolarEngine.revisionVersion.toString()
			+ SolarEngine.releaseType;
		
		return version;
		
	}
	
	/*----------------------------------------------\
	|	EngineCore Functionality.
	\----------------------------------------------*/
	
	loadAsset(assetData: assetData, shaOverride:string) {
		
		let assetKey = null;
		
		assetKey = this.engine.loadAsset(assetData, shaOverride);
		
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
	
	queryTarget(qryStr: String) {
		
		return this.engine.queryTarget(qryStr);
		
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