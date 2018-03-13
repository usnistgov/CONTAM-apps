var CREUI = {};
CREUI.options = {}; // this gets passed to the worker thread when going to do processing
CREUI.options.normalExport = {};   //holds things related to normal sim file export
CREUI.options.averageExport = {};  //holds things related to average sim file export
CREUI.options.exposureExport = {}; //holds things related to exposure file export
CREUI.options.ACHExport = {};      //holds things related to ACH file export
CREUI.showingProgressPage = false;
CREUI.achExportPage = "ach_export.html";
CREUI.selectFilesPage = "select_files.htm";
CREUI.selectSectionsPage = "select_sections.htm";
CREUI.avgOptionsPage = "avg_options.htm";
CREUI.expOptionsPage = "expos_options.htm";
CREUI.progressPage = "progress.htm";
CREUI.saveFilesPage = "save_files.htm";
CREUI.selectNodesPage = "select_nodes.htm";
CREUI.selectLinksPage = "select_links.htm";
CREUI.ctmOptionsPage = "ctm_options.htm";
CREUI.envOptionsPage = "env_options.htm";
CREUI.linkOptionsPage = "link_options.htm";
CREUI.selectTimePage = "select_time_1.htm";

window.onload = function()
{
  //initialize contam worker
  //these paths are relative to the worker's path
  var workerFileURLs = ["../contam_results_exporter/contam_re_1.js", 
    "../contam_results_exporter/normal_export_6.js",
    "../contam_results_exporter/average_export_5.js",
    "../contam_results_exporter/exposure_export_3.js",
    "../contam_results_exporter/ep_infil_export_1.js",
    "../contam_results_exporter/ach_export.js",
    "../jszip/jszip.js"];
  CWD.Init(new Worker("../contam/contam_worker_2.js"));
  CWD.SetOnMessageFunction(CREUI.onWorkerMessage);
  CWD.LoadURLsOnWorker(workerFileURLs).catch(function(error)
  {
    alert(error.message);
  });
}

CREUI.onWorkerMessage = function(oEvent)
{
  var data = oEvent.data;
  
  if(data.cmd == "progressUpdate" && CREUI.showingProgressPage)
  {
    var iframe = document.getElementById('dialogframe');    
    iframe.contentWindow.SetDateTime(data.date, data.time);
  }
}

CREUI.finishStep1 = function()
{
  var normalExport = document.getElementById("normal");
  var averageExport = document.getElementById("averages");
  var exposureExport = document.getElementById("exposure");
  var achExport = document.getElementById("ach");
  var eplusExport = document.getElementById("EPlus");
  
  CREUI.options.doNormalExport = normalExport.checked;
  CREUI.options.doAverageExport = averageExport.checked;
  CREUI.options.doExposureExport = exposureExport.checked;
  CREUI.options.doACHExport = achExport.checked;
  CREUI.options.doEnergyPlusInfilExport = eplusExport.checked;

  if(CREUI.options.doACHExport)
    CREUI.OpenDialog(CREUI.achExportPage, CREUI.ACHExport, 
      "EnergyPlus Whole Building ACH Export  - Options");
  else
  {
    var title;
    if(CREUI.options.doNormalExport)
      title = "Export .sim file - Select Input Files";
    else if(CREUI.options.doAverageExport)
      title = "Average Concentration Export - Select Input Files";
    else if(CREUI.options.doExposureExport)
      title = "Process exposure results - Select Input Files";
    else if(CREUI.options.doEnergyPlusInfilExport)
      title = "EnergyPlus Zone Specific ACH Export - Select Input Files";
      
    CREUI.OpenDialog(CREUI.selectFilesPage, CREUI.selectFiles, title);
  }
}

CREUI.ACHExport = function(dialogresult)
{
  if(dialogresult)
  {
    CWD.CallContamFunction("CIT.ProcessACHFile", [CREUI.options.ACHExport]).then(
      function(result)
      {
        var periodIndex = CREUI.options.ACHExport.achFile.name.lastIndexOf(".");
        var filename = CREUI.options.ACHExport.achFile.name.substring(0, periodIndex);
        var zipName = filename + " ACH Export.zip";
        var zipFile = {name:zipName, linktext:"Save zip file with ACH export files", blob:result};
        CREUI.saveFiles([zipFile]);
      },
      function(error)
      {
        alert(error.message);
      }
    );
  }
}

