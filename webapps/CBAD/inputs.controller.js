(function () {
"use strict";

angular.module('CBAD')
.controller('InputsController', InputsController);

InputsController.$inject = ['$state', '$rootScope'];
function InputsController($state, $rootScope) {
	let inputsCtrl = this;
	
	inputsCtrl.setup = async function()
	{
		// get the data
		let response = await fetch('data.json');
		// get the json objects
		inputsCtrl.database = await response.json();
		// put the search options in the page
		let columnData = await fetch('columnData.json');
		inputsCtrl.columnsDatabase = await columnData.json();
		//console.log(inputsCtrl.columnsDatabase.ColumnData);
		
		//setup search variables
		inputsCtrl.columnsDatabase.ColumnData.forEach(function(column){
			column.displayColumnInResults = false;
			switch(column.Type){
				case "string": 
					column.searchstring ="";
					column.ischecked = false;
					column.updateCheck = function(ischecked){
						column.ischecked = ischecked;
						console.log('change checked');
					};
					column.updateSearchString = function(searchstring){
						column.searchstring = searchstring;
						console.log('change search string');
					};
					column.isColumnChecked = function(){
						return column.ischecked;
					};						
					break;
				case "enum":
					column.enumValues = inputsCtrl.database[column.ForeignTableName].slice();
					column.enumValues.forEach(function(value){
						value.ischecked = false;
						value.label = value[column.ForeignColumnName];
						value.updateCheck = function(ischecked){
							value.ischecked = ischecked;
							console.log('value check changed');
						};						
					});
					column.isColumnChecked = function(){
						let ischecked = false;
						this.enumValues.forEach(function(value){
							if(value.ischecked) {
								ischecked = true;
							}
						});
						return ischecked;
					};						
					break;
				case 'int':
					column.isminchecked = false;
					column.ismaxchecked = false;
					column.step = 1;
					if(parseInt(column.ColumnMinimum) >= 0) {
						column.minvalue = parseInt(column.ColumnMinimum);
						column.maxvalue = column.minvalue;
						column.minvalue = column.minvalue;
					} else {
						column.maxvalue = 0;
						column.minvalue = 0;
					}
					column.updateMinCheck = function(ischecked){
						column.isminchecked = ischecked;
						console.log('change min checked');
					};
					column.updateMaxCheck = function(ischecked){
						column.ismaxchecked = ischecked;
						console.log('change max checked');
					};
					column.updateMinValue = function(minvalue){
						column.minvalue = minvalue;
						console.log('change minvalue');
					};
					column.updateMaxValue = function(maxvalue){
						column.maxvalue = maxvalue;
						console.log('change maxvalue');
					};
					column.isColumnChecked = function(){
						return column.isminchecked || column.ismaxchecked;
					};						
					break;
				case 'year':
					column.isminchecked = false;
					column.ismaxchecked = false;
					column.step = 1;
					if(parseInt(column.ColumnMinimum) >= 0) {
						column.minvalue = parseInt(column.ColumnMinimum);
						column.maxvalue = column.minvalue;
						column.minvalue = column.minvalue;
					} else {
						column.maxvalue = 1990;
						column.minvalue = 1990;
					}
					column.updateMinCheck = function(ischecked){
						column.isminchecked = ischecked;
						console.log('change min checked');
					};
					column.updateMaxCheck = function(ischecked){
						column.ismaxchecked = ischecked;
						console.log('change max checked');
					};
					column.updateMinValue = function(minvalue){
						column.minvalue = minvalue;
						console.log('change minvalue');
					};
					column.updateMaxValue = function(maxvalue){
						column.maxvalue = maxvalue;
						console.log('change maxvalue');
					};
					column.isColumnChecked = function(){
						return column.isminchecked || column.ismaxchecked;
					};						
					break;
				case 'double':
					column.isminchecked = false;
					column.ismaxchecked = false;
					column.step = "any";
					if(parseInt(column.ColumnMinimum) >= 0) {
						column.minvalue = parseInt(column.ColumnMinimum);
						column.maxvalue = column.minvalue;
						column.minvalue = column.minvalue;
					} else {
						column.maxvalue = 0.0;
						column.minvalue = 0.0;
					}
					column.updateMinCheck = function(ischecked){
						column.isminchecked = ischecked;
						console.log('change min checked');
					};
					column.updateMaxCheck = function(ischecked){
						column.ismaxchecked = ischecked;
						console.log('change max checked');
					};
					column.updateMinValue = function(minvalue){
						column.minvalue = minvalue;
						console.log('change minvalue');
					};
					column.updateMaxValue = function(maxvalue){
						column.maxvalue = maxvalue;
						console.log('change maxvalue');
					};
					column.isColumnChecked = function(){
						return column.isminchecked || column.ismaxchecked;
					};
					if(column.units != 'none')
					{
						column.maxlabel = "Maximum";
						column.minlabel = "Minimum";
						switch(column.units) {
							case 'Area':
								column.unitStrings = CONTAM.Units.Strings2.Area;
								column.unitFunction = CONTAM.Units.AreaConvert;
								column.conversion = 0;
							 break;
							case 'VolArea':
								column.unitStrings = CONTAM.Units.Strings2.FlowPerArea;
								column.unitFunction = CONTAM.Units.FlowPerAreaConvert;
								column.conversion = 2;
							 break;
							case 'Volume':
								column.unitStrings = CONTAM.Units.Strings2.Volume;
								column.unitFunction = CONTAM.Units.VolumeConvert;
								column.conversion = 0;
							 break;
						}
					}
					break;
					
			}
		});
		
		$rootScope.$digest();
	}
	inputsCtrl.setup();

	inputsCtrl.calculateQStats = function(searchResults) {
		let stats = {maxQ: -1, minQ: 1000, sumQ: 0, countQ: 0, avgQ:0, stdQ: 0};
		let Qs = [];

		for(let searchResultIndex=0; searchResultIndex <searchResults.length; ++searchResultIndex) {
			var Q = searchResults[searchResultIndex]["Q"];
			Qs.push(Q);
			if(Q > stats.maxQ)
			{
			  stats.maxQ = Q;
			}
			if(Q < stats.minQ && Q >=0)
			{
			  stats.minQ = Q;
			}
			stats.sumQ += Q;
			stats.countQ++;
		}
		stats.avgQ = stats.sumQ / stats.countQ;

		let sumDiff = 0;
		for(let index=0; index <Qs.length; ++index)	{
			sumDiff += Math.pow(Qs[index] - stats.avgQ, 2);
		}
		let avgDiff = sumDiff / stats.countQ;
		stats.stdQ = Math.sqrt(avgDiff);

		return stats;
	};

	inputsCtrl.gatherFrequencyData = function(searchResults)
	{
		// put Q's in bins 0-1, 1-2, 2-3, 3-4, 4-5, 5+
		let bins = [["frequency chart", "frequency", "cumulative frequency"], 
			["0-1", 0, 0], ["1-2", 0, 0], ["2-3", 0, 0], 
			["3-4", 0, 0], ["4-5", 0, 0], ["5+", 0, 0]];

		for(let searchResultIndex=0; searchResultIndex <searchResults.length; ++searchResultIndex)	{
			var Q = searchResults[searchResultIndex]["Q"];
			// add counts
			if(Q < 1) {
				bins[1][1]++;
			} else if(Q < 2) {
				bins[2][1]++;
			} else if(Q < 3) {
				bins[3][1]++;
			} else if(Q < 4) {
				bins[4][1]++;
			} else if(Q < 5) {
				bins[5][1]++;
			} else {
				bins[6][1]++;
			}
			// add cumulative counts
			if(Q < 1) {
				bins[1][2]++;
			}
			if(Q < 2) {
				bins[2][2]++;
			}
			if(Q < 3) {
				bins[3][2]++;
			}
			if(Q < 4) {
				bins[4][2]++;
			}
			if(Q < 5) {
				bins[5][2]++;
			}
			bins[6][2]++;
		}
		return bins;
	};
	
	inputsCtrl.search = function()
	{
		// array to hold search results
		// initialize with a copy of the rows from the data table
		let searchResults = inputsCtrl.database["Data"].slice(0);

		inputsCtrl.columnsDatabase.ColumnData.forEach(function(columnData) {
		
			switch(columnData.Type)
			{
				case "string":
					if(!columnData.ischecked) {
						columnData.displayColumnInResults = false;
						return;
					}
					columnData.displayColumnInResults = true;
					var index = searchResults.length;
					while(index--)
					{
					  // test if the search column contains the search string
					  if(!searchResults[index][columnData.ColumnName].toLowerCase().includes(columnData.searchstring))
					  {
						// if not then remove from the search results
						searchResults.splice(index, 1);
					  }
					}
					break;
				case "year":
					if(!columnData.isminchecked && !columnData.ismaxchecked) {
						columnData.displayColumnInResults = false;
						return;
					}
					columnData.displayColumnInResults = true;
					if(columnData.isminchecked && columnData.ismaxchecked)
					{
					  var index = searchResults.length;
					  while(index--)
					  {
						// test if the search column contains the search string
						if(searchResults[index][columnData.ColumnName] < columnData.minvalue ||
						searchResults[index][columnData.ColumnName] > columnData.maxvalue ||
						searchResults[index][columnData.ColumnName] == 9999)
						{
						  // if not then remove from the search results
						  searchResults.splice(index, 1);
						}
					  }
					}
					else if(columnData.isminchecked)
					{
					  var index = searchResults.length;
					  while(index--)
					  {
						// test if the search column contains the search string
						if(searchResults[index][columnData.ColumnName] < columnData.minvalue ||
						searchResults[index][columnData.ColumnName] == 9999)
						{
						  // if not then remove from the search results
						  searchResults.splice(index, 1);
						}
					  }
					}
					else if(columnData.ismaxchecked)
					{
					  var index = searchResults.length;
					  while(index--)
					  {
						// test if the search column contains the search string
						if(searchResults[index][columnData.ColumnName] > columnData.maxvalue ||
						searchResults[index][columnData.ColumnName] == 9999)
						{
						  // if not then remove from the search results
						  searchResults.splice(index, 1);
						}
					  }
					}
					break;
				case "int":
				case "double":
					if(!columnData.isminchecked && !columnData.ismaxchecked) {
						if(columnData.ColumnName == 'Q') {
							columnData.displayColumnInResults = true;
						} else {
							columnData.displayColumnInResults = false;
						}
						return;
					}
					columnData.displayColumnInResults = true;
					if(columnData.isminchecked && columnData.ismaxchecked)
					{
					  var index = searchResults.length;
					  while(index--)
					  {
						// test if the search column contains the search string
						if(searchResults[index][columnData.ColumnName] < columnData.minvalue ||
						searchResults[index][columnData.ColumnName] > columnData.maxvalue)
						{
						  // if not then remove from the search results
						  searchResults.splice(index, 1);
						}
					  }
					}
					else if(columnData.isminchecked)
					{
					  var index = searchResults.length;
					  while(index--)
					  {
						// test if the search column contains the search string
						if(searchResults[index][columnData.ColumnName] < columnData.minvalue)
						{
						  // if not then remove from the search results
						  searchResults.splice(index, 1);
						}
					  }
					}
					else if(columnData.ismaxchecked)
					{
					  var index = searchResults.length;
					  while(index--)
					  {
						// test if the search column contains the search string
						if(searchResults[index][columnData.ColumnName] > columnData.maxvalue)
						{
						  // if not then remove from the search results
						  searchResults.splice(index, 1);
						}
					  }
					}
					break;
				case "enum":
					// make sure some value for this column is checked 
					let noneChecked = true;
					columnData.enumValues.forEach(function(value){
						if(value.ischecked)
							noneChecked = false;
					});				
					if(noneChecked) {
						columnData.displayColumnInResults = false;
						return;
					}
					columnData.displayColumnInResults = true;
					var index = searchResults.length;
					while(index--)
					{
						// get the column value for this row
						let rowValue = searchResults[index][columnData.ColumnName];
						columnData.enumValues.forEach(function(value){
							if(value.ID == rowValue && !value.ischecked)
								searchResults.splice(index, 1);
						});				
						
					}
					break;
			}
	  
		}); // end foreach
		let stats = inputsCtrl.calculateQStats(searchResults);
		let chartdata = inputsCtrl.gatherFrequencyData(searchResults);
		//inputsCtrl.drawChart();
		$state.go('results', {searchResults: searchResults, ColumnData: inputsCtrl.columnsDatabase.ColumnData, stats: stats, 
			chartdata: chartdata, database: inputsCtrl.database});

	};

}

})();