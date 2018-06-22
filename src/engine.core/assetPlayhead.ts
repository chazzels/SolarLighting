/*
*	module to track current position in time each asset is at.
*	provide asset status to other modules in the engine enviroment.
*/

import { sha1 } from "./interface/sha1";
import { playheadObject } from "./interface/playheadObject"

class AssetPlayhead {
	
	/* imported modules */
	private PlayheadLogic: any = require("./playheadLogic");
	
	/* module flags */
	private readonly VERBOSE: boolean = false;
	
	/* module varaibles */
	private _playheads: any = new Map();
	private _playheadsMeta: any = new Map();
	private _playheadKeys: any = [];
	private _totalAssets: number = 0;
	private _playheadIndex: number;
	private _logic: any;
	private perf: any;
	
	/* module constants */
	private readonly STATUS_PAUSED: string = "PAUSE";
	private readonly STATE_PLAY: string = "PLAY";
	private readonly MODE_HOLD: string = "HOLD";
	private readonly MODE_FOLLOW: string = "FOLLOW";
	private readonly MODE_END: string = "END";
	private readonly ASSET_MODE_REPEAT: string = "REPEAT";
	private readonly ASSET_MODE_END: string = "END";
	
	/* performance variables */
	private readonly PLAYUPDATE: string = "PlayheadUpdate";
	
	constructor(options: any, perf: any) {
		
		if(options && options.hasOwnProperty("verbose")) {
			
			this.VERBOSE = options.verbose;
			
		}
		
		console.log("PLAYHEAD::STARTING");
		console.group();
		
		this._logic = new this.PlayheadLogic(options, this._playheads, this._playheadsMeta);
		
		this.perf = perf;
		perf.registerParameter(this.PLAYUPDATE);
		
		console.groupEnd();
		
	}
	
	/* update the playheads values. */
	update() {
			
		this.tick();
		
	}
	
	/* debug: playheader current. */
	
	/* load a timeline in and create a new playhead for it. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	/* @param {any} assetTimeline - an assets cue timing data. */
	loadTimeline(shakey: sha1, asset: any) {
		
		let nextCueMode = asset.cueTimeline[1].cueMode || "END";
		
		let playhead = {
			index: 0,
			indexMax: asset.cueTimeline.length-1,
			timing: parseInt(asset.cueTimeline[0].timing),
			current: 0,
			last: Date.now(),
			state: this.STATUS_PAUSED,
			nextCueMode: nextCueMode,
			assetMode: asset.assetMode
		};
		
		let meta = asset.cueTimeline;
		
		this._playheads.set(shakey, playhead);
		
		this._playheadsMeta.set(shakey, meta);
		
		this._playheadKeys.push(shakey);
		
		this._totalAssets++;
		
		if(this.VERBOSE) {
			
			console.log("PLAYHEAD::LOAD:", shakey.hex);
			
		}
		
	}
	
	/* remove timeline from the playhead module. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	dumpTimeline(shakey: sha1) {
		
		let playheadStatus: boolean = this._playheads.delete(shakey);
		
		let metaStatus: boolean = this._playheadsMeta.delete(shakey);
		
		let keyIndex = this._playheadKeys.indexOf(shakey);
		
		if(keyIndex !== -1) {
			
			this._playheadKeys.splice(keyIndex, 1);
			
		}
		
		if(playheadStatus && metaStatus && this.VERBOSE) {
			
			console.log("PLAYHEAD::DUMP:", shakey.hex);
			
		}
		
	}
	
	/* returns the data stored for a timeline. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getPlayhead(shakey: sha1) : playheadObject {
		
		return this._playheads.get(shakey);
		
	}
	
	/* returns the progress of a playhead as a value between 0 and 1. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getProgress(shakey: sha1) {
		
		let playhead = this._playheads.get(shakey);
		
		let val = playhead.current / playhead.timing;
		
		let factor = Math.pow(10, 4);
		
		val = Math.round(val * factor) / factor;
		
		return val;
		
	}
	
	/* returnns the current index of a playhead as a unsigned integer. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	getIndex(shakey: sha1) : number {
		
		let playhead = this._playheads.get(shakey);
		
		if(typeof playhead !== 'undefined') {
			
			return playhead.index;
			
		} else {
			
			return null;
			
		}
		
	}
	
	/* resume or start tracking of an asset playhead.  */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	play(shakey: sha1) {
		
		let playhead = this._playheads.get(shakey);
		
		if(playhead.state === this.STATUS_PAUSED) {
			
			playhead.last = Date.now();
			
			playhead.state = this.STATE_PLAY;
			
			if(this.VERBOSE) {
				
				console.log("PLAYHEAD::PLAYED:", shakey.hex);
				
			}
			
		} else {
			
			if(this.VERBOSE) {
				
				console.log("PLAYHEAD::PLAY_STATE_UNEXPECTED:", playhead.state);
				
			}
			
		}
		
	}
	
	/* stop or pause tracking of an asset playhead. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	pause(shakey: sha1) {
		
		let playhead = this._playheads.get(shakey);
		
		if(playhead.state === this.STATE_PLAY) {
			
			playhead.state = this.STATUS_PAUSED;
			
		}
		
		if(this.VERBOSE) {
			
			console.log("PLAYHEAD::PAUSED:", shakey.hex);
			
		}
		
	}
	
	/* one loop of the asset playhead system. */
	/* calculates the current time of a playhead. */
	/* also determines if a playhead needs to be advanced. */
	private tick() {
		
		let keysLength = this._playheadKeys.length;;
		
		for(let i = 0; i < keysLength; i++) {
			
			this._updatePlayhead(this._playheadKeys[i]);
			
			this.perf.hit(this.PLAYUPDATE);
			
		}
		
		return true;
		
	}
	
	/* update a playhead based on the sha1 key passed in. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	private _updatePlayhead(shakey: sha1) {
		
		let now = Date.now();
		
		let playhead = this._playheads.get(shakey);
		
		let diff = now - playhead.last;
		
		// Check the playhead is in the play state
		if(playhead.state === this.STATE_PLAY) {
			
			// add ms time difference to the current ms counter. 
			playhead.current += diff;
			
			// if current ms counter greater than cues timing then...
			if(playhead.current >= playhead.timing) {
				
				// ... then trigger advance playhead logic..
				this._advancePlayhead(playhead, shakey);
				
			} 
			
			// update the UTC clock to the last update time. 
			playhead.last = Date.now();
			
		}
		
	}
	
	
	/* advance a playhead to the next index. */
	/* routes to playhead logic module based on next cues mode. */
	/* @param {playheadObject} playhead - asset playhead. */
	/* @param {string} shakey - sha1 key used to reference an asset. */
	private _advancePlayhead(playhead: playheadObject, shakey: sha1) {
		
		if(playhead.nextCueMode === this.MODE_FOLLOW) {
			
			this._logic.modeFollow(playhead, shakey);
			
		} else if(playhead.nextCueMode === this.MODE_HOLD) {
			
			this._logic.modeHold(playhead, shakey);
			
		} else if(playhead.nextCueMode === this.MODE_END) {
			
			this._logic.modeEnd(playhead, shakey);
		
		} else {
			
			console.log("PLAYHEAD::MODE_UNKNOWN:", playhead.nextCueMode, shakey.hex);
			
		}
		
	}
	
}

export = AssetPlayhead;