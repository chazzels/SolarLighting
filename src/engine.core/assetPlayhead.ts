/*
*	module to track current position in time each asset is at.
*	provide asset status to other modules in the engine enviroment.
*/

import { sha1 } from "./interface/sha1";
import { playheadObject } from "./interface/playheadObject"

class AssetPlayhead {
	
	/* imported modules */
	private PlayheadLogic: any = require("./playheadLogic");
	
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
	private readonly STATUS_PLAY: string = "PLAY";
	private readonly MODE_HOLD: string = "HOLD";
	private readonly MODE_FOLLOW: string = "FOLLOW";
	private readonly MODE_END: string = "END";
	
	/* performance variables */
	private readonly PLAYUPDATE: string = "PlayheadUpdate";
	
	constructor(perf: any) {
		
		console.log("PLAYHEAD::STARTING");
		console.group();
		
		this._logic = new this.PlayheadLogic(this._playheads, this._playheadsMeta);
		
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
	loadTimeline(shakey: sha1, assetTimeline: any) {
		
		let nextCueMode = assetTimeline[1].cueMode || "END";
		
		let playhead = {
			index: 0,
			indexMax: assetTimeline.length-1,
			timing: parseInt(assetTimeline[0].timing),
			current: 0,
			last: Date.now(),
			state: this.STATUS_PAUSED,
			nextCueMode: nextCueMode
		};
		
		let meta = assetTimeline;
		
		this._playheads.set(shakey, playhead);
		
		this._playheadsMeta.set(shakey, meta);
		
		this._playheadKeys.push(shakey);
		
		this._totalAssets++;
		
		console.log("PLAYHEAD::LOAD:", shakey.hex);
		
	}
	
	/* remove timeline from the playhead module. */
	dumpTimeline(shakey: sha1) {
		
		let playheadStatus: boolean = this._playheads.delete(shakey);
		
		let metaStatus: boolean = this._playheadsMeta.delete(shakey);
		
		let keyIndex = this._playheadKeys.indexOf(shakey);
		
		if(keyIndex !== -1) {
			
			this._playheadKeys.splice(keyIndex, 1);
			
		}
		
		if(playheadStatus && metaStatus) {
			
			console.log("PLAYHEAD::DUMP:", shakey.hex);
			
		}
		
	}
	
	/* returns the data stored for a timeline. */
	getPlayhead(shakey: sha1) : playheadObject {
		
		return this._playheads.get(shakey);
		
	}
	
	/* returns the progress of a playhead as a value between 0 and 1. */
	getProgress(shakey: sha1) {
		
		let playhead = this._playheads.get(shakey);
		
		let val = playhead.current / playhead.timing;
		
		let factor = Math.pow(10, 4);
		
		val = Math.round(val * factor) / factor;
		
		return val;
		
	}
	
	/* returnns the current index of a playhead as a unsigned integer. */
	getIndex(shakey: sha1) : number {
		
		let playhead = this._playheads.get(shakey);
		
		if(typeof playhead !== 'undefined') {
			
			return playhead.index;
			
		} else {
			
			return null;
			
		}
		
	}
	
	/* resume or start tracking of an asset playhead.  */
	play(shakey: sha1) {
		
		let playhead = this._playheads.get(shakey);
		
		if(playhead.state === this.STATUS_PAUSED) {
			
			playhead.last = Date.now();
			
			playhead.state = this.STATUS_PLAY;
			
			console.log("PLAYHEAD::PLAYED:", shakey.hex);
			
		} else {
			
			console.log("PLAYHEAD::PLAY_STATE_UNEXPECTED:", playhead.state);
			
		}
		
	}
	
	/* stop or pause tracking of an asset playhead. */
	pause(shakey: sha1) {
		
		let playhead = this._playheads.get(shakey);
		
		if(playhead.state === this.STATUS_PLAY) {
			
			playhead.state = this.STATUS_PAUSED;
			
		}
		
		console.log("PLAYHEAD::PAUSED:", shakey.hex);
		
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
	private _updatePlayhead(shakey: sha1) {
		
		let now = Date.now();
		
		let playhead = this._playheads.get(shakey);
		
		let diff = now - playhead.last;
		
		if(playhead.state === this.STATUS_PLAY) {
			
			playhead.current += diff;
			
			if(playhead.current >= playhead.timing) {
				
				this._advancePlayhead(playhead, shakey);
				
			} 
			
			playhead.last = Date.now();
			
		}
		
	}
	
	
	/* advance a playhead to the next index. */
	/* routes to playhead logic module based on next cues mode. */
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