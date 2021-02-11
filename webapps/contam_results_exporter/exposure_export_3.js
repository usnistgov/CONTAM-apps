
ContamRE.exposureExport.ReadExpFile = function(file, callback)
{
  var reader = new FileReaderSync();
  var ee = ContamRE.exposureExport;
  ee.filename = file.name;
  console.log("ReadExpFile");
  ee.expText = reader.readAsText(file);
  if(ee.ProcessExpFile())
  {
    if(callback)
      callback();
  }
}

ContamRE.exposureExport.ProcessExpFile = function()
{
  var TimeData = {}, currentDate, currentTime, contamnumber;
  var rdr = CONTAM.Reader;
  var ee = ContamRE.exposureExport;
  var readcount = 0;
  ee.ExposureData = [];
  
  rdr.Init(ee.expText);
  
  //number of people
  ee.Numofpeople =  rdr.readIX(0);
  //number of contaminants
  ee.NumberofContams = rdr.readIX(0);
  if(ee.NumberofContams != CONTAM.Project.nctm)
  {
    alert("The number of contaminants in the exposure file does not match the number in the project file. Unable to proceed.");
    return false;
  }
  ee.dtres0 = rdr.readMDx(0);

  ee.dtres1 = rdr.readMDx(0);
  ee.TimeStep = rdr.readIX(0);
  //Exp flag
  ee.ExpFlag = rdr.readIX(0);
  //box-whisker flag
  ee.BWFLag = rdr.readIX(0);
  if(ee.BWFLag == 1)
  {
    alert("This exposure file contains box whisker data and cannot be processed.  Be sure the exp flag is 1 and the -bw flag after it is 0 before simulating the project.");
    return false;
  }
  //read header line
  rdr.nextword(3);
  while (!rdr.EOF())
  {
    //date 
    currentDate = rdr.nextword(0);
    if(!currentDate)
      break;
    //time
    currentTime = rdr.nextword(0);
    if(currentTime == "24:00:00") //correct midnight to zero hour of the next day.
    {
      var tempDOY;
      currentTime = "00:00:00"
      tempDOY = CONTAM.DateUtilities.StringDateXToIntDateX(currentDate);
      tempDOY++;
      if(tempDOY > 365)
        tempDOY -= 365;
      currentDate = CONTAM.DateUtilities.IntDateXToStringDateX(tempDOY);
    }
    if(readcount == 0)
    {
      if(currentTime.length < 8)
        currentTime = "0" + currentTime;
      ee.tmres0 = CONTAM.TimeUtilities.StringTimeToIntTime(currentTime);
      readcount += 1;
    }
    //contam Number
    contamnumber = rdr.readIX(0);
    if(TimeData.Date != currentDate || TimeData.Time != currentTime)
    {
      if(TimeData.Date)
        ee.ExposureData.push(TimeData);
      TimeData ={};
      TimeData.Date = currentDate;
      TimeData.Time = currentTime;
      TimeData.Contams = [];
    }
    var ContamExposure = [];
    for(var i = 0; i<ee.Numofpeople; ++i)
    {
      //exposure value
      ContamExposure.push(rdr.readR4(0));
    }
    TimeData.Contams.push(ContamExposure);
  }
  //add last time data
  ee.ExposureData.push(TimeData);
  if(currentTime.Length < 8)
    currentTime = "0" + currentTime;
  if(currentTime == "00:00:00")
    currentTime = "24:00:00";
  ee.tmres1 = CONTAM.TimeUtilities.StringTimeToIntTime(currentTime);
  return true;
}

