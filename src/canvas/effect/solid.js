/*-----------------------------------------------\
|	Solid Color Effect
\-----------------------------------------------*/

var Solid = function SolidEffectConstructor(argContext, argColor) {
	
	let effect = new Effect();
	
	effect.makeParameter('color', '#000');
	effect.makeParameter('width', 100);
	effect.makeParameter('height', 100);
	
	function _effectCalc(canvas) {
		
		effect.updateParameter('width', canvas.width);
		
		effect.updateParameter('height', canvas.height);
		
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
		updateParameter: effect.updateParameter
	}
	return returnChainObject;
	
}