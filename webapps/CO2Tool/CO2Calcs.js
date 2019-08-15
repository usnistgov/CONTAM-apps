var CO2Tool = {};

//people - # of people, mass, age group, sex, activity (met)
// age group (0-5) <3, 3 to 10, 10 to 18, 18 to 30, 30 to 60, > 60
CO2Tool.calculateResult = function(CO2Outdoor, initialCO2Indoor, 
	volumePerPerson, timeToMetric, ventilationRate, groupsOfPeople, altVentilationRate){
			
	console.log("Calculate results: ");
	console.log("CO2Outdoor: " + CO2Outdoor + " mg/m3");
	console.log("initialCO2Indoor: " + initialCO2Indoor + " mg/m3");
	console.log("volumePerPerson: " + volumePerPerson + " m3");
	console.log("timeToMetric: " + timeToMetric + " h");
	console.log("ventilationRate: " + ventilationRate + " L/s");
	console.log("altVentilationRate: " + altVentilationRate + " L/s");
	
	var Vco2avg = CO2Tool.calculateGenerationRate(groupsOfPeople);	
	
	// main result
	var defaultOA = 3.6 * ventilationRate / volumePerPerson;
	console.log("defaultOA: " + defaultOA);

	var Css = 1 * (CO2Outdoor + (1.8 * 1000000 * Vco2avg / ventilationRate));
	console.log("Css: " + Css);
	var c_at_metric = initialCO2Indoor * Math.exp(-defaultOA * timeToMetric) + Css * (1 - Math.exp(-defaultOA * timeToMetric));
	console.log("c_at_metric: " + c_at_metric);
	var c_at_h = initialCO2Indoor * Math.exp(-defaultOA * 1) + Css * (1 - Math.exp(-defaultOA * 1));
	console.log("c_at_h: " + c_at_h);
	var timeToCSS = 3 * (volumePerPerson / ventilationRate) / 3.6;
	console.log("timeToCSS: " + timeToCSS);
	
	// alternate result
	var altDefaultOA = 3.6 * altVentilationRate / volumePerPerson;
	console.log("alt defaultOA: " + altDefaultOA);

	var altCss = 1 * (CO2Outdoor + (1.8 * 1000000 * Vco2avg / altVentilationRate));
	console.log("alt Css: " + altCss);
	var alt_c_at_metric = initialCO2Indoor * Math.exp(-altDefaultOA * timeToMetric) + altCss * (1 - Math.exp(-altDefaultOA * timeToMetric));
	console.log("alt c_at_metric: " + alt_c_at_metric);
	var alt_c_at_h = initialCO2Indoor * Math.exp(-altDefaultOA * 1) + altCss * (1 - Math.exp(-altDefaultOA * 1));
	console.log("alt c_at_h: " + alt_c_at_h);
	var alt_timeToCSS = 3 * (volumePerPerson / altVentilationRate) / 3.6;
	console.log("alt timeToCSS: " + alt_timeToCSS);
	
	var points = [];
	var maxTime = timeToMetric;
	if(timeToCSS > maxTime)
		maxTime = timeToCSS;
	if(alt_timeToCSS > maxTime)
		maxTime = alt_timeToCSS;
	maxTime += 2;
	for(var time=0; time <= maxTime; time+=0.01666666666)
	{
		var valueAtTime = initialCO2Indoor * Math.exp(-defaultOA * time) + Css * (1 - Math.exp(-defaultOA * time));
		var altValueAtTime = initialCO2Indoor * Math.exp(-altDefaultOA * time) + altCss * (1 - Math.exp(-altDefaultOA * time));
		points.push({'time': time, 'value': valueAtTime, 'altvalue': altValueAtTime});
	}
	
	return { base: {Css: Css, c_at_metric: c_at_metric, c_at_h: c_at_h, timeToCSS: timeToCSS}, 
		alt: {Css: altCss, c_at_metric: alt_c_at_metric, c_at_h: alt_c_at_h, timeToCSS: alt_timeToCSS},
		points: points };
}

CO2Tool.calculateGenerationRate = function(groupsOfPeople){
	
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
			console.log("A: " + maleA[groupOfPeople.ageGroup]);
			console.log("B: " + maleB[groupOfPeople.ageGroup]);
			console.log("mass: " + groupOfPeople.mass);
		}
		else
		{
			BMR = femaleA[groupOfPeople.ageGroup] * groupOfPeople.mass + femaleB[groupOfPeople.ageGroup];
			console.log("A: " + femaleA[groupOfPeople.ageGroup]);
			console.log("B: " + femaleB[groupOfPeople.ageGroup]);
			console.log("mass: " + groupOfPeople.mass);
		}
		console.log("BMR: " + BMR);
		Vco2 = RQ * BMR * groupOfPeople.met * 0.000569;
		console.log("Vco2: " + Vco2);
		sumVco2 += Vco2 * groupOfPeople.numPeople;
		sumPeople += groupOfPeople.numPeople;
	}
	console.log("sumVco2: " + sumVco2);
	console.log("sumPeople: " + sumPeople);
	var Vco2avg = sumVco2 / sumPeople;
	console.log("Vco2avg: " + Vco2avg);

	return Vco2avg;
}