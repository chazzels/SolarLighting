/*-----------------------------------------------\
|	Grid Effect
\-----------------------------------------------*/

var Grid = function GridEffectConstructor(argContext, argColor) {
	
	let effect = new Effect();
	
	effect.assignContext(argContext);
	
	effect.makeParameter('color', '#000');
	effect.makeParameter('width', 100);
	effect.makeParameter('height', 100);
	effect.makeParameter('rows', 10);
	effect.makeParameter('columns', 10);
	
	effect.makeHidden('xPos', new Int32Array());
	effect.makeHidden('yPos', new Int32Array());
	
	function _effectCalc(canvas) {
		
		effect.updateParameter('width', canvas.width);
		
		effect.updateParameter('height', canvas.height);
		
	}
	
	function _effectDraw(ctx) {
		
		ctx.beginPath();
		ctx.fillStyle = effect.parameter('color');
		ctx.fillRect(0, 0, effect.parameter('width'), effect.parameter('height'));
		ctx.closePath();
		
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
	
	function _loadColors() {
		
		
		
	}
	
	// binding functions to rendering system stages.
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	effect.setCreate(_effectCreate);
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateParameter: effect.updateParameter
	}
	
	return returnChainObject;
	
}