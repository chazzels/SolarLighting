/*
*   module to store cue data that can be accessed later.
*/

import { sha1 } from "./interface/sha1";

class AssetStore {
	
	/* module flags */
	private readonly VERBOSE: boolean = false;
	
	/* module variables */
	private _totalTracks: number = 0;
	private _tracks: any = new Map();
	private _tracksMeta: any = new Map();
	
	/* performance variables */
	private readonly STOREREAD: string = "StoreRead";
	private readonly STOREWRITE: string = "StoreWrite";
	private perf: any;
	
	constructor(options: any, perf: any) {
		
		if(options && options.hasOwnProperty("verbose")) {
			
			this.VERBOSE = options.verbose;
			
		}
		
		console.log("STORE::STARTING");
		
		this.perf = perf;
		
	}
	
	/* loads cue track into storage */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	/* @param {any} assetData - an assets cue style data. */
	loadTrack(shakey: sha1, assetData: any) {
		
		this._tracks.set(shakey, assetData.cueTrack);
		
		this._totalTracks + assetData.cueTrack.length;
		
		this._tracksMeta.set(shakey, assetData.cueTrackMeta);
		
		this.perf.hit(this.STOREWRITE);
		
		if(this.VERBOSE) {
			
			console.log("STORE::LOAD: " + shakey.hex);
			
		}
		
	}
	
	/* remove track from the store module. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	dumpTrack(shakey: sha1) {
		
		this._tracks.delete(shakey);
		
		this._tracksMeta.delete(shakey);
		
		if(this.VERBOSE) {
			
			console.log("STORE::DUMP: " + shakey.hex);
			
		}
		
	}
	
	/* fetch cue data from storage */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getCue(shakey: sha1,  cueIndex: number) {
		
		let track = this._tracks.get(shakey); 
		
		this.perf.hit(this.STOREREAD);
		
		if(cueIndex >= 0) {
			
			return track[cueIndex];
			
		} else {
			
			return -1;
			
		}
	}
	
}

export = AssetStore;