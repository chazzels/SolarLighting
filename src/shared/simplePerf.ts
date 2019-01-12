/*
*	simple counter module that dumps the number of counts each second to create some basic metric of your application. 
*	TODO add load notices using outlier data points.
*	TODO rename so that this can be used in other components of this system to help moniter performance.
*	TODO transistion arrays to maps to remove for loops from source code.
*/
class SimplePerf {
	
	/* module flags */
	private readonly VERBOSE: boolean = false;
	
	/* module variables */
	private _parameterNames: any = [];
	private _parameterHit: any = [];
	private _parameterHitMin: any = [];
	private _parameterHitMax: any = [];
	private _parameterTail: any = [];
	private _autoLogIndexes: any = [];
	
	/* the delay between each dump of the hit counters */
	private readonly TIMERDELAY: number = 1000;
	
	/* the length of previous entries that are cached */
	private readonly TAILLENGTH: number = 5;
	
	/* external modules. */
	private Crystal = require("./crystalClock");
	
	constructor(options?: any) {
		
		if(options && options.hasOwnProperty("verbose")) {
			
			this.VERBOSE = options.verbose;
			
		}
		
		let that = this;
		
		let triggerCallback = this.trigger(that)
		
		let crystal = new this.Crystal(1000, triggerCallback);
		
	}
	
	/* trigger function for the crystal timing module. */
	trigger(that: any) {
		
		return function() {
			
			let parameterLength: number = that._parameterNames.length;
			
			for(let i = 0; i < parameterLength; i++) {
				
				that._parameterTail[i].shift();
				
				that._parameterTail[i].push(that._parameterHit[i]);
				
				if(that._parameterHit[i] >= 0 
					&& that._parameterHit[i] < that._parameterHitMin[i]) {
					
					that._parameterHitMin[i] = that._parameterHit[i];
					
				}
				
				if(that._parameterHit[i] > that._parameterHitMax[i]) {
					
					that._parameterHitMax[i] = that._parameterHit[i];
					
				}
				
				that._parameterHit[i] = 0;
				
				//if enabled log the rate of this parameter to the console.
				if(that._autoLogIndexes[i] === 1) {
					
					if(that.VERBOSE) {
						
						console.log(that._parameterNames[i]
						+ " "
						+ that._rateOfIndex(i)
						+ " /second [min: "
						+ that._parameterHitMin[i]
						+ " ][max: "
						+ that._parameterHitMax[i]
						+ " ]");
						
					}
					
				}
			
			}
			
		};
	
	}
	
	/* register a new parameter name to the monitor. */
	registerParameter(name: string) {
		
		let parameterLength: number = this._parameterIndex("name");
		
		if(parameterLength === -1) {
			
			this._parameterNames.push(name);
			
			this._parameterHit.push(0);
			
			this._parameterHitMin.push(1000000);
			
			this._parameterHitMax.push(0);
			
			this._parameterTail.push(new Array(this.TAILLENGTH));
			
			this._autoLogIndexes.push(0);
			
			if(this.VERBOSE) {
				
				console.log("SIMPLEPERF::REGISTER_PARAMETER: " + name);
			
			}
		}

	}
	
	/* automatically log new enteries to the console. */
	autoLog(name: string) {
		
		let targetIndex = this._parameterIndex(name);
		
		if(targetIndex >= 0) {
			
			this._autoLogIndexes[targetIndex] = 1;
			
			return true;
			
		}
		
		return false;
	
	}

	/* increase the hit count of an parameter by one. */
	hit(name: string) {
		
		var start = Date.now();
		
		let nameIndex = this._parameterNames.indexOf(name);
		
		if(nameIndex >= 0) {
			
			this._parameterHit[nameIndex]++;
			
		}
	
	}
	
	/* get the index of a parameter based on its name. */
	private _parameterIndex(name: string) {
		
		let targetIndex: number = -1;
		
		let parameterLength: number = this._parameterNames.length;
		
		for(let i = 0; i < parameterLength; i++) {
			
			if(this._parameterNames[i] === name) {
				
				targetIndex = i;
				
				i = parameterLength + 1;
				
			}
		
		}
		
		return targetIndex;
	
	}
	
	/* get the last logged rate of paramter by name. */
	private _rateOfParameter(name: string) {
		
		let targetIndex = this._parameterIndex(name);
		
		let readIndex = this.TAILLENGTH - 1;
		
		return this._parameterTail[targetIndex][readIndex];
		
	}
	
	/* get the last logged rate of a parameter by index. */
	private _rateOfIndex(targetIndex: number) {
		
		let readIndex = this.TAILLENGTH - 1;
		
		return this._parameterTail[targetIndex][readIndex];
		
	}

}

export = SimplePerf;