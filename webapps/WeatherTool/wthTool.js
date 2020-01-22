if(typeof WthTool == "undefined")
{
  var WthTool = {};
}

WthTool.config = {};
WthTool.config.description = "";
WthTool.config.startdate = "";
WthTool.config.enddate = "";
WthTool.config.usedst = 0;
WthTool.config.dststart = "";
WthTool.config.dstend = "";
WthTool.config.specialdays = [];

window.onload = function()
{
  //setup the worker to run the EPW conversion
  WthTool.myWorker = new Worker("wthTool_worker.js");
  WthTool.myWorker.onmessage = WthTool.onWorkerMessage;
  // setup change event handler for the epw file input
  var input = document.getElementById("epw-input");
  input.addEventListener('change', WthTool.epwFileChange);
}

WthTool.createInputFile = function()
{
  // create config object
  WthTool.createConfig();
  // stringify it
  var configJSONString = JSON.stringify(WthTool.config, null, '\t');
  // create a link for the user to save the config file
  WthTool.SaveFile("config.json", configJSONString);
}

// function to handle changes in the epw file input
WthTool.epwFileChange = function()
{
  // make sure there's a file selected
  if(document.getElementById('epw-input').files[0])
  {
    // get the start and end dates from the epw file
    WthTool.getEpwDates(document.getElementById('epw-input').files[0]);
    // put the filename in the wth file name input
    var epwFileName = document.getElementById('epw-input').files[0].name;
    // remove the extension
    var lastPeriod = epwFileName.lastIndexOf(".");
    epwFileName = epwFileName.substring(0,lastPeriod);
    document.getElementById("wthFilename").value = epwFileName;
    
  }
  else
  {
    document.getElementById('epwStartDateSpan').textContent = "";
    document.getElementById('epwEndDateSpan').textContent = "";
  }
}

// get the epw file start and end date
// and display them in the interface
WthTool.getEpwDates = function(file)
{
  // get the contents of the epw file
  var reader = new FileReader();
  reader.onload = EPWFileRead;
  reader.readAsText(file);
  
  function EPWFileRead()
  {
    // read the beginning of the file contents 
    // this populates the epw start and end dates
    WthTool.readEPWFile(reader.result);
    // put the date strings into the interface
    document.getElementById('epwStartDateSpan').textContent = WthTool.EpwStartDateString;
    document.getElementById('epwEndDateSpan').textContent = WthTool.EpwEndDateString;
    // get the month and day from the dates and set the start date and end date 
    // to the dates from the epw file
    var startMonth = WthTool.EpwStartDateString.substring(0, WthTool.EpwStartDateString.indexOf('/'));
    var startDay = WthTool.EpwStartDateString.substring(WthTool.EpwStartDateString.indexOf('/') + 1);
    var endMonth = WthTool.EpwEndDateString.substring(0, WthTool.EpwEndDateString.indexOf('/'));
    var endDay = WthTool.EpwEndDateString.substring(WthTool.EpwEndDateString.indexOf('/') + 1);
    var startMonthSelect = document.getElementById("startMonth");
    var startDaySelect = document.getElementById("startDay");
    var endMonthSelect = document.getElementById("endMonth");
    var endDaySelect = document.getElementById("endDay");
    startMonthSelect.selectedIndex = parseInt(startMonth) - 1;
    startDaySelect.selectedIndex = parseInt(startDay) - 1;
    endMonthSelect.selectedIndex = parseInt(endMonth) - 1;
    endDaySelect.selectedIndex = parseInt(endDay) - 1;
  }
}

// return 1 if the dateToTest is within the range of dates given
WthTool.dateIsWithinRange = function(dateToTest, rangeStart, rangeEnd)
{
  if (rangeStart <= rangeEnd)
  {
    return dateToTest >= rangeStart && dateToTest <= rangeEnd;
  }
  else
  {
    return (dateToTest >= rangeStart && dateToTest <= 365) ||
      (dateToTest >= 1 && dateToTest <= rangeEnd);
  }
}

// get the start and end dates from the epw file
WthTool.readEPWFile = function(epwFileString)
{
  // copy the file contents
  var fileContents = epwFileString;
  //split the file into lines
  var lines = fileContents.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
  // get the eighth line
  var line8 = lines[7];
  // split the line by comma
  var lineItems = line8.split(',');
  // get the start and end dates
  WthTool.EpwStartDateString = lineItems[5];
  WthTool.EpwEndDateString = lineItems[6];
  WthTool.EpwStartDate = WthTool.StringDateXToIntDateX(WthTool.EpwStartDateString);
  WthTool.EpwEndDate = WthTool.StringDateXToIntDateX(WthTool.EpwEndDateString);
  
}

