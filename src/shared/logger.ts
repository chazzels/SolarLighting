class Logger {
	
	private readonly prefix:string = "_";
	
	private defaultFlag:boolean = true;
	private verboseFlag:boolean = false;
	private debugFlag:boolean = false;
	
	constructor(argPrefix:string) {
		
		this.prefix = argPrefix;
		
	}
	
	public setDefautl(flag:boolean) {
		
		if(typeof flag === "undefined") { flag = true; }
		
		this.defaultFlag = !!flag;
		
	}
	
	public setVerbose(flag:boolean) {
		
		if(typeof flag === "undefined") { flag = true; }
		
		this.verboseFlag = !!flag;
		
	}
	
	public setDebug(flag:boolean) {
		
		if(typeof flag === "undefined") { flag = true; }
		
		this.debugFlag = !!flag;
		
	}
	
	public c(logMessage:string, logData?:any) {
		
		if(this.defaultFlag) {
			
			if(typeof logData === "undefined") { logData = ""; }
			
			console.log(this.prefix+":", logMessage, logData); 
			
		}
		
	}
	
	public v(logMessage:string, logData?:any) {
		
		if(this.verboseFlag) { 
			
			if(typeof logData === "undefined") { logData = ""; }
			
			console.log(this.prefix+"::Verbose:", logMessage, logData); 
			
		}
		
	}
	
	public d(logMessage:string, logData?:any) {
		
		if(this.debugFlag) { 
			
			if(typeof logData === "undefined") { logData = ""; }
			
			console.log(this.prefix+"::Debug:", logMessage, logData); 
			
		}
		
	}
	
	public e(logMessage:String, logData?:any) {
		
		if(typeof logData === "undefined") { logData = ""; }
			
		console.error(this.prefix+"::Error:", logMessage, logData); 
		
	}
	
	public t(logMessage:String, logData?:any) {
		
		if(typeof logData === "undefined") { logData = ""; }
		
		console.trace(this.prefix+"::Trace", logMessage, logData);
		
	}
	
}

export { Logger };