/*-----------------------------------------------\
|	Circle Tunnel Effect
\-----------------------------------------------*/

var Solid = function SolidEffectConstructor(argContext) {
	
	let effect = new Effect();
	
	effect.setHidden('circles', {});
	effect.setHidden('xCenter', 0);
	effect.setHidden('yCenter', 0);
	effect.setHidden('yOrigin', 0);
	effect.setHidden('xOrigin', 0);
	
	effect.makeProperty('colors', ['#2d334a', '#0c9463', '#78a5a3']);
	effect.makeProperty('size', 10);
	effect.makeProperty('count', 10);
	effect.makeProperty('xOffset', 0);
	effect.makeProperty('yOffset', 0);
	
	function _effectDraw(ctx) {
		
		let circles = effect.hidden('circles');
		
		circles.forEach(function(circle) {
			
			ctx.beginPath();
			
			ctx.lineWidth = 1;
			ctx.strokeStyle = circle.color;
			ctx.fillStyle = circle.color;
			
			ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2, true);
			
			ctx.closePath();
			
		});
		
	}
	
	function _effectCalc(canvas) {
		
		
		
	}
	
	function _createCircle() {
		
		
		
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
	
	function _createCircles() {
		
		let circles = effect.hidden('circles');
		
		for(var index = 0; index < effect.hidden('count'); index++) {
			
			circles[index] = {
				x: effect.hidden('xOrigin'),
				y: effect.hidden('yOrigin'),
				size: 0,
				color: _selectColor()
			}
			
		}
		
		effect.setHidden('circles', circles);
		
		console.log(effect.hidden('circles'));
		
	}
	
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	
	_createCircles();
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateProperty: effect.updateProperty,
		resetColor: effect.resetColor
	}
	return returnChainObject
	
}