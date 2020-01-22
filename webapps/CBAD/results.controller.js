(function () {
"use strict";

angular.module('CBAD')
.controller('ResultsController', ResultsController);

ResultsController.$inject = ['$stateParams'];
function ResultsController($stateParams) {
	var resultsCtrl = this;

	resultsCtrl.searchResults = $stateParams.searchResults;
	resultsCtrl.ColumnData = $stateParams.ColumnData;
	resultsCtrl.stats = $stateParams.stats;
	resultsCtrl.chartdata = $stateParams.chartdata;
	resultsCtrl.database = $stateParams.database;
	resultsCtrl.chartoptions = {
      title: 'Q Counts Frequency Plot',
      hAxis: {title: "Bin (L/s · m²)"},
      legend: { position: 'bottom' },
      vAxis: { title: "Number of occurrences" },
    };
	resultsCtrl.foreignTableLookup = function(row, column) {
		
		let table = resultsCtrl.database[column.ForeignTableName];
		let entry = table.find(function(entry) {	return entry.ID == row[column.ColumnName] })
		return entry[column.ForeignColumnName];
	};
	
	// entries is an array of data
	//put commas bewteen the entries and an end of line at the end
	resultsCtrl.addCommas = function(entries) {
		let result = "";
		entries.forEach(function(entry) {
			result += entry + ",";
		});
		return result;
	};
	
	// entries is an array of arrays of data
	// use the addCommas function on each of the sub arrays
	resultsCtrl.AddLinesAndCommas = function(entries) {
		let result = "";
		entries.forEach(function(entry){
			result += resultsCtrl.addCommas(entry);
			result += "\n";
		});
		return result;
	};
	
	resultsCtrl.createReport = function() {
		let report = [];
		report.push(['Search Parameters']);
		let line2 = [];
		let line3 = [];
		resultsCtrl.ColumnData.forEach(function(column){
			if(column.isColumnChecked()) {
				line2.push(column.ColumnDisplayName);
				switch(column.Type)
				{
					case 'int':
					case 'year':
					{
						let entry = '';
						if(column.isminchecked) {
							entry += " greater than or equal to " + column.minvalue;
						}				
						if(column.isminchecked) {
							entry += " less than or equal to " + column.maxvalue;
						}				
						line3.push(entry);
						break;
					}
					case 'double':
					{
						let entry = '';
						if(column.isminchecked) {
							entry += " greater than or equal to " + column.minvalue.toFixed(2);
						}				
						if(column.isminchecked) {
							entry += " less than or equal to " + column.maxvalue.toFixed(2);
						}				
						line3.push(entry);
						break;
					}
					case 'string':
						line3.push("contains: " + column.searchstring);
						break;
					case 'enum':
						let entries = 'equals one of:';
						column.enumValues.forEach(function(entry){
							if(entry.ischecked) {
								entries += " " + entry.label + ",";
							}
						});
						entries = entries.substring(0, entries.length - 1);
						line3.push(entries);
						break;
				}
			}
		});
		report.push(line2, line3, []);
		report.push(['Results']);
		report.push(['Q Statistics']);
		report.push(['Number of Buildings', 'Maximum', 'Minimum', 'Average', 'Standard Deviation']);
		report.push([resultsCtrl.stats.countQ, resultsCtrl.stats.maxQ.toFixed(2), resultsCtrl.stats.minQ.toFixed(2), 
			resultsCtrl.stats.avgQ.toFixed(2), resultsCtrl.stats.stdQ.toFixed(2)]);
		let tableheaderline = [];
		resultsCtrl.ColumnData.forEach(function(column){
			if(column.displayColumnInResults) {
				tableheaderline.push(column.ColumnDisplayName);
			}
		});
		report.push([], tableheaderline);
		resultsCtrl.searchResults.forEach(function(result) {
			let line = [];
			resultsCtrl.ColumnData.forEach(function(column){
				if(column.displayColumnInResults) {
					if(column.ForeignTableName != 'none') {
						line.push(resultsCtrl.foreignTableLookup(result, column));
						
					} else {
						line.push(result[column.ColumnName]);
					}
				}				
			});
			report.push(line);
		});
		report.push([]);
		report.push(['', 'Frequency', 'Cumulative Frequency']);
		report.push(['bin 0-1', resultsCtrl.chartdata[1][1], resultsCtrl.chartdata[1][2]]);
		report.push(['bin 1-2', resultsCtrl.chartdata[2][1], resultsCtrl.chartdata[2][2]]);
		report.push(['bin 2-3', resultsCtrl.chartdata[3][1], resultsCtrl.chartdata[3][2]]);
		report.push(['bin 3-4', resultsCtrl.chartdata[4][1], resultsCtrl.chartdata[4][2]]);
		report.push(['bin 4-5', resultsCtrl.chartdata[5][1], resultsCtrl.chartdata[5][2]]);
		report.push(['bin 5+', resultsCtrl.chartdata[6][1], resultsCtrl.chartdata[6][2]]);
		
		let reportText = resultsCtrl.AddLinesAndCommas(report);
		// create link to and click it to prompt saving results file
		// \ufeff is trick from the web to get excel to handle the data correctly
		var textFileAsBlob = new Blob(["\ufeff", reportText], {type:'text/plain;charset=UTF-8'});
		var savelink = document.createElement("a");
		savelink.download = "Airtightness_Results.txt";
		savelink.href = window.URL.createObjectURL(textFileAsBlob);
		document.body.appendChild(savelink);		
		savelink.click();
		document.body.removeChild(savelink);
	};
}

})();