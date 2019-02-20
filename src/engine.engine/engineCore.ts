/*
*	module to link up all the other engine modules to create a facade module.
*	TODO: function to dump shakey name map for debugging.
*	TODO: add functionality to halt processig and clock for a debug scearios.
*/

import { sha1 } from "./interface/sha1";
import { assetData } from "./interface/assetData";
import { crystalObject } from "../shared/interface/crystalObject";

import { AssetManager } from "./assetManager";
import { StyleRender } from "./styleRender";
import { StyleCache } from "./styleCache";
import { StyleCompositor } from "./styleCompositor";

import { SimplePerf } from "../shared/simplePerf";
import { CrystalClock } from "../shared/crystalClock";


class EngineCore {
	
	/* imported modules member objects. */
	static simplePerf: any;
	static crystal: any;
	static assetManger: any;
	static styleRender: any;
	static styleCache: any;
	static styleCompositor: any;
	
	/* core logic variables */
	static manifest: any = [];
	static manifestLength: number = 0;
	static manifestIndex: number = -1;
	static tickStart: number = 0;		// the start timestamp of the loop.
	static tickDiff: number = 0;		// time taken to execute the loop.
	static currentAssetKey: sha1;		// current asset key being updated.
	static assetObj: any;				// object holding assets data.
	static currentAssetState: any;		// contains the update asset data.
	
	/* performance variables */
	static readonly ENGINELOOP: string = "EngineLoop";
	
	constructor(options?: any) {
		
		console.log("ENGINE_CORE::STARTING");
		
		console.group();
		
		if(options === undefined || options === null) {
			
			options = {};
			
		}
		
		// performance module initialization.
		EngineCore.simplePerf = new SimplePerf(options.perf);
		
		EngineCore.simplePerf.registerParameter(EngineCore.ENGINELOOP);
		
		EngineCore.simplePerf.autoLog(EngineCore.ENGINELOOP);
		
		// timer module initialization.
		EngineCore.crystal = new CrystalClock(10);
		
		EngineCore.crystal.onUpdate(this.generateStyles);
		
		// internal modules.
		EngineCore.assetManger = 
			new AssetManager(options, EngineCore.simplePerf);
		
		EngineCore.styleCache = 
			new StyleCache(options, EngineCore.simplePerf);
		
		EngineCore.styleRender =
			new StyleRender(options, EngineCore.simplePerf);
		
		console.groupEnd();
		
	}
	
	/* load asset data into the engine. */
	/* returns an sha1 key for referencing the asset later. */
	loadAsset(assetData: assetData) {
		
		return EngineCore.assetManger.loadAsset(assetData);
		
	}
	
	/* removes asset data from the engine */
	dumpAsset(shakey: sha1) {
		
		EngineCore.assetManger.dumpAsset(shakey);
		
	}
	
	/* play an asset. set asset state to play and active. */
	play(shakey: sha1) {
		
		EngineCore.assetManger.play(shakey);
		
	}
	
	/* pause an asset. */
	pause(shakey: sha1) {
		
		EngineCore.assetManger.pause(shakey);
		
	}
	
	/* read cahced value from the render cahce. */
	read(shakey: sha1) {
		
		return EngineCore.styleCache.read(shakey);
		
	}
	
	queryTargets(qryStr: string) {
		
		return EngineCore.assetManger.queryTargets(qryStr);
		
	}
	
	/* funciton that triggers updating the calculated styles. */
	/* function passed to crystal update with this module as context passed*/
	private generateStyles() {
		
		EngineCore.tickStart = Date.now();
		
		EngineCore._updateManifest();
		
		// loop through each active asset and calculate its current styles.
		for(let i = 0; i < EngineCore.manifestLength; i++) {
			
			// advance the value of the asset manifest index.
			EngineCore._advanceManifestIndex();
			
			// update current asset key.
			EngineCore.currentAssetKey = 
				EngineCore.manifest[EngineCore.manifestIndex];
			
			// get the assets data from the asset manager.
			EngineCore.assetObj = 
				EngineCore.assetManger.getState(EngineCore.currentAssetKey);
			
			if(EngineCore.assetObj !== null) {
				
				// set with new generated style from the style render.
				EngineCore.currentAssetState = 
					EngineCore.styleRender.update(EngineCore.assetObj);
				
				// send the generated style to the style cache.
				// last rendered style can be fetched from here.
				EngineCore.styleCache.write(
					EngineCore.currentAssetKey.hex, 
					EngineCore.currentAssetState
				);
				
			} else {
				
				// asset not resolved console log message.
				console.log("ENGINE::ASSET_NULL:", EngineCore.currentAssetKey.hex);
				
			}
			
		}
		
		// register a hit with the performance monitor.
		EngineCore.simplePerf.hit(EngineCore.ENGINELOOP);
		
		// get end time of full execution for debugging.
		EngineCore.tickDiff = Date.now() - EngineCore.tickStart;
		
	}
	
	/* update the active playheads states. */
	static _updateManifest() {
		
		EngineCore.assetManger.generateManifest();
		EngineCore.manifest = EngineCore.assetManger.getManifest();
		EngineCore.manifestLength = EngineCore.manifest.length;
		EngineCore.manifestIndex = -1;
		
	}
	
	/* update the index of manifest. */
	static _advanceManifestIndex() {
		
		if(EngineCore.manifestIndex + 1 < EngineCore.manifestLength) {
				
				EngineCore.manifestIndex++;
				
		}
		
	}
	
}

export { EngineCore };