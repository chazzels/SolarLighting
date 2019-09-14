/*----------------------------------------------------------------\
|	IN DEVELOPMENT!
|	A system to manage lower level setting and schedule.
\----------------------------------------------------------------*/
// TODO: create interface for the log tool.

import { Logger } from "./logger";

import events = require('events');

class Kernel {
	
	// import
	static log:any;
	
	//default settings
	static targetMillisecondRefresh:number = 30;
	
	// refresh clock
	private timerTarget: number = 1000;
	
	// event system
	private emitter:any;
	
	constructor() {
		
		// this.targetRefrashRate = Math.floor(1000 / delay);
		
		// initialize the logging class
		Kernel.log = new Logger("Kernal");
		Kernel.log.setVerbose();
		Kernel.log.v('LoggingModule', "STARTED");
		
		// enable event emitter
		this.emitter = new events.EventEmitter()
		Kernel.log.v("EventModule", "STARTED");
		
		// start the internal timeout system.
		// this system is not perfect and givevs no promis of accuracy.
		// works best with workloads quick function calls. 
		// any syncrous blocking operations will block an accurate time call.
		// the event will return info about the time accurancy accuracy.
		this.startTimer();
		
		Kernel.log.v('STARTED');
		
	}
	
	
	// add a task to the queue. these task will be lazyily done. 
	// is the operation blocks the thread 
	addTask(funcCallback:any, urgent?:boolean) {
		
		
		
	}
	
	// add a routine that will called each event cycle.
	public addRoutine(funcCallback:any, rank?:boolean ) {
		
		
		
	}
	
	
	// start the recursive timeout. 
	private startTimer() {
		
		let that = this;
		
		let timerTarget = this.timerTarget;
		
		let callback; // = this.callback;
		
		timeout();
		
		function timeout() {
			
			let start = Date.now();
			
			// start recursion. 
			setTimeout(timeoutCallback, timerTarget);
				
			function timeoutCallback() {
				
				if(typeof callback === "function") {
				
					callback();
				
				}
				
				//that.fireOnUpdate();
				
				timeout();
				
			}
			
		}
		
	}
	
}

export { Kernel };