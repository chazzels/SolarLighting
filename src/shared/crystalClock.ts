/*
*	A library to create basic timers. 
*	TODO add a target offset counter that will attmept to shorten the loop to combat running out of sync.
*	TODO make variable timerTarget configurable for on-the-fly tweaking - maybe profile loader(?).
*	TODO set refresh based on desired number of updates per second.
*/
class CrystalClock {
	
	private timerTarget: number = 1000;
	private targetRefrashRate: number = -1;
	private onUpdateArray: any = [];
	private onUpdateContext: any = [];
	
	private callback: any;
	
	constructor(delay: number, argCallback?: any) {
		
		this.timerTarget = delay;
		
		this.targetRefrashRate = Math.floor(1000 / delay)
		
		if(typeof argCallback === "function") {
		
			this.callback = argCallback;
		
		} else {
			
			this.callback = null;
			
		}
		
		this.startTimer();
		
	}
	
	onUpdate(callback: any, context: any) {
		
		if(typeof callback === "function") {
			
			this.onUpdateArray.push(callback);
			
		}
		
		this.onUpdateContext.push(context);
		
	}
	
	private startTimer() {
		
		let that = this;
		
		let timerTarget = this.timerTarget;
		
		let callback = this.callback;
		
		timeout();
		
		function timeout() {
			
			let start = Date.now();
			
			setTimeout(function timeoutCallback() {
				
				if(typeof callback === "function") {
				
					callback();
				
				}
				
				that.fireOnUpdate();
				
				timeout();
				
			}, timerTarget);
			
		}
	
	}
	
	private fireOnUpdate() {
		
		let length = this.onUpdateArray.length;
		
		for(let i = 0; i < length; i++) {
			
			this.onUpdateArray[i](this.onUpdateContext[i]);
			
		}
		
	}
	
}

export { CrystalClock };