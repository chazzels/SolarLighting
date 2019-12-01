/* global ctx */
/*-----------------------------------------------\
|	Canvas Rendering system
\-----------------------------------------------*/
// TODO: develop functionality to remove a layer.
// TODO: develop functionality to adjust order of layers. 
// TODO: develop color pallette support.

const CanvasEngine = function CanvasEngineConstructor(argCanvasContext) {
	
	let engine = this;
	let layers = new Array();
	let layerId = 1000;
	let RENDER_RUNNING = false;
	
	/*-----------------------------------------------\
	|	Public Object Methods
	\-----------------------------------------------*/
	
	// start the rendering on the canvas.
	engine.startRender = function startRenderFunc() {
		
		if(!RENDER_RUNNING) {
			
			engine.ctx = argCanvasContext;
			
			// this will need handling for server side execution.
			_normalizeRequestFrame();
			
			// IIFE to start
			(function frame() {
				
				window.requestAnimationFrame(frame);
				
				RENDER_RUNNING = false;
				
				// advance frame of the layers.
				layers.forEach(function(layer) {
					layer.calc(engine.ctx.canvas);
				});
				
				// render the layers.
				layers.forEach(function(layer) {
					layer.draw(engine.ctx);
				});
				
				// clear out all styles.
				engine.ctx.lineWidth = undefined;
				engine.ctx.strokeStyle = undefined;
				engine.ctx.fillStyle = undefined;
				engine.ctx.shadowColor= undefined;
				engine.ctx.shadowBlur = undefined; 
				
				RENDER_RUNNING = true;
				
			})();
			
		} else {
			
			console.log("CanvasRender already running!!!");
			
		}
		
	}
	
	// add a new layer to the top. 
	engine.addLayer = function addLayerFunc(argEffect) {
		
		new Layer(argEffect);
		
		return argEffect;
		
	}
	
	/*-----------------------------------------------\
	|	Internal Object Constructor
	\-----------------------------------------------*/
	
	// Layer construction object.
	// used to create another layer for the render to use.
	let Layer = function LayerConstructor(argFx) {
		
		this.fx = argFx;
		this.id = layerId++;
		
		this.draw = function _layerDraw(ctx) {
			this.fx.draw(ctx);
		};
		
		this.calc = function _layerCalc(canvas) {
			this.fx.calc(canvas);
		}
		
		// add the created layer to the stack of layers.
		layers.push(this);
		
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

//module.exports = CanvasEngine;