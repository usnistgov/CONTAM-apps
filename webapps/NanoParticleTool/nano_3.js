var Nano = {};

window.onload = function()
{
  Nano.ExpChart = document.getElementById("air_concen_chart");
  Nano.SurfChart = document.getElementById("surf_concen_chart");
  Nano.ExposChart = document.getElementById("expos_chart");
  Nano.simStatusSpan = document.getElementById("simStatusSpan");
  Nano.downloadLinksDiv = document.getElementById("downloadLinksDiv");
  Nano.Init();
  Nano.GetPrj().then(
    function(result)
    {
      //initialize contam worker
      //these paths are relative to the worker's path
      var workerFileURLs = ["../NanoParticleTool/SrfFileReader.js",
        "../NanoParticleTool/CtrlLogFileReader_2.js",
        "../NanoParticleTool/ochdsch.js"];
      CWD.Init(new Worker("../contam/contam_worker_3.js"));
      CWD.SetOnMessageFunction(Nano.onWorkerMessage);
      CWD.LoadURLsOnWorker(workerFileURLs).then(
        function(result)
        {
          CWD.CallContamFunction("CONTAM.Project.ParseProject", [Nano.CtmPrj]).then(
            function(result)
            {
            },
            function(error)
            {
              alert(error.message);
            }  
          );
        },
        function(error)
        {
          alert(error.message);
        }
      );
    },
    function(error)
    {
      alert(error.message);
    }
  );

}

Nano.Init = function()
{
  Nano.BuidlingVolumeInput = document.getElementById("BuildingVolumeInput");
  Nano.BuidlingVolumeCombo = document.getElementById("BuildingVolumeCombo");
  Nano.ParticleDiameterInput = document.getElementById("ParticleDiameterInput");
  Nano.ParticleDiameterCombo = document.getElementById("ParticleDiameterCombo");
  Nano.ParticleDensityInput = document.getElementById("ParticleDensityInput");
  Nano.ParticleDensityCombo = document.getElementById("ParticleDensityCombo");  
  Nano.SurfaceAreaInput = document.getElementById("SurfaceAreaInput");
  Nano.SurfaceAreaCombo = document.getElementById("SurfaceAreaCombo");
  Nano.DepositionVelocityInput = document.getElementById("DepositionVelocityInput");
  Nano.DepositionVelocityCombo = document.getElementById("DepositionVelocityCombo");
  Nano.AirChangeRateInput = document.getElementById("AirChangeRateInput");
  //Nano.AirChangeRateCombo = document.getElementById("AirChangeRateCombo");
  Nano.ResuspensionAreaInput = document.getElementById("ResuspensionAreaInput");
  Nano.ResuspensionAreaCombo = document.getElementById("ResuspensionAreaCombo");
  Nano.ResuspensionRateInput = document.getElementById("ResuspensionRateInput");
  Nano.ResuspensionRateCombo = document.getElementById("ResuspensionRateCombo");
  Nano.InitialLoadingInput = document.getElementById("InitialLoadingInput");
  Nano.InitialLoadingCombo = document.getElementById("InitialLoadingCombo");
  Nano.StartSourceInput = document.getElementById("StartSourceInput");
  Nano.EndSourceInput = document.getElementById("EndSourceInput");
  
  Nano.IntegratedExposureInput = document.getElementById("IntegratedExposureInput");
  Nano.IntegratedExposureCombo = document.getElementById("IntegratedExposureCombo");
  Nano.resultantexposure2 = document.getElementById("resultantexposure2");
  Nano.resultantexposure2units = document.getElementById("resultantexposure2units");
  
  Nano.resultantexposure3 = document.getElementById("resultantexposure3");
  Nano.resultantexposure3units = document.getElementById("resultantexposure3units");
  Nano.averageExposureDiv = document.getElementById("averageExposureDiv");
  Nano.maximumConc = document.getElementById("maximumConc");
  Nano.maximumConcunits = document.getElementById("maximumConcunits");
  Nano.maxExposureDiv = document.getElementById("maxExposureDiv");
  Nano.maximumConcExpos = document.getElementById("maximumConcExpos");
  Nano.maximumConcExposunits = document.getElementById("maximumConcExposunits");
  
  Nano.StartExposureInput = document.getElementById("StartExposureInput");
  Nano.EndExposureInput = document.getElementById("EndExposureInput");
  
  Nano.ReleaseAmountInput = document.getElementById("ReleaseAmountInput");
  Nano.ReleaseAmountCombo = document.getElementById("ReleaseAmountCombo");
  Nano.ReleaseRateInput = document.getElementById("ReleaseRateInput");
  Nano.ReleaseRateCombo = document.getElementById("ReleaseRateCombo");
  
  Nano.constSrcRadio = document.getElementById("constSrcRadio");

  Nano.SetupUnits();
}