CREUI.selectFiles = function(dialogresult)
{
  if(dialogresult)
  {
    CREUI.options.prjFileName = CREUI.options.prjfile.name;
    CWD.CallContamFunction("CONTAM.Project.openProject",
      [CREUI.options.prjfile]).then(function(result)
    {
      CREUI.onOpenProject();
    },
    function(error)
    {
      alert(error.message);
    });
  }
}

CREUI.onOpenProject = function()
{
  if(CREUI.options.doNormalExport)
  {
    CWD.CallContamFunction("CONTAM.Simread.SetSimFile",
      [CREUI.options.simfile]).then(function(result)
    {
      CREUI.OpenDialog(CREUI.selectSectionsPage, 
        CREUI.finishSelectSections, "Export .sim file - Output Options");
    },
    function(error)
    {
      alert(error.message);
    });
  }
  else if(CREUI.options.doAverageExport)
  {
    CWD.CallContamFunction("CONTAM.Simread.SetSimFile",
      [CREUI.options.simfile]).then(function(result)
    {
      //check if ctm results are avialable
      CWD.GetContamVariable("CONTAM.Simread.zcres").then(function(zcres)
      { 
        if(!zcres)
        {
          alert("Contaminant results are not available in this sim file.");
          return;
        }
        CREUI.OpenDialog(CREUI.avgOptionsPage, CREUI.finishAvgOptions, 
          "Average Concentration Export - Options");
      });
    },
    function(error)
    {
      alert(error.message);
    });
  }
  else if(CREUI.options.doExposureExport)
  { // do exposure export
    CWD.CallContamFunction("ContamRE.exposureExport.ReadExpFile",
      [CREUI.options.expfile]).then(function(result)
    {
      var varArray = ["ContamRE.exposureExport.dtres0",
        "ContamRE.exposureExport.dtres1",
        "ContamRE.exposureExport.tmres0",
        "ContamRE.exposureExport.tmres1",
        "ContamRE.exposureExport.TimeStep"];
      CWD.GetArrayOfContamVariables(varArray).then(function(result)
      {
        CREUI.options.exposureExport.dtres0 = result.dtres0;
        CREUI.options.exposureExport.dtres1 = result.dtres1;
        CREUI.options.exposureExport.tmres0 = result.tmres0;
        CREUI.options.exposureExport.tmres1 = result.tmres1;
        CREUI.options.exposureExport.TimeStep = result.TimeStep;
        CREUI.OpenDialog(CREUI.expOptionsPage, CREUI.finishExpOptions, 
          "Process exposure results - Options");
      });
    });
  }
  else if(CREUI.options.doEnergyPlusInfilExport)
  {
    CREUI.OpenDialog(CREUI.progressPage, undefined, 
      "EnergyPlus Zone Specific ACH Export - Progress");
    CREUI.showingProgressPage = true;
    CWD.CallContamFunction("CONTAM.Simread.SetSimFile",
      [CREUI.options.simfile]).then(function(result)
    {
      CWD.CallContamFunction("ContamRE.EPInfilExport.ExportInfil").then(function(result)
      {
        CREUI.showingProgressPage = false;
        CREUI.CloseDialog(false);
        var periodIndex = CREUI.options.prjFileName.lastIndexOf(".");
        var filename = CREUI.options.prjFileName.substring(0, periodIndex);
        var zipName = filename + " EnergyPlus Export.zip";
        var zipFile = {name:zipName, linktext:"Save zip file with EnergyPlus Export files", blob:result};
        CREUI.saveFiles([zipFile]);
      });
    },
    function(error)
    {
      alert(error.message);
    });
  }
}

CREUI.finishTime = function(dialogresult)
{
  if(dialogresult)
  {
    if(CREUI.options.doNormalExport)
      CWD.CallContamFunction("ContamRE.normalExport.doNormalExport",
      [CREUI.options]).then(function(result)
      {
        CREUI.saveFiles(result);
      });
    else if(CREUI.options.doAverageExport)
      CWD.CallContamFunction("ContamRE.averageExport.doAverageExport",
      [CREUI.options]).then(function(result)
      {
        CREUI.saveFiles(result);
      });
  }
}

