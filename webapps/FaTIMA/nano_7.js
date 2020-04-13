// requires units_*.js

var Nano = {};

// Default values based on Karlsson test case.
Nano.Species = {};
Nano.Species.edens = 1300;
Nano.Species.mdiam = 1.2e-05;
Nano.Species.decay = 0;
Nano.Species.molwt = 28;  // WSD Why 28?


// this object holds the inputs from the user
// it is filled in the init function
Nano.Inputs = {};

Nano.Results = {};

window.onload = function()
{
  Nano.ExpChart = document.getElementById("air_concen_chart");
  Nano.SurfChart = document.getElementById("surf_concen_chart");
  Nano.ExposChart = document.getElementById("expos_chart");
  Nano.simStatusSpan = document.getElementById("simStatusSpan");
  Nano.downloadLinksSpan = document.getElementById("downloadLinksSpan");
  Nano.Init();
  Nano.GetPrj().then(
    function(result)
    {
      //initialize contam worker
      //these paths are relative to the worker's path
      var workerFileURLs = ["../FaTIMA/SrfFileReader.js",
        "../FaTIMA/CtrlLogFileReader_2.js",
        "../FaTIMA/contamAddons_2.js"];
      CWD.Init(new Worker("../contam/contam_worker_4.js"));
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

// init the inputs
Nano.Init = function()
{
  // these must be done onload so the UI elements can be gotten from the document
  // these establish unit objects and set up the inputs to handle units

  //building volume
  Nano.Inputs.Volume = 
  { 
    initialValue: 45, 
    convert: 0, 
    func: CONTAM.Units.VolumeConvert, 
    strings: CONTAM.Units.Strings.Volume,
    input: document.getElementById("BuildingVolumeInput"),
    select: document.getElementById("BuildingVolumeCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.Volume);
  Nano.Inputs.Volume.input.addEventListener("change", Nano.computeSystem); 
  
  Nano.Inputs.FloorArea = 
  { 
    initialValue: 20, 
    convert: 0, 
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaFloorInput"),
    select: document.getElementById("SurfaceAreaFloorCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.FloorArea);

  Nano.Inputs.WallArea =
  { 
    initialValue: 0, 
    convert: 0, 
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaWallInput"),
    select: document.getElementById("SurfaceAreaFloorCombo"),
    unitDisplay: document.getElementById("SurfaceAreaWallUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.WallArea);

  Nano.Inputs.CeilingArea =
  { 
    initialValue: 0, 
    convert: 0, 
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaCeilingInput"),
    select: document.getElementById("SurfaceAreaFloorCombo"),
    unitDisplay: document.getElementById("SurfaceAreaCeilingUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.CeilingArea);
  
  Nano.Inputs.PFactor = document.getElementById("PenetrationFactorInput");
  Nano.Inputs.PFactor.value = 1;
  
  // SupplyRate = 0.007525625 kg/s = 22.5 m3/h * 1.2041 kg/m3 / 3600 s/h
  Nano.Inputs.SupplyRate =
  { 
    initialValue: 0.007525625,
    convert: 4,                       // m3/h
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("SupplyRateInput"),
    select: document.getElementById("SupplyRateCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.SupplyRate);
  Nano.Inputs.SupplyRate.input.addEventListener("change", Nano.computeSystem); 
  
  Nano.Inputs.ReturnRate =
  { 
    initialValue: 0.007525625,
    convert: 3, 
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("ReturnRateInput"),
    select: document.getElementById("SupplyRateCombo"),
    unitDisplay: document.getElementById("ReturnRateUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.ReturnRate);
  Nano.Inputs.ReturnRate.input.addEventListener("change", Nano.computeSystem); 
  
  Nano.Inputs.PercentOA = document.getElementById("POAInput");
  Nano.Inputs.PercentOA.value = 100;
  Nano.Inputs.PercentOA.addEventListener("change", Nano.computeSystem); 
  
  // not really inputs but they are calculated values from inputs
  Nano.Inputs.Ach =
  { 
    initialValue: 0, 
    convert: 2, 
    func: CONTAM.Units.TimeConstantConvert, 
    strings: CONTAM.Units.Strings.TimeConstant,
    input: document.getElementById("AchCalc"),
    select: document.getElementById("AchCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.Ach);  
  
  Nano.Inputs.Qoa =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("QoaCalc"),
    select: document.getElementById("SupplyRateCombo"),
    unitDisplay: document.getElementById("QoaCalcUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.Qoa);

  Nano.Inputs.Qrec =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("QrecCalc"),
    select: document.getElementById("SupplyRateCombo"),
    unitDisplay: document.getElementById("QrecCalcUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.Qrec);

  Nano.Inputs.Qexh =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("QexhCalc"),
    select: document.getElementById("SupplyRateCombo"),
    unitDisplay: document.getElementById("QexhCalcUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.Qexh);

  Nano.Inputs.Qim =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("QimbalCalc"),
    select: document.getElementById("SupplyRateCombo"),
    unitDisplay: document.getElementById("QimbalCalcUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.Qim);

  Nano.Inputs.ZBal = document.getElementById("ZoneBalance");
  
  Nano.Inputs.OAFilter = document.getElementById("OAFilterSelect");
  
  Nano.Inputs.RecirFilter = document.getElementById("RecircFilterSelect");
  
  Nano.Inputs.PDiam =
  { 
    initialValue: Nano.Species.mdiam, 
    convert: 6, 
    func: CONTAM.Units.LengthConvert, 
    strings: CONTAM.Units.Strings.Length,
    input: document.getElementById("ParticleDiameterInput"),
    select: document.getElementById("ParticleDiameterCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.PDiam);
  Nano.Inputs.PDiam.input.addEventListener("change", Nano.UpdateMdiam); 
  
  Nano.Inputs.PDensity =
  { 
    initialValue: Nano.Species.edens, 
    convert: 2, 
    func: CONTAM.Units.DensityConvert, 
    strings: CONTAM.Units.Strings.Density,
    input: document.getElementById("ParticleDensityInput"),
    select: document.getElementById("ParticleDensityCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.PDensity);
  Nano.Inputs.PDensity.input.addEventListener("change", Nano.UpdateEdens); 
  
  Nano.Inputs.constSourceType = document.getElementById("constSrcCheck");
  Nano.Inputs.constSourceType.checked = true;
  Nano.Inputs.constSourceType.addEventListener("click", Nano.changeSrcType);
  
  Nano.Inputs.burstSourceType = document.getElementById("burstSrcCheck");
  Nano.Inputs.burstSourceType.addEventListener("click", Nano.changeSrcType);

  Nano.Inputs.singleBurst = document.getElementById("singleBurstRadio");
  Nano.Inputs.singleBurst.addEventListener("click", Nano.changeBurstType);

  Nano.Inputs.repeatBurst = document.getElementById("repeatBurstRadio");
  Nano.Inputs.repeatBurst.addEventListener("click", Nano.changeBurstType);
  
  Nano.Inputs.ReleaseAmount =
  { 
    initialValue: 0.0, // was 1.1762e-09 kg
    convert: 0, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("ReleaseAmountInput"),
    select: document.getElementById("ReleaseAmountCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.ReleaseAmount);

  Nano.Inputs.ReleaseRate =
  { 
    initialValue: 0.0, // was 1.65e-06 kg/s
    convert: 0, 
    func: CONTAM.Units.ConSSConvert2, 
    strings: CONTAM.Units.Strings.ConSS2,
    input: document.getElementById("ReleaseRateInput"),
    select: document.getElementById("ReleaseRateCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.ReleaseRate);
  
  Nano.Inputs.SourceStartTime = document.getElementById("StartSourceInput");
  Nano.Inputs.SourceStartTime.value = "08:00:00";
  Nano.Inputs.SourceEndTime = document.getElementById("EndSourceInput"); 
  Nano.Inputs.SourceEndTime.value = "17:00:00";
  Nano.Inputs.RepeatInterval = document.getElementById("RepeatSourceInput");
  Nano.Inputs.RepeatInterval.value = "2";
  
  Nano.Inputs.FloorDV =
  { 
    initialValue: 0.005, 
    convert: 0, 
    func: CONTAM.Units.SpeedConvert, 
    strings: CONTAM.Units.Strings.Speed,
    input: document.getElementById("DepositionVelocityFloorInput"),
    select: document.getElementById("DepositionVelocityFloorCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.FloorDV);
  
  Nano.Inputs.WallDV =
  { 
    initialValue: 0, 
    convert: 0, 
    func: CONTAM.Units.SpeedConvert, 
    strings: CONTAM.Units.Strings.Speed,
    input: document.getElementById("DepositionVelocityWallInput"),
    select: document.getElementById("DepositionVelocityFloorCombo"),
    unitDisplay: document.getElementById("DepositionVelocityWallUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.WallDV);
  
  Nano.Inputs.CeilingDV =
  { 
    initialValue: 0, 
    convert: 0, 
    func: CONTAM.Units.SpeedConvert, 
    strings: CONTAM.Units.Strings.Speed,
    input: document.getElementById("DepositionVelocityCeilingInput"),
    select: document.getElementById("DepositionVelocityFloorCombo"),
    unitDisplay: document.getElementById("DepositionVelocityCeilingUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.CeilingDV);

  Nano.Inputs.OutdoorConcen =
  { 
    initialValue: 0, 
    convert: 21, 
    func: CONTAM.Units.Concen_P_Convert, 
    strings: CONTAM.Units.Strings.Concentration_P,
    input: document.getElementById("InitialConcentrationOutdoorInput"),
    select: document.getElementById("InitialConcentrationOutdoorCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.OutdoorConcen);

  Nano.Inputs.InitZoneConcen =
  { 
    initialValue: 0, 
    convert: 21, 
    func: CONTAM.Units.Concen_P_Convert, 
    strings: CONTAM.Units.Strings.Concentration_P,
    input: document.getElementById("InitialConcentrationInput"),
    select: document.getElementById("InitialConcentrationOutdoorCombo"),
    unitDisplay: document.getElementById("InitialConcentrationUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.InitZoneConcen);

  Nano.Inputs.ExposStartTime = document.getElementById("StartExposureInput");
  Nano.Inputs.ExposStartTime.value = "08:00:00";
  Nano.Inputs.ExposEndTime = document.getElementById("EndExposureInput");
  Nano.Inputs.ExposEndTime.value = "17:00:00";
  
  Nano.computeSystem();

  //results
  
  // these display the units for integrated concentration 
  var resultUnits = ["kg s/kg", "kg s/m&sup3;", "lb s/lb", "lb s/ft&sup3;", "g s/kg", 
  "g s/m&sup3;", "g s/lb", "g s/ft&sup3;", "mg s/kg", "mg s/m&sup3;", "mg s/lb", 
  "mg s/ft&sup3;", "&micro;g s/kg", "&micro;g s/m&sup3;", "&micro;g s/lb", 
  "&micro;g s/ft&sup3;", "ng s/kg", "ng s/m&sup3;", "ng s/lb", "ng s/ft&sup3;", 
  "# s/kg", "# s/m&sup3;", "# s/lb", "# s/ft&sup3;", "# s/L", "# s/cm&sup3;"];

  //integrated concentration result
  Nano.Results.IntegratedExposure =
  { 
    initialValue: 0, 
    convert: 21, 
    func: CONTAM.Units.Concen_P_Convert, 
    strings: resultUnits,
    input: document.getElementById("IntegratedExposureInput"),
    select: document.getElementById("IntegratedExposureCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.IntegratedExposure);
  Nano.Results.IntegratedExposure.select.addEventListener("input", Nano.DisplayExposureResults); 

  //surface loading  result
  Nano.Results.totalSurfaceLoading =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.ConcnSurfConvert, 
    strings: CONTAM.Units.Strings.Concentration_Surf,
    input: document.getElementById("totalLoadingResultInput"),
    select: document.getElementById("totalLoadingResultCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.totalSurfaceLoading);
  Nano.Results.totalSurfaceLoading.select.addEventListener("input", Nano.DisplayExposureResults); 
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

// compute the system values and display them in the UI
Nano.computeSystem = function()
{
  // convert the percent OA to the fraction of OA
  var fOA = parseFloat(Nano.Inputs.PercentOA.value) / 100;
  // supply rate in kg/s
  var supplyRate = Nano.Inputs.SupplyRate.input.baseValue;
  // return rate in kg/s
  var returnRate = Nano.Inputs.ReturnRate.input.baseValue;
  // volume in m^3
  var volume = Nano.Inputs.Volume.input.baseValue;
  // for now assume QoaMin is 0
  var QoaMin = 0;
  
  var QoaPrim = Math.max(fOA*supplyRate, Math.min(supplyRate, QoaMin));
  var Qrec = Math.min(returnRate, supplyRate - QoaPrim);
  var Qoa = supplyRate - Qrec;
  var Qexh = returnRate - Qrec;
  var Qim = supplyRate - returnRate;
  var balance = "";
  if(Qim > 0)
  {
    balance = "Pressurized";
  }
  else if(Qim < 0)
  {
    balance = "Depressurized";
  }
  else
  {
    balance = "Balanced";
  }
  var ach = (Qoa-(Math.min(0,Qim))) / (CONTAM.Units.rho20 * volume);
  
  //use sprintf to avoid long numbers and parse back to a number
  Nano.Inputs.Ach.input.baseValue = parseFloat(sprintf("%4.5g", ach));
  // this will make the inputs display the new baseValues in the proper units
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.Ach.select);  
  
  Nano.Inputs.Qoa.input.baseValue = parseFloat(sprintf("%4.5g", Qoa));
  Nano.Inputs.Qrec.input.baseValue = parseFloat(sprintf("%4.5g", Qrec));
  Nano.Inputs.Qexh.input.baseValue = parseFloat(sprintf("%4.5g", Qexh));
  Nano.Inputs.Qim.input.baseValue = parseFloat(sprintf("%4.5g", Qim));
  // this will make the inputs display the new baseValues in the proper units
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.Qoa.select);
  
  Nano.Inputs.ZBal.value = balance;
}

Nano.onWorkerMessage = function(oEvent)
{
  var data = oEvent.data;
  console.log("Nano.onWorkerMessage");
}

Nano.GetPrj = function()
{
  console.log("FaTIMA GetPrj (start)");
  return promise = new Promise(function(resolve, reject) 
  {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', "fatima.prj");
	req.overrideMimeType("text/plain");
    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        Nano.CtmPrj = req.responseText;
        console.log("FaTIMA GetPrj Resolve (end)");
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        console.log("FaTIMA GetPrj Reject (end)");
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

// get the release rate/amount inputs and set them in the project
// then call the second function to set the rest of the inputs
Nano.GetInputs = function()
{
  var releaseRate;
  var releaseAmount;

  function errorHandler(error)
  {
    throw new Error(error.message);
  }
  console.log("GetInputs");

  //check if using the constant source
  // otherwise us the burst source
  if(Nano.Inputs.constSourceType.checked)
  {
    releaseRate = parseFloat(Nano.Inputs.ReleaseRate.input.baseValue);
    if(isNaN(releaseRate))
    {
      alert("The release rate is not a number.");
      return;
    }
    if(Nano.Inputs.burstSourceType.checked)
    {
      releaseAmount = parseFloat(Nano.Inputs.ReleaseAmount.input.baseValue);
      if(isNaN(releaseAmount))
      {
        alert("The release amount is not a number.");
        return;
      }
      //set the constant source to generation schedule
      CWD.SetContamVariableToVariable("CONTAM.Project.CssList[2].ps", "CONTAM.Project.Wsch0.GetByNumber(3)")
      //set constant source release rate
      .then((result) => CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(5).ped.G", releaseRate))
      //set the burst source to generation schedule
      .then((result) => CWD.SetContamVariableToVariable("CONTAM.Project.CssList[1].ps", "CONTAM.Project.Wsch0.GetByNumber(3)"))
      //set burst source release amount
      .then((result) => CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(1).ped.M", releaseAmount))
      .then((result) => Nano.GetInputs2())
      .catch(errorHandler);
    }
    else
    {
      //set the constant source to generation schedule
      CWD.SetContamVariableToVariable("CONTAM.Project.CssList[2].ps", "CONTAM.Project.Wsch0.GetByNumber(3)")
      //set constant source release rate
      .then((result) => CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(5).ped.G", releaseRate))
      //set the burst source to Off schedule 
      .then((result) => CWD.SetContamVariableToVariable("CONTAM.Project.CssList[1].ps", "CONTAM.Project.Wsch0.GetByNumber(4)"))
      //set burst source release amount to zero
      .then((result) => CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(1).ped.M", 0))
      .then((result) => Nano.GetInputs2())
      .catch(errorHandler);

    }
  }
  else
  {
    if(Nano.Inputs.burstSourceType.checked)
    {
      releaseAmount = parseFloat(Nano.Inputs.ReleaseAmount.input.baseValue);
      if(isNaN(releaseAmount))
      {
        alert("The release amount is not a number.");
        return;
      }
      //set the const source to Off schedule 
      CWD.SetContamVariableToVariable("CONTAM.Project.CssList[2].ps", "CONTAM.Project.Wsch0.GetByNumber(4)")
      //set constant source release rate to zero
      .then((result) => CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(5).ped.G", 0))
      //set the burst source to generation schedule
      .then((result) => CWD.SetContamVariableToVariable("CONTAM.Project.CssList[1].ps", "CONTAM.Project.Wsch0.GetByNumber(3)"))
      //set burst source release amount
      .then((result) => CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(1).ped.M", releaseAmount))
      .then((result) => Nano.GetInputs2())
      .catch(errorHandler);
    }
    else
    {
      //set the const source to Off schedule 
      CWD.SetContamVariableToVariable("CONTAM.Project.CssList[2].ps", "CONTAM.Project.Wsch0.GetByNumber(4)")
      //set constant source release rate to zero
      .then((result) => CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(5).ped.G", 0))
      //set the burst source to Off schedule 
      .then((result) => CWD.SetContamVariableToVariable("CONTAM.Project.CssList[1].ps", "CONTAM.Project.Wsch0.GetByNumber(4)"))
      //set burst source release amount to zero
      .then((result) => CWD.SetContamVariable("CONTAM.Project.Cse0.GetByNumber(1).ped.M", 0))
      .then((result) => Nano.GetInputs2())
      .catch(errorHandler);

    }
  }
  
}

Nano.GetInputs2 = function()
{
  console.log("GetInputs2");
  // get inputs into local variables and make sure that they are valid numbers
  var buildingVolume = parseFloat(Nano.Inputs.Volume.input.baseValue);//
  if(isNaN(buildingVolume))
  {
    alert("The building volume is not a number.");
    return;
  }
  var surfaceAreaFloor = parseFloat(Nano.Inputs.FloorArea.input.baseValue);//
  if(isNaN(surfaceAreaFloor))
  {
    alert("The floor area is not a number.");
    return;
  }
  var surfaceAreaWall = parseFloat(Nano.Inputs.WallArea.input.baseValue);//
  if(isNaN(surfaceAreaWall))
  {
    alert("The wall area is not a number.");
    return;
  }
  var surfaceAreaCeiling = parseFloat(Nano.Inputs.CeilingArea.input.baseValue);//
  if(isNaN(surfaceAreaCeiling))
  {
    alert("The floor area is not a number.");
    return;
  }
  var pFactor = parseFloat(Nano.Inputs.PFactor.value);//
  if(isNaN(pFactor))
  {
    alert("The penetration factor is not a number.");
    return;
  }
  // the filter efficiency = 1 - pFactor
  var filterEff = 1 - pFactor;
  var supplyRate = parseFloat(Nano.Inputs.SupplyRate.input.baseValue);//
  if(isNaN(supplyRate))
  {
    alert("The supply rate is not a number.");
    return;
  }
  var returnRate = parseFloat(Nano.Inputs.ReturnRate.input.baseValue);//
  if(isNaN(returnRate))
  {
    alert("The return rate is not a number.");
    return;
  }
  var percentOA = parseFloat(Nano.Inputs.PercentOA.value);//
  if(isNaN(percentOA))
  {
    alert("The percent outdoor air is not a number.");
    return;
  }

  var OAScheduleValue = percentOA / 100;
  var OAFilterIndex = Nano.Inputs.OAFilter.selectedIndex;
  var recircFilterIndex = Nano.Inputs.RecirFilter.selectedIndex;
  var filterElementNames = ["zero", "MERV-04","MERV-05", "MERV-06",
    "MERV-07", "MERV-08", "MERV-09", "MERV-10", "MERV-11",
    "MERV-12", "MERV-13", "MERV-14", "MERV-15", "MERV-16"];

  var particlesize = parseFloat(Nano.Inputs.PDiam.input.baseValue);//
  if(isNaN(particlesize))
  {
    alert("The particle size is not a number.");
    return;
  }

  var particledensity = parseFloat(Nano.Inputs.PDensity.input.baseValue);//
  if(isNaN(particledensity))
  {
    alert("The particle density is not a number.");
    return;
  }

  var StartSource = Nano.Inputs.SourceStartTime.value;
  var EndSource = Nano.Inputs.SourceEndTime.value;
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
  var RepeatInterval = Math.floor(Nano.Inputs.RepeatInterval.value);
  if(RepeatInterval < 2)
  {
    alert("The Burst Repeat Interval must be at least 2 minutes.");
    return;
  }
  
  var depositionVelocityFloor = parseFloat(Nano.Inputs.FloorDV.input.baseValue);//
  if(isNaN(depositionVelocityFloor))
  {
    alert("The floor deposition velocity is not a number.");
    return;
  }
  
  var depositionVelocityWall = parseFloat(Nano.Inputs.WallDV.input.baseValue);//
  if(isNaN(depositionVelocityWall))
  {
    alert("The wall deposition velocity is not a number.");
    return;
  }
  
  var depositionVelocityCeiling = parseFloat(Nano.Inputs.CeilingDV.input.baseValue);//
  if(isNaN(depositionVelocityCeiling))
  {
    alert("The ceiling deposition velocity is not a number.");
    return;
  }
 
  var outdoorConcen = parseFloat(Nano.Inputs.OutdoorConcen.input.baseValue);//
  if(isNaN(outdoorConcen))
  {
    alert("The outdoor concentration is not a number.");
    return;
  }
  var zoneConcen = parseFloat(Nano.Inputs.InitZoneConcen.input.baseValue);//
  if(isNaN(zoneConcen))
  {
    alert("The initial zone concentration is not a number.");
    return;
  }

  var StartExposure = Nano.Inputs.ExposStartTime.value;//
  var EndExposure = Nano.Inputs.ExposEndTime.value;//
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

  // create an array of variables to set in the project
  // so that they can be sent to the CONTAM worker
  var variableList = [];
  variableList.push({variableName: "CONTAM.Project.ZoneList[1].Vol", variableValue: buildingVolume});
  variableList.push({variableName: "CONTAM.Project.ZoneList[1].CC0[0]", variableValue: zoneConcen});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).mdiam", variableValue: particlesize});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).edens", variableValue: particledensity});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).ccdef", variableValue: outdoorConcen});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.dV", variableValue: depositionVelocityCeiling});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(3).ped.dV", variableValue: depositionVelocityWall});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.dV", variableValue: depositionVelocityFloor});
  variableList.push({variableName: "CONTAM.Project.PathList[2].Fahs", variableValue: supplyRate});
  variableList.push({variableName: "CONTAM.Project.PathList[3].Fahs", variableValue: returnRate});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.dA", variableValue: surfaceAreaCeiling});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(3).ped.dA", variableValue: surfaceAreaWall});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.dA", variableValue: surfaceAreaFloor});
  variableList.push({variableName: "CONTAM.Project.PathList[1].pf.pe.ped.eff[0]", variableValue: filterEff});
  variableList.push({variableName: "CONTAM.Project.Dsch0.GetByNumber(7).ctrl[0]", variableValue: OAScheduleValue});
  variableList.push({variableName: "CONTAM.Project.Dsch0.GetByNumber(7).ctrl[1]", variableValue: OAScheduleValue});

  function errorHandler(error)
  {
    throw new Error(error.message);
  }
  // set the filter element for the OA path
  CWD.CallContamFunction("CONTAM.setPathFilterElement", [5, filterElementNames[OAFilterIndex]])
  // set the filter element for the recirculation path
  .then((result) => CWD.CallContamFunction("CONTAM.setPathFilterElement", [4, filterElementNames[recircFilterIndex]]))
  // set the occupant day schedule to use the start/end time that the use specified
  .then((result) => CWD.CallContamFunction("CONTAM.SetOccDaySchedule", [Nano.StartExposureTime, Nano.EndExposureTime]))
  // set the day schedule for the source to use the start/end time that the use specified
  .then((result) => CWD.CallContamFunction("CONTAM.SetDaySchedule", [StartSourceTime, EndSourceTime, Nano.Inputs.repeatBurst.checked, RepeatInterval * 60, 60]))
  // send the array of variables to change to the CONTAM worker
  .then((result) => CWD.SetArrayOfContamVariables(variableList))
  .then((result) => Nano.RunSim())
  .catch(errorHandler);
}

Nano.RunSim = function()
{
  var projectText;
  
  console.log("RunSim");
  //Save Project which will produce the text of the project file
  CWD.CallContamFunction("CONTAM.Project.prjsave", []).then(
    function(result)
    {
      projectText = result.projectText;
      // create the link for the user to save the project file
      Nano.createPRJSaveLink(projectText);
      //start simulation
      // let the user know the simulation is starting
      Nano.simStatusSpan.textContent = "Running Simulation...";
      
      // create the ContamX worker
      var myWorker = new Worker("../contam-x/contamx_worker.js");
      //setup a function to receive messages from ContamX
      myWorker.onmessage = Nano.onCXWorkerMessage;

      // create the data object to send to the ContamX worker
      // which includes the project name and project file contents
      var data = {};
      data.cmd = "start";
      data.PrjName = "fatima-dvr-gen.prj";
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

      // pass message to ContamX worker to start simulation
      myWorker.postMessage(data);
    },
    function(error)
    {
      throw new Error(error.message);
    }  
  );  
}

Nano.createPRJSaveLink = function(prjText)
{
  while (Nano.downloadLinksSpan.firstChild) {
      Nano.downloadLinksSpan.removeChild(Nano.downloadLinksSpan.firstChild);
  }

  var saveSpan = document.createElement("span");
  var savelink = document.createElement("a");
  var filename = "fatima.prj"
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
  savelink.className = "blacklink";
  saveSpan.appendChild(savelink);
  Nano.downloadLinksSpan.appendChild(saveSpan);
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

  if(Nano.integralResult == null || Nano.integralResult == undefined)
  {
    console.log('no results found by DisplayExposureResults function');
    return;
  }
  
  // load the inputs with unit selects
  // concentration
  Nano.Results.IntegratedExposure.input.baseValue = Nano.integralResult;
  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.IntegratedExposure.select);
  // surface loading
  Nano.Results.totalSurfaceLoading.input.baseValue = Nano.Results.surfaceTotalLoading;
  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.totalSurfaceLoading.select);
  
  // load the other concentration result display boxes

  //average exposure over the user's exposure period (in kg/kg)
  var averageExposureUserBase = (Nano.integralResult / Nano.ExposureDuration);
  //average exposure over the user's exposure period (in user picked units)
  Nano.AverageExposureUserUnits = CONTAM.Units.Concen_P_Convert(
    averageExposureUserBase, Nano.Results.IntegratedExposure.select.selectedIndex, 0, Nano.Species);
  // set the resultant average exposure
  document.getElementById("resultantexposure2").value = 
    parseFloat(sprintf("%4.5g", Nano.AverageExposureUserUnits));
  // set the resultant average exposure units
  document.getElementById("resultantexposure2units").innerHTML = 
    CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex];
  
  // set the display of the period of the average
  document.getElementById("averageExposureDiv").textContent = 
    "Average (" + (Nano.ExposureDuration / 3600).toString() + " h)";
  //average exposure over 24 period (in kg/kg)
  var averageExposure24Base = Nano.averageConcen;
  //average exposure over 24 period (in user picked units)
  Nano.AverageExposure24Units = CONTAM.Units.Concen_P_Convert(
    averageExposure24Base, Nano.Results.IntegratedExposure.select.selectedIndex, 0, Nano.Species);
  // set the resultant 24h average exposure
  document.getElementById("resultantexposure3").value = 
    parseFloat(sprintf("%4.5g", Nano.AverageExposure24Units));
  // set the resultant 24h average exposure units
  document.getElementById("resultantexposure3units").innerHTML = 
    CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex];
  
  //max concentration (in user picked units)
  var maxConcenUnits = CONTAM.Units.Concen_P_Convert(
    Nano.maxConcen, Nano.Results.IntegratedExposure.select.selectedIndex, 0, Nano.Species);
  document.getElementById("maximumConc").value = 
    parseFloat(sprintf("%4.5g", maxConcenUnits));
  document.getElementById("maximumConcunits").innerHTML = 
    CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex];
    
  //load the other surface loading result boxes
  
  //floor loading (in user picked units)
  var floorLoadingUserUnits = CONTAM.Units.ConcnSurfConvert(
    Nano.Results.floorLoading, Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
  document.getElementById("floorLoadingResult").value = 
    parseFloat(sprintf("%4.5g", floorLoadingUserUnits));
  document.getElementById("floorLoadingResultUnits").innerHTML = 
    CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex];

  //wall loading (in user picked units)
  var wallLoadingUserUnits = CONTAM.Units.ConcnSurfConvert(
    Nano.Results.wallLoading, Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
  document.getElementById("wallLoadingResult").value = 
    parseFloat(sprintf("%4.5g", wallLoadingUserUnits));
  document.getElementById("wallLoadingResultUnits").innerHTML = 
    CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex];

  //ceiling loading (in user picked units)
  var ceilingLoadingUserUnits = CONTAM.Units.ConcnSurfConvert(
    Nano.Results.ceilingLoading, Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
  document.getElementById("ceilingLoadingResult").value = 
    parseFloat(sprintf("%4.5g", ceilingLoadingUserUnits));
  document.getElementById("ceilingLoadingResultUnits").innerHTML = 
    CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex];

  //plot results
  Nano.concenDataUserUnits = [];
  Nano.exposureDataUserUnits = [];
  Nano.surfaceDataUserUnits = [];
  for(var i=0; i<Nano.concenDataLogUnits.length; ++i)
  {
    // create a concentration record for plotting
    var concenRecord = [];
    // add the time 
    concenRecord.push(Nano.concenDataLogUnits[i][0]);
    var basevalue = Nano.concenDataLogUnits[i][1];
    var uservalue = CONTAM.Units.Concen_P_Convert(
      basevalue, Nano.Results.IntegratedExposure.select.selectedIndex, 0, Nano.Species);
    // add the concentration
    concenRecord.push(uservalue);
    // add the average
    concenRecord.push(Nano.AverageExposure24Units);
    // add the record to the array of records
    Nano.concenDataUserUnits.push(concenRecord);

    // create an exposure record for plotting
    var exposureRecord = [];
    // add the time
    var chart_time = Nano.exposureDataLogUnits[i][0];
    var seconds = Nano.ConvertChartTime(chart_time);
    exposureRecord.push(chart_time);
    // add the concen
    var basevalue = Nano.exposureDataLogUnits[i][1];
    var uservalue = CONTAM.Units.Concen_P_Convert(
      basevalue, Nano.Results.IntegratedExposure.select.selectedIndex, 0, Nano.Species);
    exposureRecord.push(uservalue);
    // add the average only inside of the exposure period
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
    // add the record to the array of records
    Nano.exposureDataUserUnits.push(exposureRecord);

    // create a record of surface data for plotting
    var surfaceRecord = [];
    // add time value
    surfaceRecord.push(Nano.surfaceDataBaseUnits[i][0]);

    // add total value
    surfaceRecord.push(CONTAM.Units.ConcnSurfConvert(
    Nano.surfaceDataBaseUnits[i][1], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species));
    
    // add floor value
    surfaceRecord.push(CONTAM.Units.ConcnSurfConvert(
    Nano.surfaceDataBaseUnits[i][2], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species));
        
    // add wall value
    surfaceRecord.push(CONTAM.Units.ConcnSurfConvert(
    Nano.surfaceDataBaseUnits[i][3], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species));
    
    // add ceiling value
    surfaceRecord.push(CONTAM.Units.ConcnSurfConvert(
    Nano.surfaceDataBaseUnits[i][4], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species));
    // add the record to the array of records
    Nano.surfaceDataUserUnits.push(surfaceRecord);
  }

  // put exposure results in the UI
  document.getElementById("maxExposureDiv").textContent = 
    "Maximum (" + (Nano.ExposureDuration / 3600).toString() + " h)";
  document.getElementById("maximumConcExpos").value = 
    parseFloat(sprintf("%4.5g", maxExpos));
  // use innerHTML to get entities converted to characters
  document.getElementById("maximumConcExposunits").innerHTML = 
    CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex];

  // call function to draw the google charts
  Nano.drawChart();
}

// this function receive messages from the ConatmX worker
Nano.onCXWorkerMessage = function(oEvent)
{
  var data = oEvent.data;
  if(data.cmd == "console")
  {
    //do nothing
    //CONTAMX.console(data.text);
    //console.log(data.text);
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
            Nano.surfaceDataBaseUnits = result.records;
            Nano.Results.surfaceTotalLoading = result.records[result.records.length - 1][1];
            Nano.Results.floorLoading = result.records[result.records.length - 1][2];
            Nano.Results.wallLoading = result.records[result.records.length - 1][3];
            Nano.Results.ceilingLoading = result.records[result.records.length - 1][4];
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
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex]));
  air_data_table.addColumn('number', 'Average Concentration ' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex]));
  if(air_data)
    air_data_table.addRows(air_data);

  var surf_data_table = new google.visualization.DataTable();
  surf_data_table.addColumn('timeofday', 'Time of Day');
  surf_data_table.addColumn('number', 'Total ' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex]));
  surf_data_table.addColumn('number', 'Floor ' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex]));
  surf_data_table.addColumn('number', 'Wall ' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex]));
  surf_data_table.addColumn('number', 'Ceiling ' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex]));
  if(surf_data)
    surf_data_table.addRows(surf_data);

  var expos_data_table = new google.visualization.DataTable();
  expos_data_table.addColumn('timeofday', 'Time of Day');
  expos_data_table.addColumn('number', 'Exposure ' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex]));
  expos_data_table.addColumn('number', 'Average Exposure ' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex]));
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
    series: {
      1: { lineDashStyle: [1, 2] },
      2: { lineDashStyle: [2, 2] },
      3: { lineDashStyle: [3, 2] }
    },
    legend: { position: 'bottom' }
  };

  var expos_options = {
    backgroundColor: '#F4F5F9',
    chartArea: {'width': '80%', 'height': '80%'},
    title: 'Occupant Exposure',
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

Nano.changeSrcType = function()
{
  var constSrcCheck = document.getElementById("constSrcCheck");
  var burstSrcCheck = document.getElementById("burstSrcCheck");
  
  if(constSrcCheck.checked)
  {
    document.getElementById('ReleaseRateInput').disabled = false;
    document.getElementById('ReleaseRateCombo').disabled = false;
  }
  else
  {
    document.getElementById('ReleaseRateInput').disabled = true;
    document.getElementById('ReleaseRateCombo').disabled = true;
  }
  if (burstSrcCheck.checked)
  {
    document.getElementById('ReleaseAmountInput').disabled = false;
    document.getElementById('ReleaseAmountCombo').disabled = false;
  }
  else
  {
    document.getElementById('ReleaseAmountInput').disabled = true;
    document.getElementById('ReleaseAmountCombo').disabled = true;
  }
}

Nano.changeBurstType = function()
{
  var singleBurstRadio = document.getElementById("singleBurstRadio");
  var repeatBurstRadio = document.getElementById("repeatBurstRadio");
  
  if(singleBurstRadio.checked)
  {
    document.getElementById('RepeatSourceInput').disabled = true;
  }
  else
  {
    document.getElementById('RepeatSourceInput').disabled = false;
  }
}