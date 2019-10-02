/*
*	Module for connecting to a websocket server from a nodejs application.
*	TODO: add message relay functionality for other use cases.
*	TODO: implement reconnect wait period increase after failed connection to prevent client DDOS.
*/

import * as Events from "events";
import * as WebSocket from "ws";

class WebSocketNodeClient {
	
	/* websocket variables */
	private static ws: any;
	private static connectionActive: boolean = false;
	private static messageCallback: any = null;
	
	/* module variables */
	private static clientId: string = "1234-5678-90AB";
	private static RECONNECT_ATTEMPTS: number = 0;
	
	/* option variables */
	private static SERVER_ADDRESS: string = "ws://127.0.0.1:80/";
	
	/* status variables */
	private static connected: boolean = false;
	private static attempting: boolean = false;
	private static timerActive: boolean = false;
	
	/* constant variables */
	private static readonly RECONNECT_WAIT: number = 2000;
	
	constructor(targetAddress: string) {
		
		console.log("SOCKET_CLIENT::STARTING");
		
		// set target address passed into the constructor.
		if(targetAddress !== undefined && targetAddress !== null) {
			
			WebSocketNodeClient.SERVER_ADDRESS = targetAddress;
			
		}
		
		WebSocketNodeClient.attemptConnection();
		
	}
	
	// TODO: replace with event emitter. 
	registerMessageListener(callback: any) {
		
		if(typeof callback === "function") {
			
			WebSocketNodeClient.messageCallback = callback;
			
		} else {
			
			console.log("SOCKET_CLIENT::MESSAGE_LISTENER:",
				"object passed is not a function.")
			
		}
		
	}
	
	/* start the connection monitor */
	private static startMonitor() {
		
		if(WebSocketNodeClient.timerActive === false) { 
			
			console.log("SOCKET_CLIENT::MONITOR_STARTING");
			
			WebSocketNodeClient.connectionMonitorTimer();
			
			WebSocketNodeClient.timerActive = true;
			
		} else {
			
			console.log("SOCKET_CLIENT::MONITOR_RUNNING");
			
		}
		
	}
	
	/* repeated timeout to continually monitor connection status. */
	private static connectionMonitorTimer() {
		
		let reconnectTimeout: number = WebSocketNodeClient.RECONNECT_WAIT * WebSocketNodeClient.RECONNECT_ATTEMPTS;
		
		setTimeout(function monitorTick() {
			
			WebSocketNodeClient.connectionMonitor();
			
			WebSocketNodeClient.connectionMonitorTimer();
			
		}, reconnectTimeout);
		
	}
	
	/* loop that checks connection status and attempts to reconnect. */
	/* checks the connection connected and attempting flag. */
	private static connectionMonitor() {
		
		if(WebSocketNodeClient.connected === false 
			&& WebSocketNodeClient.attempting === false) {
			
			WebSocketNodeClient.attemptConnection();
			
		}
		
	}
	
	/* attempt to establish a connection to a websocket server. */
	private static attemptConnection() {
		
		let address = WebSocketNodeClient.SERVER_ADDRESS.toString();
		
		// set attempting flag.
		WebSocketNodeClient.attempting = true;
		
		if(WebSocketNodeClient.connected === false) {
			
			//console.log("SOCKET_CLIENT::CONNECTING", address,
			//	new Date().toTimeString());
			
			WebSocketNodeClient.ws = new WebSocket(address);
			
			WebSocketNodeClient.wsOpen(WebSocketNodeClient.ws);
			
			WebSocketNodeClient.wsMessage(WebSocketNodeClient.ws);
			
			WebSocketNodeClient.wsClose(WebSocketNodeClient.ws);
			
			WebSocketNodeClient.wsError(WebSocketNodeClient.ws);
		
		} else {
			
			console.log("SOCKET_CLIENT::CONNECTION_ACTIVE:", "nothing changed");
			
		}
		
		WebSocketNodeClient.RECONNECT_ATTEMPTS++;
		
	}
	
	/* connection opened event handler for the websocket. */
	private static wsOpen(ws: any) {
		
		ws.on('open', function socketOpen() {
				
				// set status flags.
				WebSocketNodeClient.attempting = false;
				
				WebSocketNodeClient.connected = true;
				
				// start monitor if not already active.
				if(WebSocketNodeClient.timerActive === false) {
					
					WebSocketNodeClient.startMonitor();
					
				}
				
				console.log("SOCKET_CLIENT::CONNECTED", 
					new Date().toTimeString());
				
				WebSocketNodeClient.RECONNECT_ATTEMPTS = 0;
				
			});
			
	}
	
	/* message event handler for the websocket. */
	private static wsMessage(ws: any) {
		
		ws.on('message', function socketMessage(data) {
			
			if(WebSocketNodeClient.messageCallback !== null) {
			// call back must be set.
				
				WebSocketNodeClient.messageCallback(data);
				
			}
			
		});
		
	}
	
	/* close event handler for the websocket. */
	private static wsClose(ws: any) {
		
		ws.on("close", function socketClose(code: any, reason: any) {
				
				// set status flags.
				WebSocketNodeClient.attempting = false;
				
				WebSocketNodeClient.connected = false;
				
				// start monitor if not already active.
				if(WebSocketNodeClient.timerActive === false) {
					
					WebSocketNodeClient.startMonitor();
					
				}
				
			});
			
	}
	
	/* Error event handler for the websocket. */
	private static wsError(ws: any) {
		
		ws.on("error", function socketError(error: any) {
			
			// set human readable error message.
			let message = "default";
			
			if(error.code === "ECONNREFUSED") {
				
				message = "connection refused!";
				
			} else {
				
				message = error.code;
				
			}
			
			// set status flags.
			WebSocketNodeClient.attempting = false;
			
			WebSocketNodeClient.connected = false;
			
			// start monitor if not already active.
			if(WebSocketNodeClient.timerActive === false) {
				
				WebSocketNodeClient.startMonitor();
				
			}
			
			// log the error recieved.
			console.log("SOCKET_CLIENT::CONNECTION_ERROR:", message, 
				new Date().toTimeString());
			
		});
		
	}
	
}

export { WebSocketNodeClient };