// files: an array of objects with three members:
//   name - the name of the file
//   blob - the contents of the file in a blob
//   linktext - the text to use for the like to save
CREUI.saveFiles = function(files)
{
  CREUI.saveFilesData = files;
  var title;
  if(CREUI.options.doNormalExport)
    title = "Export .sim file - Save Files";
  else if(CREUI.options.doAverageExport)
    title = "Average Concentration Export - Save Files";
  else if(CREUI.options.doExposureExport)
    title = "Process exposure results - Save Files";
  else if(CREUI.options.doEnergyPlusInfilExport)
    title = "EnergyPlus Zone Specific ACH Export - Save Files";
  else if(CREUI.options.doACHExport)
    title = "EnergyPlus Whole Building ACH Export - Save Files";
  CREUI.OpenDialog(CREUI.saveFilesPage, null, title);
}

CREUI.OpenDialog = function (url, callback, dialogtitle)
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

CREUI.CloseDialog = function (dialogResult)
{
  document.getElementById('dialogcontainer').style.display = 'none';

  if (this.dialogcallback)
    this.dialogcallback(dialogResult);
}

  // Return an array of the selected option values
  // select is an HTML select element
CREUI.getSelectValues = function(select) 
{
  var result = [];
  var opt;

  for (var i=0; i<select.options.length; i++) 
  {
    opt = select.options[i];

    if (opt.selected) 
    {
      result.push(opt.value);
    }
  }
  return result;
}  

CREUI.finishSelectSections = function(dialogresult)
{
  if(dialogresult)
  {
    if(CREUI.options.normalExport.exportCtms)
    {
      CREUI.options.normalExport.doCtmNodes = true;
      CREUI.OpenDialog(CREUI.selectNodesPage, CREUI.finishSelectCtmNodes, 
        "Export .sim file - Contaminant Options");
    }
    else if(CREUI.options.normalExport.exportEnv)
    {
      CREUI.options.normalExport.doEnvNodes = true;
      CREUI.OpenDialog(CREUI.selectNodesPage, CREUI.finishSelectEnvNodes, 
        "Export .sim file - Environmental Options");
    }
    else if(CREUI.options.normalExport.exportAF)
    {
      CREUI.OpenDialog(CREUI.selectLinksPage, CREUI.finishSelectLinks, 
        "Export .sim file - Airflow Path Options");
    }
    else
    {
      //export only xrf file
      CWD.CallContamFunction("ContamRE.normalExport.doNormalExport",
      [CREUI.options]).then(function(result)
      {
        CREUI.saveFiles(result);
      });
    }
  }
}

CREUI.finishSelectCtmNodes = function(dialogresult)
{
  if(dialogresult)
  {
    CREUI.options.normalExport.doNormalCtms = true;
    CREUI.OpenDialog(CREUI.ctmOptionsPage, CREUI.finishCtmOptions, 
      "Export .sim file - Contaminant Options (Cont'd)");
  }
}

CREUI.finishSelectEnvNodes = function(dialogresult)
{
  if(dialogresult)
  {
    CREUI.OpenDialog(CREUI.envOptionsPage, CREUI.finishEnvOptions, 
      "Export .sim file - Environment Options (Cont'd)");
  }
}

CREUI.finishSelectLinks = function(dialogresult)
{
  if(dialogresult)
  {
    CREUI.OpenDialog(CREUI.linkOptionsPage, CREUI.finishLinkOptions, 
      "Export .sim file - Airflow Path Options (Cont'd)");
  }
}

CREUI.finishCtmOptions = function(dialogresult)
{
  if(dialogresult)
  {
    if(CREUI.options.normalExport.exportEnv)
    {
      CREUI.options.normalExport.doEnvNodes = true;
      CREUI.OpenDialog(CREUI.selectNodesPage, CREUI.finishSelectEnvNodes, 
        "Export .sim file - Environmental Options");
    }
    else if(CREUI.options.normalExport.exportAF)
    {
      CREUI.OpenDialog(CREUI.selectLinksPage, CREUI.finishSelectLinks, 
        "Export .sim file - Airflow Path Options");
    }
    else
    {
      CREUI.OpenDialog(CREUI.selectTimePage, CREUI.finishTime, 
        "Export .sim file - Output Time Limits");
    }
  }
}

CREUI.finishEnvOptions = function(dialogresult)
{
  if(dialogresult)
  {
    if(CREUI.options.normalExport.exportAF)
    {
      CREUI.OpenDialog(CREUI.selectLinksPage, CREUI.finishSelectLinks, 
        "Export .sim file - Airflow Path Options");
    }
    else
    {
      CREUI.OpenDialog(CREUI.selectTimePage, CREUI.finishTime, 
        "Export .sim file - Output Time Limits");
    }
  }
}

