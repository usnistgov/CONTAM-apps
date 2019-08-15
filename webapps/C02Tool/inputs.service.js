(function () {
"use strict";

angular.module('CO2')
.service('InputsService', InputsService);

//InputsService.$inject = ['$http', 'ApiPath'];
function InputsService() {
  var service = this;

  service.setInputs = function (inputs) {
	  service.inputs = inputs;
  };
  
  service.hasInputs = function() {
	  return service.inputs != undefined;
  }
  
  service.getInputs = function() {
	  return service.inputs;
  }
}



})();
