/*
*	modue to composite a final style for a fixture to use.
*	uses fixture attributes to layer a final composite style of all the highest 
*	property values from home value (typically 0).
*/
class StyleCompositor {
	
	constructor(options:any, perf:any) {
		
		this._pre_constructor();
		
		this._post_constructor();
		
	}
	
	
	
	private _pre_constructor() {
		
		console.log("COMPOSITOR::STARTING");
		
		console.group();
		
	}
	
	private _post_constructor() {
		
		console.groupEnd();
		
	}
	
}

export = StyleCompositor;