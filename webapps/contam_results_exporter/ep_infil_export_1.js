ContamRE.EPInfilExport = {};

ContamRE.EPInfilExport.ExportInfil = function()
{
  var MinutesPerItem = CONTAM.Simread.tsres / 60;
  if (MinutesPerItem < 1)
  {
    throw("The time step of the project must be at least 1 minute.");
  }
  if (MinutesPerItem > 60)
  {
    throw("The time step of the project must be at most 1 hour.");
  }
  if(CONTAM.Simread.tmres0 != 0 && CONTAM.Simread.tmres0 != 86400)
  {
    throw("The start of the simulation must be at the beginning of a day");
  }
  if(CONTAM.Simread.tmres1 != 0 && CONTAM.Simread.tmres1 != 86400)
  {
    throw("The end of the simulation must be at the end of a day");
  }
  ContamRE.EPInfilExport.FindPathsAndZones();
  ContamRE.EPInfilExport.ProcessResults();
  ContamRE.EPInfilExport.CreateIDFObjects();
  var zipFile = ContamRE.EPInfilExport.CreateZipFile();
  return zipFile;
}

ContamRE.EPInfilExport.CreateZipFile = function()
{
  var zip = new JSZip();
  
  var periodIndex = CONTAM.Project.Name.lastIndexOf(".");
  var filename = CONTAM.Project.Name.substring(0, periodIndex);
  zip.file(filename + ".idf", ContamRE.EPInfilExport.idfText);
  zip.file(filename + ".csv", ContamRE.EPInfilExport.csvString);
  var content = zip.generate({type:"blob"});
  return content;
}

ContamRE.EPInfilExport.CreateIDFObjects = function()
{
  ContamRE.EPInfilExport.idfText = "";
  var MinutesPerItem = CONTAM.Simread.tsres / 60;
  var EOL = CONTAM.Project.EOL;
  var columnNumber = 2;
  var periodIndex = CONTAM.Project.Name.lastIndexOf(".");
  var csvfilename = CONTAM.Project.Name.substring(0, periodIndex) + ".csv";
  var hours;
  
  //find the # of hours in the simulation
  if(CONTAM.Simread.dtres0 == CONTAM.Simread.dtres1)
  {
    hours = 24;
  }  
  else if(CONTAM.Simread.dtres1 > CONTAM.Simread.dtres0)
  {
    hours = parseInt((CONTAM.Simread.dtres1 - CONTAM.Simread.dtres0 + 1) * 24);
  }
  else
  {
    //get hours from Jan1 to the end
    hours = parseInt((CONTAM.Simread.dtres1) * 24);
    //get hours from the beginning to Dec 31
    hours += parseInt((365 - CONTAM.Simread.dtres0) * 24)
  }
  
  ContamRE.EPInfilExport.idfText += "ScheduleTypeLimits," + EOL;
  ContamRE.EPInfilExport.idfText += "    Any Number,              !- Name" + EOL;
  ContamRE.EPInfilExport.idfText += "    ,                        !- Lower Limit Value" + EOL;
  ContamRE.EPInfilExport.idfText += "    ,                        !- Upper Limit Value" + EOL;
  ContamRE.EPInfilExport.idfText += "    ,                        !- Numeric Type" + EOL;
  ContamRE.EPInfilExport.idfText += "    Dimensionless;           !- Unit Type" + EOL;
  ContamRE.EPInfilExport.idfText += EOL;
  ContamRE.EPInfilExport.envZones.forEach(doZone);

  function doZone(zone)
  {
    var idfText = "";
    var ctm_zone = CONTAM.Project.ZoneList[zone.nr];
    var zoneName = ctm_zone.pld.nr + "_" + ctm_zone.name;

    idfText += "Schedule:File," + EOL;
    idfText += "    " + zoneName + "_infil_sched,        !- Name" + EOL;
    idfText += "    Any Number,              !- Schedule Type Limits Name" + EOL;
    idfText += sprintf("    %s,        !- File Name", csvfilename) + EOL;
    idfText += "    " + columnNumber + ",                       !- Column Number" + EOL;
    columnNumber+=2; //skip exfiltration column
    idfText += "    1,                       !- Rows to Skip at Top" + EOL;
    idfText += "    " + hours + ",                    !- Number of Hours of Data" + EOL;
    idfText += "    Comma,                   !- Column Separator" + EOL;
    idfText += "    No,                      !- Interpolate to Timestep" + EOL;
    idfText += "    " + MinutesPerItem +
      ";                      !- Minutes per Item" + EOL;

    idfText += EOL;
    idfText += "ZoneInfiltration:DesignFlowRate," + EOL;
    idfText += "    " + zoneName + "_infil,              !- Name" + EOL;
    idfText += "    " + zoneName + ",                !- Zone or ZoneList Name" + EOL;
    idfText += "    " + zoneName + "_infil_sched,        !- Schedule Name" + EOL;
    idfText += "    Flow/Zone,               !- Design Flow Rate Calculation Method" + EOL;
    idfText += "    1,                       !- Design Flow Rate {m3/s}" + EOL;
    idfText += "    ,                        !- Flow per Zone Floor Area {m3/s-m2}" + EOL;
    idfText += "    ,                        !- Flow per Exterior Surface Area {m3/s-m2}" + EOL;
    idfText += "    ,                        !- Air Changes per Hour {1/hr}" + EOL;
    idfText += "    1,                       !- Constant Term Coefficient" + EOL;
    idfText += "    0,                       !- Temperature Term Coefficient" + EOL;
    idfText += "    0,                       !- Velocity Term Coefficient" + EOL;
    idfText += "    0;                       !- Velocity Squared Term Coefficient" + EOL;
    idfText += EOL;
    ContamRE.EPInfilExport.idfText += idfText;
  }

}

