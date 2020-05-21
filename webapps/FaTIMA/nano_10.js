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
  Nano.simStatusSpan = document.getElementById("simStatusSpan");
  Nano.downloadLinksSpan = document.getElementById("downloadLinksSpan");
  Nano.downloadCSVSpan = document.getElementById("downloadCSVSpan");
  Nano.resultsSection = document.getElementById("resultsSection");
  Nano.inputsSection = document.getElementById("inputsSection");
  Nano.goBackButton = document.getElementById("goBackButton");
  Nano.setupAnimation();
  Nano.Init();
  Nano.disableScroll();
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

Nano.setupAnimation = function(){
  Nano.inputsSectionHeight = Nano.inputsSection.getBoundingClientRect().height;
  Nano.resultsSectionHeight = Nano.resultsSection.getBoundingClientRect().height;
  Nano.inputsSection.style.maxHeight = Nano.inputsSectionHeight + "px";
  Nano.resultsSection.style.maxHeight = 0;
}

Nano.resizeTimer = null;

//handle resize to get the correct maxheight of results and input sections
window.addEventListener('resize', function() {

  clearTimeout(Nano.resizeTimer);
  Nano.resizeTimer = setTimeout(function() {
    // Run code here, resizing has "stopped"
    let inputSectionMaxHeight = Nano.inputsSection.style.maxHeight;
    let resultSectionMaxHeight = Nano.resultsSection.style.maxHeight;
    console.log("inputSectionMaxHeight: " + inputSectionMaxHeight);
    console.log("resultSectionMaxHeight: " + resultSectionMaxHeight);
    Nano.inputsSection.style.maxHeight = "none";
    Nano.resultsSection.style.maxHeight = "none";
    Nano.inputsSectionHeight = Nano.inputsSection.getBoundingClientRect().height;
    Nano.resultsSectionHeight = Nano.resultsSection.getBoundingClientRect().height;
    if(inputSectionMaxHeight == "0px"){
      Nano.inputsSection.style.maxHeight = 0;
    }
    else{
      Nano.inputsSection.style.maxHeight = Nano.inputsSectionHeight + "px";
    }
    if(resultSectionMaxHeight == "0px"){
      Nano.resultsSection.style.maxHeight = 0;
    }
    else{
      Nano.resultsSection.style.maxHeight = Nano.resultsSectionHeight + "px";
    }
              
  }, 250);
}, true);

