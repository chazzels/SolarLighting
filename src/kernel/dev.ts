import { MiniKernel } from "./kernel";

class SolarKernel {
	
	private kernel:any;
	
	constructor() {
		
		this.kernel = new MiniKernel();
		
		this.kernel.addRoutine(this.blah);
		
		
		this.kernel.emit();
		
	}
	
	private blah() {
		
		console.log('this is blah');
		
	}
	
	
}


var kernel = new SolarKernel();