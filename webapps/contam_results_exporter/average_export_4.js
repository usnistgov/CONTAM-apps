
ContamRE.averageExport.doAverageExport = function(options)
{
  var files = [];
  var sr = CONTAM.Simread;
  var period_index = sr.filename.lastIndexOf(".");
  ContamRE.options = options;
  var zip = new JSZip();
  
  //do time average
  if(options.averageExport.doTimeAverage)
  {
    var timeAvgNodeCount = options.averageExport.avgtZones.length +
      options.averageExport.avgtJcts.length + options.averageExport.avgtTerms.length;
    if(timeAvgNodeCount > 0)
    {
      var tavgFileContents = ContamRE.averageExport.doTimeAvgExport();
      var tavgfilename = sr.filename.substring(0, period_index) + ".tavg";
      zip.file(tavgfilename, tavgFileContents);
    }
  }
  
  //do spatial average
  if(options.averageExport.doSpatialAverage)
  {
    var spatialAvgNodeCount = options.averageExport.savgZones.length +
      options.averageExport.savgJcts.length + options.averageExport.savgTerms.length;
    if(spatialAvgNodeCount > 0)
    {
      var savgFileContents = ContamRE.averageExport.doSpatialAvgExport();
      var savgfilename = sr.filename.substring(0, period_index) + ".savg";
      zip.file(savgfilename, savgFileContents);
    }
  }

  var zipcontent = zip.generate({type:"blob"});
  var zipfilename = sr.filename.substring(0, period_index) + " avg export.zip";
  files.push({name:zipfilename, blob:zipcontent, linktext: "Save Results Zip File"});
  return files;
}

