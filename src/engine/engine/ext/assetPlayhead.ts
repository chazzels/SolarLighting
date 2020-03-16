/*
*	module to track current position in time each asset is at.
*	provide asset status to other modules in the engine enviroment.
*/

import { sha1 } from "../interface/sha1";
import { playheadObject } from "../interface/playheadObject";

import { PlayheadLogic } from "./playheadLogic";
import { Logger } from "../../../shared/logger";

class AssetPlayhead {
	
	static log:any;
	
	/* module varaibles */
	static heads:any = new Map();
	static meta:any = new Map();
	static keys:any = [];
	static logic:any;
	static activeManifest:any = [];
	static perf:any;
	
	/* module constants */
	static readonly STATUS_PAUSED:string = "PAUSE";
	static readonly STATE_PLAY:string = "PLAY";
	static readonly MODE_HOLD:string = "HOLD";
	static readonly MODE_FOLLOW:string = "FOLLOW";
	static readonly MODE_END:string = "END";
	static readonly ASSET_MODE_REPEAT:string = "REPEAT";
	static readonly ASSET_MODE_END:string = "END";
	
	/* performance variables */
	static readonly PLAYUPDATE:string = "PlayheadUpdate";
	
	constructor(options:any, perf:any) {
		
		AssetPlayhead.log = new Logger("ASSET_PLAYHEAD");
		AssetPlayhead.log.c("STARTING");
		
		if(options && options.hasOwnProperty("verbose")) {
			if(options.verbose) {
				AssetPlayhead.log.setVerbose();
			}
		}
		
		// add in the extend logic module. 
		// handles all logic for advancing a playhead to the next cue.
		AssetPlayhead.logic = new PlayheadLogic(options, AssetPlayhead.heads, AssetPlayhead.meta);
		
		AssetPlayhead.perf = perf;
		perf.registerParameter(AssetPlayhead.PLAYUPDATE);
		
	}
	
	/* update the playheads values. */
	update() {
			
		AssetPlayhead.tick();
		
		return AssetPlayhead.activeManifest;
		
	}
	
	/* debug: playheader current. */
	
	/* load a asset timeline in and create a new playhead for it. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	/* @param {any} assetTimeline - an assets cue timing data. */
	loadTimeline(shakey:sha1, asset: any) {
		
		// check the next cue mode or default to END if none present.
		let nextCueMode = asset.timeline[1].cueMode || AssetPlayhead.MODE_END;
		
		// REQUIRES.
		// asset.cueTimeline
		// asset.assetMode
		
		// create a playhead.
		// defaults state to paused.
		let playhead = {
			index: 1,
			indexMax: asset.timeline.length,
			timing: parseInt(asset.timeline[0].timing),
			current: 0,
			last: Date.now(),
			state: AssetPlayhead.STATUS_PAUSED,
			nextCueMode: nextCueMode,
			assetMode: asset.mode
		};
		
		AssetPlayhead.heads.set(shakey, playhead);
		
		AssetPlayhead.meta.set(shakey, asset.timeline);
		
		AssetPlayhead.keys.push(shakey);
		
		AssetPlayhead.log.v("LOAD", shakey.hex);
		
	}
	