Nano.UpdateEdens = function()
{
  Nano.Species.edens = Nano.ParticleDensityInput.baseValue;
  // after changing the effective density 
  // reconvert the release rate from non-base units to base units
  Nano.ReconvertReleaseRate();
  // reconvert the release amount from non-base units to base units
  Nano.ReconvertReleaseAmount();
}

Nano.UpdateMdiam = function()
{
  Nano.Species.mdiam = Nano.ParticleDiameterInput.baseValue;
  // after changing the mean diameter
  // reconvert the release rate from non-base units to base units
  Nano.ReconvertReleaseRate();
  // reconvert the release amount from non-base units to base units
  Nano.ReconvertReleaseAmount();
}

// convert the value in the input box for release rate 
// to the base units from the currently selected unit
Nano.ReconvertReleaseRate = function()
{
  if(CONTAM.Units.programChaningInput == false)
  {
    Nano.ReleaseRateInput.baseValue = Nano.ReleaseRateInput.convertFunction(parseFloat(Nano.ReleaseRateInput.value), 
      Nano.ReleaseRateInput.convert, 1, Nano.Species);  
  }
}

// convert the value in the input box for release amount 
// to the base units from the currently selected unit
Nano.ReconvertReleaseAmount = function()
{
  if(CONTAM.Units.programChaningInput == false)
  {
    Nano.ReleaseAmountInput.baseValue = Nano.ReleaseAmountInput.convertFunction(parseFloat(Nano.ReleaseAmountInput.value), 
      Nano.ReleaseAmountInput.convert, 1, Nano.Species);  
  }
}

Nano.SetupUnits = function()
{
  Nano.Species = {};
  Nano.Species.edens = 1000;
  Nano.Species.mdiam = 1.2e-05;
  Nano.Species.decay = 0;
  Nano.Species.molwt = 28;
  
  //building volume
  CONTAM.Units.SetupUnitInputs(Nano.BuidlingVolumeInput, Nano.BuidlingVolumeCombo,
    0, CONTAM.Units.VolumeConvert, 36, CONTAM.Units.Strings.Volume);

  //particle diameter
  CONTAM.Units.SetupUnitInputs(Nano.ParticleDiameterInput, Nano.ParticleDiameterCombo,
    6, CONTAM.Units.LengthConvert, 1.2e-05, CONTAM.Units.Strings.Length);
  ParticleDiameterInput.addEventListener("change", Nano.UpdateMdiam); 

  //particle density
  CONTAM.Units.SetupUnitInputs(Nano.ParticleDensityInput, Nano.ParticleDensityCombo,
    2, CONTAM.Units.DensityConvert, 1000, CONTAM.Units.Strings.Density);
  ParticleDensityInput.addEventListener("change", Nano.UpdateEdens); 

  //Surface Area
  CONTAM.Units.SetupUnitInputs(Nano.SurfaceAreaInput, Nano.SurfaceAreaCombo,
    0, CONTAM.Units.AreaConvert, 12, CONTAM.Units.Strings.Area);

  //Deposition Velocity
  CONTAM.Units.SetupUnitInputs(Nano.DepositionVelocityInput, Nano.DepositionVelocityCombo,
    0, CONTAM.Units.SpeedConvert, 0.005, CONTAM.Units.Strings.Speed);

  //Resuspension Area
  CONTAM.Units.SetupUnitInputs(Nano.ResuspensionAreaInput, Nano.ResuspensionAreaCombo,
    0, CONTAM.Units.AreaConvert, 12, CONTAM.Units.Strings.Area);

  //Resuspension rate
  CONTAM.Units.SetupUnitInputs(Nano.ResuspensionRateInput, Nano.ResuspensionRateCombo,
    0, CONTAM.Units.TimeConstantConvert, 0.00875, CONTAM.Units.Strings.TimeConstant);

  //initial loading 
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.InitialLoadingInput, Nano.InitialLoadingCombo, 
    0, CONTAM.Units.ConcnSurfConvert, "5.382e-5", CONTAM.Units.Strings.Concentration_Surf, Nano.Species);

  //release rate
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.ReleaseRateInput, Nano.ReleaseRateCombo, 
    2, CONTAM.Units.ConSSConvert2, "1.65e-06", CONTAM.Units.Strings.ConSS2, Nano.Species);

  //release amount
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.ReleaseAmountInput, Nano.ReleaseAmountCombo, 
    2, CONTAM.Units.Mass2Convert, "1.1762e-09", CONTAM.Units.Strings.Mass2, Nano.Species);

  //integrated concentration result
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.IntegratedExposureInput, 
    Nano.IntegratedExposureCombo, 4, CONTAM.Units.IntegratedConcenConvert, "0", 
    CONTAM.Units.Strings.IntegratedConcen, Nano.Species);
  Nano.IntegratedExposureCombo.addEventListener("input", Nano.DisplayExposureResults); 

}

