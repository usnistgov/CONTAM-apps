var CO2Tool = {};

// CO2Outdoor - the concentration of CO2 outside the building (ppm)
// volumePerPerson - the volume per person (m3)
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
CO2Tool.calculateResult = function(CO2Outdoor, 
	volumePerPerson, timeToMetric, ventilationRate, groupsOfPeople, altVentilationRate, temperature){
			
	console.log("Calculate results: ");
	console.log("CO2Outdoor: " + CO2Outdoor + " ppm");
	console.log("volumePerPerson: " + volumePerPerson + " m3");
	console.log("timeToMetric: " + timeToMetric + " h");
	console.log("ventilationRate: " + ventilationRate + " L/s");
	console.log("altVentilationRate: " + altVentilationRate + " L/s");
	console.log("temperature: " + temperature + " K");
	
	var Vco2avg = CO2Tool.calculateGenerationRate(groupsOfPeople, temperature);	
	
	// main result
	var defaultOA = 3.6 * ventilationRate / volumePerPerson;
	var Css = CO2Outdoor + (1000000 * Vco2avg / ventilationRate);
	var c_at_metric = CO2Outdoor * Math.exp(-defaultOA * timeToMetric) + Css * (1 - Math.exp(-defaultOA * timeToMetric));
	var c_at_h = CO2Outdoor * Math.exp(-defaultOA * 1) + Css * (1 - Math.exp(-defaultOA * 1));
	var timeToCSS = 3 * (volumePerPerson / ventilationRate) / 3.6;
	
	// alternate result
	var altDefaultOA = 3.6 * altVentilationRate / volumePerPerson;
	var altCss = CO2Outdoor + (1000000 * Vco2avg / altVentilationRate);
	var alt_c_at_metric = CO2Outdoor * Math.exp(-altDefaultOA * timeToMetric) + altCss * (1 - Math.exp(-altDefaultOA * timeToMetric));
	var alt_c_at_h = CO2Outdoor * Math.exp(-altDefaultOA * 1) + altCss * (1 - Math.exp(-altDefaultOA * 1));
	var alt_timeToCSS = 3 * (volumePerPerson / altVentilationRate) / 3.6;
	
	var points = [];
	var maxTime = timeToMetric;
	if(timeToCSS > maxTime)
		maxTime = timeToCSS;
	if(alt_timeToCSS > maxTime)
		maxTime = alt_timeToCSS;
	maxTime += 2;
	for(var time=0; time <= maxTime; time+=0.01666666666)
	{
		var valueAtTime = CO2Outdoor * Math.exp(-defaultOA * time) + Css * (1 - Math.exp(-defaultOA * time));
		var altValueAtTime = CO2Outdoor * Math.exp(-altDefaultOA * time) + altCss * (1 - Math.exp(-altDefaultOA * time));
		points.push({'time': time, 'value': valueAtTime, 'altvalue': altValueAtTime});
	}
	
	let retVal = { base: {Css: Css, c_at_metric: c_at_metric, c_at_h: c_at_h, timeToCSS: timeToCSS}, 
		alt: {Css: altCss, c_at_metric: alt_c_at_metric, c_at_h: alt_c_at_h, timeToCSS: alt_timeToCSS},
		points: points };
  console.dir(retVal);
  return retVal;
}

CO2Tool.calculateGenerationRate = function(groupsOfPeople, temperature){
	
	var RQ = 0.85;
	var sumVco2 = 0;
	var sumPeople = 0;
	var maleA = [0.249, 0.095, 0.074, 0.063, 0.048, 0.049];
	var maleB = [-0.127, 2.11, 2.754, 2.896, 3.653, 2.459];
	var femaleA = [0.244, 0.085, 0.056, 0.062, 0.034, 0.038];
	var femaleB = [-0.13, 2.033, 2.898, 2.036, 3.538, 2.755];
	
	for(var i=0; i<groupsOfPeople.length; ++i)
	{
		var groupOfPeople = groupsOfPeople[i];
		var BMR;
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
    Vco2 = RQ * BMR * groupOfPeople.met*(temperature/ pressure) * 0.000211;
		//console.log("Vco2: " + Vco2);
		sumVco2 += Vco2 * groupOfPeople.numPeople;
		sumPeople += groupOfPeople.numPeople;
	}
	//console.log("sumVco2: " + sumVco2);
	//console.log("sumPeople: " + sumPeople);
	var Vco2avg = sumVco2 / sumPeople;
	console.log("Vco2avg: " + Vco2avg);

	return Vco2avg;
}