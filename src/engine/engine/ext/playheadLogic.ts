/*
*	module for all playhead state logic.
*	Handles all logic of a playhead advancing.
*/

import { sha1 } from "../interface/sha1";
import { playheadObject } from "../interface/playheadObject"

import { Logger } from "../../../shared/logger";

class PlayheadLogic {
	
	static log:any;
	
	/* module varaibles */
	static playheads:any;
	static meta:any;
	
	/* module constants */
	static readonly STATUS_PAUSED: string = "PAUSE";
	static readonly STATE_PLAY: string = "PLAY";
	static readonly CUE_MODE_HOLD: string = "HOLD";
	static readonly CUE_MODE_FOLLOW: string = "FOLLOW";
	static readonly CUE_MODE_END: string = "END";
	static readonly ASSET_MODE_REPEAT: string = "REPEAT";
	static readonly ASSET_MODE_END: string = "END";
	
	constructor(options: any, playheadStore: any, playheadMetaStore: any) {
		
		// setup the logging handling. 
		PlayheadLogic.log = new Logger("PLAYHEAD_LOGIC");
		PlayheadLogic.log.c("STARTING");
		
		// check if debugging option is set. 
		if(options && options.hasOwnProperty("verbose")) {
			
			PlayheadLogic.log.setVerbose();
			
		}
		
		PlayheadLogic.playheads = playheadStore;
		
		PlayheadLogic.meta = playheadMetaStore;
		
	}
	
	modeFollow(playhead: playheadObject, shakey: sha1) {
		
		if(playhead.index + 1 <= playhead.indexMax 
			&& playhead.index >= 0) {
			/* determines if current playhead index is a valid number. */
			
			playhead.index++;
			
			playhead.current = 0;
			
			let meta = PlayheadLogic.meta.get(shakey);
			
			if(playhead.index + 1 < meta.length - 1) {
				
				playhead.nextCueMode = meta[playhead.index + 1].cueMode;
				
			} else {
				
				if(playhead.assetMode === PlayheadLogic.ASSET_MODE_REPEAT) {
					
					playhead.index = 0;
					
					playhead.nextCueMode = meta[0].cueMode;
					
				} else if(playhead.assetMode === PlayheadLogic.ASSET_MODE_END) {
					
					playhead.nextCueMode = PlayheadLogic.CUE_MODE_END;
					
				} else {
					
					PlayheadLogic.log.c("ASSET_MODE_UNKNOWN:", playhead.assetMode);
					
				}
				
			}
			
			PlayheadLogic.log.v("ADVANCING:", shakey.hex);
			
		} else if(playhead.index >= playhead.indexMax) {
			/* determines if the playhead is at the end */
			
			playhead.index = playhead.indexMax;
			
			playhead.current = 0;
			
			if(playhead.state === PlayheadLogic.STATE_PLAY) {
				
				playhead.state = PlayheadLogic.STATUS_PAUSED;
				
				PlayheadLogic.log.v("END_OF_ASSET:", shakey.hex);
				
			}
		
		}
	
	}
	
	modeHold(playhead: playheadObject, shakey: sha1) {
		
		playhead.index++;
		
		playhead.current = 0;
		
		if(playhead.state === PlayheadLogic.STATE_PLAY) {
			
			playhead.state = PlayheadLogic.STATUS_PAUSED;
			
			PlayheadLogic.log.v("HELD:", shakey.hex);
			
		}
	
	}
	
	modeEnd(playhead: playheadObject, shakey: sha1) {
		
		playhead.index = 0;
		
		playhead.current = 0;
		
		playhead.state = PlayheadLogic.STATUS_PAUSED;
		
		let meta = PlayheadLogic.meta.get(shakey);
		
		if(meta.length >= 1) {
			
			playhead.nextCueMode = meta[1].cueMode;
			
		} else {
			
			playhead.nextCueMode = PlayheadLogic.CUE_MODE_END;
			
		}
		
		PlayheadLogic.log.v("END:", shakey.hex);
		
	}

}

export { PlayheadLogic };