// if this is true the program is changing a value and not the user
Nano.programChaningInput = false; 

Nano.ChangeUnits = function (combo)
{
  combo.input.convert = combo.selectedIndex; 
  Nano.programChaningInput = true;
  var value = combo.input.convertFunction(combo.input.baseValue,
    combo.input.convert, 0);
  //print the value to not get a long number with a ton of digits after the decimal
  var printvalue = sprintf("%4.6g", value);
  combo.input.value = parseFloat(printvalue);
  Nano.programChaningInput = false;
  if(combo.extra)
    combo.extra();
}

Nano.onWorkerMessage = function(oEvent)
{
  var data = oEvent.data;
}

Nano.GetPrj = function()
{
  return promise = new Promise(function(resolve, reject) 
  {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', "cpsc-dvr-gen.prj");

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        Nano.CtmPrj = req.responseText;
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();    
  });
}

Nano.ACH_to_kg_per_s = function(Value, Volume, Elevation, Temperature)
{
  var Pressure, Density;
  var R = 287.055;

  Pressure = 101325 * Math.pow(1 - 0.0000225577 * Elevation, 5.2559);
  Density = Pressure / (R * Temperature);
  return Value * Volume * Density / 3600;
}

Nano.kg_per_s_to_ACH = function(Value, Volume, Elevation, Temperature)
{
  var Pressure;
  var Density;
  var R = 287.055;

  if (Value == 0)
    return 0;
  Pressure = 101325 * Math.pow(1 - 0.0000225577 * Elevation, 5.2559);
  Density = Pressure / (R * Temperature);
  return Value / (Volume * Density / 3600);
}

Nano.GetInputs = function()
{
  var releaseRate;
  var releaseAmount;

  if(Nano.constSrcRadio.checked)
  {
    releaseRate = parseFloat(Nano.ReleaseRateInput.baseValue);
    if(isNaN(releaseRate))
    {
      alert("The release rate is not a number.");
      return;
    }
    //set the burst source to Off schedule 
    CWD.SetContamVariableToVariable("CONTAM.Project.CssList[1].ps", 
      "CONTAM.Project.Wsch0.GetByNumber(4)").then(
      function(result)
      {
        //set the constant source to generation schedule
        CWD.SetContamVariableToVariable("CONTAM.Project.CssList[2].ps", 
          "CONTAM.Project.Wsch0.GetByNumber(3)").then(
          function(result)
          {
            //set constant source release rate
            CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(5).ped.G", releaseRate).then(
              function(result)
              {
                Nano.GetInputs2();
              },
              function(error)
              {
                alert(error.message);
              }  
            );
          },
          function(error)
          {
            alert(error.message);
          }  
        );
      },
      function(error)
      {
        alert(error.message);
      }  
    );
  }
  else
  {
    releaseAmount = parseFloat(Nano.ReleaseAmountInput.baseValue);
    if(isNaN(releaseAmount))
    {
      alert("The release amount is not a number.");
      return;
    }
    //set the burst source to generation schedule
    CWD.SetContamVariableToVariable("CONTAM.Project.CssList[1].ps", 
      "CONTAM.Project.Wsch0.GetByNumber(3)").then(
      function(result)
      {
        //set the constant source to Off schedule
        CWD.SetContamVariableToVariable("CONTAM.Project.CssList[2].ps", 
          "CONTAM.Project.Wsch0.GetByNumber(4)").then(
          function(result)
          {
            //set burst source release amount
            CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(1).ped.M", releaseAmount).then(
              function(result)
              {
                Nano.GetInputs2();
              },
              function(error)
              {
                alert(error.message);
              }  
            );
          },
          function(error)
          {
            alert(error.message);
          }  
        );
      },
      function(error)
      {
        alert(error.message);
      }  
    );
  }
}

