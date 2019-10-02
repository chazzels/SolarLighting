/*
*	module for connection to a websocket server via a browser.
*/

class WebSocketBrowserClient {
	
	/* websocket variables */
	private WebSocket: any;
	private ws: any;
	
	/* option variables */
	private SERVER_ADDRESS: string = "ws://127.0.0.1:80/";
	
	constructor(option: any) {
		
	}
	
}

export = WebSocketBrowserClient;