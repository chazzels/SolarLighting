/*
	module to link up all the other engine modules to create a cohesive system.
*	TODO: build logging module.
*	TODO: function to dump shakey name map for later debug
*/

import { sha1 } from "./interface/sha1";

import {crystalObject } from "./interface/crystalObject";

class EngineAlpha {
	
	/* module version info */
	private readonly _majorVersion: number = 0;
	private readonly _minorversion: number = 0;
	private readonly _revisionVersion: number = 1;
	private readonly _releaseType: string = "a";
	
	/* imported modules */
	private SimplePerf: any = require("./simplePerf");
	private AssetManager: any = require("./assetManager");
	private AssetRender: any = require("./assetRender");
	private RenderCache: any = require("./renderCache"); 
	private Crystal: any = require("./crystalClock");
	
	/* module variables */
	private _simplePerf: any;
	private _crystal: crystalObject;
	private _assetManager: any;
	private _assetRender: any;
	private _renderCache: any;
	
	/* performance variables */
	private ENGINELOOP: string = "EngineLoop";
	
	constructor(options?: any) {
		
		console.log(this.version());
		
		console.log("ENGINE::LOAD_START");
		
		console.group();
		
		if(options === undefined || options === null) {
		
			options = {};
		
		}
		
		
		/* performance module initialization.  */
		this._simplePerf = new this.SimplePerf(options.perf);
		this._simplePerf.registerParameter(this.ENGINELOOP);
		
		/* timer module initialization */
		let that = this;
		this._crystal = new this.Crystal(10);
		this._crystal.onUpdate(that.tick, that);
		
		console.groupEnd();
		
		/* internal modules */
		this._assetManager = new this.AssetManager(this._simplePerf);
		
		this._renderCache = new this.RenderCache(this._simplePerf);
		
		this._assetRender = new this.AssetRender(this._simplePerf);
		
		console.log("ENGINE::LOAD_END");
		
	}
	
	/* load asset data into the engine. */
	loadAsset(assetData: any) {
		
		return this._assetManager.loadAsset(assetData);
		
	}
	
	/* removes asset data* from the engine */
	dumpAsset(shakey: sha1) {
		
		this._assetManager.dumpAsset(shakey);
		
	}
	
	/* play an asset. */
	play(shakey: sha1) {
		
		this._assetManager.play(shakey);
		
	}
	
	/* pause an asset. */
	pause(shakey: sha1) {
		
		this._assetManager.pause(shakey);
		
	}
	
	/* log the component and what version it is currently running on. */
	version(): string {
		
		let version = "Engine v" 
		+ this._majorVersion.toString() + "."
		+ this._majorVersion.toString() + "."
		+ this._revisionVersion.toString()
		+ this._releaseType;
		
		return version;
		
	}
	
	/* funciton that triggers updating the calculated styles. */
	/* function passed to crystal update with this module as context passed*/
	private tick(that) {
		
		let tickStart = Date.now(),
			tickDiff;
		
		let manifestLength,
			currentKey,
			assetObj,
			updatedCueState;
		
		that._assetManager.update();
		
		that._assetRender.updateManifest(that._assetManager.getManifest());
		
		manifestLength = that._assetRender.getLoopCount();
		
		for(let i = 0; i < manifestLength; i++) {
			
			that._assetRender.next();
			
			currentKey = that._assetRender.getCurrentKey();
			
			assetObj = that._assetManager.getState(currentKey);
			
			if(assetObj !== null) {
			
				updatedCueState = that._assetRender.update(assetObj);
				
				that._renderCache.write(currentKey.hex, updatedCueState);
			
			} else {
				
				console.log("ENGINE::ASSET_NULL:", currentKey.hex);
				
			}
			
		}
		
		that._simplePerf.hit(that.ENGINELOOP);
		
		tickDiff = Date.now() - tickStart;
		
	}

}

export = EngineAlpha;