/*----------------------------------------------------------------\
|	Small kernel like software to manage load and routine execution.
|	Functions can be added as a routine or job. 
|	Routines execution is attempted at the set interval. 
|	( There is no garuntee on timely execution if the thread gets blocked).
|	Jobs are executed if there is low routine utilization.
|	Jobs will also have options for urgent and fast status.
|	URGENT = Execute immediately even if it blocks the thread. 
|	FAST = execution time should be short. ( fast jobs will be grouped )
\----------------------------------------------------------------*/

// NOTE: account for routine call time in timeouts. 
// TODO: add option to make routines permenant and not able to be removed.
// TODO: convert sort to handle number values instead of default unicode sort.
// TODO: implement configurable cycle timer. (on the fly?) 
// TODO: add support for cycle timers above 1000ms.
// TODO: implement cycle load functionality. if load is high do not do jobs. 

import { Logger } from "./logger";
import events = require('events');

class MiniKernel {
	
	// import
	static log:any;
	static emitter:any;
	
	// routine execution variables.
	static routineMap:any = new Map();
	static routineSortMap:any = new Map();
	static routineExecTimeStart:number = 0;
	static routineExecTimeDiff:number = 0;
	static routineTimerStart:number = 0;
	static routineTimerCallToCall:number = 0;
	static routineTimeModifier:number = 0;
	static lastDefaultRank:number = -1;
	
	// constants 
	static readonly DEFAULT_RANK:number = 1000;
	static readonly CYCLE_FIRE:string = "CYCLEFIRE";
	
	// default settings
	static timerTarget:number = 100;
	
	
	constructor(targetRate?:number) {
		
		// set the default rank as the last default rank used.
		MiniKernel.lastDefaultRank = MiniKernel.DEFAULT_RANK;
		
		// initialize the logging module.
		// this logging instance is only for the kernal itself.
		MiniKernel.log = new Logger("KERNEL");
		MiniKernel.log.setVerbose();
		// MiniKernel.log.setDebug();
		MiniKernel.log.v("LoggingModule", "STARTED");
		
		// set refresh rate.
		if(typeof targetRate === "number") {
			MiniKernel.timerTarget = Math.floor(1000/targetRate);
			MiniKernel.log.v("RateSet", MiniKernel.timerTarget);
		}
		
		// initialize event emitter.
		MiniKernel.emitter = new events.EventEmitter()
		MiniKernel.log.v("EventModule", "STARTED");
		
		// register the event the fires all the routines. 
		MiniKernel.emitter.on(MiniKernel.CYCLE_FIRE, MiniKernel.fireRoutines);
		
		// start the internal routine execution system.
		// this system is not perfect and gives no promise of accuracy.
		// works best with workloads comprised of quick function calls. 
		// any syncrous blocking operations will block a more accurate time call.
		// the event will return info about the time accurancy accuracy.
		MiniKernel.startRoutineTimer();
		MiniKernel.log.v("RoutineTimer", "STARTED");
		
	}
	
	
	// add a task to the queue. these job will be lazyily done. 
	// is the operation blocks the thread 
	addJob(funcCallback:any, fast:boolean, urgent?:boolean) {
		
		// coming soon... 
		
	}
	
	// add a routine that will called each event cycle.
	// rank determines the firing order. 
	// the lower the number the quicker it will be called.
	// if no rank automatically assigned rank above default number. 
	addRoutine(funcCallback:any, rank?:number ) {
		
		// prevent ranks being overwritten. 
		if(MiniKernel.routineMap.has(rank)) {
			
			MiniKernel.log.v("AddRoutine", "Failed. Rank Already Used");
			
			return false;
			
		}
		
		// divert to default rank number space. 
		if(typeof rank === "undefined" || rank == null) {
			
			// advance the rank counter.
			MiniKernel.lastDefaultRank++;
			
			// set the next available rank from the default space.
			MiniKernel.routineMap.set(MiniKernel.lastDefaultRank, funcCallback);
			
			MiniKernel.log.v("AddRoutineSuccessDefault", 
				"default rank " + MiniKernel.lastDefaultRank.toString());
			
			// sort the routine map so it fires in order.
			MiniKernel.sortRoutines();
			
			// return the rank.
			return MiniKernel.lastDefaultRank;
			
		}
		
		MiniKernel.routineMap.set(rank, funcCallback);
		
		MiniKernel.log.v("AddRoutineSuccess", "rank " + rank);
		
		// sort the routine map so it fires in order.
		MiniKernel.sortRoutines();
		
		return rank;
		
	}
	
