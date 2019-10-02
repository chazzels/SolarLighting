class SolarFixture {
	
	/* module version info */
	readonly majorVersion: number = 0;
	readonly minorversion: number = 0;
	readonly revisionVersion: number = 1;
	readonly releaseType: string = "a";
	
	/* imported modules */
	private FixtureClient: any = require("./fixture.client/client");
	private FixutreController: any = require("./fixture.controller/controller");
	
	/* module variables */
	private client: any;
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    private controller: any;
	
	constructor(option: any, callback?: any) {
		
		let fixtureStartTime = Date.now();
		
		console.log("------------------------------");
		
		console.log(this.version());
		
		console.log("------------------------------");
		
		//console.group();
		
		this.controller = new this.FixutreController(option.controller);
		
		this.client = new this.FixtureClient(option.client);
		
		//console.groupEnd();
		
		console.log("------------------------------");
		
		console.log("Start Up Time:", Date.now() - fixtureStartTime, "ms");
		
		console.log("------------------------------");
		
	}
	
	/* log the application name and the current version */
	version(): string {
		
		let version = "Solar Fixture v"
			+ this.majorVersion.toString() + "."
			+ this.majorVersion.toString() + "."
			+ this.revisionVersion.toString()
			+ this.releaseType;
		
		return version;
		
	}
	
}

export = SolarFixture;