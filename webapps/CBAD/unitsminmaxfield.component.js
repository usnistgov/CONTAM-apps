(function () {
"use strict";

angular.module('CBAD')
.component('unitsminmaxfield', {
  templateUrl: 'unitsminmaxfield.template.html',
  bindings: {
    label: '<',
	min: '<',
	max: '<',
	maxvalue: '<',
	minvalue: '<',
	isminchecked: '<',
	ismaxchecked: '<',	
	step: '<',
	updateMinCheck: '&',
	updateMaxCheck: '&',
	updateMinValue: '&',
	updateMaxValue: '&',
	maxlabel: '<',
	minlabel: '<',
	conversion: '=',
	unitStrings: '<',
	unitFunction: '<'
  }
});

})();
