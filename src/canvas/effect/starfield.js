/*-----------------------------------------------\
|	Star Field Effect
\-----------------------------------------------*/
// TODO: push the stars away from center.
// TODO: finish implementing directional system. 
// TODO: better way to set options. (map object with external iterface and event handling.)
// TODO: make star desnity based instead of count based. (implement max count.)

const StarField = function StarFieldEffectConstructor(argContext, argCount, argColor) {
	
	let effect = new Effect();
	
	effect.makeProperty('color', '#eef');
	effect.makeProperty('colors', new Array('#700', '#e22', '#e52'));
	effect.makeProperty('count', 10);
	effect.makeProperty('sizeChangeThreshold', 40);
	effect.makeProperty('sizeMin', 2);
	effect.makeProperty('sizeMax', 6);
	effect.makeProperty('rate', 2);
	effect.makeProperty('rotation', 20);
	effect.makeProperty('feather', 0.5);
	effect.makeProperty('radius', 0);
	
	if(typeof argCount !== 'undefined') {
		effect.updateProperty('count', argCount);
	}
	
	if(typeof argColor !== 'undefined') {
		effect.updateProperty('color', argColor);
	}
	
	effect.setHidden('radius', -1);
	effect.setHidden('slope', Math.floor(getTanFromDegrees(effect.prop('rotation'))*100));
	effect.setHidden('direction', getDirectionFromDegrees(effect.prop('rotation')));
	effect.setHidden('firstRun', true);
	
	console.log(effect.hidden('slope'));
	
	// effect unique memebers
	effect.stars = new Array(effect.prop('count'));
	
	// binding functions to rendering system stages.
	effect.setDraw(_effectDraw);
	effect.setCalc(_effectCalc);
	
	// handles the drawing phase of rendering cycle. 
	function _effectDraw(ctx) {
		
		// iterate through stars and update each one.
		effect.stars.forEach(function(star) {
			
			// render the star.
			// all styles for star set here.
			// parameters set above.
			ctx.beginPath();
			
			ctx.lineWidth = 1;
			// ctx.strokeStyle = effect.prop('color');
			// ctx.fillStyle = effect.prop('color');
			ctx.strokeStyle = star.color;
			ctx.fillStyle = star.color;
			
			ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2, true);
			
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
		effect.setHidden('radius', Math.max(chm, cwm)+effect.prop('radius'));
		
		// iterate through stars and update each one.
		effect.stars.forEach(function(star) {
			
			// advance size change counter.
			// controls 
			star.count++;
			if(star.count > effect.prop('sizeChangeThreshold')) {
				star.count = 0;
			}
			
			// check position range and adjust if necassary.
			// more logic needed for direction control.
			star.x += effect.prop('rate');
			star.y += effect.prop('rate') * (effect.hidden('slope') * 0.01);
			
			// range check on x axis / width.
			if(star.x > canvas.width || star.x < 0) { 
				
				if(star.x > canvas.width + effect.prop('sizeMax')) {
					star.x = 0-effect.prop('sizeMax');
				}
				
				if(star.x < 0 - effect.prop('sizeMax')) {
					star.x = canvas.width + effect.prop('sizeMax');
				}
				
			}
			
			// range check on y axis / height;
			if(star.y > canvas.height || star.y < 0) {
				
				if(star.y > canvas.height + effect.prop('sizeMax')) {
					star.y = 0 - effect.prop('sizeMax');
				}
				
				if(star.y < 0 - effect.prop('sizeMax')) {
					star.y = canvas.height + effect.prop('sizeMax')
				}
				
			}
			
			// size adjustment for atomspheric effect.
			if(star.count === 0 || effect.hidden('firstRun')) {
				// slower radius based sizing
				let delta = Math.sqrt(Math.pow(star.x-cwm, 2) + Math.pow(star.y-chm,2));
				star.size = Math.floor((delta/effect.hidden('radius'))*effect.prop('sizeMax'));
			}
			
			// range check the size of the stars.
			// then store the size to the star object.
			if(star.size < effect.prop('sizeMin')) { star.size = effect.prop('sizeMin'); }
			if(star.size > effect.prop('sizeMax')) { star.size = effect.prop('sizeMax'); }
			
			star.x = Math.floor(star.x);
			star.y = Math.floor(star.y);
			
		});
		
	}
	
	// development. currently used to generate random positions for stars on creation. 
	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}
	
	// get the slope from traditional degrees 0-360.
	function getTanFromDegrees(degrees) {
		return Math.tan(Math.floor(degrees) * Math.PI/180);
	}
	
	// returns a number indicating the directiong. 
	function getDirectionFromDegrees(degrees) {
		
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
	
	function addColor(color) {
		
		let colors = effect.prop('colors');
		
		colors.push(color);
		
		effect.updateProperty('colors', colors);
		
		return effectReturnChainObject
		
	}
	
	function selectColor() {
		
		let colors = effect.prop('colors');
		
		let selection = getRandomIntInclusive(0, colors.length-1);
		
		let result  = colors[selection];
		
		return result;
		
	}
	
	// executed on creation. 
	// ensures object is never void of data.
	// fill the stars array with random values for coordinates.
	for(var index = 0; index < effect.prop('count'); index++) {
		
		effect.stars[index] = {
			x: getRandomIntInclusive(
				0-effect.prop('sizeMax'),
				argContext.canvas.width+effect.prop('sizeMax')),
			y: getRandomIntInclusive(
				0-effect.prop('sizeMax'), 
				argContext.canvas.height+effect.prop('sizeMax')),
			size: effect.prop('sizeMin'),
			count: getRandomIntInclusive(0, effect.prop('sizeChangeThreshold')),
			color: selectColor()
		}
		
	}
	
	console.log('--------------');
	console.log(effect.stars);
	
	function updateProperty(key, value) {
		effect.updateProperty(key, value);
		return effectReturnChainObject;
	}
	
	function setHidden(key, value) {
		effect.setHidden(key, value);
		return effectReturnChainObject;
	}
	
	
	var effectReturnChainObject = {
		renderAPI: effect.renderAPI,
		updateProperty: updateProperty,
		setHidden: setHidden,
		addColor: addColor
	};
	
	return effectReturnChainObject;
	
}
