import { MiniKernel } from "./kernel";

class SolarKernel {
	
	private kernel:any;
	
	constructor() {
		
		this.kernel = new MiniKernel(4);
		
		this.kernel.addRoutine(this.foo, 4);
		this.kernel.addRoutine(this.bar, 3);
		this.kernel.addRoutine(this.blah, 2);
		
		this.kernel.addRoutine(function newlinesep() {
			
			console.log('------------------------------');
			
		}, 1);
		
	}
	
	private blah() { 
		for(let i;i< 20000000;i++) {
			i++;
		} 
		
	}
	
	private foo() { 
		let i,a=10;
		for(let i;i< 2000000;i++) {
			a+=10;
		}
	}
	
	private bar() { 
		let a="";
		for(let i = 0;i < 2000000;i++) {
			a+="Hi!";
		} 
	}
	
}

export = { SolarKernel };

//var kernel = new SolarKernel();