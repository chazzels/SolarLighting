/*-----------------------------------------------\
|	Effect Base
\-----------------------------------------------*/

const Effect = function EffectConstructor() {
	
	// maps to track effect properties.
	let propertyValueMap = new Map();
	let propertyTypeMap = new Map();
	
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
	|
	\-----------------------------------------------*/
	function renderAPI() {
		
		return {
			draw: drawFunction,
			calc: calcFunction
		}
		
	}
	
	
	return {
		makeProperty: makeProperty,
		updateProperty: updateProperty,
		getProperty: getProperty,
		prop: getProperty,
		_propValMap: propertyValueMap
	}
	
}