//process the sim file to get the zone infiltrations
ContamRE.EPInfilExport.ProcessResults = function()
{
  var firstDay = true;
  var time_index;
  ContamRE.EPInfilExport.csvString = "Date/Time,";
  ContamRE.EPInfilExport.envZones.forEach(doZoneHeading);
  ContamRE.EPInfilExport.csvString += CONTAM.Project.EOL;
  for(var day=CONTAM.Simread.dtres0; ; ++day)
  {
    if(day > 365)
      day = 1;
    var dateString = CONTAM.DateUtilities.IntDateXToStringDateX(day);
    //console.log(dateString);
    var numTimeSteps = CONTAM.Simread.set_day_ofst(day);
    var timeString;
    for(time_index = 0;time_index<numTimeSteps;++time_index)
    {
      timeString = CONTAM.TimeUtilities.IntTimeToStringTime(
        time_index * CONTAM.Simread.tsres);
      postMessage({cmd:"progressUpdate", date:dateString, time:timeString});
      //console.log(timeString);
      var pw = {};
      CONTAM.Simread.read_time_wthr(time_index, pw);
      var rho = CONTAM.Utils.PsyRhoAirFnPbTdbW_Eplus(pw.barpres, pw.Tambt-273.15, 0);
      ContamRE.EPInfilExport.csvString += dateString + " " + timeString + ",";
      ContamRE.EPInfilExport.envZones.forEach(doZones);
      ContamRE.EPInfilExport.csvString += CONTAM.Project.EOL;
    }
    //handle last day's final timestep if it's 24:00:00
    if(day == CONTAM.Simread.dtres1 && CONTAM.Simread.tmres1 == 86400)
    {
      time_index = numTimeSteps;
      timeString = "24:00:00";
      postMessage({cmd:"progressUpdate", date:dateString, time:timeString});
      //console.log(timeString);
      var pw = {};
      CONTAM.Simread.read_time_wthr(time_index, pw);
      var rho = CONTAM.Utils.PsyRhoAirFnPbTdbW_Eplus(pw.barpres, pw.Tambt-273.15, 0);
      ContamRE.EPInfilExport.csvString += dateString + " " + timeString + ",";
      ContamRE.EPInfilExport.envZones.forEach(doZones);
      ContamRE.EPInfilExport.csvString += CONTAM.Project.EOL;
    }
    if(day == CONTAM.Simread.dtres1)
      break;
  }

  function doZones(zone)
  {
    var infiltration = 0;
    var exfiltration = 0;
    zone.Paths.forEach(doPaths)
    ContamRE.EPInfilExport.csvString += sprintf("%e, %e,", infiltration, exfiltration);

    function doPaths(pathnr)
    {
      var path = CONTAM.Project.PathList[pathnr];
      //getPath result data
      var pfr = {};
      if(!CONTAM.Simread.read_link_flow(pathnr, time_index, pfr))
      {
        throw "Sim File Read Error";
      }
      //postive flow is infiltration
      if(path.pzn.nr == CONTAM.Globals.AMBT)
      {
        if(pfr.Flow0 > 0)
          infiltration += pfr.Flow0 / rho;
        else
          exfiltration -= pfr.Flow0 / rho;
        if(pfr.Flow1 > 0)
          infiltration += pfr.Flow1 / rho;
        else
          exfiltration -= pfr.Flow1 / rho;
      }
      else //positive flow is exfiltration
      {
        if(pfr.Flow0 > 0)
          exfiltration += pfr.Flow0 / rho;
        else
          infiltration -= pfr.Flow0 / rho;
        if(pfr.Flow1 > 0)
          exfiltration += pfr.Flow1 / rho;
        else
          infiltration -= pfr.Flow1 / rho;
      }
    }
  }
  
  function doZoneHeading(zone)
  {
    var ctm_zone = CONTAM.Project.ZoneList[zone.nr];
    var zoneName = ctm_zone.pld.nr + "_" + ctm_zone.name;
    ContamRE.EPInfilExport.csvString += zoneName + " infiltration,";
    ContamRE.EPInfilExport.csvString += zoneName + " exfiltration,";
  }

}

// find the envelope paths and the zones that they connect to ambient
ContamRE.EPInfilExport.FindPathsAndZones = function()
{
  ContamRE.EPInfilExport.envZones = []; //list of zones connected to AMBT
  CONTAM.Project.PathList.forEach(checkPath);
  function checkPath(path, index)
  {
    //find paths that connect to ambient and not to implicit AHS zones
    if(path.pzn.nr == CONTAM.Globals.AMBT &&
      !(path.pzm.flags & CONTAM.Globals.SYS_N))
    {
      var zn = FindZone(path.pzm.nr);
      if(!zn)
      {
        zn = createZone(path.pzm.nr);
        ContamRE.EPInfilExport.envZones.push(zn);
      }
      zn.Paths.push(path.nr);
    }
    else if(path.pzm.nr == CONTAM.Globals.AMBT &&
      !(path.pzn.flags & CONTAM.Globals.SYS_N))
    {
      var zn = FindZone(path.pzn.nr);
      if(!zn)
      {
        zn = createZone(path.pzn.nr);
        ContamRE.EPInfilExport.envZones.push(zn);
      }
      zn.Paths.push(path.nr);
    }
    
    function createZone(znr)
    {
      var zn = {nr:znr, Paths:[]};
      return zn;    
    }
    function FindZone(nr)
    {
      for(var i=0; i<ContamRE.EPInfilExport.envZones.length; ++i)
      {
        if(ContamRE.EPInfilExport.envZones[i].nr == nr)
          return ContamRE.EPInfilExport.envZones[i];
      }
      return undefined;
    }
  }
  
}