/*
*	module to link up all the other engine modules to create a cohesive system.
*	TODO: build logging module.
*	TODO: function to dump shakey name map for later debuggin
*	TODO: add functionality to halt processig to allow for a debug scearios.
*	TODO: make simplePerf optional functionality. (just not always useful).
*	TODO: ??? rename renderCache to styleCache for clarity ???
*/

import { sha1 } from "./interface/sha1";

import {crystalObject } from "./interface/crystalObject";

class EngineCore {
	
	/* imported modules */
	private SimplePerf: any = require("../shared/simplePerf");
	private Crystal: any = require("../shared/crystalClock");
	private AssetManager: any = require("./assetManager");
	private AssetRender: any = require("./assetRender");
	private RenderCache: any = require("./renderCache");
	
	/* external modules */
	private simplePerf: any;
	private crystal: crystalObject;
	private assetManger: any;
	private assetRender: any;
	private renderCache: any;
	
	/* module variables */
	private manifest: any = [];
	private manifestLength: number = 0;
	private manifestIndex: number = -1;
	
	/* core loop variables */
	private tickStart: number = 0;
	private tickDiff: number = 0;
	private currentAssetKey: sha1;
	private assetObj: any;
	private currentAssetState: any;
	
	
	/* performance variables */
	private readonly ENGINELOOP: string = "EngineLoop";
	
	constructor(options?: any) {
		
		console.log("ENGINE_CORE::STARTING");
		
		console.group();
		
		if(options === undefined || options === null) {
		
			options = {};
		
		}
		
		// performance module initialization.
		this.simplePerf = new this.SimplePerf(options.perf);
		this.simplePerf.registerParameter(this.ENGINELOOP);
		this.simplePerf.autoLog(this.ENGINELOOP);
		
		// timer module initialization.
		let that = this;
		this.crystal = new this.Crystal(10);
		this.crystal.onUpdate(that.tick, that);
		
		// internal modules.
		this.assetManger = new this.AssetManager(options, this.simplePerf);
		
		this.renderCache = new this.RenderCache(this.simplePerf);
		
		this.assetRender = new this.AssetRender(this.simplePerf);
		
		console.groupEnd();
		
	}
	
	/* load asset data into the engine. */
	/* returns an sha1 key for referencing the asset later. */
	loadAsset(assetData: any) {
		
		return this.assetManger.loadAsset(assetData);
		
	}
	
	/* removes asset data from the engine */
	dumpAsset(shakey: sha1) {
		
		this.assetManger.dumpAsset(shakey);
		
	}
	
	/* play an asset. set asset state to play and active. */
	play(shakey: sha1) {
		
		this.assetManger.play(shakey);
		
	}
	
	/* pause an asset. */
	pause(shakey: sha1) {
		
		this.assetManger.pause(shakey);
		
	}
	
	/* read cahced value from the render cahce. */
	read(shakey: sha1) {
		
		return this.renderCache.read(shakey);
		
	}
	
	/* funciton that triggers updating the calculated styles. */
	/* function passed to crystal update with this module as context passed*/
	/* TODO: change the name of this function. not clear as to what it does. */
	private tick(that) {
		
		that.tickStart = Date.now();
		
		// update the active playheads states
		that.manifest = that.assetManger.update();
		that.manifestLength = that.manifest.length;
		that.manifestIndex = -1;
		
		// loop through each active asset and calculate its current styles.
		for(let i = 0; i < that.manifestLength; i++) {
			
			if(that.manifestIndex + 1 < that.manifestLength) {
				
				that.manifestIndex++;
				
			}
			
			// update current asset key.
			that.currentAssetKey = that.manifest[that.manifestIndex];
			
			// get the assets data. 
			that.assetObj = that.assetManger.getState(that.currentAssetKey);
			
			if(that.assetObj !== null) {
				
				// set with new generated style from the render.
				that.currentAssetState = that.assetRender.update(that.assetObj);
				
				// write generated style to the cache.
				that.renderCache.write(that.currentAssetKey.hex, that.currentAssetState);
				
			} else {
				
				// asset not resolved console log message.
				console.log("ENGINE::ASSET_NULL:", that.currentAssetKey.hex);
				
			}
			
		}
		
		// register a hit with the performance monitor.
		that.simplePerf.hit(that.ENGINELOOP);
		
		// get end time of full execution for debugging.
		that.tickDiff = Date.now() - that.tickStart;
		
	}

}

export = EngineCore;