Nano.GetInputs2 = function()
{
  var buildingVolume = parseFloat(Nano.BuidlingVolumeInput.baseValue);//
  if(isNaN(buildingVolume))
  {
    alert("The building volume is not a number.");
    return;
  }
  var particlesize = parseFloat(Nano.ParticleDiameterInput.baseValue);//
  if(isNaN(particlesize))
  {
    alert("The particle size is not a number.");
    return;
  }
  Nano.Species.mdiam = particlesize;
  var particledensity = parseFloat(Nano.ParticleDensityInput.baseValue);//
  if(isNaN(particledensity))
  {
    alert("The particle density is not a number.");
    return;
  }
  Nano.Species.edens = particledensity;
  var surfaceArea = parseFloat(Nano.SurfaceAreaInput.baseValue);//
  if(isNaN(surfaceArea))
  {
    alert("The surface area is not a number.");
    return;
  }
  var depositionVelocity = parseFloat(Nano.DepositionVelocityInput.baseValue);//
  if(isNaN(depositionVelocity))
  {
    alert("The deposition velocity is not a number.");
    return;
  }
  var resuspensionArea = parseFloat(Nano.ResuspensionAreaInput.baseValue);//
  if(isNaN(resuspensionArea))
  {
    alert("The resuspension area is not a number.");
    return;
  }
  var resuspensionRate = parseFloat(Nano.ResuspensionRateInput.baseValue);//
  if(isNaN(resuspensionRate))
  {
    alert("The resuspension rate is not a number.");
    return;
  }
  var airchangerate = parseFloat(Nano.AirChangeRateInput.value);//
  if(isNaN(airchangerate))
  {
    alert("The air change rate is not a number.");
    return;
  }
  var initialloading = parseFloat(Nano.InitialLoadingInput.baseValue);//
  if(isNaN(initialloading))
  {
    alert("The initial loading is not a number.");
    return;
  }
  var airflow = Nano.ACH_to_kg_per_s(airchangerate, buildingVolume, 0, 293);

  var StartSource = Nano.StartSourceInput.value;
  var EndSource = Nano.EndSourceInput.value;
  var StartSourceTime = CONTAM.TimeUtilities.StringTimeToIntTime(StartSource);//
  if(StartSourceTime < 0)
  {
    alert("The start source time is not a valid time.");
    return;
  }
  var EndSourceTime = CONTAM.TimeUtilities.StringTimeToIntTime(EndSource);//
  if(EndSourceTime < 0)
  {
    alert("The end source time is not a valid time.");
    return;
  }

  var StartExposure = Nano.StartExposureInput.value;//
  var EndExposure = Nano.EndExposureInput.value;//
  Nano.StartExposureTime = CONTAM.TimeUtilities.StringTimeToIntTime(StartExposure);//
  if(Nano.StartExposureTime < 0)
  {
    alert("The start exposure time is not a valid time.");
    return;
  }
  Nano.EndExposureTime = CONTAM.TimeUtilities.StringTimeToIntTime(EndExposure);//
  if(Nano.EndExposureTime < 0)
  {
    alert("The end exposure time is not a valid time.");
    return;
  }
  Nano.ExposureDuration = Nano.EndExposureTime - Nano.StartExposureTime;

  var variableList = [];

  variableList.push({variableName: "CONTAM.Project.ZoneList[1].Vol", variableValue: buildingVolume});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).mdiam", variableValue: particlesize});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).edens", variableValue: particledensity});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.dV", variableValue: depositionVelocity});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(3).ped.dV", variableValue: depositionVelocity});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.dV", variableValue: depositionVelocity});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.R", variableValue: resuspensionRate});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(3).ped.R", variableValue: resuspensionRate});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.R", variableValue: resuspensionRate});
  variableList.push({variableName: "CONTAM.Project.CssList[3].CC0", variableValue: initialloading});
  variableList.push({variableName: "CONTAM.Project.PathList[2].Fahs", variableValue: airflow});
  variableList.push({variableName: "CONTAM.Project.PathList[3].Fahs", variableValue: airflow});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.dA", variableValue: surfaceArea});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.rA", variableValue: resuspensionArea});
  
  CWD.CallContamFunction("CONTAM.SetOccDaySchedule", [Nano.StartExposureTime, Nano.EndExposureTime]).then(
    function(result)
    {
      CWD.CallContamFunction("CONTAM.SetDaySchedule", [StartSourceTime, EndSourceTime]).then(
        function(result)
        {
          CWD.SetArrayOfContamVariables(variableList).then(
            function(result)
            {
              Nano.RunSim();
            },
            function(error)
            {
              alert(error.message);
            }  
          );
        },
        function(error)
        {
          alert(error.message);
        }  
      );
    },
    function(error)
    {
      alert(error.message);
    }  
  );

}

