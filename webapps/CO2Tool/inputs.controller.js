(function () {
"use strict";

angular.module('CO2')
.controller('InputsController', InputsController);

InputsController.$inject = ['$state', 'InputsService'];
function InputsController($state, InputsService) {
	var inputsCtrl = this;

	// update the residential 622 values when inputs are changed
	inputsCtrl.update622Values = function () {
		inputsCtrl.inputs.calc622value = 0.15 * inputsCtrl.inputs.residential.floorArea.baseValue + 3.5 * (inputsCtrl.inputs.residential.numBedrooms + 1);
		inputsCtrl.inputs.calc622PerPersonValue = inputsCtrl.inputs.calc622value / inputsCtrl.inputs.residential.houseNumPeople;
		
		// convert to L/s
		let amountToReduce = CONTAM.Units.FlowConvert(inputsCtrl.inputs.residential.reduceVentilationRate.baseValue, 2, 0);
		let reducedVentilationRate = inputsCtrl.inputs.calc622value - amountToReduce;
			
		inputsCtrl.inputs.calc622PerfectValue = reducedVentilationRate / inputsCtrl.inputs.residential.bedroomNumPeople;
		
		inputsCtrl.inputs.calc622UniformValue = (reducedVentilationRate / inputsCtrl.inputs.residential.floorArea.baseValue) * 
			inputsCtrl.inputs.residential.roomFloorArea.baseValue;
		inputsCtrl.inputs.calc622UniformPerPersonValue = inputsCtrl.inputs.calc622UniformValue / inputsCtrl.inputs.residential.bedroomNumPeople
		//console.log('622 value: ' + inputsCtrl.inputs.calc622value);
		//console.log('reducedVentilationRate: ' + inputsCtrl.inputs.residential.reduceVentilationRate);
		//console.log('622 per person value: ' + inputsCtrl.inputs.calc622PerPersonValue);
		//console.log('622 perfect value: ' + inputsCtrl.inputs.calc622PerfectValue);
		//console.log('622 uniform value: ' + inputsCtrl.inputs.calc622UniformValue);
		//console.log('622 uniform per person value: ' + inputsCtrl.inputs.calc622UniformPerPersonValue);
	};

	// update per person value from ACH value
	inputsCtrl.updateACHPerPerson = function() {
		var volumeOfBldg = inputsCtrl.inputs.residential.ceilingHeight.baseValue * inputsCtrl.inputs.residential.floorArea.baseValue;
		//console.log('volumeOfBldg: ' + volumeOfBldg);
		//console.log('ACH value: ' + inputsCtrl.inputs.residential.wholeACH);
		inputsCtrl.inputs.residential.wholeACHPerPerson = (inputsCtrl.inputs.residential.wholeACH * volumeOfBldg / 3.6) / inputsCtrl.inputs.residential.houseNumPeople;
		//console.log('ACH per person value: ' + inputsCtrl.inputs.residential.wholeACHPerPerson);
	};
	
	// update per person value from ACH value
	inputsCtrl.updateBothValues = function() {
		inputsCtrl.updateACHPerPerson();
		inputsCtrl.update622Values();
	};
	
	// check if there are inputs stored
	if(InputsService.hasInputs()) {
		// if so get the stored values
		inputsCtrl.inputs = InputsService.getInputs();
		
	} else {
		// otherwise start with default values
		inputsCtrl.inputs = {};
		// create an object for converting concentrations of CO2
		inputsCtrl.inputs.CO2Species = {};
		inputsCtrl.inputs.CO2Species.molwt = 44;

		inputsCtrl.inputs.SpaceTypeType = "pre";
		inputsCtrl.inputs.SpaceCategory = "com";
		inputsCtrl.inputs.preDefinedSpaceTypeSelection = "0";
		inputsCtrl.inputs.preDefinedResSpaceTypeSelection = "0";
		
		//residential
		inputsCtrl.inputs.residential = {buildingName: "", numBedrooms: 1, houseNumPeople: 4, bedroomNumPeople: 2, resType: "Whole House", 
			wholeVentType: '62.2', wholeACH: 0.5, roomVentType: "Perfect", house_occupants: [], bedroom_occupants: []};
		// this will make the grouplist show the remove group button for the user list only
		inputsCtrl.inputs.residential.house_occupants.showRemove = true;
		// this will make the grouplist show the remove group button for the user list only
		inputsCtrl.inputs.residential.bedroom_occupants.showRemove = true;

		inputsCtrl.inputs.residential.CO2Outdoor = {baseValue: 0.00060776, conversion: 1, label: "Outdoor CO2 Concentration", 
			unitStrings: CONTAM.Units.Strings2.Concentration_M, unitFunction: CONTAM.Units.Concen_M_Convert,
			min: 0, species: inputsCtrl.inputs.CO2Species};

		inputsCtrl.inputs.residential.floorArea = {baseValue: 100, conversion: 0, label: "Building Floor Area", 
			unitStrings: CONTAM.Units.Strings2.Area, unitFunction: CONTAM.Units.AreaConvert, min: 1};

		inputsCtrl.inputs.residential.temperature = {baseValue: 296.15, conversion: 2, label: "Indoor Temperature", 
			unitStrings: CONTAM.Units.Strings2.Temperature, unitFunction: CONTAM.Units.TemperatureConvert, min: 1};

		inputsCtrl.inputs.residential.ceilingHeight = {baseValue: 3, conversion: 0, label: "Ceiling Height", 
			unitStrings: CONTAM.Units.Strings2.Length, unitFunction: CONTAM.Units.LengthConvert, min: 0};

		inputsCtrl.inputs.residential.timeToMetric = {baseValue: 21600, conversion: 2, label: "Time to Metric",
			unitStrings: CONTAM.Units.Strings2.Time, unitFunction: CONTAM.Units.TimeConvert, min: 1};

		inputsCtrl.inputs.residential.altVentilationRate = {baseValue: 0.012041, conversion: 2, label: "Alternate Ventilation Rate per Person",
			unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
		inputsCtrl.inputs.residential.reduceVentilationRate = {baseValue: 0.012041, conversion: 2, label: "Reduced Ventilation to Bedroom",
			unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0};			

		inputsCtrl.inputs.residential.roomFloorArea = {baseValue: 12, conversion: 0, label: "Bedroom Floor Area", 
			unitStrings: CONTAM.Units.Strings2.Area, unitFunction: CONTAM.Units.AreaConvert, min: 1};
			
		inputsCtrl.inputs.residential.roomVentilationRate = {baseValue: 0.012041, conversion: 2, label: "Primary Ventilation Rate per Person",
			unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};

		//commercial
		inputsCtrl.inputs.commercial = {userOccupantDensity:  25, occupants: []};
			// this will make the grouplist show the remove group button for the user list only
		inputsCtrl.inputs.commercial.occupants.showRemove = true;
		inputsCtrl.inputs.commercial.buildingName = "";

		inputsCtrl.inputs.commercial.CO2Outdoor = {baseValue: 0.00060776, conversion: 1, label: "Outdoor CO2 Concentration", 
			unitStrings: CONTAM.Units.Strings2.Concentration_M, unitFunction: CONTAM.Units.Concen_M_Convert,
			min: 0, species: inputsCtrl.inputs.CO2Species};

		inputsCtrl.inputs.commercial.floorArea = {baseValue: 100, conversion: 0, label: "Building Floor Area", 
			unitStrings: CONTAM.Units.Strings2.Area, unitFunction: CONTAM.Units.AreaConvert, min: 1};

		inputsCtrl.inputs.commercial.temperature = {baseValue: 296.15, conversion: 2, label: "Indoor Temperature", 
			unitStrings: CONTAM.Units.Strings2.Temperature, unitFunction: CONTAM.Units.TemperatureConvert, min: 0};

		inputsCtrl.inputs.commercial.ceilingHeight = {baseValue: 3, conversion: 0, label: "Ceiling Height", 
			unitStrings: CONTAM.Units.Strings2.Length, unitFunction: CONTAM.Units.LengthConvert, min: 0};

		inputsCtrl.inputs.commercial.timeToMetric = {baseValue: 7200, conversion: 2, label: "Time to Metric",
			unitStrings: CONTAM.Units.Strings2.Time, unitFunction: CONTAM.Units.TimeConvert, min: 1};

		inputsCtrl.inputs.commercial.ventilationRate = {baseValue: 0.012041, conversion: 2, label: "Primary Ventilation Rate per Person",
			unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
		inputsCtrl.inputs.commercial.altVentilationRate = {baseValue: 0.012041, conversion: 2, label: "Alternate Ventilation Rate per Person",
			unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
			
		inputsCtrl.inputs.predefinedAltVentilationRate = {baseValue: 0.012041, conversion: 2, label: "Alternate Ventilation Rate per Person",
			unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};
			
		inputsCtrl.updateBothValues();
	}
	
	// stored data on spaces
	inputsCtrl.spaceTypeData = [
		{ventPerPerson: 5, ventPerFloorArea: 0.6, occupantDensity: 25, timeToMetric: 2, ventilationRate:7.4, CO2Outdoor: 400, ceilingHeight: 3, floorArea: 100},
		{ventPerPerson: 5, ventPerFloorArea: 0.6, occupantDensity: 35, timeToMetric: 1, ventilationRate:6.7, CO2Outdoor: 400, ceilingHeight: 3, floorArea: 100},
		{ventPerPerson: 3.8, ventPerFloorArea: 0.3, occupantDensity: 65, timeToMetric: 1, ventilationRate:4.3, CO2Outdoor: 400, ceilingHeight: 4, floorArea: 100},
		{ventPerPerson: 3.8, ventPerFloorArea: 0.3, occupantDensity: 150, timeToMetric: 1, ventilationRate:4.0, CO2Outdoor: 400, ceilingHeight: 5, floorArea: 100},
		{ventPerPerson: 3.8, ventPerFloorArea: 0.9, occupantDensity: 70, timeToMetric: 1, ventilationRate:5.1, CO2Outdoor: 400, ceilingHeight: 4, floorArea: 100},
		{ventPerPerson: 2.5, ventPerFloorArea: 0.3, occupantDensity: 50, timeToMetric: 1, ventilationRate:3.1, CO2Outdoor: 400, ceilingHeight: 3, floorArea: 100},
		{ventPerPerson: 2.5, ventPerFloorArea: 0.3, occupantDensity: 10, timeToMetric: 6, ventilationRate:5.5, CO2Outdoor: 400, ceilingHeight: 3, floorArea: 20},
		{ventPerPerson: 2.5, ventPerFloorArea: 0.3, occupantDensity: 5, timeToMetric: 2, ventilationRate:8.5, CO2Outdoor: 400, ceilingHeight: 3, floorArea: 100},
		{ventPerPerson: 2.5, ventPerFloorArea: 0.3, occupantDensity: 150, timeToMetric: 1, ventilationRate:2.7, CO2Outdoor: 400, ceilingHeight: 7.5, floorArea: 100},
		{ventPerPerson: 2.5, ventPerFloorArea: 0.3, occupantDensity: 150, timeToMetric: 1, ventilationRate:2.7, CO2Outdoor: 400, ceilingHeight: 5, floorArea: 100},
		{ventPerPerson: 3.8, ventPerFloorArea: 0.6, occupantDensity: 15, timeToMetric: 2, ventilationRate:7.8, CO2Outdoor: 400, ceilingHeight: 4, floorArea: 100}
	];

	// stored data on houses
	inputsCtrl.resHouseData = [
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 2, numBedrooms: 3, calc622: 51.5, calc622pp: 12.875, scenario: 'Whole House', method: '62.2', numWholeOccupants: 4, occupants: 0}, // big house normal family (622)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 2, numBedrooms: 3, ach: 0.5, achpp: 23.8, scenario: 'Whole House', method: 'ACH', numWholeOccupants: 4, occupants: 0}, // big house normal family (ACH)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 2, numBedrooms: 5, calc622: 58.5, calc622pp: 9.75, scenario: 'Whole House', method: '62.2', numWholeOccupants: 6, occupants: 1}, // big house big family (622)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 2, numBedrooms: 5, ach: 0.5, achpp: 15.86, scenario: 'Whole House', method: 'ACH', numWholeOccupants: 6, occupants: 1}, // big house big family (ACH)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 2, numBedrooms: 3, calc622: 29, calc622pp: 7.25, scenario: 'Whole House', method: '62.2', numWholeOccupants: 4, occupants: 0}, // little house normal family (622)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 2, numBedrooms: 3, ach: 0.5, achpp: 8.5, scenario: 'Whole House', method: 'ACH', numWholeOccupants: 4, occupants: 0}, // little house normal family (ACH)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 2, numBedrooms: 1, calc622: 22, calc622pp: 11, scenario: 'Whole House', method: '62.2', numWholeOccupants: 2, occupants: 5}, // little house small family (622)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 2, numBedrooms: 1, ach: 0.5, achpp: 17, scenario: 'Whole House', method: 'ACH', numWholeOccupants: 2, occupants: 5}, // little house small family (ACH)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, calc622: 51.5, calc622pp: 12.875, perfect: 25.75, scenario: 'Bedroom', method: 'Perfect', bedFloorArea: 30, numWholeOccupants: 4, occupants: 2}, // big house normal family perfect (Primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, calc622: 51.5, calc622pp: 12.875, perfect: 12.875, scenario: 'Bedroom', method: 'Perfect', bedFloorArea: 20, numWholeOccupants: 4, occupants: 3}, // big house normal family perfect (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, calc622: 51.5, calc622pp: 12.875, uniform: 6.18, uniformpp: 3.09, scenario: 'Bedroom', method: 'Uniform', bedFloorArea: 30, numWholeOccupants: 4, occupants: 2}, // big house normal family uniform (Primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, calc622: 51.5, calc622pp: 12.875, uniform: 4.12, uniformpp: 2.06, scenario: 'Bedroom', method: 'Uniform', bedFloorArea: 20, numWholeOccupants: 4, occupants: 3}, // big house normal family uniform (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, ach: 0.5, achpp: 23.78, scenario: 'Bedroom', method: 'ACHP', bedFloorArea: 30, numWholeOccupants: 4, occupants: 2}, // big house normal family ACH Perfect (primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, ach: 0.5, achpp: 23.78, scenario: 'Bedroom', method: 'ACHP', bedFloorArea: 20, numWholeOccupants: 4, occupants: 3}, // big house normal family ACH Perfect (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, ach: 0.5, achpp: 5.7, scenario: 'Bedroom', method: 'ACHU', bedFloorArea: 30, numWholeOccupants: 4, occupants: 2}, // big house normal family ACH Uniform (primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, ach: 0.5, achpp: 7.6, scenario: 'Bedroom', method: 'ACHU', bedFloorArea: 20, numWholeOccupants: 4, occupants: 3}, // big house normal family ACH Uniform (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, scenario: 'Bedroom', method: 'CEN', bedFloorArea: 30, numWholeOccupants: 4, occupants: 2}, // big house normal family 10 L/s (Primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 3, scenario: 'Bedroom', method: 'CEN', bedFloorArea: 20, numWholeOccupants: 4, occupants: 3}, // big house normal family 10 L/s (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, calc622: 58.5, calc622pp: 9.75, perfect: 19.5, scenario: 'Bedroom', method: 'Perfect', bedFloorArea: 30, numWholeOccupants: 6, occupants: 2}, // big house big family perfect (Primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, calc622: 58.5, calc622pp: 9.75, perfect: 9.75, scenario: 'Bedroom', method: 'Perfect', bedFloorArea: 20, numWholeOccupants: 6, occupants: 4}, // big house big family perfect (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, calc622: 58.5, calc622pp: 9.75, uniform: 7.02, uniformpp: 3.51, scenario: 'Bedroom', method: 'Uniform', bedFloorArea: 30, numWholeOccupants: 6, occupants: 2}, // big house big family uniform (Primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, calc622: 58.5, calc622pp: 9.75, uniform: 4.68, uniformpp: 4.68, scenario: 'Bedroom', method: 'Uniform', bedFloorArea: 20, numWholeOccupants: 6, occupants: 4}, // big house big family uniform (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, ach: 0.5, achpp: 8.5, scenario: 'Bedroom', method: 'ACHP', bedFloorArea: 30, numWholeOccupants: 6, occupants: 2}, // big house big family ACH Perfect (primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, ach: 0.5, achpp: 8.5, scenario: 'Bedroom', method: 'ACHP', bedFloorArea: 20, numWholeOccupants: 6, occupants: 4}, // big house big family ACH Perfect (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, ach: 0.5, achpp: 3.4, scenario: 'Bedroom', method: 'ACHU', bedFloorArea: 30, numWholeOccupants: 6, occupants: 2}, // big house big family ACH Uniform (primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, ach: 0.5, achpp: 5.1, scenario: 'Bedroom', method: 'ACHU', bedFloorArea: 20, numWholeOccupants: 6, occupants: 4}, // big house big family ACH Uniform (child)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, scenario: 'Bedroom', method: 'CEN', bedFloorArea: 30, numWholeOccupants: 6, occupants: 2}, // big house big family 10 L/s (Primary)
		{CO2Outdoor: 400, floorArea: 250, ceilingHeight: 2.74, timeToMetric: 6, numBedrooms: 5, scenario: 'Bedroom', method: 'CEN', bedFloorArea: 20, numWholeOccupants: 6, occupants: 4}, // big house big family 10 L/s (child)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 3, calc622: 29, calc622pp: 7.25, perfect: 14.5, scenario: 'Bedroom', method: 'Perfect', bedFloorArea: 20, numWholeOccupants: 4, occupants: 2}, // little house normal family perfect (Primary)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 3, calc622: 29, calc622pp: 7.25, perfect: 7.25, scenario: 'Bedroom', method: 'Perfect', bedFloorArea: 15, numWholeOccupants: 4, occupants: 3}, // little house normal family perfect (child)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 3, calc622: 29, calc622pp: 7.25, uniform: 5.8, uniformpp: 2.9, scenario: 'Bedroom', method: 'Uniform', bedFloorArea: 20, numWholeOccupants: 4, occupants: 2}, // little house normal family uniform (Primary)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 3, calc622: 29, calc622pp: 7.25, uniform: 4.35, uniformpp: 4.35, scenario: 'Bedroom', method: 'Uniform', bedFloorArea: 15, numWholeOccupants: 4, occupants: 3}, // little house normal family uniform (child)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 3, scenario: 'Bedroom', method: 'CEN', bedFloorArea: 20, numWholeOccupants: 4, occupants: 2}, // little house normal family 10 L/s (Primary)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 3, scenario: 'Bedroom', method: 'CEN', bedFloorArea: 15, numWholeOccupants: 4, occupants: 3}, // little house normal family 10 L/s (child)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 1, calc622: 22, calc622pp: 11, perfect: 11, scenario: 'Bedroom', method: 'Perfect', bedFloorArea: 20, numWholeOccupants: 2, occupants: 2}, // little house small family perfect (Primary)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 1, calc622: 22, calc622pp: 11, uniform: 4.4, uniformpp: 2.2, scenario: 'Bedroom', method: 'Uniform', bedFloorArea: 20, numWholeOccupants: 2, occupants: 2}, // little house small family uniform (Primary)
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 1, ach: 0.5, achpp: 16.95, scenario: 'Bedroom', method: 'ACHP', bedFloorArea: 20, numWholeOccupants: 2, occupants: 2}, // little house small family ACH Perfect
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 1, ach: 0.5, achpp: 3.39, scenario: 'Bedroom', method: 'ACHU', bedFloorArea: 20, numWholeOccupants: 2, occupants: 2}, // little house small family ACH Uniform
		{CO2Outdoor: 400, floorArea: 100, ceilingHeight: 2.44, timeToMetric: 6, numBedrooms: 1, scenario: 'Bedroom', method: 'CEN', bedFloorArea: 20, numWholeOccupants: 2, occupants: 2} // little house small family 10 L/s (Primary)
	];

	// predefined occupant data
	inputsCtrl.predefinedGroups = [
		[
			{ sex: "M", ageGroup: 1, mass: 23, met: 2, numPeople: 12},
			{ sex: "F", ageGroup: 1, mass: 23, met: 2, numPeople: 12},
			{ sex: "M", ageGroup: 4, mass: 85, met: 3, numPeople: 1}
		],
		[
			{ sex: "M", ageGroup: 2, mass: 65, met: 1.7, numPeople: 17},
			{ sex: "F", ageGroup: 2, mass: 60, met: 1.7, numPeople: 17},
			{ sex: "M", ageGroup: 4, mass: 85, met: 2.5, numPeople: 1},
		],
		[
			{ sex: "M", ageGroup: 3, mass: 80, met: 1.3, numPeople: 32},
			{ sex: "F", ageGroup: 3, mass: 70, met: 1.3, numPeople: 32},
			{ sex: "F", ageGroup: 4, mass: 75, met: 2, numPeople: 1},
		],
		[
			{ sex: "M", ageGroup: 3, mass: 80, met: 1.3, numPeople: 74.5},
			{ sex: "F", ageGroup: 3, mass: 70, met: 1.3, numPeople: 74.5},
			{ sex: "F", ageGroup: 4, mass: 75, met: 2, numPeople: 1},
		],
		[
			{ sex: "M", ageGroup: 4, mass: 85, met: 1.5, numPeople: 33},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1.5, numPeople: 33},
			{ sex: "M", ageGroup: 4, mass: 85, met: 3, numPeople: 2},
			{ sex: "F", ageGroup: 4, mass: 75, met: 3, numPeople: 2},
		],
		[
			{ sex: "M", ageGroup: 4, mass: 85, met: 1.4, numPeople: 25},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1.4, numPeople: 25},
		],
		[
			{ sex: "M", ageGroup: 4, mass: 85, met: 1, numPeople: 1},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1, numPeople: 1},
		],
		[
			{ sex: "M", ageGroup: 4, mass: 85, met: 1.4, numPeople: 2.5},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1.4, numPeople: 2.5},
		],
		[
			{ sex: "M", ageGroup: 4, mass: 85, met: 1.3, numPeople: 75},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1.3, numPeople: 75},
		],
		[
			{ sex: "M", ageGroup: 4, mass: 85, met: 2, numPeople: 75},
			{ sex: "F", ageGroup: 4, mass: 75, met: 2, numPeople: 75},
		],
		[
			{ sex: "M", ageGroup: 4, mass: 85, met: 2.5, numPeople: 7.5},
			{ sex: "F", ageGroup: 4, mass: 75, met: 2.5, numPeople: 7.5},
		]
	];

	// predefined residential occupant data
	inputsCtrl.predefined_residential_occupants = [
		[ // normal family
			{ sex: "M", ageGroup: 4, mass: 85, met: 1.3, numPeople: 1},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1.3, numPeople: 1},
			{ sex: "M", ageGroup: 1, mass: 23, met: 2, numPeople: 1},
			{ sex: "F", ageGroup: 2, mass: 40, met: 1.7, numPeople: 1},
		],
		[ // big family
			{ sex: "M", ageGroup: 4, mass: 85, met: 1.3, numPeople: 1},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1.3, numPeople: 1},
			{ sex: "M", ageGroup: 1, mass: 23, met: 2, numPeople: 1},
			{ sex: "F", ageGroup: 2, mass: 40, met: 1.7, numPeople: 1},
			{ sex: "M", ageGroup: 1, mass: 32, met: 2, numPeople: 1},
			{ sex: "F", ageGroup: 1, mass: 14, met: 2, numPeople: 1},
		],
		[ // Primary bedroom
			{ sex: "M", ageGroup: 4, mass: 85, met: 1.0, numPeople: 1},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1.0, numPeople: 1},
		],
		[ //child bedroom 
			{ sex: "M", ageGroup: 1, mass: 23, met: 1.0, numPeople: 0.5},
			{ sex: "F", ageGroup: 2, mass: 40, met: 1.0, numPeople: 0.5},
		],
		[ //child bedroom - big family
			{ sex: "M", ageGroup: 1, mass: 23, met: 1.0, numPeople: 0.25},
			{ sex: "F", ageGroup: 2, mass: 40, met: 1.0, numPeople: 0.25},
			{ sex: "M", ageGroup: 1, mass: 32, met: 1.0, numPeople: 0.25},
			{ sex: "F", ageGroup: 1, mass: 14, met: 1.0, numPeople: 0.25},
		],
		[ // small family
			{ sex: "M", ageGroup: 4, mass: 85, met: 1.3, numPeople: 1},
			{ sex: "F", ageGroup: 4, mass: 75, met: 1.3, numPeople: 1},
		]
	];

	// initailize predefined space variable
	inputsCtrl.inputs.commercial.predefined = {
		occupantDensity: inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].occupantDensity,
		ventPerPerson: inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].ventPerPerson,
		ventPerFloorArea: inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].ventPerFloorArea,
		timeToMetric: inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].timeToMetric,
		ventilationRate: inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].ventilationRate,
		CO2Outdoor: inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].CO2Outdoor,
		ceilingHeight: inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].ceilingHeight,
		occupants: inputsCtrl.predefinedGroups[inputsCtrl.inputs.preDefinedSpaceTypeSelection].slice(),
		floorArea: inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].floorArea
	};
	
	inputsCtrl.inputs.commercial.predefined.altVentilationRate = {baseValue: 0.012041, conversion: 2, label: "Alternate Ventilation Rate per Person",
		unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};


	// initailize predefined space variable
	inputsCtrl.inputs.residential.predefined = {
		CO2Outdoor: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].CO2Outdoor, 
		floorArea: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].floorArea, 
		ceilingHeight: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].ceilingHeight, 
		timeToMetric: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].timeToMetric, 
		numBedrooms: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].numBedrooms, 
		scenario: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].scenario, 
		method: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].method,
		numWholeOccupants: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].numWholeOccupants,
		occupants: inputsCtrl.predefined_residential_occupants[inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].occupants].slice(),
		ach: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].ach,
		achpp: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].achpp,
		bedFloorArea: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].bedFloorArea,
		calc622: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].calc622,
		calc622pp: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].calc622pp,
		perfect: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].perfect,
		uniform: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].uniform,
		uniformpp: inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].uniformpp
	};

	inputsCtrl.inputs.residential.predefined.altVentilationRate = {baseValue: 0.0060205, conversion: 2, label: "Alternate Ventilation Rate per Person",
		unitStrings: CONTAM.Units.Strings2.Flow, unitFunction: CONTAM.Units.FlowConvert, min: 0.0000001};

	//commercial
	// a group of occupuants for the user to edit
	inputsCtrl.inputs.commercial.new_occupants = {numPeople: 1, sex: "M", ageGroup: "3", met: 1.2};
	inputsCtrl.inputs.commercial.new_occupants.mass = {baseValue: 20, conversion: 0, label: "Mass", unitStrings: CONTAM.Units.Strings2.Mass, 
		unitFunction: CONTAM.Units.MassConvert, min: 1};

	//residential
	// a group of occupuants in the whole house for the user to edit
	inputsCtrl.inputs.residential.new_house_occupants = {numPeople: 1, sex: "M", ageGroup: "3", met: 1.2};
	inputsCtrl.inputs.residential.new_house_occupants.mass = {baseValue: 20, conversion: 0, label: "Mass", unitStrings: CONTAM.Units.Strings2.Mass, 
		unitFunction: CONTAM.Units.MassConvert, min: 1};

	// a group of occupuants in the bedroom for the user to edit
	inputsCtrl.inputs.residential.new_bedroom_occupants = {numPeople: 1, sex: "M", ageGroup: "3", met: 1.2};
	inputsCtrl.inputs.residential.new_bedroom_occupants.mass = {baseValue: 20, conversion: 0, label: "Mass", unitStrings: CONTAM.Units.Strings2.Mass, 
		unitFunction: CONTAM.Units.MassConvert, min: 1};
    
  inputsCtrl.calculateNumberOfPeople = function(groupsOfPeople){
    let sumPeople = 0;
    for(let i=0; i<groupsOfPeople.length; ++i) {
      sumPeople += groupsOfPeople[i].numPeople;
    }
    return sumPeople;
  }
  
  inputsCtrl.calculateCommPre = function(){
    let timeToMetric = inputsCtrl.inputs.commercial.predefined.timeToMetric
    //let ventilationRate = inputsCtrl.inputs.commercial.predefined.ventilationRate;
    let ceilingHeight = inputsCtrl.inputs.commercial.predefined.ceilingHeight;
    let CO2Outdoor = inputsCtrl.inputs.commercial.predefined.CO2Outdoor;
    let occupants = inputsCtrl.inputs.commercial.predefined.occupants;
    let altVentilationRatePerPerson = CONTAM.Units.FlowConvert(inputsCtrl.inputs.commercial.predefined.altVentilationRate.baseValue, 2, 0);
    let floorArea = inputsCtrl.inputs.commercial.predefined.floorArea;
    let temperature = 296.15;
    let numPeople = inputsCtrl.calculateNumberOfPeople(occupants);
    
    //save inputs to the InputsService
    InputsService.setInputs(inputsCtrl.inputs);

    let ventRate = window.CO2Tool.calculateCommercialTotalVent(inputsCtrl.inputs.commercial.predefined.ventPerFloorArea, 
      inputsCtrl.inputs.commercial.predefined.ventPerPerson, floorArea, numPeople);
    let altVentRateTotal = altVentilationRatePerPerson * numPeople;

    // do calculations
    inputsCtrl.results = window.CO2Tool.calculateResult(CO2Outdoor, timeToMetric, 
      ventRate, occupants, altVentRateTotal, temperature, floorArea, ceilingHeight);

  }
  
  inputsCtrl.calculateCommUser = function(){
    
    // determine number of occupants entered
    let numPeople = inputsCtrl.calculateNumberOfPeople(inputsCtrl.inputs.commercial.occupants);

    let occupantDensity = numPeople / inputsCtrl.inputs.commercial.floorArea.baseValue * 100;
    inputsCtrl.inputs.commercial.userOccupantDensity = occupantDensity;

    // convert from seconds to hours
    let timeToMetric = CONTAM.Units.TimeConvert(inputsCtrl.inputs.commercial.timeToMetric.baseValue, 2, 0);

    // convert to L/s
    let ventilationRatePerPerson = CONTAM.Units.FlowConvert(inputsCtrl.inputs.commercial.ventilationRate.baseValue, 2, 0);
    let totalVentilationRate = ventilationRatePerPerson *  numPeople;

    let altVentilationRatePerPerson = CONTAM.Units.FlowConvert(inputsCtrl.inputs.commercial.altVentilationRate.baseValue, 2, 0);
    let altVentilationRate = altVentilationRatePerPerson * numPeople;

    let occupants = inputsCtrl.inputs.commercial.occupants.slice();
    // this will make the grouplist not show the remove group button for the input list
    occupants.showRemove = false;
    
    let ceilingHeight = inputsCtrl.inputs.commercial.ceilingHeight.baseValue; // m
    let temperature = inputsCtrl.inputs.commercial.temperature.baseValue; // K
    let floorArea = inputsCtrl.inputs.commercial.floorArea.baseValue; // m2
    // convert CO2 to ppm
    let CO2Outdoor = CONTAM.Units.Concen_M_Convert(inputsCtrl.inputs.commercial.CO2Outdoor.baseValue, 
      1, 0, inputsCtrl.inputs.commercial.CO2Outdoor.species);
    //save inputs to the InputsService
    InputsService.setInputs(inputsCtrl.inputs);

    // do calculations
    inputsCtrl.results = window.CO2Tool.calculateResult(CO2Outdoor, timeToMetric, 
      totalVentilationRate, occupants, altVentilationRate, temperature, floorArea, ceilingHeight);

  }
  
  inputsCtrl.calculateResPre = function(){
    let scenarioData = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection];
    let occupants = inputsCtrl.predefined_residential_occupants[scenarioData.occupants].slice();
    occupants.showRemove = false;
    
    let calc622value = CO2Tool.calculateResidentialTotalVent622(scenarioData.floorArea, scenarioData.numBedrooms)
    let ventilationRate;
    let floorArea;
    let volumeOfBldg = scenarioData.ceilingHeight * scenarioData.floorArea;
  
    if(scenarioData.scenario == 'Whole House'){
      if(scenarioData.method == '62.2') {
        ventilationRate = calc622value;
        inputsCtrl.inputs.residential.predefined.ventPP = scenarioData.calc622pp;
      } else {
        console.log('volumeOfBldg: ' + volumeOfBldg);
        ventilationRate = CO2Tool.calculateResidentialTotalVentACH(scenarioData.ach, volumeOfBldg);
        console.log('ACH ventilationRate: ' + ventilationRate);
        inputsCtrl.inputs.residential.predefined.ventPP = scenarioData.achpp;
      }
      floorArea = scenarioData.floorArea;
    } else {
      let volumeOfBedroom = scenarioData.ceilingHeight * scenarioData.bedFloorArea;
      let numPeopleInBedroom = inputsCtrl.inputs.countOccupants(occupants);
      console.log('volumeOfBedroom: ' + volumeOfBedroom);
      if(scenarioData.method == 'Perfect') {
        ventilationRate = CO2Tool.calculateBedroomTotalVent(calc622value, scenarioData.numWholeOccupants, numPeopleInBedroom);
        inputsCtrl.inputs.residential.predefined.ventPP = scenarioData.calc622pp;
      } else if (scenarioData.method == 'Uniform') {
        ventilationRate = (calc622value / 
          (scenarioData.floorArea * scenarioData.ceilingHeight)) * 
          (scenarioData.bedFloorArea * scenarioData.ceilingHeight);
        console.log('uniform ventilationRate: ' + ventilationRate);
        inputsCtrl.inputs.residential.predefined.ventPP = scenarioData.uniformpp;
      } else if (scenarioData.method == 'ACHP') {
        let wholeVent = CO2Tool.calculateResidentialTotalVentACH (scenarioData.ach, volumeOfBldg); // ventilation for whole house
        ventilationRate = CO2Tool.calculateBedroomTotalVent(wholeVent, scenarioData.numWholeOccupants, numPeopleInBedroom); // ventilation for bedroom
        console.log('ACHP bedroom ventilationRate: ' + ventilationRate);
        inputsCtrl.inputs.residential.predefined.ventPP = scenarioData.achpp;
      } else if (scenarioData.method == 'ACHU') {
          let wholeVent = CO2Tool.calculateResidentialTotalVentACH (scenarioData.ach, volumeOfBldg); // ventilation for whole house
          ventilationRate = CO2Tool.calculateBedroomFloorTotalVent(wholeVent, scenarioData.floorArea, scenarioData.bedFloorArea);
          console.log('ACHU bedroom ventilationRate: ' + ventilationRate);
        inputsCtrl.inputs.residential.predefined.ventPP = scenarioData.achpp;
      } else {
        // use 10 L/s per person
        ventilationRate = 10 * numPeopleInBedroom;
        console.log('10 L/s ventilationRate: ' + ventilationRate);
        inputsCtrl.inputs.residential.predefined.ventPP = 10;
      }
      floorArea = scenarioData.bedFloorArea;
    }

    //save inputs to the InputsService
    InputsService.setInputs(inputsCtrl.inputs);
    let temperature = 296.15;
    
    // do calculations
    inputsCtrl.results = window.CO2Tool.calculateResult(scenarioData.CO2Outdoor, 
      scenarioData.timeToMetric, ventilationRate, occupants, 
      CONTAM.Units.FlowConvert(inputsCtrl.inputs.residential.predefined.altVentilationRate.baseValue, 2, 0), //convert to L/s
      temperature, floorArea, scenarioData.ceilingHeight);
    
  }
  
  inputsCtrl.calculateResUser = function(){
    let occupants;
    let ventilationRate; // in L/s
    let floorArea;
    
    if(inputsCtrl.inputs.residential.resType == 'Whole House') {

      if(inputsCtrl.inputs.residential.wholeVentType == '62.2'){
        ventilationRate = inputsCtrl.inputs.calc622value;
      } else {
        let volumeOfBldg = inputsCtrl.inputs.residential.ceilingHeight.baseValue * inputsCtrl.inputs.residential.floorArea.baseValue;
        ventilationRate = CO2Tool.calculateResidentialTotalVentACH(inputsCtrl.inputs.residential.wholeACH, volumeOfBldg);
      }
      occupants = inputsCtrl.inputs.residential.house_occupants.slice();
      floorArea = inputsCtrl.inputs.residential.floorArea.baseValue;
    } else {

      if(inputsCtrl.inputs.residential.roomVentType == 'Perfect') {
        ventilationRate = inputsCtrl.inputs.calc622PerfectValue;
      } else if(inputsCtrl.inputs.roomVentType == 'Uniform') {
        ventilationRate = inputsCtrl.inputs.calc622UniformValue;
      } else {
        // convert from kg/s to L/s
        ventilationRate = CONTAM.Units.FlowConvert(inputsCtrl.inputs.residential.roomVentilationRate.baseValue, 2, 0);
      }
      occupants = inputsCtrl.inputs.residential.bedroom_occupants.slice();
      floorArea = inputsCtrl.inputs.residential.roomFloorArea.baseValue;
    }
    occupants.showRemove = false;

    // convert to L/s
    let altVentilationRate = CONTAM.Units.FlowConvert(inputsCtrl.inputs.residential.altVentilationRate.baseValue, 2, 0);
      
    // convert from seconds to hours
    let timeToMetric = CONTAM.Units.TimeConvert(inputsCtrl.inputs.residential.timeToMetric.baseValue, 2, 0);
    
    let temperature = inputsCtrl.inputs.residential.temperature.baseValue;
    //save inputs to the InputsService
    InputsService.setInputs(inputsCtrl.inputs);
    
    // convert CO2 to ppm
    var CO2Outdoor_ppm = CONTAM.Units.Concen_M_Convert(inputsCtrl.inputs.residential.CO2Outdoor.baseValue, 
      1, 0, inputsCtrl.inputs.residential.CO2Outdoor.species);

    // do calculations
    inputsCtrl.results = window.CO2Tool.calculateResult(CO2Outdoor_ppm, 
      timeToMetric, ventilationRate, occupants, altVentilationRate, 
      temperature, floorArea, inputsCtrl.inputs.residential.ceilingHeight.baseValue);
    
  }
	
	inputsCtrl.getResults = function(){
    if(inputsCtrl.validateInputs() === true){
      return;
    }

    if(inputsCtrl.inputs.SpaceCategory =='com') {

      if(inputsCtrl.inputs.SpaceTypeType == "pre"){
        inputsCtrl.calculateCommPre();
      }else{
        if(inputsCtrl.inputs.commercial.occupants.length == 0) {
          alert("At least one occupant must be defined.");
          return;
        }
        inputsCtrl.calculateCommUser();
      }
    } else {
      if(inputsCtrl.inputs.SpaceTypeType == "pre"){
        inputsCtrl.calculateResPre();
      } else {

        if(inputsCtrl.inputs.residential.resType == 'Whole House') {
          if(inputsCtrl.inputs.residential.house_occupants.length == 0) {
            alert(inputsCtrl.inputs.residential.houseNumPeople + " occupants must be defined.");
            return;
          }
          // determine number of occupants entered
          let numPeople = inputsCtrl.calculateNumberOfPeople(inputsCtrl.inputs.residential.house_occupants);
          
          if(numPeople != inputsCtrl.inputs.residential.houseNumPeople) { 
            alert("The total number of occupants defined in the whole house must match the number of occupants entered.\n" + 
              "Number of Occupants entered: " + inputsCtrl.inputs.residential.houseNumPeople + "\n" +
              "Total Occupants defined: " + numPeople);
            return;
          }

        } else {
        
          if(inputsCtrl.inputs.residential.houseNumPeople < inputsCtrl.inputs.residential.bedroomNumPeople) {
            alert("The number of ocupants the bedroom cannot exceed the number of occupants in the whole house.");
            return;
          }
          if(inputsCtrl.inputs.residential.bedroom_occupants.length == 0) {
            alert(inputsCtrl.inputs.residential.bedroomNumPeople + " occupants must be defined in the bedroom.");
            return;
          }
          if(inputsCtrl.inputs.residential.roomFloorArea.baseValue > inputsCtrl.inputs.residential.floorArea.baseValue) {
            alert("The bedroom floor area cannot be larger than the building floor area.");
            return;
          }
          // determine number of occupants entered
          let numPeople = inputsCtrl.calculateNumberOfPeople(inputsCtrl.inputs.residential.bedroom_occupants);
          
          if(numPeople != inputsCtrl.inputs.residential.bedroomNumPeople) { 
            alert("The total number of occupants defined in the bedroom must match the number of occupants entered.\n" + 
              "Number of Occupants entered: " + inputsCtrl.inputs.residential.bedroomNumPeople + "\n" +
              "Total Occupants defined: " + numPeople);
            return;
          }
        }
        inputsCtrl.calculateResUser();
        
      }
    }
		$state.go('results', {results: inputsCtrl.results, inputs: inputsCtrl.inputs});
	}
  
	//commercial
	// function to add a group of occupants to the user defined space
	inputsCtrl.addGroup = function(){
		var message = " is required to have a valid value.";
		if(inputsCtrl.inputs.commercial.new_occupants.mass.baseValue == null) {
			alert(inputsCtrl.inputs.commercial.new_occupants.mass.label + message);
			return true;
		}
		if(inputsCtrl.inputs.commercial.new_occupants.met == null) {
			alert("Activity Level" + message);
			return true;
		}
		if(inputsCtrl.inputs.commercial.new_occupants.numPeople == null) {
			alert("Number of Occupants" + message);
			return true;
		}
		inputsCtrl.inputs.commercial.occupants.push({
			sex: inputsCtrl.inputs.commercial.new_occupants.sex,
			ageGroup: parseInt(inputsCtrl.inputs.commercial.new_occupants.ageGroup),
			mass: inputsCtrl.inputs.commercial.new_occupants.mass.baseValue,
			met: inputsCtrl.inputs.commercial.new_occupants.met,
			numPeople: inputsCtrl.inputs.commercial.new_occupants.numPeople
		});
	}
  
	//residential
	// function to add a group of occupants for the whole building to the user defined space
	inputsCtrl.addResWholeGroup = function(){
		var message = " is required to have a valid value.";
		if(inputsCtrl.inputs.residential.new_house_occupants.mass.baseValue == null) {
			alert(inputsCtrl.inputs.residential.new_house_occupants.mass.label + message);
			return true;
		}
		if(inputsCtrl.inputs.residential.new_house_occupants.met == null) {
			alert("Activity Level" + message);
			return true;
		}
		if(inputsCtrl.inputs.residential.new_house_occupants.numPeople == null) {
			alert("Number of Occupants" + message);
			return true;
		}
		inputsCtrl.inputs.residential.house_occupants.push({
			sex: inputsCtrl.inputs.residential.new_house_occupants.sex,
			ageGroup: parseInt(inputsCtrl.inputs.residential.new_house_occupants.ageGroup),
			mass: inputsCtrl.inputs.residential.new_house_occupants.mass.baseValue,
			met: inputsCtrl.inputs.residential.new_house_occupants.met,
			numPeople: inputsCtrl.inputs.residential.new_house_occupants.numPeople
		});
	}

	// function to add a group of occupants for the bedroom to the user defined space
	inputsCtrl.addResBedGroup = function(){
		var message = " is required to have a valid value.";
		if(inputsCtrl.inputs.residential.new_bedroom_occupants.mass.baseValue == null) {
			alert(inputsCtrl.inputs.residential.new_bedroom_occupants.mass.label + message);
			return true;
		}
		if(inputsCtrl.inputs.residential.new_bedroom_occupants.met == null) {
			alert("Activity Level" + message);
			return true;
		}
		if(inputsCtrl.inputs.residential.new_bedroom_occupants.numPeople == null) {
			alert("Number of Occupants" + message);
			return true;
		}
		inputsCtrl.inputs.residential.bedroom_occupants.push({
			sex: inputsCtrl.inputs.residential.new_bedroom_occupants.sex,
			ageGroup: parseInt(inputsCtrl.inputs.residential.new_bedroom_occupants.ageGroup),
			mass: inputsCtrl.inputs.residential.new_bedroom_occupants.mass.baseValue,
			met: inputsCtrl.inputs.residential.new_bedroom_occupants.met,
			numPeople: inputsCtrl.inputs.residential.new_bedroom_occupants.numPeople
		});
	}
	
	// the pre-defined space type has changed so put in new values
	inputsCtrl.changeSpaceType = function(){
		inputsCtrl.inputs.commercial.predefined.occupantDensity = inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].occupantDensity;
		inputsCtrl.inputs.commercial.predefined.ventPerPerson = inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].ventPerPerson;
		inputsCtrl.inputs.commercial.predefined.timeToMetric = inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].timeToMetric;
		inputsCtrl.inputs.commercial.predefined.ventPerFloorArea = inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].ventPerFloorArea;
		inputsCtrl.inputs.commercial.predefined.ventilationRate = inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].ventilationRate;
		inputsCtrl.inputs.commercial.predefined.occupants =  inputsCtrl.predefinedGroups[inputsCtrl.inputs.preDefinedSpaceTypeSelection].slice();
		inputsCtrl.inputs.commercial.predefined.CO2Outdoor = inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].CO2Outdoor;
		inputsCtrl.inputs.commercial.predefined.ceilingHeight = inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].ceilingHeight;
		inputsCtrl.inputs.commercial.predefined.floorArea = inputsCtrl.spaceTypeData[inputsCtrl.inputs.preDefinedSpaceTypeSelection].floorArea;

	}

	// the pre-defined space type has changed so put in new values
	inputsCtrl.changeResSpaceType = function(){
		inputsCtrl.inputs.residential.predefined.CO2Outdoor = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].CO2Outdoor;
		inputsCtrl.inputs.residential.predefined.floorArea = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].floorArea;
		inputsCtrl.inputs.residential.predefined.ceilingHeight = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].ceilingHeight;
		inputsCtrl.inputs.residential.predefined.timeToMetric = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].timeToMetric;
		inputsCtrl.inputs.residential.predefined.numBedrooms = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].numBedrooms;
		inputsCtrl.inputs.residential.predefined.scenario = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].scenario;
		inputsCtrl.inputs.residential.predefined.method = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].method;
		inputsCtrl.inputs.residential.predefined.numWholeOccupants = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].numWholeOccupants;
		inputsCtrl.inputs.residential.predefined.occupants = inputsCtrl.predefined_residential_occupants[inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].occupants].slice();
		inputsCtrl.inputs.residential.predefined.ach = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].ach;
		inputsCtrl.inputs.residential.predefined.bedFloorArea = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].bedFloorArea;
		inputsCtrl.inputs.residential.predefined.calc622 = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].calc622;
		inputsCtrl.inputs.residential.predefined.calc622pp = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].calc622pp;
		inputsCtrl.inputs.residential.predefined.perfect = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].perfect;
		inputsCtrl.inputs.residential.predefined.uniform = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].uniform;
		inputsCtrl.inputs.residential.predefined.uniformpp = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].uniformpp;
		inputsCtrl.inputs.residential.predefined.achpp = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection].achpp;
	}
	
	// copy the current predefined values to the user defined space type
	inputsCtrl.copyPredefinedToUser = function() {
					
		// convert from ppm to kg/kg
		inputsCtrl.inputs.commercial.CO2Outdoor.baseValue = CONTAM.Units.Concen_M_Convert(inputsCtrl.inputs.commercial.predefined.CO2Outdoor, 
			1, 1, inputsCtrl.inputs.commercial.CO2Outdoor.species);

		inputsCtrl.inputs.commercial.ceilingHeight.baseValue = inputsCtrl.inputs.commercial.predefined.ceilingHeight;
		//convert from hours to seconds
		inputsCtrl.inputs.commercial.timeToMetric.baseValue = CONTAM.Units.TimeConvert(inputsCtrl.inputs.commercial.predefined.timeToMetric, 2, 1);

    // convert from L/s to kg/s 
    inputsCtrl.inputs.commercial.ventilationRate.baseValue = CONTAM.Units.FlowConvert(inputsCtrl.inputs.commercial.predefined.ventilationRate, 2, 1);

    inputsCtrl.inputs.commercial.floorArea.baseValue = inputsCtrl.inputs.commercial.predefined.floorArea;
		inputsCtrl.inputs.commercial.occupants = inputsCtrl.inputs.commercial.predefined.occupants.slice();
		// this will make the grouplist show the remove group button for the user list only
		inputsCtrl.inputs.commercial.occupants.showRemove = true;
		inputsCtrl.inputs.SpaceTypeType = "user";
	}
	
	// copy the current predefined values to the user defined space type
	inputsCtrl.copyPredefinedResToUser = function() {
					
		// convert from ppm to kg/kg
		inputsCtrl.inputs.residential.CO2Outdoor.baseValue = CONTAM.Units.Concen_M_Convert(inputsCtrl.inputs.residential.predefined.CO2Outdoor, 
			1, 1, inputsCtrl.inputs.residential.CO2Outdoor.species);
		inputsCtrl.inputs.residential.ceilingHeight.baseValue = inputsCtrl.inputs.residential.predefined.ceilingHeight;
		inputsCtrl.inputs.residential.floorArea.baseValue = inputsCtrl.inputs.residential.predefined.floorArea;
		//convert from hours to seconds
		inputsCtrl.inputs.residential.timeToMetric.baseValue = CONTAM.Units.TimeConvert(inputsCtrl.inputs.residential.predefined.timeToMetric, 2, 1);
		inputsCtrl.inputs.residential.houseNumPeople = inputsCtrl.inputs.residential.predefined.numWholeOccupants;
		inputsCtrl.inputs.residential.numBedrooms = inputsCtrl.inputs.residential.predefined.numBedrooms;
		let scenarioData = inputsCtrl.resHouseData[inputsCtrl.inputs.preDefinedResSpaceTypeSelection];
		inputsCtrl.inputs.residential.resType = scenarioData.scenario;
		
		if(inputsCtrl.inputs.residential.predefined.scenario == 'Whole House') {
			inputsCtrl.inputs.residential.house_occupants = inputsCtrl.inputs.residential.predefined.occupants.slice();
			// this will make the grouplist show the remove group button for the user list only
			inputsCtrl.inputs.residential.house_occupants.showRemove = true;
			
			inputsCtrl.inputs.residential.wholeVentType = scenarioData.method;			
		} else {
			inputsCtrl.inputs.residential.bedroom_occupants = inputsCtrl.inputs.residential.predefined.occupants.slice();
			// this will make the grouplist show the remove group button for the user list only
			inputsCtrl.inputs.residential.bedroom_occupants.showRemove = true;
			
			inputsCtrl.inputs.residential.roomVentType = scenarioData.method;
		}
		inputsCtrl.inputs.SpaceTypeType = "user";
	}
	
	//commercial
	// remove a group of occupants
	inputsCtrl.removeItem = function (itemIndex) {
		inputsCtrl.inputs.commercial.occupants.splice(itemIndex, 1);
	};
	
	//residential
	// remove a group of occupants from whole building
	inputsCtrl.removeResWholeGroup = function (itemIndex) {
		inputsCtrl.inputs.residential.house_occupants.splice(itemIndex, 1);
	};
	// remove a group of occupants from bedroom
	inputsCtrl.removeResBedGroup = function (itemIndex) {
		inputsCtrl.inputs.residential.bedroom_occupants.splice(itemIndex, 1);
	};
	
	// save the inputs for the user
	inputsCtrl.saveInputs = function () {
		InputsService.setInputs(inputsCtrl.inputs);
	};

	// find the number of occupants in an occupant array
	inputsCtrl.inputs.countOccupants = function (occupants) {
		var occupantCount = 0;
		// determine number of occupants
		for(var i=0; i< occupants.length; ++i) {
			occupantCount += occupants[i].numPeople;
		}
		return occupantCount;
	};

	// check that the inputs are valid
	inputsCtrl.validateInputs = function () {
		
		var message = " is required to have a valid value.";
				
		if(inputsCtrl.inputs.SpaceCategory =='com') {
			if(inputsCtrl.inputs.commercial.CO2Outdoor.baseValue == null) {
				alert(inputsCtrl.inputs.commercial.CO2Outdoor.label + message);
				return true;
			}
			if(inputsCtrl.inputs.commercial.ceilingHeight.baseValue == null) {
				alert(inputsCtrl.inputs.commercial.ceilingHeight.label + message);
				return true;
			}
			if(inputsCtrl.inputs.commercial.floorArea.baseValue == null) {
				alert(inputsCtrl.inputs.commercial.floorArea.label + message);
				return true;
			}
			if(inputsCtrl.inputs.commercial.temperature.baseValue == null) {
				alert(inputsCtrl.inputs.commercial.temperature.label + message);
				return true;
			}
			if(inputsCtrl.inputs.SpaceTypeType == "user"){
				if(inputsCtrl.inputs.commercial.ventilationRate.baseValue == null) {
					alert(inputsCtrl.inputs.commercial.ventilationRate.label + message);
					return true;
				}
				if(inputsCtrl.inputs.commercial.altVentilationRate.baseValue == null) {
					alert(inputsCtrl.inputs.commercial.altVentilationRate.label + message);
					return true;
				}
				if(inputsCtrl.inputs.commercial.timeToMetric.baseValue == null) {
					alert(inputsCtrl.inputs.commercial.timeToMetric.label + message);
					return true;
				}
			} else {
				if(inputsCtrl.inputs.commercial.predefined.altVentilationRate.baseValue == null) {
					alert(inputsCtrl.inputs.commercial.predefined.altVentilationRate.label + message);
					return true;
				}
			}			
		} else {
			if(inputsCtrl.inputs.residential.CO2Outdoor.baseValue == null) {
				alert(inputsCtrl.inputs.residential.CO2Outdoor.label + message);
				return true;
			}
			if(inputsCtrl.inputs.residential.ceilingHeight.baseValue == null) {
				alert(inputsCtrl.inputs.residential.ceilingHeight.label + message);
				return true;
			}
			if(inputsCtrl.inputs.residential.floorArea.baseValue == null) {
				alert(inputsCtrl.inputs.residential.floorArea.label + message);
				return true;
			}
			if(inputsCtrl.inputs.residential.temperature.baseValue == null) {
				alert(inputsCtrl.inputs.residential.temperature.label + message);
				return true;
			}
			if(inputsCtrl.inputs.SpaceTypeType == "user"){
				if(inputsCtrl.inputs.residential.timeToMetric.baseValue == null) {
					alert(inputsCtrl.inputs.residential.timeToMetric.label + message);
					return true;
				}
				if(inputsCtrl.inputs.residential.numBedrooms == null) {
					alert("Number of bedrooms" + message);
					return true;
				}
				if(inputsCtrl.inputs.residential.houseNumPeople == null) {
					alert("Number of occupants in house" + message);
					return true;
				}
				if(inputsCtrl.inputs.residential.altVentilationRate.baseValue == null) {
					alert(inputsCtrl.inputs.residential.altVentilationRate.label + message);
					return true;
				}
				if(inputsCtrl.inputs.residential.resType == 'Whole House') {
					if(inputsCtrl.inputs.residential.wholeVentType == 'ACH' && inputsCtrl.inputs.residential.wholeACH == null) {
						alert("Air Change Rate" + message);
						return true;
					}					
				} else {
					if(inputsCtrl.inputs.residential.roomFloorArea.baseValue == null) {
						alert(inputsCtrl.inputs.residential.roomFloorArea.label + message);
						return true;
					}
					if(inputsCtrl.inputs.residential.bedroomNumPeople == null) {
						alert("Number of occupants in bedroom" + message);
						return true;
					}
					if(inputsCtrl.inputs.residential.roomVentType == 'CEN' && inputsCtrl.inputs.residential.roomVentilationRate.baseValue == null) {
						alert(inputsCtrl.inputs.residential.roomVentilationRate.label + message);
						return true;
					}
				}				
			} else {
				
			}			
		}
		return false;
	};
	
	inputsCtrl.show622Values = function () {
		return inputsCtrl.inputs.residential.predefined.method == '62.2' || 
			inputsCtrl.inputs.residential.predefined.method == 'Perfect' || 
			inputsCtrl.inputs.residential.predefined.method == 'Uniform';
	};

	inputsCtrl.showACHValues = function () {
		return inputsCtrl.inputs.residential.predefined.method == 'ACH' || 
			inputsCtrl.inputs.residential.predefined.method == 'ACHP' || 
			inputsCtrl.inputs.residential.predefined.method == 'ACHU';
	};
	
	
}

})();