(function () {
"use strict";

angular.module('CO2')
.component('grouplist', {
  templateUrl: 'grouplist.html',
  bindings: {
    grouplist: '<',
    onRemove: '&'
  }
});

})();
