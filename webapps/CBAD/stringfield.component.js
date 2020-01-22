(function () {
"use strict";

angular.module('CBAD')
.component('stringfield', {
  templateUrl: 'stringfield.template.html',
  bindings: {
    label: '<',
	searchstring: '<',
	ischecked: '<',
	updateCheck: '&',
	updateSearchString: '&'
  }
});

})();
