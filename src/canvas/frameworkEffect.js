/*-----------------------------------------------\
|	Effect Framework.
|	Skeleton to design effects on top off. 
|	Automates interfacing with the render instead.
\-----------------------------------------------*/
// TODO: convert the hidden value update system to a EventEmitter.
// TODO: document functions.

const Effect = function EffectConstructor() {
	
	let effectContext;
	
	// maps to track effect properties.
	let ParameterValueMap = new Map();
	
	// reserved for values that are calculated and not set by configuration.
	let hiddenValueMap = new Map(); 	// holds value of the hidden Parameter
	let hiddenUpdateMap = new Map();	// triggers updates based on public properties
	let hiddenUpdateFuncMap = new Map();// holds functions to fire on update.
	
	let frameworkValueMap = new Map();
	frameworkValueMap.set('color', ['#000']);
	
	// store the internal funcitons the render uses to generate images.
	let drawFunction = function _defaultDraw() {};
	let calcFunction = function _defaultCalc() {};
	let createFunction = function _defaultCreate() {};
	
	/*-----------------------------------------------\
	|	Drawing Managment.
	\-----------------------------------------------*/
	
	function assignContext(assignedContext) {
		
		effectContext = assignedContext;
		
		returnChainObject.context = assignedContext;
		
		return returnChainObject;
		
	}
	
	
	function setDraw(funcArg) {
		
		drawFunction = funcArg;
		
		return returnChainObject;
		
	}
	
	function setCalc(funcArg) {
		
		calcFunction = funcArg;
		
		return returnChainObject;
		
	}
	
	function setCreate(funcArg) {
		
		createFunction = funcArg;
		
		createFunction(effectContext);
		
		return returnChainObject;
		
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
	
	function getHiddenCallback(hiddenName) {
		
		let callback = hiddenUpdateFuncMap.get(hiddenName);
		
		if(typeof callback === 'function') {
			
			return callback;
			
		}
		
		return false;
		
	}
	
	function bindParameter(ParameterName, hiddenName) {
		
		hiddenUpdateMap.set(ParameterName, hiddenName);
		
	}
	
	/*-----------------------------------------------\
	|	Effect Parameter Mangagement.
	\-----------------------------------------------*/
	
	// create a parameter
	function makeParameter(name, value) {
		
		if(!ParameterValueMap.has(name)) {
			
			ParameterValueMap.set(name, value);
			
			_checkChangeMap(name);
			
		}
		
		return returnChainObject;
		
	}
	
	// update parameter
	function updateParameter(name, value) {
		
		if(ParameterValueMap.has(name)) {
			
			ParameterValueMap.set(name, value);
			
			_checkChangeMap(name);
			
		} 
		
		return returnChainObject;
		
	}
	
	// get a public parameter. 
	function getParameter(name) {
		
		return ParameterValueMap.get(name);
		
	}
	
	/*-----------------------------------------------\
	|	Color Interface
	\-----------------------------------------------*/
	
	function resetColors(colorArray) {
		
		frameworkValueMap.set('colors', colorArray);
		
		createFunction();
		
		return returnChainObject;
		
	}
	
	function addColor(color) {
		
		let colors = frameworkValueMap.get('color');
		
		colors.push(color);
		
		frameworkValueMap.set('color', colors);
		
		createFunction();
		
		return returnChainObject;
		
	}
	
	let _colorNextIndex = 0;
	function nextColor() {
		
		let colors = frameworkValueMap.get('colors');
		
		_colorNextIndex++;
		
		if(_colorNextIndex > colors.length-1) {
			
			_colorNextIndex = 0;
			
		}
		
		let result = colors[_colorNextIndex];
		
		return result;
		
	}
	
	
	function selectColor() {
		
		let colors = frameworkValueMap.get('colors');
		
		let selection = _getRandomIntInclusive(0, colors.length-1);
		
		let result  = colors[selection];
		
		// console.log(result);
		
		return result;
		
	}
	
	/*-----------------------------------------------\
	|	Internal functions.
	\-----------------------------------------------*/
	
	function _getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}
	
	function _checkChangeMap(name) {
		
		if(hiddenUpdateMap.has(name)) {
			
			let hiddenName = hiddenUpdateMap.get(name);
			
			let callback = hiddenUpdateFuncMap.get(hiddenName);
			
			if(typeof callback === 'function') {
				
				hiddenValueMap.set(name, callback());
				
			}
			
		}
		
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
	
	var returnChainObject = {
		assignContext: assignContext,
		context: effectContext,
		setCalc: setCalc,
		setDraw: setDraw,
		setCreate: setCreate,
		setHidden: setHidden,
		getHidden: getHidden,
		hidden: getHidden,
		setHiddenCallback: setHiddenCallback,
		bindParameter: bindParameter,
		bindProp:bindParameter,
		makeParameter: makeParameter,
		updateParameter: updateParameter,
		getParameter: getParameter,
		prop: getParameter,
		addColor: addColor,
		resetColors: resetColors,
		nextColor: nextColor,
		selectColor: selectColor,
		renderAPI: renderAPI,
		_propValMap: ParameterValueMap
	}
	
	return returnChainObject;
	
}