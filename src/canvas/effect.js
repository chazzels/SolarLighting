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
			
		}
		
	}
	
	function getHidden(name) {
		
		return hiddenValueMap.get(name);
		
	}
	
	function setHiddenCallback(name, func) {
		
		if(typeof func === 'function') {
			
			hiddenUpdateFuncMap.set(name, func);
			
			hiddenValueMap.set(name, func());
			
			
		}
		
	}
	
	function linkProperty(propertyName, hiddenName) {
		
		hiddenUpdateMap.set(propertyName, hiddenName);
		
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
		
		if(hiddenUpdateMap.has(name)) {
			
			let hiddenName = hiddenUpdateMap.get(name);
			
			let callback = hiddenUpdateFuncMap.get(hiddenName);
			
			console.log('check:', hiddenName, callback);
			
			if(typeof callback === 'function') {
				
				hiddenValueMap.set(name, callback());
				
				console.log('checkCall:', name, hiddenName, hiddenValueMap.get(name));
				
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