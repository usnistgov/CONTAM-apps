"use strict";

if(typeof CST == "undefined")
{
  var CST = {};
}

CST.Init = function()
{
  CST.weatherFileContentsDiv = document.getElementById('weatherFileContents');
  CST.resultsContentsDiv = document.getElementById('ResultContents');
  CST.manualCoolingSetpointInput = document.getElementById('manualCoolingSetpointInput');
  CST.manualCoolingSetpointCombo = document.getElementById('manualCoolingSetpointCombo');
  CST.manualHeatingSetpointInput = document.getElementById('manualHeatingSetpointInput');
  CST.manualHeatingSetpointCombo = document.getElementById('manualHeatingSetpointCombo');
  CST.dewPointTempInput = document.getElementById('dewPointTempInput');
  CST.dewPointTempCombo = document.getElementById('dewPointTempCombo');
  CST.mdot_A_minInput = document.getElementById('mdot_A_minInput');
  CST.mdot_A_minCombo = document.getElementById('mdot_A_minCombo');
  CST.heightInput = document.getElementById('heightInput');
  CST.heightCombo = document.getElementById('heightCombo');
  CST.NightEndInput = document.getElementById('NightEndInput');
  CST.NightStartInput = document.getElementById('NightStartInput');
  CST.gainsSelect = document.getElementById('gainsSelect');
  CST.internalGainInput = document.getElementById('internalGainInput');
  CST.internalGainCombo = document.getElementById('internalGainCombo');
  CST.SetupUnits();
}

window.onload = function()
{
  CST.Init();
}

//setup objects for the ability to change units
CST.SetupUnits = function ()
{
  //Internal heat gains
  CST.internalGainInput.baseValue = 
    CST.internalGainInput.value = 10.0;
  CST.internalGainInput.convert = 0;
  CST.internalGainInput.convertFunction = 
    CONTAM.Units.HeatGainsConvert;
  CST.internalGainCombo.input = CST.internalGainInput;
  CST.internalGainCombo.selectedIndex = 0;
  CST.internalGainCombo.extra = CST.RefreshHeatGainList;
 
  var opt = document.createElement("option");
  opt.value = 10;
  opt.textContent = 10;
  opt.basevalue = 10;
  CST.gainsSelect.appendChild(opt);
  
  opt = document.createElement("option");
  opt.value = 20;
  opt.textContent = 20;
  opt.basevalue = 20;
  CST.gainsSelect.appendChild(opt);
  
  opt = document.createElement("option");
  opt.value = 40;
  opt.textContent = 40;
  opt.basevalue = 40;
  CST.gainsSelect.appendChild(opt);
  CST.ChangeUnits(CST.internalGainCombo);
  
  
  //cooling setpoint
  CST.manualCoolingSetpointInput.baseValue = 
    CST.manualCoolingSetpointInput.value = "299.15";
  CST.manualCoolingSetpointInput.convert = 0;
  CST.manualCoolingSetpointInput.convertFunction = 
    CONTAM.Units.TemperatureConvert;
  CST.manualCoolingSetpointCombo.input = CST.manualCoolingSetpointInput;
  CST.manualCoolingSetpointCombo.selectedIndex = 3;
  CST.ChangeUnits(CST.manualCoolingSetpointCombo);
  
  //heating setpoint
  CST.manualHeatingSetpointInput.baseValue = 
    CST.manualHeatingSetpointInput.value = "293.15";
  CST.manualHeatingSetpointInput.convert = 0;
  CST.manualHeatingSetpointInput.convertFunction =
    CONTAM.Units.TemperatureConvert;
  CST.manualHeatingSetpointCombo.input = CST.manualHeatingSetpointInput;
  CST.manualHeatingSetpointCombo.selectedIndex = 3;
  CST.ChangeUnits(CST.manualHeatingSetpointCombo);
  
  //dewpoint temp
  CST.dewPointTempInput.baseValue = 
    CST.dewPointTempInput.value = "290.15";
  CST.dewPointTempInput.convert = 0;
  CST.dewPointTempInput.convertFunction =
    CONTAM.Units.TemperatureConvert;
  CST.dewPointTempCombo.input = CST.dewPointTempInput;
  CST.dewPointTempCombo.selectedIndex = 3;
  CST.ChangeUnits(CST.dewPointTempCombo);
  
  //min vent rate
  CST.mdot_A_minInput.baseValue = 
    CST.mdot_A_minInput.value = "0.00084";
  CST.mdot_A_minInput.convert = 0;
  CST.mdot_A_minInput.convertFunction =
    CONTAM.Units.FlowPerAreaConvert;
  CST.mdot_A_minCombo.input = CST.mdot_A_minInput;
  CST.mdot_A_minCombo.selectedIndex = 2;
  CST.ChangeUnits(CST.mdot_A_minCombo);
  
  //height
  CST.heightInput.baseValue = 
    CST.heightInput.value = "2.5";
  CST.heightInput.convert = 0;
  CST.heightInput.convertFunction =
    CONTAM.Units.LengthConvert;
  CST.heightCombo.input = CST.heightInput;
  CST.heightCombo.selectedIndex = 1;
  CST.ChangeUnits(CST.heightCombo);
}

// if this is true the program is changing a value and not the user
CST.programChaningInput = false; 

CST.ChangeUnits = function (combo)
{
  combo.input.convert = combo.selectedIndex; 
  CST.programChaningInput = true;
  var value = combo.input.convertFunction(combo.input.baseValue,
    combo.input.convert, 0);
  //print the value to not get a long number with a ton of digits after the decimal
  var printvalue = sprintf("%7.3f", value);
  combo.input.value = parseFloat(printvalue);
  CST.programChaningInput = false;
  if(combo.extra)
    combo.extra();
}

CST.ChangeUnitValue = function (input)
{
  if(CST.programChaningInput == false)
    input.baseValue = input.convertFunction(parseFloat(input.value), 
      input.convert, 1);
}

CST.RefreshHeatGainList = function()
{
  for(var i=0; i<CST.gainsSelect.length; ++i)
  {
    var opt = CST.gainsSelect.options[i];
    var basegain = opt.basevalue;
    var gain = CONTAM.Units.HeatGainsConvert(basegain, 
      CST.internalGainInput.convert, 0);
    opt.value = gain;
    opt.textContent = sprintf("%7.3f", gain);
  }
}

