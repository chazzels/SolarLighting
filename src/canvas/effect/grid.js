/*-----------------------------------------------\
|	Grid Effect
\-----------------------------------------------*/

var Grid = function GridEffectConstructor(argContext, argColor) {
	
	let effect = new Effect();
	
	effect.assignContext(argContext);
	
	effect.makeParameter('color', '#000');
	effect.makeParameter('colors', new Array());
	effect.makeParameter('width', 100);
	effect.makeParameter('height', 100);
	effect.makeParameter('rows', 10);
	effect.makeParameter('columns', 10);
	
	effect.makeParameter('profile', {});
	
	effect.makeHidden('xPos', new Int32Array());
	effect.makeHidden('yPos', new Int32Array());
	effect.makeHidden('gapWidth', 1);
	effect.makeHidden('gapHeight', 1);
	
	effect.makeParameter('drawWidth', 5);
	effect.makeParameter('drawHeight', 5);
	
	function _effectCalc(canvas) {
		
		effect.updateParameter('width', canvas.width);
		
		effect.updateParameter('height', canvas.height);
		
	}
	
	function _effectDraw(ctx) {
		
		let hexColor = '#fff';
		let tempColor = new Array(4);
		
		for(var i = 0; i < effect.parameter('profile').length; i++) {
			
			tempColor = effect.parameter('colors')[i];
			
			hexColor = rgbToHex(
				effect.parameter('colors')[i][0],
				effect.parameter('colors')[i][1],
				effect.parameter('colors')[i][2],
				effect.parameter('colors')[i][3]
			);
			
			ctx.beginPath();
			
			ctx.fillStyle = hexColor;
			
			ctx.fillRect(
				effect.parameter('profile').xPos[i], 
				effect.parameter('profile').yPos[i], 
				effect.parameter('profile').width, 
				effect.parameter('profile').height);
			
			ctx.closePath();
			
		}
		
	}
	
	function _effectCreate() {
		
		let width = effect.context.canvas.width;
		let height = effect.context.canvas.height;
		
		let xP = effect.hidden('xPos');
		let yP = effect.hidden('yPos');
		let rows = effect.parameter('rows');
		let columns = effect.parameter('columns');
		
		let index = 0;
		for(var c = 0; c < columns; c++) {
			for(var r = 0; r < rows; r++) {
				
				index++;
				
			}
		}
		
		effect.updateHidden('xPos', xP);
		effect.updateHidden('yPos', yP);
		
	}
	
	function _loadColors(colorArray) {
		
		effect.updateParameter('colors', colorArray);
		
	}
	
	function _createSampleProfile(context, argRows, argColumns, argWidth, argHeight) {
		
		let cWidth = context.canvas.width-argWidth/2;
		let cHeight = context.canvas.height-argHeight/2;
		
		effect.updateHidden('gapWidth', Math.floor( ((cWidth-argWidth)/(argColumns-1))) );
		effect.updateHidden('gapHeight', Math.floor( ((cHeight-argHeight)/(argRows-1))) );
		
		let firstLineGap = Math.floor(1);
		
		let xPos = new Int32Array(argRows * argColumns);
		let yPos = new Int32Array(argRows * argColumns);
		let colors = new Array(argRows * argColumns);
		
		let index = 0
		for(var c = 0; c < argColumns; c++) {
			for(var r = 0; r < argRows; r++) {
				
				index++;
				
				xPos[index] = Math.floor(r*effect.hidden('gapWidth'));
				
				yPos[index] = Math.floor(c*effect.hidden('gapHeight'));
				
				colors[index] = '#fff';
				
			}
		}
		
		effect.updateParameter('colors', colors);
		
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
	
	function _sampleAll(context, profile) {
		
		let colorSamples = new Array(profile.length);
		
		for(var i = 0; i < profile.length; i++) {
			
			let sample = _sampleCanvas(
				context,
				profile.xPos[i],
				profile.yPos[i],
				5,
				5);
			
			colorSamples[i] = sample;
			
		}
		
		effect.updateParameter('colors', colorSamples);
		
		return colorSamples;
		
	}
	
	function _sampleCanvas(context, sx, sy, sw, sh) {
		
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
	
	function rgbToHex(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	
	
	// binding functions to rendering system stages.
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	effect.setCreate(_effectCreate);
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateParameter: effect.updateParameter,
		profile: _createSampleProfile,
		sample: _sampleAll
	}
	
	return returnChainObject;
	
}