WthTool.AddSpecialDay = function()
{
  var specialDaysSelect = document.getElementById('specialDaysSelect');
  var dtypeSelect = document.getElementById('dtypeSelect');
  
  var startMonth = document.getElementById('specialDayMonth').value;
  var startDay = document.getElementById('specialDayDay').value;
  
  var specialDate = startMonth + "/" + startDay;
  var doy = WthTool.StringDateXToIntDateX(specialDate);
  if(doy == -1)
  {
    alert("Invalid special date: " + specialDate);
    return;
  }
  
  //check if that doy has already been defined
  for (var i = 0; i < specialDaysSelect.children.length; i++) 
  {
    var child = specialDaysSelect.children[i];
    if(child.value == doy)
    {
      // if so then remove the existing special day which will be replaced 
      // by a new one below
      specialDaysSelect.remove(i);
    }
  }
  
  var option = document.createElement('option');
  option.value = doy;
  option.dtype = parseInt(dtypeSelect.value);
  option.specialDay = specialDate;
  option.textContent = specialDate + ", " +  dtypeSelect.value;
  specialDaysSelect.appendChild(option);
  
}

WthTool.RemoveSpecialDay = function ()
{
  var specialDaysSelect = document.getElementById('specialDaysSelect');
  if(specialDaysSelect.selectedIndex >= 0)
  {
    specialDaysSelect.remove(specialDaysSelect.selectedIndex);
  }
  else
  {
    alert("No special day selected.");
  }
}

