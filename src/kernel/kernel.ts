/*----------------------------------------------------------------\
|	IN DEVELOPMENT!
|	A system to manage underlying functionality and schedule.
\----------------------------------------------------------------*/
// TODO: create interface for the log tool.
// TODO: create time adjust system that takes increasily more.
// NOTE: account for routine call time in timeouts. 

import { Logger } from "./logger";

import events = require('events');

class MiniKernel {
	
	// import
	static log:any;
	static emitter:any;
	
	//default settings
	static timerTarget: number = 1000;
	
	// routine variables
	static routineMap:any = new Map();
	static routineSortMap:any = new Map();
	static LAST_RANK:number = 1000;
	static readonly DEFAULT_RANK:number = 1000;
	
	// constants
	static readonly CYCLE_FIRE:string = "CYCLEFIRE";
	
	constructor() {
		
		// initialize the logging module.
		// this logging instance is only for the kernal itself.
		MiniKernel.log = new Logger("Kernal");
		MiniKernel.log.setVerbose();
		MiniKernel.log.v('LoggingModule', "STARTED");
		
		// enable event emitter
		MiniKernel.emitter = new events.EventEmitter()
		MiniKernel.emitter.on(MiniKernel.CYCLE_FIRE, this.fireRoutines);
		MiniKernel.log.v("EventModule", "STARTED");
		
		// start the internal timeout system.
		// this system is not perfect and givevs no promis of accuracy.
		// works best with workloads quick function calls. 
		// any syncrous blocking operations will block an accurate time call.
		// the event will return info about the time accurancy accuracy.
		this.startTimer();
		
		MiniKernel.log.v('STARTED');
		
		
	}
	
	
	// add a task to the queue. these task will be lazyily done. 
	// is the operation blocks the thread 
	addTask(funcCallback:any, urgent?:boolean) {
		
		
		
	}
	
	// development.
	// working up to calling this automatically with the timer.
	emit() {
		
		MiniKernel.emitter.emit(MiniKernel.CYCLE_FIRE);
		
	}
	
	// add a routine that will called each event cycle.
	// rank determines the firing order. 
	// the lower the number the quicker it will be called.
	// if no rank automatically assigned rank above default number. 
	addRoutine(funcCallback:any, rank?:number ) {
		
		if(MiniKernel.routineMap.has(rank)) {
			
			MiniKernel.log.v("AddRoutine", "Failed. Rank Already Used");
			
			return false;
			
		}
		
		if(typeof rank === "undefined" || rank == null) {
			
			MiniKernel.LAST_RANK++;
			
			MiniKernel.routineMap.set(MiniKernel.LAST_RANK, funcCallback);
			
		}
		
		MiniKernel.routineSortMap = 
			new Map([...MiniKernel.routineMap.entries()].sort());
			
		MiniKernel.log.c('DEV', MiniKernel.routineSortMap);
		
	}
	
	
	// fire all the routines on a cycle.
	private fireRoutines() {
		
		MiniKernel.routineMap.forEach(function(value) {
			
			MiniKernel.log.c('DEV', value);
			
		});
		
	}
	
	
	// start the recursive timeout. 
	private startTimer() {
		
		let that = this;
		
		let timerTarget = MiniKernel.timerTarget;
		
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

export { MiniKernel };