CST.OpenWeatherFile = function (files)
{
  CST.ResultsCalc = [];
  for(var i=0; i<files.length; ++i)
  {
    var reader = new FileReader();
    var file = files[i];
    reader.SResult = {}; 
    reader.SResult.WeatherFileName = file.name;
    var weatherFileLower = reader.SResult.WeatherFileName.toLowerCase();
    if(i==files.length-1)
      reader.SResult.last = true;
    if(weatherFileLower.indexOf('epw') > -1)
      reader.onload = EPWFileRead;
    else if(weatherFileLower.indexOf('csv') > -1)
      reader.onload = TMY3FileRead;
    else if(weatherFileLower.indexOf('tm2') > -1)
      reader.onload = TMY2FileRead;
    else
    {
      alert('The file ' + reader.SResult.WeatherFileName + ' is not a recognized weather file.');
      continue;
    }
    reader.readAsText(file);
  }
  
  function EPWFileRead()
  {
    var SResult = this.SResult;
    SResult.WeatherFileText = this.result;
    ReadEPW.ReadWeatherFile(SResult.WeatherFileText);
    SResult.WeatherRecords = ReadEPW.WeatherRecords;
    CST.ResultsCalc.push(SResult);
    if(SResult.last == true)
      CST.Run();
  }
  
  function TMY3FileRead()
  {
    var SResult = this.SResult;
    SResult.WeatherFileText = this.result;
    ReadTMY3.ReadWeatherFile(SResult.WeatherFileText);
    SResult.WeatherRecords = ReadTMY3.WeatherRecords;
    CST.ResultsCalc.push(SResult);
    if(SResult.last == true)
      CST.Run();
  }
  
  function TMY2FileRead()
  {
    var SResult = this.SResult;
    SResult.WeatherFileText = this.result;
    ReadTMY2.ReadWeatherFile(SResult.WeatherFileText);
    SResult.WeatherRecords = ReadTMY2.WeatherRecords;
    CST.ResultsCalc.push(SResult);
    if(SResult.last == true)
      CST.Run();
  }
}

CST.UserRun = function ()
{
  var wthinput = document.getElementById("wthinput");
  if(wthinput.files.length == 0)
  {
    alert('A weather file must be selected before running a climate suitability analysis.');
    return;
  }
  if(CST.ResultsCalc == undefined)
    CST.OpenWeatherFile(wthinput.files);
  CST.Run();
}

CST.GetParameters = function ()
{
  //CST.manualCoolingSetpoint = 299.15; //TODO: set these
  CST.manualCoolingSetpoint = parseFloat(manualCoolingSetpointInput.baseValue);
  //CST.manualHeatingSetpoint = 293.15;
  CST.manualHeatingSetpoint = parseFloat(manualHeatingSetpointInput.baseValue);
  //CST.dewPointTemp = 290.15;
  CST.dewPointTemp = parseFloat(dewPointTempInput.baseValue);
  //CST.mdot_A_min = 0.00084;
  CST.mdot_A_min = parseFloat(mdot_A_minInput.baseValue);
  //CST.height = 2.5; //ceiling height
  CST.height = parseFloat(heightInput.baseValue);
  //CST.NightEnd = 5;
  CST.NightEnd = parseFloat(NightEndInput.value);
  //CST.NightStart = 18;
  CST.NightStart = parseFloat(NightStartInput.value);

  CST.internalGainsList = [];
  for(var i=0; i<CST.gainsSelect.length; ++i)
  {
    var basegain = CST.gainsSelect.options[i].basevalue;
    CST.internalGainsList.push(basegain);
  }
}

CST.Run = function ()
{
  CST.GetParameters();
  for(var i=0; i<CST.ResultsCalc.length; ++i)
  {
    var SResult = CST.ResultsCalc[i];
    CST.FindMonthMeanTemps(SResult.WeatherRecords);
    CST.CalculateClimateSuitability(SResult);
  }
  CST.ExportResults();
  CST.PresentResult();
}

CST.AddInternalGain = function ()
{
  var gain = parseFloat(internalGainInput.value);
  //convert back to base units
  var basegain = CONTAM.Units.HeatGainsConvert(gain, 
    CST.internalGainInput.convert, 1);
  var option = document.createElement('option');
  option.basevalue = basegain;
  option.value = gain;
  option.textContent = sprintf("%7.3f", gain);
  gainsSelect.appendChild(option);
}

CST.RemoveInternalGain = function ()
{
  if(gainsSelect.selectedIndex >= 0)
  {
    gainsSelect.remove(gainsSelect.selectedIndex);
  }
}

