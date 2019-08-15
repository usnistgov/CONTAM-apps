(function () {
"use strict";

angular.module('units', [])
.component('unitconverter', {
	templateUrl: '/CONTAM-apps/webapps/components/unitconverter.template.html',
	controller: function($scope){
		var UCCtrl = this;
		//console.log("UCCtrl:" + UCCtrl.fieldLabel);
		//console.log(UCCtrl);
		
		UCCtrl.convertedValue = Number(UCCtrl.unitFunction(UCCtrl.baseValue, UCCtrl.unitConversion, 0, UCCtrl.species).toPrecision(4));
		UCCtrl.selectedUnit = UCCtrl.unitStrings[UCCtrl.unitConversion];
		
		UCCtrl.unitsChange = function(){
			UCCtrl.unitConversion = UCCtrl.unitStrings.indexOf(UCCtrl.selectedUnit);
			UCCtrl.convertedValue = Number(UCCtrl.unitFunction(UCCtrl.baseValue, UCCtrl.unitConversion, 0, UCCtrl.species).toPrecision(4));
		};
		
		UCCtrl.valueChange = function(){
			//console.log('valuechanged');
			//console.log("UCCtrl.convertedValue: " + UCCtrl.convertedValue);
			// convertedValue will be null when the input has no value (is empty)
			if(UCCtrl.convertedValue === null || UCCtrl.convertedValue === undefined) {
				// set the base value to null
				UCCtrl.baseValue = null;
				return;
			}
			// get the new base value
			var newBaseValue = UCCtrl.unitFunction(UCCtrl.convertedValue, UCCtrl.unitConversion, 1, UCCtrl.species);
			// ensure that it is within the bounds
			if(UCCtrl.min !== undefined && UCCtrl.min > newBaseValue){
				alert('The ' + UCCtrl.fieldLabel + ' cannot be less than the minimum: ' + UCCtrl.min);
				UCCtrl.baseValue = null;
				return;
			}
			if(UCCtrl.max !== undefined && UCCtrl.max < newBaseValue){
				alert('The ' + UCCtrl.fieldLabel + ' cannot be greater than the maximum: ' + UCCtrl.max);
				UCCtrl.baseValue = null;
				return;				
			}
			UCCtrl.baseValue = newBaseValue;
		};
		
		// watch the baseValue variable
		// change the converted value if the baseValue changes
		// also call the callback to let outside the component know about the change
		$scope.$watch(function() { return UCCtrl.baseValue },
              function(newValue, oldValue) {
				//console.log('watch: ' + newValue + ", " + oldValue);
				if(newValue === undefined) {
					UCCtrl.convertedValue = undefined;	
				} else if(newValue === null) {
					UCCtrl.convertedValue = null;	
				} else {
					UCCtrl.convertedValue = Number(UCCtrl.unitFunction(newValue, UCCtrl.unitConversion, 0, UCCtrl.species).toPrecision(4));
				}
				if(angular.isFunction(UCCtrl.valueChangeCallback)){
					UCCtrl.valueChangeCallback();
				}
				//if(valueChangeCallback != undefined && valueChangeCallback != null) {
				//	valueChangeCallback();
				//}					
              }
		);
		
	},
	controllerAs: 'UCCtrl',	
	bindings: {
		unitStrings: '<',
		unitFunction: '<',
		unitConversion: '=',
		baseValue: '=',
		fieldLabel: '<',
		min: '<',
		max: '<',
		species: '<',
		valueChangeCallback: '<',
		disableNumber: '<',
		disableUnits: '<'
	}
});

})();
