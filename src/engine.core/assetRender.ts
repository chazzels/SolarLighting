/*
*	main calculations of the engine generates values for the fixtures.
*	** this modulerelies on the data from the AssetManager module ** 
*/

import { sha1 } from "./interface/sha1";

class AssetRender {
	
	/* module flags */
	private readonly VERBOSE: boolean = false;
	private readonly DEBUG: boolean = false;
	
	/* module variables */
	private _stateUpdate: any;
	private _manifest: any = [];
	private _manifestLength: number = 0;
	private _manifestIndex: number = -1;
	private _playheads: any;
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
		
		let playhead = assetObj.playhead,
			cue = assetObj.cue,
			prevCue = assetObj.previousCue,
			progress = assetObj.progress;
		
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
	
}

export = AssetRender;