CST.PresentResult = function ()
{
  while( CST.resultsContentsDiv.hasChildNodes() )
  {
    CST.resultsContentsDiv.removeChild(CST.resultsContentsDiv.lastChild);
  }

  CST.H2 = document.createElement('h2');
  CST.H2.innerHTML = "Results - ";
  CST.resultsContentsDiv.appendChild(CST.H2);
  CST.CreateDownloadLink(CST.ExportText);
  
  for(var i=0; i<CST.ResultsCalc.length; ++i)
  {
    var SResult = CST.ResultsCalc[i];
    //alert('Presenting: ' + SResult.WeatherFileName);
    
    var resultsDiv = document.createElement('div');
    resultsDiv.className = "section";
    resultsDiv.style.border = 'solid thin';
    resultsDiv.style.padding = "5px";
    CST.resultsContentsDiv.appendChild(resultsDiv);

    var H3 = document.createElement('h3');
    H3.innerHTML = SResult.WeatherFileName;
    resultsDiv.appendChild(H3);
    
    var gridDiv = document.createElement('div');
    gridDiv.className = "sectiongrid";
    resultsDiv.appendChild(gridDiv);
    
    for(var ig=0; ig<SResult.InternalGainsResultList.length; ++ig)
    {
      var InternalGainsResults = SResult.InternalGainsResultList[ig];

      var directTable = document.createElement('table');
      var directCaption = document.createElement('caption');
      var heatvalue = CONTAM.Units.HeatGainsConvert(
      InternalGainsResults.InternalGains, CST.internalGainInput.convert, 0);      ;
      var heatunits = CONTAM.Units.Strings.HeatGains[CST.internalGainInput.convert];
      heatvalue = sprintf("%7.3f", heatvalue);
      directCaption.innerHTML = "Direct Cooling " + heatvalue + " " + heatunits;
      directTable.appendChild(directCaption);
      gridDiv.appendChild(directTable);

      //row1
      var tr = document.createElement('tr');
      directTable.appendChild(tr);

      var th = document.createElement('th');
      tr.appendChild(th);

      th = document.createElement('th');
      th.innerHTML = "Manual Setpoints";
      tr.appendChild(th);

      th = document.createElement('th');
      th.innerHTML = "Adaptive 80%";
      tr.appendChild(th);

      th = document.createElement('th');
      th.innerHTML = "Adaptive 90%";
      tr.appendChild(th);

      //row2
      tr = document.createElement('tr');
      directTable.appendChild(tr);

      var td = document.createElement('td');
      td.innerHTML = "Ventilation Rate";
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.AverageACHManual.toFixed(3);
      if(InternalGainsResults.AverageACHManual > 5)
      {
        td.style.backgroundColor = "yellow";
        td.style.color = "black";
      }
      else if(InternalGainsResults.AverageACHManual > 10)
        td.style.backgroundColor = "red";
      else if(InternalGainsResults.AverageACHManual > 15)
      {
        td.style.backgroundColor = "magenta";
        td.style.color = "black";
      }
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.AverageACHAuto80.toFixed(3);
      if(InternalGainsResults.AverageACHAuto80 > 5)
      {
        td.style.backgroundColor = "yellow";
        td.style.color = "black";
      }
      else if(InternalGainsResults.AverageACHAuto80 > 10)
        td.style.backgroundColor = "red";
      else if(InternalGainsResults.AverageACHAuto80 > 15)
      {
        td.style.backgroundColor = "magenta";
        td.style.color = "black";
      }
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.AverageACHAuto90.toFixed(3);
      if(InternalGainsResults.AverageACHAuto90 > 5)
      {
        td.style.backgroundColor = "yellow";
        td.style.color = "black";
      }
      else if(InternalGainsResults.AverageACHAuto90 > 10)
        td.style.backgroundColor = "red";
      else if(InternalGainsResults.AverageACHAuto90 > 15)
      {
        td.style.backgroundColor = "magenta";
        td.style.color = "black";
      }
      tr.appendChild(td);    

      //row3
      tr = document.createElement('tr');
      directTable.appendChild(tr);

      var td = document.createElement('td');
      td.innerHTML = "(ACH) <sup>+</sup>/<sub>-</sub>";
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.StdACHManual.toFixed(3);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.StdACHAuto80.toFixed(3);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.StdACHAuto90.toFixed(3);
      tr.appendChild(td);    

      //row4
      tr = document.createElement('tr');
      directTable.appendChild(tr);

      var td = document.createElement('td');
      td.innerHTML = "% Effective";
      tr.appendChild(td);

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentNatVentManual.toFixed(1);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentNatVentAuto80.toFixed(1);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentNatVentAuto90.toFixed(1);
      tr.appendChild(td);    

      //row5
      tr = document.createElement('tr');
      directTable.appendChild(tr);

      var td = document.createElement('td');
      td.innerHTML = "% Too Cold";
      tr.appendChild(td);

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentHeatManual.toFixed(1);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentHeatAuto80.toFixed(1);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentHeatAuto90.toFixed(1);
      tr.appendChild(td);    

      //row6
      tr = document.createElement('tr');
      directTable.appendChild(tr);

      var td = document.createElement('td');
      td.innerHTML = "% Too Hot";
      tr.appendChild(td);

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentTooHotManual.toFixed(1);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentTooHotAuto80.toFixed(1);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentTooHotAuto90.toFixed(1);
      tr.appendChild(td);    

      //row7
      tr = document.createElement('tr');
      directTable.appendChild(tr);

      var td = document.createElement('td');
      td.innerHTML = "% Too Humid";
      tr.appendChild(td);

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentTooHumidManual.toFixed(1);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentTooHumidAuto80.toFixed(1);
      tr.appendChild(td);    

      td = document.createElement('td');
      td.innerHTML = InternalGainsResults.PercentTooHumidAuto90.toFixed(1);
      tr.appendChild(td);
    }

    var nightTable = document.createElement('table');
    var nightCaption = document.createElement('caption');
    nightCaption.innerHTML = "Night Cooling";
    nightTable.appendChild(nightCaption);
    gridDiv.appendChild(nightTable);

    //row1
    var tr = document.createElement('tr');
    nightTable.appendChild(tr);

    var th = document.createElement('th');
    tr.appendChild(th);

    th = document.createElement('th');
    th.innerHTML = "Manual Setpoints";
    tr.appendChild(th);

    th = document.createElement('th');
    th.innerHTML = "Adaptive 80%";
    tr.appendChild(th);

    th = document.createElement('th');
    th.innerHTML = "Adaptive 90%";
    tr.appendChild(th);

    //row2
    tr = document.createElement('tr');
    nightTable.appendChild(tr);

    var td = document.createElement('td');
    td.innerHTML = "Cooling Potential";
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = SResult.LimitingRateOverallAverageManual.toFixed(3);
    tr.appendChild(td);    

    td = document.createElement('td');
    td.innerHTML = SResult.LimitingRateOverallAverageAuto80.toFixed(3);
    tr.appendChild(td);    

    td = document.createElement('td');
    td.innerHTML = SResult.LimitingRateOverallAverageAuto90.toFixed(3);
    tr.appendChild(td);    

    //row3
    tr = document.createElement('tr');
    nightTable.appendChild(tr);

    var td = document.createElement('td');
    td.innerHTML = "(W/m<sup>2</sup> ACH) <sup>+</sup>/<sub>-</sub>";
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = SResult.StdNightRateManual.toFixed(3);
    tr.appendChild(td);    

    td = document.createElement('td');
    td.innerHTML = SResult.StdNightRateAuto80.toFixed(3);
    tr.appendChild(td);    

    td = document.createElement('td');
    td.innerHTML = SResult.StdNightRateAuto90.toFixed(3);
    tr.appendChild(td);    

    //row4
    tr = document.createElement('tr');
    nightTable.appendChild(tr);

    var td = document.createElement('td');
    td.innerHTML = "Days Needed";
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = SResult.NightCoolingNeededCountManual.toFixed(1);
    tr.appendChild(td);    

    td = document.createElement('td');
    td.innerHTML = SResult.NightCoolingNeededCountAuto80.toFixed(1);
    tr.appendChild(td);    

    td = document.createElement('td');
    td.innerHTML = SResult.NightCoolingNeededCountAuto90.toFixed(1);
    tr.appendChild(td);    

    //row5
    tr = document.createElement('tr');
    nightTable.appendChild(tr);

    var td = document.createElement('td');
    td.innerHTML = "% Effective";
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = SResult.NightCoolingPercentEffectiveManual.toFixed(1);
    tr.appendChild(td);    

    td = document.createElement('td');
    td.innerHTML = SResult.NightCoolingPercentEffectiveAuto80.toFixed(1);
    tr.appendChild(td);    

    td = document.createElement('td');
    td.innerHTML = SResult.NightCoolingPercentEffectiveAuto90.toFixed(1);
    tr.appendChild(td);    
  }
  CST.H2.scrollIntoView(true);

}

CST.getStandardDeviation = function (doubleList)
{
  var sum = 0;
  for(var i=0; i < doubleList.length; ++i)
    sum += doubleList[i];
  
  var average = sum / doubleList.length;
  var sumOfDerivation = 0;
  for(var i=0; i < doubleList.length; ++i)
    sumOfDerivation += doubleList[i] * doubleList[i];

  var sumOfDerivationAverage = sumOfDerivation / doubleList.length;
  return Math.sqrt(sumOfDerivationAverage - (average * average));
}

CST.FindMonthMeanTemps = function(WeatherRecords)
{
  //Jan
  CST.SetAdaptiveSetpoints(0, 744, WeatherRecords);

  //Feb
  CST.SetAdaptiveSetpoints(744, 1416, WeatherRecords);

  //Mar
  CST.SetAdaptiveSetpoints(1416, 2160, WeatherRecords);

  //Apr
  CST.SetAdaptiveSetpoints(2160, 2880, WeatherRecords);

  //May
  CST.SetAdaptiveSetpoints(2880, 3624, WeatherRecords);

  //Jun
  CST.SetAdaptiveSetpoints(3624, 4344, WeatherRecords);

  //Jul
  CST.SetAdaptiveSetpoints(4344, 5088, WeatherRecords);

  //Aug
  CST.SetAdaptiveSetpoints(5088, 5832, WeatherRecords);

  //Sep
  CST.SetAdaptiveSetpoints(5832, 6552, WeatherRecords);

  //Oct
  CST.SetAdaptiveSetpoints(6552, 7296, WeatherRecords);

  //Nov
  CST.SetAdaptiveSetpoints(7296, 8016, WeatherRecords);

  //Dec
  CST.SetAdaptiveSetpoints(8016, 8760, WeatherRecords);
}

