/*-----------------------------------------------\
|	Circle Tunnel Effect
\-----------------------------------------------*/

var CircleTunnel = function CircleTunnelEffectConstructor(argContext) {
	
	let effect = new Effect();
	
	effect.setHidden('circles', null);
	effect.setHidden('yOrigin', 0);
	effect.setHidden('xOrigin', 0);
	
	effect.makeProperty('colors', ['#2d334a', '#0c9463', '#78a5a3']);
	effect.makeProperty('size', 10);
	effect.makeProperty('rate', 3);
	effect.makeProperty('gap', 40);
	effect.makeProperty('count', 3);
	effect.makeProperty('xOffset', 0);
	effect.makeProperty('yOffset', 0);
	
	effect.bindProperty('count', 'circles');
	effect.setHidden('circles', function() {
		
		_createCircles(argContext);
		
	});
	
	
	function _effectDraw(ctx) {
		
		let circles = effect.hidden('circles');
		
		for(var i = 1; i < circles.length-1; i++) {
			
			ctx.beginPath();
			
			ctx.lineWidth = 1;
			ctx.strokeStyle = circles[i].color;
			ctx.fillStyle = circles[i].color;
			
			ctx.arc(
				circles[i].x, 
				circles[i].y, 
				circles[i].size,
				0, 
				Math.PI * 2, 
				true);
			
			ctx.stroke();
			ctx.fill();
			
			ctx.closePath();
			
		}
		
	}
	
	function _effectCalc(canvas) {
		
		// variables used to calculate infomation about the canvas being used.
		// updated every cycle incase of resize of canvas.
		// move functionality to the e
		let cw = canvas.width, 	//max height
			ch = canvas.height,	//max height
			cwm = Math.floor(cw/2),	//center of the shrink effect width
			chm = Math.floor(ch/2);	//center of the shrink effect height
		
		effect.setHidden('xOrigin', cwm);
		effect.setHidden('yOrigin', chm);
		
		
		let circles = effect.hidden('circles');
		
		circles.forEach(function(circle) {
			
			circle.x += effect.prop('xOffset');
			
			circle.y += effect.prop('yOffset');
			
			circle.size += effect.prop('rate');
			
			if(circle.size > Math.max(cw, ch)) {
				
				circle.size = 0;
				
			}
			
		});
		
		circles = circles.reverse();
		
		effect.setHidden('circles', circles);
		
	}
	
	function _getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}
	
	function _selectColor() {
		
		let colors = effect.prop('colors');
		
		let selection = _getRandomIntInclusive(0, colors.length-1);
		
		let result  = colors[selection];
		
		return result;
		
	}
	
	let _colorNextIndex = 0;
	function _nextColor() {
		
		let colors = effect.prop('colors');
		
		_colorNextIndex++;
		
		if(_colorNextIndex > colors.length-1) {
			
			_colorNextIndex = 0;
			
		}
		
		let result = colors[_colorNextIndex]
		
		console.log(result);
		
		return result;
		
	}
	
	function _createCircles(ctx) {
		
		// variables used to calculate infomation about the canvas being used.
		// updated every cycle incase of resize of canvas.
		// move functionality to the e
		let cw = ctx.canvas.width, 	//max height
			ch = ctx.canvas.height,	//max height
			cwm = Math.floor(cw/2),	//center of the shrink effect width
			chm = Math.floor(ch/2);	//center of the shrink effect height
		
		effect.setHidden('xCenter', cwm);
		effect.setHidden('yCenter', chm);
		
		effect.setHidden('circles', new Array(effect.prop('count')));
		
		let circles = effect.hidden('circles');
		
		let sizeOffset = 0;
		
		for(var index = 0; index < effect.prop('count'); index++) {
			
			sizeOffset += effect.prop('gap');
			
			circles[index] = {
				x: effect.hidden('xOrigin'),
				y: effect.hidden('yOrigin'),
				size: sizeOffset,
				color: _nextColor()
			}
			
		}
		
		effect.setHidden('circles', circles);
		
		console.log(effect.hidden('circles'));
		
	}
	
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	
	_createCircles(argContext);
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateProperty: effect.updateProperty,
		resetColor: effect.resetColor
	}
	return returnChainObject;
	
}