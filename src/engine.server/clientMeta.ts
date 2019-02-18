/*
*	module to track data about connected websockets.
*	TODO: implement adding of client metadata.
*/

import { sha1 } from "./interface/sha1";

class ClientMeta {
	
	/* module options flags */
	private readonly VERBOSE: boolean = false;
	private readonly VERBOSE_BOOT: boolean = true;
	
	/* module variables */
	private clientsKeys: any = []; 
	private clients: any = new Map();
	
	/* performance private members. */
	private perf: any;
	
	constructor(perf?: any) {
		
		this.perf = perf;;
		
	}
	
	/* update the clientsKeys array with new active socket identifier keys. */
	/* @param {array} manifest - sha1 keys array that map to active sockets */
	setSocketManifest(manifest: any) {
		
		this.clientsKeys = manifest;
		
	}
	
	/* registers a new client entry in the map with meta data. */
	/* @param {sha1} key - sha1 key identifying a socket connection */
	/* @param {any} meta - object containing the attributes of the client. */
	registerSocket(key: sha1, meta: any) {
		
		this.clients.set(key, meta);
		
	}
	
	/* modifies an client entry with update meta data. */
	/* @param {sha1} key - sha1 key identifying a socket connection */
	/* @param {any} meta - object containing the attributes of the client. */
	modifySocket(key: sha1, meta: any) {
		
		this.clients.set(key, meta);
		
	}
	
}

export { ClientMeta };