/*
*   module to store asset data that can be accessed later.
*/

import { sha1 } from "./interface/sha1";
import { assetData } from "./interface/assetData";

class AssetStore {
	
	/* module options flags */
	private readonly VERBOSE: boolean = false;
	private readonly VERBOSE_BOOT: boolean = true;
	
	/* module variables */
	private _totalTracks: number = 0;
	private _tracks: any = new Map();
	private _tracksMeta: any = new Map();
	
	/* performance private members */
	private perf: any;
	private readonly STOREREAD: string = "StoreRead";
	private readonly STOREWRITE: string = "StoreWrite";
	private readonly STOREMETAREAD: string = "StoreMetaRead";
	
	constructor(options: any, perf: any) {
		
		if(options && options.hasOwnProperty("verbose")) {
			
			this.VERBOSE = options.verbose;
			
		}
		
		if(options && options.hasOwnProperty("verboseBoot")) {
			
			this.VERBOSE_BOOT = options.verboseBoot;
			
		}
		
		if(this.VERBOSE_BOOT) {
			
			console.log("STORE::STARTING");
			
		}
		
		this.perf = perf;
		
	}
	
	/* loads cue track into storage */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	/* @param {any} assetData - an assets cue style data. */
	loadTrack(shakey: sha1, assetData: assetData) {
		
		this._tracks.set(shakey, assetData.cueTrack);
		
		this._totalTracks + assetData.cueTrack.length;
		
		this._tracksMeta.set(shakey, assetData.cueTrackMeta);
		
		this.perf.hit(this.STOREWRITE);
		
		if(this.VERBOSE) {
			
			console.log("STORE::LOAD:", shakey.hex);
			
		}
		
	}
	
	/* remove track from the store module. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	dumpTrack(shakey: sha1) {
		
		this._tracks.delete(shakey);
		
		this._tracksMeta.delete(shakey);
		
		if(this.VERBOSE) {
			
			console.log("STORE::DUMP:", shakey.hex);
			
		}
		
	}
	
	/* fetch cue data from storage */
	/* @param {sha1} shakey - sha1 key object used to reference an asset. */
	/* @param {number} cueIndex - the index of the cue to be returned. */
	getCue(shakey: sha1,  cueIndex: number) {
		
		let track = this._tracks.get(shakey); 
		
		this.perf.hit(this.STOREREAD);
		
		if(cueIndex >= 0) {
			
			return track[cueIndex];
			
		} else {
			
			return -1;
			
		}
	}
	
	/* fetch an assets meta data. */
	/* @param {sha1} shakey - sha1 key object used to reference an asset. */
	getMeta(shakey: sha1) {
		
		return this._tracksMeta.get(shakey);
		
	}
	
}

export { AssetStore };