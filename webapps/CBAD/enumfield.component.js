(function () {
"use strict";

angular.module('CBAD')
.component('enumfield', {
  templateUrl: 'enumfield.template.html',
  bindings: {
    label: '<',
	listofenums: '<',
	updateCheck: '&'
  }
});

})();