ContamRE.exposureExport.CreateOneFilePerContaminant = function(options)
{
  var ee = ContamRE.exposureExport;
  var cut = CONTAM.Units.Types;
  var zip = new JSZip();
  
  var periodIndex = CONTAM.Project.Name.lastIndexOf(".");
  var projectName = CONTAM.Project.Name.substring(0, periodIndex);
  for(var c=0; c<ee.NumberofContams; ++c)
  {
    var fc = ""; //file contents
    var ctm = CONTAM.Project.Ctm[c];
    var unitType = CONTAM.Units.GetConcUnitType(ctm);
    fc += ctm.name + "\t";
    if(options.useContamUnits)
    {
      unitsConv = ctm.ucc;
      switch(unitType)
      {
        case cut.Concentration_MD:
          unitsString = CONTAM.Units.Strings2.Concentration_MD[ctm.ucc]
          unitsFunc = CONTAM.Units.Concen_MD_Convert;
          break;
        case cut.Concentration_M:
          unitsString = CONTAM.Units.Strings2.Concentration_M[ctm.ucc]
          unitsFunc = CONTAM.Units.Concen_M_Convert;
          break;
        case cut.Concentration_N:
          unitsString = CONTAM.Units.Strings2.Concentration_N[ctm.ucc]
          unitsFunc = CONTAM.Units.Concen_N_Convert;
          break;
        case cut.Concentration_MP:
          unitsString = CONTAM.Units.Strings2.Concentration_MP[ctm.ucc]
          unitsFunc = CONTAM.Units.Concen_MP_Convert;
          break;
        case cut.Concentration_MDP:
          unitsString = CONTAM.Units.Strings2.Concentration_MDP[ctm.ucc]
          unitsFunc = CONTAM.Units.Concen_MDP_Convert;
          break;
        case cut.Concentration_P:
          unitsString = CONTAM.Units.Strings2.Concentration_MP[ctm.ucc]
          unitsFunc = CONTAM.Units.Concen_P_Convert;
          break;
      }
    }
    else
    {
      switch(unitType)
      {
        case cut.Concentration_MD:
        case cut.Concentration_M:
        case cut.Concentration_N:
          unitsString = CONTAM.Units.Strings2.Concentration_N[options.gasUnits]
          unitsFunc = CONTAM.Units.Concen_N_Convert;
          unitsConv = options.gasUnits;
          break;
        case cut.Concentration_MP:
        case cut.Concentration_MDP:
        case cut.Concentration_P:
          unitsString = CONTAM.Units.Strings2.Concentration_P[options.particleUnits]
          unitsFunc = CONTAM.Units.Concen_P_Convert;
          unitsConv = options.particleUnits;
          break;
      }
    }
    fc += unitsString + "\t";
    fc += CONTAM.DateUtilities.IntDateXToStringDateX(options.date0) + "\t";
    fc += CONTAM.DateUtilities.IntDateXToStringDateX(options.date1) + CONTAM.Project.EOL;
    fc += "Date\tTime\t";
    for(var i=1; i<=ee.Numofpeople; ++i)
    {
      fc += "Exp " + i + "\t";
    }
    fc += CONTAM.Project.EOL;
    
    for(var x=0; x<ee.ExposureData.length; ++x)
    {
      var ed = ee.ExposureData[x];
      var time = CONTAM.TimeUtilities.StringTimeToIntTime(ed.Time);
      var date = CONTAM.DateUtilities.StringDateXToIntDateX(ed.Date);
      //only output data from the time period selected by the user.
      if(CONTAM.DateUtilities.IsDateTimeInRange(date, time, options.date0, 
          options.date1, options.time0, options.time1))
      {
        fc += ed.Date + "\t" + ed.Time + "\t";
        for(i=0; i<ee.Numofpeople; ++i)
        {
          var concen = unitsFunc(ed.Contams[c][i], unitsConv, 0, ctm);
          fc += sprintf("%.4e\t", concen);
        }
        fc += CONTAM.Project.EOL;
      }
    }
    var pxfFileName = projectName + "_" + ctm.name + ".pxf";
    zip.file(pxfFileName, fc);
  }
  var zipcontent = zip.generate({type:"blob"});
  return zipcontent;
}

