class pca9685Driver {
	
	/* imported modules */
	private i2cBus = require("i2c-bus");
	private Pca9685Driver = require("pca9685").Pca9685Driver;
	
	/* module variables */
	private pwm: any;
	private i2cActive: boolean = false;
	
	/* module constants */
	private i2cAddress: number = 0x40;
	private i2cFrequency: number = 1000;
	private i2cDebug: boolean = false;
	
	constructor(options: any) {
		
		let that = this;
		
		this.setParameters(options);
		
		// create settings object.
		let settings = {
			i2c: this.i2cBus.openSync(1),
			address: this.i2cAddress,
			frequency: this.i2cFrequency,
			debug: false
		};
		
		// start the driver and connect to the i2cbus.
		this.pwm = new this.Pca9685Driver(settings, function pca9685callback(err: any) {
			
			if (err) {
				
				console.log("DRIVER_PCA9685::CONNECTION_FAILED");
				
				console.error(err);
				
				that.i2cActive = false;
				
			}
			
			that.i2cActive = true;
			
		
		}, that);
		
	}
	
	/* update a channel of this driver. */
	updateChannel() {
		
		if(this.i2cActive) {
			
			
			
		}
		
	}
	
	/* set the values to be passed to the pca9685. */
	private setParameters(options: any) {
		
		if(options === undefined || options === null) {
			
			options = {};
			
		}
		
		if(options.address !== undefined 
			&& options.address !== null) {
				
				this.i2cAddress = options.address;
				
		} else if(options.frequency !== undefined 
			&& options.frequency !== null) {
				
				this.i2cFrequency = options.frequency;
				
		}
		
	}
	
}

export = pca9685Driver;