	/* remove timeline from the playhead module. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	dumpTimeline(shakey: sha1) {
		
		let playheadStatus: boolean = AssetPlayhead.heads.delete(shakey);
		
		let metaStatus: boolean = AssetPlayhead.meta.delete(shakey);
		
		let keyIndex = AssetPlayhead.keys.indexOf(shakey);
		
		if(keyIndex !== -1) {
			
			AssetPlayhead.keys.splice(keyIndex, 1);
			
		}
		
		
		
		if(playheadStatus && metaStatus) {
			
			AssetPlayhead.log.v("DUMP:", shakey.hex);
			
		}
		
	}
	
	/* returns the data stored for a timeline. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getPlayhead(shakey: sha1) : playheadObject {
		
		return AssetPlayhead.heads.get(shakey);
		
	}
	
	/* returns the progress of a playhead as a value between 0 and 1. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getProgress(shakey: sha1) {
		
		let playhead = AssetPlayhead.heads.get(shakey);
		
		let val = playhead.current / playhead.timing;
		
		let factor = Math.pow(10, 4);
		
		val = Math.round(val * factor) / factor;
		
		return val;
		
	}
	
	/* returnns the current index of a playhead as a unsigned integer. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getIndex(shakey: sha1) : number {
		
		let playhead = AssetPlayhead.heads.get(shakey);
		
		if(typeof playhead !== 'undefined') {
			
			return playhead.index;
			
		} else {
			
			return null;
			
		}
		
	}
	
	/* resume or start tracking of an asset playhead.  */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	play(shakey: sha1) {
		
		let playhead = AssetPlayhead.heads.get(shakey);
		
		if(playhead.state === AssetPlayhead.STATUS_PAUSED) {
			
			playhead.last = Date.now();
			
			playhead.state = AssetPlayhead.STATE_PLAY;
			
			AssetPlayhead.log.v("PLAYED "+playhead.index+"/"+playhead.indexMax, shakey.hex);
			
		} else {
			
			AssetPlayhead.log.v("PLAY_STATE_UNEXPECTED:", playhead.state);
			
		}
		
	}
	
	/* stop or pause tracking of an asset playhead. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	pause(shakey: sha1) {
		
		let playhead = AssetPlayhead.heads.get(shakey);
		
		if(playhead.state === AssetPlayhead.STATE_PLAY) {
			
			playhead.state = AssetPlayhead.STATUS_PAUSED;
			
		}
		
		AssetPlayhead.log.v("PAUSED:", shakey.hex);
		
	}
	
	/* one loop of the asset playhead system. */
	/* calculates the current time of a playhead. */
	/* also determines if a playhead needs to be advanced. */
	static tick() {
		
		let keysLength = AssetPlayhead.keys.length;
		
		AssetPlayhead.activeManifest = [];
		
		for(let i = 0; i < keysLength; i++) {
			
			AssetPlayhead.updatePlayhead(AssetPlayhead.keys[i]);
			
			AssetPlayhead.perf.hit(AssetPlayhead.PLAYUPDATE);
			
		}
		
		return true;
		
	}
	
	/* update a playhead based on the sha1 key passed in. */
	/* determines if the playhead needs to be advanced. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	static updatePlayhead(shakey: sha1) {
		
		let playhead = AssetPlayhead.heads.get(shakey);
		
		let now = Date.now();
		
		let diff = now - playhead.last;
		
		// Check the playhead is in the play state
		if(playhead.state === AssetPlayhead.STATE_PLAY) {
			
			AssetPlayhead.activeManifest.push(shakey);
			
			// add ms time difference to the current ms counter.
			playhead.current += diff;
			
			// if current ms counter greater than cues timing then...
			if(playhead.current >= playhead.timing) {
				
				// ... then trigger advance playhead logic..
				AssetPlayhead.advancePlayhead(playhead, shakey);
				
			}
			
			// update the UTC clock to the last update time.
			playhead.last = Date.now();
			
		}
		
	}
	
	
	/* advance a playhead to the next index. */
	/* routes to playhead logic module based on next cues mode. */
	/* @param {playheadObject} playhead - asset playhead. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	static advancePlayhead(playhead: playheadObject, shakey: sha1) {
		
		if(playhead.nextCueMode === AssetPlayhead.MODE_FOLLOW) {
			
			AssetPlayhead.logic.modeFollow(playhead, shakey);
			
		} else if(playhead.nextCueMode === AssetPlayhead.MODE_HOLD) {
			
			AssetPlayhead.logic.modeHold(playhead, shakey);
			
		} else if(playhead.nextCueMode === AssetPlayhead.MODE_END) {
			
			AssetPlayhead.logic.modeEnd(playhead, shakey);
		
		} else {
			
			AssetPlayhead.log.v("MODE_UNKNOWN:", playhead.nextCueMode, shakey.hex);
			
		}
		
	}
	
}

export { AssetPlayhead };