/*
*	module to track data about connected websockets.
*	TODO: implement adding of client metadata.
*/

class ClientMeta {
	
	private clientsKeys: any = []; 
	private clients: any = new Map();
	
	private perf: any;
	
	constructor(perf?: any) {
		
		this.perf = perf;;
		
	}
	
	/* TODO: Finish the functionality of this function. */
	/* update the clientsKeys array with new active socket keys. */
	/* @param {array} manifest - sha1 keys array that pair with live sockets*/
	updateKeys(manifest: any) {
		
		this.clientsKeys = manifest;
		
	}
	
}

export = ClientMeta;