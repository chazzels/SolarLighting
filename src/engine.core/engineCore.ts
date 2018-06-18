/*
*	module to link up all the other engine modules to create a cohesive system.
*	TODO: build logging module.
*	TODO: function to dump shakey name map for later debug
*	TODO: add functionality to halt processig to allow for a debug scearios.
*	TODO: make simplePerf optional functionality. (just not always useful).
*	TODO: update the assetRender and renderCache.
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
	
	/* module variables */
	private simplePerf: any;
	private crystal: crystalObject;
	private assetManger: any;
	private assetRender: any;
	private renderCache: any;
	
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
	private tick(that) {
		
		// create and start timers for debuging.
		let tickStart = Date.now(),
			tickDiff;
		
		let manifestLength,
			currentKey,
			assetObj,
			updatedCueState;
		
		// update the active playheads states
		that.assetManger.update();
		
		// pass a list of active playheads 
		that.assetRender.updateManifest(that.assetManger.getManifest());
		
		// get the length of the manifest length for the engine loop.
		manifestLength = that.assetRender.getLoopCount();
		
		// loop through each active asset and calculate its current styles.
		for(let i = 0; i < manifestLength; i++) {
			
			// advance the renders manifest index to read from.
			that.assetRender.next();
			
			// get the sha1 key that the asset render is using.
			currentKey = that.assetRender.getCurrentKey();
			
			// get the assets data. 
			assetObj = that.assetManger.getState(currentKey);
			
			// check the asset resolved.
			if(assetObj !== null) {
				
				// set with new generated style from the render.
				updatedCueState = that.assetRender.update(assetObj);
				
				// write generated style to the cache.
				that.renderCache.write(currentKey.hex, updatedCueState);
			
			} else {
				
				// asset not resolved console log message.
				console.log("ENGINE::ASSET_NULL:", currentKey.hex);
				
			}
			
		}
		
		// register a hit with the performance monitor.
		that.simplePerf.hit(that.ENGINELOOP);
		
		// get end time of full execution for debugging.
		tickDiff = Date.now() - tickStart;
		
	}

}

export = EngineCore;