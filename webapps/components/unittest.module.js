(function () {
'use strict';

angular.module('unittest', ['units'])
.controller('unittestController', unittestController);

//unittestController.$inject = [];
function unittestController() {
	var unittestctrl = this;
	
	unittestctrl.lengthUnitStrings = CONTAM.Units.Strings2.Length.slice();
	unittestctrl.lengthUnitFunction = CONTAM.Units.LengthConvert;
	unittestctrl.testUnitConversion = 3;
	unittestctrl.baseValue = 5e-16;
	unittestctrl.fieldLabel = "some length";
	unittestctrl.min = 0;
	//unittestctrl.max = 100;
	//alert(Number.EPSILON);
	unittestctrl.lengthUnitStrings2 = CONTAM.Units.Strings2.Length.slice();
	unittestctrl.lengthUnitFunction2 = CONTAM.Units.LengthConvert;
	unittestctrl.testUnitConversion2 = 3;
	unittestctrl.baseValue2 = 5e-16;
	unittestctrl.fieldLabel2 = "some length 2";
	unittestctrl.min2 = 0;
	
	//console.log(unittestctrl);
}
	
})();