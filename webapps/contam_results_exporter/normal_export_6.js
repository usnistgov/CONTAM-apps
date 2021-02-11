
ContamRE.normalExport.doNormalExport = function(options)
{
  var files = [];
  var sr = CONTAM.Simread;
  var period_index = sr.filename.lastIndexOf(".");
  ContamRE.options = options;
  var zip = new JSZip();
  
  if(options.normalExport.exportCtms)
  {
    var ncrFileContents = ContamRE.normalExport.doNormalCtmExport();
    var ncrfilename = sr.filename.substring(0, period_index) + ".ncr";
    zip.file(ncrfilename, ncrFileContents);
  }
  if(options.normalExport.exportEnv)
  {
    var nfrFileContents = ContamRE.normalExport.doNormalEnvExport();
    var nfrfilename = sr.filename.substring(0, period_index) + ".nfr";
    zip.file(nfrfilename, nfrFileContents);
  }
  if(options.normalExport.exportAF)
  {
    var lfrFileContents = ContamRE.normalExport.doNormalLinkExport();
    var lfrfilename = sr.filename.substring(0, period_index) + ".lfr";
    zip.file(lfrfilename, lfrFileContents);
  }

  var zipcontent = zip.generate({type:"blob"});
  var zipfilename = sr.filename.substring(0, period_index) + " export.zip";
  files.push({name:zipfilename, blob:zipcontent, linktext: "Save Result Zip File"});
  return files;
}

