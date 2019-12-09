/*-----------------------------------------------\
|	Canvas pixel sampling.
|	Probes html canvas for image data.
\-----------------------------------------------*/

var CanvasSampler = function CanvasSamplerConstructor(argContext, argColor) {
	
	let effect = new Effect();
	
	effect.makeParameter('profile', null);
	effect.makeParameter('sampleWidth', 5);
	effect.makeParameter('sampleHeight', 5);
	effect.makeParameter('lastSample', null);
	effect.makeParameter('sampleAreaBorder', 'red');
	
	/*-----------------------------------------------\
	|	Public Functions
	\-----------------------------------------------*/
	
	// public function to sample the canvas with the current profile. 
	function sample(context) {
		
		_runSampling(context);
		
	}
	
	// draw debugging sqaures on the canvas to see sampling areas.
	function showSampleAreas(argColor) {
		
		// TODO: add function to draw on the canvas.
		
	}
	
	// add a sample point to the 
	function addSamplePoint(sx, sy, sw, sh) {
		
		// push a sample point to the profile.
		// update lengths and other parameters.
		
	}
	
	/*-----------------------------------------------\
	|	Private Functions
	\-----------------------------------------------*/
	
	// run a sample on the default profile.
	function _runSampling(context) {
		
		let profile = effect.parameter('profile');
		
		if(profile !== null) {
			
			let sample = _sampleCanvasWithProfile(context, profile);
			
			effect.updateParameter('lastSample', sample);
			
			return sample;
			
		}
		
		return false;
		
	}
	
	// sample on the points on a canvas from a profile.
	function _sampleCanvasWithProfile(context, profile) {
		
		let colorSamples = new Array(profile.length);
		
		for(var i = 0; i < profile.length; i++) {
			
			let sample = _getCanvasData(
				context,
				profile.xPos[i],
				profile.yPos[i],
				profile.width,
				profile.height
			);
			
			colorSamples[i] = sample;
			
		}
		
		return colorSamples;
		
	}
	
	// sample a position on the canvas.
	function _getCanvasData(context, sx, sy, sw, sh) {
		
		let idata = context.getImageData(sx, sy, sw, sh);
		
		let maxColor = new Uint8ClampedArray(4);
		
		let curMax = 0;
		
		let tempMax = 0;
		
		for(var p = 0; p < Math.floor(idata.data.length/4); p++) {
			
			tempMax = idata.data[p*4]
				+ idata.data[p*4+1]
				+ idata.data[p*4+2]
				+ idata.data[p*4+3];
			
			if(tempMax > curMax) {
				
				curMax = tempMax;
				
				maxColor[0] = idata.data[p*4];
				maxColor[1] = idata.data[p*4+1];
				maxColor[2] = idata.data[p*4+2];
				maxColor[3] = idata.data[p*4+3];
				
			}
			
			
		}
		
		return maxColor;
		
	}
	
	
	
	
	
	
	
	
	/*-----------------------------------------------\
	|	Migrated Code 
	\-----------------------------------------------*/
	
	// create a grid profile with equally spaced sample points in a gird layout. 
	// overwrites the existing profile. 
	function _createGridProfile(context, argRows, argColumns, argWidth, argHeight) {
		
		let cWidth = context.canvas.width-argWidth/2;
		let cHeight = context.canvas.height-argHeight/2;
		
		let gapWidth = Math.floor( ((cWidth-argWidth)/(argColumns-1)));
		let gapHeight = Math.floor( ((cHeight-argHeight)/(argRows-1)));
		
		let xPos = new Int32Array(argRows * argColumns);
		let yPos = new Int32Array(argRows * argColumns);
		
		let index = 0
		for(var c = 0; c < argColumns; c++) {
			for(var r = 0; r < argRows; r++) {
				
				index++;
				
				xPos[index] = Math.floor(r*gapWidth);
				
				yPos[index] = Math.floor(c*gapHeight);
				
			}
		}
		
		var profileData = {
			width: argWidth,
			height: argHeight,
			length: xPos.length,
			xPos: xPos,
			yPos: yPos
		}
		
		effect.updateParameter('profile', profileData);
		
		return profileData;
		
	}
	
	/*-----------------------------------------------\
	|	Return Object
	\-----------------------------------------------*/
	
	// return object to chain commands.
	// might not be needed for this module.
	var returnChainObject = {
		sample: sample,
		addSamplePoint: {}
	}
	
	return returnChainObject;
	
}