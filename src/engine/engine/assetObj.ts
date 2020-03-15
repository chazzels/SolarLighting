/*
*	module to create playhead objects. 
*/

// TODO: add properties checks for the asset data.

import { sha1 } from "./interface/sha1";

import * as Crypto from "crypto";

class Asset {
	
	// tracks number of assets added.
	// helps prevent SHA1 Collisions.
	static count:number = 0;
	static lastShortKey = "b8c7dba56a";
	
	/* constants for asset states. */
	static readonly STATE_PAUSED:string = "PAUSE";
	static readonly STATE_PLAY:string = "PLAY";
	
	/* constants for cue modes. */
	static readonly CUE_HOLD:string = "HOLD";
	static readonly CUE_FOLLOW:string = "FOLLOW";
	static readonly CUE_END:string = "END";
	
	/* constants for assset modes. */
	static readonly ASSET_REPEAT:string = "REPEAT";
	static readonly ASSET_END:string = "END";
	
	/* default values for all playheads. */
	private current:number = 0;
	private cueCount:number = 1;
	private last:number = Date.now();
	
	/* must be set in the constructor first. */
	private timeline:any;
	private track:any[];
	private meta:any;
	private shakey:sha1;
	
	/* placeholder values for assets. */
	private name:string = "Default";
	private mode:string = Asset.ASSET_END;
	private index:number = 0;
	private nextCueMode:string = "HOLD";
	private duration:number = 1000;
	
	
	constructor( asset:any) {
		
		this.timeline = asset.timeline;
		this.track = asset.track;
		this.meta = asset.meta;
		
		/* set the assets name. */
		this.name = asset.name;
		
		/* set the assert mode. */
		this.mode = asset.mode;
		
		/* setting the number of cues for the playehad. */
		this.cueCount = asset.timeline.length-1;
		
		/* set the nexts cue mode. */
		/* if no next cue the CUE_END mode is set to stop the asset. */
		this.nextCueMode = this.timeline[1].cueMode || Asset.CUE_END;
		
		/* loading the first cues length into the playhead. */
		this.duration = parseInt(asset.timeline[0].timing);
		
		
		
		Asset.count++;
		
		/* set the key. */
		this.generateShaKey();
		
		return this;
		
	}
	
	getCue() {
		
		return this.timeline[this.current];
		
	}
	
	// generates a key for the 
	private generateShaKey() {
		
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
		
		// update the last short key. 
		Asset.lastShortKey = shaReturn.short;
		
		this.shakey = shaReturn;
		
	}
	
}

export { Asset };