WthTool.StringDateXToIntDateX = function (Date)
{
  var c, day = 0, month = 0;
  var lom =     /* length of month - no leap year */
  [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  var som = /* start of month - 1 (day-of-year) */
  [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];


  c = Date.indexOf("/");
  if(c == -1)
    return -1;
  month = parseInt(Date.substring(0, c));
  day = parseInt(Date.substring(c + 1, Date.length));

  if (month < 1 || month > 12 || day < 1 || day > lom[month - 1])
  {
    return -1;
  }
  return som[month - 1] + day;
}


WthTool.createConfig = function()
{
  //get description 
  // remove any line breaks from the textarea
  // and replace with a pipe |
  WthTool.config.description = document.getElementById('configDescription').value.replace(/(\r\n|\n|\r)/gm,"|");;
  
  // get start and end dates
  var startMonth = document.getElementById('startMonth').value;
  var startDay = document.getElementById('startDay').value;
  var endMonth = document.getElementById('endMonth').value;
  var endDay = document.getElementById('endDay').value;
  
  WthTool.config.startdate = startMonth + "/" + startDay;
  WthTool.config.enddate = endMonth + "/" + endDay;
  var intStartDate = WthTool.StringDateXToIntDateX(WthTool.config.startdate);
  var intEndDate = WthTool.StringDateXToIntDateX(WthTool.config.enddate);
  
  if(intStartDate == -1)
  {
    alert("Invalid start date: " + WthTool.config.startdate);
    return;
  }
  if(intEndDate == -1)
  {
    alert("Invalid end date: " + WthTool.config.enddate);
    return;
  }
  if(intEndDate < intStartDate)
  {
    alert("The start date must be equal or before the start date.");
    return;
  }

  if(document.getElementById('configUseDST').checked)
  {
    WthTool.config.usedst = 1;
  
    var startMonthDST = document.getElementById('startMonthDST').value;
    var startDayDST = document.getElementById('startDayDST').value;
    var endMonthDST = document.getElementById('endMonthDST').value;
    var endDayDST = document.getElementById('endDayDST').value;
    
    WthTool.config.dststart = startMonthDST + "/" + startDayDST;
    WthTool.config.dstend = endMonthDST + "/" + endDayDST;
    
    if(WthTool.StringDateXToIntDateX(WthTool.config.dststart) == -1)
    {
      alert("Invalid DST start date: " + WthTool.config.dststart);
      return;
    }
    if(WthTool.StringDateXToIntDateX(WthTool.config.dstend) == -1)
    {
      alert("Invalid DST end date: " + WthTool.config.dstend);
      return;
    }
  }
  else
  {
    WthTool.config.usedst = 0;
    WthTool.config.dststart = "";
    WthTool.config.dstend = "";
  }
  
  WthTool.config.firstdoy = parseInt(document.getElementById('configFDOY').value);
  
  // process special days
  // create a new empty array
  WthTool.config.specialdays = [];
  var specialDaysSelect = document.getElementById('specialDaysSelect');
  for (var i = 0; i < specialDaysSelect.children.length; i++) 
  {
    var child = specialDaysSelect.children[i];
    WthTool.config.specialdays.push({date: child.specialDay, daytype: child.dtype});
  }
  
}

WthTool.ConvertEPW = function()
{
  if(!document.getElementById('epw-input').files[0])
  {
    alert("An epw file must be selected.");
    return;
  }
  WthTool.createConfig();
  WthTool.setEpwFile(document.getElementById('epw-input').files[0], WthTool.RunSim2);
}

WthTool.RunSim2 = function()
{
  //ensure that the dates selected by the user are in the epw file
  WthTool.readEPWFile(WthTool.wthText);

  var startDate = WthTool.StringDateXToIntDateX(WthTool.config.startdate);
  var endDate = WthTool.StringDateXToIntDateX(WthTool.config.enddate);
  
  if(WthTool.dateIsWithinRange(startDate, WthTool.EpwStartDate, WthTool.EpwEndDate) == 0)
  {
    alert("Start date: " + WthTool.config.startdate + " is not in the EPW file." +
      "EPW Start date: " + WthTool.EpwStartDateString + 
      ", EPW End date: " + WthTool.EpwEndDateString);
    return;
  }
  if(WthTool.dateIsWithinRange(endDate, WthTool.EpwStartDate, WthTool.EpwEndDate) == 0)
  {
    alert("End date: " + WthTool.config.enddate + " is not in the EPW file." +
      "EPW Start date: " + WthTool.EpwStartDateString + 
      ", EPW End date: " + WthTool.EpwEndDateString);
    return;
  }
  
  var data = {};
  data.cmd = "start";
  data.wthName = WthTool.wthName;
  data.wthText = WthTool.wthText;
  data.config = JSON.stringify(WthTool.config);

  WthTool.myWorker.postMessage(data);
}

WthTool.setEpwFile = function(file, callback)
{
  var reader = new FileReader();
  WthTool.wthName = file.name;
  reader.onload = EPWFileRead;
  reader.readAsText(file);
  
  function EPWFileRead()
  {
    WthTool.wthText = reader.result;
    if(callback)
      callback();
  }
}

WthTool.onWorkerMessage = function(oEvent)
{
  var data = oEvent.data;
  if(data.cmd == "result file")
  {
    WthTool.wthFile = data.wthFile;
    var filename = document.getElementById("wthFilename").value;
    // if the user did not enter a filename 
    if(filename.length == 0)
    {
      // use the name of the epw file
      filename = WthTool.wthName;
      // change the extension to wth
      // or add wth extension
      if(filename.lastIndexOf(".") >= 0)
      {
        filename = filename.substr(0, filename.lastIndexOf(".")) + ".wth";
      }
      else
      {
        filename += ".wth";
      }
    }
    else
    {
      // ensure that there is a wth extension
      if(filename.lastIndexOf(".wth") < 0)
      {
        filename += ".wth";
      }
    }
    //create a link so the user can save the file
    WthTool.SaveFile(filename, WthTool.wthFile);
  }
  else
  {
    alert("Unknown command from worker: " + data.cmd);
  }
}


WthTool.SaveFile = function(filename, fileContent)
{
  //clear save files div contents
  var saveInsertDiv = document.getElementById("saveInsertDiv");
  while (saveInsertDiv.firstChild) 
  {
    saveInsertDiv.removeChild(saveInsertDiv.firstChild);
  }

  var saveDiv = document.createElement("div");
  var savelink = document.createElement("a");
  var blob = new Blob([fileContent], {type:'text/plain'});
  //microsoft doing their own thing again
  if(window.navigator.msSaveOrOpenBlob) 
  {
    savelink.onclick  = function()
    {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    savelink.style.cursor = "pointer";
    savelink.style.color = "#00f";
    savelink.style.textDecoration = "underline";
  }
  else
  {
    savelink.download = filename;
    savelink.href = window.URL.createObjectURL(blob);
  }
  savelink.textContent = filename;
  savelink.className = "blacklink";
  saveDiv.appendChild(savelink);
  saveInsertDiv.appendChild(saveDiv);

}

WthTool.replaceFileInput = function(fileinputid)
{
  var oldInput = document.getElementById(fileinputid);
  
  var newInput = document.createElement("input");
  
  document.getElementById('epwStartDateSpan').textContent = "";
  document.getElementById('epwEndDateSpan').textContent = "";
  
  newInput.type = "file";
  newInput.id = oldInput.id;
  newInput.name = oldInput.name;
  newInput.className = oldInput.className;
  newInput.style.cssText = oldInput.style.cssText;
  newInput.addEventListener('change', WthTool.epwFileChange);

  // copy any other relevant attributes
  
  oldInput.parentNode.replaceChild(newInput, oldInput);
}