/*-----------------------------------------------\
|	Solid Color Effect
\-----------------------------------------------*/

var Solid = function SolidEffectConstructor(argContext, argColor) {
	
	this.color = argColor ? argColor : "#000";
	
	this.calc = function (canvas) {}
	
	this.draw = function(ctx) {
		
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.closePath();
		
	}
	
}