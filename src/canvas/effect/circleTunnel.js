/*-----------------------------------------------\
|	Circle Tunnel Effect
\-----------------------------------------------*/

var CircleTunnel = function CircleTunnelEffectConstructor(argContext) {
	
	let effect = new Effect();
	
	effect.setHidden('circles', null);
	effect.setHidden('yOrigin', 0);
	effect.setHidden('xOrigin', 0);
	effect.setHidden('gap', 100);
	
	effect.makeProperty('colors', ['#2d334a', '#0c9463', '#78a5a3']);
	effect.makeProperty('size', 10);
	effect.makeProperty('rate', 3);
	effect.makeProperty('count', 3);
	effect.makeProperty('xOffset', 0);
	effect.makeProperty('yOffset', 0);
	
	function _effectDraw(ctx) {
		
		let circles = effect.hidden('circles');
		
		for(var i =  circles.length-1; i > 0; i--) {
			
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
		
		let sortFlag = false;
		
		for(var i = 0; i < circles.length; i++) {
			
			circles[i].x += effect.prop('xOffset');
			
			circles[i].y += effect.prop('yOffset');
			
			circles[i].size += effect.prop('rate');
			
			if(circles[i].size > Math.max(cw, ch)) {
				
				circles[i].size = 0;
				
				sortFlag = true;
				
			}
			
		}
		
		if(sortFlag) {
			
			circles = _sortCircles(circles);
			
		}
		
		effect.setHidden('circles', circles);
		
	}
	
	function _sortCircles(circles) {
		
		circles.sort(function(a,b) {
			
			let aSize = Math.floor(a.size);
			
			let bSize = Math.floor(b.size);
			
			if(aSize < bSize) {
				return -1;
			}
			
			if(aSize > bSize) {
				return 1;
			}
			
			return 0;
			
		});
		
		return circles;
		
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
		
		let result = colors[_colorNextIndex];
		
		return result;
		
	}
	
	function resetColor(colors) {
		
		effect.updateProperty('colors', colors);
		
		_createCircles(argContext);
		
	}
	
	function updateProperty(key, value) {
		effect.updateProperty(key, value);
		return returnChainObject;
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
			
			sizeOffset += effect.hidden('gap');
			
			circles[index] = {
				x: effect.hidden('xCenter'),
				y: effect.hidden('yCenter'),
				size: sizeOffset,
				color: _nextColor()
			}
			
		}
		
		effect.setHidden('circles', circles);
		
	}
	
	effect.bindProperty('count', 'circles');
	effect.setHiddenCallback('circles', function() {
		
		// calculate the gap. 
		let gapResult = Math.max(argContext.canvas.height, argContext.canvas.width);
		gapResult = Math.floor(gapResult / effect.prop('count'));
		effect.setHidden('gap', gapResult);
		
		_createCircles(argContext);
		
	});
	
	
	
	_createCircles(argContext);
	
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateProperty: updateProperty,
		resetColor: resetColor
	}
	return returnChainObject;
	
}