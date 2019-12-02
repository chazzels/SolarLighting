/*-----------------------------------------------\
|	Circle Tunnel Effect
\-----------------------------------------------*/

var CircleTunnel = function CircleTunnelEffectConstructor(argContext) {
	
	let effect = new Effect();
	
	effect.assignContext(argContext);
	
	effect.setHidden('circles', null);
	effect.setHidden('yOrigin', 0);
	effect.setHidden('xOrigin', 0);
	effect.setHidden('gap', 100);
	
	effect.makeProperty('size', 10);
	effect.makeProperty('rate', 3);
	effect.makeProperty('count', 3);
	effect.makeProperty('xOffset', 0);
	effect.makeProperty('yOffset', 0);
	
	effect.resetColors(['#2d334a', '#0c9463', '#78a5a3'])
	
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
	
	function resetColor(colors) {
		
		effect.updateProperty('colors', colors);
		
		_createCircles(effect.context);
		
	}
	
	function updateProperty(key, value) {
		effect.updateProperty(key, value);
		return returnChainObject;
	}
	
	function _createCircles(ctx) {
		
		effect.setHidden('circles', new Array(effect.prop('count')));
		
		let circles = effect.hidden('circles');
		
		let sizeOffset = 0;
		
		for(var index = 0; index < effect.prop('count'); index++) {
			
			sizeOffset += effect.hidden('gap');
			
			circles[index] = {
				x: effect.hidden('xCenter'),
				y: effect.hidden('yCenter'),
				size: sizeOffset,
				color: effect.nextColor()
			}
			
		}
		
		effect.setHidden('circles', circles);
		
	}
	
	effect.bindProperty('count', 'circles');
	effect.setHiddenCallback('circles', function() {
		
		// variables used to calculate infomation about the canvas being used.
		// updated every cycle incase of resize of canvas.
		// move functionality to the e
		let cw = effect.context.canvas.width, 	//max height
			ch = effect.context.canvas.height,	//max height
			cwm = Math.floor(cw/2),	//center of the shrink effect width
			chm = Math.floor(ch/2);	//center of the shrink effect height
		
		effect.setHidden('xCenter', cwm);
		effect.setHidden('yCenter', chm);
		
		// calculate the gap. 
		let gapResult = Math.max(effect.context.canvas.height, effect.context.canvas.width);
		gapResult = Math.floor(gapResult / effect.prop('count'));
		effect.setHidden('gap', gapResult);
		
		_createCircles(effect.context);
		
	});
	
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	effect.setCreate(_createCircles)
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateProperty: updateProperty,
		resetColors: effect.resetColors
	}
	return returnChainObject;
	
}