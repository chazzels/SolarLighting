/*-----------------------------------------------\
|	Star Field Effect
\-----------------------------------------------*/
// TODO: push the stars away from center.
// TODO: finish implementing directional system. 
// TODO: better way to set options. (map object with external iterface and event handling.)
// TODO: make star desnity based instead of count based. (implement max count.)
// TODO: upadte to make clumping of stars vs random scatter. less size change at center.

const StarField = function StarFieldEffectConstructor(argContext) {
	
	let effect = new Effect();
	
	effect.assignContext(argContext);
	
	effect.makeHidden('radius', -1);
	effect.makeHidden('slope', 100);
	effect.makeHidden('firstRun', true);
	effect.makeHidden('count', 100);
	effect.makeHidden('stars', null);
	
	effect.makeParameter('density', 10);
	effect.makeParameter('sizeChangeThreshold', 120);
	effect.makeParameter('sizeMin', 2);
	effect.makeParameter('sizeMax', 6);
	effect.makeParameter('rate', 2);
	effect.makeParameter('rotation', 20);
	effect.makeParameter('radiusPad', 0);
	
	effect.resetColors(['#700', '#e22', '#e52']);
	
	effect.bindParameter('rotation', 'slope');
	effect.setHiddenCallback('slope', function() {
		let result = Math.floor(_getTanFromDegrees(effect.parameter('rotation'))*100);
		effect.updateHidden('slope', result);
		return result;
	});
	
	effect.bindParameter('density', 'count');
	effect.setHiddenCallback('count', function() {
		let result = argContext.canvas.width*argContext.canvas.height / 10000;
		result = Math.floor(result) * effect.parameter('density');
		result = Math.floor(result);
		return result;
	});
	
	/*-----------------------------------------------\
	|	Effect callbacks
	\-----------------------------------------------*/
	
	// handles the drawing phase of rendering cycle. 
	function _effectDraw(ctx) {
		
		let stars = effect.hidden('stars');
		
		// iterate through stars and update each one.
		stars.forEach(function(star) {
			
			// render the star.
			// all styles for star set here.
			// parameters set above.
			ctx.beginPath();
			
			ctx.lineWidth = 1;
			ctx.strokeStyle = star.color;
			ctx.fillStyle = star.color;
			
			ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
			
			ctx.stroke();
			ctx.fill();
			
			ctx.closePath();
			
		});
		
	}
	
	// handles the data update phase of rendering cycle.
	function _effectCalc(canvas) {
		
		// variables used to calculate infomation about the canvas being used.
		// updated every cycle incase of resize of canvas.
		// move functionality to the e
		let cw = canvas.width, 	//max height
			ch = canvas.height,	//max height
			cwm = Math.floor(cw/2),	//center of the shrink effect width
			chm = Math.floor(ch/2);	//center of the shrink effect height
		
		// set widest dimension.
		effect.updateHidden('radius', Math.max(chm, cwm)+effect.parameter('radiusPad'));
		
		let stars = effect.hidden('stars');
		
		// iterate through stars and update each one.
		stars.forEach(function(star) {
			
			// advance size change counter.
			// controls 
			star.count++;
			if(star.count > effect.parameter('sizeChangeThreshold')) {
				star.count = 0;
			}
			
			// check position range and adjust if necassary.
			// more logic needed for direction control.
			star.x += effect.parameter('rate');
			star.y += effect.parameter('rate') * (effect.hidden('slope') * 0.01);
			
			// range check on x axis / width.
			if(star.x > canvas.width || star.x < 0) { 
				
				if(star.x > canvas.width + effect.parameter('sizeMax')) {
					star.x = 0-effect.parameter('sizeMax');
				}
				
				if(star.x < 0 - effect.parameter('sizeMax')) {
					star.x = canvas.width + effect.parameter('sizeMax');
				}
				
			}
			
			// range check on y axis / height;
			if(star.y > canvas.height || star.y < 0) {
				
				if(star.y > canvas.height + effect.parameter('sizeMax')) {
					star.y = 0 - effect.parameter('sizeMax');
				}
				
				if(star.y < 0 - effect.parameter('sizeMax')) {
					star.y = canvas.height + effect.parameter('sizeMax')
				}
				
			}
			
			// size adjustment for atomspheric effect.
			if(star.count === 0 || effect.hidden('firstRun')) {
				// slower radius based sizing
				let delta = Math.sqrt(Math.pow(star.x-cwm, 2) + Math.pow(star.y-chm,2));
				star.size = Math.floor((delta/effect.hidden('radius'))*effect.parameter('sizeMax'));
			}
			
			// range check the size of the stars.
			// then store the size to the star object.
			if(star.size < effect.parameter('sizeMin')) { star.size = effect.parameter('sizeMin'); }
			if(star.size > effect.parameter('sizeMax')) { star.size = effect.parameter('sizeMax'); }
			
			star.x = Math.floor(star.x);
			star.y = Math.floor(star.y);
			
		});
		
	}
	
	/*-----------------------------------------------\
	|	Internal functions
	\-----------------------------------------------*/
	
	// development. currently used to generate random positions for stars on creation. 
	function _getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}
	
	// get the slope from traditional degrees 0-360.
	function _getTanFromDegrees(degrees) {
		return Math.tan(Math.floor(degrees) * Math.PI/180);
	}
	
	// returns a number indicating the directiong. 
	function _getDirectionFromDegrees(degrees) {
		
		let adjustedDegrees = 
			Math.abs(degrees) - (Math.floor((Math.abs(degrees) / 360)) * 360);
		
		if(adjustedDegrees < 180
			&& adjustedDegrees > 0) { 
				return 1;
		}
		
		if(adjustedDegrees > 180 
			&& adjustedDegrees < 360) {
				return -1;
		}
		
		return 0;
		
	}
	
	// executed on creation. 
	// ensures object is never void of data.
	// fill the stars array with random values for coordinates.
	function _shuffleStars() {
		
		let stars = effect.hidden('stars')
		
		for(var index = 0; index < effect.hidden('count'); index++) {
			
			stars[index] = {
				x: _getRandomIntInclusive(
					0-effect.parameter('sizeMax'),
					argContext.canvas.width+effect.parameter('sizeMax')),
				y: _getRandomIntInclusive(
					0-effect.parameter('sizeMax'), 
					argContext.canvas.height+effect.parameter('sizeMax')),
				size: effect.parameter('sizeMin'),
				count: _getRandomIntInclusive(0, effect.parameter('sizeChangeThreshold')),
				color: effect.selectColor()
			}
			
		}
		
		effect.updateHidden('stars', stars);
		
	}
	
	/*-----------------------------------------------\
	|	Starfied initialization steps
	\-----------------------------------------------*/
	
	// effect unique memebers
	effect.stars = new Array(effect.parameter('count'));
	effect.updateHidden('stars', new Array(effect.parameter('count')));
	
	// binding functions to rendering system stages.
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	effect.setCreate(_shuffleStars);
	
	_shuffleStars();
	
	var returnChainObject = {
		renderAPI: effect.renderAPI,
		updateParameter: effect.updateParameter,
		updateHidden: effect.updateHidden,
		addColor: effect.addColor,
		resetColors: effect.resetColors
	};
	
	return returnChainObject;
	
}
