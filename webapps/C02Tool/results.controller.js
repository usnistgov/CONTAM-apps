(function () {
"use strict";

angular.module('CO2')
.controller('ResultsController', ResultsController);

ResultsController.$inject = ['$stateParams'];
function ResultsController($stateParams) {
	var resultsCtrl = this;

	resultsCtrl.results = $stateParams.results;
	resultsCtrl.inputs = $stateParams.inputs;
	
	if(resultsCtrl.inputs.SpaceCategory =='com') {
		if(resultsCtrl.inputs.SpaceTypeType == "pre"){
			// convert from L/s to kg/s
			let ventRate = CONTAM.Units.FlowConvert(resultsCtrl.inputs.commercial.predefined.ventilationRate, 2, 1); 
			resultsCtrl.ventilationRate = {baseValue: ventRate, conversion: 2, label: "Primary Ventilation per Person",
				unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
			resultsCtrl.altVentilationRate = resultsCtrl.inputs.commercial.predefined.altVentilationRate;
			// convert to kg/kg
			let CO2Outdoor = CONTAM.Units.Concen_M_Convert(resultsCtrl.inputs.commercial.predefined.CO2Outdoor, 
				11, 1, resultsCtrl.inputs.commercial.CO2Outdoor.species);
			let initialCO2Indoor = CONTAM.Units.Concen_M_Convert(resultsCtrl.inputs.commercial.predefined.initialCO2Indoor, 
				11, 1, resultsCtrl.inputs.commercial.initialCO2Indoor.species);
			resultsCtrl.CO2Outdoor = {baseValue: CO2Outdoor, conversion: 11, label: "Outdoor CO2 Concentration", 
				unitStrings: CONTAM.Units.Strings2.Concentration_M, unitFunction: CONTAM.Units.Concen_M_Convert,
				min: 0, species: resultsCtrl.inputs.CO2Species};
			resultsCtrl.initialCO2Indoor = {baseValue: initialCO2Indoor, conversion: 11, label: "Initial Indoor CO2 Concentration",
				unitStrings: CONTAM.Units.Strings2.Concentration_M, unitFunction: CONTAM.Units.Concen_M_Convert, 
				min: 0, species: resultsCtrl.inputs.CO2Species};
			resultsCtrl.ceilingHeight = {baseValue: resultsCtrl.inputs.commercial.predefined.ceilingHeight, conversion: 0, label: "Ceiling Height", 
				unitStrings: CONTAM.Units.Strings2.Length, unitFunction: CONTAM.Units.LengthConvert, min: 0};
			// convert to s	
			let timeToMetric = CONTAM.Units.TimeConvert(resultsCtrl.inputs.commercial.predefined.timeToMetric, 2, 1)
			resultsCtrl.timeToMetric = {baseValue: timeToMetric, conversion: 2, label: "Time to Metric",
				unitStrings: CONTAM.Units.Strings2.Time, unitFunction: CONTAM.Units.TimeConvert, min: 1};
			resultsCtrl.occupantDensity = resultsCtrl.inputs.commercial.predefined.occupantDensity;
			resultsCtrl.occupants = resultsCtrl.inputs.commercial.predefined.occupants.slice();
			// this will make the grouplist not show the remove occupants button
			resultsCtrl.occupants.showRemove = false;
			
			resultsCtrl.inputs.buildingName = "Predefined_Commercial_Building_" + resultsCtrl.inputs.preDefinedSpaceTypeSelection;
		} else {
			resultsCtrl.ventilationRate = resultsCtrl.inputs.commercial.ventilationRate;
			resultsCtrl.altVentilationRate = resultsCtrl.inputs.commercial.altVentilationRate;
			resultsCtrl.initialCO2Indoor = resultsCtrl.inputs.commercial.initialCO2Indoor;
			resultsCtrl.CO2Outdoor = resultsCtrl.inputs.commercial.CO2Outdoor;
			resultsCtrl.ceilingHeight = resultsCtrl.inputs.commercial.ceilingHeight;
			resultsCtrl.timeToMetric = resultsCtrl.inputs.commercial.timeToMetric;
			resultsCtrl.occupantDensity = resultsCtrl.inputs.commercial.userOccupantDensity;
			resultsCtrl.occupants = resultsCtrl.inputs.commercial.occupants.slice();
			// this will make the grouplist not show the remove occupants button
			resultsCtrl.occupants.showRemove = false;
		}		
	} else {
		if(resultsCtrl.inputs.SpaceTypeType == "pre"){
			// convert from mg/m3 to kg/kg
			let ventRate = CONTAM.Units.FlowConvert(resultsCtrl.inputs.residential.predefined.ventilationRate, 2, 1); 
			resultsCtrl.ventilationRate = {baseValue: ventRate, conversion: 2, label: "Primary Ventilation per Person",
				unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
			resultsCtrl.altVentilationRate = resultsCtrl.inputs.residential.predefined.altVentilationRate;
			// convert to kg/kg
			let CO2Outdoor = CONTAM.Units.Concen_M_Convert(resultsCtrl.inputs.residential.predefined.CO2Outdoor, 
				11, 1, resultsCtrl.inputs.residential.CO2Outdoor.species);
			let initialCO2Indoor = CONTAM.Units.Concen_M_Convert(resultsCtrl.inputs.residential.predefined.initialCO2Indoor, 
				11, 1, resultsCtrl.inputs.residential.initialCO2Indoor.species);
			resultsCtrl.CO2Outdoor = {baseValue: CO2Outdoor, conversion: 11, label: "Outdoor CO2 Concentration", 
				unitStrings: CONTAM.Units.Strings2.Concentration_M, unitFunction: CONTAM.Units.Concen_M_Convert,
				min: 0, species: resultsCtrl.inputs.CO2Species};
			resultsCtrl.initialCO2Indoor = {baseValue: initialCO2Indoor, conversion: 11, label: "Initial Indoor CO2 Concentration",
				unitStrings: CONTAM.Units.Strings2.Concentration_M, unitFunction: CONTAM.Units.Concen_M_Convert, 
				min: 0, species: resultsCtrl.inputs.CO2Species};			
			resultsCtrl.ceilingHeight = {baseValue: resultsCtrl.inputs.residential.predefined.ceilingHeight, conversion: 0, label: "Ceiling Height", 
				unitStrings: CONTAM.Units.Strings2.Length, unitFunction: CONTAM.Units.LengthConvert, min: 0};
			resultsCtrl.floorArea = {baseValue: resultsCtrl.inputs.residential.predefined.floorArea, conversion: 0, label: "Building Floor Area", 
				unitStrings: CONTAM.Units.Strings2.Area, unitFunction: CONTAM.Units.AreaConvert, min: 1};
			// convert to s	
			let timeToMetric = CONTAM.Units.TimeConvert(resultsCtrl.inputs.residential.predefined.timeToMetric, 2, 1)
			resultsCtrl.timeToMetric = {baseValue: timeToMetric, conversion: 2, label: "Time to Metric",
				unitStrings: CONTAM.Units.Strings2.Time, unitFunction: CONTAM.Units.TimeConvert, min: 1};
			resultsCtrl.occupants =	resultsCtrl.inputs.residential.predefined.occupants.slice();
			// this will make the grouplist not show the remove occupants button
			resultsCtrl.occupants.showRemove = false;
			resultsCtrl.method = resultsCtrl.inputs.residential.predefined.method;
			resultsCtrl.scenario = resultsCtrl.inputs.residential.predefined.scenario;
			resultsCtrl.bedroomNumPeople = resultsCtrl.inputs.countOccupants(resultsCtrl.inputs.residential.predefined.occupants);
			resultsCtrl.roomFloorArea = {baseValue: resultsCtrl.inputs.residential.predefined.bedFloorArea, conversion: 0, label: "Building Floor Area", 
				unitStrings: CONTAM.Units.Strings2.Area, unitFunction: CONTAM.Units.AreaConvert, min: 1};
			resultsCtrl.houseNumPeople = resultsCtrl.inputs.residential.predefined.numWholeOccupants;
			resultsCtrl.numBedrooms = resultsCtrl.inputs.residential.predefined.numBedrooms;
			resultsCtrl.inputs.buildingName = "Predefined_Residential_Building_" + resultsCtrl.inputs.preDefinedResSpaceTypeSelection;
		} else {
			resultsCtrl.altVentilationRate = resultsCtrl.inputs.residential.altVentilationRate;
			resultsCtrl.initialCO2Indoor = resultsCtrl.inputs.residential.initialCO2Indoor;
			resultsCtrl.CO2Outdoor = resultsCtrl.inputs.residential.CO2Outdoor;
			resultsCtrl.ceilingHeight = resultsCtrl.inputs.residential.ceilingHeight;
			resultsCtrl.floorArea = resultsCtrl.inputs.residential.floorArea;
			resultsCtrl.timeToMetric = resultsCtrl.inputs.residential.timeToMetric;
			resultsCtrl.scenario = resultsCtrl.inputs.residential.resType;
			resultsCtrl.houseNumPeople = resultsCtrl.inputs.residential.houseNumPeople;
			resultsCtrl.numBedrooms = resultsCtrl.inputs.residential.numBedrooms;
			if(resultsCtrl.inputs.residential.resType == 'whole') {
				if(resultsCtrl.inputs.residential.wholeVentType == '62.2'){
					let ventilationRate = CONTAM.Units.FlowConvert(resultsCtrl.inputs.calc622value / resultsCtrl.inputs.residential.houseNumPeople, 2, 1);
					resultsCtrl.ventilationRate = {baseValue: ventilationRate, conversion: 2, label: "Primary Ventilation per Person",
						unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
				} else {
					let ventilationRate = CONTAM.Units.FlowConvert((resultsCtrl.inputs.residenytial.wholeACH * volumeOfBldg / 3.6) / resultsCtrl.inputs.residential.houseNumPeople, 2, 1);
					resultsCtrl.ventilationRate = {baseValue: ventilationRate, conversion: 2, label: "Primary Ventilation per Person",
						unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
				}
				resultsCtrl.occupants =	resultsCtrl.inputs.residential.house_occupants.slice();
				resultsCtrl.method = resultsCtrl.inputs.residential.wholeVentType;
			} else {
				if(resultsCtrl.inputs.residential.roomVentType == 'perfect') {
					let ventilationRate = CONTAM.Units.FlowConvert(resultsCtrl.inputs.calc622PerfectValue, 2, 1);
					resultsCtrl.ventilationRate = {baseValue: ventilationRate, conversion: 2, label: "Primary Ventilation per Person",
						unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
				} else if(resultsCtrl.inputs.roomVentType == 'uniform') {
					let ventilationRate = CONTAM.Units.FlowConvert(resultsCtrl.inputs.calc622UniformValue / resultsCtrl.inputs.residential.bedroomNumPeople, 2, 1);
					resultsCtrl.ventilationRate = {baseValue: ventilationRate, conversion: 2, label: "Primary Ventilation per Person",
						unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
				} else {
					// convert from kg/s to L/s
					resultsCtrl.ventilationRate = resultsCtrl.inputs.residential.roomVentilationRate;
				}
				resultsCtrl.occupants =	resultsCtrl.inputs.residential.bedroom_occupants.slice();
				resultsCtrl.method = resultsCtrl.inputs.residential.roomVentType;
				resultsCtrl.bedroomNumPeople = resultsCtrl.inputs.residential.bedroomNumPeople;
				resultsCtrl.roomFloorArea = resultsCtrl.inputs.residential.roomFloorArea;
				resultsCtrl.reduceVentilationRate = resultsCtrl.inputs.residential.reduceVentilationRate;
			}
			// this will make the grouplist not show the remove occupants button
			resultsCtrl.occupants.showRemove = false;
		}		
	}
	//console.log(resultsCtrl);
	// setup chart
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
	createPlotData(resultsCtrl);
	
	function drawChart(){
		var vaxisTitle = "Concentration [mg/m^3]";
		var haxisTitle = "Time [h]";
		var options = {
		  title: 'CO2 Chart',
		  curveType: 'function',
		  hAxis: {title: haxisTitle},
		  legend: { position: 'bottom' },
		  vAxis: { title: vaxisTitle }
		};
		var data = google.visualization.arrayToDataTable(resultsCtrl.chartData);
		var view = new google.visualization.DataView(data);

		var chart = new google.visualization.LineChart(document.getElementById('CO2_Chart'));

		chart.draw(view, options);
	}
	
	resultsCtrl.createReport = function () {
				
		//	create output file
		let resultFileContents = "";
		let type;
		if(resultsCtrl.inputs.SpaceTypeType == "pre"){
			type = "Predefined ";
		} else {
			type = "User-Defined ";
		}
		if(resultsCtrl.inputs.SpaceCategory =='com'){
			resultFileContents += type + "Commcercial Building\n";
		} else {
			resultFileContents += type + "Residential Building\n";
		}		
		resultFileContents += "Inputs + Space Description\n";
		resultFileContents += "Outdoor CO2 Concentration (mg/m^3)\tInitial Indoor CO2 Concentration (mg/m^3)\t" +
			"Ceiling Height (m)\tTime to Metric (h)\tPrimary Ventilation Rate (L/s person)\tAlternate Ventilation Rate(L/s person)";
		if(resultsCtrl.inputs.SpaceCategory =='res'){
			resultFileContents += "\tBuilding Floor Area (m^2)";
		}
		if(resultsCtrl.inputs.SpaceCategory =='com'){
			resultFileContents += "\tOccupant Density (#/100 m^2)";
		}
		resultFileContents += "\n";
		
		// convert CO2 to mg/m^3
		let CO2Outdoor_mg_per_m3 = CONTAM.Units.Concen_M_Convert(resultsCtrl.CO2Outdoor.baseValue, 
			11, 0, resultsCtrl.CO2Outdoor.species);
		let CO2Indoor_mg_per_m3 = CONTAM.Units.Concen_M_Convert(resultsCtrl.initialCO2Indoor.baseValue, 
			11, 0, resultsCtrl.initialCO2Indoor.species);
		
		// convert to L/s
		let altVentilationRate = CONTAM.Units.FlowConvert(resultsCtrl.altVentilationRate.baseValue, 2, 0);
		let ventilationRate = CONTAM.Units.FlowConvert(resultsCtrl.ventilationRate.baseValue, 2, 0);
		
		// convert to h
		let timeToMetric = CONTAM.Units.TimeConvert(resultsCtrl.timeToMetric.baseValue, 2, 0);			
		resultFileContents += CO2Outdoor_mg_per_m3.toFixed(0) + "\t" + CO2Indoor_mg_per_m3.toFixed(0) + "\t" +
			resultsCtrl.ceilingHeight.baseValue.toFixed(1) + "\t" + timeToMetric.toFixed(1) + "\t" + 
			ventilationRate.toFixed(1) + "\t" + altVentilationRate.toFixed(1);
		if(resultsCtrl.inputs.SpaceCategory =='com'){
			resultFileContents += "\t" + resultsCtrl.occupantDensity.toFixed(0)
		}
		if(resultsCtrl.inputs.SpaceCategory =='res'){
			resultFileContents += "\t" + resultsCtrl.floorArea.baseValue.toFixed(0)
		}
		resultFileContents += "\n\n";
		
		if(resultsCtrl.inputs.SpaceCategory =='res'){
			resultFileContents += "Scenario\tMethod\tNumber of Occupants in House\tNumber of Bedrooms";
			if(resultsCtrl.scenario != 'whole') {
				resultFileContents += "\tBedroom Floor Area (m^2)\tNumber of Occupants in Bedroom\tReduced Ventilation to Bedroom (L/s)\n";
			} else {
				resultFileContents += "\n";
			}			
			resultFileContents += resultsCtrl.scenario + "\t" + resultsCtrl.method + "\t" +	resultsCtrl.houseNumPeople.toFixed(0) + "\t" +
				resultsCtrl.numBedrooms.toFixed(0);
			if(resultsCtrl.scenario != 'whole') {
				resultFileContents +=  "\t" + resultsCtrl.roomFloorArea.baseValue.toFixed(1) + "\t" +
					resultsCtrl.bedroomNumPeople.toFixed(0) + "\t" + resultsCtrl.reduceVentilationRate.baseValue.toFixed(1) + "\n\n";
			} else {
				resultFileContents += "\n\n";
			}	
		}		
			
		resultFileContents += "Occupants\n";
		resultFileContents += "Number of Occupants\tSex\tMass (kg)\tAge Group\tActivity Level (met)\n";
		for(let i=0; i<resultsCtrl.occupants.length; ++i) {
			resultFileContents += resultsCtrl.occupants[i].numPeople.toFixed(0) + "\t" + 
				resultsCtrl.occupants[i].sex + "\t" + 
				resultsCtrl.occupants[i].mass.toFixed(1) + "\t";
			var ageGroups = ["< 3\t", "3 to 9\t", "10 to 17\t", "18 to 29\t", "30 to 59\t", ">= 60\t"];
			resultFileContents += ageGroups[resultsCtrl.occupants[i].ageGroup];
			resultFileContents += resultsCtrl.occupants[i].met + "\n";
		}
		resultFileContents += "\nPrimary Results\n";
		resultFileContents += "Time to Steady State (h)\tCO2 concentration at Steady State (mg/m^3)\tCO2 Concentration at Time to Metric (mg/m^3)\t" +
			"CO2 Concentration at 1 hour (mg/m^3)\n";
		resultFileContents += resultsCtrl.results.base.timeToCSS.toFixed(1) + "\t" + resultsCtrl.results.base.Css.toFixed(0) + "\t" +
			resultsCtrl.results.base.c_at_metric.toFixed(0) + "\t" + resultsCtrl.results.base.c_at_h.toFixed(0) + "\n\n";

		resultFileContents += "Alternate  Results\n";
		resultFileContents += "Time to Steady State (h)\tCO2 concentration at Steady State (mg/m^3)\tCO2 Concentration at Time to Metric (mg/m^3)\t" +
			"CO2 Concentration at 1 hour (mg/m^3)\n";
		resultFileContents += resultsCtrl.results.alt.timeToCSS.toFixed(1) + "\t" + resultsCtrl.results.alt.Css.toFixed(0) + "\t" +
			resultsCtrl.results.alt.c_at_metric.toFixed(0) + "\t" + resultsCtrl.results.alt.c_at_h.toFixed(0) + "\n\n";

		resultFileContents += "Plot Data\n";
		resultFileContents += "Time (h)\tPrimary Concentration (mg/m^3)\tAlternate Concentration (mg/m^3)\n";
		for(var i=1; i<resultsCtrl.chartData.length; ++i) {
			resultFileContents +=  resultsCtrl.chartData[i][0].toFixed(2) + "\t" +
				resultsCtrl.chartData[i][1].toFixed(0) + "\t" +
				resultsCtrl.chartData[i][2].toFixed(0) + "\n";
		}
		
		// create link to and click it to prompt saving results file
		var textFileAsBlob = new Blob([resultFileContents], {type:'text/plain'});
		var savelink = document.createElement("a");
		savelink.download = resultsCtrl.inputs.buildingName + "_Results.txt";
		savelink.href = window.URL.createObjectURL(textFileAsBlob);
		document.getElementById("saveLinkInsert").appendChild(savelink);		
		savelink.click();
		document.getElementById("saveLinkInsert").removeChild(savelink);
	}

}

function createPlotData(resultsCtrl) {
	
	// create a chart data array
	resultsCtrl.chartData = [];

	// add labels to chart data
	resultsCtrl.chartData.push(["", "Primary CO2", "Alternate CO2"]);

	// add the data to the chart data
	resultsCtrl.results.points.forEach(row => {
		resultsCtrl.chartData.push([row.time, row.value, row.altvalue]);
	});
}

})();