Nano.RunSim = function()
{
  var projectText;
  
  //Save Project
  CWD.CallContamFunction("CONTAM.Project.prjsave", []).then(
    function(result)
    {
      CWD.GetContamVariable("CONTAM.Project.pst").then(
        function(result)
        {
          projectText = result;
          Nano.createPRJSaveLink(projectText);
          //start simulation
          Nano.simStatusSpan.textContent = "Running Simulation...";
          
          var myWorker = new Worker("../contam-x/contamx_worker.js");

          myWorker.onmessage = Nano.onCXWorkerMessage;

          var data = {};
          data.cmd = "start";
          data.PrjName = "cpsc-dvr-gen.prj";
          data.PrjText = projectText;
          data.WthName = "null";
          data.WthText = "";
          data.CtmName = "null";
          data.CtmText = "";
          data.WpcName = "null";
          data.WpcText = "";
          data.CvfName = "null";
          data.CvfText = "";
          data.DvfName = "null";
          data.DvfText = "";

          myWorker.postMessage(data);
        },
        function(error)
        {
          alert(error.message);
        }  
      );  
    },
    function(error)
    {
      alert(error.message);
    }  
  );
}

Nano.createPRJSaveLink = function(prjText)
{
  while (Nano.downloadLinksDiv.firstChild) {
      Nano.downloadLinksDiv.removeChild(Nano.downloadLinksDiv.firstChild);
  }

  var saveDiv = document.createElement("div");
  var savelink = document.createElement("a");
  var filename = "cpsc-dvr-gen.prj"
  var prjBlob = new Blob([prjText], {type:'text/plain'})

  //microsoft doing their own thing again
  if(window.navigator.msSaveOrOpenBlob) 
  {
    savelink.onclick  = function()
    {
      window.navigator.msSaveOrOpenBlob(prjBlob, filename);
    }
    savelink.style.cursor = "pointer";
    savelink.style.color = "#00f";
    savelink.style.textDecoration = "underline";
  }
  else
  {
    savelink.download = filename;
    savelink.href = window.URL.createObjectURL(prjBlob);
  }
  savelink.textContent = "Download CONTAM Project";
  //saveDiv.className = "redback";
  //savelink.className = "whitelink";
  saveDiv.appendChild(savelink);
  Nano.downloadLinksDiv.appendChild(saveDiv);
}

//this will convert time from google chart format to # of seconds
Nano.ConvertChartTime = function(chart_time)
{
  var hours = chart_time[0].toString();
  var minutes = chart_time[1].toString();
  var seconds = chart_time[2].toString();
  if(hours.length == 1)
    hours = "0" + hours;
  if(minutes.length == 1)
    minutes = "0" + minutes;
  if(seconds.length == 1)
    seconds = "0" + seconds;
  
  var string_time = hours + ":" + minutes + ":" + seconds;
  return CONTAM.TimeUtilities.StringTimeToIntTime(string_time);
  
}

