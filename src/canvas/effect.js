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
	
	function setHidden(name, value) {
		
		hiddenValueMap.set(name, value);
		
	}
	
	function getHidden(name) {
		
		return hiddenValueMap.get(name);
		
	}
	
	/*-----------------------------------------------\
	|	Effect Property Mangagement.
	\-----------------------------------------------*/
	
	function makeProperty(name, value, type) {
		
		propertyValueMap.set(name, value);
		
		propertyTypeMap.set(name, type);
		
	}
	
	function updateProperty(name, value) {
		
		if(propertyValueMap.has(name)) {
			
			propertyValueMap.set(name, value);
			
			return true;
			
		} 
		
		return false;
		
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
		makeProperty: makeProperty,
		updateProperty: updateProperty,
		getProperty: getProperty,
		prop: getProperty,
		renderAPI: renderAPI,
		_propValMap: propertyValueMap
	}
	
}