class ClientMeta {
	
	private clientKeys: any = []; 
	
	constructor() {
		
	}
	
	updateKeys(manifest: any) {
		
		this.clientKeys = manifest;
		
	}
	
}

export = ClientMeta;