ContamRE.averageExport.doTimeAvgExport = function()
{
  // time average export
  var items = [];
  if(ContamRE.options.averageExport.outputAmbtCtm)
  {
    var item = {};
    item.type = 4; //time/weather result
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.averageExport.avgtZones.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 0; //zone
    //zone node # = zone #
    item.nr = CONTAM.Simread.GetNodeNumber(0, ContamRE.options.averageExport.avgtZones[i]);
    item.s_nr = ContamRE.options.averageExport.avgtZones[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.averageExport.avgtJcts.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 1; //jct
    // jct node # = jct # + number of zones
    item.nr = CONTAM.Simread.GetNodeNumber(1, ContamRE.otpions.averageExport.avgtJcts[i]);
    item.s_nr = ContamRE.otpions.averageExport.avgtJcts[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.averageExport.avgtTerms.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 2; //term
    // jct node # = jct # + number of zones
    item.nr = CONTAM.Simread.GetNodeNumber(2, ContamRE.options.averageExport.avgtTerms[i]);
    item.s_nr = ContamRE.options.averageExport.avgtTerms[i];
    items.push(item);
  }
  var timeInfo = {date0:ContamRE.options.date0, date1:ContamRE.options.date1, 
    time0:ContamRE.options.time0, time1:ContamRE.options.time1};
  CONTAM.Simread.GetResults(items, timeInfo);
  return ContamRE.averageExport.outputAvgtResultItems(items);
}
  
ContamRE.averageExport.doSpatialAvgExport = function()
{
  //spatial average export
  var items = [];
  if(ContamRE.options.averageExport.outputAmbtCtm)
  {
    var item = {};
    item.type = 4; //time/weather result
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.averageExport.savgZones.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 0; //zone
    //zone node # = zone #
    item.nr = CONTAM.Simread.GetNodeNumber(0, ContamRE.options.averageExport.savgZones[i]);
    item.s_nr = ContamRE.options.averageExport.savgZones[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.averageExport.savgJcts.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 1; //jct
    // jct node # = jct # + number of zones
    item.nr = CONTAM.Simread.GetNodeNumber(1, ContamRE.options.averageExport.savgJcts[i]);
    item.s_nr = ContamRE.options.averageExport.savgJcts[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.averageExport.savgTerms.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 2; //term
    // jct node # = jct # + number of zones
    item.nr = CONTAM.Simread.GetNodeNumber(2, ContamRE.options.averageExport.savgTerms[i]);
    item.s_nr = ContamRE.options.averageExport.savgTerms[i];
    items.push(item);
  }
  var timeInfo = {date0:ContamRE.options.date0, date1:ContamRE.options.date1, 
    time0:ContamRE.options.time0, time1:ContamRE.options.time1};
  CONTAM.Simread.GetResults(items, timeInfo);
  return ContamRE.averageExport.outputSAvgResultItems(items);
}

ContamRE.averageExport.outputAvgtResultItems = function(items)
{
  //output time average data
  var outputString = "";
  //headers
  outputString += "Date/Time\t";
  if(ContamRE.options.averageExport.ctmOutputType)
  {
    //ctm By row
    outputString += "Contaminant\t";
    //output ambient
    if(ContamRE.options.averageExport.outputAmbtCtm)
    {
      outputString += "Ambient\t";
    }
    for(var col=0; col<items.length; ++col)
    {
      if(items[col].node_type == 0)//zone
        outputString += "Zone #" + items[col].s_nr + "\t";
      else if(items[col].node_type == 1)//junction
        outputString += "Junction #" + items[col].s_nr + "\t";
      else if(items[col].node_type == 2)//terminal
        outputString += "Terminal #" + items[col].s_nr + "\t";
    }
  }
  else
  {
    //nodes by row
    outputString += "Node\t";
    for(var i=0; i<ContamRE.options.averageExport.selectedCtms.length; ++i)
    {
      var ctm = CONTAM.Project.Ctm[ContamRE.options.averageExport.selectedCtms[i]];
      var unitsString;
      var unitType = CONTAM.Units.GetConcUnitType(ctm);
      
      if(ContamRE.options.averageExport.useContamUnits)
      {
        switch(unitType)
        {
          case CONTAM.Units.Types.Concentration_MP:
            unitsString = CONTAM.Units.Strings.Concentration_MP[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_MDP:
            unitsString = CONTAM.Units.Strings.Concentration_MDP[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_MD:
            unitsString = CONTAM.Units.Strings.Concentration_MD[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_M:
            unitsString = CONTAM.Units.Strings.Concentration_M[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_P:
            unitsString = CONTAM.Units.Strings.Concentration_P[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_N:
            unitsString = CONTAM.Units.Strings.Concentration_N[ctm.ucc];
            break;
        }
      }
      else
      {
        switch(unitType)
        {
          case CONTAM.Units.Types.Concentration_MP:
          case CONTAM.Units.Types.Concentration_MDP:
          case CONTAM.Units.Types.Concentration_P:
            unitsString = CONTAM.Units.Strings.Concentration_P[ContamRE.options.averageExport.particleUnits];
            break;
          case CONTAM.Units.Types.Concentration_MD:
          case CONTAM.Units.Types.Concentration_M:
          case CONTAM.Units.Types.Concentration_N:
            unitsString = CONTAM.Units.Strings.Concentration_N[ContamRE.options.averageExport.gasUnits];
            break;
        }
        
      }
      outputString += ctm.name + " [" + unitsString + "]\t";
    }
  }
  outputString += CONTAM.Project.EOL;
  for(var row=0; row<items.dateTime.length; row+=ContamRE.options.averageExport.timeStepsToAvg)
  {
    if(ContamRE.options.averageExport.ctmOutputType)
    {
      //ctm By row
      for(var row2=0; row2<ContamRE.options.averageExport.selectedCtms.length; ++row2)
      {
        var ctm = CONTAM.Project.Ctm[ContamRE.options.averageExport.selectedCtms[row2]];
        var unitType = CONTAM.Units.GetConcUnitType(ctm);
        var unitsString;
        var unitsValue;
        var unitsFunc;
        
        outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
        outputString += " ";
        outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
        outputString += "\t";
        if(ContamRE.options.averageExport.useContamUnits)
        {
          unitsValue = ctm.ucc;
          switch(unitType)
          {
            case CONTAM.Units.Types.Concentration_MP:
              unitsString = CONTAM.Units.Strings.Concentration_MP[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MP_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MDP:
              unitsString = CONTAM.Units.Strings.Concentration_MDP[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MDP_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MD:
              unitsString = CONTAM.Units.Strings.Concentration_MD[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MD_Convert;
              break;
            case CONTAM.Units.Types.Concentration_M:
              unitsString = CONTAM.Units.Strings.Concentration_M[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_M_Convert;
              break;
            case CONTAM.Units.Types.Concentration_P:
              unitsString = CONTAM.Units.Strings.Concentration_P[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_P_Convert;
              break;
            case CONTAM.Units.Types.Concentration_N:
              unitsString = CONTAM.Units.Strings.Concentration_N[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_N_Convert;
              break;
          }
        }
        else
        {
          switch(unitType)
          {
            case CONTAM.Units.Types.Concentration_MP:
            case CONTAM.Units.Types.Concentration_MDP:
            case CONTAM.Units.Types.Concentration_P:
              unitsString = CONTAM.Units.Strings.Concentration_P[ContamRE.options.averageExport.particleUnits];
              unitsValue = ContamRE.options.averageExport.particleUnits;
              unitsFunc = CONTAM.Units.Concen_P_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MD:
            case CONTAM.Units.Types.Concentration_M:
            case CONTAM.Units.Types.Concentration_N:
              unitsString = CONTAM.Units.Strings.Concentration_N[ContamRE.options.averageExport.gasUnits];
              unitsValue = ContamRE.options.averageExport.gasUnits;
              unitsFunc = CONTAM.Units.Concen_N_Convert;
              break;
          }
        }
        outputString += ctm.name + " [" + unitsString + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          var sum = 0;
          var end = ContamRE.options.averageExport.timeStepsToAvg;
          //handle a partial average at the end of the simulation
          if(end + row >= items.dateTime.length)
            end = items.dateTime.length - row;
          for(var k=0; k<end; ++k)
          {
            sum += items[col].results[row+k].CC[ContamRE.options.averageExport.selectedCtms[row2]];
          }
          var avg = sum / ContamRE.options.averageExport.timeStepsToAvg;
          var concen = unitsFunc(avg, unitsValue, 0, ctm);
          outputString += sprintf("%11.4e\t", concen);
        }
        outputString += CONTAM.Project.EOL;
      }
    }
    else
    {
      //nodes by row
      outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
      outputString += " ";
      outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
      outputString += "\t";
      for(var row2=0; row2<items.length; ++row2)
      {
        if(items[row2].type == 4)
          outputString += "Ambient\t";
        else if(items[row2].node_type == 0)//zone
          outputString += "Zone #" + items[row2].s_nr + "\t";
        else if(items[row2].node_type == 1)//junction
          outputString += "Junction #" + items[row2].s_nr + "\t";
        else if(items[row2].node_type == 2)//terminal
          outputString += "Terminal #" + items[row2].s_nr + "\t";
        for(var col=0; col<ContamRE.options.averageExport.selectedCtms.length; ++col)
        {
          var ctm = CONTAM.Project.Ctm[ContamRE.options.averageExport.selectedCtms[col]];
          var unitType = CONTAM.Units.GetConcUnitType(ctm);
          var unitsValue;
          var unitsFunc;
          
          if(ContamRE.options.averageExport.useContamUnits)
          {
            unitsValue = ctm.ucc;
            switch(unitType)
            {
              case CONTAM.Units.Types.Concentration_MP:
                unitsFunc = CONTAM.Units.Concen_MP_Convert;
                break;
              case CONTAM.Units.Types.Concentration_MDP:
                unitsFunc = CONTAM.Units.Concen_MDP_Convert;
                break;
              case CONTAM.Units.Types.Concentration_MD:
                unitsFunc = CONTAM.Units.Concen_MD_Convert;
                break;
              case CONTAM.Units.Types.Concentration_M:
                unitsFunc = CONTAM.Units.Concen_M_Convert;
                break;
              case CONTAM.Units.Types.Concentration_P:
                unitsFunc = CONTAM.Units.Concen_P_Convert;
                break;
              case CONTAM.Units.Types.Concentration_N:
                unitsFunc = CONTAM.Units.Concen_N_Convert;
                break;
            }
          }
          else
          {
            switch(unitType)
            {
              case CONTAM.Units.Types.Concentration_MP:
              case CONTAM.Units.Types.Concentration_MDP:
              case CONTAM.Units.Types.Concentration_P:
                unitsValue = ContamRE.options.averageExport.particleUnits;
                unitsFunc = CONTAM.Units.Concen_P_Convert;
                break;
              case CONTAM.Units.Types.Concentration_MD:
              case CONTAM.Units.Types.Concentration_M:
              case CONTAM.Units.Types.Concentration_N:
                unitsValue = ContamRE.options.averageExport.gasUnits;
                unitsFunc = CONTAM.Units.Concen_N_Convert;
                break;
            }
            
          }
          var sum = 0;
          var end = ContamRE.options.averageExport.timeStepsToAvg;
          //handle a partial average at the end of the simulation
          if(end + row >= items.dateTime.length)
            end = items.dateTime.length - row;
          for(var k=0; k<end; ++k)
          {
            sum += items[row2].results[row+k].CC[ContamRE.options.averageExport.selectedCtms[col]];
          }
          var avg = sum / ContamRE.options.averageExport.timeStepsToAvg;
          var concen = unitsFunc(avg, unitsValue, 0, ctm);
          outputString += sprintf("%11.4e\t", concen);
        }
        outputString += CONTAM.Project.EOL;
      }
    }
  }
  return outputString;
}

ContamRE.averageExport.outputSAvgResultItems = function(items)
{
  //output ncr data
  var outputString = "";
  //output spatial average group members
  outputString += "Spatial Average of the following: ";
  for(var i=0; i<items.length; ++i)
  {
    if(items[i].node_type == 0)//zone
      outputString += "Zone #" + items[i].s_nr + ", ";
    else if(items[i].node_type == 1)//junction
      outputString += "Junction #" + items[i].s_nr + ", ";
    else if(items[i].node_type == 2)//terminal
      outputString += "Terminal #" + items[i].s_nr + ", ";
  }
  //chop off the last comma
  outputString = outputString.slice(0, -2);
  outputString += CONTAM.Project.EOL;
  //headers
  outputString += "Date/Time\t";
  if(ContamRE.options.averageExport.ctmOutputType)
  {
    //ctm By row
    outputString += "Contaminant\t";
    outputString += "Average\t";
  }
  else
  {
    //nodes by row
    outputString += "Node\t";
    for(var i=0; i<ContamRE.options.averageExport.selectedCtms.length; ++i)
    {
      var ctm = CONTAM.Project.Ctm[ContamRE.options.averageExport.selectedCtms[i]];
      var unitsString;
      var unitType = CONTAM.Units.GetConcUnitType(ctm);
      
      if(ContamRE.options.averageExport.useContamUnits)
      {
        switch(unitType)
        {
          case CONTAM.Units.Types.Concentration_MP:
            unitsString = CONTAM.Units.Strings.Concentration_MP[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_MDP:
            unitsString = CONTAM.Units.Strings.Concentration_MDP[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_MD:
            unitsString = CONTAM.Units.Strings.Concentration_MD[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_M:
            unitsString = CONTAM.Units.Strings.Concentration_M[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_P:
            unitsString = CONTAM.Units.Strings.Concentration_P[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_N:
            unitsString = CONTAM.Units.Strings.Concentration_N[ctm.ucc];
            break;
        }
      }
      else
      {
        switch(unitType)
        {
          case CONTAM.Units.Types.Concentration_MP:
          case CONTAM.Units.Types.Concentration_MDP:
          case CONTAM.Units.Types.Concentration_P:
            unitsString = CONTAM.Units.Strings.Concentration_P[ContamRE.options.averageExport.particleUnits];
            break;
          case CONTAM.Units.Types.Concentration_MD:
          case CONTAM.Units.Types.Concentration_M:
          case CONTAM.Units.Types.Concentration_N:
            unitsString = CONTAM.Units.Strings.Concentration_N[ContamRE.options.averageExport.gasUnits];
            break;
        }
        
      }
      outputString += ctm.name + " [" + unitsString + "]\t";
    }
  }
  outputString += CONTAM.Project.EOL;
  for(var row=0; row<items.dateTime.length; ++row)
  {
    if(ContamRE.options.averageExport.ctmOutputType)
    {
      //ctm By row
      for(var row2=0; row2<ContamRE.options.averageExport.selectedCtms.length; ++row2)
      {
        outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
        outputString += " ";
        outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
        outputString += "\t";
        
        var ctm = CONTAM.Project.Ctm[ContamRE.options.averageExport.selectedCtms[row2]];
        var unitType = CONTAM.Units.GetConcUnitType(ctm);
        var unitsString;
        var unitsValue;
        var unitsFunc;
        
        if(ContamRE.options.averageExport.useContamUnits)
        {
          unitsValue = ctm.ucc;
          switch(unitType)
          {
            case CONTAM.Units.Types.Concentration_MP:
              unitsString = CONTAM.Units.Strings.Concentration_MP[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MP_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MDP:
              unitsString = CONTAM.Units.Strings.Concentration_MDP[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MDP_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MD:
              unitsString = CONTAM.Units.Strings.Concentration_MD[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MD_Convert;
              break;
            case CONTAM.Units.Types.Concentration_M:
              unitsString = CONTAM.Units.Strings.Concentration_M[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_M_Convert;
              break;
            case CONTAM.Units.Types.Concentration_P:
              unitsString = CONTAM.Units.Strings.Concentration_P[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_P_Convert;
              break;
            case CONTAM.Units.Types.Concentration_N:
              unitsString = CONTAM.Units.Strings.Concentration_N[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_N_Convert;
              break;
          }
        }
        else
        {
          switch(unitType)
          {
            case CONTAM.Units.Types.Concentration_MP:
            case CONTAM.Units.Types.Concentration_MDP:
            case CONTAM.Units.Types.Concentration_P:
              unitsString = CONTAM.Units.Strings.Concentration_P[ContamRE.options.averageExport.particleUnits];
              unitsValue = ContamRE.options.averageExport.particleUnits;
              unitsFunc = CONTAM.Units.Concen_P_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MD:
            case CONTAM.Units.Types.Concentration_M:
            case CONTAM.Units.Types.Concentration_N:
              unitsString = CONTAM.Units.Strings.Concentration_N[ContamRE.options.averageExport.gasUnits];
              unitsValue = ContamRE.options.averageExport.gasUnits;
              unitsFunc = CONTAM.Units.Concen_N_Convert;
              break;
          }
        }
        outputString += ctm.name + " [" + unitsString + "]\t";
        var sum = 0;
        var volume_sum = 0;
        for(var col=0; col<items.length; ++col)
        {
          var concen = unitsFunc(
            items[col].results[row].CC[ContamRE.options.averageExport.selectedCtms[row2]],
            unitsValue, 0, ctm);
          var zone_volume = CONTAM.Project.ZoneList[items[col].nr].Vol;
          volume_sum += zone_volume;
          var concen_vol_weighted = concen * zone_volume;
          sum += concen_vol_weighted;
        }
        var avg = sum / volume_sum; //items.length;
        outputString += sprintf("%11.4e\t", avg);
        outputString += CONTAM.Project.EOL;
      }
    }
    else
    {
      outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
      outputString += " ";
      outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
      outputString += "\t";
      //nodes by row
      outputString += "Average\t";
      for(var col=0; col<ContamRE.options.averageExport.selectedCtms.length; ++col)
      {
        var ctm = CONTAM.Project.Ctm[ContamRE.options.averageExport.selectedCtms[col]];
        var unitType = CONTAM.Units.GetConcUnitType(ctm);
        var unitsValue;
        var unitsFunc;
        
        if(ContamRE.averageExport.useContamUnits)
        {
          unitsValue = ctm.ucc;
          switch(unitType)
          {
            case CONTAM.Units.Types.Concentration_MP:
              unitsFunc = CONTAM.Units.Concen_MP_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MDP:
              unitsFunc = CONTAM.Units.Concen_MDP_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MD:
              unitsFunc = CONTAM.Units.Concen_MD_Convert;
              break;
            case CONTAM.Units.Types.Concentration_M:
              unitsFunc = CONTAM.Units.Concen_M_Convert;
              break;
            case CONTAM.Units.Types.Concentration_P:
              unitsFunc = CONTAM.Units.Concen_P_Convert;
              break;
            case CONTAM.Units.Types.Concentration_N:
              unitsFunc = CONTAM.Units.Concen_N_Convert;
              break;
          }
        }
        else
        {
          switch(unitType)
          {
            case CONTAM.Units.Types.Concentration_MP:
            case CONTAM.Units.Types.Concentration_MDP:
            case CONTAM.Units.Types.Concentration_P:
              unitsValue = ContamRE.options.averageExport.particleUnits;
              unitsFunc = CONTAM.Units.Concen_P_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MD:
            case CONTAM.Units.Types.Concentration_M:
            case CONTAM.Units.Types.Concentration_N:
              unitsValue = ContamRE.options.averageExport.gasUnits;
              unitsFunc = CONTAM.Units.Concen_N_Convert;
              break;
          }
        }
        var sum = 0;
        for(var row2=0; row2<items.length; ++row2)
        {
          var concen = unitsFunc(
            items[row2].results[row].CC[ContamRE.options.averageExport.selectedCtms[col]],
            unitsValue, 0, ctm);
          sum += concen;
        }
        var avg = sum / items.length;
        outputString += sprintf("%11.4e\t", avg);
      }
      outputString += CONTAM.Project.EOL;
    }
  }
  return outputString;
}
