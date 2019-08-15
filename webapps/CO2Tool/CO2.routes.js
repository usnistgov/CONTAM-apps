(function() {
'use strict';

angular.module('CO2')
.config(routeConfig);

/**
 * Configures the routes and views
 */
routeConfig.$inject = ['$stateProvider'];
function routeConfig ($stateProvider) {
  // Routes
  $stateProvider
    .state('inputs', {
		url: '/',
		templateUrl: 'inputs.html',
		controller: 'InputsController',
		controllerAs: 'inputsCtrl'
    })
    .state('results', {
		templateUrl: 'results.html',
		controller: 'ResultsController',
		controllerAs: 'resultsCtrl',
		params: {
			'results': null,
			'inputs': null
		}
    });
}
})();