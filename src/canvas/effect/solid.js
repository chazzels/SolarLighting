/*-----------------------------------------------\
|	Solid Color Effect
\-----------------------------------------------*/

var Solid = function SolidEffectConstructor(argContext, argColor) {
	
	let effect = new Effect();
	
	effect.makeProperty('color', '#000');
	effect.makeProperty('width', 100);
	effect.makeProperty('height', 100);
	
	function _effectCalc(canvas) {
		
		effect.updateProperty('width', canvas.width);
		
		effect.updateProperty('height', canvas.height);
		
	}
	
	function _effectDraw(ctx) {
		
		ctx.beginPath();
		ctx.fillStyle = effect.prop('color');
		ctx.fillRect(0, 0, effect.prop('width'), effect.prop('height'));
		ctx.closePath();
		
	}
	
	// binding functions to rendering system stages.
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateProperty: effect.updateProperty
	}
	return returnChainObject;
	
}