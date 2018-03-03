/*	
*	Stores the output of the render so other modules can up to date results
*	TODO: optional perf mode.
*/

import { sha1 } from "./interface/sha1";

class RenderCache {
	
	/* module variables */
	private _storage: any = new Map();
	private _timestamp: any = new Map();
	
	/* perormance module and variables */
	private readonly CACHEWRITE: string = "CacheWrite";
	private readonly CACHEREAD: string = "CacheRead";
	private perf: any;
	
	constructor(perf:any) {
		
		console.log("CACHE::STARTING");
		console.group();
		
		/* Performance Parameters declarations */
		this.perf = perf;
		perf.registerParameter(this.CACHEREAD);
		perf.registerParameter(this.CACHEWRITE);
		
		console.groupEnd();
		
	}
	
	/* write an new or updated entry to the map */
	write(shahex: sha1, value: any) {
		
		let writeStatus = false;
		
		this._storage.set(shahex, value);
		
		this._timestamp.set(shahex, Date.now());
		
		this.perf.hit(this.CACHEWRITE);
		
	}
	
	/* return the value from a entry on the map */
	read(shahex: sha1) {
		
		let cacheObj =  {
			cue: {},
			timestamp: -1
		};
		
		cacheObj.cue = this._storage.get(shahex);
		
		cacheObj.timestamp = this._timestamp.get(shahex);
		
		this.perf.hit(this.CACHEREAD);
		
		return cacheObj;
		
	}
	
}

export = RenderCache;