/*-----------------------------------------------\
|	Star Field Effect
\-----------------------------------------------*/
// TODO: push the stars away from center.
// TODO: add ability to select direction of movement.

var StarField = function StarFieldEffectConstructor(argContext, argCount, argColor) {
	
	this.color = argColor ? argColor : "#eef";
	this.count = typeof argCount === "number" ? argCount : 10;
	this.stars = new Array(this.count);
	this.maxSize = 3;
	this.minSize = 1;
	this.rate = 0.2;
	this.rotation = 120;
	this.slope = Math.floor(getTanFromDegrees(this.rotation)*100);
	this.feather = 0.5;
	this.radius = -1;
	this.FAST_SAMPLING = false;
	
	this.draw = function(ctx) {
		
		let effect = this;
		let cw = ctx.canvas.width, 		//max height
				ch = ctx.canvas.height,	//max height
				cwm = Math.floor(cw/2),	//center of the shrink effect width
				chm = Math.floor(ch/2);	//center of the shrink effect height
		
		if(cwm<chm) {
			effect.radius = cwm;
		} else {
			effect.radius = chm;
		}
		
		// iterate through stars and update each one.
		effect.stars.forEach(function(star) {
			
			// check position range and adjust if necassary
			star[0] += effect.rate;
			star[1] += effect.rate * (effect.slope * 0.01);
			let size = star[2];
			
			// range check on x axis / width.
			if(star[0] > ctx.canvas.width || star[0] < 0) { 
				
				if(star[0] > ctx.canvas.width + effect.maxSize) {
					star[0] = 0-effect.maxSize;
				}
				
				if(star[0] < 0 - effect.maxSize) {
					star[0] = ctx.canvas.width + effect.maxSize
				}
				
			}
			
			// range check on y axis / height;
			if(star[1] >ctx.canvas.height || star[1] < 0) {
				
				if(star[1] > ctx.canvas.height + effect.maxSize) {
					star[1] = 0 - effect.maxSize;
				}
				
				if(star[1] < 0 - effect.maxSize) {
					star[1] = ctx.canvas.height + effect.maxSize
				}
				
			}
			
			// size adjustment for atomspheric effect.
			// two modes present.
			if(effect.FAST_SAMPLING) {
				
				if(Math.random() > 0.98) {
					// faster sqaure based sizing
					if(Math.abs(star[0]-cwm) > Math.abs(star[1]-chm)) {
						size = Math.floor((Math.abs(star[0]-cwm) / ((cwm + chm)/(1+effect.feather))) * effect.maxSize);
					} else {
						size = Math.floor((Math.abs(star[1]-chm) / ((cwm + chm)/(1+effect.feather))) * effect.maxSize);
					}
				}
				
			} else {
				
				if(Math.random() > 0.97) {
					// slower radius based sizing
					let delta = Math.sqrt(Math.pow(star[0]-cwm, 2) + Math.pow(star[1]-chm,2));
					size = Math.floor((delta/effect.radius)*effect.maxSize);
				}
				
			}
			
			// adding a little randomness to the mix. only one can happen to each star.
			let random = false;
			let chance = 0.99995;
			if(Math.random() > chance && !random) { star[0] += Math.ceil(size/4); random = false; }
			if(Math.random() > chance && !random) { star[0] -= Math.ceil(size/4); random = false; }
			if(Math.random() > chance && !random) { star[1] += Math.ceil(size/4); random = false; }
			if(Math.random() > chance && !random) { star[1] -= Math.ceil(size/4); random = false; }
			if(Math.random() > chance && !random) { size = size-1; random = false; }
			
			// range check the size of the stars.
			// then store the size to the star object.
			if(size < effect.minSize) { size = effect.minSize; }
			if(size > effect.maxSize) { size = effect.maxSize; }
			star[2] = size;
			
			// render the star.
			// all styles for star set here.
			// parameters set above.
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = effect.color;
			ctx.fillStyle = effect.color;
			ctx.arc(star[0], star[1], star[2], 0, Math.PI * 2, true);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
			
		});
		
	}
	
	// executed on creation. 
	// ensures object is never void of data.
	// fill the stars array with random values for coordinates.
	for(var index = 0; index < this.count; index++) {
		this.stars[index] = [getRandomIntInclusive(0-this.maxSize,argContext.canvas.width+this.maxSize),
							 getRandomIntInclusive(0-this.maxSize,argContext.canvas.height+this.maxSize),
							 this.minSize];
	}
	
	
	// development. currently used to generate random positions for stars on creation. 
	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}
	
	function getTanFromDegrees(degrees) {
		return Math.tan(degrees * Math.PI/180);
	}
	
}

module.exports = StarField;
