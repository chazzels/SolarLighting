/*
*	module for all playhead state logic.
*/

import { sha1 } from "../interface/sha1";
import { playheadObject } from "../interface/playheadObject"

class PlayheadLogic {
	
	/* module flags */
	private readonly VERBOSE: boolean = false;
	
	/* module varaibles */
	private _playheads: any;
	private _playheadsMeta: any;
	
	/* module constants */
	private readonly STATUS_PAUSED: string = "PAUSE";
	private readonly STATE_PLAY: string = "PLAY";
	private readonly CUE_MODE_HOLD: string = "HOLD";
	private readonly CUE_MODE_FOLLOW: string = "FOLLOW";
	private readonly CUE_MODE_END: string = "END";
	private readonly ASSET_MODE_REPEAT: string = "REPEAT";
	private readonly ASSET_MODE_END: string = "END";
	
	constructor(options: any, playheadStore: any, playheadMetaStore: any) {
		
		if(options && options.hasOwnProperty("verbose")) {
			
			this.VERBOSE = options.verbose;
			
		}
		
		this._playheads = playheadStore;
		
		this._playheadsMeta = playheadMetaStore;
		
	}
	
	modeFollow(playhead: playheadObject, shakey: sha1) {
		
		if(playhead.index + 1 <= playhead.indexMax 
			&& playhead.index >= 0) {
			/* determines if current playhead index is a valid number. */
			
			playhead.index++;
			
			playhead.current = 0;
			
			let meta = this._playheadsMeta.get(shakey);
			
			if(playhead.index + 1 < meta.length - 1) {
				
				playhead.nextCueMode = meta[playhead.index + 1].cueMode;
				
			} else {
				
				if(playhead.assetMode === this.ASSET_MODE_REPEAT) {
					
					playhead.index = 0;
					
					playhead.nextCueMode = meta[0].cueMode;
					
				} else if(playhead.assetMode === this.ASSET_MODE_END) {
					
					playhead.nextCueMode = this.CUE_MODE_END;
					
				} else {
					
					console.log("PLAYHEAD::ASSET_MODE_UNKNOWN:", playhead.assetMode);
					
				}
				
			}
			
			if(this.VERBOSE) {
				
				console.log("PLAYHEAD::ADVANCING: ", shakey.hex);
				
			}
			
		} else if(playhead.index >= playhead.indexMax) {
			/* determines if the playhead is at the end */
			
			playhead.index = playhead.indexMax;
			
			playhead.current = 0;
			
			if(playhead.state === this.STATE_PLAY) {
				
				playhead.state = this.STATUS_PAUSED;
				
				if(this.VERBOSE) {
					
					console.log("PLAYHEAD::END_OF_ASSET: ", shakey.hex);
					
				}
				
			}
		
		}
	
	}
	
	modeHold(playhead: playheadObject, shakey: sha1) {
		
		playhead.index++;
		
		playhead.current = 0;
		
		if(playhead.state === this.STATE_PLAY) {
			
			playhead.state = this.STATUS_PAUSED;
			
			if(this.VERBOSE) {
				
				console.log("PLAYHEAD::HELD: ", shakey.hex);
				
			}
			
		}
	
	}
	
	modeEnd(playhead: playheadObject, shakey: sha1) {
		
		playhead.index = 0;
		
		playhead.current = 0;
		
		playhead.state = this.STATUS_PAUSED;
		
		let meta = this._playheadsMeta.get(shakey);
		
		if(meta.length >= 1) {
			
			playhead.nextCueMode = meta[1].cueMode;
			
		} else {
			
			playhead.nextCueMode = this.CUE_MODE_END;
			
		}
		
		if(this.VERBOSE) {
			
			console.log("PLAYHEAD::END:", shakey.hex);
			
		}
		
	}

}

export { PlayheadLogic };