ContamRE.normalExport.doNormalCtmExport = function()
{
  var items = [];
  if(ContamRE.options.normalExport.outputAmbtCtm)
  {
    var item = {};
    item.type = 4; //time/weather result
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.ctmZones.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 0; //zone
    //zone node # = zone #
    item.nr = CONTAM.Simread.GetNodeNumber(0, ContamRE.options.normalExport.ctmZones[i]);
    item.s_nr = ContamRE.options.normalExport.ctmZones[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.ctmJcts.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 1; //jct
    // jct node # = jct # + number of zones
    item.nr = CONTAM.Simread.GetNodeNumber(1, ContamRE.options.normalExport.ctmJcts[i]);
    item.s_nr = ContamRE.options.normalExport.ctmJcts[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.ctmTerms.length; ++i)
  {
    var item = {};
    item.type = 3; //node mass result
    item.node_type = 2; //term
    // jct node # = jct # + number of zones
    item.nr = CONTAM.Simread.GetNodeNumber(2, ContamRE.options.normalExport.ctmTerms[i]);
    item.s_nr = ContamRE.options.normalExport.ctmTerms[i];
    items.push(item);
  }
  var timeInfo = {date0:ContamRE.options.date0, date1:ContamRE.options.date1, 
    time0:ContamRE.options.time0, time1:ContamRE.options.time1};
  CONTAM.Simread.GetResults(items, timeInfo);
  return ContamRE.normalExport.outputCtmResultItems(items);
}

ContamRE.normalExport.outputCtmResultItems = function(items)
{
  //output ncr data
  var outputString = "";
  //headers
  outputString += "Date/Time\t";
  if(ContamRE.options.normalExport.ctmOutputType)
  {
    //ctm By row
    outputString += "Contaminant\t";
    //output ambient
    if(ContamRE.options.normalExport.outputAmbtCtm)
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
    for(var i=0; i<ContamRE.options.normalExport.selectedCtms.length; ++i)
    {
      var ctm = CONTAM.Project.Ctm[ContamRE.options.normalExport.selectedCtms[i]];
      var unitsString;
      var unitType = CONTAM.Units.GetConcUnitType(ctm);
      
      if(ContamRE.options.normalExport.useContamUnits)
      {
        switch(unitType)
        {
          case CONTAM.Units.Types.Concentration_MP:
            unitsString = CONTAM.Units.Strings2.Concentration_MP[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_MDP:
            unitsString = CONTAM.Units.Strings2.Concentration_MDP[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_MD:
            unitsString = CONTAM.Units.Strings2.Concentration_MD[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_M:
            unitsString = CONTAM.Units.Strings2.Concentration_M[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_P:
            unitsString = CONTAM.Units.Strings2.Concentration_P[ctm.ucc];
            break;
          case CONTAM.Units.Types.Concentration_N:
            unitsString = CONTAM.Units.Strings2.Concentration_N[ctm.ucc];
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
            unitsString = CONTAM.Units.Strings2.Concentration_P[ContamRE.options.normalExport.particleUnits];
            break;
          case CONTAM.Units.Types.Concentration_MD:
          case CONTAM.Units.Types.Concentration_M:
          case CONTAM.Units.Types.Concentration_N:
            unitsString = CONTAM.Units.Strings2.Concentration_N[ContamRE.options.normalExport.gasUnits];
            break;
        }
        
      }
      outputString += ctm.name + " [" + unitsString + "]\t";
    }
  }
  outputString += CONTAM.Project.EOL;
  for(var row=0; row<items.dateTime.length; ++row)
  {
    if(ContamRE.options.normalExport.ctmOutputType)
    {
      //ctm By row
      for(var row2=0; row2<ContamRE.options.normalExport.selectedCtms.length; ++row2)
      {
        var ctm = CONTAM.Project.Ctm[ContamRE.options.normalExport.selectedCtms[row2]];
        var unitType = CONTAM.Units.GetConcUnitType(ctm);
        var unitsString;
        var unitsValue;
        var unitsFunc;
        
        outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
        outputString += " ";
        outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
        outputString += "\t";
        if(ContamRE.options.normalExport.useContamUnits)
        {
          unitsValue = ctm.ucc;
          switch(unitType)
          {
            case CONTAM.Units.Types.Concentration_MP:
              unitsString = CONTAM.Units.Strings2.Concentration_MP[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MP_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MDP:
              unitsString = CONTAM.Units.Strings2.Concentration_MDP[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MDP_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MD:
              unitsString = CONTAM.Units.Strings2.Concentration_MD[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_MD_Convert;
              break;
            case CONTAM.Units.Types.Concentration_M:
              unitsString = CONTAM.Units.Strings2.Concentration_M[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_M_Convert;
              break;
            case CONTAM.Units.Types.Concentration_P:
              unitsString = CONTAM.Units.Strings2.Concentration_P[ctm.ucc];
              unitsFunc = CONTAM.Units.Concen_P_Convert;
              break;
            case CONTAM.Units.Types.Concentration_N:
              unitsString = CONTAM.Units.Strings2.Concentration_N[ctm.ucc];
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
              unitsString = CONTAM.Units.Strings2.Concentration_P[ContamRE.options.normalExport.particleUnits];
              unitsValue = ContamRE.options.normalExport.particleUnits;
              unitsFunc = CONTAM.Units.Concen_P_Convert;
              break;
            case CONTAM.Units.Types.Concentration_MD:
            case CONTAM.Units.Types.Concentration_M:
            case CONTAM.Units.Types.Concentration_N:
              unitsString = CONTAM.Units.Strings2.Concentration_N[ContamRE.options.normalExport.gasUnits];
              unitsValue = ContamRE.options.normalExport.gasUnits;
              unitsFunc = CONTAM.Units.Concen_N_Convert;
              break;
          }
        }
        outputString += ctm.name + " [" + unitsString + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          var concen = unitsFunc(
            items[col].results[row].CC[ContamRE.options.normalExport.selectedCtms[row2]],
            unitsValue, 0, ctm);
          outputString += sprintf("%.4e\t", concen);
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
        for(var col=0; col<ContamRE.options.normalExport.selectedCtms.length; ++col)
        {
          var ctm = CONTAM.Project.Ctm[ContamRE.options.normalExport.selectedCtms[col]];
          var unitType = CONTAM.Units.GetConcUnitType(ctm);
          var unitsValue;
          var unitsFunc;
          
          if(ContamRE.options.normalExport.useContamUnits)
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
                unitsValue = ContamRE.options.normalExport.particleUnits;
                unitsFunc = CONTAM.Units.Concen_P_Convert;
                break;
              case CONTAM.Units.Types.Concentration_MD:
              case CONTAM.Units.Types.Concentration_M:
              case CONTAM.Units.Types.Concentration_N:
                unitsValue = ContamRE.options.normalExport.gasUnits;
                unitsFunc = CONTAM.Units.Concen_N_Convert;
                break;
            }
            
          }
          var concen = unitsFunc(
            items[row2].results[row].CC[ContamRE.options.normalExport.selectedCtms[col]],
            unitsValue, 0, ctm);
          outputString += sprintf("%.4e\t", concen);
        }
        outputString += CONTAM.Project.EOL;
      }
    }
  }
  return outputString;
}

ContamRE.normalExport.doNormalEnvExport = function()
{
  var items = [];
  if(ContamRE.options.normalExport.ambtTemp || ContamRE.options.normalExport.ambtPress ||
     ContamRE.options.normalExport.ambtWspd || ContamRE.options.normalExport.ambtWdir)
  {
    var item = {};
    item.type = 4; //time/weather result
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.envZones.length; ++i)
  {
    var item = {};
    item.type = 2; //node flow result
    item.node_type = 0; // zone
    //zone node # = zone #
    item.nr = CONTAM.Simread.GetNodeNumber(0, ContamRE.options.normalExport.envZones[i]);
    item.s_nr = ContamRE.options.normalExport.envZones[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.envJcts.length; ++i)
  {
    var item = {};
    item.type = 2; //node flow result
    item.node_type = 1; // jct
    // jct node # = jct # + number of zones
    item.nr = CONTAM.Simread.GetNodeNumber(1, ContamRE.options.normalExport.envJcts[i]);
    item.s_nr = ContamRE.options.normalExport.envJcts[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.envTerms.length; ++i)
  {
    var item = {};
    item.type = 2; //node flow result
    item.node_type = 2; // term
    // jct node # = jct # + number of zones
    item.nr = CONTAM.Simread.GetNodeNumber(2, ContamRE.options.normalExport.envTerms[i]);
    item.s_nr = ContamRE.options.normalExport.envTerms[i];
    items.push(item);
  }
  var timeInfo = {date0:ContamRE.options.date0, date1:ContamRE.options.date1, 
    time0:ContamRE.options.time0, time1:ContamRE.options.time1};
  CONTAM.Simread.GetResults(items, timeInfo);
  return ContamRE.normalExport.outputEnvResultItems(items);
}

ContamRE.normalExport.outputEnvResultItems = function(items)
{
  //output nfr data
  var outputString = "";
  //headers
  outputString += "Date/Time\t";
  if(ContamRE.options.normalExport.envOutputType)
  {
    //conditions By row
    outputString += "Condition\t";
    for(var col=0; col<items.length; ++col)
    {
      if(items[col].type == 4)
        outputString += "Ambient\t";
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
    if(ContamRE.options.normalExport.ambtTemp)
      outputString += "Ambt Temperature [" + 
        CONTAM.Units.Strings2.Temperature[ContamRE.options.normalExport.TempUnits]  +"]\t";
    if(ContamRE.options.normalExport.ambtPress)
      outputString += "Ambt Pressure [" + 
        CONTAM.Units.Strings2.Pressure[ContamRE.options.normalExport.PressUnits] + "]\t";
    if(ContamRE.options.normalExport.ambtWspd)
      outputString += "Wind Speed [" + 
        CONTAM.Units.Strings2.Speed[ContamRE.options.normalExport.WSUnits] + "]\t";
    if(ContamRE.options.normalExport.ambtWdir)
      outputString += "Wind Direction\t";
    if(ContamRE.options.normalExport.bldgTemp)
      outputString += "Temperature [" + 
        CONTAM.Units.Strings2.Temperature[ContamRE.options.normalExport.TempUnits]  +"]\t";
    if(ContamRE.options.normalExport.bldgDens)
      outputString += "Density [" +
        CONTAM.Units.Strings2.Density[ContamRE.options.normalExport.DensUnits] + "]\t";
    if(ContamRE.options.normalExport.bldgPress)
      outputString += "Pressure [" + 
        CONTAM.Units.Strings2.Pressure[ContamRE.options.normalExport.PressUnits] + "]\t";
  }
  outputString += CONTAM.Project.EOL;
  for(var row=0; row<items.dateTime.length; ++row)
  {
    if(ContamRE.options.normalExport.envOutputType)
    {
      //env condition By row
      outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
      outputString += " ";
      outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
      outputString += "\t";
      
      if(ContamRE.options.normalExport.bldgTemp)
      {
        outputString += "Temperature [" + 
          CONTAM.Units.Strings2.Temperature[ContamRE.options.normalExport.TempUnits] + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          var temp;
          if(items[col].type == 4)
          {
            temp = CONTAM.Units.TemperatureConvert(items[col].results[row].Tambt, 
              ContamRE.options.normalExport.TempUnits, 0);
          }
          else
          {
            temp = CONTAM.Units.TemperatureConvert(items[col].results[row].T, 
              ContamRE.options.normalExport.TempUnits, 0);
          }
          outputString += sprintf("%.3f\t", temp);
        }
        outputString += CONTAM.Project.EOL;
      }

      if(ContamRE.options.normalExport.bldgDens)
      {
        outputString += "Density [" +
          CONTAM.Units.Strings2.Density[ContamRE.options.normalExport.DensUnits] + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          if(items[col].type == 4)
            outputString += "N/A\t";
          else
          {
            var dens = CONTAM.Units.DensityConvert(items[col].results[row].dens,
              ContamRE.options.normalExport.DensUnits, 0);
            outputString += sprintf("%.4f\t", dens);
          }
        }
        outputString += CONTAM.Project.EOL;
      }

      if(ContamRE.options.normalExport.bldgPress)
      {
        outputString += "Pressure [" + 
          CONTAM.Units.Strings2.Pressure[ContamRE.options.normalExport.PressUnits] + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          var press;
          if(items[col].type == 4)
          {
            press = CONTAM.Units.PressureConvert(items[col].results[row].barpres,
              ContamRE.options.normalExport.PressUnits, 0);
          }
          else
          {
            press = CONTAM.Units.PressureConvert(items[col].results[row].P,
              ContamRE.options.normalExport.PressUnits, 0);
          }
          outputString += sprintf("%.1f\t", press);
        }
        outputString += CONTAM.Project.EOL;
      }
      if(ContamRE.options.normalExport.ambtWspd)
      {
        outputString += "Wind Speed [" + 
          CONTAM.Units.Strings2.Speed[ContamRE.options.normalExport.WSUnits] + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          if(items[col].type == 4)
          {
            var ws = CONTAM.Units.SpeedConvert(items[col].results[row].windspd,
              ContamRE.options.normalExport.WSUnits, 0);
            outputString += sprintf("%.2f\t", ws);
          }
          else
            outputString += "N/A\t";
        }
        outputString += CONTAM.Project.EOL;
      }
      if(ContamRE.options.normalExport.ambtWdir)
      {
        outputString += "Wind Direction\t";
        for(var col=0; col<items.length; ++col)
        {
          if(items[col].type == 4)
            outputString += sprintf("%d\t", items[col].results[row].winddir);
          else
            outputString += "N/A\t";
        }
        outputString += CONTAM.Project.EOL;
      }
      
    }
    else
    {
      //nodes by row
      for(var row2=0; row2<items.length; ++row2)
      {
        outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
        outputString += " ";
        outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
        outputString += "\t";
        if(items[row2].type == 4)
          outputString += "Ambient\t";
        if(items[row2].node_type == 0)//zone
          outputString += "Zone #" + items[row2].s_nr + "\t";
        else if(items[row2].node_type == 1)//junction
          outputString += "Junction #" + items[row2].s_nr + "\t";
        else if(items[row2].node_type == 2)//terminal
          outputString += "Terminal #" + items[row2].s_nr + "\t";
        if(ContamRE.options.normalExport.ambtTemp)
        {
          if(items[row2].type == 4)
          {
            var temp = CONTAM.Units.TemperatureConvert(items[row2].results[row].Tambt, 
              ContamRE.options.normalExport.TempUnits, 0);
            outputString += sprintf("%.3f\t", temp);
          }
          else
            outputString += "N/A\t";
        }
        if(ContamRE.options.normalExport.ambtPress)
        {
          if(items[row2].type == 4)
          {
            var press = CONTAM.Units.PressureConvert(items[row2].results[row].barpres, 
              ContamRE.options.normalExport.PressUnits, 0);
            outputString += sprintf("%.1f\t", press);
          }
          else
            outputString += "N/A\t";
        }
        
        if(ContamRE.options.normalExport.ambtWspd)
        {
          if(items[row2].type == 4)
          {
            var ws = CONTAM.Units.SpeedConvert(items[row2].results[row].windspd, 
              ContamRE.options.normalExport.WSUnits, 0);
            outputString += sprintf("%.2f\t", ws);
          }
          else
            outputString += "N/A\t";
        }
        
        if(ContamRE.options.normalExport.ambtWdir)
        {
          if(items[row2].type == 4)
            outputString += sprintf("%d\t", items[row2].results[row].winddir);
          else
            outputString += "N/A\t";
        }
        
        if(ContamRE.options.normalExport.bldgTemp)
        {
          if(items[row2].type == 4)
          {
            outputString += "N/A\t";
          }
          else
          {
            var temp = CONTAM.Units.TemperatureConvert(items[row2].results[row].T, 
              ContamRE.options.normalExport.TempUnits, 0);
            outputString += sprintf("%.3f\t", temp);
          }
        }

        if(ContamRE.options.normalExport.bldgDens)
        {
          if(items[row2].type == 4)
          {
            outputString += "N/A\t";
          }
          else
          {
            var dens = CONTAM.Units.DensityConvert(items[row2].results[row].dens,
              ContamRE.options.normalExport.DensUnits, 0);
            outputString += sprintf("%.4f\t", dens);
          }
        }

        if(ContamRE.options.normalExport.bldgPress)
        {
          if(items[row2].type == 4)
          {
            outputString += "N/A\t";
          }
          else
          {
            var press = CONTAM.Units.PressureConvert(items[row2].results[row].P,
              ContamRE.options.normalExport.PressUnits, 0);
            outputString += sprintf("%12.4e\t", press);
          }
        }
        outputString += CONTAM.Project.EOL;
      }
    }
  }
  return outputString;
}

ContamRE.normalExport.doNormalLinkExport = function()
{
  var items = [];
  for(var i=0; i<ContamRE.options.normalExport.linkPaths.length; ++i)
  {
    var item = {};
    item.type = 1; //link flow result
    item.link_type = 0; //path
    //path link # = path #
    item.nr = CONTAM.Simread.GetLinkNumber(0, ContamRE.options.normalExport.linkPaths[i]);
    item.s_nr = ContamRE.options.normalExport.linkPaths[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.linkDcts.length; ++i)
  {
    var item = {};
    item.type = 1; //link flow result
    item.link_type = 1; //duct
    // duct link # = dct # + number of paths
    item.nr = CONTAM.Simread.GetLinkNumber(1, ContamRE.options.normalExport.linkDcts[i]);
    item.s_nr = ContamRE.options.normalExport.linkDcts[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.linkLeaks.length; ++i)
  {
    var item = {};
    item.type = 1; //link flow result
    item.link_type = 3; //leak
    item.nr = CONTAM.Simread.GetLinkNumber(3, ContamRE.options.normalExport.linkLeaks[i]);
    item.s_nr = ContamRE.options.normalExport.linkLeaks[i];
    items.push(item);
  }
  for(var i=0; i<ContamRE.options.normalExport.linkTerms.length; ++i)
  {
    var item = {};
    item.type = 1; //link flow result
    item.link_type = 2; //term
    item.nr = CONTAM.Simread.GetLinkNumber(2, ContamRE.options.normalExport.linkTerms[i]);
    item.s_nr = ContamRE.options.normalExport.linkTerms[i];
    items.push(item);
  }
  var timeInfo = {date0:ContamRE.options.date0, date1:ContamRE.options.date1, 
    time0:ContamRE.options.time0, time1:ContamRE.options.time1};
  CONTAM.Simread.GetResults(items, timeInfo);
  return ContamRE.normalExport.outputLinkResultItems(items);
}

ContamRE.normalExport.outputLinkResultItems = function(items)
{
  //output lfr data
  var outputString = "";
  //headers
  outputString += "Date/Time\t";
  if(ContamRE.options.normalExport.lnkOutputType)
  {
    //link properties By row
    outputString += "Property\t";
    for(var col=0; col<items.length; ++col)
    {
      if(items[col].link_type == 0)//path
        outputString += "Path #" + items[col].s_nr + "\t";
      else if(items[col].link_type == 1)//duct
        outputString += "Duct #" + items[col].s_nr + "\t";
      else if(items[col].link_type == 2)//terminal
        outputString += "Terminal #" + items[col].s_nr + "\t";
      else if(items[col].link_type == 3)//leak
        outputString += "Leak at Jct #" + items[col].s_nr + "\t";
    }
  }
  else
  {
    //links by row
    outputString += "Link\t";
    if(ContamRE.options.normalExport.deltaP)
      outputString += "Pressure Difference [" + 
        CONTAM.Units.Strings2.PressureDiff[ContamRE.options.normalExport.PressDiffUnits] + "]\t";
    if(ContamRE.options.normalExport.Flow1)
      outputString += "Flow 1 [" + 
        CONTAM.Units.Strings2.Flow[ContamRE.options.normalExport.FlowUnits] + "]\t";
    if(ContamRE.options.normalExport.Flow2)
      outputString += "Flow 2 [" + 
      CONTAM.Units.Strings2.Flow[ContamRE.options.normalExport.FlowUnits] + "]\t";
  }
  outputString += CONTAM.Project.EOL;
  for(var row=0; row<items.dateTime.length; ++row)
  {
    if(ContamRE.options.normalExport.lnkOutputType)
    {
      //link property By row
      if(ContamRE.options.normalExport.deltaP)
      {
        outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
        outputString += " ";
        outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
        outputString += "\t";
        outputString += "Pressure Difference [" + 
          CONTAM.Units.Strings2.PressureDiff[ContamRE.options.normalExport.PressDiffUnits] + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          var press = CONTAM.Units.PressureDiffConvert(items[col].results[row].dP,
            ContamRE.options.normalExport.PressDiffUnits, 0);
          outputString += sprintf("%12.4e\t", press);
        }
        outputString += CONTAM.Project.EOL;
      }

      if(ContamRE.options.normalExport.Flow1)
      {
        outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
        outputString += " ";
        outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
        outputString += "\t";
        outputString += "Flow 1 [" + 
          CONTAM.Units.Strings2.Flow[ContamRE.options.normalExport.FlowUnits] + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          var flow = CONTAM.Units.FlowConvert(items[col].results[row].Flow0,
            ContamRE.options.normalExport.FlowUnits, 0);
          outputString += sprintf("%12.4e\t", flow);
        }
        outputString += CONTAM.Project.EOL;
      }

      if(ContamRE.options.normalExport.Flow2)
      {
        outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
        outputString += " ";
        outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
        outputString += "\t";
        outputString += "Flow 2 [" + 
          CONTAM.Units.Strings2.Flow[ContamRE.options.normalExport.FlowUnits] + "]\t";
        for(var col=0; col<items.length; ++col)
        {
          var flow = CONTAM.Units.FlowConvert(items[col].results[row].Flow1,
            ContamRE.options.normalExport.FlowUnits, 0);
          outputString += sprintf("%12.4e\t", flow);
        }
        outputString += CONTAM.Project.EOL;
      }
    }
    else
    {
      //links by row
      for(var row2=0; row2<items.length; ++row2)
      {
        outputString += CONTAM.DateUtilities.IntDateXToStringDateX(items.dateTime[row].date);
        outputString += " ";
        outputString += CONTAM.TimeUtilities.IntTimeToStringTime(items.dateTime[row].time);
        outputString += "\t";
        if(items[row2].link_type == 0)//path
          outputString += "Path #" + items[row2].s_nr + "\t";
        else if(items[row2].link_type == 1)//duct
          outputString += "Duct #" + items[row2].s_nr + "\t";
        else if(items[row2].link_type == 2)//terminal
          outputString += "Terminal #" + items[row2].s_nr + "\t";
        else if(items[row2].link_type == 3)//leak
          outputString += "Leak at Jct #" + items[row2].s_nr + "\t";
        if(ContamRE.options.normalExport.deltaP)
        {
          var press = CONTAM.Units.PressureDiffConvert(items[row2].results[row].dP,
            ContamRE.options.normalExport.PressDiffUnits, 0);
          outputString += sprintf("%12.4e\t", press);
        }

        if(ContamRE.options.normalExport.Flow1)
        {
          var flow = CONTAM.Units.FlowConvert(items[row2].results[row].Flow0,
            ContamRE.options.normalExport.FlowUnits, 0);
          outputString += sprintf("%12.4e\t", flow);
        }

        if(ContamRE.options.normalExport.Flow2)
        {
          var flow = CONTAM.Units.FlowConvert(items[row2].results[row].Flow1,
            ContamRE.options.normalExport.FlowUnits, 0);
          outputString += sprintf("%12.4e\t", flow);
        }
        outputString += CONTAM.Project.EOL;
      }
    }
  }
  return outputString;
}
