/* global ctx */
/*-----------------------------------------------\
|	Canvas Rendering system
\-----------------------------------------------*/
// TODO: develop functionality to remove a layer.
// TODO: develop functionality to adjust order of layers. 

var CanvasEngine = function CanvasEngineConstructor(argCanvasId) {
	
	let engine = this;
	
	engine.canvas = document.getElementById(argCanvasId);
	engine.ctx = engine.canvas.getContext("2d");
	engine.layers = new Array();
	
	/*-----------------------------------------------\
	|	Public Object Methods
	\-----------------------------------------------*/
	
	// start the rendering on the canvas.
	engine.startRender = function startRenderFunc() {
		
		// this will need handling for server side execution.
		_normalizeRequestFrame();
		
		(function frame() {
			
			window.requestAnimationFrame(frame);
			
			engine.layers.forEach(function(layer) {
				layer.draw(ctx);
			});
			
		})();
		
	}
	
	// add a new layer to the top. 
	engine.addLayer = function addLayerFunc(argEffect) {
		
		return new Layer(argEffect);
		
	}
	
	/*-----------------------------------------------\
	|	Internal Object Constructor
	\-----------------------------------------------*/
	
	// Layer construction object.
	// used to create another layer for the render to use.
	var Layer = function LayerConstructor(argFx) {
		
		this.fx = argFx
		
		this.draw = function(ctx) {
			this.fx.draw(ctx);
		};
		
		// add the created layer to the stack of layers.
		engine.layers.push(this);
		
	}
	
	/*-----------------------------------------------\
	|	Utility Functions
	\-----------------------------------------------*/
	
	// normalize the animation frame interface.
	function _normalizeRequestFrame() {
		
		window.requestAnimationFrame = function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				function(f) {
					window.setTimeout(f, 1e3 / 60);
				}
		}();
		
	}
	
}

module.exports = CanvasEngine;