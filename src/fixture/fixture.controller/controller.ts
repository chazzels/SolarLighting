class FixtureController {
	
	private driverClass: any;
	private driver: any;
	private profileName: string = "default";
	
	constructor(option: any) {
		
		console.log("FIXTURE_CONTROLLER::STARTING");
		console.group();
		
		if(option !== undefined) {
			
			if(option.hasOwnProperty('driver') &&
				option.driver !== undefined || option.driver !== null) {
				
				this.profileName = option.driver.toString();
				
			}
			
		}
		
		this.driverLoader(this.profileName, this.driverStart);
		
		console.groupEnd();
		
	}
	
	private driverLoader(profileName: any, callback: any) {
		
		let that = this;
		
		let success = false;
		
		console.log("FIXTURE_CONTROLLER::LOAD_DRIVER:", profileName);
		
		if(profileName === "pca9685") {
			
			this.driverClass = require("./driver-pca9685");
			
			success = true;
			
		} else if(profileName === "dummy" || profileName === "default") {
			
			this.driverClass = require("./driver-dummy");
			
			success = true;
			
		} else {
			
			console.log("FIXTURE_CONTROLLER::LOAD_FAIL:", profileName);
			
		}
		
		if(success) {
			
			callback(that);
			
		}
		
	}
	
	private driverStart(that: any) {
		
		that.driver = new that.driverClass();
		
	}
	
}

export = FixtureController;