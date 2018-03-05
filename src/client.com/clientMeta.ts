class ClientMeta {
	
	private clientKeys: any = []; 
	private clients: any = new Map();
	
	private perf: any;
	
	constructor(perf?: any) {
		
		this.perf = perf;;
		
	}
	
	updateKeys(manifest: any) {
		
		this.clientKeys = manifest;
	}
	
}

export = ClientMeta;