	static sortRoutines() {
		
		// debug the input map of routines.
		// MiniKernel.log.d("SortRoutinesSource", MiniKernel.routineMap);
		
		// sort the added routines by rank.
		MiniKernel.routineSortMap = 
			new Map([...MiniKernel.routineMap.entries()].sort());
		
		// debug the returned sorted routine map.
		MiniKernel.log.d("SortRoutinesOutput", MiniKernel.routineSortMap);
		
		return MiniKernel.routineSortMap;
		
	}
	
	removeRoutine(rank) {
		
		if(MiniKernel.routineMap.has(rank)) {
			
			// delete the map entry with matching rank
			MiniKernel.routineMap.delete(rank);
			
			MiniKernel.sortRoutines();
			
			MiniKernel.log.v("RemoveRoutineSuccess", "rank " + rank);
			
		} else {
			
			MiniKernel.log.v("RemoveRoutineNoAction", "rank " + rank);
			
		}
		
	}
	
	
	// fire all the routines in the sorted routine map.
	static fireRoutines(arg1?:any, arg2?:any) {
		
		// store the start time of the routine cycle
		MiniKernel.routineExecTimeStart = Date.now();
		
		// iterate over the routines and execute them
		MiniKernel.routineSortMap.forEach(executeCallback);
		function executeCallback(routineCallback) {
			
			routineCallback(arg1, arg2);
			
		}
		
		// calculate and store execution time. 
		MiniKernel.routineExecTimeDiff = 
			Date.now() - MiniKernel.routineExecTimeStart;
		
		// verbose log the time difference.
		MiniKernel.log.d("RoutineBlockTime", MiniKernel.routineExecTimeDiff);
		
		return MiniKernel.routineExecTimeDiff;
		
	}
	
	
	// start the recursive timeout. 
	// fires the cycle event to trigger all routines to execute. 
	// once called can not be stopped or paused at this time. 
	static startRoutineTimer() {
		
		// execute the timeout recrussive function. 
		timeout();
		
		function timeout() {
			
			// start recursion. 
			setTimeout(timeoutCallback, 
				MiniKernel.timerTarget - MiniKernel.routineTimeModifier);
			
			MiniKernel.routineTimerStart = Date.now();
				
			function timeoutCallback() {
				
				// emit the cycle fire event to trigger routine execution. 
				MiniKernel.emitter.emit(MiniKernel.CYCLE_FIRE, {});
				
				MiniKernel.routineTimerCallToCall = 
					Date.now() - MiniKernel.routineTimerStart;
				
				// development of routine offset system.
				MiniKernel.log.d("RoutineGap", MiniKernel.routineTimerCallToCall);
				MiniKernel.log.d("RoutineAccuracy", 
					MiniKernel.routineTimerCallToCall + " / " + MiniKernel.timerTarget + " : " +
					(MiniKernel.routineTimerCallToCall - MiniKernel.timerTarget));
				
				
				// expemimental. might need to add a configurable flag to use.
				// controls the automatic offsetting. 
				// needs to be able to detect bounce between postive and negative.
				if((MiniKernel.routineTimerCallToCall - MiniKernel.timerTarget) > -50) {
					
					// implement overage amplifier
					MiniKernel.routineTimeModifier += 
						(MiniKernel.routineTimerCallToCall - MiniKernel.timerTarget) * 0.20;
					
					MiniKernel.routineTimeModifier =
						Math.floor(MiniKernel.routineTimeModifier);
					
				}
				
				MiniKernel.log.d("RoutineTimeMod", MiniKernel.routineTimeModifier);
				
				// call parent function to repeat cycle. 
				timeout();
				
			}
			
		}
		
	}
	
}

export { MiniKernel };