CREUI.finishLinkOptions = function(dialogresult)
{
  if(dialogresult)
  {
    CREUI.OpenDialog(CREUI.selectTimePage, CREUI.finishTime, 
      "Export .sim file - Output Time Limits");
  }
}

CREUI.finishAvgOptions = function(dialogresult)
{
  if(dialogresult)
  {
    if(CREUI.options.averageExport.doTimeAverage)
    {
      CREUI.options.averageExport.DoAvgTimeNodes = true;
      CREUI.OpenDialog(CREUI.selectNodesPage, 
        CREUI.finishSelectTimeAvgNodes, 
        "Average Concentration Export - Select Temporal Average Nodes");
    }
    else if(CREUI.options.averageExport.doSpatialAverage)
    {
      CREUI.options.averageExport.DoSpacAvgNodes = true;
      CREUI.OpenDialog(CREUI.selectNodesPage, 
        CREUI.finishSelectSpacAvgNodes, 
        "Average Concentration Export - Select Spatial Average Nodes");
    }
  }
}

CREUI.finishSelectTimeAvgNodes = function(dialogResult)
{
  if(dialogResult)
  {
    if(CREUI.options.averageExport.doSpatialAverage)
    {
      CREUI.options.averageExport.DoSpacAvgNodes = true;
      CREUI.OpenDialog(CREUI.selectNodesPage, CREUI.finishSelectSpacAvgNodes, 
        "Average Concentration Export - Select Spatial Average Nodes");
    }
    else
    {
      CREUI.options.averageExport.doAvgCtms = true;
      CREUI.OpenDialog(CREUI.ctmOptionsPage, CREUI.finishAvgCtmOptions, 
        "Average Concentration Export - Contaminant Options");
    }
  }
}

CREUI.finishSelectSpacAvgNodes = function(dialogResult)
{
  if(dialogResult)
  {
    CREUI.options.averageExport.doAvgCtms = true;
    CREUI.OpenDialog(CREUI.ctmOptionsPage, CREUI.finishAvgCtmOptions, 
      "Average Concentration Export - Contaminant Options");
  }
}

CREUI.finishAvgCtmOptions = function(dialogResult)
{
  if(dialogResult)
  {
    CREUI.OpenDialog(CREUI.selectTimePage, CREUI.finishTime, 
      "Average Concentration Export - Time Options");
  }
}

CREUI.finishExpOptions = function(dialogResult)
{
  if(dialogResult)
  {
    var ee = CREUI.options.exposureExport;
    var filesContents;
    
    //do exposure export
    if(ee.filePerOcc) // one file per occupant
    {
      CWD.CallContamFunction("ContamRE.exposureExport.CreateOneFilePerOccupant",
        [ee]).then(function(result)
      {
        zipContents = result;
        CREUI.SaveOccupantFiles(zipContents);
      });
    }
    else // one file per contaminant
    {
      CWD.CallContamFunction("ContamRE.exposureExport.CreateOneFilePerContaminant",
        [ee]).then(function(result)
      {
        zipContents = result;
        CREUI.SaveContaminantFiles(zipContents);
      });
    }
  }
}

CREUI.SaveContaminantFiles = function(zipContents)
{
  CWD.GetContamVariable("CONTAM.Project.Name").then(function(result)
  {
    var periodIndex = result.lastIndexOf(".");
    var filename = result.substring(0, periodIndex);
    var files = [];
    var file = {};
    file.name = filename + " ctm exposure.zip";
    file.blob = zipContents;
    file.linktext = "Save exposure for each contaminant Result Zip File";    
    files.push(file);
    CREUI.saveFiles(files);
  });
}

CREUI.SaveOccupantFiles = function(zipContents)
{
  CWD.GetContamVariable("CONTAM.Project.Name").then(function(result)
  {
    var periodIndex = result.lastIndexOf(".");
    var filename = result.substring(0, periodIndex);
    var files = [];
    var file = {};
    file.name = filename + " occ exposure.zip";
    file.blob = zipContents;
    file.linktext = "Save exposure for each occupant Result Zip File";    
    files.push(file);
    CREUI.saveFiles(files);
  });
}
