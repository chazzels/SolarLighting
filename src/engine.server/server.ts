/*
*	websocket server to distrubute styling data. 
*/

import { sha1 } from "./interface/sha1";

import { WebSocketServer } from "./websocketServer";
import { ClientMeta }  from "./clientMeta";

class ControllerCom {
	
	/* module flags */
	private readonly VERBOSE: boolean = false;
	private readonly VERBOSE_BOOT: boolean = false;
	
	/* module variables */
	private static server: any;
	private static meta: any;
	
	/* module constants */
	private readonly REFRESH_RESOLUTION: number = 100;
	
	constructor(options: any) {
		
		console.log("ENGINE_SERVER::STARTING");
		
		console.group();
		
		// websocket server initialization.
		ControllerCom.server = new WebSocketServer(options);
		
		// initializing the client meta data tracker.
		ControllerCom.meta = new ClientMeta(options);
		
		ControllerCom.registerServerEventHandlers();
		
		console.groupEnd();
		
	}
	
	private  static registerServerEventHandlers() {
		
		// register a manifest change event to update the meta module.
		// TODO: add interfaces for socketManifestChangeHandler arguments.
		ControllerCom.server.registerHandler('socketManifestChange', socketManifestChangeHandler);
		function socketManifestChangeHandler(manifest) {
			
			ControllerCom.meta.setSocketManifest(manifest);
			
		};
		
		// register socket connection event to add the client to the meta module.
		// TODO: add interfaces for socketConnectionHandler arguments.
		ControllerCom.server.registerHandler('socketConnection', socketConnectionHandler);
		function socketConnectionHandler(key, clientId) {
			
			ControllerCom.meta.registerSocket(key, clientId);
			
		};
		
	}
	
}

export { ControllerCom };