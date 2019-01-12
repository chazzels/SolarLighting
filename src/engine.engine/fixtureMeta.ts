/*
*	module to collect a current manifest of connected fixture attributes.
*	dead assets can be detect and prevent unneeded calculations.
*	NOTE: the playhead module also generates a active manifest used to skip inactive assets. this could be a second filter to that.
*/

class fixtureMeta {
	
	static deviceAttributeMap: any = new Map();
	static idAttributeMap: any = new Map();
	static classAttributeMap: any = new Map();
	
	constructor() {
		
		
		
	}
	
	/* check if device is in the device attribute pool */
	checkDevice(argDevice: string) {
		
	}
	
	/* check if id is in the id attribute pool*/
	checkId(argId: string) {
		
	}
	
	/* check if class is in the class attribute pool*/
	checkClass(argClass: string) {
		
	}
	
	/* regenerates the poll from an array of client meta data. */
	private _rebuildPool(clientsMetaArray: any) {
		
	} 
	
}

export = fixtureMeta;