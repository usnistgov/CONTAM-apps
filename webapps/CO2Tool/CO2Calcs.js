var CO2Tool = {};

CO2Tool.calculateCommercialTotalVent = function(RA, RP, floorArea, numberOfPeople) {
  
  let totalVent = RA * floorArea + RP * numberOfPeople;
  console.log("commercial total ventilation: " + totalVent + " L/s");
  return totalVent; // return total ventilation L/s
}

CO2Tool.calculateResidentialTotalVent622 = function(floorArea, numberOfBedrooms) {
  
  let totalVent = (0.15 * floorArea)+(3.5 * (1 + numberOfBedrooms));
  console.log("62.2 total ventilation: " + totalVent + " L/s");
  return totalVent; // return total ventilation L/s
}

CO2Tool.calculateResidentialTotalVentACH = function(totalACH, houseVolume) {
  
  let totalVent = totalACH * houseVolume / 3.6;
  console.log("ACH total ventilation: " + totalVent + " L/s");
  return totalVent; // return total ventilation L/s
}

CO2Tool.calculateBedroomTotalVent = function(totalVent, numPeopleHouse, numPeopleBedroom){
  let bedVent = (totalVent / numPeopleHouse) * numPeopleBedroom;
  console.log("bedroom (people) ventilation: " + bedVent + " L/s");
  return bedVent; // return bedroom ventilation L/s
}

CO2Tool.calculateBedroomFloorTotalVent = function(totalVent, floorAreaHouse, floorAreaBedroom){
  let bedVent = (totalVent / floorAreaHouse) * floorAreaBedroom;
  console.log("bedroom (floor) ventilation: " + bedVent + " L/s");
  return bedVent; // return bedroom ventilation L/s
}

// CO2Outdoor - the concentration of CO2 outside the building (ppm)
// timeToMetric - the time for the metric (h)
// ventilationRate - the primary ventilation rate (L/s)
// groupsOfPeople - an array of groups of people
//   a group of people consists of:
//   numPeople - # of people in the group
//   mass - the mass of every person in the group (kg)
//   ageGroup - the age group that every person in the group
//     age group (0-5): <3, 3 to 10, 10 to 18, 18 to 30, 30 to 60, > 60
//   sex - the sex of every person in the group (M|F)
//   met - the activity of every peron in the group
// altVentilationRate - the alternate ventilation rate (L/s)
// temperature - the temperature in the building (K)
// floorArea - the floor Area of the building(m3)
// ceilingHeight - the ceiling height in the building (m)
CO2Tool.calculateResult = function(CO2Outdoor, timeToMetric, ventilationRate, 
  groupsOfPeople, altVentilationRate, temperature, floorArea, ceilingHeight){
			
	console.log("Calculate results: ");
	console.log("CO2Outdoor: " + CO2Outdoor + " ppm");
	console.log("timeToMetric: " + timeToMetric + " h");
	console.log("ventilationRate: " + ventilationRate + " L/s");
	console.log("altVentilationRate: " + altVentilationRate + " L/s");
	console.log("temperature: " + temperature + " K");
	console.log("floor area: " + floorArea + " m2");
	console.log("ceiling height: " + ceilingHeight + " m");
  
  let volume = floorArea * ceilingHeight;
	console.log("volume: " + volume + " m3");
	
	let TCo2Gen = CO2Tool.calculateGenerationRate(groupsOfPeople, temperature);	

	// main result
	let totalVentACH = 3.6 * ventilationRate / volume;
	console.log("totalVent: " + totalVentACH + " ACH");
  
	let Css = CO2Outdoor + 1000000 * TCo2Gen / ventilationRate;
	console.log("Css: " + Css + " ppmv");
  
	let c_at_h = CO2Outdoor * Math.exp(-totalVentACH * 1) + Css * (1 - Math.exp(-totalVentACH * 1));
	console.log("C 1h: " + c_at_h + " ppmv");
  
	let c_at_metric = CO2Outdoor * Math.exp(-totalVentACH * timeToMetric) + Css * (1 - Math.exp(-totalVentACH * timeToMetric));
	console.log("C metric: " + c_at_metric + " ppmv");
  
	let timeToCSS = 3 * (1 / totalVentACH);
	console.log("time to css: " + timeToCSS + " h");
	
	// alternate result
	let altTotalVentACH = 3.6 * altVentilationRate / volume;
	console.log("alt totalVent: " + altTotalVentACH + " ACH");
  
	let altCss = CO2Outdoor + 1000000 * TCo2Gen / altVentilationRate;
	console.log("alt Css: " + altCss + " ppmv");
  
	let alt_c_at_h = CO2Outdoor * Math.exp(-altTotalVentACH * 1) + altCss * (1 - Math.exp(-altTotalVentACH * 1));
	console.log("alt C 1h: " + alt_c_at_h + " ppmv");
  
	let alt_c_at_metric = CO2Outdoor * Math.exp(-altTotalVentACH * timeToMetric) + altCss * (1 - Math.exp(-altTotalVentACH * timeToMetric));
	console.log("alt C metric: " + alt_c_at_metric + " ppmv");
  
	let alt_timeToCSS = 3 * (1 / totalVentACH);
	console.log("alt time to css: " + alt_timeToCSS + " h");
	
	let points = [];
	let maxTime = timeToMetric;
	if(timeToCSS > maxTime)
		maxTime = timeToCSS;
	if(alt_timeToCSS > maxTime)
		maxTime = alt_timeToCSS;
	maxTime += 2;
	for(let time=0; time <= maxTime; time+=0.01666666666)
	{
		let valueAtTime = CO2Outdoor * Math.exp(-totalVentACH * time) + Css * (1 - Math.exp(-totalVentACH * time));
		let altValueAtTime = CO2Outdoor * Math.exp(-altTotalVentACH * time) + altCss * (1 - Math.exp(-altTotalVentACH * time));
		points.push({'time': time, 'value': valueAtTime, 'altvalue': altValueAtTime});
	}
	
	let retVal = { base: {Css: Css, c_at_metric: c_at_metric, c_at_h: c_at_h, timeToCSS: timeToCSS}, 
		alt: {Css: altCss, c_at_metric: alt_c_at_metric, c_at_h: alt_c_at_h, timeToCSS: alt_timeToCSS},
		points: points };
  console.dir(retVal);
  return retVal;
}