Nano.DisplayExposureResults = function()
{
  var maxExpos = 0;

  Nano.selectedUnits = Nano.IntegratedExposureCombo.selectedIndex;
  var units = ["kg/m&sup3;", "g/m&sup3;", "mg/m&sup3;", "&micro;g/m&sup3;", "&num;/m&sup3;"];

  if(!Nano.integralResult)
    return;
  
  //convert to kg s/m3
  var baseIntegralValue = CONTAM.Units.IntegratedConcenConvert(Nano.integralResult,
    4, 1, Nano.Species);
  
  IntegratedExposureInput.baseValue = baseIntegralValue;
  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.IntegratedExposureCombo);

  //average exposure over the user's exposure period (in #/m3)
  var averageExposureUserNumber = (Nano.integralResult / Nano.ExposureDuration);
  //average exposure over the user's exposure period (in kg/m3)
  var averageExposureUserBase = CONTAM.Units.IntegratedConcenConvert(
    averageExposureUserNumber, 4, 1, Nano.Species);
  //average exposure over the user's exposure period (in user picked units)
  Nano.AverageExposureUserUnits = CONTAM.Units.IntegratedConcenConvert(
    averageExposureUserBase, Nano.selectedUnits, 0, Nano.Species);
  Nano.resultantexposure2.textContent = Nano.AverageExposureUserUnits.toPrecision(4);
  Nano.resultantexposure2units.innerHTML = units[Nano.selectedUnits];
  
  Nano.averageExposureDiv.textContent = "Average Concentration (" + (Nano.ExposureDuration / 3600).toString() + " h)";
  //average exposure over 24 period (in #/m3)
  var averageExposure24Number = Nano.averageConcen;
  //average exposure over 24 period (in kg/m3)
  var averageExposure24Base = CONTAM.Units.IntegratedConcenConvert(
    averageExposure24Number, 4, 1, Nano.Species);
  //average exposure over 24 period (in user picked units)
  Nano.AverageExposure24Units = CONTAM.Units.IntegratedConcenConvert(
    averageExposure24Base, Nano.selectedUnits, 0, Nano.Species);
  Nano.resultantexposure3.textContent = Nano.AverageExposure24Units.toPrecision(4);
  Nano.resultantexposure3units.innerHTML = units[Nano.selectedUnits];
  
  //max concentration (in kg/m3) (24 h)
  var maxConcenBase = CONTAM.Units.IntegratedConcenConvert(
    Nano.maxConcen, 4, 1, Nano.Species);
  //max concentration (in user picked units)
  var maxConcenUnits = CONTAM.Units.IntegratedConcenConvert(
    maxConcenBase, Nano.selectedUnits, 0, Nano.Species);
  Nano.maximumConc.textContent = maxConcenUnits.toPrecision(4);
  Nano.maximumConcunits.innerHTML = units[Nano.selectedUnits];
  
  //plot results
  Nano.concenDataUserUnits = [];
  Nano.exposureDataUserUnits = [];
  Nano.surfaceDataUserUnits = [];
  for(var i=0; i<Nano.concenDataLogUnits.length; ++i)
  {
    var concenRecord = [];
    concenRecord.push(Nano.concenDataLogUnits[i][0]);
    var logvalue = Nano.concenDataLogUnits[i][1];
    var basevalue = CONTAM.Units.IntegratedConcenConvert(
      logvalue, 4, 1, Nano.Species);
    var uservalue = CONTAM.Units.IntegratedConcenConvert(
      basevalue, Nano.selectedUnits, 0, Nano.Species);
    concenRecord.push(uservalue);
    concenRecord.push(Nano.AverageExposure24Units);
    Nano.concenDataUserUnits.push(concenRecord);

    var exposureRecord = [];
    var chart_time = Nano.exposureDataLogUnits[i][0];
    var seconds = Nano.ConvertChartTime(chart_time);
    exposureRecord.push(chart_time);
    var logvalue = Nano.exposureDataLogUnits[i][1];
    var basevalue = CONTAM.Units.IntegratedConcenConvert(
      logvalue, 4, 1, Nano.Species);
    var uservalue = CONTAM.Units.IntegratedConcenConvert(
      basevalue, Nano.selectedUnits, 0, Nano.Species);
    exposureRecord.push(uservalue);
    if(seconds >= Nano.StartExposureTime && seconds <= Nano.EndExposureTime) 
    {
      exposureRecord.push(Nano.AverageExposureUserUnits);
      if(uservalue > maxExpos)
        maxExpos = uservalue;
    }
    else
    {
      exposureRecord.push(0);
    }
    Nano.exposureDataUserUnits.push(exposureRecord);

    var surfaceRecord = [];
    surfaceRecord.push(Nano.surfaceDataBaseUnits[i][0]);
    surfaceRecord.push(CONTAM.Units.IntegratedConcenConvert(
    Nano.surfaceDataBaseUnits[i][1], Nano.selectedUnits, 0, Nano.Species));
    Nano.surfaceDataUserUnits.push(surfaceRecord);
  }

  Nano.maxExposureDiv.textContent = "Maximum Concentration (" + (Nano.ExposureDuration / 3600).toString() + " h)";
  Nano.maximumConcExpos.textContent = maxExpos.toPrecision(4);
  Nano.maximumConcExposunits.innerHTML = units[Nano.selectedUnits];
  
  
  Nano.drawChart();
}


