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
	
	// routine variables
	static routineMap:any = new Map();
	static routineSortMap:any = new Map();
	static LAST_RANK:number = 1000;
	static readonly DEFAULT_RANK:number = 1000;
	
	//default settings
	static timerTarget:number = 1000;
	static readonly CYCLE_FIRE:string = "CYCLEFIRE";
	
	constructor() {
		
		// initialize the logging module.
		// this logging instance is only for the kernal itself.
		MiniKernel.log = new Logger("Kernel");
		MiniKernel.log.setVerbose();
		// MiniKernel.log.setDebug();
		MiniKernel.log.v('LoggingModule', "STARTED");
		
		// enable event emitter
		MiniKernel.emitter = new events.EventEmitter()
		MiniKernel.emitter.on(MiniKernel.CYCLE_FIRE, MiniKernel.fireRoutines);
		MiniKernel.log.v("EventModule", "STARTED");
		
		// start the internal timeout system.
		// this system is not perfect and givevs no promis of accuracy.
		// works best with workloads quick function calls. 
		// any syncrous blocking operations will block an accurate time call.
		// the event will return info about the time accurancy accuracy.
		MiniKernel.startRoutineTimer();
		MiniKernel.log.v("RoutineTimer", "STARTED");
		
	}
	
	
	// add a task to the queue. these task will be lazyily done. 
	// is the operation blocks the thread 
	addTask(funcCallback:any, urgent?:boolean) {
		
		// coming soon... 
		
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
			
			// advance the rank counter.
			MiniKernel.LAST_RANK++;
			
			// set the next available rank from the default space.
			MiniKernel.routineMap.set(MiniKernel.LAST_RANK, funcCallback);
			
			MiniKernel.log.v("AddRoutineSuccessDefault", 
				"default rank " + MiniKernel.LAST_RANK.toString());
			
			// return the rank.
			return MiniKernel.LAST_RANK;
			
		}
		
		MiniKernel.routineMap.set(rank, funcCallback);
		
		MiniKernel.log.v("AddRoutineSuccess", "rank " + rank);
		
		MiniKernel.sortRoutines();
		
	}
	
	static sortRoutines() {
		
		MiniKernel.log.d("SortRoutinesSource", MiniKernel.routineMap);
		
		// sort the added routines by rank.
		MiniKernel.routineSortMap = 
			new Map([...MiniKernel.routineMap.entries()].sort());
		
		MiniKernel.log.d("SortRoutinesOutput", MiniKernel.routineSortMap);
		
		return MiniKernel.routineSortMap;
		
	}
	
	removeRoutine(rank) {
		
		if(MiniKernel.routineMap.has(rank)) {
			
			MiniKernel.routineMap.delete(rank);
			
			MiniKernel.sortRoutines();
			
			MiniKernel.log.v("RemoveRoutineSuccess", "rank " + rank);
			
		} else {
			
			MiniKernel.log.v("RemoveRoutineNoAction", 
				"rank " + rank);
			
		}
		
	}
	
	
	// fire all the routines/
	static fireRoutines() {
		
		MiniKernel.routineSortMap.forEach(executeCallback);
			
		function executeCallback(routineCallback) {
			
			routineCallback();
			
		}
		
	}
	
	
	// start the recursive timeout. 
	static startRoutineTimer() {
		
		timeout();
		
		function timeout() {
			
			// start recursion. 
			setTimeout(timeoutCallback, MiniKernel.timerTarget);
				
			function timeoutCallback() {
				
				MiniKernel.emitter.emit(MiniKernel.CYCLE_FIRE);
				
				timeout();
				
			}
			
		}
		
	}
	
}

export { MiniKernel };