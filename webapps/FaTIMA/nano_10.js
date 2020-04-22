// requires units_*.js

var Nano = {};

Nano.Species = {};
Nano.Species.edens = 1000;
Nano.Species.mdiam = 1e-006;
Nano.Species.decay = 0;
Nano.Species.molwt = 0;


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
      var workerFileURLs = ["../FaTIMA/SrfFileReader_1.js",
        "../FaTIMA/CtrlLogFileReader_3.js",
        "../FaTIMA/contamAddons_4.js",
        "../FaTIMA/CsmFileReader_1.js"];
      CWD.Init(new Worker("../contam/contam_worker_5.js"));
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
    initialValue: 100, 
    convert: 0, 
    func: CONTAM.Units.VolumeConvert, 
    strings: CONTAM.Units.Strings.Volume,
    input: document.getElementById("BuildingVolumeInput"),
    select: document.getElementById("BuildingVolumeCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.Volume);
  Nano.Inputs.Volume.input.addEventListener("change", Nano.computeSystem); 
  Nano.Inputs.Volume.input.addEventListener("change", Nano.computeLevelHeight); 
  
  Nano.Inputs.FloorArea = 
  { 
    initialValue: 40, 
    convert: 0, 
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaFloorInput"),
    select: document.getElementById("SurfaceAreaFloorCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.FloorArea);
  Nano.Inputs.FloorArea.input.addEventListener("change", Nano.computeLevelHeight); 
  
  Nano.Inputs.LevelHeight = 
  { 
    initialValue: 20, 
    convert: 0, 
    func: CONTAM.Units.LengthConvert, 
    strings: CONTAM.Units.Strings.Length,
    input: document.getElementById("LevelHeightInput"),
    select: document.getElementById("LevelHeightCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.LevelHeight);
  Nano.computeLevelHeight();

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

  Nano.Inputs.OtherSurfaceArea =
  { 
    initialValue: 0, 
    convert: 0, 
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaOtherInput"),
    select: document.getElementById("SurfaceAreaFloorCombo"),
    unitDisplay: document.getElementById("SurfaceAreaOtherUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.OtherSurfaceArea);
  
  Nano.Inputs.PFactor = document.getElementById("PenetrationFactorInput");
  Nano.Inputs.PFactor.value = 1;
  
  Nano.Inputs.Infiltration = document.getElementById("InfiltrationInput");
  Nano.Inputs.Infiltration.value = 0.5;
  Nano.Inputs.Infiltration.addEventListener("change", Nano.computeSystem); 
  
  // SupplyRate = 0.24417 kg/s = 730.001 m3/h * 1.2041 kg/m3 / 3600 s/h
  Nano.Inputs.SupplyRate =
  { 
    initialValue: 0.24417,
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
    initialValue: 0.24417,
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
  Nano.Inputs.PercentOA.value = 0;
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
  
  Nano.Inputs.PName = document.getElementById("ParticleNameInput");
  Nano.Inputs.PName.value = "IV1";
  
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
  
  Nano.Inputs.PDecays =  document.getElementById("particleDecayCheck");
  Nano.Inputs.PDecays.addEventListener("click", Nano.changeDecayEnabled);  
  
  Nano.Inputs.PHalfLife =
  { 
    initialValue: 3960, 
    convert: 2, 
    func: CONTAM.Units.TimeConvert, 
    strings: CONTAM.Units.Strings.Time,
    input: document.getElementById("ParticleHalflifeInput"),
    select: document.getElementById("ParticleHalflifeCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.PHalfLife);
  Nano.Inputs.PHalfLife.input.addEventListener("change", Nano.UpdateDecay); 
  
  Nano.Inputs.PDecayRate =
  { 
    initialValue: -0.000175, 
    convert: 2, 
    func: CONTAM.Units.TimeConstantConvert, 
    strings: CONTAM.Units.Strings.TimeConstant,
    input: document.getElementById("ParticleDecayRateInput"),
    select: document.getElementById("ParticleDecayRateCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.PDecayRate);
  
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
    initialValue: 2.3562e-014, // 45 #
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("ReleaseAmountInput"),
    select: document.getElementById("ReleaseAmountCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.ReleaseAmount);

  Nano.Inputs.ReleaseRate =
  { 
    initialValue: 2.7925e-017, // 3.2 #/min
    convert: 19, 
    func: CONTAM.Units.ConSSConvert2, 
    strings: CONTAM.Units.Strings.ConSS2,
    input: document.getElementById("ReleaseRateInput"),
    select: document.getElementById("ReleaseRateCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.ReleaseRate);
  
  Nano.Inputs.SourceStartTime = document.getElementById("StartSourceInput");
  Nano.Inputs.SourceStartTime.value = "00:00:00";
  Nano.Inputs.SourceEndTime = document.getElementById("EndSourceInput"); 
  Nano.Inputs.SourceEndTime.value = "02:00:00";
  Nano.Inputs.RepeatInterval = document.getElementById("RepeatSourceInput");
  Nano.Inputs.RepeatInterval.value = "5";
  
  Nano.Inputs.FloorDV =
  { 
    initialValue: 6.944e-005, // m/s
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
  
  Nano.Inputs.OtherSurfaceDV =
  { 
    initialValue: 0, 
    convert: 0, 
    func: CONTAM.Units.SpeedConvert, 
    strings: CONTAM.Units.Strings.Speed,
    input: document.getElementById("DepositionVelocityOtherInput"),
    select: document.getElementById("DepositionVelocityFloorCombo"),
    unitDisplay: document.getElementById("DepositionVelocityOtherUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.OtherSurfaceDV);

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
  Nano.Inputs.ExposStartTime.value = "00:00:00";
  Nano.Inputs.ExposEndTime = document.getElementById("EndExposureInput");
  Nano.Inputs.ExposEndTime.value = "03:00:00";
  
  Nano.Inputs.AirCleanerFlowRate =
  { 
    initialValue: 0.113655, // 200 scfm
    convert: 1, 
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("AirCleanerFlowRateInput"),
    select: document.getElementById("AirCleanerFlowRateCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.AirCleanerFlowRate);
  Nano.Inputs.AirCleanerFlowRate.input.addEventListener("change", Nano.ComputeAirCleanerCADR); 

  Nano.Inputs.AirCleanerFlowFrac =  document.getElementById("AirCleanerFlowFractionInput");
  Nano.Inputs.AirCleanerFlowFrac.value =  0.0;
  Nano.Inputs.AirCleanerFlowFrac.addEventListener("change", Nano.ComputeAirCleanerCADR);  

  Nano.Inputs.AirCleanerEff =  document.getElementById("AirCleanerEffInput");
  Nano.Inputs.AirCleanerEff.value =  0.8;
  Nano.Inputs.AirCleanerEff.addEventListener("change", Nano.ComputeAirCleanerCADR);  
  
  Nano.Inputs.AirCleanerCADR =
  { 
    initialValue: 0, 
    convert: 1, 
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("AirCleanerCADRInput"),
    select: document.getElementById("AirCleanerFlowRateCombo"),
    unitDisplay: document.getElementById("AirCleanerCADRUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.AirCleanerCADR);
  Nano.ComputeAirCleanerCADR();
  
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

  Nano.Results.floorSurfaceLoading =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.ConcnSurfConvert, 
    strings: CONTAM.Units.Strings.Concentration_Surf,
    input: document.getElementById("floorLoadingResult"),
    select: document.getElementById("totalLoadingResultCombo"),
    unitDisplay: document.getElementById("floorLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.floorSurfaceLoading);

  Nano.Results.wallSurfaceLoading =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.ConcnSurfConvert, 
    strings: CONTAM.Units.Strings.Concentration_Surf,
    input: document.getElementById("wallLoadingResult"),
    select: document.getElementById("totalLoadingResultCombo"),
    unitDisplay: document.getElementById("wallLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.wallSurfaceLoading);

  Nano.Results.ceilingSurfaceLoading =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.ConcnSurfConvert, 
    strings: CONTAM.Units.Strings.Concentration_Surf,
    input: document.getElementById("ceilingLoadingResult"),
    select: document.getElementById("totalLoadingResultCombo"),
    unitDisplay: document.getElementById("ceilingLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.ceilingSurfaceLoading);

  Nano.Results.otherSurfaceLoading =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.ConcnSurfConvert, 
    strings: CONTAM.Units.Strings.Concentration_Surf,
    input: document.getElementById("otherLoadingResult"),
    select: document.getElementById("totalLoadingResultCombo"),
    unitDisplay: document.getElementById("otherLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.otherSurfaceLoading);

  // emmission results
  Nano.Results.totalEmmission =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("totalEmmissionResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.totalEmmission);

  Nano.Results.continuousEmmission =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("continuousEmmissionResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("continuousEmmissionResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.continuousEmmission);

  Nano.Results.burstEmmission =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("burstEmmissionResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("burstEmmissionResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.burstEmmission);
  
  // filter loading results
  Nano.Results.totalFilterLoading =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("totalFilterLoadingResult"),
    select: document.getElementById("totalFilterLoadingResultCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.totalFilterLoading);

  Nano.Results.oaFilterLoading =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("oaFilterLoadingResult"),
    select: document.getElementById("totalFilterLoadingResultCombo"),
    unitDisplay: document.getElementById("oaFilterLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.oaFilterLoading);

  Nano.Results.recFilterLoading =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("recFilterLoadingResult"),
    select: document.getElementById("totalFilterLoadingResultCombo"),
    unitDisplay: document.getElementById("recFilterLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.recFilterLoading);

  Nano.Results.acFilterLoading =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("acFilterLoadingResult"),
    select: document.getElementById("totalFilterLoadingResultCombo"),
    unitDisplay: document.getElementById("acFilterLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.acFilterLoading);

  // surface mass deposited
  Nano.Results.totalMassDeposited =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("totalMassDepResult"),
    select: document.getElementById("totalMassDepResultCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.totalMassDeposited);

  Nano.Results.floorMassDeposited =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("floorMassDepResult"),
    select: document.getElementById("totalMassDepResultCombo"),
    unitDisplay: document.getElementById("floorMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.floorMassDeposited);

  Nano.Results.wallMassDeposited =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("wallMassDepResult"),
    select: document.getElementById("totalMassDepResultCombo"),
    unitDisplay: document.getElementById("wallMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.wallMassDeposited);

  Nano.Results.ceilingMassDeposited =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("ceilingMassDepResult"),
    select: document.getElementById("totalMassDepResultCombo"),
    unitDisplay: document.getElementById("ceilingMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.ceilingMassDeposited);

  Nano.Results.otherMassDeposited =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("otherMassDepResult"),
    select: document.getElementById("totalMassDepResultCombo"),
    unitDisplay: document.getElementById("otherMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.otherMassDeposited);

}

Nano.ComputeAirCleanerCADR = function()
{
  Nano.Inputs.AirCleanerCADR.input.baseValue = Nano.Inputs.AirCleanerFlowRate.input.baseValue * Nano.Inputs.AirCleanerFlowFrac.valueAsNumber * Nano.Inputs.AirCleanerEff.valueAsNumber;
  // this will make the inputs display the new baseValues in the proper units
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.AirCleanerCADR.select);
}

Nano.changeDecayEnabled = function()
{
  Nano.Inputs.PHalfLife.input.disabled = !Nano.Inputs.PDecays.checked;
}

Nano.UpdateEdens = function()
{
  Nano.Species.edens = Nano.Inputs.PDensity.input.baseValue;
  // after changing the effective density 
  // reconvert the release rate from non-base units to base units
  Nano.ReconvertReleaseRate();
  // reconvert the release amount from non-base units to base units
  Nano.ReconvertReleaseAmount();
}

Nano.UpdateMdiam = function()
{
  Nano.Species.mdiam = Nano.Inputs.PDiam.input.baseValue;
  // after changing the mean diameter
  // reconvert the release rate from non-base units to base units
  Nano.ReconvertReleaseRate();
  // reconvert the release amount from non-base units to base units
  Nano.ReconvertReleaseAmount();
}

Nano.computeLevelHeight = function()
{
  Nano.Inputs.LevelHeight.input.baseValue = Nano.Inputs.Volume.input.baseValue / Nano.Inputs.FloorArea.input.baseValue;
  // this will make the inputs display the new baseValues in the proper units
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.LevelHeight.select);
   
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
  var Qsup = Nano.Inputs.SupplyRate.input.baseValue;
  // return rate in kg/s
  var Qret = Nano.Inputs.ReturnRate.input.baseValue;
  // volume in m^3
  var volume = Nano.Inputs.Volume.input.baseValue;
  // for now assume QoaMin is 0
  var QoaMin = 0;
  
  //convert from 1/h to 1/s
  var ACHinf = Nano.Inputs.Infiltration.valueAsNumber / 3600; // 1/s
  // convert from 1/s to kg/s
  var Qinf = volume * ACHinf * CONTAM.Units.rho20; // kg/s
  
  var QoaPrim = Math.max(fOA*Qsup, Math.min(Qsup, QoaMin));
  var Qrec = Math.min(Qret, Qsup - QoaPrim);
  var Qoa = Qsup - Qrec;
  var Qexh = Qret - Qrec;
  var Qim = Qsup + Qinf - Qret;
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
  
  console.log("Qsup: " + Qsup);
  console.log("Qret: " + Qret);
  console.log("volume: " + volume);
  console.log("QoaMin: " + QoaMin);
  console.log("Qinf: " + Qinf);
  console.log("QoaPrim: " + QoaPrim);
  console.log("Qrec: " + Qrec);
  console.log("Qoa: " + Qoa);
  console.log("Qexh: " + Qexh);
  console.log("Qim: " + Qim);
  console.log("ach: " + ach);
  
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
  var arrayOfParameters = [];
  var variableList = [];
  
  function errorHandler(error)
  {
    throw new Error(error.message);
  }
  console.log("GetInputs");
  
  if(!Nano.checkInputValidity())
    return;

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
    console.log("releaseRate: " + releaseRate + " kg/s");
    if(Nano.Inputs.burstSourceType.checked)
    {
      releaseAmount = parseFloat(Nano.Inputs.ReleaseAmount.input.baseValue);
      if(isNaN(releaseAmount))
      {
        alert("The release amount is not a number.");
        return;
      }
      console.log("releaseAmount: " + releaseAmount + " kg");
      //set the constant source to breathing schedule
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[2].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(2)"});
      //set constant source release rate
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(1).ped.G", variableValue: releaseRate});
      //set the burst source to coughing schedule
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[1].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(3)"});
      //set burst source release amount
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.M", variableValue: releaseAmount});
    }
    else
    {
      console.log("releaseAmount: not used");
      //set the constant source to breathing schedule
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[2].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(2)"});
      //set constant source release rate
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(1).ped.G", variableValue: releaseRate});
      //set the burst source to Off schedule 
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[1].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(5)"});
      //set burst source release amount to zero
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.M", variableValue: 0});
    }
  }
  else
  {
    console.log("releaseRate: not used");
    if(Nano.Inputs.burstSourceType.checked)
    {
      releaseAmount = parseFloat(Nano.Inputs.ReleaseAmount.input.baseValue);
      if(isNaN(releaseAmount))
      {
        alert("The release amount is not a number.");
        return;
      }
      console.log("releaseAmount: " + releaseAmount + " kg");
      //set the const source to Off schedule 
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[2].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(5)"});
      //set constant source release rate to zero
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(1).ped.G", variableValue: 0});
      //set the burst source to coughing schedule
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[1].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(3)"});
      //set burst source release amount
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.M", variableValue: releaseAmount});
    }
    else
    {
      console.log("releaseAmount: not used");
      //set the const source to Off schedule 
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[2].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(5)"});
      //set constant source release rate to zero
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(1).ped.G", variableValue: 0});
      //set the burst source to Off schedule 
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[1].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(5)"});
      //set burst source release amount to zero
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.M", variableValue: 0});

    }
  }
  
  //set the zone's kinetic reaction
  if(Nano.Inputs.PDecays.checked)
    // set it to the first kinetic reaction
    arrayOfParameters.push({setVariableName: "CONTAM.Project.ZoneList[1].pk", toVariableName: "CONTAM.Project.Kinr0.GetByNumber(1)"});
  else
    // set it to no kinetic reaction
    variableList.push({variableName: "CONTAM.Project.ZoneList[1].pk", variableValue: null});
  
  CWD.SetArrayOfContamVariableToVariable(arrayOfParameters)
  .then((result) => CWD.SetArrayOfContamVariables(variableList))
  .then((result) => Nano.GetInputs2())
  .catch(errorHandler);
  
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
  var surfaceAreaOther = parseFloat(Nano.Inputs.OtherSurfaceArea.input.baseValue);//
  if(isNaN(surfaceAreaOther))
  {
    alert("The other surface area is not a number.");
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


  var partName = Nano.Inputs.PName.value;
  if(partName.length == 0)
  {
    alert("There must be a particle name.");
    return;
  }

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

  var particleDecayRate = parseFloat(Nano.Inputs.PDecayRate.input.baseValue);//
  if(isNaN(particleDecayRate))
  {
    alert("The particle decay rate is not a number.");
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
  if(EndSourceTime < StartSourceTime)
  {
    alert("The end source time cannot be before the start time.");
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
  
  var depositionVelocityOtherSurface = parseFloat(Nano.Inputs.OtherSurfaceDV.input.baseValue);//
  if(isNaN(depositionVelocityOtherSurface))
  {
    alert("The other surface deposition velocity is not a number.");
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
  if(Nano.EndExposureTime < Nano.StartExposureTime)
  {
    alert("The end exposure time cannot be before the start time.");
    return;
  }
  Nano.ExposureDuration = Nano.EndExposureTime - Nano.StartExposureTime;
  
  //compute the leakage multiplier for envelope
  var envelopeLeakageMultiplier = 4 * buildingVolume / Math.sqrt(surfaceAreaFloor);
  
  // compute the volume flow for the infiltration fan - m^3/s
  var infiltrationVolFlow =  Nano.Inputs.Infiltration.valueAsNumber * buildingVolume / 3600;

  // create an array of variables to set in the project
  // so that they can be sent to the CONTAM worker
  var variableList = [];
  variableList.push({variableName: "CONTAM.Project.ZoneList[1].Vol", variableValue: buildingVolume});
  variableList.push({variableName: "CONTAM.Project.ZoneList[1].CC0[0]", variableValue: zoneConcen});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).name", variableValue: partName});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).mdiam", variableValue: particlesize});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).edens", variableValue: particledensity});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).ccdef", variableValue: outdoorConcen});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(3).ped.dV", variableValue: depositionVelocityCeiling});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.dV", variableValue: depositionVelocityFloor});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(5).ped.dV", variableValue: depositionVelocityOtherSurface});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(6).ped.dV", variableValue: depositionVelocityWall});
  variableList.push({variableName: "CONTAM.Project.PathList[1].Fahs", variableValue: supplyRate});
  variableList.push({variableName: "CONTAM.Project.PathList[2].Fahs", variableValue: returnRate});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(3).ped.dA", variableValue: surfaceAreaCeiling});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.dA", variableValue: surfaceAreaFloor});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(5).ped.dA", variableValue: surfaceAreaOther});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(6).ped.dA", variableValue: surfaceAreaWall});
  variableList.push({variableName: "CONTAM.Project.PathList[4].pf.pe.ped.eff[0]", variableValue: filterEff});
  variableList.push({variableName: "CONTAM.Project.Dsch0.GetByNumber(10).ctrl[0]", variableValue: OAScheduleValue});
  variableList.push({variableName: "CONTAM.Project.Dsch0.GetByNumber(10).ctrl[1]", variableValue: OAScheduleValue});
  variableList.push({variableName: "CONTAM.Project.Kinr0.GetByNumber(1).pkd.coef", variableValue: particleDecayRate});
  variableList.push({variableName: "CONTAM.Project.LevList[1].delht", variableValue: Nano.Inputs.LevelHeight.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.PathList[4].mult", variableValue: envelopeLeakageMultiplier});
  variableList.push({variableName: "CONTAM.Project.Dfe0.GetByNumber(1).ped.Flow", variableValue: Nano.Inputs.AirCleanerFlowRate.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Flte0.GetByNumber(1).ped.eff[0]", variableValue: Nano.Inputs.AirCleanerEff.valueAsNumber});
  variableList.push({variableName: "CONTAM.Project.Afe0.GetByNumber(1).ped.Flow", variableValue: infiltrationVolFlow});
  variableList.push({variableName: "CONTAM.Project.Dsch0.GetByNumber(1).ctrl[0]", variableValue: Nano.Inputs.AirCleanerFlowFrac.valueAsNumber});
  
  
  function errorHandler(error)
  {
    throw new Error(error.message);
  }
  // set the filter element for the OA path
  CWD.CallContamFunction("CONTAM.setPathFilterElement", [6, filterElementNames[OAFilterIndex]])
  // set the filter element for the recirculation path
  .then((result) => CWD.CallContamFunction("CONTAM.setPathFilterElement", [5, filterElementNames[recircFilterIndex]]))
  // set the occupant day schedule to use the start/end time that the use specified
  .then((result) => CWD.CallContamFunction("CONTAM.SetOccDaySchedule", [Nano.StartExposureTime, Nano.EndExposureTime]))
  // set the day schedule for the breathing source to use the start/end time that the user specified
  .then((result) => CWD.CallContamFunction("CONTAM.SetDaySchedule", [2, StartSourceTime, EndSourceTime, false, 0, 0, false]))
  // set the day schedule for the coughing source to use the start/end time that the user specified
  .then((result) => CWD.CallContamFunction("CONTAM.SetDaySchedule", [3, StartSourceTime, EndSourceTime, Nano.Inputs.repeatBurst.checked, RepeatInterval * 60, 60, true]))
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

Nano.putResultsInGUI = function()
{
  
  // calulate particle fate
  // get mass emitted
  var Memit = Nano.Results.csmResults.burstMassAdded + Nano.Results.csmResults.continuousMassAdded;
  var Mfilt = Nano.Results.csmResults.recFiltMassSto + Nano.Results.csmResults.oaFiltMassSto + 
    Nano.Results.csmResults.acFiltMassSto;
  var Mdep = Nano.Results.csmResults.floorMassStored + Nano.Results.csmResults.wallsMassStored + 
    Nano.Results.csmResults.ceilingMassStored + Nano.Results.csmResults.otherMassStored;
  var Mexf = Nano.Results.csmResults.ctm_exfil;
  var Mzone = Nano.Results.ctrlLogResult.finalConcen * CONTAM.Units.rho20 * Nano.Inputs.Volume.input.baseValue;
  
  var Mdeact = Memit - (Mfilt + Mdep + Mexf + Mzone);
  
  var percentFilt = Mfilt / Memit * 100;
  var percentExfil = Mexf / Memit * 100;
  var percentDeac = Mdeact / Memit * 100;
  var percentDep = Mdep / Memit * 100;
  var percentInZone = Mzone / Memit * 100;
  
  document.getElementById("percentFiltResult").value = sprintf("%3.2f", percentFilt);
  document.getElementById("percentExfilResult").value = sprintf("%3.2f", percentExfil);
  document.getElementById("percentDeacResult").value = sprintf("%3.2f", percentDeac);
  document.getElementById("percentDepResult").value = sprintf("%3.2f", percentDep);
  document.getElementById("percentZoneResult").value = sprintf("%3.2f", percentInZone);
  
  // surface loading
  // floor
  Nano.Results.floorSurfaceLoading.input.baseValue = Nano.Results.floorLoading;
  
  // wall
  Nano.Results.wallSurfaceLoading.input.baseValue = Nano.Results.wallLoading;
  
  // ceiling
  Nano.Results.ceilingSurfaceLoading.input.baseValue = Nano.Results.ceilingLoading;
  
  // other
  Nano.Results.otherSurfaceLoading.input.baseValue = Nano.Results.otherLoading;
  
  //total
  Nano.Results.totalSurfaceLoading.input.baseValue = Nano.Results.surfaceTotalLoading;
  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.totalSurfaceLoading.select);
    
  // emssion results
  // burst
  Nano.Results.burstEmmission.input.baseValue = Nano.Results.csmResults.burstMassAdded;

  // continuous
  Nano.Results.continuousEmmission.input.baseValue = Nano.Results.csmResults.continuousMassAdded;

  // total
  Nano.Results.totalEmmission.input.baseValue = Nano.Results.csmResults.burstMassAdded + Nano.Results.csmResults.continuousMassAdded;
  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.totalEmmission.select);
  
  //filter loading results
  // oa
  Nano.Results.oaFilterLoading.input.baseValue = Nano.Results.csmResults.oaFiltMassSto;
  
  // rec
  Nano.Results.recFilterLoading.input.baseValue = Nano.Results.csmResults.recFiltMassSto;
  
  // ac
  Nano.Results.acFilterLoading.input.baseValue = Nano.Results.csmResults.acFiltMassSto;
  
  //total
  Nano.Results.totalFilterLoading.input.baseValue = Nano.Results.csmResults.oaFiltMassSto + Nano.Results.csmResults.recFiltMassSto + Nano.Results.csmResults.acFiltMassSto;
  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.totalFilterLoading.select);
  
  //surface mass deposited
  // floor
  Nano.Results.floorMassDeposited.input.baseValue = Nano.Results.csmResults.floorMassStored;
  
  // wall
  Nano.Results.wallMassDeposited.input.baseValue = Nano.Results.csmResults.wallsMassStored;
  
  // ceiling
  Nano.Results.ceilingMassDeposited.input.baseValue = Nano.Results.csmResults.ceilingMassStored;
  
  // other
  Nano.Results.otherMassDeposited.input.baseValue = Nano.Results.csmResults.otherMassStored;
  
  //total
  Nano.Results.totalMassDeposited.input.baseValue = 
    Nano.Results.csmResults.floorMassStored + Nano.Results.csmResults.wallsMassStored + 
    Nano.Results.csmResults.ceilingMassStored + Nano.Results.csmResults.otherMassStored;
  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.totalMassDeposited.select);
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
    basevalue = Nano.exposureDataLogUnits[i][1];
    uservalue = CONTAM.Units.Concen_P_Convert(
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
    //integrated expos
    basevalue = Nano.exposureDataLogUnits[i][2];
    uservalue = CONTAM.Units.Concen_P_Convert(
      basevalue, Nano.Results.IntegratedExposure.select.selectedIndex, 0, Nano.Species);
    exposureRecord.push(uservalue);
    
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
    
    // add other value
    surfaceRecord.push(CONTAM.Units.ConcnSurfConvert(
    Nano.surfaceDataBaseUnits[i][5], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species));
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
    var logFileIndex, srfFileIndex, csmFileIndex;
    
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
      if(ext == ".csm")
      {
        csmFileIndex = i;
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
        Nano.Results.ctrlLogResult = result;

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
            Nano.Results.otherLoading = result.records[result.records.length - 1][5];
            
            CWD.CallContamFunction("CONTAM.CsmFileReader.ReadCSMFile", 
              [Nano.saveFilesData[csmFileIndex].contents]).then(
              function(result)
              {            
                Nano.Results.csmResults = result;
                Nano.putResultsInGUI();
                Nano.DisplayExposureResults();
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
  air_data_table.addColumn('number', 'Zone Concentration');
  air_data_table.addColumn('number', 'Average Zone Concentration');
  if(air_data)
    air_data_table.addRows(air_data);
  var concenYAxisTitle = 'Air Concentration (' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex]) + ')'; 

  var surf_data_table = new google.visualization.DataTable();
  surf_data_table.addColumn('timeofday', 'Time of Day');
  surf_data_table.addColumn('number', 'Total');
  surf_data_table.addColumn('number', 'Floor');
  surf_data_table.addColumn('number', 'Wall');
  surf_data_table.addColumn('number', 'Ceiling');
  surf_data_table.addColumn('number', 'Other');
  if(surf_data)
    surf_data_table.addRows(surf_data);
  var surfYAxisTitle = 'Surface Loading (' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex]) + ')'; 
  
  // these display the units for integrated concentration 
  var resultUnits = ["kg s/kg", "kg s/m&sup3;", "lb s/lb", "lb s/ft&sup3;", "g s/kg", 
  "g s/m&sup3;", "g s/lb", "g s/ft&sup3;", "mg s/kg", "mg s/m&sup3;", "mg s/lb", 
  "mg s/ft&sup3;", "&micro;g s/kg", "&micro;g s/m&sup3;", "&micro;g s/lb", 
  "&micro;g s/ft&sup3;", "ng s/kg", "ng s/m&sup3;", "ng s/lb", "ng s/ft&sup3;", 
  "# s/kg", "# s/m&sup3;", "# s/lb", "# s/ft&sup3;", "# s/L", "# s/cm&sup3;"];

  var expos_data_table = new google.visualization.DataTable();
  expos_data_table.addColumn('timeofday', 'Time of Day');
  expos_data_table.addColumn('number', 'Exposure');
  expos_data_table.addColumn('number', 'Average Exposure');
  expos_data_table.addColumn('number', 'Integrated Exposure');
  if(expos_data)
    expos_data_table.addRows(expos_data);
  var exposureYAxisTitle1 = 'Occupant Exposure (' + Nano.decodeHtml(CONTAM.Units.Strings.Concentration_P[Nano.Results.IntegratedExposure.select.selectedIndex]) + ')'; 
  var exposureYAxisTitle2 = 'Integrated Occupant Exposure (' + Nano.decodeHtml(resultUnits[Nano.Results.IntegratedExposure.select.selectedIndex]) + ')'; 

  var air_options = {
    backgroundColor: '#F4F5F9',
    chartArea: {'width': '80%', 'height': '80%'},
    title: 'Air Concentration',
    vAxis: { format:'scientific'},
    vAxes: {
      // Adds titles to each axis.
      0: {title: concenYAxisTitle},
    },
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
    vAxes: {
      // Adds titles to each axis.
      0: {title: surfYAxisTitle},
    },
    series: {
      1: { lineDashStyle: [2, 2] },
      2: { lineDashStyle: [3, 2] },
      3: { lineDashStyle: [3, 1] },
      4: { lineDashStyle: [4, 3] }
    },
    legend: { position: 'bottom' }
  };

  var expos_options = {
    backgroundColor: '#F4F5F9',
    chartArea: {'width': '80%', 'height': '80%'},
    title: 'Occupant Exposure',
    vAxis: { format:'scientific'},
    vAxes: {
      // Adds titles to each axis.
      0: {title: exposureYAxisTitle1},
      1: {title: exposureYAxisTitle2}
    },
    series: {
      0: { lineDashStyle: [1, 0], targetAxisIndex: 0 },
      1: { lineDashStyle: [2, 2], targetAxisIndex: 0 },
      2: { lineDashStyle: [3, 2], targetAxisIndex: 1 }
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

Nano.UpdateDecay = function()
{
  var halfLife = Nano.Inputs.PHalfLife.input.baseValue; // s
  console.log("new half life: " + halfLife);
  var newDecayRate;
  if(isNaN(halfLife) || halfLife <= 0)
    newDecayRate = NaN
  else
    newDecayRate = -Math.abs(Math.log(0.5)/halfLife); // 1/s
  console.log("new decay rate: " + newDecayRate);
  Nano.Inputs.PDecayRate.input.baseValue = parseFloat(sprintf("%4.5g", newDecayRate));
  // this will make the inputs display the new baseValues in the proper units
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.PDecayRate.select);
}

Nano.checkInputValidity = function()
{
  var inputList = document.getElementsByTagName("INPUT");
  for (const input of inputList) 
  {
    if (!input.checkValidity()) 
    {
      alert(input.labels[0].textContent + ": " + input.validationMessage);
      return false;
    }
  }
  return true;
  
}