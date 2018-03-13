if(typeof CIT == "undefined")
{
  var CIT = {};
}

CIT.ProcessACHFile = function(options)
{
  CIT.options = options;
  CIT.idfFileName = options.idfFileName;
  CIT.csvFileName = options.csvFileName;
  //load ach file
  var reader = new FileReaderSync();
  //CIT.ACHName = options.achFile.name;
  CIT.ACHText = reader.readAsText(options.achFile);
  
  //read ach file
  var EOL = "\r\n";
  var zip = new JSZip();
  
  if(CIT.ACHFileReader.ReadACHFile(CIT.ACHText))
  {
    throw("Failed to read the ACH file.");
    return;
  }  

  //check ach 
  if (CIT.ACHFileReader.StartDate != 1 || CIT.ACHFileReader.EndDate != 365)
  {
    throw("The ACH file must start on Jan 1 and end on Dec 31.");
    return;
  }

  if (CIT.ACHFileReader.ACHRecords[CIT.ACHFileReader.ACHRecords.length - 1].Time != 86400)
  {
    throw("The ACH file does not end at 24:00:00 in Dec 31st.");
    return;
  }

  if (CIT.ACHFileReader.TimeStep % 60 != 0)
  {
    throw("The time step of the ACH file must be a multiple of 1 minute.");
    return true;
  }

  var MinutesPerItem = CIT.ACHFileReader.TimeStep / 60;
  if (MinutesPerItem < 1)
  {
    throw("The time step of the ACH file must be at least 1 minute.");
    return true;
  }

  //create csv file
  var csvText = "";
  csvText += "Date/time,Infiltration (m3/s-m2)" + EOL;
  for(var i=0; i<CIT.ACHFileReader.ACHRecords.length; ++i)
  {
    var rec = CIT.ACHFileReader.ACHRecords[i];
    var NormalizedInfiltrationRate = rec.ACRpath *
      CIT.ACHFileReader.Vcond / 3600 / CIT.options.BSA;
    var date = CONTAM.DateUtilities.IntDateXToStringDateX(rec.Date);
    var time = CONTAM.TimeUtilities.IntTimeToStringTime(rec.Time);
    csvText += sprintf("%s %s, %f", date, time, 
      NormalizedInfiltrationRate) + EOL;
  }
  zip.file(CIT.csvFileName, csvText);

  //create idf file
  var idfText = "";
  idfText += "ScheduleTypeLimits," + EOL;
  idfText += "    Any Number,              !- Name" + EOL;
  idfText += "    ,                        !- Lower Limit Value" + EOL;
  idfText += "    ,                        !- Upper Limit Value" + EOL;
  idfText += "    ,                        !- Numeric Type" + EOL;
  idfText += "    Dimensionless;           !- Unit Type" + EOL;

  idfText += EOL;
  idfText += "Schedule:File," + EOL;
  idfText += "    bldg_infil_sched,        !- Name" + EOL;
  idfText += "    Any Number,              !- Schedule Type Limits Name" + EOL;
  idfText += sprintf("    %s,        !- File Name", CIT.csvFileName) + EOL;
  idfText += "    2,                       !- Column Number" + EOL;
  idfText += "    1,                       !- Rows to Skip at Top" + EOL;
  idfText += "    8760,                    !- Number of Hours of Data" + EOL;
  idfText += "    Comma,                   !- Column Separator" + EOL;
  idfText += "    No,                      !- Interpolate to Timestep" + EOL;
  idfText += "    " + MinutesPerItem +
    ";                      !- Minutes per Item" + EOL;

  idfText += EOL;
  idfText += "ZoneInfiltration:DesignFlowRate," + EOL;
  idfText += "    Zone_Infil,              !- Name" + EOL;
  idfText += "    ZoneList,                !- Zone or ZoneList Name" + EOL;
  idfText += "    bldg_infil_sched,        !- Schedule Name" + EOL;
  idfText += "    Flow/ExteriorArea,       !- Design Flow Rate Calculation Method" + EOL;
  idfText += "    ,                        !- Design Flow Rate {m3/s}" + EOL;
  idfText += "    ,                        !- Flow per Zone Floor Area {m3/s-m2}" + EOL;
  idfText += "    1,                       !- Flow per Exterior Surface Area {m3/s-m2}" + EOL;
  idfText += "    ,                        !- Air Changes per Hour {1/hr}" + EOL;
  idfText += "    1,                       !- Constant Term Coefficient" + EOL;
  idfText += "    0,                       !- Temperature Term Coefficient" + EOL;
  idfText += "    0,                       !- Velocity Term Coefficient" + EOL;
  idfText += "    0;                       !- Velocity Squared Term Coefficient" + EOL;
  zip.file(CIT.idfFileName, idfText);
  var zipcontent = zip.generate({type:"blob"});
  return zipcontent;
}

CIT.ACHFileReader = {};
CIT.ACHFileReader.StartDate = 0; //first date of simulation (mm/dd IX) 
CIT.ACHFileReader.EndDate = 0;   //last date of simulation (mm/dd IX)
CIT.ACHFileReader.TimeStep = 0;  //simulation time step [s](IX) 
CIT.ACHFileReader.achsave = 0;   //save detailed results flag [0/1] (IX)
CIT.ACHFileReader.abwsave = 0;   //save box-whisker results flag [0/1] (IX)
CIT.ACHFileReader.Vcond = 0;     //volume of conditioned space [m^3] (R4) 
CIT.ACHFileReader.ACHRecords = [];

//return bool
CIT.ACHFileReader.ReadACHFile = function(ACHFileContents)
{
  CONTAM.Reader.Init(ACHFileContents);

  CIT.ACHFileReader.StartDate = CONTAM.DateUtilities.StringDateXToIntDateX(
    CONTAM.Reader.nextword(0));

  CIT.ACHFileReader.EndDate = CONTAM.DateUtilities.StringDateXToIntDateX(
    CONTAM.Reader.nextword(0));

  CIT.ACHFileReader.TimeStep = CONTAM.Reader.readIX(0);
  CIT.ACHFileReader.achsave = CONTAM.Reader.readIX(0);
  CIT.ACHFileReader.abwsave = CONTAM.Reader.readIX(0);
  CIT.ACHFileReader.Vcond = CONTAM.Reader.readR4(0);

  //TODO: handle box whisker data
  if (CIT.ACHFileReader.achsave == 0 || CIT.ACHFileReader.abwsave != 0)
  {
    throw("This application does not support reading an ACH " +
      "file without ach data or with ach box whisker data.");
    return true;
  }

  //read header line
  CONTAM.Reader.nextword(1);
  CONTAM.Reader.nextword(0);
  CONTAM.Reader.nextword(0);
  CONTAM.Reader.nextword(0);
  CONTAM.Reader.nextword(0);

  CIT.ACHFileReader.ACHRecords = [];

  while (!CONTAM.Reader.EOF())
  {
    var record = {};
    var date = CONTAM.Reader.nextword(0);
    if (date == null)
      break;
    record.Date = CONTAM.DateUtilities.StringDateXToIntDateX(date);

    record.Time = CONTAM.TimeUtilities.StringTimeToIntTime(
      CONTAM.Reader.nextword(0));

    record.ACRpath = CONTAM.Reader.readR4(0);
    record.ACRduct = CONTAM.Reader.readR4(0);
    record.ACRtotal = CONTAM.Reader.readR4(0);

    CIT.ACHFileReader.ACHRecords.push(record);
  }
  return false;
}