// init the inputs
Nano.Init = function()
{
  // these must be done onload so the UI elements can be gotten from the document
  // these establish unit objects and set up the inputs to handle units

  // Zone Geometry
  Nano.Inputs.Volume = 
  { 
    initialValue: 100, 
    convert: 0, 
    minValue: Number.EPSILON,
    func: CONTAM.Units.VolumeConvert, 
    strings: CONTAM.Units.Strings.Volume,
    input: document.getElementById("BuildingVolumeInput"),
    select: document.getElementById("BuildingVolumeCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.Volume);
  Nano.Inputs.Volume.input.addEventListener("change", Nano.computeSystem); 
  Nano.Inputs.Volume.input.addEventListener("change", Nano.calculatedEffDEpRate); 
  Nano.Inputs.Volume.input.addEventListener("change", Nano.computeSurfaceVolumeRatio); 
 
  Nano.Inputs.FloorArea = 
  { 
    initialValue: 40, 
    convert: 0, 
    minValue: 0,
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaFloorInput"),
    select: document.getElementById("SurfaceAreaFloorCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.FloorArea);
  Nano.Inputs.FloorArea.input.addEventListener("change", Nano.calculatedEffDEpRate); 
  Nano.Inputs.FloorArea.input.addEventListener("change", Nano.computeSurfaceVolumeRatio); 

  Nano.Inputs.WallArea =
  { 
    initialValue: 63.25, 
    convert: 0, 
    minValue: 0,
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaWallInput"),
    select: document.getElementById("SurfaceAreaFloorCombo"),
    unitDisplay: document.getElementById("SurfaceAreaWallUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.WallArea);
  Nano.Inputs.WallArea.input.addEventListener("change", Nano.calculatedEffDEpRate); 
  Nano.Inputs.WallArea.input.addEventListener("change", Nano.computeSurfaceVolumeRatio); 

  Nano.Inputs.CeilingArea =
  { 
    initialValue: 40, 
    convert: 0, 
    minValue: 0,
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaCeilingInput"),
    select: document.getElementById("SurfaceAreaFloorCombo"),
    unitDisplay: document.getElementById("SurfaceAreaCeilingUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.CeilingArea);
  Nano.Inputs.CeilingArea.input.addEventListener("change", Nano.calculatedEffDEpRate); 
  Nano.Inputs.CeilingArea.input.addEventListener("change", Nano.computeSurfaceVolumeRatio); 

  Nano.Inputs.OtherSurfaceArea =
  { 
    initialValue: 4, 
    convert: 0, 
    minValue: 0,
    func: CONTAM.Units.AreaConvert, 
    strings: CONTAM.Units.Strings.Area,
    input: document.getElementById("SurfaceAreaOtherInput"),
    select: document.getElementById("SurfaceAreaFloorCombo"),
    unitDisplay: document.getElementById("SurfaceAreaOtherUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.OtherSurfaceArea);
  Nano.Inputs.OtherSurfaceArea.input.addEventListener("change", Nano.calculatedEffDEpRate); 
  Nano.Inputs.OtherSurfaceArea.input.addEventListener("change", Nano.computeSurfaceVolumeRatio); 

  Nano.Inputs.SurfaceVolumeRatio = document.getElementById("SurfaceVolumeRatio");
  Nano.Inputs.SurfaceVolumeRatio.addEventListener("change", Nano.computeSurfaceVolumeRatio); 
  Nano.computeSurfaceVolumeRatio();

  //Infiltration
  Nano.Inputs.Infiltration = document.getElementById("InfiltrationInput");
  Nano.Inputs.Infiltration.value = 0.5;
  Nano.Inputs.Infiltration.addEventListener("change", Nano.computeSystem); 
  
  Nano.Inputs.PFactor = document.getElementById("PenetrationFactorInput");
  Nano.Inputs.PFactor.value = 1;

  // Ventilation System
  // SupplyRate = 0.13379 kg/s = 400 m3/h * 1.2041 kg/m3 / 3600 s/h
  Nano.Inputs.SupplyRate =
  { 
    initialValue: 0.13379,
    convert: 4,                       // m3/h
    minValue: 0.0,
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("SupplyRateInput"),
    select: document.getElementById("SupplyRateCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.SupplyRate);
  Nano.Inputs.SupplyRate.input.addEventListener("change", Nano.computeSystem); 
    
  Nano.Inputs.OAIntakeFrac = document.getElementById("OAIntakeFracInput");
  Nano.Inputs.OAIntakeFrac.value = 0;
  Nano.Inputs.OAIntakeFrac.addEventListener("change", Nano.computeSystem); 

  Nano.Inputs.ReturnRate =
  { 
    initialValue: 0.13379,
    convert: 3, 
    minValue: 0.0,
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("ReturnRateInput"),
    select: document.getElementById("SupplyRateCombo"),
    unitDisplay: document.getElementById("ReturnRateUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.ReturnRate);
  Nano.Inputs.ReturnRate.input.addEventListener("change", Nano.computeSystem); 
  
  Nano.Inputs.ExhaustRate =
  { 
    initialValue: 0,
    convert: 3, 
    minValue: 0.0,
    func: CONTAM.Units.FlowConvert, 
    strings: CONTAM.Units.Strings.Flow,
    input: document.getElementById("ExhaustRateInput"),
    select: document.getElementById("SupplyRateCombo"),
    unitDisplay: document.getElementById("ExhaustRateUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.ExhaustRate);
  Nano.Inputs.ExhaustRate.input.addEventListener("change", Nano.computeSystem); 
  
  // Caluated Airflows
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

  // system filters
  Nano.Inputs.OAFilter = document.getElementById("OAFilterSelect");
  
  Nano.Inputs.RecirFilter = document.getElementById("RecircFilterSelect");
  
  // air cleaner
  Nano.Inputs.AirCleanerFlowRate =
  { 
    initialValue: 0.113655, // 200 scfm
    convert: 1, 
    minValue: Number.EPSILON,
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

  // particle properties
  Nano.Inputs.PName = document.getElementById("ParticleNameInput");
  Nano.Inputs.PName.value = "IV1";
  
  Nano.Inputs.PDiam =
  { 
    initialValue: Nano.Species.mdiam, 
    convert: 6, 
    minValue: Number.EPSILON,
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
    minValue: Number.EPSILON,
    func: CONTAM.Units.DensityConvert, 
    strings: CONTAM.Units.Strings.Density,
    input: document.getElementById("ParticleDensityInput"),
    select: document.getElementById("ParticleDensityCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.PDensity);
  Nano.Inputs.PDensity.input.addEventListener("change", Nano.UpdateEdens); 
  
  Nano.Inputs.PDecays =  document.getElementById("useParticleDecay");
  Nano.Inputs.PDecays.addEventListener("change", Nano.changeDecayEnabled);  
  
  Nano.Inputs.PHalfLife =
  { 
    initialValue: 3960, 
    convert: 2, 
    minValue: Number.EPSILON,
    func: CONTAM.Units.TimeConvert, 
    strings: CONTAM.Units.Strings.Time,
    input: document.getElementById("ParticleHalflifeInput"),
    select: document.getElementById("ParticleHalflifeCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.PHalfLife);
  Nano.Inputs.PHalfLife.input.addEventListener("change", Nano.UpdateDecay); 
  
  Nano.Inputs.PDecayRate =
  { 
    initialValue: 0.00017504, 
    convert: 2, 
    func: CONTAM.Units.TimeConstantConvert, 
    strings: CONTAM.Units.Strings.TimeConstant,
    input: document.getElementById("ParticleDecayRateInput"),
    select: document.getElementById("ParticleDecayRateCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.PDecayRate);
  
  // constant source
  Nano.Inputs.constSrcState = document.getElementById("constSrcState");
  Nano.Inputs.constSrcState.checked = true;
  Nano.Inputs.constSrcState.addEventListener("change", Nano.changeConstSrc);

  Nano.Inputs.ReleaseRate =
  { 
    initialValue: 2.7925e-017, // 3.2 #/min
    convert: 19, 
    minValue: 0.0,
    func: CONTAM.Units.ConSSConvert2, 
    strings: CONTAM.Units.Strings.ConSS2,
    input: document.getElementById("ReleaseRateInput"),
    select: document.getElementById("ReleaseRateCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.ReleaseRate);
  
  Nano.Inputs.ConstSourceStartTime = document.getElementById("ConstSourceStartTime");
  Nano.Inputs.ConstSourceStartTime.value = "00:00";
  Nano.Inputs.ConstSourceEndTime = document.getElementById("ConstSourceEndTime"); 
  Nano.Inputs.ConstSourceEndTime.value = "24:00";
  
  // burst source
  Nano.Inputs.brstSrcState = document.getElementById("brstSrcState");
  Nano.Inputs.brstSrcState.addEventListener("change", Nano.changeBurstSrc);

  Nano.Inputs.brstType = document.getElementById("brstType");
  Nano.Inputs.brstType.addEventListener("change", Nano.changeBurstType);
  
  Nano.Inputs.ReleaseAmount =
  { 
    initialValue: 2.3562e-014, // 45 #
    convert: 5, 
    minValue: 0.0,
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("ReleaseAmountInput"),
    select: document.getElementById("ReleaseAmountCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.ReleaseAmount);

  Nano.Inputs.BrstSourceStartTime = document.getElementById("BrstSourceStartTime");
  Nano.Inputs.BrstSourceStartTime.value = "00:01";
  Nano.Inputs.BrstSourceEndTime = document.getElementById("BrstSourceEndTime"); 
  Nano.Inputs.BrstSourceEndTime.value = "24:00";

  Nano.Inputs.RepeatInterval = document.getElementById("RepeatSourceInput");
  Nano.Inputs.RepeatInterval.value = "0.5";
  
  // particle deposition velocity
  Nano.Inputs.FloorDV =
  { 
    initialValue: 6.944e-005, // m/s
    convert: 0, 
    minValue: 0.0,
    func: CONTAM.Units.SpeedConvert, 
    strings: CONTAM.Units.Strings.Speed,
    input: document.getElementById("DepositionVelocityFloorInput"),
    select: document.getElementById("DepositionVelocityFloorCombo")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.FloorDV);
  Nano.Inputs.FloorDV.input.addEventListener("change", Nano.calculatedEffDEpRate); 
 
  Nano.Inputs.WallDV =
  { 
    initialValue: 0, 
    convert: 0, 
    minValue: 0.0,
    func: CONTAM.Units.SpeedConvert, 
    strings: CONTAM.Units.Strings.Speed,
    input: document.getElementById("DepositionVelocityWallInput"),
    select: document.getElementById("DepositionVelocityFloorCombo"),
    unitDisplay: document.getElementById("DepositionVelocityWallUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.WallDV);
  Nano.Inputs.WallDV.input.addEventListener("change", Nano.calculatedEffDEpRate); 
  
  Nano.Inputs.CeilingDV =
  { 
    initialValue: 0, 
    convert: 0, 
    minValue: 0.0,
    func: CONTAM.Units.SpeedConvert, 
    strings: CONTAM.Units.Strings.Speed,
    input: document.getElementById("DepositionVelocityCeilingInput"),
    select: document.getElementById("DepositionVelocityFloorCombo"),
    unitDisplay: document.getElementById("DepositionVelocityCeilingUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.CeilingDV);
  Nano.Inputs.CeilingDV.input.addEventListener("change", Nano.calculatedEffDEpRate); 
  
  Nano.Inputs.OtherSurfaceDV =
  { 
    initialValue: 0, 
    convert: 0, 
    minValue: 0.0,
    func: CONTAM.Units.SpeedConvert, 
    strings: CONTAM.Units.Strings.Speed,
    input: document.getElementById("DepositionVelocityOtherInput"),
    select: document.getElementById("DepositionVelocityFloorCombo"),
    unitDisplay: document.getElementById("DepositionVelocityOtherUnits")
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.OtherSurfaceDV);
  Nano.Inputs.OtherSurfaceDV.input.addEventListener("change", Nano.calculatedEffDEpRate); 
  
  Nano.Inputs.DepositionRateCalc =
  { 
    initialValue: 0, 
    convert: 2, 
    func: CONTAM.Units.TimeConstantConvert, 
    strings: CONTAM.Units.Strings.TimeConstant,
    input: document.getElementById("DepositionRateCalculated"),
    select: document.getElementById("DepositionRateCalculatedCombo"),
  };
  CONTAM.Units.SetupUnitInputs(Nano.Inputs.DepositionRateCalc);
  Nano.calculatedEffDEpRate();

  //initial concentrations
  Nano.Inputs.OutdoorConcen =
  { 
    initialValue: 0, 
    convert: 4, 
    minValue: 0.0,
    func: CONTAM.Units.PartConcenConvert, 
    strings: CONTAM.Units.Strings.PartConcen,
    input: document.getElementById("InitialConcentrationOutdoorInput"),
    select: document.getElementById("InitialConcentrationOutdoorCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.OutdoorConcen);

  Nano.Inputs.InitZoneConcen =
  { 
    initialValue: 0, 
    convert: 4, 
    minValue: 0.0,
    func: CONTAM.Units.PartConcenConvert, 
    strings: CONTAM.Units.Strings.PartConcen,
    input: document.getElementById("InitialConcentrationInput"),
    select: document.getElementById("InitialConcentrationOutdoorCombo"),
    unitDisplay: document.getElementById("InitialConcentrationUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Inputs.InitZoneConcen);

  // occupant exposure
  Nano.Inputs.ExposStartTime = document.getElementById("StartExposureInput");
  Nano.Inputs.ExposStartTime.value = "07:00";
  Nano.Inputs.ExposEndTime = document.getElementById("EndExposureInput");
  Nano.Inputs.ExposEndTime.value = "17:00";
  
  Nano.Inputs.occType = document.getElementById("occType");
  Nano.Inputs.occType.selectedIndex = 1;
  Nano.Inputs.occType.addEventListener("change", Nano.changeOccType);

  Nano.Inputs.occupantInterval = document.getElementById("occIntervalInput");
  Nano.Inputs.occupantInterval.value = "60";
  Nano.Inputs.occupantDuration = document.getElementById("occDurationInput");
  Nano.Inputs.occupantDuration.value = "10";

  Nano.computeSystem();

  //results
  //
  // concentration results
  Nano.Results.maximumConc =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.PartConcenConvert, 
    strings: CONTAM.Units.Strings.PartConcen,
    input: document.getElementById("maximumConc"),
    select: document.getElementById("maximumConcCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.maximumConc);
  Nano.Results.maximumConc.select.addEventListener("input", Nano.DisplayExposureResults); 

  Nano.Results.averageDailyExposureResult =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.PartConcenConvert, 
    strings: CONTAM.Units.Strings.PartConcen,
    input: document.getElementById("averageDailyExposureResult"),
    select: document.getElementById("maximumConcCombo"),
    unitDisplay: document.getElementById("averageDailyExposureResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.averageDailyExposureResult);

  Nano.Results.averageConcOcc =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.PartConcenConvert, 
    strings: CONTAM.Units.Strings.PartConcen,
    input: document.getElementById("averageConcOccResult"),
    select: document.getElementById("maximumConcCombo"),
    unitDisplay: document.getElementById("averageConcOccResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.averageConcOcc);

  // exposure results 

  //integrated concentration result
  Nano.Results.averageExposureResult =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.ConcnSurfConvert, 
    strings: CONTAM.Units.Strings.Concentration_Surf,
    input: document.getElementById("averageExposureResult"),
    select: document.getElementById("maximumConcCombo"),
    unitDisplay: document.getElementById("averageExposureResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.averageExposureResult);

  Nano.Results.IntegratedExposure =
  { 
    initialValue: 0, 
    convert: 3, 
    func: CONTAM.Units.IntegratedConcenConvert, 
    strings: CONTAM.Units.Strings.IntegratedConcen,
    input: document.getElementById("IntegratedExposureInput"),
    select: document.getElementById("IntegratedExposureCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.IntegratedExposure);
  Nano.Results.IntegratedExposure.select.addEventListener("input", Nano.DisplayExposureResults); 

  Nano.Results.maximumConcExpos =
  { 
    initialValue: 0, 
    convert: 4, 
    func: CONTAM.Units.PartConcenConvert, 
    strings: CONTAM.Units.Strings.PartConcen,
    input: document.getElementById("maximumConcExpos"),
    select: document.getElementById("maximumConcCombo"),
    unitDisplay: document.getElementById("maximumConcExposUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.maximumConcExpos);

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
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("totalEmmissionResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.totalEmmission);
  Nano.Results.totalEmmission.select.addEventListener("input", Nano.DisplayExposureResults); 

  Nano.Results.continuousEmmission =
  { 
    initialValue: 0, 
    convert: 5, 
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
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("burstEmmissionResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("burstEmmissionResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.burstEmmission);

  
  Nano.Results.outdoorEmmission =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("outdoorEmmissionResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("outdoorEmmissionResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.outdoorEmmission);

  // filter loading results
  Nano.Results.totalFilterLoading =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("totalFilterLoadingResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("totalFilterLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.totalFilterLoading);

  Nano.Results.oaFilterLoading =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("oaFilterLoadingResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("oaFilterLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.oaFilterLoading);

  Nano.Results.recFilterLoading =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("recFilterLoadingResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("recFilterLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.recFilterLoading);

  Nano.Results.acFilterLoading =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("acFilterLoadingResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("acFilterLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.acFilterLoading);

  Nano.Results.envFilterLoading =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("envFilterLoadingResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("envFilterLoadingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.envFilterLoading);

  // surface mass deposited
  Nano.Results.totalMassDeposited =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("totalMassDepResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("totalMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.totalMassDeposited);

  Nano.Results.floorMassDeposited =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("floorMassDepResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("floorMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.floorMassDeposited);

  Nano.Results.wallMassDeposited =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("wallMassDepResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("wallMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.wallMassDeposited);

  Nano.Results.ceilingMassDeposited =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("ceilingMassDepResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("ceilingMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.ceilingMassDeposited);

  Nano.Results.otherMassDeposited =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("otherMassDepResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("otherMassDepResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.otherMassDeposited);

  // mass eliminated
  Nano.Results.massDeactivated =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("massDeactivatedResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("massDeactivatedResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.massDeactivated);

  Nano.Results.massExited =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("massExitedResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("massExitedResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.massExited);

  Nano.Results.massRemaining =
  { 
    initialValue: 0, 
    convert: 5, 
    func: CONTAM.Units.Mass2Convert, 
    strings: CONTAM.Units.Strings.Mass2,
    input: document.getElementById("massRemainingResult"),
    select: document.getElementById("totalEmmissionResultCombo"),
    unitDisplay: document.getElementById("massRemainingResultUnits"),
    species: Nano.Species
  };
  CONTAM.Units.SetupSpeciesUnitInputs(Nano.Results.massRemaining);

}

Nano.computeSurfaceVolumeRatio = function()
{
  Nano.Inputs.SurfaceVolumeRatio.value = sprintf("%.2g",(Nano.Inputs.FloorArea.input.baseValue + Nano.Inputs.WallArea.input.baseValue + 
    Nano.Inputs.CeilingArea.input.baseValue + Nano.Inputs.OtherSurfaceArea.input.baseValue)/ Nano.Inputs.Volume.input.baseValue);
}

Nano.calculatedEffDEpRate = function()
{
  Nano.Inputs.DepositionRateCalc.input.baseValue =  
    (Nano.Inputs.FloorDV.input.baseValue * Nano.Inputs.FloorArea.input.baseValue + 
    Nano.Inputs.WallDV.input.baseValue * Nano.Inputs.WallArea.input.baseValue + 
    Nano.Inputs.CeilingDV.input.baseValue * Nano.Inputs.CeilingArea.input.baseValue +
    Nano.Inputs.OtherSurfaceDV.input.baseValue * Nano.Inputs.OtherSurfaceArea.input.baseValue) /
    Nano.Inputs.Volume.input.baseValue;
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.DepositionRateCalc.select);
}

Nano.ComputeAirCleanerCADR = function()
{
  Nano.Inputs.AirCleanerCADR.input.baseValue = Nano.Inputs.AirCleanerFlowRate.input.baseValue * 
    Nano.Inputs.AirCleanerFlowFrac.valueAsNumber * Nano.Inputs.AirCleanerEff.valueAsNumber;
  // this will make the inputs display the new baseValues in the proper units
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.AirCleanerCADR.select);
}

Nano.changeDecayEnabled = function()
{
  Nano.Inputs.PHalfLife.input.disabled = Nano.Inputs.PDecays.selectedIndex == 1;
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
  // fraction of OA
  var fOA = Nano.Inputs.OAIntakeFrac.valueAsNumber;
  // supply rate in kg/s
  var Fsup = Nano.Inputs.SupplyRate.input.baseValue;
  // return rate in kg/s
  var Fret = Nano.Inputs.ReturnRate.input.baseValue;
  // zone exhaust fan rate in kg/s
  var Fzexh = Nano.Inputs.ExhaustRate.input.baseValue;
  // volume in m^3
  var volume = Nano.Inputs.Volume.input.baseValue;
  // for now assume QoaMin is 0
  var FoaMin = 0;
  
  //convert from 1/h to 1/s
  var ACHinf = Nano.Inputs.Infiltration.valueAsNumber / 3600; // 1/s
  // convert from 1/s to kg/s
  var Finf = volume * ACHinf * CONTAM.Units.rho20; // kg/s
  
  var FoaPrim = Math.max(fOA*Fsup, Math.min(Fsup, FoaMin));
  var Frec = Math.min(Fret, Fsup - FoaPrim);
  var Foa = Fsup - Frec;
  var Fexh = Fret - Frec;
  Nano.Inputs.Fbal = Fsup + Finf - Fret - Fzexh;
  var ach = (Finf + Foa-(Math.min(0,Nano.Inputs.Fbal))) / (CONTAM.Units.rho20 * volume);
  //use sprintf to avoid long numbers and parse back to a number
  Nano.Inputs.Ach.input.baseValue = ach;
  // this will make the inputs display the new baseValues in the proper units
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.Ach.select);  
  
  console.log("Fsup: " + Fsup);
  console.log("Fret: " + Fret);
  console.log("Fexh: " + Fexh);
  console.log("volume: " + volume);
  console.log("FoaMin: " + FoaMin);
  console.log("Finf: " + Finf);
  console.log("FoaPrim: " + FoaPrim);
  console.log("Frec: " + Frec);
  console.log("Foa: " + Foa);
  console.log("Fzexh: " + Fzexh);
  console.log("Fbal: " + Nano.Inputs.Fbal);
  console.log("ach: " + ach);
  console.log("-----");
    
  Nano.Inputs.Qoa.input.baseValue = Foa;
  Nano.Inputs.Qrec.input.baseValue = Frec;
  // this will make the inputs display the new baseValues in the proper units
  CONTAM.Units.ChangeUnits.apply(Nano.Inputs.Qoa.select);
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

  if(Nano.Inputs.constSrcState.selectedIndex == 0)
  {
    releaseRate = parseFloat(Nano.Inputs.ReleaseRate.input.baseValue);
    if(isNaN(releaseRate))
    {
      alert("The release rate is not a number.");
      return;
    }
    console.log("releaseRate: " + releaseRate + " kg/s");
    if(Nano.Inputs.brstSrcState.selectedIndex == 0)
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
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[1].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(7)"});
      //set burst source release amount to zero
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.M", variableValue: 0});
    }
  }
  else
  {
    console.log("releaseRate: not used");
    if(Nano.Inputs.brstSrcState.selectedIndex == 0)
    {
      releaseAmount = parseFloat(Nano.Inputs.ReleaseAmount.input.baseValue);
      if(isNaN(releaseAmount))
      {
        alert("The release amount is not a number.");
        return;
      }
      console.log("releaseAmount: " + releaseAmount + " kg");
      //set the const source to Off schedule 
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[2].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(7)"});
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
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[2].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(7)"});7
      //set constant source release rate to zero
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(1).ped.G", variableValue: 0});
      //set the burst source to Off schedule 
      arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[1].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(7)"});
      //set burst source release amount to zero
      variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(2).ped.M", variableValue: 0});

    }
  }
  
  //set the deposition rate for particle deactivation
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(3).kd", variableValue: Nano.Inputs.PDecayRate.input.baseValue});

  if(Nano.Inputs.PDecays.selectedIndex == 0)
    //set deposition rate for deactivation to deactivate schedule
    arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[7].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(4)"});
  else
    //set deposition rate for deactivation to off schedule
    arrayOfParameters.push({setVariableName: "CONTAM.Project.CssList[7].ps", toVariableName: "CONTAM.Project.Wsch0.GetByNumber(7)"});
  
  CWD.SetArrayOfContamVariableToVariable(arrayOfParameters)
  .then((result) => CWD.SetArrayOfContamVariables(variableList))
  .then((result) => Nano.GetInputs2())
  .catch(errorHandler);
  
}

Nano.GetInputs2 = function()
{
  console.log("GetInputs2");
  // get inputs into local variables and make sure that they are valid numbers
  
  var OAFilterIndex = Nano.Inputs.OAFilter.selectedIndex;
  var recircFilterIndex = Nano.Inputs.RecirFilter.selectedIndex;
  var filterElementNames = ["zero", "MERV-04","MERV-05", "MERV-06",
    "MERV-07", "MERV-08", "MERV-09", "MERV-10", "MERV-11",
    "MERV-12", "MERV-13", "MERV-14", "MERV-15", "MERV-16"];

  // constant source times
  var CnstStartSource = Nano.Inputs.ConstSourceStartTime.value;
  var CnstEndSource = Nano.Inputs.ConstSourceEndTime.value;
  var CnstStartSourceTime = CONTAM.TimeUtilities.ShortStringTimeToIntTime(CnstStartSource);//
  if(CnstStartSourceTime < 0)
  {
    alert("The start constant source time is not a valid time.");
    return;
  }
  var CnstEndSourceTime = CONTAM.TimeUtilities.ShortStringTimeToIntTime(CnstEndSource);//
  if(CnstEndSourceTime < 0)
  {
    alert("The end constant source time is not a valid time.");
    return;
  }
  if(CnstEndSourceTime < CnstStartSourceTime)
  {
    alert("The end constant source time cannot be before the start constant source time.");
    return;
  }

  //burst source times 
  var BrstStartSource = Nano.Inputs.BrstSourceStartTime.value;
  var BrstEndSource = Nano.Inputs.BrstSourceEndTime.value;
  var BrstStartSourceTime = CONTAM.TimeUtilities.ShortStringTimeToIntTime(BrstStartSource);//
  if(BrstStartSourceTime < 0)
  {
    alert("The start burst source time is not a valid time.");
    return;
  }
  if(BrstStartSourceTime == 0)
  {
    alert("The start burst source time cannot be at 00:00.");
    return;
  }
  var BrstEndSourceTime = CONTAM.TimeUtilities.ShortStringTimeToIntTime(BrstEndSource);//
  if(BrstEndSourceTime < 0)
  {
    alert("The end burst source time is not a valid time.");
    return;
  }
  if(BrstEndSourceTime < BrstStartSourceTime)
  {
    alert("The end burst source time cannot be before the start burst source time.");
    return;
  }
 
  var StartExposure = Nano.Inputs.ExposStartTime.value;//
  var EndExposure = Nano.Inputs.ExposEndTime.value;//
  Nano.StartExposureTime = CONTAM.TimeUtilities.ShortStringTimeToIntTime(StartExposure);//
  if(Nano.StartExposureTime < 0)
  {
    alert("The start exposure time is not a valid time.");
    return;
  }
  Nano.EndExposureTime = CONTAM.TimeUtilities.ShortStringTimeToIntTime(EndExposure);//
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
  var envelopeLeakageMultiplier = 4 * Nano.Inputs.Volume.input.baseValue / Math.sqrt(Nano.Inputs.FloorArea.input.baseValue);
  
  // compute the volume flow for the infiltration fan - m^3/s
  var infiltrationVolFlow =  Nano.Inputs.Infiltration.valueAsNumber * Nano.Inputs.Volume.input.baseValue / 3600;
  
  // compute the volume flow for the exhaust fan - m^3/s
  var exhaustVolFlow =  Nano.Inputs.ExhaustRate.input.baseValue / CONTAM.Units.rho20;

  if(Nano.Inputs.occupantInterval.valueAsNumber <= Nano.Inputs.occupantDuration.valueAsNumber)
  {
    alert("The occupancy duration must be less than the occupancy interval.");
    return;
  }

  // create an array of variables to set in the project
  // so that they can be sent to the CONTAM worker
  var variableList = [];
  variableList.push({variableName: "CONTAM.Project.ZoneList[1].Vol", variableValue: Nano.Inputs.Volume.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.ZoneList[1].CC0[0]", variableValue: Nano.Inputs.InitZoneConcen.input.baseValue / CONTAM.Units.rho20});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).name", variableValue: Nano.Inputs.PName.value});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).mdiam", variableValue: Nano.Inputs.PDiam.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).edens", variableValue: Nano.Inputs.PDensity.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Spcs0.GetByNumber(1).ccdef", variableValue: Nano.Inputs.OutdoorConcen.input.baseValue / CONTAM.Units.rho20});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.dV", variableValue: Nano.Inputs.CeilingDV.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(5).ped.dV", variableValue: Nano.Inputs.FloorDV.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(6).ped.dV", variableValue: Nano.Inputs.OtherSurfaceDV.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(7).ped.dV", variableValue: Nano.Inputs.WallDV.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.PathList[1].Fahs", variableValue: Nano.Inputs.SupplyRate.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.PathList[2].Fahs", variableValue: Nano.Inputs.ReturnRate.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(4).ped.dA", variableValue: Nano.Inputs.CeilingArea.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(5).ped.dA", variableValue: Nano.Inputs.FloorArea.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(6).ped.dA", variableValue: Nano.Inputs.OtherSurfaceArea.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Cse0.GetByNumber(7).ped.dA", variableValue: Nano.Inputs.WallArea.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.PathList[5].pf.pe.ped.eff[0]", variableValue: 1 - Nano.Inputs.PFactor.valueAsNumber});
  variableList.push({variableName: "CONTAM.Project.Dsch0.GetByNumber(12).ctrl[0]", variableValue: Nano.Inputs.OAIntakeFrac.valueAsNumber});
  variableList.push({variableName: "CONTAM.Project.Dsch0.GetByNumber(12).ctrl[1]", variableValue: Nano.Inputs.OAIntakeFrac.valueAsNumber});
  variableList.push({variableName: "CONTAM.Project.PathList[5].mult", variableValue: envelopeLeakageMultiplier});
  variableList.push({variableName: "CONTAM.Project.Dfe0.GetByNumber(1).ped.Flow", variableValue: Nano.Inputs.AirCleanerFlowRate.input.baseValue});
  variableList.push({variableName: "CONTAM.Project.Flte0.GetByNumber(1).ped.eff[0]", variableValue: Nano.Inputs.AirCleanerEff.valueAsNumber});
  variableList.push({variableName: "CONTAM.Project.Afe0.GetByNumber(2).ped.Flow", variableValue: infiltrationVolFlow});
  variableList.push({variableName: "CONTAM.Project.Dsch0.GetByNumber(1).ctrl[0]", variableValue: Nano.Inputs.AirCleanerFlowFrac.valueAsNumber});
  variableList.push({variableName: "CONTAM.Project.Afe0.GetByNumber(1).ped.Flow", variableValue: exhaustVolFlow});
  
  
  function errorHandler(error)
  {
    throw new Error(error.message);
  }
  // set the filter element for the OA path
  CWD.CallContamFunction("CONTAM.setPathFilterElement", [7, filterElementNames[OAFilterIndex]])
  // set the filter element for the recirculation path
  .then((result) => CWD.CallContamFunction("CONTAM.setPathFilterElement", [6, filterElementNames[recircFilterIndex]]))
  // set the occupant day schedule to use the start/end time that the user specified
  .then((result) => CWD.CallContamFunction("CONTAM.SetOccDaySchedule", [Nano.StartExposureTime, Nano.EndExposureTime,  Nano.Inputs.occType.selectedIndex == 1, 
    Nano.Inputs.occupantInterval.valueAsNumber * 60, Nano.Inputs.occupantDuration.valueAsNumber * 60]))
  // set the day schedule for the breathing source to use the start/end time that the user specified
  .then((result) => CWD.CallContamFunction("CONTAM.SetDaySchedule", [2, CnstStartSourceTime, CnstEndSourceTime, false, 0, 0, false]))
  // set the day schedule for the coughing source to use the start/end time that the user specified
  .then((result) => CWD.CallContamFunction("CONTAM.SetDaySchedule", [3, BrstStartSourceTime, BrstEndSourceTime, Nano.Inputs.brstType.selectedIndex == 1, Nano.Inputs.RepeatInterval.valueAsNumber * 60, 15, true]))
  // send the array of variables to change to the CONTAM worker
  .then((result) => CWD.SetArrayOfContamVariables(variableList))
  .then((result) => Nano.RunSim())
  .catch(errorHandler);
}

Nano.RunSim = function()
{
  var projectText;
  
  console.log("RunSim");

  Nano.inputsSection.style.maxHeight = 0;

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
      Nano.CXWorker = new Worker("../contam-x/contamx_worker.js");
      //setup a function to receive messages from ContamX
      Nano.CXWorker.onmessage = Nano.onCXWorkerMessage;

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
      Nano.CXWorker.postMessage(data);
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
    if(Nano.Results.savePrjLink){
      window.URL.revokeObjectURL(Nano.Results.savePrjLink);
    }
    Nano.Results.savePrjLink = window.URL.createObjectURL(prjBlob);
    savelink.href = Nano.Results.savePrjLink;
  }
  savelink.textContent = "Download CONTAM Project";
  savelink.className = "blacklink";
  saveSpan.appendChild(savelink);
  Nano.downloadLinksSpan.appendChild(saveSpan);
  document.getElementById("projectFileLabel").style.display = "inline-block";

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
  
  // particle fate
  Nano.Results.Mfilt = Nano.Results.csmResults.recFiltMassSto + Nano.Results.csmResults.oaFiltMassSto + 
    Nano.Results.csmResults.acFiltMassSto + Nano.Results.csmResults.penetrationPath3;
  Nano.Results.Mdep = Nano.Results.csmResults.floorMassStored + Nano.Results.csmResults.wallsMassStored + 
    Nano.Results.csmResults.ceilingMassStored + Nano.Results.csmResults.otherMassStored;
  Nano.Results.Mexf = Nano.Results.csmResults.ctm_exfil;
  let envLoading = Nano.Results.csmResults.penetrationPath3;
  let outdoorSource = Nano.Results.csmResults.ctm_entered + Nano.Results.csmResults.oaFiltMassSto + Nano.Results.csmResults.penetrationPath3;
  if(Nano.Inputs.Fbal >= 0){
    Nano.Results.Mexf += Nano.Results.csmResults.penetrationPath5;
  } else {
    Nano.Results.Mfilt += Nano.Results.csmResults.penetrationPath5;
    envLoading += Nano.Results.csmResults.penetrationPath5;
    outdoorSource += Nano.Results.csmResults.penetrationPath5;
  }

  Nano.Results.Mzone = Nano.Results.ctrlLogResult.finalConcen * Nano.Inputs.Volume.input.baseValue;
  Nano.Results.Mdeact = Nano.Results.csmResults.massDeactivated;

  
  
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
    
  // sources results
  // burst
  Nano.Results.burstEmmission.input.baseValue = Nano.Results.csmResults.burstMassAdded;

  // continuous
  Nano.Results.continuousEmmission.input.baseValue = Nano.Results.csmResults.continuousMassAdded;

  // outdoor
  Nano.Results.outdoorEmmission.input.baseValue = outdoorSource;

  // total
  Nano.Results.totalEmmission.input.baseValue = Nano.Results.csmResults.burstMassAdded + Nano.Results.csmResults.continuousMassAdded + outdoorSource;
  
  //mass filtered results
  // oa
  Nano.Results.oaFilterLoading.input.baseValue = Nano.Results.csmResults.oaFiltMassSto;
  
  // rec
  Nano.Results.recFilterLoading.input.baseValue = Nano.Results.csmResults.recFiltMassSto;
  
  // ac
  Nano.Results.acFilterLoading.input.baseValue = Nano.Results.csmResults.acFiltMassSto;

  //envelope
  Nano.Results.envFilterLoading.input.baseValue = envLoading;
  
  //total
  Nano.Results.totalFilterLoading.input.baseValue = Nano.Results.csmResults.oaFiltMassSto + 
    Nano.Results.csmResults.recFiltMassSto + Nano.Results.csmResults.acFiltMassSto + envLoading;
  
  //mass deposited
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

  // other mass 
  Nano.Results.massDeactivated.input.baseValue = Nano.Results.Mdeact;

  Nano.Results.massExited.input.baseValue = Nano.Results.Mexf;

  Nano.Results.massRemaining.input.baseValue = Nano.Results.Mzone;

  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.massExited.select);
}

Nano.DisplayExposureResults = function()
{
  var maxExpos = 0;

  if(!Nano.Results.ctrlLogResult)
  {
    console.log('no results found by DisplayExposureResults function');
    return;
  }
  
  // load the inputs with unit selects
  // concentration
  Nano.Results.IntegratedExposure.input.baseValue = Nano.Results.ctrlLogResult.integral;
  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.IntegratedExposure.select);
  
  // concentration results
  
  // load the other concentration result display boxes

  //average exposure over the user's exposure period (in kg/m3)
  Nano.Results.averageExposureResult.input.baseValue = (Nano.Results.ctrlLogResult.integral / Nano.ExposureDuration);
    // set the display of the period of the average
  document.getElementById("averageExposureDiv").textContent = 
    "Average (" + (Nano.ExposureDuration / 3600).toString() + " h)";
  Nano.Results.AverageExposureUserUnits = CONTAM.Units.PartConcenConvert(Nano.Results.averageExposureResult.input.baseValue, 
    Nano.Results.averageExposureResult.select.selectedIndex, 0, Nano.Species);

  //average exposure over 24 period (in kg/m3)
  Nano.Results.averageDailyExposureResult.input.baseValue = Nano.Results.ctrlLogResult.averageConcen;
  Nano.Results.AverageExposure24Units = CONTAM.Units.PartConcenConvert(Nano.Results.averageDailyExposureResult.input.baseValue, 
    Nano.Results.averageDailyExposureResult.select.selectedIndex, 0, Nano.Species);
  //max concentration 
  Nano.Results.maximumConc.input.baseValue = Nano.Results.ctrlLogResult.maxConcen;

  //compute the average zone conc during occupancy
  var sumConcOcc = 0;
  var countConcOcc = 0;
  for(var i=0; i<Nano.Results.ctrlLogResult.concendata.length; ++i)
  {
    var chart_time = Nano.Results.ctrlLogResult.concendata[i][0];
    var seconds = Nano.ConvertChartTime(chart_time);
    if(seconds >= Nano.StartExposureTime && seconds <= Nano.EndExposureTime) 
    {
      var basevalue = Nano.Results.ctrlLogResult.concendata[i][1];
      sumConcOcc+= basevalue;
      countConcOcc++;
    }
  }
  Nano.Results.AverageConcOccUserUnits = sumConcOcc / countConcOcc;
  Nano.Results.averageConcOcc.input.baseValue = Nano.Results.AverageConcOccUserUnits;
  Nano.Results.AverageConcOccUserUnits = CONTAM.Units.PartConcenConvert(
    Nano.Results.AverageConcOccUserUnits, Nano.Results.averageExposureResult.select.selectedIndex, 0, Nano.Species);
  // set the display of the period of the average
  document.getElementById("averageConcOccResultDiv").textContent = 
  "Average (" + (Nano.ExposureDuration / 3600).toString() + " h)";
  
  //create the plot data rows
  Nano.concenDataUserUnits = [];
  Nano.exposureDataUserUnits = [];
  Nano.surfaceDataUserUnits = [];
  for(var i=0; i<Nano.Results.ctrlLogResult.concendata.length; ++i)
  {
    // create a concentration record for plotting
    var concenRecord = [];
    // add the time 
    var chart_time = Nano.Results.ctrlLogResult.concendata[i][0];
    var seconds = Nano.ConvertChartTime(chart_time);
    concenRecord.push(chart_time);
    var basevalue = Nano.Results.ctrlLogResult.concendata[i][1];
    var uservalue = CONTAM.Units.PartConcenConvert(
      basevalue, Nano.Results.averageExposureResult.select.selectedIndex, 0, Nano.Species);
    // add the concentration
    concenRecord.push(uservalue);
    //add the concentration tooltip
    concenRecord.push("Y: " + sprintf("%.3g", uservalue) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.concendata[i][0])));

    // add the average
    concenRecord.push(Nano.Results.AverageExposure24Units);
    // add the average tooltip
    concenRecord.push("Y: " + sprintf("%.3g", Nano.Results.AverageExposure24Units) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.concendata[i][0])));
    // add the average only inside of the exposure period
    if(seconds >= Nano.StartExposureTime && seconds <= Nano.EndExposureTime) 
    {
      concenRecord.push(Nano.Results.AverageConcOccUserUnits);
      //add the exposure average tooltip
      concenRecord.push("Y: " + sprintf("%.3g", Nano.Results.AverageConcOccUserUnits) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
    }
    else
    {
      concenRecord.push(0);
      //add the exposure tooltip
      concenRecord.push("Y: 0.00, X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
    }

    // add the record to the array of records
    Nano.concenDataUserUnits.push(concenRecord);

    // create an exposure record for plotting
    var exposureRecord = [];
    // add the time
    var chart_time = Nano.Results.ctrlLogResult.exposuredata[i][0];
    var seconds = Nano.ConvertChartTime(chart_time);
    exposureRecord.push(chart_time);
    // add the concen
    basevalue = Nano.Results.ctrlLogResult.exposuredata[i][1];
    uservalue = CONTAM.Units.PartConcenConvert(
      basevalue, Nano.Results.averageExposureResult.select.selectedIndex, 0, Nano.Species);
    exposureRecord.push(uservalue);
    //add the exposure tooltip
    exposureRecord.push("Y: " + sprintf("%.3g", uservalue) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
    // add the average only inside of the exposure period
    if(seconds >= Nano.StartExposureTime && seconds <= Nano.EndExposureTime) 
    {
      exposureRecord.push(Nano.Results.AverageExposureUserUnits);
      //add the exposure average tooltip
      exposureRecord.push("Y: " + sprintf("%.3g", Nano.Results.AverageExposureUserUnits) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
      if(basevalue > maxExpos)
        maxExpos = basevalue;
    }
    else
    {
      exposureRecord.push(0);
      //add the exposure tooltip
      exposureRecord.push("Y: 0.00, X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
    }
    //integrated expos
    basevalue = Nano.Results.ctrlLogResult.exposuredata[i][2];
    uservalue = CONTAM.Units.IntegratedConcenConvert(
      basevalue, Nano.Results.IntegratedExposure.select.selectedIndex, 0, Nano.Species);
    exposureRecord.push(uservalue);
    //add the exposure tooltip
    exposureRecord.push("Y: " + sprintf("%.3g", uservalue) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
    
    // add the record to the array of records
    Nano.exposureDataUserUnits.push(exposureRecord);

    // create a record of surface data for plotting
    var surfaceRecord = [];
    // add time value
    surfaceRecord.push(Nano.surfaceDataBaseUnits[i][0]);

    // add total value
    var totalValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][1], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    surfaceRecord.push(totalValue);
    //add the total value tooltip
    surfaceRecord.push("Y: " + sprintf("%.3g", totalValue) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
    
    // add floor value
    var floorValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][2], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    surfaceRecord.push(floorValue);
    //add the floor value tooltip
    surfaceRecord.push("Y: " + sprintf("%.3g", floorValue) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
        
    // add wall value
    var wallValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][3], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    surfaceRecord.push(wallValue);
    //add the wall value tooltip
    surfaceRecord.push("Y: " + sprintf("%.3g", wallValue) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
    
    // add ceiling value
    var ceilingValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][4], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    surfaceRecord.push(ceilingValue);
    //add the ceiling value tooltip
    surfaceRecord.push("Y: " + sprintf("%.3g", ceilingValue) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));
    
    // add other value
    var otherValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][5], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    surfaceRecord.push(otherValue);
    //add the other value tooltip
    surfaceRecord.push("Y: " + sprintf("%.3g", otherValue) + ", X: " + 
      CONTAM.TimeUtilities.IntTimeToShortStringTime(Nano.ConvertChartTime(Nano.Results.ctrlLogResult.exposuredata[i][0])));

      // add the record to the array of records
    Nano.surfaceDataUserUnits.push(surfaceRecord);
  }

  // put exposure results in the UI
  document.getElementById("maxExposureDiv").textContent = 
    "Maximum (" + (Nano.ExposureDuration / 3600).toString() + " h)";
  Nano.Results.maximumConcExpos.input.baseValue = maxExpos;

  CONTAM.Units.ChangeSpeciesUnits.apply(Nano.Results.maximumConcExpos.select);


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
    Nano.CXWorker.terminate();
    Nano.CXWorker = null;

    console.log("read log file");
    CWD.CallContamFunction("CONTAM.CtrlLogFileReader.ReadLogFile", 
      [Nano.saveFilesData[logFileIndex].contents]).then(
      function(result)
      {
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
                Nano.goBackButton.style.display = "inline-block";
                document.getElementById("reportLabel").style.display = "inline-block";
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
  
  console.log("drawChart");

  if(Nano.concenDataUserUnits)
  {
    air_data = Nano.concenDataUserUnits;
    surf_data = Nano.surfaceDataUserUnits;
    expos_data = Nano.exposureDataUserUnits;
  }
  else return;

  var air_data_table = new google.visualization.DataTable();
  air_data_table.addColumn('timeofday', 'Time of Day');
  air_data_table.addColumn('number', 'Zone');
  // A column for custom tooltip content
  air_data_table.addColumn({type: 'string', role: 'tooltip'});
  air_data_table.addColumn('number', 'Average (24 h)');
  // A column for custom tooltip content
  air_data_table.addColumn({type: 'string', role: 'tooltip'});
  air_data_table.addColumn('number', 'Average  (' + (Nano.ExposureDuration / 3600).toString() + " h)");
  // A column for custom tooltip content
  air_data_table.addColumn({type: 'string', role: 'tooltip'});
  if(air_data)
    air_data_table.addRows(air_data);
  var concenYAxisTitle = 'Air Concentration (' + 
    Nano.decodeHtml(CONTAM.Units.Strings.PartConcen[Nano.Results.maximumConcExpos.select.selectedIndex]) + ')'; 

  var surf_data_table = new google.visualization.DataTable();
  surf_data_table.addColumn('timeofday', 'Time of Day');
  surf_data_table.addColumn('number', 'Total');
  // A column for custom tooltip content
  surf_data_table.addColumn({type: 'string', role: 'tooltip'});
  surf_data_table.addColumn('number', 'Floor');
  // A column for custom tooltip content
  surf_data_table.addColumn({type: 'string', role: 'tooltip'});
  surf_data_table.addColumn('number', 'Walls');
  // A column for custom tooltip content
  surf_data_table.addColumn({type: 'string', role: 'tooltip'});
  surf_data_table.addColumn('number', 'Ceiling');
  // A column for custom tooltip content
  surf_data_table.addColumn({type: 'string', role: 'tooltip'});
  surf_data_table.addColumn('number', 'Other');
  // A column for custom tooltip content
  surf_data_table.addColumn({type: 'string', role: 'tooltip'});
  if(surf_data)
    surf_data_table.addRows(surf_data);
  var surfYAxisTitle = 'Surface Loading (' + 
    Nano.decodeHtml(CONTAM.Units.Strings.Concentration_Surf[Nano.Results.totalSurfaceLoading.select.selectedIndex]) + ')'; 
  
  var expos_data_table = new google.visualization.DataTable();
  expos_data_table.addColumn('timeofday', 'Time of Day');
  expos_data_table.addColumn('number', 'Occupant');
  // A column for custom tooltip content
  expos_data_table.addColumn({type: 'string', role: 'tooltip'});
  expos_data_table.addColumn('number', 'Average (' + (Nano.ExposureDuration / 3600).toString() + " h)");
  // A column for custom tooltip content
  expos_data_table.addColumn({type: 'string', role: 'tooltip'});
  expos_data_table.addColumn('number', 'Integrated Exposure');
  // A column for custom tooltip content
  expos_data_table.addColumn({type: 'string', role: 'tooltip'});
  if(expos_data)
    expos_data_table.addRows(expos_data);
  var exposureYAxisTitle1 = 'Exposure Concentration (' + Nano.decodeHtml(CONTAM.Units.Strings.PartConcen[Nano.Results.maximumConcExpos.select.selectedIndex]) + ')'; 
  var exposureYAxisTitle2 = 'Integrated Exposure (' + Nano.decodeHtml(CONTAM.Units.Strings.IntegratedConcen[Nano.Results.IntegratedExposure.select.selectedIndex]) + ')'; 

  // mass
  //exited zone 
  var exited = CONTAM.Units.Mass2Convert(Nano.Results.Mexf, Nano.Results.totalEmmission.select.selectedIndex, 0, Nano.Species);
  //filtered 
  var filtered = CONTAM.Units.Mass2Convert(Nano.Results.Mfilt, Nano.Results.totalEmmission.select.selectedIndex, 0, Nano.Species);
  //deposited 
  var deposited = CONTAM.Units.Mass2Convert(Nano.Results.Mdep, Nano.Results.totalEmmission.select.selectedIndex, 0, Nano.Species);
  //deactivated 
  var deactivated = CONTAM.Units.Mass2Convert(Nano.Results.Mdeact, Nano.Results.totalEmmission.select.selectedIndex, 0, Nano.Species);
  //remained in zone 
  var remain = CONTAM.Units.Mass2Convert(Nano.Results.Mzone, Nano.Results.totalEmmission.select.selectedIndex, 0, Nano.Species);
  var fate_units = CONTAM.Units.Strings2.Mass2[Nano.Results.totalEmmission.select.selectedIndex];

  var fate_data_table = google.visualization.arrayToDataTable([
    ['Fate', 'Percent of Particles'],
    ['Exited Zone',    exited],
    ['Filtered',       filtered],
    ['Deposited',      deposited],
    ['Deactivated',    deactivated],
    ['Remain Airborne', remain]
  ]);

  //sources
  //burst
  var burst = CONTAM.Units.Mass2Convert(Nano.Results.burstEmmission.input.baseValue, Nano.Results.totalEmmission.select.selectedIndex, 0, Nano.Species);
  // continuous
  var continuous = CONTAM.Units.Mass2Convert(Nano.Results.continuousEmmission.input.baseValue, Nano.Results.totalEmmission.select.selectedIndex, 0, Nano.Species);
  // outdoor
  var outdoor = CONTAM.Units.Mass2Convert(Nano.Results.outdoorEmmission.input.baseValue, Nano.Results.totalEmmission.select.selectedIndex, 0, Nano.Species);
  var sources_units = CONTAM.Units.Strings2.Mass2[Nano.Results.totalEmmission.select.selectedIndex];
  var sources_data_table = google.visualization.arrayToDataTable([
    ['Source', sources_units],
    ['Continunous',  continuous],
    ['Burst',  burst],
    ['Outdoor',  outdoor],
  ]);
  
  //mass deposited
  // floor
  var floor = CONTAM.Units.Mass2Convert(Nano.Results.floorMassDeposited.input.baseValue, Nano.Results.floorMassDeposited.select.selectedIndex, 0, Nano.Species);
  
  // wall
  var wall = CONTAM.Units.Mass2Convert(Nano.Results.wallMassDeposited.input.baseValue, Nano.Results.floorMassDeposited.select.selectedIndex, 0, Nano.Species);
  
  // ceiling
  var ceiling = CONTAM.Units.Mass2Convert(Nano.Results.ceilingMassDeposited.input.baseValue, Nano.Results.floorMassDeposited.select.selectedIndex, 0, Nano.Species);
  
  // other
  var other = CONTAM.Units.Mass2Convert(Nano.Results.otherMassDeposited.input.baseValue, Nano.Results.floorMassDeposited.select.selectedIndex, 0, Nano.Species);
  
  var deposited_units = CONTAM.Units.Strings2.Mass2[Nano.Results.floorMassDeposited.select.selectedIndex];
  var deposited_data_table = google.visualization.arrayToDataTable([
    ['surface', deposited_units],
    ['Floor',  floor],
    ['Walls',  wall],
    ['Ceiling', ceiling],
    ['Other', other],
  ]);

  //mass filtered
  // outdoor
  var outdoor = CONTAM.Units.Mass2Convert(Nano.Results.oaFilterLoading.input.baseValue, Nano.Results.oaFilterLoading.select.selectedIndex, 0, Nano.Species);
  
  // recirc
  var recirc = CONTAM.Units.Mass2Convert(Nano.Results.recFilterLoading.input.baseValue, Nano.Results.recFilterLoading.select.selectedIndex, 0, Nano.Species);
  
  // air cleaner
  var air_cleaner = CONTAM.Units.Mass2Convert(Nano.Results.acFilterLoading.input.baseValue, Nano.Results.acFilterLoading.select.selectedIndex, 0, Nano.Species);
  
  //envelope
  var envelope = CONTAM.Units.Mass2Convert(Nano.Results.envFilterLoading.input.baseValue, Nano.Results.envFilterLoading.select.selectedIndex, 0, Nano.Species);

  var filtered_units = CONTAM.Units.Strings2.Mass2[Nano.Results.acFilterLoading.select.selectedIndex];
  var filtered_data_table = google.visualization.arrayToDataTable([
    ['filter', filtered_units],
    ['Outdoor Air',  outdoor],
    ['Recirculation',  recirc],
    ['Air Cleaner', air_cleaner],
    ['Envelope', envelope],
  ]);

  var air_options = {
    backgroundColor: '#F4F5F9',
    chartArea: {'width': '80%', 'height': '80%'},
    title: 'Airborne Concentration',
    vAxis: { format:'scientific'},
    vAxes: {
      // Adds titles to each axis.
      0: {title: concenYAxisTitle},
    },
    series: {
      1: { lineDashStyle: [2, 2] },
      2: { lineDashStyle: [3, 2], color: 'green' },
    },
    backgroundColor: {
      stroke: "#12659c",
      strokeWidth: 2,
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
    backgroundColor: {
      stroke: "#12659c",
      strokeWidth: 2,
    },
    legend: { position: 'bottom' }
  };

  var expos_options = {
    backgroundColor: '#F4F5F9',
    chartArea: {'width': '80%', 'height': '80%'},
    title: 'Airborne Exposure',
    vAxis: { format:'scientific'},
    vAxes: {
      // Adds titles to each axis.
      0: {title: exposureYAxisTitle1},
      1: {title: exposureYAxisTitle2}
    },
    series: {
      0: { lineDashStyle: [1, 0], targetAxisIndex: 0 },
      1: { lineDashStyle: [2, 2], targetAxisIndex: 0 },
      2: { lineDashStyle: [3, 2], targetAxisIndex: 1, color: 'green' }
    },
    backgroundColor: {
      stroke: "#12659c",
      strokeWidth: 2,
    },
    legend: { position: 'bottom' }
  };
  
  var fate_options = {
    title: 'Particle Fate (' + fate_units + ")",
    is3D: true,
    sliceVisibilityThreshold: 0,
    backgroundColor: {
      stroke: "#12659c",
      strokeWidth: 2,
    },
    tooltip: { text: 'percentage'  },
  };

  var sources_options = {
    title: 'Sources (' + sources_units + ")",
    is3D: true,
    sliceVisibilityThreshold: 0,
    backgroundColor: {
      stroke: "#12659c",
      strokeWidth: 2,
    },
    tooltip: { text: 'percentage'  },
  };

  var deposited_options = {
    title: 'Mass Deposited (' + deposited_units + ")",
    is3D: true,
    sliceVisibilityThreshold: 0,
    backgroundColor: {
      stroke: "#12659c",
      strokeWidth: 2,
    },
    tooltip: { text: 'percentage'  },
  };

  var filtered_options = {
    title: 'Mass Filtered (' + filtered_units + ")",
    is3D: true,
    sliceVisibilityThreshold: 0,
    backgroundColor: {
      stroke: "#12659c",
      strokeWidth: 2,
    },
    tooltip: { text: 'percentage'  },
  };

  //free previous chart data
  if (Nano.Results.air_chart) {
    Nano.Results.air_chart.clearChart();
  }
  if (Nano.Results.surf_chart) {
    Nano.Results.surf_chart.clearChart();
  }
  if (Nano.Results.expos_chart) {
    Nano.Results.expos_chart.clearChart();
  }
  if (Nano.Results.fate_chart) {
    Nano.Results.fate_chart.clearChart();
  }
  if (Nano.Results.air_chart) {
    Nano.Results.air_chart.clearChart();
  }
  if (Nano.Results.sources_chart) {
    Nano.Results.sources_chart.clearChart();
  }
  if (Nano.Results.filtered_chart) {
    Nano.Results.filtered_chart.clearChart();
  }

  Nano.Results.air_chart = new google.visualization.LineChart(document.getElementById("air_concen_chart"));
  Nano.Results.surf_chart = new google.visualization.LineChart(document.getElementById("surf_concen_chart"));
  Nano.Results.expos_chart = new google.visualization.LineChart(document.getElementById("expos_chart"));
  Nano.Results.fate_chart =  new google.visualization.PieChart(document.getElementById("fate_chart"));
  Nano.Results.sources_chart =  new google.visualization.PieChart(document.getElementById("sources_chart"));
  Nano.Results.deposited_chart =  new google.visualization.PieChart(document.getElementById("deposited_chart"));
  Nano.Results.filtered_chart =  new google.visualization.PieChart(document.getElementById("filtered_chart"));

  // listen for ready from last chart
  google.visualization.events.addListener(Nano.Results.filtered_chart, 'ready', Nano.chartsReady);

  //console.log("draw call");
  Nano.Results.air_chart.draw(air_data_table, air_options);
  Nano.Results.surf_chart.draw(surf_data_table, surf_options);
  Nano.Results.expos_chart.draw(expos_data_table, expos_options);
  Nano.Results.fate_chart.draw(fate_data_table, fate_options);
  Nano.Results.sources_chart.draw(sources_data_table, sources_options);
  Nano.Results.deposited_chart.draw(deposited_data_table, deposited_options);
  Nano.Results.filtered_chart.draw(filtered_data_table, filtered_options);
}

Nano.chartsReady = function(){
  //alert("charts ready");
  Nano.createCSVSaveLink(Nano.writeReport());
  Nano.resultsSection.style.maxHeight = Nano.resultsSectionHeight + "px";
}

Nano.changeBurstSrc = function()
{
  Nano.Inputs.brstType.disabled = Nano.Inputs.brstSrcState.selectedIndex == 1;
  Nano.Inputs.ReleaseAmount.input.disabled = Nano.Inputs.brstSrcState.selectedIndex == 1;
  Nano.Inputs.ReleaseAmount.select.disabled = Nano.Inputs.brstSrcState.selectedIndex == 1;
  Nano.Inputs.BrstSourceStartTime.disabled = Nano.Inputs.brstSrcState.selectedIndex == 1;
  Nano.Inputs.BrstSourceEndTime.disabled = Nano.Inputs.brstSrcState.selectedIndex == 1 || Nano.Inputs.brstType.selectedIndex == 0;
  Nano.Inputs.RepeatInterval.disabled = Nano.Inputs.brstSrcState.selectedIndex == 1 || Nano.Inputs.brstType.selectedIndex == 0;
}

Nano.changeConstSrc = function()
{
  Nano.Inputs.ReleaseRate.input.disabled = Nano.Inputs.constSrcState.selectedIndex == 1;
  Nano.Inputs.ReleaseRate.select.disabled = Nano.Inputs.constSrcState.selectedIndex == 1;
  Nano.Inputs.ConstSourceStartTime.disabled = Nano.Inputs.constSrcState.selectedIndex == 1;
  Nano.Inputs.ConstSourceEndTime.disabled = Nano.Inputs.constSrcState.selectedIndex == 1;
}

Nano.changeOccType = function()
{
  Nano.Inputs.occupantInterval.disabled = Nano.Inputs.occType.selectedIndex == 0;
  Nano.Inputs.occupantDuration.disabled = Nano.Inputs.occType.selectedIndex == 0;
}

Nano.changeBurstType = function()
{
  Nano.Inputs.BrstSourceEndTime.disabled = Nano.Inputs.brstType.selectedIndex == 0;
  Nano.Inputs.RepeatInterval.disabled = Nano.Inputs.brstType.selectedIndex == 0;
}

Nano.UpdateDecay = function()
{
  var halfLife = Nano.Inputs.PHalfLife.input.baseValue; // s
  var newDecayRate;
  if(isNaN(halfLife) || halfLife <= 0)
    newDecayRate = NaN
  else
    newDecayRate = -1*Math.log(0.5)/halfLife; // 1/s
  Nano.Inputs.PDecayRate.input.baseValue = newDecayRate;
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

Nano.disableScroll = function(){

  var inputsWithoutSpinButtons = document.querySelectorAll(".no-spinners");
  for (const input of inputsWithoutSpinButtons) {
    input.addEventListener("wheel", function(e){ this.blur()});

  }
}

Nano.hideResults = function(){
  Nano.inputsSection.style.maxHeight = Nano.inputsSectionHeight + "px";
  Nano.resultsSection.style.maxHeight = "0px";
  Nano.goBackButton.style.display = "none";
  Nano.simStatusSpan.textContent = "";  
  document.getElementById("reportLabel").style.display = "none";
  document.getElementById("projectFileLabel").style.display = "none";

  while (Nano.downloadLinksSpan.firstChild) {
    Nano.downloadLinksSpan.removeChild(Nano.downloadLinksSpan.firstChild);
  }
  while (Nano.downloadCSVSpan.firstChild) {
    Nano.downloadCSVSpan.removeChild(Nano.downloadCSVSpan.firstChild);
  }
}

Nano.writeReport = function(){

  // entries is an array of data
  //put a delimiter bewteen the entries and an end of line at the end
  function addDelimiters(entries, delimiter) {
    let result = "";
    entries.forEach(function(entry) {
        result += entry + delimiter;
    });
    return result;
  };

  // entries is an array of arrays of data
  // use the addDelimiters function on each of the sub arrays
  function AddLinesAndDelimiters(entries, delimiter) {
    let result = "";
    entries.forEach(function(entry){
        result += addDelimiters(entry, delimiter);
        result += "\n";
    });
    return result;
  };

  let report = [];
  report.push(["\ufeffInputs"]);

  report.push([]);
  report.push(["Zone Geometry"]);
  report.push([
    '',
    `Zone Volume (${Nano.Inputs.Volume.select.options[Nano.Inputs.Volume.select.selectedIndex].textContent})`,
    `Floor Area (${Nano.Inputs.FloorArea.select.options[Nano.Inputs.FloorArea.select.selectedIndex].textContent} )`,
    `Wall Area (${Nano.Inputs.WallArea.select.options[Nano.Inputs.WallArea.select.selectedIndex].textContent})`,
    `Ceiling Area (${Nano.Inputs.CeilingArea.select.options[Nano.Inputs.CeilingArea.select.selectedIndex].textContent})`,
    `Other Surface Area (${Nano.Inputs.OtherSurfaceArea.select.options[Nano.Inputs.OtherSurfaceArea.select.selectedIndex].textContent})`,
    `Surface Volume Ratio`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.Volume.input.valueAsNumber}`,
    `${Nano.Inputs.FloorArea.input.valueAsNumber}`,
    `${Nano.Inputs.WallArea.input.valueAsNumber}`,
    `${Nano.Inputs.CeilingArea.input.valueAsNumber}`,
    `${Nano.Inputs.OtherSurfaceArea.input.valueAsNumber}`,
    `${Nano.Inputs.SurfaceVolumeRatio.valueAsNumber}`,
  ]);

  report.push(["Infiltration"]);
  report.push([
    '',
    'Infiltration 1/h',
    'Penetration Factor'
  ]);
  report.push([
    '',
    `${Nano.Inputs.Infiltration.valueAsNumber}`,
    `${Nano.Inputs.PFactor.valueAsNumber}`
  ]);

  report.push(["Ventilation System"]);
  report.push([
    '',
    `Supply Airflow Rate (${Nano.Inputs.SupplyRate.select.options[Nano.Inputs.SupplyRate.select.selectedIndex].textContent})`,
    `Outdoor Air Intake Fraction`,
    `Return Airflow Rate (${Nano.Inputs.ReturnRate.select.options[Nano.Inputs.ReturnRate.select.selectedIndex].textContent})`,
    `Local Exhaust Airflow Rate (${Nano.Inputs.ExhaustRate.select.options[Nano.Inputs.ExhaustRate.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.SupplyRate.input.valueAsNumber}`,
    `${Nano.Inputs.OAIntakeFrac.valueAsNumber}`,
    `${Nano.Inputs.ReturnRate.input.valueAsNumber}`,
    `${Nano.Inputs.ExhaustRate.input.valueAsNumber}`,
  ]);

  report.push(["System Filters"]);
  report.push([
    '',
    'Outdoor Air Filter',
    'Recirculation Air Filter',
  ]);
  report.push([
    '',
    `${Nano.Inputs.OAFilter.value}`,
    `${Nano.Inputs.RecirFilter.value}`,
  ]);

  report.push(["Calculated Airflows"]);
  report.push([
    '',
    `Total Outdoor Air Change Rate (${Nano.Inputs.Ach.select.options[Nano.Inputs.Ach.select.selectedIndex].textContent})`,
    `Outdoor Air Intake Rate (${Nano.Inputs.Qoa.select.options[Nano.Inputs.Qoa.select.selectedIndex].textContent})`,
    `Recirculation Airflow Rate (${Nano.Inputs.Qrec.select.options[Nano.Inputs.Qrec.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.Ach.input.valueAsNumber}`,
    `${Nano.Inputs.Qoa.input.valueAsNumber}`,
    `${Nano.Inputs.Qrec.input.valueAsNumber}`,
  ]);

  report.push(["Room Air Cleaner"]);
  report.push([
    '',
    `Maximum Airflow Rate (${Nano.Inputs.AirCleanerFlowRate.select.options[Nano.Inputs.AirCleanerFlowRate.select.selectedIndex].textContent})`,
    `Fan Flow Fraction`,
    `Filter Efficiency`,
    `CADR (${Nano.Inputs.AirCleanerCADR.select.options[Nano.Inputs.AirCleanerCADR.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.AirCleanerFlowRate.input.valueAsNumber}`,
    `${Nano.Inputs.AirCleanerFlowFrac.valueAsNumber}`,
    `${Nano.Inputs.AirCleanerEff.valueAsNumber}`,
    `${Nano.Inputs.AirCleanerCADR.input.valueAsNumber}`,
  ]);

  report.push(["Particle Properties"]);
  report.push([
    '',
    `Name`,
    `Diameter (${Nano.Inputs.PDiam.select.options[Nano.Inputs.PDiam.select.selectedIndex].textContent})`,
    `Density (${Nano.Inputs.PDensity.select.options[Nano.Inputs.PDensity.select.selectedIndex].textContent})`,
    `Particle Deactivation`,
    `Half-life (${Nano.Inputs.PHalfLife.select.options[Nano.Inputs.PHalfLife.select.selectedIndex].textContent})`,
    `Decay Rate (${Nano.Inputs.PDecayRate.select.options[Nano.Inputs.PDecayRate.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.PName.value}`,
    `${Nano.Inputs.PDiam.input.valueAsNumber}`,
    `${Nano.Inputs.PDensity.input.valueAsNumber}`,
    `${Nano.Inputs.PDecays.value}`,
    `${Nano.Inputs.PHalfLife.input.valueAsNumber}`,
    `${Nano.Inputs.PDecayRate.input.valueAsNumber}`,
  ]);

  report.push(["Continuous Source"]);
  report.push([
    '',
    `Source`,
    `Generation Rate (${Nano.Inputs.ReleaseRate.select.options[Nano.Inputs.ReleaseRate.select.selectedIndex].textContent})`,
    `Generation Time Period (Start)`,
    `Generation Time Period (End)`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.constSrcState.value}`,
    `${Nano.Inputs.ReleaseRate.input.valueAsNumber}`,
    `${Nano.Inputs.ConstSourceStartTime.value}`,
    `${Nano.Inputs.ConstSourceEndTime.value}`,
  ]);

  report.push(["Burst Source"]);
  report.push([
    '',
    `Source`,
    `Burst Type`,
    `Amount per Burst (${Nano.Inputs.ReleaseAmount.select.options[Nano.Inputs.ReleaseAmount.select.selectedIndex].textContent})`,
    `Generation Time Period (Start)`,
    `Generation Time Period (End)`,
    `Burst Interval (min)`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.brstSrcState.value}`,
    `${Nano.Inputs.brstType.value}`,
    `${Nano.Inputs.ReleaseAmount.input.valueAsNumber}`,
    `${Nano.Inputs.BrstSourceStartTime.value}`,
    `${Nano.Inputs.BrstSourceEndTime.value}`,
    `${Nano.Inputs.RepeatInterval.valueAsNumber}`,
  ]);

  report.push(["Particle Deposition Velocities"]);
  report.push([
    '',
    `Floor (${Nano.Inputs.FloorDV.select.options[Nano.Inputs.FloorDV.select.selectedIndex].textContent})`,
    `Wall (${Nano.Inputs.WallDV.select.options[Nano.Inputs.WallDV.select.selectedIndex].textContent})`,
    `Ceiling (${Nano.Inputs.CeilingDV.select.options[Nano.Inputs.CeilingDV.select.selectedIndex].textContent})`,
    `Other Surface (${Nano.Inputs.OtherSurfaceDV.select.options[Nano.Inputs.OtherSurfaceDV.select.selectedIndex].textContent})`,
    `Effective Deposition Rate (${Nano.Inputs.DepositionRateCalc.select.options[Nano.Inputs.DepositionRateCalc.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.FloorDV.input.valueAsNumber}`,
    `${Nano.Inputs.WallDV.input.valueAsNumber}`,
    `${Nano.Inputs.CeilingDV.input.valueAsNumber}`,
    `${Nano.Inputs.OtherSurfaceDV.input.valueAsNumber}`,
    `${Nano.Inputs.DepositionRateCalc.input.valueAsNumber}`,
  ]);

  report.push(["Initial Concentrations"]);
  report.push([
    '',
    `Outdoor Air (${Nano.Inputs.OutdoorConcen.select.options[Nano.Inputs.OutdoorConcen.select.selectedIndex].textContent})`,
    `Zone Air (${Nano.Inputs.InitZoneConcen.select.options[Nano.Inputs.InitZoneConcen.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.OutdoorConcen.input.valueAsNumber}`,
    `${Nano.Inputs.InitZoneConcen.input.valueAsNumber}`,
  ]);

  report.push(["Occupant Exposure"]);
  report.push([
    '',
    `Occupancy Time Period (Start)`,
    `Occupancy Time Period (End)`,
    `Occupancy Type`,
    `Intermittent Occupancy Interval (min)`,
    `Intermittent Occupancy Duration (min)`,
  ]);
  report.push([
    '',
    `${Nano.Inputs.ExposStartTime.value}`,
    `${Nano.Inputs.ExposEndTime.value}`,
    `${Nano.Inputs.occType.value}`,
    `${Nano.Inputs.occupantInterval.valueAsNumber}`,
    `${Nano.Inputs.occupantDuration.valueAsNumber}`,
  ]);
  report.push([]);
  report.push(["Results"]);

  report.push([]);
  report.push(["Sources"]);
  report.push([
    '',
    `Continuous (${Nano.Results.continuousEmmission.select.options[Nano.Results.continuousEmmission.select.selectedIndex].textContent})`,
    `Burst (${Nano.Results.burstEmmission.select.options[Nano.Results.burstEmmission.select.selectedIndex].textContent})`,
    `Outdoor (${Nano.Results.outdoorEmmission.select.options[Nano.Results.outdoorEmmission.select.selectedIndex].textContent})`,
    `Total (${Nano.Results.totalEmmission.select.options[Nano.Results.totalEmmission.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Results.continuousEmmission.input.valueAsNumber}`,
    `${Nano.Results.burstEmmission.input.valueAsNumber}`,
    `${Nano.Results.outdoorEmmission.input.valueAsNumber}`,
    `${Nano.Results.totalEmmission.input.valueAsNumber}`,
  ]);

  report.push(["Airborne Concentration"]);
  report.push([
    '',
    `${document.getElementById('averageConcOccResultDiv').textContent} (${Nano.Results.averageConcOcc.select.options[Nano.Results.averageConcOcc.select.selectedIndex].textContent})`,
    `Average (24 h) (${Nano.Results.averageDailyExposureResult.select.options[Nano.Results.averageDailyExposureResult.select.selectedIndex].textContent})`,
    `Maximum (24 h) (${Nano.Results.maximumConc.select.options[Nano.Results.maximumConc.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Results.averageConcOcc.input.valueAsNumber}`,
    `${Nano.Results.averageDailyExposureResult.input.valueAsNumber}`,
    `${Nano.Results.maximumConc.input.valueAsNumber}`,
  ]);

  report.push(["Airborne Exposure"]);
  report.push([
    '',
    `${document.getElementById('averageExposureDiv').textContent} (${Nano.Results.averageExposureResult.select.options[Nano.Results.averageExposureResult.select.selectedIndex].textContent})`,
    `${document.getElementById('maxExposureDiv').textContent} (${Nano.Results.maximumConcExpos.select.options[Nano.Results.maximumConcExpos.select.selectedIndex].textContent})`,
    `Integrated Exposure (${Nano.Results.IntegratedExposure.select.options[Nano.Results.IntegratedExposure.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Results.averageExposureResult.input.valueAsNumber}`,
    `${Nano.Results.maximumConcExpos.input.valueAsNumber}`,
    `${Nano.Results.IntegratedExposure.input.valueAsNumber}`,
  ]);

  report.push(["Surface Loading"]);
  report.push([
    '',
    `Floor (${Nano.Results.floorSurfaceLoading.select.options[Nano.Results.floorSurfaceLoading.select.selectedIndex].textContent})`,
    `Wall (${Nano.Results.wallSurfaceLoading.select.options[Nano.Results.wallSurfaceLoading.select.selectedIndex].textContent})`,
    `Ceiling (${Nano.Results.ceilingSurfaceLoading.select.options[Nano.Results.ceilingSurfaceLoading.select.selectedIndex].textContent})`,
    `Other (${Nano.Results.otherSurfaceLoading.select.options[Nano.Results.otherSurfaceLoading.select.selectedIndex].textContent})`,
    `Total (${Nano.Results.totalSurfaceLoading.select.options[Nano.Results.totalSurfaceLoading.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Results.floorSurfaceLoading.input.valueAsNumber}`,
    `${Nano.Results.wallSurfaceLoading.input.valueAsNumber}`,
    `${Nano.Results.ceilingSurfaceLoading.input.valueAsNumber}`,
    `${Nano.Results.otherSurfaceLoading.input.valueAsNumber}`,
    `${Nano.Results.totalSurfaceLoading.input.valueAsNumber}`,
  ]);

  report.push(["Deposited"]);
  report.push([
    '',
    `Floor (${Nano.Results.floorMassDeposited.select.options[Nano.Results.floorMassDeposited.select.selectedIndex].textContent})`,
    `Walls (${Nano.Results.wallMassDeposited.select.options[Nano.Results.wallMassDeposited.select.selectedIndex].textContent})`,
    `Ceiling (${Nano.Results.ceilingMassDeposited.select.options[Nano.Results.ceilingMassDeposited.select.selectedIndex].textContent})`,
    `Other (${Nano.Results.otherMassDeposited.select.options[Nano.Results.otherMassDeposited.select.selectedIndex].textContent})`,
    `Total (${Nano.Results.totalMassDeposited.select.options[Nano.Results.totalMassDeposited.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Results.floorMassDeposited.input.valueAsNumber}`,
    `${Nano.Results.wallMassDeposited.input.valueAsNumber}`,
    `${Nano.Results.ceilingMassDeposited.input.valueAsNumber}`,
    `${Nano.Results.otherMassDeposited.input.valueAsNumber}`,
    `${Nano.Results.totalMassDeposited.input.valueAsNumber}`,
  ]);

  report.push(["Filtered"]);
  report.push([
    '',
    `Outdoor Air (${Nano.Results.oaFilterLoading.select.options[Nano.Results.oaFilterLoading.select.selectedIndex].textContent})`,
    `Recirculation (${Nano.Results.recFilterLoading.select.options[Nano.Results.recFilterLoading.select.selectedIndex].textContent})`,
    `AirCleaner (${Nano.Results.acFilterLoading.select.options[Nano.Results.acFilterLoading.select.selectedIndex].textContent})`,
    `Total (${Nano.Results.totalFilterLoading.select.options[Nano.Results.totalFilterLoading.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Results.oaFilterLoading.input.valueAsNumber}`,
    `${Nano.Results.recFilterLoading.input.valueAsNumber}`,
    `${Nano.Results.acFilterLoading.input.valueAsNumber}`,
    `${Nano.Results.totalFilterLoading.input.valueAsNumber}`,
  ]);

  report.push(["Other"]);
  report.push([
    '',
    `Deactivated (${Nano.Results.massDeactivated.select.options[Nano.Results.massDeactivated.select.selectedIndex].textContent})`,
    `Exited Zone (${Nano.Results.massExited.select.options[Nano.Results.massExited.select.selectedIndex].textContent})`,
    `Remining in Zone (${Nano.Results.massRemaining.select.options[Nano.Results.massRemaining.select.selectedIndex].textContent})`,
  ]);
  report.push([
    '',
    `${Nano.Results.massDeactivated.input.valueAsNumber}`,
    `${Nano.Results.massExited.input.valueAsNumber}`,
    `${Nano.Results.massRemaining.input.valueAsNumber}`,
  ]);

  report.push([]);
  report.push(["Airborne Concentration", "", "", "", "", "Airborne Exposure", "", "", "", "", "Surface Loading"]);
  report.push([
    'Time',
    `Zone (${Nano.Results.averageExposureResult.select.options[Nano.Results.averageExposureResult.select.selectedIndex].textContent})`,
    `Average (24 h) (${Nano.Results.averageExposureResult.select.options[Nano.Results.averageExposureResult.select.selectedIndex].textContent})`,
    `${document.getElementById('averageConcOccResultDiv').textContent} (${Nano.Results.averageExposureResult.select.options[Nano.Results.averageExposureResult.select.selectedIndex].textContent})`,
    '',
    'Time',
    `'Occupant (${Nano.Results.averageExposureResult.select.options[Nano.Results.averageExposureResult.select.selectedIndex].textContent})`,
    `${document.getElementById('averageExposureDiv').textContent} (${Nano.Results.averageExposureResult.select.options[Nano.Results.averageExposureResult.select.selectedIndex].textContent})`,
    `'Integrated Exposure (${Nano.Results.IntegratedExposure.select.options[Nano.Results.IntegratedExposure.select.selectedIndex].textContent})`,
    '',
    'Time',
    `Total (${Nano.Results.totalSurfaceLoading.select.options[Nano.Results.totalSurfaceLoading.select.selectedIndex].textContent})`,
    `Floor (${Nano.Results.totalSurfaceLoading.select.options[Nano.Results.totalSurfaceLoading.select.selectedIndex].textContent})`,
    `Wall (${Nano.Results.totalSurfaceLoading.select.options[Nano.Results.totalSurfaceLoading.select.selectedIndex].textContent})`,
    `Ceiling (${Nano.Results.totalSurfaceLoading.select.options[Nano.Results.totalSurfaceLoading.select.selectedIndex].textContent})`,
    `Other (${Nano.Results.totalSurfaceLoading.select.options[Nano.Results.totalSurfaceLoading.select.selectedIndex].textContent})`,
  ]);
  let line;
  for(let i=0; i<Nano.Results.ctrlLogResult.concendata.length; ++i)
  {
    line = [];
    var chart_time = Nano.Results.ctrlLogResult.concendata[i][0];
    var seconds = Nano.ConvertChartTime(chart_time);
    line.push(CONTAM.TimeUtilities.IntTimeToStringTime(seconds));
    var basevalue = Nano.Results.ctrlLogResult.concendata[i][1];
    var uservalue = CONTAM.Units.PartConcenConvert(
      basevalue, Nano.Results.averageExposureResult.select.selectedIndex, 0, Nano.Species);
    line.push(uservalue);
    line.push(Nano.Results.AverageExposure24Units);
    if(seconds >= Nano.StartExposureTime && seconds <= Nano.EndExposureTime){
      line.push(Nano.Results.AverageConcOccUserUnits);
    }else{
      line.push("0");
    }
    line.push("");
    var chart_time = Nano.Results.ctrlLogResult.concendata[i][0];
    var seconds = Nano.ConvertChartTime(chart_time);
    line.push(CONTAM.TimeUtilities.IntTimeToStringTime(seconds));
    basevalue = Nano.Results.ctrlLogResult.exposuredata[i][1];
    uservalue = CONTAM.Units.PartConcenConvert(
      basevalue, Nano.Results.averageExposureResult.select.selectedIndex, 0, Nano.Species);
    line.push(uservalue);
    if(seconds >= Nano.StartExposureTime && seconds <= Nano.EndExposureTime){
      line.push(Nano.Results.AverageExposureUserUnits);
    } else {
      line.push("0");
    }
    basevalue = Nano.Results.ctrlLogResult.exposuredata[i][2];
    uservalue = CONTAM.Units.IntegratedConcenConvert(
      basevalue, Nano.Results.IntegratedExposure.select.selectedIndex, 0, Nano.Species);
    line.push(uservalue);
    line.push("");
    var chart_time = Nano.Results.ctrlLogResult.concendata[i][0];
    var seconds = Nano.ConvertChartTime(chart_time);
    line.push(CONTAM.TimeUtilities.IntTimeToStringTime(seconds));
    // add total value
    var totalValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][1], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    line.push(totalValue);
    
    // add floor value
    var floorValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][2], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    line.push(floorValue);
        
    // add wall value
    var wallValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][3], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    line.push(wallValue);
    
    // add ceiling value
    var ceilingValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][4], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    line.push(ceilingValue);
    
    // add other value
    var otherValue = CONTAM.Units.ConcnSurfConvert(
      Nano.surfaceDataBaseUnits[i][5], Nano.Results.totalSurfaceLoading.select.selectedIndex, 0, Nano.Species);
    line.push(otherValue);

    report.push(line);
  }

  let fullReport = AddLinesAndDelimiters(report, ",");
  return fullReport;
}

Nano.createCSVSaveLink = function(csvText)
{
  while (Nano.downloadCSVSpan.firstChild) {
      Nano.downloadCSVSpan.removeChild(Nano.downloadCSVSpan.firstChild);
  }

  var saveSpan = document.createElement("span");
  var savelink = document.createElement("a");
  var filename = "fatima.csv"
  var prjBlob = new Blob([csvText], {type:'text/plain'})

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
    if(Nano.Results.saveReportLink){
      window.URL.revokeObjectURL(Nano.Results.saveReportLink);
    }
    Nano.Results.saveReportLink = window.URL.createObjectURL(prjBlob);
    savelink.href = Nano.Results.saveReportLink
  }
  savelink.textContent = "Download CSV Report";
  savelink.className = "blacklink";
  saveSpan.appendChild(savelink);
  Nano.downloadCSVSpan.appendChild(saveSpan);
}