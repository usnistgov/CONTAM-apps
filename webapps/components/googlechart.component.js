(function () {
"use strict";

angular.module('chart', [])
.component('googlechart', {
	templateUrl: '/CONTAM-apps/webapps/components/googlechart.template.html',
	bindings: {
		options: '<',
		charttype: '@',
		chartdata: '<'
	},
	controllerAs: 'gchartcontroller',	
	controller: ['$scope', '$window', function($scope, $window) {
		let gchartcontroller = this;
		gchartcontroller.drawChart = function() {
			if(gchartcontroller.chartdata != undefined)
			{
				let data = google.visualization.arrayToDataTable(gchartcontroller.chartdata);
				let view = new google.visualization.DataView(data);
				let chart;
				let chartDiv = document.getElementById('chartdiv');
				
				switch(gchartcontroller.charttype)
				{
					case 'columnchart': 
						chart = new google.visualization.ColumnChart(chartDiv);
						break;
					case 'linechart': 
						chart = new google.visualization.LineChart(chartDiv);
						break;
						
					default:
						console.log('invalid chart type');
						return;
				}
				chart.draw(view, gchartcontroller.options);
			}			
		};

		gchartcontroller.$onInit = function() {
			google.charts.load('current', {'packages':['corechart']});
			google.charts.setOnLoadCallback(gchartcontroller.drawChart);
		};
		
		angular.element($window).on("resize", function() {
			gchartcontroller.drawChart();
		});
		
		// watch the chartdata variable
		// redraw the chart if it changes
		$scope.$watch(function() { return gchartcontroller.chartdata },
              function(newValue, oldValue) {
				console.log('watch chartdata');
				console.log("newvalue: ");
				console.log(newValue);
				console.log("oldvalue: ");
				console.log(oldValue);
				if(newValue !== oldValue) {
					gchartcontroller.drawChart();
				} 
              }
		);		
		
		// watch the chartoptions variable
		// redraw the chart if it changes
		$scope.$watch(function() { return gchartcontroller.options },
              function(newValue, oldValue) {
				console.log('watch options: ' + newValue + ", " + oldValue);
				if(newValue !== oldValue) {
					gchartcontroller.drawChart();
				} 
              }
		);		
	}]
});

})();