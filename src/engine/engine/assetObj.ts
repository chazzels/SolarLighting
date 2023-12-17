/*
*	module to create playhead objects. 
*/

// TODO: add properties checks for the asset data.

import { Logger } from "../../shared/logger";

import { sha1 } from "./interface/sha1";

import * as Crypto from "crypto";

class Asset {
	
	/*----------------------------------------------\
	|	Class Static Members.
	\----------------------------------------------*/
	
	static log:any = new Logger("Asset");
	
	/* tracks number of assets added. */
	/* helps prevent SHA1 Collisions. */
	static count:number = 0;
	static lastShortKey = "b8c7dba56a";
	
	/* constants for asset states. */
	static readonly STATE_PAUSED:string = "PAUSE";
	static readonly STATE_PLAY:string = "PLAY";
	
	/* constants for assset modes. */
	static readonly ASSET_REPEAT:string = "REPEAT";
	static readonly ASSET_END:string = "END";
	
	/* constants for cue modes. */
	static readonly CUE_HOLD:string = "HOLD";
	static readonly CUE_FOLLOW:string = "FOLLOW";
	static readonly CUE_END:string = "END";
	
	/*----------------------------------------------\
	|	Asset Class Private Members.
	\----------------------------------------------*/
	
	/* default values for all playheads. */
	private current:number = 0;
	private cueCount:number = 0;
	private last:number = Date.now();
	
	/* properties must be set in the constructor first. */
	private timeline:any;
	private track:any[];
	private meta:any;
	private shakey:sha1;
	
	/* placeholder values for assets. */
	private name:string = "Default";
	private mode:string = Asset.ASSET_END;
	private index:number = 1;
	private nextCueMode:string = "HOLD";
	private duration:number = 1000;
	private lastStyles:any;
	
	/* create a new asset. */
	constructor(asset:any, shaOverride?:sha1) {
		
		Asset.log.setVerbose();
		//Asset.log.setDebug();
				
		this.timeline = asset.timeline;
		
		this.track = asset.track;
		
		this.meta = asset.meta;
		
		/* set the assets name. */
		this.name = asset.name;
		
		/* set the assert mode. */
		this.mode = asset.mode;
		
		/* setting the number of cues for the playehad. */
		this.cueCount = asset.timeline.length;
		
		/* set the nexts cue mode. */
		/* if no next cue the CUE_END mode is set to stop the asset. */
		this.nextCueMode = this.timeline[1].cueMode || Asset.CUE_END;
		
		/* loading the first cues length into the playhead. */
		this.duration = parseInt(asset.timeline[0].timing);
		
		/* advances the total count of assets ceated. */
		Asset.count++;
		
		/* set the key. */
		this.generateShaKey();
		
		/* override the SHA key if needed. */
		if(typeof shaOverride !== "undefined") {
			Asset.log.c("SHA_OVERRIDE", shaOverride);
			this.shakey = {
				hex: shaOverride.toString(),
				short: shaOverride.toString().substring(0,10)
			}
		}
		
		Asset.log.d("AssetCreation", this);
		
		return this;
		
	}
	
	/*----------------------------------------------\
	|	Asset Playback Control. 
	\----------------------------------------------*/
	
	play() {
		
		
	}
	
	/*----------------------------------------------\
	|	Asset Data / Status.
	\----------------------------------------------*/
	
	/* returns the current cue data. */
	getCue() {
		
		return this.timeline[this.index];
		
	}
	
	/* returns the previous cue. */
	/* if first cue return a default cue. */
	getPreviousCue() {
		
		if(this.index <= this.cueCount
			&& this.index > 1) {
			
			return this.timeline[this.index-1];
			
		} else {
			
			return {
				red: 0,
				green: 0,
				blue: 0
			}
			
		}
		
	}
	
	/* returns the progress of a playhead as a value between 0 and 1. */
	getProgress() {
		
		let val = this.current / this.duration;
		
		let factor = Math.pow(10, 4);
		
		val = Math.round(val * factor) / factor;
		
		return val;
		
	}
	
	/*----------------------------------------------\
	|	Other Stuff.
	\----------------------------------------------*/
	
	exportData() {
		
		let data = {
			name: this.name,
			mode: this.mode,
			timeinline: this.timeline,
			track: this.track,
			meta: this.meta
		};
		
		Asset.log.d("Export", data);
		
		return data;
		
	}
	
	/* generates a key for the asset. */
	/* this only needs to be called once by the constructor. */
	private generateShaKey():sha1 {
		
		// check a key has not already been generated for the asset.
		if(typeof this.shakey == "undefined") {
			
			let shaSum = Crypto.createHash('sha1');
			
			/* create the input string for the SHA1 creation.*/
			let shaIn = this.name + '=='
				+ this.timeline.length.toString() + 'xx'
				+ this.track.length.toString() + '::'
				+ Asset.count.toString() + '@@'
				+ Date.now().toString() + '##'
				+ Asset.lastShortKey;
				
			/* generate sha1 from input string */
			shaSum.update(shaIn);
			
			/* save a hex value of the sha1 */
			let shaHex = shaSum.digest('hex');
			
			let shaReturn = {
				hex: shaHex,
				short: shaHex.substring(0,10)
			};
			
			/* update the last short key. */
			Asset.lastShortKey = shaReturn.short;
			
			/* update the current assets key. */
			this.shakey = shaReturn;
			
			return shaReturn;
			
		} else {
			
			Asset.log.c("Key already Generated. Skipping.");
			
		}
		
		return;
		
	}
	
	// WIP
	private validateAsset(asset:any):boolean {
		
		let valid = true;
		
		if(typeof asset !== "undefined") {
			
			if(!asset.hasOwnProperty("name")) {
				
				valid = false;
				
				Asset.log.d("NAME_INVALID");
				
			}
			
			if(!asset.hasOwnProperty("timeline")) {
				
				valid = false;
				
				Asset.log.d("TIMELINE_INVALID");
				
			}
			
			if(!asset.hasOwnProperty("track")) {
				
				valid = false;
				
				Asset.log.d("TRACK_INVALID");
				
			}
			
			if(!asset.hasOwnProperty("meta")) {
				
				valid = false;
				
				Asset.log.d("META_INVALID");
				
			}
			
		} else {
			
			valid = false;
			
			Asset.log.d("ASSET_EMPTY");
			
		}
		
		return valid;
		
	}
	
	
	
}

export { Asset };