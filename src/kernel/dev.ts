import { Kernel } from "./kernel";

class SolarKernel {
	
	private kernel:any;
	
	constructor() {
		
		this.kernel = new Kernel();
		
		this.kernel.addRoutine();
		
	}
	
}


var kernel = new SolarKernel();