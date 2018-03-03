/*
*   module to store cue data that can be accessed later.
*/

import { sha1 } from "./interface/sha1";

class AssetStore {
	
	/* module variables */
	private _totalTracks: number = 0;
	private _tracks: any = new Map();
	private _tracksMeta: any = new Map();
	
	/* performance variables */
	private readonly STOREREAD: string = "StoreRead";
	private readonly STOREWRITE: string = "StoreWrite";
	private perf: any;
	
	constructor(perf: any) {
		
		console.log("STORE::STARTING");
		
		this.perf = perf;
		
	}
	
	/* loads cue track into storage */
	loadTrack(shakey: sha1, assetData: any) {
		
		this._tracks.set(shakey, assetData.cueTrack);
		
		this._totalTracks + assetData.cueTrack.length;
		
		this._tracksMeta.set(shakey, assetData.cueTrackMeta);
		
		this.perf.hit(this.STOREWRITE);
		
		console.log("STORE::LOAD: " + shakey.hex);
	
	}
	
	/* remove track from the store module. */
	dumpTrack(shakey: sha1) {
		
		this._tracks.delete(shakey);
		
		this._tracksMeta.delete(shakey);
		
		console.log("STORE::DUMP: " + shakey.hex);
		
	}
	
	/* fetch cue data from storage */
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