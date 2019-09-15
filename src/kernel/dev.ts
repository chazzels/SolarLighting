import { MiniKernel } from "./kernel";

class SolarKernel {
	
	private kernel:any;
	
	constructor() {
		
		this.kernel = new MiniKernel();
		
		this.kernel.addRoutine(this.foo, 20);
		this.kernel.addRoutine(this.bar, 30);
		this.kernel.addRoutine(this.blah, 10);
		
	}
	
	private blah() { console.log('a'); }
	
	private foo() { console.log('b'); }
	
	private bar() { console.log('c'); }
	
}


var kernel = new SolarKernel();