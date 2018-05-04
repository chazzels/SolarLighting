/*
*	main calculations of the engine generates values for the fixtures.
*	** this modulerelies on the data from the AssetManager module ** 
*/

import { sha1 } from "./interface/sha1";

class AssetRender {
	
	/* module variables */
	private _stateUpdate: any;
	private _manifest: any = [];
	private _manifestLength: number = 0;
	private _manifestIndex: number = -1;
	private _playheads: any;
	private _store
	private perf: any;
	
	/* performance variables */
	private readonly ASSETCALC: string = "AssetCalc";
	
	constructor(perf:any) {
		
		console.log("RENDER::STARTING");
		console.group();
		
		/* performance parameters declarations */
		this.perf = perf;
		perf.registerParameter(this.ASSETCALC);
		
		console.groupEnd();
		
	}
	
	/* update the assetObj passed in. */
	/* return the updated cue value form the passed in asset data. */
	update(assetObj: any) {
		
		return this.tick(assetObj);
		
	}
	
	/* advance the manifest index so the next asset get calculated. */
	next() {
		
		if(this._manifestIndex + 1 < this._manifestLength) {
			
			this._manifestIndex++;
			
		}
		
	}
	
	/* get the current key that renderer will be using. */
	/* other modules use this to determine the data passed to the render. */
	getCurrentKey() {
		
		if(this._manifestIndex < this._manifestLength
			&& this._manifestIndex >= 0) {
			
			return this._manifest[this._manifestIndex];
			
		} else {
			
			return null;
			
		}
		
	}
	
	/* get the total number of active assets. */
	getLoopCount() {
		
		return this._manifestLength;
		
	}
	
	
	/* update the list of active asset keys to be rendered. */
	updateManifest(manifest: any) {
		
		this._manifest = manifest;
		
		this._manifestLength = manifest.length;
		
		this._manifestIndex = -1;
		
	}
	
	/* one loop of the asset render system. */
	/* calculates the new value of one asset passed in. */
	private tick(assetObj: any) {
		
		let manifestLength = this._manifest.length;
		
		if(manifestLength > 0) {
			
			return this.updateAsset(assetObj);
			
		} else {
		
			return false;
		
		}
		
	}
	
	/* using asset data passed in current state will be calculated. */
	private updateAsset(assetObj: any) {
		
		let playhead = assetObj.playhead;
		
		let cue = assetObj.cue;
		
		let prevCue = assetObj.previousCue;
		
		let progress = this.calcProgress(playhead);
		
		let calcCue = this.calcCue(prevCue, cue, progress);
		
		return calcCue;
		
	}
	
	/* update the values in the cue.  */
	/* Return an updated cue track object values based on progress. */
	private calcCue(prevCue: any, curCue: any, progress: number) {
		
		let calcCue =  {
			red: 0,
			green: 0,
			blue: 0
		}
		
		calcCue.red = this.calcParameter(prevCue.red, curCue.red, progress);
		
		calcCue.green = this.calcParameter(prevCue.green,curCue.green,progress);
		
		calcCue.blue = this.calcParameter(prevCue.blue, curCue.blue, progress);
		
		this.perf.hit(this.ASSETCALC);
		
		return calcCue;
	}
	
	/* process new values for the cues based on last state, next state and  */
	/* curent progress. Returns single number to update one parameter. */
	private calcParameter(startVal: number, endVal: number, progress: number) {
		
		let signed = (endVal < startVal);
		
		let valueRange = Math.abs(endVal - startVal);
		
		let result = valueRange * progress;
		
		if(signed) {
			
			result = startVal - result;
			
		}
		
		result = Math.floor(result);
		
		return result;
		
	}
	
	/* calculate cue progress and how close it is to the end. */
	/* Return number betwene 0 and 1. */
	private calcProgress(playhead: any) {
		
		let progress = playhead.current / playhead.timing;
		
		let factor = Math.pow(10, 2);
		
		progress = Math.round(progress * factor) / factor;
		
		return progress;
		
	}

}

export = AssetRender;