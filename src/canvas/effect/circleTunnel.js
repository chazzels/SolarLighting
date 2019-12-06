/*-----------------------------------------------\
|	Circle Tunnel Effect
\-----------------------------------------------*/

var CircleTunnel = function CircleTunnelEffectConstructor(argContext) {
	
	let effect = new Effect();
	
	effect.assignContext(argContext);
	
	effect.makeHidden('circles', null);
	effect.makeHidden('xOrigin', 0);
	effect.makeHidden('yOrigin', 0);
	effect.makeHidden('xCenter', 0);
	effect.makeHidden('yCenter', 0);
	effect.makeHidden('gap', 100);
	
	effect.makeParameter('size', 10);
	effect.makeParameter('rate', 3);
	effect.makeParameter('count', 3);
	effect.makeParameter('maxShift', 0.2);
	effect.makeParameter('shiftChance', 0.01)
	effect.makeParameter('xOffset', 0);
	effect.makeParameter('yOffset', 0);
	
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
		
		effect.updateHidden('xOrigin', cwm);
		effect.updateHidden('yOrigin', chm);
		
		let circles = effect.hidden('circles');
		
		let sortFlag = false;
		
		for(var i = 0; i < circles.length; i++) {
			
			circles[i].x += effect.parameter('xOffset');
			circles[i].x += ((Math.random() >= 0.99)*-1)+((Math.random() >= 0.99)*1)*(effect.parameter('maxShift')*Math.random());
			// circles[i].x = Math.floor(circles[i].x);
			
			circles[i].y += effect.parameter('yOffset');
			circles[i].y += ((Math.random() >= 0.99)*-1)+((Math.random() >= 0.99)*1)*(effect.parameter('maxShift')*Math.random());
			// circles[i].y = Math.floor(circles[i].y);
			
			circles[i].size += effect.parameter('rate');
			
			if(circles[i].size > Math.max(cw, ch)) {
				
				circles[i].x = effect.hidden('xOrigin');
				
				circles[i].y = effect.hidden('yOrigin');
				
				circles[i].size = 0;
				
				sortFlag = true;
				
			}
			
		}
		
		if(sortFlag) {
			
			circles = _sortCircles(circles);
			
		}
		
		effect.updateHidden('circles', circles);
		
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
	
	function _createCircles(ctx) {
		
		effect.updateHidden('circles', new Array(effect.parameter('count')));
		
		let circles = effect.hidden('circles');
		
		let sizeOffset = 0;
		
		for(var index = 0; index < effect.parameter('count'); index++) {
			
			sizeOffset += effect.hidden('gap');
			
			circles[index] = {
				x: effect.hidden('xCenter'),
				y: effect.hidden('yCenter'),
				size: sizeOffset,
				color: effect.nextColor()
			}
			
		}
		
		effect.updateHidden('circles', circles);
		
	}
	
	// reset the circles hidden parameter when the count Parameter changes.
	effect.bindParameter('count', 'circles');
	effect.setHiddenCallback('circles', function() {
		
		effect.updateHidden('xCenter', Math.floor(effect.context.canvas.width/2));
		effect.updateHidden('yCenter', Math.floor(effect.context.canvas.height/2));
		
		// calculate the gap. 
		let gapResult = Math.max(effect.context.canvas.height*1.2, effect.context.canvas.width*1.2);
		gapResult = Math.floor(gapResult / effect.parameter('count'));
		effect.updateHidden('gap', gapResult);
		
		_createCircles(effect.context);
		
	});
	
	// bind the life cycle functions to the effect framework.
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	effect.setCreate(_createCircles)
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateParameter: effect.updateParameter,
		resetColors: effect.resetColors
	}
	return returnChainObject;
	
}