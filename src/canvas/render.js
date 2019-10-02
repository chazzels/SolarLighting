/* global $ jQuery ctx */

$(document).ready(function devPageReady() {
	
	// normalize the animation frame interface.
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
	
	
	// scene prep.
	// configure the html layer for the canvas element
	let canvas = jQuery('#canvas');
	canvas.width(window.innerWidth);
	canvas.attr('width', window.innerWidth);
	canvas.height(window.innerHeight);
	canvas.attr('height', window.innerHeight);
	let ctx = canvas[0].getContext('2d');
	
	// object to hanlde rendering stacked effects.
	// array is for holding all the effects.
	// every effect needs a .draw() function that the context will be passed into.
	var layers = new Array();
	var Layer = function LayerConstructor(argFx) {
		this.fx = argFx
		this.draw = function(ctx) {
			this.fx.draw(ctx);
		};
		// add the created layer to the stack of layers.
		layers.push(this);
	}
	
	
	
	// drawing main loop.
	// loops through each layer in register order and generates a final image.
	(function frame() {
		window.requestAnimationFrame(frame);
		layers.forEach(function(layer) {
			layer.draw(ctx);
		})
	})();
	
});

var CanvasEngine = function CanvasEngineConstructor() {
	
	let engine = this;
	
	engine.layers = new Array();
	
	engine.addLayer = function addLayerFunc() {
		
		
		
	}
	
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
	
	// Layer construction object.
	var Layer = function LayerConstructor(argFx) {
		
		this.fx = argFx
		
		this.draw = function(ctx) {
			this.fx.draw(ctx);
		};
		
		// add the created layer to the stack of layers.
		engine.layers.push(this);
		
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
	
}



/*
	
	// create the effects. 
	let solid = new Solid(ctx, "#090010");
	let stars1 = new Stars(ctx, 600, "#2a1a5e");	
	let stars2 = new Stars(ctx, 600, "#f45905");
	let stars3 = new Stars(ctx, 200, "#fb9224");
	let stars4 = new Stars(ctx, 200, "#fbe555");
	let stars5 = new Stars(ctx, 200, "#ccc");
	let stars6 = new Stars(ctx, 200, "#fff");
	
	// add the effects in layer order.
	solid.draw(ctx);
	new Layer(solid);
	new Layer(stars1);
	new Layer(stars2);
	new Layer(stars3);
	new Layer(stars4);
	new Layer(stars5);
	new Layer(stars6);
	
*/