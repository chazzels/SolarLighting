/*
*	module to abstract/normalize communcation to the websocket server.
*	TODO: implement browser / node detection to select which client moddule to use.
*/

import * as fs from 'fs';
import * as Events from "events";

import { WebSocketNodeClient } from "./websocketNodeClient";

class FixtureClient {
	
	/* imported modules */
	private static events: any = new Events();
	
	/* module variables */
	private client: any;
	private deviceID: string;
	
	constructor(option: any) {
		
		console.log("FIXTURE_CLIENT::STARTING");
		console.group();
		
		this.deviceID = fs.readFileSync("/var/lib/dbus/machine-id","utf8");
		
		this.deviceID = this.deviceID.trim();
		
		console.log(this.deviceID);
		
		this.client = new WebSocketNodeClient(option.serverAddress);
		
		this.client.registerMessageListener(FixtureClient.onMessage);
		
		console.groupEnd();
		
	}
	
	private static onMessage(data:any) {
		
		console.log(data);
		
	}
	
}

export = FixtureClient;