CST.SetAdaptiveSetpoints = function (RecordMin, RecordMax, WeatherRecords)
{
  var Auto80Cooling, Auto80Heating, Auto90Cooling, Auto90Heating;
  var meanTemp;
  meanTemp = 0;

  for (var i = RecordMin; i < RecordMax; ++i)
  {
    meanTemp += WeatherRecords[i].DryBulbTemperature;
  }
  meanTemp /= RecordMax - RecordMin;

  if (meanTemp >= 33.5)
  {
    Auto80Cooling = 31.5;
    Auto80Heating = 24.5;
    Auto90Cooling = 30.5;
    Auto90Heating = 25.5;
  }
  else if (meanTemp < 10)
  {
    Auto80Cooling = 24.5;
    Auto80Heating = 17.5;
    Auto90Cooling = 23.5;
    Auto90Heating = 18.5;
  }
  else
  {
    Auto80Cooling = 0.3 * meanTemp + 21.5;
    Auto80Heating = 0.3 * meanTemp + 14.5;
    Auto90Cooling = 0.3 * meanTemp + 20.5;
    Auto90Heating = 0.3 * meanTemp + 15.5;
  }

  for (var j = RecordMin; j < RecordMax; ++j)
  {
    WeatherRecords[j].Auto80CoolingSetpoint = Auto80Cooling;
    WeatherRecords[j].Auto80HeatingSetpoint = Auto80Heating;
    WeatherRecords[j].Auto90CoolingSetpoint = Auto90Cooling;
    WeatherRecords[j].Auto90HeatingSetpoint = Auto90Heating;
  }
}

