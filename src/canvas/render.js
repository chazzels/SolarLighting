/* global ctx */
/*-----------------------------------------------\
|	Canvas Rendering system
\-----------------------------------------------*/
// TODO: develop functionality to remove a layer.
// TODO: develop functionality to adjust order of layers. 
// TODO: develop color pallette support.

const CanvasEngine = function CanvasEngineConstructor(argCanvasContext) {
	
	let engine = this;
	engine.ctx = argCanvasContext;
	
	let sampler = new CanvasSampler(engine.ctx);
	let layers = new Array();
	let RENDER_RUNNING = false;
	
	/*-----------------------------------------------\
	|	Public Object Methods
	\-----------------------------------------------*/
	
	// start the rendering on the canvas.
	function startRender() {
		
		if(!RENDER_RUNNING) {
			
			// TODO: this will need handling for server side execution.
			_normalizeRequestFrame();
			
			// IIFE to start
			(function frame() {
				
				window.requestAnimationFrame(frame);
				
				// advance frame of the layers.
				layers.forEach(function(layer) {
					
					layer.calc(engine.ctx.canvas);
					
				});
				
				// render the layers.
				layers.forEach(function(layer) {
					
					layer.draw(engine.ctx);
					
					_clearCanvasStyles(engine.ctx);
					
				});
				
				sampler.sample();
				
				RENDER_RUNNING = true;
				
			})();
			
		} else {
			
			console.log("CanvasRender already running!!!");
			
		}
		
	}
	
	// add a new layer to the top. 
	function addLayer(argEffect) {
		
		new Layer(argEffect);
		
		return argEffect;
		
	}
	
	/*-----------------------------------------------\
	|	application development zone.
	\-----------------------------------------------*/
	
	
	
	/*-----------------------------------------------\
	|	Internal Object Constructor
	\-----------------------------------------------*/
	
	// Layer construction object.
	// used to create another layer for the render to use.
	let Layer = function LayerConstructor(argFx) {
		
		this.fx = argFx;
		
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
	
	function _clearCanvasStyles(context) {
		
		// clear out all styles.
		context.lineWidth = undefined;
		context.strokeStyle = undefined;
		context.fillStyle = undefined;
		context.shadowColor= undefined;
		context.shadowBlur = undefined; 
		
	}
	
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
	
	/*-----------------------------------------------\
	|	Return Object
	\-----------------------------------------------*/
	
	var returnObject =  {
		startRender: startRender,
		start: startRender,
		addLayer: addLayer,
		sampler: sampler
	}
	
	return returnObject;
	
}