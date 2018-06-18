/*
*	responsible for loading and managing assets loaded into the engine.
*	direct access to functions from asset_playhead asset_store required.
*	TODO: validate assets before loading.
*/

import { sha1 } from "./interface/sha1";
import { assetState } from "./interface/assetState";

class AssetManager {
	
	activeManifest: any = [];

	/* imported modules */
	private AssetStore: any = require("./assetStore");
	private AssetPlayhead: any = require("./assetPlayhead");
	private Crypto: any = require("crypto");
	
	/* module variables */
	private _store: any;
	private _playhead: any;
	private _assetNames: any = new Map();
	private _assetKeys: any = [];
	private _assetCount: number = 0;
	
	constructor(options: any, perf: any) {
		
		console.log("MANAGER::STARTING");
		console.group();
		
		this._store = new this.AssetStore(options.store, perf);
		
		this._playhead = new this.AssetPlayhead(options.playhead, perf);
		
		console.groupEnd();
	}
	
	/*----------------------------------------------\
	|	manager module functionality
	\----------------------------------------------*/
	
	// NOTE: ??? return active manifest from here to the engineCore instead of making another call to the assetManager. Do this is pair with the notet about generateActiveAssetManifest() being migrated to the playhead update cycle to reduce number of calls.
	/* update playhead state and active asset manifest. */
	update() {
		
		this._playhead.update();
		
		this.activeManifest = this.generateActiveAssetManifest();
		
	}
	
	/* generate a key and load the asset data into modules. */
	/* advance internal asset count by one. _store data in modules. */
	/* return the sha1 key */
	loadAsset(assetData: any) {
		
		let shakey: sha1;
		shakey = this.generateAssetSHA1(assetData);
		
		this._assetCount++;	
		this._assetNames.set(shakey, assetData.assetID);
		this._assetKeys.push(shakey);
		
		this._store.loadTrack(shakey, assetData);
		this._playhead.loadTimeline(shakey, assetData.cueTimeline);
		
		return shakey;
		
	}
	
	/* remove asset from the manager. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	dumpAsset(shakey: sha1) {
		
		this._store.dumpTrack(shakey);
		
		this._playhead.dumpTimeline(shakey);
		
		let keyIndex = this._assetKeys.indexOf(shakey);
		
		if(keyIndex !== -1) {
			
			this._assetKeys.splice(keyIndex, 1);
			
		}
		
	}
	
	/* returns all the current data on an asset. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getState(shakey: sha1) {
		
		let assetObj: assetState = {
			cue: {},
			previousCue: {}, 
			playhead: {},
			progress: 0
		};
		
		let cue = this.getCue(shakey),
			previousCue = this.getPreviousCue(shakey),
			playhead = this.getPlayhead(shakey),
			progress = this.getProgress(shakey);
		
		if(typeof cue !== null) {
		
			assetObj.cue = cue;
			
			assetObj.previousCue = previousCue;
			
			assetObj.playhead = playhead;
			
			assetObj.progress = progress;
			
			return assetObj;
			
		} else {
			
			return null;
			
		}
		
	}
	
	/* returns a list of active asset keys in a array. */
	getManifest() {
		
		return this.activeManifest;
		
	}
	
	/*----------------------------------------------\
	|	_store module functionality
	\----------------------------------------------*/
	
	/* return cue data from a loaded asset. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getCue(shakey: sha1) {
		
		let currentIndex = this._playhead.getIndex(shakey);
		
		if(typeof currentIndex !== null) {
		
			return this._store.getCue(shakey, currentIndex);
		
		} else {
			
			return null;
			
		}
		
	}
	
	/* return the previous cue data from a loaded asset. */
	/* will return a zerod out cue if one is not avaible. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getPreviousCue(shakey: sha1) {
		
		let playhead = this._playhead.getPlayhead(shakey);
		
		let currentIndex = playhead.index;
		
		if(currentIndex <= playhead.indexMax && currentIndex > 0) {
			
			return this._store.getCue(shakey, currentIndex-1);
			
		} else  {
			
			return {
				red: 0,
				green: 0,
				blue: 0
			}
			
		}
		
	}
	
	/*----------------------------------------------\
	|	_playhead module functionality
	\----------------------------------------------*/
	
	/* return _playhead data from a loaded asset. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getPlayhead(shakey: sha1) {
		
		return this._playhead.getPlayhead(shakey);
		
	}
	
	/* return progress [0-100.00] from a loaded asset. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getProgress(shakey: sha1) {
		
		return this._playhead.getProgress(shakey);
		
	}
	
	/* change asset playhead state to start playing. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	play(shakey: sha1,) {
		
		this._playhead.play(shakey);
		
		this.activeManifest = this.generateActiveAssetManifest();
		
	}
	
	/* change asset playehad state to stop playing */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	pause(shakey: sha1) {
		
		this._playhead.pause(shakey);
		
		this.activeManifest = this.generateActiveAssetManifest();
		
	}
	
	/*----------------------------------------------\
	|	internal module functions
	\----------------------------------------------*/
	
	// NOTE: ??? could this be moved into the playhead logic to save on cycles? could cut extra step out of the cycle.
	/* generate a array of sha1 keys only for playing/active assets. */
	private generateActiveAssetManifest() {
		
		var manifest: any = [];
		
		let keysLength = this._assetKeys.length;
		
		for(let i = 0; i < keysLength; i++) {
			
			let playhead = this._playhead.getPlayhead(this._assetKeys[i]);
			
			if(playhead.state === "PLAY") {
				
				manifest.push(this._assetKeys[i]);
				
			}
			
		}
		
		return manifest;
		
	}
	
	/* generates a SHA1 hex string based on asset parameters */
	private generateAssetSHA1(assetData: any) : sha1 {
		
		let shaSum = this.Crypto.createHash("sha1");
		
		let shaReturn = "0";
		
		let shaIn = assetData.assetID.toString() 
			+ "==" + assetData.cueTimeline.length.toString()
			+ "x" + assetData.cueTrack.length.toString()
			+ ":" + assetData.cueTrackMeta.length.toString()
			+ "@" + this._assetCount.toString();
		
		/* generate sha1 from input string */
		shaSum.update(shaIn);
		
		/* save a hex value of the sha1 */
		shaReturn = shaSum.digest("hex");
		
		return {
			hex: shaReturn,
			short: shaReturn.toString().substring(0,10)
		}
		
	}
	
}

export = AssetManager;