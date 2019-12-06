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
	|	application development zone.
	\-----------------------------------------------*/
	
	engine.createSampleProfile = function _createSampleProfileFunc(argRows, argColumns, argWidth, argHeight) {
		
		let cWidth = engine.ctx.canvas.width;
		let cHeight = engine.ctx.canvas.height;
		
		let widthGap = Math.floor(cWidth/argColumns) - argWidth;
		let heightGap = Math.floor(cHeight/argRows) - argHeight;
		
		let xPos = new Int32Array(argRows * argColumns);
		let yPos = new Int32Array(argRows * argColumns);
		
		let index = 0
		for(var c = 0; c < argColumns; c++) {
			for(var r = 0; r < argRows; r++) {
				
				index++;
				
				xPos[index] = Math.ceil(r*widthGap);
				
				yPos[index] = Math.ceil(c*heightGap);
				
			}
		}
		
		return {
			width: argWidth,
			height: argHeight,
			length: xPos.length,
			xPos: xPos,
			yPos: yPos
		}
		
	}
	
	engine._sample = function _sampleCanvasFunc(sx, sy, sw, sh) {
		
		let start = Date.now();
		
		let idata = argCanvasContext.getImageData(sx, sy, sw, sh);
		
		let maxColor = new Uint8ClampedArray(4);;
		
		let curMax = 0;
		
		let tempMax = 0;
		
		for(var p = 0; p < Math.floor(idata.data.length/4); p++) {
			
			tempMax = idata.data[p*4]
				+ idata.data[p*4+1]
				+ idata.data[p*4+2]
				+ idata.data[p*4+3];
			
			if(tempMax > curMax) {
				
				curMax = tempMax;
				
				maxColor[0] = idata.data[p*4];
				maxColor[1] = idata.data[p*4+1];
				maxColor[2] = idata.data[p*4+2];
				maxColor[3] = idata.data[p*4+3];
				
			}
			
			
		}
		
		console.log('sampleTime:', Date.now()-start,'ms');
		return maxColor;
		
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