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
				1, 1, resultsCtrl.inputs.commercial.CO2Outdoor.species);
			resultsCtrl.CO2Outdoor = {baseValue: CO2Outdoor, conversion: 1, label: "Outdoor CO2 Concentration", 
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
			if(resultsCtrl.inputs.residential.resType == 'Whole House') {
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
				if(resultsCtrl.inputs.residential.roomVentType == 'Perfect') {
					let ventilationRate = CONTAM.Units.FlowConvert(resultsCtrl.inputs.calc622PerfectValue, 2, 1);
					resultsCtrl.ventilationRate = {baseValue: ventilationRate, conversion: 2, label: "Primary Ventilation per Person",
						unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
				} else if(resultsCtrl.inputs.roomVentType == 'Uniform') {
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
	createPlotData(resultsCtrl);
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
	
	function drawChart(){
		var vaxisTitle = "Concentration [ppm]";
		var haxisTitle = "Time [h]";
		var options = {
		  title: '',
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
	
	resultsCtrl.createReport = function () {
		let report = [];
				
		//	create output file
		let type;
		if(resultsCtrl.inputs.SpaceTypeType == "pre"){
			type = "Predefined ";
		} else {
			type = "User-Defined ";
		}
		let bname;
		if(resultsCtrl.inputs.SpaceTypeType == "pre"){
			if(resultsCtrl.inputs.SpaceCategory =='com'){
				bname = "Predefined_Commercial_Building_" + resultsCtrl.inputs.preDefinedSpaceTypeSelection;
			} else {
				bname = "Predefined_Residential_Building_" + resultsCtrl.inputs.preDefinedResSpaceTypeSelection;
			}
		} else {
			if(resultsCtrl.inputs.SpaceCategory =='com'){
				bname = resultsCtrl.inputs.commercial.buildingName;
			} else {
				bname = resultsCtrl.inputs.residential.buildingName;
			}		
		}
	
		if(resultsCtrl.inputs.SpaceCategory =='com'){
			report.push([type + "Commcercial Building"]);
		} else {
			report.push([type + "Residential Building"]);
		}		
		report.push(["Inputs + Space Description"]);
		let line = ["", "Co (mg/m\xB3)", "Ci (mg/m\xB3)", "HCeil (m)", "tmetric (h)", "Q (L/s person)", "Qalt (L/s person)"];
		if(resultsCtrl.inputs.SpaceCategory =='res'){
			line.push("Bfl (m\xB2)");
		}
		if(resultsCtrl.inputs.SpaceCategory =='com'){
			line.push("OccDens (#/100 m\xB2)");
		}
		report.push(line);
		
		// convert CO2 to mg/m\xB3
		let CO2Outdoor_mg_per_m3 = CONTAM.Units.Concen_M_Convert(resultsCtrl.CO2Outdoor.baseValue, 
			11, 0, resultsCtrl.CO2Outdoor.species);
		let CO2Indoor_mg_per_m3 = CONTAM.Units.Concen_M_Convert(resultsCtrl.initialCO2Indoor.baseValue, 
			11, 0, resultsCtrl.initialCO2Indoor.species);
		
		// convert to L/s
		let altVentilationRate = CONTAM.Units.FlowConvert(resultsCtrl.altVentilationRate.baseValue, 2, 0);
		let ventilationRate = CONTAM.Units.FlowConvert(resultsCtrl.ventilationRate.baseValue, 2, 0);
		
		// convert to h
		let timeToMetric = CONTAM.Units.TimeConvert(resultsCtrl.timeToMetric.baseValue, 2, 0);		
		line = ["", CO2Outdoor_mg_per_m3.toFixed(0), CO2Indoor_mg_per_m3.toFixed(0), 
			resultsCtrl.ceilingHeight.baseValue.toFixed(1), timeToMetric.toFixed(1),
			ventilationRate.toFixed(1), altVentilationRate.toFixed(1)];
		if(resultsCtrl.inputs.SpaceCategory =='com'){
			line.push(resultsCtrl.occupantDensity.toFixed(0));
		}
		if(resultsCtrl.inputs.SpaceCategory =='res'){
			line.push(resultsCtrl.floorArea.baseValue.toFixed(0));
		}
		report.push(line);
		report.push([]);
		
		if(resultsCtrl.inputs.SpaceCategory =='res'){
			line = ["Scenario", "Method", "NOccH", "Nbr"];
			if(resultsCtrl.scenario != 'Whole House') {
				line.push("Abr (m\xB2)", "Noccbr");
				if(resultsCtrl.inputs.SpaceTypeType == "user") {
					line.push("ReducedQbr (L/s)");
				}
			}			
			report.push(line);
			line = [resultsCtrl.scenario, resultsCtrl.method,	resultsCtrl.houseNumPeople.toFixed(0), resultsCtrl.numBedrooms.toFixed(0)];
			if(resultsCtrl.scenario != 'Whole House') {
				line.push(resultsCtrl.roomFloorArea.baseValue.toFixed(1),
					resultsCtrl.bedroomNumPeople.toFixed(0));
				if(resultsCtrl.inputs.SpaceTypeType == "user") {
					let reducedVentRate = CONTAM.Units.FlowConvert(resultsCtrl.reduceVentilationRate.baseValue, 2, 0);
					line.push(reducedVentRate.toFixed(1));
				}
			}
			report.push(line);	
			report.push([]);			
		}		
			
		report.push(["Occupants"]);
		report.push(["", "Nocc", "Sex", "Mass (kg)", "Age Group", "Activity Level (met)"]);
		let ageGroups = ["< 3", "3 to 9", "10 to 17", "18 to 29", "30 to 59", ">= 60"];
		for(let i=0; i<resultsCtrl.occupants.length; ++i) {
			report.push(["", resultsCtrl.occupants[i].numPeople.toFixed(0), resultsCtrl.occupants[i].sex, resultsCtrl.occupants[i].mass.toFixed(1),
				ageGroups[resultsCtrl.occupants[i].ageGroup], resultsCtrl.occupants[i].met]);
		}
		report.push([]);			
		
		report.push(["", "tss (h)", "Css (mg/m\xB3)", "Cm (mg/m\xB3)", "C1h (mg/m\xB3)"]);
		report.push(["Primary Results", resultsCtrl.results.base.timeToCSS.toFixed(1), resultsCtrl.results.base.Css.toFixed(0), 
			resultsCtrl.results.base.c_at_metric.toFixed(0), resultsCtrl.results.base.c_at_h.toFixed(0)]);
		report.push(["Alternate  Results", resultsCtrl.results.alt.timeToCSS.toFixed(1), resultsCtrl.results.alt.Css.toFixed(0),
			resultsCtrl.results.alt.c_at_metric.toFixed(0), resultsCtrl.results.alt.c_at_h.toFixed(0)]);
		report.push([]);			

		report.push(["Plot Data"]);
		report.push(["", "Time (h)", "C (mg/m\xB3)", "Calt (mg/m\xB3)"]);
		for(var i=1; i<resultsCtrl.chartData.length; ++i) {
			report.push(["", resultsCtrl.chartData[i][0].toFixed(2), 
				resultsCtrl.chartData[i][1].toFixed(0), resultsCtrl.chartData[i][2].toFixed(0)]);
		}
		let reportText = resultsCtrl.AddLinesAndCommas(report);
		
		// create link to and click it to prompt saving results file
		var textFileAsBlob = new Blob(["\ufeff", reportText], {type:'text/plain'});
		var savelink = document.createElement("a");
		savelink.download = bname + "_Results.txt";
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
	resultsCtrl.chartData.push(["", "Primary Ventilation Rate", "Alternate Ventilation Rate"]);

	// add the data to the chart data
	resultsCtrl.results.points.forEach(row => {
		resultsCtrl.chartData.push([row.time, row.value, row.altvalue]);
	});
}

})();