CST.CalculateClimateSuitability = function(SResult)
{
  var setPointDifferenceManual = 0;
  var setPointDifferenceAuto80 = 0;
  var setPointDifferenceAuto90 = 0;
  var balancePointTemperatureManual;
  var balancePointTemperatureAuto80;
  var balancePointTemperatureAuto90;
  var SpecificHeatCapacity = 1.006;
  
  /* NoCoolingNeeded = 0,
     DirectCoolingEffective = 1,
     CoolingNotUseful = 2,
     NightCoolingEffective = 3  
     */

  var WeatherRecords = SResult.WeatherRecords;
  setPointDifferenceManual = CST.manualCoolingSetpoint - CST.manualHeatingSetpoint;
  //alert('Calculating: ' + SResult.WeatherFileName);
  SResult.InternalGainsResultList = [];

  var dewPointInC = CONTAM.Units.TemperatureConvert(
          CST.dewPointTemp, 2, 0);
  for(var ig=0; ig<CST.internalGainsList.length; ++ig)
  {
  
    var internalGainPerArea = CST.internalGainsList[ig];
    var InternalGainsResults = {}; 
    SResult.InternalGainsResultList.push(InternalGainsResults);
    
    InternalGainsResults.InternalGains = internalGainPerArea;
    InternalGainsResults.ResultRecords = [];
    InternalGainsResults.AverageACHManual = 0;
    InternalGainsResults.natVentHourCountManual = 0;
    InternalGainsResults.heatCountManual = 0;
    InternalGainsResults.tooHumidCountManual = 0;
    InternalGainsResults.tooHotCountManual = 0;
    InternalGainsResults.heatCountAuto80 = 0;
    InternalGainsResults.AverageACHAuto80 = 0;
    InternalGainsResults.natVentHourCountAuto80 = 0;
    InternalGainsResults.tooHumidCountAuto80 = 0;
    InternalGainsResults.tooHotCountAuto80 = 0;
    InternalGainsResults.heatCountAuto90 = 0;
    InternalGainsResults.AverageACHAuto90 = 0;
    InternalGainsResults.natVentHourCountAuto90 = 0;
    InternalGainsResults.tooHumidCountAuto90 = 0;
    InternalGainsResults.tooHotCountAuto90 = 0;
    SResult.nightCoolingEffectiveCountManual = 0;
    SResult.LimitingRateOverallAverageManual = 0;
    SResult.nightCoolingEffectiveCountAuto80 = 0;
    SResult.LimitingRateOverallAverageAuto80 = 0;
    SResult.nightCoolingEffectiveCountAuto90 = 0;
    SResult.LimitingRateOverallAverageAuto90 = 0;
    SResult.NightCoolingNeededCountManual = 0;
    SResult.NightCoolingNeededCountAuto80 = 0;
    SResult.NightCoolingNeededCountAuto90 = 0;
    
    var achsManual = [];
    var achsAuto80 = [];
    var achsAuto90 = [];
    var i;
    for (i = 0; i < WeatherRecords.length; ++i)
    {
      var heatSetpointManual, coolSetpointManual;
      var heatSetpointAuto80, coolSetpointAuto80;
      var heatSetpointAuto90, coolSetpointAuto90;
      coolSetpointAuto80 = WeatherRecords[i].Auto80CoolingSetpoint;
      heatSetpointAuto80 = WeatherRecords[i].Auto80HeatingSetpoint;
      setPointDifferenceAuto80 = coolSetpointAuto80 - heatSetpointAuto80;
      coolSetpointAuto90 = WeatherRecords[i].Auto90CoolingSetpoint;
      heatSetpointAuto90 = WeatherRecords[i].Auto90HeatingSetpoint;
      setPointDifferenceAuto90 = coolSetpointAuto90 - heatSetpointAuto90;
      coolSetpointManual = CONTAM.Units.TemperatureConvert(
        CST.manualCoolingSetpoint, 2, 0);
      heatSetpointManual = CONTAM.Units.TemperatureConvert(
        CST.manualHeatingSetpoint, 2, 0);

      //part B
      balancePointTemperatureManual = heatSetpointManual -
          (internalGainPerArea / 1000.0 / (1 * CST.mdot_A_min));
      //divide by 1000 to get gains to KW / m^2
      balancePointTemperatureAuto80 = heatSetpointAuto80 -
          (internalGainPerArea / 1000.0 / (1 * CST.mdot_A_min));
      //divide by 1000 to get gains to KW / m^2
      balancePointTemperatureAuto90 = heatSetpointAuto90 -
          (internalGainPerArea / 1000.0 / (1 * CST.mdot_A_min));
      //divide by 1000 to get gains to KW / m^2

      //part C
      if (WeatherRecords[i].DryBulbTemperature <= balancePointTemperatureManual)
      {
        var ResultRecord = {};
        ResultRecord.Date = WeatherRecords[i].Date;
        ResultRecord.Time = WeatherRecords[i].Time;
        ResultRecord.DirectCoolingResultManual = 0;
        InternalGainsResults.ResultRecords.push(ResultRecord);
        InternalGainsResults.heatCountManual++;
      }
      else if (balancePointTemperatureManual < WeatherRecords[i].DryBulbTemperature &&
          WeatherRecords[i].DryBulbTemperature <
          balancePointTemperatureManual + setPointDifferenceManual &&
          WeatherRecords[i].DewPointTemperature <= dewPointInC)
      {
        var ach;
        var ResultRecord = {};
        ResultRecord.Date = WeatherRecords[i].Date;
        ResultRecord.Time = WeatherRecords[i].Time;
        ResultRecord.DirectCoolingResultManual = 1;
        InternalGainsResults.ResultRecords.push(ResultRecord);
        ach = CST.mdot_A_min * 3600.0 / (CST.height * 1.2);
        InternalGainsResults.AverageACHManual += ach;
        InternalGainsResults.natVentHourCountManual++;
        achsManual.push(ach);
      }
      else if ((balancePointTemperatureManual + setPointDifferenceManual <=
          WeatherRecords[i].DryBulbTemperature &&
          WeatherRecords[i].DryBulbTemperature < coolSetpointManual - 1) &&
          WeatherRecords[i].DewPointTemperature <= dewPointInC)
      {
        var ResultRecord = {};
        ResultRecord.Date = WeatherRecords[i].Date;
        ResultRecord.Time = WeatherRecords[i].Time;
        ResultRecord.DirectCoolingResultManual = 1;
        InternalGainsResults.ResultRecords.push(ResultRecord);
        var ach;
        var mdot_a = internalGainPerArea / (SpecificHeatCapacity * 1000.0 *
            (coolSetpointManual - WeatherRecords[i].DryBulbTemperature));
        ach = mdot_a * 3600.0 / (CST.height * 1.2);
        InternalGainsResults.AverageACHManual += ach;
        InternalGainsResults.natVentHourCountManual++;
        achsManual.push(ach);
      }
      else if (WeatherRecords[i].DryBulbTemperature >= coolSetpointManual - 1 ||
          WeatherRecords[i].DewPointTemperature > dewPointInC)
      {
        var ResultRecord = {};
        ResultRecord.Date = WeatherRecords[i].Date;
        ResultRecord.Time = WeatherRecords[i].Time;
        ResultRecord.DirectCoolingResultManual = 2;
        InternalGainsResults.ResultRecords.push(ResultRecord);
        if (WeatherRecords[i].DewPointTemperature > dewPointInC)
          InternalGainsResults.tooHumidCountManual++;
        if (WeatherRecords[i].DryBulbTemperature >= coolSetpointManual - 1)
          InternalGainsResults.tooHotCountManual++;
      }
      else
      {
        alert("Unknown Hour");
      }

      if (WeatherRecords[i].DryBulbTemperature <= balancePointTemperatureAuto80)
      {
        InternalGainsResults.ResultRecords[i].DirectCoolingResultAuto80 = 0;
        InternalGainsResults.heatCountAuto80++;
      }
      else if (balancePointTemperatureAuto80 < WeatherRecords[i].DryBulbTemperature &&
          WeatherRecords[i].DryBulbTemperature <
          balancePointTemperatureAuto80 + setPointDifferenceAuto80 &&
          WeatherRecords[i].DewPointTemperature <= dewPointInC)
      {
        var ach;
        InternalGainsResults.ResultRecords[i].DirectCoolingResultAuto80 = 1;
        ach = CST.mdot_A_min * 3600.0 / (CST.height * 1.2);
        InternalGainsResults.AverageACHAuto80 += ach;
        InternalGainsResults.natVentHourCountAuto80++;
        achsAuto80.push(ach);
      }
      else if ((balancePointTemperatureAuto80 + setPointDifferenceAuto80 <=
          WeatherRecords[i].DryBulbTemperature &&
          WeatherRecords[i].DryBulbTemperature < coolSetpointAuto80 - 1) &&
          WeatherRecords[i].DewPointTemperature <= dewPointInC)
      {
        InternalGainsResults.ResultRecords[i].DirectCoolingResultAuto80 = 1;
        var ach;
        var mdot_a = internalGainPerArea / (SpecificHeatCapacity * 1000.0 *
            (coolSetpointAuto80 - WeatherRecords[i].DryBulbTemperature));
        ach = mdot_a * 3600.0 / (CST.height * 1.2);
        InternalGainsResults.AverageACHAuto80 += ach;
        InternalGainsResults.natVentHourCountAuto80++;
        achsAuto80.push(ach);
      }
      else if (WeatherRecords[i].DryBulbTemperature >= coolSetpointAuto80 - 1 ||
          WeatherRecords[i].DewPointTemperature > dewPointInC)
      {
        InternalGainsResults.ResultRecords[i].DirectCoolingResultAuto80 = 2;
        if (WeatherRecords[i].DewPointTemperature > dewPointInC)
          InternalGainsResults.tooHumidCountAuto80++;
        if (WeatherRecords[i].DryBulbTemperature >= coolSetpointAuto80 - 1)
          InternalGainsResults.tooHotCountAuto80++;
      }
      else
      {
        alert("Unknown Hour");
      }

      if (WeatherRecords[i].DryBulbTemperature <= balancePointTemperatureAuto90)
      {
        InternalGainsResults.ResultRecords[i].DirectCoolingResultAuto90 = 0;
        InternalGainsResults.heatCountAuto90++;
      }
      else if (balancePointTemperatureAuto90 < WeatherRecords[i].DryBulbTemperature &&
          WeatherRecords[i].DryBulbTemperature <
          balancePointTemperatureAuto90 + setPointDifferenceAuto90 &&
          WeatherRecords[i].DewPointTemperature <= dewPointInC)
      {
        var ach;
        InternalGainsResults.ResultRecords[i].DirectCoolingResultAuto90 = 1;
        ach = CST.mdot_A_min * 3600.0 / (CST.height * 1.2);
        InternalGainsResults.AverageACHAuto90 += ach;
        InternalGainsResults.natVentHourCountAuto90++;
        achsAuto90.push(ach);
      }
      else if ((balancePointTemperatureAuto90 + setPointDifferenceAuto90 <=
          WeatherRecords[i].DryBulbTemperature &&
          WeatherRecords[i].DryBulbTemperature < coolSetpointAuto90 - 1) &&
          WeatherRecords[i].DewPointTemperature <= dewPointInC)
      {
        InternalGainsResults.ResultRecords[i].DirectCoolingResultAuto90 = 1;
        var ach;
        var mdot_a = internalGainPerArea / (SpecificHeatCapacity * 1000.0 *
            (coolSetpointAuto90 - WeatherRecords[i].DryBulbTemperature));
        ach = mdot_a * 3600.0 / (CST.height * 1.2);
        InternalGainsResults.AverageACHAuto90 += ach;
        InternalGainsResults.natVentHourCountAuto90++;
        achsAuto90.push(ach);
      }
      else if (WeatherRecords[i].DryBulbTemperature >= coolSetpointAuto90 - 1 ||
          WeatherRecords[i].DewPointTemperature > dewPointInC)
      {
        InternalGainsResults.ResultRecords[i].DirectCoolingResultAuto90 = 2;
        if (WeatherRecords[i].DewPointTemperature > dewPointInC)
          InternalGainsResults.tooHumidCountAuto90++;
        if (WeatherRecords[i].DryBulbTemperature >= coolSetpointAuto90 - 1)
          InternalGainsResults.tooHotCountAuto90++;
      }
      else
      {
        alert("Unknown Hour");
      }

    }
    if (InternalGainsResults.heatCountManual > 0)
      InternalGainsResults.PercentHeatManual = InternalGainsResults.heatCountManual / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentHeatManual = 0;    

    if (InternalGainsResults.heatCountAuto80 > 0)
      InternalGainsResults.PercentHeatAuto80 = InternalGainsResults.heatCountAuto80 / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentHeatAuto80 = 0;
      
    if (InternalGainsResults.heatCountAuto90 > 0)
      InternalGainsResults.PercentHeatAuto90 = InternalGainsResults.heatCountAuto90 / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentHeatAuto90 = 0;
      
    if (InternalGainsResults.tooHumidCountManual > 0)
      InternalGainsResults.PercentTooHumidManual = InternalGainsResults.tooHumidCountManual / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentTooHumidManual = 0;
      
    if (InternalGainsResults.tooHumidCountAuto80 > 0)
      InternalGainsResults.PercentTooHumidAuto80 = InternalGainsResults.tooHumidCountAuto80 / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentTooHumidAuto80 = 0;
      
    if (InternalGainsResults.tooHumidCountManual > 0)
      InternalGainsResults.PercentTooHumidManual = InternalGainsResults.tooHumidCountManual / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentTooHumidManual = 0;
      
    if (InternalGainsResults.tooHumidCountAuto80 > 0)
      InternalGainsResults.PercentTooHumidAuto80 = InternalGainsResults.tooHumidCountAuto80 / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentTooHumidAuto80 = 0;
      
    if (InternalGainsResults.tooHumidCountAuto90 > 0)
      InternalGainsResults.PercentTooHumidAuto90 = InternalGainsResults.tooHumidCountAuto90 / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentTooHumidAuto90 = 0;
      
    if (InternalGainsResults.tooHotCountManual > 0)
      InternalGainsResults.PercentTooHotManual = InternalGainsResults.tooHotCountManual / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentTooHotManual = 0;
      
    if (InternalGainsResults.tooHotCountAuto80 > 0)
      InternalGainsResults.PercentTooHotAuto80 = InternalGainsResults.tooHotCountAuto80 / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentTooHotAuto80 = 0;
      
    if (InternalGainsResults.tooHotCountAuto90 > 0)
      InternalGainsResults.PercentTooHotAuto90 = InternalGainsResults.tooHotCountAuto90 / 8760.0 * 100.0;
    else
      InternalGainsResults.PercentTooHotAuto90 = 0;
      
    if (InternalGainsResults.natVentHourCountManual > 0)
    {
      InternalGainsResults.AverageACHManual /= InternalGainsResults.natVentHourCountManual;
      InternalGainsResults.PercentNatVentManual = InternalGainsResults.natVentHourCountManual / 8760.0 * 100.0;
      InternalGainsResults.StdACHManual = CST.getStandardDeviation(achsManual);
    }
    if (InternalGainsResults.natVentHourCountAuto80 > 0)
    {
      InternalGainsResults.AverageACHAuto80 /= InternalGainsResults.natVentHourCountAuto80;
      InternalGainsResults.PercentNatVentAuto80 = InternalGainsResults.natVentHourCountAuto80 / 8760.0 * 100.0;
      InternalGainsResults.StdACHAuto80 = CST.getStandardDeviation(achsAuto80);
    }
    if (InternalGainsResults.natVentHourCountAuto90 > 0)
    {
      InternalGainsResults.AverageACHAuto90 /= InternalGainsResults.natVentHourCountAuto90;
      InternalGainsResults.PercentNatVentAuto90 = InternalGainsResults.natVentHourCountAuto90 / 8760.0 * 100.0;
      InternalGainsResults.StdACHAuto90 = CST.getStandardDeviation(achsAuto90);
    }
  }

  //part d
  var k = 0;
  var limitingRateDayAverageManual = 0;
  var countManual = 0;
  var limitingRatesManual = [];
  var nightHours = CST.NightEnd + 24 - CST.NightStart + 1;
  while (k < WeatherRecords.length)
  {
    var hour = parseInt(
        CONTAM.TimeUtilities.HourString(
        WeatherRecords[k].Time));
    if (SResult.InternalGainsResultList[0].ResultRecords[k].DirectCoolingResultManual == 2 &&
        (hour < CST.NightStart && hour > CST.NightEnd))
    {
      var Today = WeatherRecords[k].Date;
      var yesterday = Today - 1;
      if (yesterday < 1)
        yesterday += 365;
      var j = k;
      var hour3 = parseInt(
          CONTAM.TimeUtilities.HourString(
          WeatherRecords[j].Time));
      while (WeatherRecords[j].Date > yesterday || hour3 >= CST.NightStart)
      {
        --j;
        if (j < 0)
          j = WeatherRecords.length - 1;
        hour3 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));
      }
      j++;
      limitingRateDayAverageManual = 0;
      SResult.NightCoolingNeededCountManual++;
      countManual = 0;
      hour3 = parseInt(
          CONTAM.TimeUtilities.HourString(
          WeatherRecords[j].Time));
      while (WeatherRecords[j].Date < Today || hour3 <= CST.NightEnd)
      {
        var hour2 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));

        var coolingSetpoint;
        coolingSetpoint = CST.manualCoolingSetpoint;
        //convert from K to C
        coolingSetpoint = CONTAM.Units.TemperatureConvert(
          coolingSetpoint, 2, 0);
        if ((hour2 >= CST.NightStart ||
            hour2 <= CST.NightEnd) &&
            (WeatherRecords[j].DryBulbTemperature < coolingSetpoint &&
            WeatherRecords[j].DewPointTemperature <= dewPointInC))
        {
          limitingRateDayAverageManual += CST.mdot_A_min *
              SpecificHeatCapacity * 1000.0 *
              (coolingSetpoint - WeatherRecords[j].DryBulbTemperature);
          countManual++;
          SResult.InternalGainsResultList[0].ResultRecords[j].DirectCoolingResultManual = 3;
        }

        j++;
        hour3 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));
      }

      if (countManual > 0)
      {
        limitingRateDayAverageManual /= nightHours;
        SResult.nightCoolingEffectiveCountManual++;
        limitingRatesManual.push(limitingRateDayAverageManual);
        SResult.LimitingRateOverallAverageManual += limitingRateDayAverageManual;
      }
      
      while (k < WeatherRecords.length &&
          WeatherRecords[k].Date <= Today)
      {
        k++;
      }
    }
    else
      k++;
  }

  k = 0;
  var limitingRateDayAverageAuto80 = 0;
  var countAuto80 = 0;
  var limitingRatesAuto80 = [];
  while (k < WeatherRecords.length)
  {
    var hour = parseInt(
        CONTAM.TimeUtilities.HourString(
        WeatherRecords[k].Time));
    if (SResult.InternalGainsResultList[0].ResultRecords[k].DirectCoolingResultAuto80 == 2 &&
        (hour < CST.NightStart && hour > CST.NightEnd))
    {
      var Today = WeatherRecords[k].Date;
      var yesterday = Today - 1;
      if (yesterday < 1)
        yesterday += 365;
      var j = k;
      var hour3 = parseInt(
          CONTAM.TimeUtilities.HourString(
          WeatherRecords[j].Time));
      while (WeatherRecords[j].Date > yesterday || hour3 >= CST.NightStart)
      {
        --j;
        if (j < 0)
          j = WeatherRecords.length - 1;
        hour3 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));
      }
      j++;
      limitingRateDayAverageAuto80 = 0;
      SResult.NightCoolingNeededCountAuto80++;
      countAuto80 = 0;
      hour3 = parseInt(
          CONTAM.TimeUtilities.HourString(
          WeatherRecords[j].Time));
      while (WeatherRecords[j].Date < Today || hour3 <= CST.NightEnd)
      {
        var hour2 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));

        var coolingSetpoint;
        coolingSetpoint = WeatherRecords[j].Auto80CoolingSetpoint;
        if ((hour2 >= CST.NightStart ||
            hour2 <= CST.NightEnd) &&
            (WeatherRecords[j].DryBulbTemperature < coolingSetpoint &&
            WeatherRecords[j].DewPointTemperature <= dewPointInC))
        {
          limitingRateDayAverageAuto80 += CST.mdot_A_min *
              SpecificHeatCapacity * 1000.0 *
              (coolingSetpoint - WeatherRecords[j].DryBulbTemperature);
          countAuto80++;
          SResult.InternalGainsResultList[0].ResultRecords[j].DirectCoolingResultAuto80 = 3;
        }
        j++;
        hour3 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));
      }

      if (countAuto80 > 0)
      {
        limitingRateDayAverageAuto80 /= nightHours;
        SResult.nightCoolingEffectiveCountAuto80++;
        limitingRatesAuto80.push(limitingRateDayAverageAuto80);
        SResult.LimitingRateOverallAverageAuto80 += limitingRateDayAverageAuto80;
      }
      while (k < WeatherRecords.length &&
          WeatherRecords[k].Date <= Today)
      {
        k++;
      }
    }
    else
      k++;
  }

  k = 0;
  var limitingRateDayAverageAuto90 = 0;
  var countAuto90 = 0;
  var limitingRatesAuto90 = [];
  while (k < WeatherRecords.length)
  {
    var hour = parseInt(
        CONTAM.TimeUtilities.HourString(
        WeatherRecords[k].Time));
    if (SResult.InternalGainsResultList[0].ResultRecords[k].DirectCoolingResultAuto90 == 2 &&
        (hour < CST.NightStart && hour > CST.NightEnd))
    {
      var Today = WeatherRecords[k].Date;
      var yesterday = Today - 1;
      if (yesterday < 1)
        yesterday += 365;
      var j = k;
      var hour3 = parseInt(
          CONTAM.TimeUtilities.HourString(
          WeatherRecords[j].Time));
      while (WeatherRecords[j].Date > yesterday || hour3 >= CST.NightStart)
      {
        --j;
        if (j < 0)
          j = WeatherRecords.length - 1;
        hour3 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));
      }
      j++;
      limitingRateDayAverageAuto90 = 0;
      SResult.NightCoolingNeededCountAuto90++;
      countAuto90 = 0;
      hour3 = parseInt(
          CONTAM.TimeUtilities.HourString(
          WeatherRecords[j].Time));
      while (WeatherRecords[j].Date < Today || hour3 <= CST.NightEnd)
      {
        var hour2 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));

        var coolingSetpoint;
        coolingSetpoint = WeatherRecords[j].Auto90CoolingSetpoint;
        if ((hour2 >= CST.NightStart ||
            hour2 <= CST.NightEnd) &&
            (WeatherRecords[j].DryBulbTemperature < coolingSetpoint &&
            WeatherRecords[j].DewPointTemperature <= dewPointInC))
        {
          limitingRateDayAverageAuto90 += CST.mdot_A_min *
              SpecificHeatCapacity * 1000.0 *
              (coolingSetpoint - WeatherRecords[j].DryBulbTemperature);
          countAuto90++;
          SResult.InternalGainsResultList[0].ResultRecords[j].DirectCoolingResultAuto90 = 3;
        }
        j++;
        hour3 = parseInt(
            CONTAM.TimeUtilities.HourString(
            WeatherRecords[j].Time));
      }
      if (countAuto90 > 0)
      {
        limitingRateDayAverageAuto90 /= nightHours;
        SResult.nightCoolingEffectiveCountAuto90++;
        limitingRatesAuto90.push(limitingRateDayAverageAuto90);
        SResult.LimitingRateOverallAverageAuto90 += limitingRateDayAverageAuto90;
      }
      while (k < WeatherRecords.length &&
          WeatherRecords[k].Date <= Today)
      {
        k++;
      }
    }
    else
      k++;
  }

  
  if (SResult.nightCoolingEffectiveCountManual > 0)
  {
    SResult.StdNightRateManual = CST.getStandardDeviation(limitingRatesManual);
    SResult.NightCoolingPercentEffectiveManual =
        SResult.nightCoolingEffectiveCountManual /
        SResult.NightCoolingNeededCountManual * 100.0;
    SResult.LimitingRateOverallAverageManual /= SResult.nightCoolingEffectiveCountManual;
  }
  else
  {
    SResult.StdNightRateManual = 0;
    SResult.NightCoolingPercentEffectiveManual = 0;
    SResult.LimitingRateOverallAverageManual = 0;
  }
  
  if (SResult.nightCoolingEffectiveCountAuto80 > 0)
  {
    SResult.StdNightRateAuto80 = CST.getStandardDeviation(limitingRatesAuto80);
    SResult.NightCoolingPercentEffectiveAuto80 =
        SResult.nightCoolingEffectiveCountAuto80 /
        SResult.NightCoolingNeededCountAuto80 * 100.0;
    SResult.LimitingRateOverallAverageAuto80 /= SResult.nightCoolingEffectiveCountAuto80;
  }
  else
  {
    SResult.StdNightRateAuto80 = 0;
    SResult.NightCoolingPercentEffectiveAuto80 = 0;
    SResult.LimitingRateOverallAverageAuto80 = 0;
  }

  if (SResult.nightCoolingEffectiveCountAuto90 > 0)
  {
    SResult.StdNightRateAuto90 = CST.getStandardDeviation(limitingRatesAuto90);
    SResult.NightCoolingPercentEffectiveAuto90 =
        SResult.nightCoolingEffectiveCountAuto90 /
        SResult.NightCoolingNeededCountAuto90 * 100.0;
    SResult.LimitingRateOverallAverageAuto90 /= SResult.nightCoolingEffectiveCountAuto90;
  }
  else
  {
    SResult.StdNightRateAuto90 = 0;
    SResult.NightCoolingPercentEffectiveAuto90 = 0;
    SResult.LimitingRateOverallAverageAuto90 = 0;
  }
  //CST.ResultsCalc.push(SResult);
  return false;
}

