/*-----------------------------------------------\
|	Canvas pixel sampling.
|	Probes html canvas for image data.
\-----------------------------------------------*/

var CanvasSampler = function CanvasSamplerConstructor(argContext) {
	
	let effect = new Effect();
	
	effect.makeParameter('profile', null)
		.makeParameter('mode', 'brightest')
		.makeParameter('width', 5)
		.makeParameter('height', 5)
		.makeParameter('sample', null)
		.makeParameter('sampleAreaBorder', 'red');
	
	/*-----------------------------------------------\
	|	Public Functions
	\-----------------------------------------------*/
	
	// public function to sample the canvas with the current profile. 
	function sample(context) {
		
		_runSampling(context);
		
	}
	
	// get the latest sampling resutls.
	function getResults() {
		
		return effect.parameter('sample');
		
	}
	
	// add a sample point to the 
	function addSamplePoint(sx, sy, sw, sh) {
		
		// push a sample point to the profile.
		// update lengths and other parameters.
		let profile = effect.parameter('profile');
		
		if(profile === null) {
			
			console.log('profile is not set. exitting.');
			return false;
			
		}
		
	}
	
	// create a grid profile with equally spaced sample points in a gird layout. 
	// overwrites the existing profile. 
	function createSampleGrid(context, argRows, argColumns) {
		
		let cWidth = context.canvas.width;
		let cHeight = context.canvas.height;
		let gapWidth = Math.floor(((cWidth)/(argColumns)));
		let gapHeight = Math.floor(((cHeight)/(argRows)));
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
		
		let profileData = {
			length: xPos.length,
			xPos: xPos,
			yPos: yPos
		}
		
		effect.updateParameter('profile', profileData);
		
		return
		
	}
	
	// draw debugging sqaures on the canvas to see sampling areas.
	function showSampleAreas(context) {
		
		// TODO: add function to draw on the canvas.
		let sample = effect.parameter('sample'),
			profile = effect.parameter('profile');
		
		for(let i = 0; i < sample.length; i++) {
			
			sample[i];
			
			context.beginPath();
			
			context.lineWidth = 1;
			context.strokeStyle = effect.parameter('sampleAreaBorder');
			
			context.rect(
				profile.xPos[i],
				profile.yPos[i], 
				effect.parameter('height'), 
				effect.parameter('width'));
			
			context.stroke();
			
			context.closePath();
			
		}
		
	}
	
	/*-----------------------------------------------\
	|	Private Functions
	\-----------------------------------------------*/
	
	// run a sample on the default profile.
	function _runSampling(context) {
		
		let profile = effect.parameter('profile');
		
		if(profile !== null) {
			
			effect.updateParameter('sample', _sampleCanvasWithProfile(context, profile));
			
		}
		
		return
		
	}
	
	// sample on the points on a canvas from a profile.
	function _sampleCanvasWithProfile(context, profile) {
		
		let colorSamples = new Array(profile.length);
		
		for(var i = 0; i < profile.length; i++) {
			
			colorSamples[i] = _getCanvasImageData(
				context,
				profile.xPos[i],
				profile.yPos[i],
				effect.parameter('width'),
				effect.parameter('height')
			);
			
		}
		
		return colorSamples;
		
	}
	
	// sample an area on the canvas.
	function _getCanvasImageData(context, sx, sy, sw, sh) {
		
		let imageData = context.getImageData(sx, sy, sw, sh);
		
		if(effect.parameter('mode') === 'brightest') {
			return _pixelBrightest(imageData);
		}
		
		if(effect.parameter('mode') === 'major') {
			return _pixelMajor(imageData);
		}
		
		return false;
		
	}
	
	// returns the brightest combined value from canvas image data.
	function _pixelBrightest(imageData) {
		
		let maxColor = new Uint8ClampedArray(4),
			curMax = 0,
			tempMax = 0;
		
		for(var p = 0; p < Math.floor(imageData.data.length/4); p++) {
			
			tempMax = imageData.data[p*4]
				+ imageData.data[p*4+1]
				+ imageData.data[p*4+2]
				+ imageData.data[p*4+3];
			
			if(tempMax > curMax) {
				curMax = tempMax;
				maxColor[0] = imageData.data[p*4];
				maxColor[1] = imageData.data[p*4+1];
				maxColor[2] = imageData.data[p*4+2];
				maxColor[3] = imageData.data[p*4+3];
			}
			
		}
		
		return maxColor;
		
	}
	
	// returns the value that appears the most.
	// NOT DONE. IN PRGORESS.
	function _pixelMajor(imageData) {
		
		let topValues = new Array(10),
			curValue = "",
			arrayMatch = -1,
			lowestCount = 0;;
		
		
		for(let p = 0; p < imageData.data.length; p=p+4) {
			
			curValue = imageData.data[p].toString().padStart(2, '0')
				+ imageData.data[p+1].toString().padStart(2, '0')
				+ imageData.data[p+2].toString().padStart(2, '0')
				+ imageData.data[p+3].toString().padStart(2, '0');
			
			//console.log(curValue);
			
			arrayMatch = curValue.indexOf(curValue);
			
			if(lowestCount <= 0) {
				
			}
			
			for(let i = 0; i < topValues.length; i++) {
				
				
				
			}
			
		}
		
	}
	
	/*-----------------------------------------------\
	|	Migrated Code 
	\-----------------------------------------------*/
	
	
	
	/*-----------------------------------------------\
	|	Return Object
	\-----------------------------------------------*/
	
	// return object to chain commands.
	// might not be needed for this module.
	var returnChainObject = {
		effect: effect,
		sample: sample,
		getResults: getResults,
		createSampleGrid: createSampleGrid,
		addSamplePoint: {},
		showSampleAreas: showSampleAreas
	}
	
	return returnChainObject;
	
}