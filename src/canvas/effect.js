/*-----------------------------------------------\
|	Effect Base
\-----------------------------------------------*/
// TODO: create interlink between public and hidden propeties so they are updated correctly.

const Effect = function EffectConstructor() {
	
	// maps to track effect properties.
	let propertyValueMap = new Map();
	let propertyTypeMap = new Map();
	let propertyChangeMap = new Map();
	
	// reserved for values that are calculated and not set by configuration.
	let hiddenValueMap = new Map();
	let hiddenUpdateMap = new Map();
	let hiddenUpdateFuncMap = new Map();
	
	// store the internal funcitons the render uses to generate images.
	let drawFunction = function _defaultDraw() {};
	let calcFunction = function _defaultCalc() {};
	
	/*-----------------------------------------------\
	|	Drawing Managment.
	\-----------------------------------------------*/
	
	function setDraw(funcArg) {
		
		drawFunction = funcArg;
		
	}
	
	function setCalc(funcArg) {
		
		calcFunction = funcArg;
		
	}
	
	/*-----------------------------------------------\
	|	Hidden Properties.
	\-----------------------------------------------*/
	
	function setHidden(name, value, func) {
		
		hiddenValueMap.set(name, value);
		
		
		if(typeof func === 'function') {
			
			hiddenUpdateFuncMap.set(name, func);
			
			hiddenValueMap.set(name, func());
			
			console.log('funcSetVal:', name, hiddenValueMap.get(name));
			
		}
		
	}
	
	function getHidden(name) {
		
		return hiddenValueMap.get(name);
		
	}
	
	function setHiddenCallback(name, func) {
		
		if(typeof func === 'function') {
			
			hiddenUpdateFuncMap.set(name, func);
			
			hiddenValueMap.set(name, func());
			
			console.log('hiddenSet:', name, func);
			console.log('hiddenVal:', name, hiddenValueMap.get(name));
			
			
		}
		
		console.log(hiddenUpdateFuncMap);
		
	}
	
	function linkProperty(propertyName, hiddenName) {
		
		hiddenUpdateMap.set(propertyName, hiddenName);
		
		// DEV
		console.log(propertyName, hiddenUpdateMap.get(propertyName));
		
	}
	
	/*-----------------------------------------------\
	|	Effect Property Mangagement.
	\-----------------------------------------------*/
	
	function makeProperty(name, value, type) {
		
		propertyValueMap.set(name, value);
		
		propertyTypeMap.set(name, type);
		
		_checkChangeMap(name);
		
	}
	
	function updateProperty(name, value) {
		
		if(propertyValueMap.has(name)) {
			
			propertyValueMap.set(name, value);
			
			_checkChangeMap(name);
			
			return true;
			
		} 
		
		return false;
		
	}
	
	function _checkChangeMap(name) {
		
		console.log('check:', name);
		
		if(hiddenUpdateFuncMap.has(name)) {
			
			let callback = hiddenUpdateFuncMap.get(name);
			
			console.log('returnedFunc:', name, callback);
			
			if(typeof callback === 'function') {
				
				console.log('activated:', name);
				
				hiddenValueMap.set(name, callback());
				
				console.log('valueSet:', name, hiddenValueMap.get(name));
				
			}
			
		}
		
	}
	
	function getProperty(name) {
		
		return propertyValueMap.get(name);
		
	}
	
	/*-----------------------------------------------\
	|	Render Interface.
	\-----------------------------------------------*/
	
	function renderAPI() {
		
		return {
			draw: drawFunction,
			calc: calcFunction
		}
		
	}
	
	/*-----------------------------------------------\
	|	Return Object
	\-----------------------------------------------*/
	
	return {
		setCalc: setCalc,
		setDraw: setDraw,
		setHidden: setHidden,
		getHidden: getHidden,
		hidden: getHidden,
		setHiddenCallback: setHiddenCallback,
		linkProperty: linkProperty,
		makeProperty: makeProperty,
		updateProperty: updateProperty,
		getProperty: getProperty,
		prop: getProperty,
		renderAPI: renderAPI,
		_propValMap: propertyValueMap
	}
	
}