Nano.onCXWorkerMessage = function(oEvent)
{
  var data = oEvent.data;
  if(data.cmd == "console")
  {
    //do nothing
    //CONTAMX.console(data.text);
  }
  else if(data.cmd = "save files")
  {
    Nano.simStatusSpan.textContent = "Simulation Complete.";
    
    //store result files data
    Nano.saveFilesData = data.saveFilesData;
    var logFileIndex, srfFileIndex;
    
    //find which result files are the controls log file and the surface file
    for (i = 0; i < Nano.saveFilesData.length; i++) 
    {
      var filename = Nano.saveFilesData[i].name;
      var ext = filename.substring(filename.length - 4, filename.length);
      if(ext == ".log")
      {
        logFileIndex = i;
      }
      if(ext == ".srf")
      {
        srfFileIndex = i;
      }      
    }
    console.log("read log file");
    CWD.CallContamFunction("CONTAM.CtrlLogFileReader.ReadLogFile", 
      [Nano.saveFilesData[logFileIndex].contents]).then(
      function(result)
      {
        Nano.concenDataLogUnits = result.concendata; // #/m3
        Nano.exposureDataLogUnits = result.exposuredata; // #/m3
        
        Nano.integralResult = result.integral; // # s/m3
        Nano.maxConcen = result.maxConcen; // #/m3
        Nano.averageConcen = result.averageConcen; // #/m3

        console.log("read srf file");
        CWD.CallContamFunction("CONTAM.SrfFileReader.ReadSurfaceFile", 
          [Nano.saveFilesData[srfFileIndex].contents]).then(
          function(result)
          {
            Nano.surfaceDataBaseUnits = result;
            Nano.DisplayExposureResults();
            //Nano.drawChart();
          },
          function(error)
          {
            alert(error.message);
          }  
        );
        //console.log(Nano.saveFilesData[i].contents);
      },
      function(error)
      {
        alert(error.message);
      }  
    );
    
    //CONTAMX.SaveFiles();
    //simulation complete
  }
  else
  {
    alert("Unknown command from worker: " + data.cmd);
  }
  
}

