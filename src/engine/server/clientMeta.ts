/*
*	module to track data about connected websockets.
*	TODO: implement adding of client metadata.
*/

import { sha1 } from "./interface/sha1";
import { fixtureTarget } from "../engine/interface/fixtureTarget";

class ClientMeta {
	
	/* module options flags */
	private static readonly VERBOSE: boolean = false;
	private static readonly VERBOSE_BOOT: boolean = true;
	
	/* module variables */
	private static clientsKeys: any = []; 
	private static clients: any = new Map();
	
	/* performance private members. */
	private perf: any;
	
	constructor(perf?: any) {
		
		this.perf = perf;
		
	}
	
	/* update the clientsKeys array with new active socket identifier keys. */
	/* @param {array} manifest - sha1 keys array that map to active sockets */
	setManifest(manifest: any) {
		
		ClientMeta.clientsKeys = manifest;
		
	}
	
	/* registers a new client entry in the map with meta data. */
	/* @param {sha1} key - sha1 key identifying a socket connection */
	/* @param {any} meta - object containing the attributes of the client. */
	registerMeta(key: sha1, meta: fixtureTarget) {
		
		// hard coding a set meta value.
		meta = {
			device: null,
			id: null,
			class: ["wash"],
			maxRank: 0
		};
		
		ClientMeta.clients.set(key, meta);
		
	}
	
	/* modifies an client entry with update meta data. */
	/* @param {sha1} key - sha1 key identifying a socket connection */
	/* @param {any} meta - object containing the attributes of the client. */
	modifyMeta(key: sha1, meta: fixtureTarget) {
		
		ClientMeta.clients.set(key, meta);
		
	}
	
	/* reads the client data and returns it. */
	/* @param {sha1} key - sha1 key identifying a socket connection */
	getMeta(key: sha1): fixtureTarget {
		
		return ClientMeta.clients.get(key);
		
	}
	
}

export { ClientMeta };