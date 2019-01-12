/*
*
*/

import { sha1 } from "./interface/sha1";

class AssetRank {
	
	private first:boolean = true;
	
	constructor(options: any, perf: any) {
		
		
		
	}
	
	
	/* parse a target query string into a target object.  */
	/* @param {string} qryStr - a string containing targetting  */
	queryTargets(qryStr: string) {
		
		return this._parseTargetQuery(qryStr);
		
	}
	
	/* start to parse a query target string. */
	/* @param {string} qryStr - a string containing targetting  */
	private _parseTargetQuery(qryStr:string) {
		
		// create object with some parameters to guide parsing.
		let qryInfo = {
			sourceQuery: qryStr,
			query: qryStr.trim().split(" ")[0],
			maxRank: 0,
			deviceIndex: qryStr.indexOf('@'),
			deviceCheck: (qryStr.indexOf('@') >= 0),
			deviceValid: false,
			idIndex: qryStr.indexOf('#'),
			idCheck: (qryStr.indexOf('#') >= 0),
			idValid: false,
			classIndex: qryStr.indexOf('.'),
			classCheck: (qryStr.indexOf('.') >= 0),
			classValid: false
		}
		
		let targetObj = {
			device: null,
			id: null,
			class: null,
			maxRank: 0
		};
		
		this._validateQuery(qryInfo);
		
		if( (qryInfo.deviceValid || !qryInfo.deviceCheck) 
			&& (qryInfo.idValid || !qryInfo.idCheck) 
			&& (qryInfo.classValid || !qryInfo.classCheck)) {
			
			this._parseDevice(qryInfo, targetObj);
			
			this._parseId(qryInfo, targetObj);
			
			this._parseClasses(qryInfo, targetObj);
			
			targetObj.maxRank = qryInfo.maxRank;
			
		} else {
			
			console.log('MANAGER::TARGET_QUERY: query failed to be validated.');
			
		}
		
		return targetObj;
		
	}
	
	/* validates the info generated about a target query is valid. */
	/* uses some simple string checks to figure out roughly the contents. */
	/* @param {any} qryInfo - information about the target query. generated by _validateQuery. */
	/* @param {any} targetObj - an object to store results in about the target query. */
	private _validateQuery(qryInfo:any) {
		
		if(qryInfo.deviceCheck || qryInfo.idCheck || qryInfo.classCheck) {
			
			// validate the device target structure.
			if(qryInfo.deviceCheck) {
				if(qryInfo.idCheck) {
					if(qryInfo.deviceIndex <= qryInfo.idIndex) {
						qryInfo.deviceValid = true;
					}
				} else if(qryInfo.classCheck) {
					if(qryInfo.deviceIndex <= qryInfo.classIndex) {
						qryInfo.deviceValid = true;
					}
				} else if(!qryInfo.idCheck && !qryInfo.classCheck){
					if(qryInfo.deviceIndex >= 0) {
						qryInfo.deviceValid = true;
					}
				}
			}
			
			// validate the id target structure.
			if(qryInfo.idCheck) {
				if(qryInfo.classCheck) {
					if(qryInfo.idIndex <= qryInfo.classIndex) {
						qryInfo.idValid = true;
					}
				} else if(!qryInfo.deviceCheck && !qryInfo.classCheck) {
					if(qryInfo.idIndex >= 0) {
						qryInfo.idValid = true;
					}
				}
			}
			
			// validate the class target structure.
			if(qryInfo.classCheck) {
				if(qryInfo.classIndex >= qryInfo.deviceIndex && qryInfo.classIndex >= qryInfo.idIndex) {
					qryInfo.classValid = true;
				}
			}
			
		}
		
	}
	
	/* parse out the device type of the target query. */
	/* @param {any} qryInfo - information about the target query. generated by _validateQuery. */
	/* @param {any} targetObj - an object to store results in about the target query. */
	private _parseDevice(qryInfo: any, targetObj: any) {
		
		if(qryInfo.deviceCheck && qryInfo.deviceValid) {
			
			if(qryInfo.idCheck) {
				
				targetObj.device = qryInfo.query.slice(0, qryInfo.idIndex);
				
				qryInfo.maxRank += 10;
				
				qryInfo.query = qryInfo.query.slice(qryInfo.idIndex, qryInfo.query.length);
				
			}
			
			if(qryInfo.classCheck && !qryInfo.idCheck) {
				
				targetObj.device = qryInfo.query.slice(0, qryInfo.classIndex);
				
				qryInfo.maxRank += 10;
				
				qryInfo.query = qryInfo.query.slice(qryInfo.classIndex, qryInfo.query.length);
				
			} 
			
			if(!qryInfo.classCheck && !qryInfo.idCheck) {
				
				targetObj.device = qryInfo.query;
				
				qryInfo.maxRank += 10;
				
			}
			
		}
		
	}
	
	/* parse out the ID of the target query. */
	/* @param {any} qryInfo - information about the target query. generated by _validateQuery. */
	/* @param {any} targetObj - an object to store results in about the target query. */
	private _parseId(qryInfo: any, targetObj: any) {
		
		// parse id target
		if(qryInfo.idCheck && qryInfo.idValid) {
			
			qryInfo.idIndex = qryInfo.query.indexOf('#');
			qryInfo.classIndex = qryInfo.query.indexOf('.');
			
			if(qryInfo.classCheck) {
				
				targetObj.id = qryInfo.query.slice(0, qryInfo.classIndex);
				
				qryInfo.maxRank += 100;
				
				qryInfo.query = qryInfo.query.slice(qryInfo.classIndex, qryInfo.query.length);
				
			}
			
			if(!qryInfo.deviceCheck && !qryInfo.classCheck) {
				
				targetObj.id = qryInfo.query;
				
				qryInfo.maxRank += 100;
				
			}
			
		}
		
	}
	
	/* parse out the classes of the target query. */
	/* @param {any} qryInfo - information about the target query. generated by _validateQuery. */
	/* @param {any} targetObj - an object to store results in about the target query. */
	private _parseClasses(qryInfo: any, targetObj: any) {
		
		if(qryInfo.classCheck && qryInfo.classValid) {
			
			targetObj.class = qryInfo.query.split('.').slice(1);
			
			qryInfo.maxRank += targetObj.class.length;
			
		}
		
	}
	
	
}

export = AssetRank;