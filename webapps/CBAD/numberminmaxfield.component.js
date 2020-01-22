(function () {
"use strict";

angular.module('CBAD')
.component('numberminmaxfield', {
  templateUrl: 'numberminmaxfield.template.html',
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
  }
});

})();
