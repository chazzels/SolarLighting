/*
*	module to track data about connected websockets.
*/

class ClientMeta {
	
	private clientsKeys: any = []; 
	private clients: any = new Map();
	
	private perf: any;
	
	constructor(perf?: any) {
		
		this.perf = perf;;
		
	}
	
	/* update the clientsKeys array with new active socket keys. */
	/* @param {array} manifest - sha1 keys array that pair with live sockets*/
	updateKeys(manifest: any) {
		
		this.clientsKeys = manifest;
		
	}
	
}

export = ClientMeta;