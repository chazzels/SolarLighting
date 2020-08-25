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
		
		let meta = PlayheadLogic.meta.get(shakey);
		
		// advance the current index.
		playhead.index++;
		
		// reset the time tracker.
		playhead.current = 0;
		
		PlayheadLogic.log.v("ADVANCING "+playhead.index+"/"+playhead.indexMax, shakey.hex);
		
		// determines if current playhead index is a valid number.
		if(playhead.index < playhead.indexMax
			&& playhead.index >= 0) {
			
			PlayheadLogic.log.v("NEXT_CUE", shakey.hex);
			
			// get the next cues mode.
			// do not do this for the last cue.
			if(playhead.index < playhead.indexMax) {
				playhead.nextCueMode = meta[playhead.index].cueMode;
			} else {
				// do nothing.
			}
			
		// do nothing if you are on the last cue. 
		// things will be reset once the 
		} else if(playhead.index == playhead.indexMax) {
			
			playhead.index = playhead.indexMax;
			
			PlayheadLogic.log.v("LAST_CUE", shakey.hex);
			
		// determines if the playhead is at the end 
		} else if(playhead.index > playhead.indexMax) {
			
			// if asset play mode is repeat. 
			if(playhead.assetMode === PlayheadLogic.ASSET_MODE_REPEAT) {
				
				// reset the index.
				playhead.index = 1;
				
				// get the first cues mode. 
				playhead.nextCueMode = meta[0].cueMode;
				
				PlayheadLogic.log.v("CUE_REPEAT "+playhead.index+"/"+playhead.indexMax, shakey.hex);
				
			// if asset play mode is end.
			} else if(playhead.assetMode === PlayheadLogic.ASSET_MODE_END) {
				
				playhead.index = playhead.indexMax;
				
				playhead.nextCueMode = PlayheadLogic.CUE_MODE_END;
				
				PlayheadLogic.log.v("CUE_END", shakey.hex);
				
			// if the asset play mode is unkown.
			} else {
				
				PlayheadLogic.log.c("CUE_MODE_UNKNOWN", playhead.assetMode);
				
			}
			
		} else {
			
			PlayheadLogic.log.c("INDEX_UNKNOWN", playhead.index)
			
		}
		
	}
	
	// a cue hold mode will wait for a fire event before starting.
	modeHold(playhead: playheadObject, shakey: sha1) {
		
		// advance the index.
		playhead.index++;
		
		// reset the current playhead 
		playhead.current = 0;
		
		if(playhead.state === PlayheadLogic.STATE_PLAY) {
			
			playhead.state = PlayheadLogic.STATUS_PAUSED;
			
			PlayheadLogic.log.v("CUELIST_HELD", shakey.hex);
			
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
		
		PlayheadLogic.log.v("CUELIST_END", shakey.hex);
		
	}

}

export { PlayheadLogic };