CO2Tool.calculateGenerationRate = function(groupsOfPeople, temperature){
	
	let RQ = 0.85;
	let sumCo2Gen = 0;
	let sumPeople = 0;
	let maleA = [0.249, 0.095, 0.074, 0.063, 0.048, 0.049];
	let maleB = [-0.127, 2.11, 2.754, 2.896, 3.653, 2.459];
	let femaleA = [0.244, 0.085, 0.056, 0.062, 0.034, 0.038];
	let femaleB = [-0.13, 2.033, 2.898, 2.036, 3.538, 2.755];
	
	for(let i=0; i<groupsOfPeople.length; ++i)
	{
		let groupOfPeople = groupsOfPeople[i];
		let BMR;
		if(groupOfPeople.sex == "M")
		{
			BMR = maleA[groupOfPeople.ageGroup] * groupOfPeople.mass + maleB[groupOfPeople.ageGroup];
			//console.log("A: " + maleA[groupOfPeople.ageGroup]);
			//console.log("B: " + maleB[groupOfPeople.ageGroup]);
			//console.log("mass: " + groupOfPeople.mass);
		}
		else
		{
			BMR = femaleA[groupOfPeople.ageGroup] * groupOfPeople.mass + femaleB[groupOfPeople.ageGroup];
			//console.log("A: " + femaleA[groupOfPeople.ageGroup]);
			//console.log("B: " + femaleB[groupOfPeople.ageGroup]);
			//console.log("mass: " + groupOfPeople.mass);
		}
		//console.log("BMR: " + BMR);
    let pressure = 101; //kPa
    co2Gen = RQ * BMR * groupOfPeople.met*(temperature/ pressure) * 0.000211; // L/s
		//console.log("Vco2: " + Vco2);
		sumCo2Gen += co2Gen * groupOfPeople.numPeople;
		sumPeople += groupOfPeople.numPeople;
	}
	//console.log("Tco2: " + sumTco2);
	console.log("Number of Occupants: " + sumPeople);
	//let Vco2avg = sumVco2 / sumPeople;
	//console.log("Vco2avg: " + Vco2avg);
	console.log("Total CO2 Gen: " + sumCo2Gen);

	//return Vco2avg;
  return sumCo2Gen;
}