CST.ExportResults = function ()
{
  var index = 0;
  CST.ExportText = "";
  for(var i=0; i<CST.ResultsCalc.length; ++i)
  {
    var result = CST.ResultsCalc[i];
    CST.ExportText += result.WeatherFileName + "\n";
    CST.ExportText += "Direct Cooling\n";
    for(var ig=0; ig<result.InternalGainsResultList.length; ++ig)
    {
      var irResult = result.InternalGainsResultList[ig];
      CST.ExportText += "\n";
      CST.ExportText += irResult.InternalGains + " W/m^2\tManual Setpoints\tAdaptive 80%\tAdaptive 90%\n";
      CST.ExportText += "Ventilation Rate\t" + irResult.AverageACHManual +
        "\t" + irResult.AverageACHAuto80 + "\t" + irResult.AverageACHAuto90 + "\n";
      CST.ExportText += "(ACH) +/-\t" + irResult.StdACHManual + "\t" +
        irResult.StdACHAuto80 + "\t" + irResult.StdACHAuto90 + "\n";
      CST.ExportText += "% Effective\t" + irResult.PercentNatVentManual + "\t" +
        irResult.PercentNatVentAuto80 + "\t" + irResult.PercentNatVentAuto90 + "\n";
      CST.ExportText += "% Too Cold\t" + irResult.PercentHeatManual + "\t" +
        irResult.PercentHeatAuto80 + "\t" + irResult.PercentHeatAuto90 + "\n";
      CST.ExportText += "% Too Hot\t" + irResult.PercentTooHotManual + "\t" +
        irResult.PercentTooHotAuto80 + "\t" + irResult.PercentTooHotAuto90 + "\n";
      CST.ExportText += "% Too Humid\t" + irResult.PercentTooHumidManual + "\t" +
        irResult.PercentTooHumidAuto80 + "\t" + irResult.PercentTooHumidAuto90 + "\n";
    }
    CST.ExportText += "\n";
    CST.ExportText += "Night Cooling\tManual Setpoints\tAdaptive 80%\tAdaptive 90%\n";
    CST.ExportText += "Cooling Potential\t" + result.LimitingRateOverallAverageManual +
      "\t" + result.LimitingRateOverallAverageAuto80 +
      "\t" + result.LimitingRateOverallAverageAuto90 + "\n";
    CST.ExportText += "(W/m^2*ACH) +/-\t" + result.StdNightRateManual + "\t" +
      result.StdNightRateAuto80 + "\t" + result.StdNightRateAuto90 + "\n";
    CST.ExportText += "Days Needed\t" + result.NightCoolingNeededCountManual + "\t" +
      result.NightCoolingNeededCountAuto80 +
      "\t" + result.NightCoolingNeededCountAuto90 + "\n";
    CST.ExportText += "% Effective\t" + result.NightCoolingPercentEffectiveManual +
      "\t" + result.NightCoolingPercentEffectiveAuto80 + "\t" +
      result.NightCoolingPercentEffectiveAuto90 + "\n";
    CST.ExportText += "\n";
    CST.ExportDirectCoolingResults(result);
    index++;
  }
}

