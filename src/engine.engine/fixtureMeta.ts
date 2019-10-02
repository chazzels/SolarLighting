/*
*	module to collect a current manifest of connected fixture attributes.
*	dead assets can be detect and prevent unneeded calculations.
*	NOTE: the playhead module also generates an active manifest used to skip inactive assets. this could be a second filter to that.
*/

import { sha1 } from "./interface/sha1";
import { fixtureTarget } from "./interface/fixtureTarget";

class FixtureMeta {
	
	/* module options flags */
	private static readonly VERBOSE: boolean = false;
	private static readonly VERBOSE_BOOT: boolean = true;
	
	/* module variables */
	private static clientsKeys: any = []; 
	private static clients: any = new Map();
	
	static deviceAttributeMap: any = new Map();
	static idAttributeMap: any = new Map();
	static classAttributeMap: any = new Map();
	
	constructor(options?:any) {
		
		
		
	}
	
	registerFixture(key: sha1, deviceId: string) {
		
		console.log(deviceId);
		
		FixtureMeta.clients.set(key, deviceId);
		
	}
	
	getMeta(key: sha1) {
		
		return FixtureMeta.clients.get(key);
		
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

export { FixtureMeta };