Nano.decodeHtml = function(html) 
{
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

Nano.drawChart = function() 
{
  var air_data, surf_data, expos_data;
  var concen_units = ["kg/m&sup3;", "g/m&sup3;", "mg/m&sup3;", "&micro;g/m&sup3;", "&num;/m&sup3;"];
  var surf_units = ["kg/m&sup2;", "g/m&sup2;", "mg/m&sup2;", "&micro;g/m&sup2;", "&num;/m&sup2;"];
  
  //console.log("drawChart");

  if(Nano.concenDataUserUnits)
  {
    air_data = Nano.concenDataUserUnits;
    surf_data = Nano.surfaceDataUserUnits;
    expos_data = Nano.exposureDataUserUnits;
  }

  var air_data_table = new google.visualization.DataTable();
  air_data_table.addColumn('timeofday', 'Time of Day');
  air_data_table.addColumn('number', 'Concentration ' + 
    Nano.decodeHtml(concen_units[Nano.selectedUnits]));
  air_data_table.addColumn('number', 'Average Concentration ' + 
    Nano.decodeHtml(concen_units[Nano.selectedUnits]));
  if(air_data)
    air_data_table.addRows(air_data);

  var surf_data_table = new google.visualization.DataTable();
  surf_data_table.addColumn('timeofday', 'Time of Day');
  surf_data_table.addColumn('number', 'Concentration ' + 
    Nano.decodeHtml(surf_units[Nano.selectedUnits]));
  if(surf_data)
    surf_data_table.addRows(surf_data);

  var expos_data_table = new google.visualization.DataTable();
  expos_data_table.addColumn('timeofday', 'Time of Day');
  expos_data_table.addColumn('number', 'Exposure ' + 
    Nano.decodeHtml(concen_units[Nano.selectedUnits]));
  expos_data_table.addColumn('number', 'Average Exposure ' + 
    Nano.decodeHtml(concen_units[Nano.selectedUnits]));
  if(expos_data)
    expos_data_table.addRows(expos_data);

  var air_options = {
    backgroundColor: '#F4F5F9',
    chartArea: {'width': '80%', 'height': '80%'},
    title: 'Air Concentration',
    vAxis: { format:'scientific'},
    series: {
      1: { lineDashStyle: [2, 2] }
    },
    legend: { position: 'bottom' }
  };

  var surf_options = {
    backgroundColor: '#F4F5F9',
    chartArea: {'width': '80%', 'height': '80%'},
    title: 'Surface Loading',
    vAxis: { format:'scientific'},
    legend: { position: 'bottom' }
  };

  var expos_options = {
    backgroundColor: '#F4F5F9',
    chartArea: {'width': '80%', 'height': '80%'},
    title: 'Occupant Exposure Concentration',
    vAxis: { format:'scientific'},
    series: {
      1: { lineDashStyle: [2, 2] }
    },
    legend: { position: 'bottom' }
  };

  var air_chart = new google.visualization.LineChart(Nano.ExpChart);
  var surf_chart = new google.visualization.LineChart(Nano.SurfChart);
  var expos_chart = new google.visualization.LineChart(Nano.ExposChart);
  
  //console.log("draw call");
  air_chart.draw(air_data_table, air_options);
  surf_chart.draw(surf_data_table, surf_options);
  expos_chart.draw(expos_data_table, expos_options);
}

Nano.OpenDialog = function (url, callback, dialogtitle)
{
  var iframe = document.getElementById('dialogframe');
  var container = document.getElementById('dialogcontainer');
  var dt = document.getElementById('dialogtitle');
  var dfc = document.getElementById("dialogframecontainer");
  //change the dialog title
  dt.textContent = dialogtitle;
  //create a new iframe to load the document
  //can't seem to reuse the iframe
  dfc.removeChild(iframe);
  iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.id = "dialogframe";
  dfc.appendChild(iframe);
  container.style.display = 'block';
  this.dialogcallback = callback;  
}

Nano.CloseDialog = function (dialogResult)
{
  document.getElementById('dialogcontainer').style.display = 'none';

  if (this.dialogcallback)
    this.dialogcallback(dialogResult);
}

Nano.ComputeVol = function()
{
  Nano.OpenDialog("bldgvol.htm", Nano.VolumeDialogResult, "Compute Building Volume");
}

Nano.VolumeDialogResult = function(dialogResult)
{
  if(dialogResult)
  {
    var iframe = document.getElementById("dialogframe");
    var wind = iframe.contentWindow;
    var vol = wind.vol;
    var floor_area = wind.fa;
    
    var BuildingVolumeInput = document.getElementById("BuildingVolumeInput");
    BuildingVolumeInput.baseValue = vol;
    BuildingVolumeInput.value = BuildingVolumeInput.convertFunction(
      BuildingVolumeInput.baseValue, BuildingVolumeInput.convert, 0);
      
    var BuildingFloorAreaInput = document.getElementById("SurfaceAreaInput");
    BuildingFloorAreaInput.baseValue = floor_area;
    BuildingFloorAreaInput.value = BuildingFloorAreaInput.convertFunction(
      BuildingFloorAreaInput.baseValue, BuildingFloorAreaInput.convert, 0);
    
  }
}

Nano.ComputeACH = function()
{
  Nano.OpenDialog("compach.htm", Nano.ACHResult, "Compute Air Change Rate");
}

Nano.ACHResult = function(dialogResult)
{
  if(dialogResult)
  {
    var iframe = document.getElementById("dialogframe");
    var wind = iframe.contentWindow;
    var ach = wind.ach;

    var AirChangeRateInput = document.getElementById("AirChangeRateInput");
    AirChangeRateInput.value = ach;
  }
}

Nano.changeSrcType = function()
{
  var constSrcRadio = document.getElementById("constSrcRadio");
  var burstSrcRadio = document.getElementById("burstSrcRadio");
  if(constSrcRadio.checked)
  {
    document.getElementById('ReleaseAmountInput').disabled = true;
    document.getElementById('ReleaseAmountCombo').disabled = true;
    document.getElementById('EndSourceInput').disabled = false;
    document.getElementById('ReleaseRateInput').disabled = false;
    document.getElementById('ReleaseRateCombo').disabled = false;
  }
  else
  {
    document.getElementById('ReleaseAmountInput').disabled = false;
    document.getElementById('ReleaseAmountCombo').disabled = false;
    document.getElementById('EndSourceInput').disabled = true;
    document.getElementById('ReleaseRateInput').disabled = true;
    document.getElementById('ReleaseRateCombo').disabled = true;
  }
}