ContamRE.exposureExport.CreateOneFilePerOccupant = function(options)
{
  var ee = ContamRE.exposureExport;
  var cut = CONTAM.Units.Types;
  var zip = new JSZip();

  var periodIndex = CONTAM.Project.Name.lastIndexOf(".");
  var projectName = CONTAM.Project.Name.substring(0, periodIndex);
  for(var i=0; i<ee.Numofpeople; ++i)
  {
    var fc = ""; //file contents
    fc += CONTAM.DateUtilities.IntDateXToStringDateX(options.date0) + "\t";
    fc += CONTAM.DateUtilities.IntDateXToStringDateX(options.date1) + CONTAM.Project.EOL;
    fc += "Date\tTime\t";
    for(var c=0; c<ee.NumberofContams; ++c)
    {
      var ctm = CONTAM.Project.Ctm[c];
      var unitType = CONTAM.Units.GetConcUnitType(ctm);
      var unitsString, unitsFunc, unitsConv;
      if(options.useContamUnits)
      {
        unitsConv = ctm.ucc;
        switch(unitType)
        {
          case cut.Concentration_MD:
            unitsString = CONTAM.Units.Strings2.Concentration_MD[ctm.ucc]
            unitsFunc = CONTAM.Units.Concen_MD_Convert;
            break;
          case cut.Concentration_M:
            unitsString = CONTAM.Units.Strings2.Concentration_M[ctm.ucc]
            unitsFunc = CONTAM.Units.Concen_M_Convert;
            break;
          case cut.Concentration_N:
            unitsString = CONTAM.Units.Strings2.Concentration_N[ctm.ucc]
            unitsFunc = CONTAM.Units.Concen_N_Convert;
            break;
          case cut.Concentration_MP:
            unitsString = CONTAM.Units.Strings2.Concentration_MP[ctm.ucc]
            unitsFunc = CONTAM.Units.Concen_MP_Convert;
            break;
          case cut.Concentration_MDP:
            unitsString = CONTAM.Units.Strings2.Concentration_MDP[ctm.ucc]
            unitsFunc = CONTAM.Units.Concen_MDP_Convert;
            break;
          case cut.Concentration_P:
            unitsString = CONTAM.Units.Strings2.Concentration_MP[ctm.ucc]
            unitsFunc = CONTAM.Units.Concen_P_Convert;
            break;
        }
      }
      else
      {
        switch(unitType)
        {
          case cut.Concentration_MD:
          case cut.Concentration_M:
          case cut.Concentration_N:
            unitsString = CONTAM.Units.Strings2.Concentration_N[options.gasUnits]
            unitsFunc = CONTAM.Units.Concen_N_Convert;
            unitsConv = options.gasUnits;
            break;
          case cut.Concentration_MP:
          case cut.Concentration_MDP:
          case cut.Concentration_P:
            unitsString = CONTAM.Units.Strings2.Concentration_P[options.particleUnits]
            unitsFunc = CONTAM.Units.Concen_P_Convert;
            unitsConv = options.particleUnits;
            break;
        }
      }
      fc += ctm.name + " (" + unitsString + ")\t";
    }
    fc += CONTAM.Project.EOL;
    for(var x=0; x<ee.ExposureData.length; ++x)
    {
      var ed = ee.ExposureData[x];
      var time = CONTAM.TimeUtilities.StringTimeToIntTime(ed.Time);
      var date = CONTAM.DateUtilities.StringDateXToIntDateX(ed.Date);
      //only output data from the time period selected by the user.
      if(CONTAM.DateUtilities.IsDateTimeInRange(date, time, options.date0, 
          options.date1, options.time0, options.time1))
      {
        fc += ed.Date + "\t" + ed.Time + "\t";
        for(c=0; c<ed.Contams.length; ++c)
        {
          var concen = unitsFunc(ed.Contams[c][i], unitsConv, 0, ctm);
          fc += sprintf("%.4e\t", concen);
        }
        fc += CONTAM.Project.EOL;
      }
    }
    pxfFileName = projectName + "_EXP" + (i+1) + ".pxf";
    zip.file(pxfFileName, fc);
  }
  var zipcontent = zip.generate({type:"blob"});
  return zipcontent;
}


