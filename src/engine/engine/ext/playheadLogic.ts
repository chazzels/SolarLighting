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
			if(options.verbose) {
				PlayheadLogic.log.setVerbose();
			}
		}
		
		PlayheadLogic.playheads = playheadStore;
		
		PlayheadLogic.meta = playheadMetaStore;
		
	}
	
	// a cue in follow mode will immediately start after the previous cue has 
	// finished.
	modeFollow(playhead: playheadObject, shakey: sha1) {
		
		/* determines if current playhead index is a valid number. */
		if(playhead.index + 1 <= playhead.indexMax 
			&& playhead.index >= 0) {
			
			playhead.index++;
			
			playhead.current = 0;
			
			PlayheadLogic.log.v("ADVANCING "+playhead.index+"/"+playhead.indexMax, shakey.hex);
			
			let meta = PlayheadLogic.meta.get(shakey);
			
			if(playhead.index + 1 < meta.length - 1) {
				
				playhead.nextCueMode = meta[playhead.index + 1].cueMode;
				
			} else {
				
				if(playhead.assetMode === PlayheadLogic.ASSET_MODE_REPEAT) {
					
					playhead.index = 0;
					
					playhead.nextCueMode = meta[0].cueMode;
					
					PlayheadLogic.log.v("REPEAT", shakey.hex);
					
				} else if(playhead.assetMode === PlayheadLogic.ASSET_MODE_END) {
					
					playhead.nextCueMode = PlayheadLogic.CUE_MODE_END;
					
					PlayheadLogic.log.v("END", shakey.hex);
					
				} else {
					
					PlayheadLogic.log.c("MODE_UNKNOWN:", playhead.assetMode);
					
				}
				
			}
			
		/* determines if the playhead is at the end */
		} else if(playhead.index >= playhead.indexMax) {
			
			playhead.index = playhead.indexMax;
			
			playhead.current = 0;
			
			if(playhead.state === PlayheadLogic.STATE_PLAY) {
				
				playhead.state = PlayheadLogic.STATUS_PAUSED;
				
				PlayheadLogic.log.v("END_OF_ASSET:", shakey.hex);
				
			}
		
		}
	
	}
	
	// a cue hold mode will wait for a fire event before starting.
	modeHold(playhead: playheadObject, shakey: sha1) {
		
		// advance the index.
		playhead.index++;
		
		playhead.current = 0;
		
		if(playhead.state === PlayheadLogic.STATE_PLAY) {
			
			playhead.state = PlayheadLogic.STATUS_PAUSED;
			
			PlayheadLogic.log.v("HELD:", shakey.hex);
			
		}
	
	}
	
	// a cue in end mode is the last of the cuelist.
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