CST.ExportDirectCoolingResults = function (SResult)
{
  CST.ExportText += "\n";
  CST.ExportText += "Hourly Breakdown\n";
  for(var ig=0; ig<SResult.InternalGainsResultList.length; ++ig)
  {
    var igResult = SResult.InternalGainsResultList[ig];
    var index = 0;
    CST.ExportText += igResult.InternalGains + " W/m^2\n";
    CST.ExportText += "Too Cold = 0, Natural Ventilation Effective = 1," +
      " Too Hot or Humid = 2, Night Cooling Effective = 3\n";
    CST.ExportText += "Manual Setpoints\n";
    CST.ExportText += "Hour >\t1\t2\t3\t4\t5\t6\t7\t8\t9\t10\t11\t12" +
      "\t13\t14\t15\t16\t17\t18\t19\t20\t21\t22\t23\t24\n";
    while (index < igResult.ResultRecords.length)
    {
      CST.ExportText += CONTAM.DateUtilities.IntDateXToStringDateX(
        igResult.ResultRecords[index].Date) + "\t";
      for (var i = 0; i < 24; ++i)
      {
        CST.ExportText += 
          igResult.ResultRecords[index + i].DirectCoolingResultManual + "\t";
      }
      CST.ExportText += "\n";
      index += 24;
    }
    index = 0;
    CST.ExportText += "Adaptive Setpoints 80%\n";
    CST.ExportText += "Hour >\t1\t2\t3\t4\t5\t6\t7\t8\t9\t10\t11\t12" +
      "\t13\t14\t15\t16\t17\t18\t19\t20\t21\t22\t23\t24\n";
    while (index < igResult.ResultRecords.length)
    {
      CST.ExportText += CONTAM.DateUtilities.IntDateXToStringDateX(
        igResult.ResultRecords[index].Date) + "\t";
      for (var i = 0; i < 24; ++i)
      {
        CST.ExportText +=
          igResult.ResultRecords[index + i].DirectCoolingResultAuto80 + "\t";
      }
      CST.ExportText += "\n";
      index += 24;
    }
    index = 0;
    CST.ExportText += "Adaptive Setpoints 90%\n";
    CST.ExportText += "Hour >\t1\t2\t3\t4\t5\t6\t7\t8\t9\t10\t11\t12" +
      "\t13\t14\t15\t16\t17\t18\t19\t20\t21\t22\t23\t24\n";
    while (index < igResult.ResultRecords.length)
    {
      CST.ExportText += CONTAM.DateUtilities.IntDateXToStringDateX(
        igResult.ResultRecords[index].Date) + "\t";
      for (var i = 0; i < 24; ++i)
      {
        CST.ExportText += 
          igResult.ResultRecords[index + i].DirectCoolingResultAuto90 + "\t";
      }
      CST.ExportText += "\n";
      index += 24;
    }
  }
}

CST.CreateDownloadLink = function (fileContents)
{
  var textFileAsBlob = new Blob([fileContents], {type:'text/plain'});
  var savelink = document.createElement("a");

  //microsoft doing their own thing again
  if(window.navigator.msSaveOrOpenBlob) 
  {
    savelink.onclick  = function(e)
    {
      window.navigator.msSaveOrOpenBlob(textFileAsBlob, "CST_Results.txt");
    }
    savelink.style.cursor = "pointer";
    savelink.style.color = "#00f";
    savelink.style.textDecoration = "underline";
  }
  else
  {
    savelink.download = "CST_Results.txt";
    savelink.href = window.URL.createObjectURL(textFileAsBlob);
  }
  savelink.textContent = "Save Results";
  CST.H2.appendChild(savelink);
}


