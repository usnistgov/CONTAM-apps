//requires
// utils.js - error
// project.js

//this must be used in a worker due to the use of FileReaderSync

if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.Simread = {};
//TODO : write sim file

//create an array buffer and data view for each piece of the sim file then 
//create a blob for that piece then create blob from all of the piece blobs 
//and save

CONTAM.Simread.SetSimFile = function(file)
{
  CONTAM.Simread.file = file;
  CONTAM.Simread.filename = file.name;
  CONTAM.Simread.res_open(1);
}

CONTAM.Simread.readSlice = function(start, end)
{
  var blob = CONTAM.Simread.file.slice(start, end);
  return CONTAM.Simread.readBlob(blob);
}

CONTAM.Simread.readBlob = function(blob)
{
  var reader = new FileReaderSync();
  var result = reader.readAsArrayBuffer(blob);
  return result;
}

// items - what items to get, an array of the following:
// {
//  type - 1 - link flow results, 2 - node flow results, 
//         3 - node mass results, 4 - weather results
//  nr - node/link number
//  results - returns an array of results
// }
// items.dateTime - an array of date and time for each result record
// time info - an object with start and end info: {date0, date1, time0, time1}
CONTAM.Simread.GetResults = function(items, timeInfo)
{
  var dt, ts;
  var sr = CONTAM.Simread;
  var results = [];
  var olddate = sr.date;
  
  //add results arrays to each item
  for(var i=0; i<items.length; ++i)
  {
    items[i].results = [];
  }
  //add date/time stamp array to the items array
  items.dateTime = [];
  
  //handle normal simulations
  if(timeInfo.date0 <= timeInfo.date1)
  {
    //loop through the days
    for(dt = timeInfo.date0; dt<=timeInfo.date1; ++dt)
    {
      //set the day - get the number of time steps
      var ts_day = sr.set_day_ofst(dt);
      // find if any of the time steps in the beginning need to be skipped
      if(dt == timeInfo.date0 && dt == sr.dtres0)
        ts = (timeInfo.time0 - sr.tmres0) / sr.tsres;
      else if(dt == timeInfo.date0)
        ts = timeInfo.time0 / sr.tsres;
      else 
        ts = 0;
      //find the number of time steps for this day if the full time period of the day is not used
      if(dt == timeInfo.date1 && dt == sr.dtres0)
        ts_day = timeInfo.time1 / sr.tsres - sr.tmres0 / sr.tsres;
      else if(dt == timeInfo.date1)
        ts_day = timeInfo.time1 / sr.tsres;
      //the last day has an extra time step
      if(dt == timeInfo.date1)
        ts_day++;
      //loop through the times of the day
      for(; ts<ts_day; ++ts)
      {
        var current_time;
        if(dt == sr.dtres0)
          current_time = sr.tmres0 + ts*sr.tsres;
        else
          current_time = ts*sr.tsres;
        //add date time for this time step
        items.dateTime.push({date:dt, time: current_time});
        //loop through items for each time step
        for(var i=0; i<items.length; ++i)
        {
          items[i].results.push(CONTAM.Simread.GetItem(items[i], ts));
        }
      }
        
    }
  }
  //handle simulations that cross new years
  else
  {
    //loop through the days
    for(dt = timeInfo.date0; dt<=365; ++dt)
    {
      //set the day - get the number of time steps
      var ts_day = sr.set_day_ofst(dt);
      // find if any of the time steps in the beginning need to be skipped
      if(dt == timeInfo.date0 && dt == sr.dtres0)
        ts = (timeInfo.time0 - sr.tmres0) / sr.tsres;
      else if(dt == timeInfo.date0)
        ts = timeInfo.time0 / sr.tsres;
      else 
        ts = 0;
      //find the number of time steps for this day if it's not a full day
      if(dt == timeInfo.date1 && dt == sr.dtres0)
        ts_day = timeInfo.time1 / sr.tsres - sr.tmres0 / sr.tsres;
      else if(dt == timeInfo.date1)
        ts_day = timeInfo.time1 / sr.tsres;
      //loop through the times of the day
      for(; ts<ts_day; ++ts)
      {
        var current_time;
        if(dt == sr.dtres0)
          current_time = sr.tmres0 + ts*sr.tsres;
        else
          current_time = ts*sr.tsres;
        //add date time for this time step
        items.dateTime.push({date:dt, time: current_time});
        //loop through items for each time step
        for(var i=0; i<items.length; ++i)
        {
          items[i].results.push(CONTAM.Simread.GetItem(items[i], ts));
        }
      }
        
    }
    for(dt = 1; dt<=timeInfo.date1; ++dt)
    {
      //set the day - get the number of time steps
      var ts_day = sr.set_day_ofst(dt);
      // find if any of the time steps in the beginning need to be skipped
      if(dt == timeInfo.date0 && dt == sr.dtres0)
        ts = (timeInfo.time0 - sr.tmres0) / sr.tsres;
      else if(dt == timeInfo.date0)
        ts = timeInfo.time0 / sr.tsres;
      else 
        ts = 0;
      //find the number of time steps for this day if it's not a full day
      if(dt == timeInfo.date1 && dt == sr.dtres0)
        ts_day = timeInfo.time1 / sr.tsres - sr.tmres0 / sr.tsres;
      else if(dt == timeInfo.date1)
        ts_day = timeInfo.time1 / sr.tsres;
      //the last day has an extra time step
      if(dt == timeInfo.date1)
        ts_day++;
      //loop through the times of the day
      for(; ts<ts_day; ++ts)
      {
        //add date time for this time step
        items.dateTime.push({date:dt, time: ts*sr.tsres});
        //loop through items for each time step
        for(var i=0; i<items.length; ++i)
        {
          items[i].results.push(CONTAM.Simread.GetItem(items[i], ts));
        }
      }
    }
  }
  sr.nstep = sr.set_day_ofst( olddate );
  sr.date = olddate;
  return results;
  
}

// item - what item to get, one of the following:
// {
//  type - 1 - link flow results, 2 - node flow results, 3 - node mass results, 4 - wthr results
//  nr - node/link number
// }
// time_index - the number of the time step in the current day
CONTAM.Simread.GetItem = function(item, time_index)
{
  if(item.type == 1)
  {
    var pfr = {};
    CONTAM.Simread.read_link_flow(item.nr, time_index, pfr);
    return pfr;
  }
  else if(item.type == 2)
  {
    var pzf = {};
    CONTAM.Simread.read_node_flow(item.nr, time_index, pzf);
    return pzf;
  }
  else if(item.type == 3)
  {
    var pzc = {};
    CONTAM.Simread.read_node_mass(item.nr, time_index, pzc);
    return pzc;
  }
  else if(item.type == 4)
  {
    var pw = {};
    CONTAM.Simread.read_time_wthr(time_index, pw)
    return pw;
  }
}

CONTAM.Simread.read_link_flow = function(link_nr, time_index, pfr)
{
  var offset;  /* desired position in results file */
  var retVal = 1;
  var sr = CONTAM.Simread;

  offset = sr.ofst_res + sr.ofst_day + sr.size_res * time_index + 
    sr.ofst_fsd + sr.size_fsd * link_nr;

  var result = CONTAM.Simread.readSlice(offset, offset + 16);
  var DView = new DataView(result);
  pfr.nr = DView.getInt32(0, true);
  pfr.dP = DView.getFloat32(4, true);
  pfr.Flow0 = DView.getFloat32(8, true);
  pfr.Flow1 = DView.getFloat32(12, true);  

  if( pfr.nr != link_nr )
  {
    retVal = 0;
    CONTAM.error( 2, ".SIM read link flow error");
    //fprintf( _ulog, "read_path_flow: nr %d, ti %d, off %I64d, n %d\n\n",
      //path_nr, time_index, offset, pfr->nr );
    //fflush( _ulog );
  }
  /*
#ifdef DEBUG
  fprintf( _ulog, " read_path_flow: %u bytes to [%p]", sr.size_fsd, pfr );
  fprintf( _ulog, " nr %d %d [%I64d], dP %f, F0 %f, F1 %f\n",
    path_nr, pfr->nr, offset, pfr->dP, pfr->Flow0, pfr->Flow1 );
  fflush( _ulog );
#endif
*/
  return retVal;

}  /* end read_path_flow */

CONTAM.Simread.read_node_flow = function(node_nr, time_index, pzf)
{
  var offset;
  var retVal = 1;
  var sr = CONTAM.Simread;

  offset = sr.ofst_res + sr.ofst_day + sr.size_res * time_index + 
    sr.ofst_zsd + sr.size_zsd * node_nr;
  var result = CONTAM.Simread.readSlice(offset, offset + 16);
  var DView = new DataView(result);
  pzf.nr = DView.getInt32(0, true);
  pzf.T = DView.getFloat32(4, true);
  pzf.P = DView.getFloat32(8, true);
  pzf.dens = DView.getFloat32(12, true);  
  if( pzf.nr != node_nr )
  {
    retVal = 0;
    CONTAM.error(2, ".SIM read node flow error");
    //fprintf( _ulog, "read_zone_results: nr %d, ti %d, off %I64d, n %d\n",
    //  zone_nr, time_index, offset, pzf->nr );
  }
//#ifdef DEBUG
//  fprintf( _ulog, " read_zone_flow: %I64d bytes to [%p]", sr.size_zsd, pzf );
//  fprintf( _ulog, " nr %d %d [%I64d], T %f, P %f, rho %f\n",
//    zone_nr, pzf->nr, offset, pzf->T, pzf->P, pzf->dens );
//  fflush( _ulog );
//#endif
  return retVal;

}  /* end read_zone_flow */

CONTAM.Simread.read_node_mass = function(node_nr, time_index, pzc)
{
  var offset, i, j;
  var retVal = 1;
  var sr = CONTAM.Simread;

  offset = sr.ofst_res + sr.ofst_day + sr.size_res * time_index + 
    sr.ofst_csd + sr.size_csd * node_nr;
  var result = CONTAM.Simread.readSlice(offset, offset + 4 + (CONTAM.Project.nctm * 4));
  var DView = new DataView(result);
  pzc.nr = DView.getInt32(0, true);
  pzc.CC = [];
  j = 1;
  for(i=0; i<CONTAM.Project.nctm; ++i)
  {
    pzc.CC[i] = DView.getFloat32(4 * j, true);
    j++;
  }
  if( pzc.nr != node_nr )
  {
    retVal = 0;
    CONTAM.error( 2, ".SIM read node mass error, node_nr: " + node_nr + 
      ", time_index: " + time_index);
    //fprintf( _ulog, "read_zone_results: nr %d, ti %d, off %I64d, n %d\n",
    //  zone_nr, time_index, offset, pzc->nr );
  }
//#if (DEBUG>0)
//  fprintf( _ulog, " read_zone_mass: %I64d bytes to [%p]", sr.size_csd, pzc );
//  fprintf( _ulog, " nr %d %d [%I64d], CC0 %f, CC1 %f\n",
//    zone_nr, pzc->nr, offset, pzc->CC[0], pzc->CC[1] );
//  fflush( _ulog );
//#endif
  return retVal;

}  /* end read_node_mass */

CONTAM.Simread.read_time_wthr = function(time_index, pw)
{
  var offset;
  var sr = CONTAM.Simread;

  offset = sr.ofst_res + sr.ofst_day + sr.size_res * time_index;
  var result = CONTAM.Simread.readSlice(offset, offset + 24 + (CONTAM.Project.nctm * 4));
  var DView = new DataView(result);
  pw.dayofy = DView.getInt16(0, true);
  pw.daytyp = DView.getInt16(2, true);
  pw.sim_time = DView.getInt32(4, true);
  pw.Tambt = DView.getFloat32(8, true);
  pw.barpres = DView.getFloat32(12, true);
  pw.windspd = DView.getFloat32(16, true);
  pw.winddir = DView.getFloat32(20, true);  
  pw.CC = [];
  j = 6;
  for(i=0; i<CONTAM.Project.nctm; ++i)
  {
    pw.CC[i] = DView.getFloat32(4 * j, true);
    j++;
  }
//#if (DEBUG > 2)
//  fprintf( _ulog, " read_time_wthr: %d [%I64d] [%p], time %ld ",
//    time_index, offset, pw, pw->sim_time );
//  fprintf( _ulog, "%s, T %.1f, Ws %.2f, Wd %g\n",
//    timestr(pw->sim_time), pw->Tambt, pw->windspd, pw->winddir );
//  fflush( _ulog );
//#endif

}  /* end read_time_wthr */

CONTAM.Simread.set_day_ofst = function(date)
{
  var nstep, err=0;
  var sr = CONTAM.Simread;

  if( !sr.pfres && !sr.zcres )
    return 0;

  if( date >= sr.dtres0 )
    sr.ofst_day = (date-sr.dtres0) * sr.size_day;
  else
    sr.ofst_day = (365+date-sr.dtres0) * sr.size_day;
  if( date != sr.dtres0 )                                 /* 1998/11/23 */
    sr.ofst_day -= sr.size_res * (sr.tmres0 / sr.tsres); /* adjust missing hours in 1st day */

  if( sr.dtres1 == sr.dtres0 )
    nstep = ((sr.tmres1 - sr.tmres0) / sr.tsres );
  else if( date == sr.dtres0 )
    nstep = ((86400 - sr.tmres0) / sr.tsres);
  else if( date == sr.dtres1 )
    nstep = (sr.tmres1 / sr.tsres);
  else
    nstep = (86400 / sr.tsres);

//#ifdef DEBUG
//  fprintf( _ulog, "set_day_ofst: date %d, sr.ofst_day %I64d, nstep %d\n",
//    date, sr.ofst_day, nstep );
//#endif
  sr.tim_wthr = {};
  sr.read_time_wthr( 0, sr.tim_wthr );

  if( date == sr.dtres0 )                                 /* 1998/11/23 */
  {
    if( sr.tim_wthr.sim_time != sr.tmres0 ) 
      err = 1;
  }
  else
  {
    if( sr.tim_wthr.sim_time != 0 ) 
      err = 1;
  }

  if( err )                                             /* 1998/11/23 */
  {
    CONTAM.error( 2, "Improper position in results file");
    //fprintf( _ulog, "  date %d - dayofy %d  (dtres0 %d, dtres1 %d)\n",
    //  date, sr.tim_wthr->dayofy, sr.dtres0, sr.dtres1 );
    //fprintf( _ulog, "  sim_tim %ld - (tmres0 %ld, tmres1 %ld)\n",
    //  sr.tim_wthr->sim_time, sr.tmres0, sr.tmres1 );
  }

  return nstep;

}  /* end set_day_ofst */

CONTAM.Simread.res_open = function(flag)
{
  /* flag:  0 = check results file <prj>.SIM;
  1 = open primary results file; */
//  struct stat prj_info, sim_info; /* .PRJ and .SIM file status */
  var m = [];     /* header data */
  var j;
  var file_name; /* temporary file name */
  var prj = CONTAM.Project;
  var sr = CONTAM.Simread;

  sr.ageair = 0;
  /*
//#if LOOPDA
  //pathmerge( file_name, _pdrive, _pdir, _prjname, ".prjl" );
//#else
  pathmerge( file_name, _pdrive, _pdir, _prjname, ".prj" );
//#endif
  stat( file_name, &prj_info );
  pathmerge( file_name, _pdrive, _pdir, prj, ".sim" );
  //  if( stat( _file_name, &sim_info ) ) return 1;
  if( stat( file_name, &sim_info ) != 0 ) return 1;  // WSD bug_154 2000/06/08
  if( flag == 1 )
    if( sim_info.st_mtime < prj_info.st_mtime ) 
      message( 1, " Project file is newer than the .SIM simulation details file", "" );
*/
  //get first slice with the first 17 values of the sim file
  var result = CONTAM.Simread.readSlice(0, 68);
  var DView = new DataView(result);
  
  /* read summary variables - see simout() for the write */
  if( flag == 0 )
  {
    var result;
    j = 0;

    //result = _read( _hsim1, m, 17 * sizeof(I4) );
    var offset = 0;
    m[0] = DView.getInt32(offset, false);//.int32View[offset++];
    m[1] = DView.getInt32(offset + 4, true);//.int32View[offset++];
    m[2] = DView.getInt32(offset + 8, true);//.int32View[offset++];
    m[3] = DView.getInt32(offset + 12, true);//.int32View[offset++];
    m[4] = DView.getInt32(offset + 16, true);//.int32View[offset++];
    m[5] = DView.getInt32(offset + 20, true);//.int32View[offset++];
    m[6] = DView.getInt32(offset + 24, true);//.int32View[offset++];
    m[7] = DView.getInt32(offset + 28, true);//.int32View[offset++];
    m[8] = DView.getInt32(offset + 32, true);//.int32View[offset++];
    m[9] = DView.getInt32(offset + 36, true);//.int32View[offset++];
    m[10] = DView.getInt32(offset + 40, true);//.int32View[offset++];
    m[11] = DView.getInt32(offset + 44, true);//.int32View[offset++];
    m[12] = DView.getInt32(offset + 48, true);//.int32View[offset++];
    m[13] = DView.getInt32(offset + 52, true);//.int32View[offset++];
    m[14] = DView.getInt32(offset + 56, true);//.int32View[offset++];
    m[15] = DView.getInt32(offset + 60, true);//.int32View[offset++];
    m[16] = DView.getInt32(offset + 64, true);//.int32View[offset++];
    offset = 68;    
    
    //if ( result == 0 ) //zero byte file
    //{
    //  return 1;
    //}
    
    if( m[0] != CONTAM.Globals.simfileID ) 
    {
      CONTAM.error( 1,"Results are no longer available. \n(sim file from previous version)");
      return 1;
    }
    if( m[1] != prj.nzone ) j = 1;
    if( m[2] != prj.npath ) j = 1;
    if( m[3] != prj.nctm ) j = 1;
    if( m[4] != prj.njct ) j = 1;
    if( m[5] != prj.ndct ) j = 1;
    if ( j )
      CONTAM.error( 1,"Results are no longer available. \n(number of building components do not match)");
    return j;
  }
  if( flag == 1 )
  {
    //result = _read( _hsim1, m, 17 * sizeof(I4) );
    var offset = 0;
    m[0] = DView.getInt32(offset, true);//.int32View[offset++];
    m[1] = DView.getInt32(offset + 4, true);//.int32View[offset++];
    m[2] = DView.getInt32(offset + 8, true);//.int32View[offset++];
    m[3] = DView.getInt32(offset + 12, true);//.int32View[offset++];
    m[4] = DView.getInt32(offset + 16, true);//.int32View[offset++];
    m[5] = DView.getInt32(offset + 20, true);//.int32View[offset++];
    m[6] = DView.getInt32(offset + 24, true);//.int32View[offset++];
    m[7] = DView.getInt32(offset + 28, true);//.int32View[offset++];
    m[8] = DView.getInt32(offset + 32, true);//.int32View[offset++];
    m[9] = DView.getInt32(offset + 36, true);//.int32View[offset++];
    m[10] = DView.getInt32(offset + 40, true);//.int32View[offset++];
    m[11] = DView.getInt32(offset + 44, true);//.int32View[offset++];
    m[12] = DView.getInt32(offset + 48, true);//.int32View[offset++];
    m[13] = DView.getInt32(offset + 52, true);//.int32View[offset++];
    m[14] = DView.getInt32(offset + 56, true);//.int32View[offset++];
    m[15] = DView.getInt32(offset + 60, true);//.int32View[offset++];
    m[16] = DView.getInt32(offset + 64, true);//.int32View[offset++];
    offset = 68;
    //if ( result == 0 ) //zero byte file
    //{
    //  return 1;
    //}
    if( m[0] != CONTAM.Globals.simfileID ) 
    {
      CONTAM.error( 1,"Results are no longer available. \n(sim file from previous version)");
      return 1;
    }
    sr.tsres = m[6];
    sr.tsresi = 1.0 / sr.tsres;
    sr.nstep_res = 1 + ( 86400 / m[6] );
    sr.dtres0 = m[7];
    sr.tmres0 = m[8];
    sr.dtres1 = m[9];
    sr.tmres1 = m[10];
    sr.pfres = m[11];
    sr.zfres = m[12];
    sr.zcres = m[13];
    sr.nafnd = m[14];
    sr.nccnd = m[15];
    sr.nafpt = m[16];
  }
/*
#ifdef DEBUG
  fprintf( _ulog, "SIM: m0 %ld, nzone %ld, npath %ld, nctm %ld, nstep %d\n",
    m[0], m[1], m[2], m[3], sr.nstep_res );
  fprintf( _ulog, "     dtres0 %d, tmres0 %ld, dtres1 %d, tmres1 %ld\n",
    sr.dtres0, sr.tmres0, sr.dtres1, sr.tmres1 );
  fprintf( _ulog, "     fpres %d, zfres %d, zcres %d\n",
    sr.pfres, sr.zfres, sr.zcres );
  fprintf( _ulog, "     nafnd %d, nccnd %d, nafpt %d\n",
    sr.nafnd, sr.nccnd, sr.nafpt );
  fflush( _ulog);
#endif
*/
  offset = sr.get_stnr(1, offset);

  sr.ofst_res = sr.ofst_sim1 = offset;
  //sr.size_wsd = 2 * sizeof(I2) + sizeof(I4) + (_nctm+4) * sizeof(R4);
  sr.size_wsd =   2 *      2     +     4      + (prj.nctm+4) * 4;
  if( sr.pfres )
    sr.size_fsd = 4 /*sizeof(IX)*/ + 3 * 4/*sizeof(R4)*/;
  else
    sr.size_fsd = 0;
  if( sr.zfres )
    sr.size_zsd = 4/*sizeof(IX)*/ + 3 * 4/*sizeof(R4)*/;
  else
    sr.size_zsd = 0;
  if( sr.zcres )
    sr.size_csd = 4/*sizeof(IX)*/ + prj.nctm * 4/*sizeof(R4)*/;
  else
    sr.size_csd = 0;
  sr.size_res = sr.size_wsd + sr.nafpt * sr.size_fsd
    + (sr.nafnd - 1) * sr.size_zsd + (sr.nccnd - 1) * sr.size_csd;
  sr.size_day = sr.size_res * (sr.nstep_res + 1);
  sr.ofst_fsd = sr.size_wsd - sr.size_fsd;
  sr.ofst_zsd = sr.size_wsd + sr.nafpt * sr.size_fsd - sr.size_zsd;
  sr.ofst_csd = sr.size_wsd + sr.nafpt * sr.size_fsd
    + (sr.nafnd - 1) * sr.size_zsd - sr.size_csd;
    /*
#ifdef DEBUG
  fprintf( _ulog, " sr.size_wsd: %u\n", sr.size_wsd );
  fprintf( _ulog, " sr.size_fsd: %u\n", sr.size_fsd );
  fprintf( _ulog, " sr.size_zsd: %u\n", sr.size_zsd );
  fprintf( _ulog, " sr.size_csd: %u\n", sr.size_csd );
  fprintf( _ulog, " sr.size_res: %I64d\n", sr.size_res );
  fprintf( _ulog, " sr.size_day: %I64d\n", sr.size_day );
  fprintf( _ulog, " sr.ofst_fsd: %I64d\n", sr.ofst_fsd );
  fprintf( _ulog, " sr.ofst_zsd: %I64d\n", sr.ofst_zsd );
  fprintf( _ulog, " sr.ofst_csd: %I64d\n", sr.ofst_csd );
  fprintf( _ulog, " sr.ofst_res: %I64d\n", sr.ofst_res );
  fflush( _ulog);
#endif
*/
  /* allocate data arrays */
  sr.sim_times = [];//alc_v( 0, sr.nstep_res, sizeof(I4), "simt" );
  sr.tim_wthr = {};//alc_e( sr.size_wsd, "timw" );
  if( sr.pfres )
  {
    sr.ddat = [];//alc_v( 0, sr.nafpt+20, sizeof(FDSP_DAT), "ddat" );
    sr.fdat = []//alc_v( 0, sr.nafpt, sizeof(FRES_DAT), "fdat" );
    sr.ftdat = []//alc_v( 0, sr.nstep_res, (IX)sr.size_fsd, "ftdat" );
    sr.ftdat2 = []//alc_v( 0, sr.nstep_res, (IX)sr.size_fsd, "ftdat2" );
  }
  else
  {
    sr.ddat = null;
    sr.fdat = null;
    sr.ftdat = sr.ftdat2 = null;
  }
  if( sr.zfres )
    sr.zdat = [];//alc_v( 0, sr.nafnd, sizeof(ZRES_DAT), "zdat" );
  else
    sr.zdat = null;
  sr.Sx = [];//alc_v( 0, sr.nstep_res, sizeof(IX), "_Sx" );
  sr.Sy = [];//alc_v( 0, sr.nstep_res, sizeof(IX), "_Sy" );
  //fprintf( _ulog, "\nResults " );  2003/12/10

  sr.time_index = 0;
  if( sr.res_new_day( sr.dtres0 ) == 0 )
  {
    /* Error reading .SIM file */
    sr.res_close();
    return 1;
  }
  if ( sr.res_sum() == 0 ) 
  {
    /* Error reading .SIM file */
    sr.res_close();
    return 1;
  }

  return 0;

}  /* end res_open */

CONTAM.Simread.get_stnr = function(paths, offset)
{
  //styp;     /* source type */
  //s_nr;     /* source sequence number */
  var n, i;
  var prj = CONTAM.Project;
  var sr = CONTAM.Simread;
  sr.nterms = 0;
  sr.nleaks = 0;
  var internalOffset = 0; // the offset into the slice contained in DView

  sr.node_styp = [];//alc_v( 1, max, sizeof(IX), "styp-s" );
  sr.node_s_nr = [];//alc_v( 1, max, sizeof(IX), "s_nr-s" );
  sr.link_styp = [];//alc_v( 1, max, sizeof(IX), "styp-s" );
  sr.link_s_nr = [];//alc_v( 1, max, sizeof(IX), "s_nr-s" );

  //get second slice with the cross reference table
  //              flow nodes            concen nodes          airflow links
  var end = 68 + (sr.nafnd * 4 * 2) + (sr.nccnd * 4 * 2) + (sr.nafpt * 4 * 2);
  var result = CONTAM.Simread.readSlice(68, end);
  var DView = new DataView(result);
  
  //_read( hsim, styp+1, sizeof(IX) * _nafnd );
  for(i=1; i<=sr.nafnd; ++i)
  {
    sr.node_styp[i] = DView.getInt32(internalOffset, true);
    offset += 4;
    internalOffset += 4;
  }
  //_read( hsim, s_nr+1, sizeof(IX) * _nafnd );
  for(i=1; i<=sr.nafnd; ++i)
  {
    sr.node_s_nr[i] = DView.getInt32(internalOffset, true);
    offset += 4;
    internalOffset += 4;
  }
  for( n=1; n<=prj.njct; n++ )   // clear all junctions
  {
    prj.JctList[n].afn_nr = 0;
    prj.JctList[n].aft_nr = 0;    // 2005/01/03
    prj.JctList[n].afl_nr = 0;    // 2005/01/03
  }
  for( n=1; n<=sr.nafnd; n++ )
  {
    if( sr.node_s_nr[n] == 0 )
      prj.ambt.afn_nr = n;
    else if( sr.node_styp[n]==0 )   // zone
      prj.ZoneList[sr.node_s_nr[n]].afn_nr = n;
    else if( sr.node_styp[n]==1 )   // junction (some)
      prj.JctList[sr.node_s_nr[n]].afn_nr = n;
    else if( sr.node_styp[n]==2 ) // terminal
      prj.JctList[sr.node_s_nr[n]].afn_nr = n;
    else
      CONTAM.error(2, "Invalid AF node type number");
  }

  // @@@ _nccnd still in usim but it is not used. GNW
  //_read( hsim, styp+1, sizeof(IX) * _nccnd );
  
  //skip since not used - just need to get the offset correct
  offset += 4 * 2 * sr.nccnd;
  internalOffset += 4 * 2 * sr.nccnd;
  /*
  for(i=1; i<=sr.nccnd; ++i)
  {
    sr.node_styp[i] = DView.getInt32(offset, true);
    offset += 4;
    internalOffset += 4;
  }
  //_read( hsim, s_nr+1, sizeof(IX) * _nccnd );
  for(i=1; i<=sr.nccnd; ++i)
  {
    sr.node_s_nr[i] = DView.getInt32(offset, true);
    offset += 4;
    internalOffset += 4;
  }
  */
  
  if( paths )
  {
    //_read( hsim, styp+1, sizeof(IX) * _nafpt );
    for(i=1; i<=sr.nafpt; ++i)
    {
      sr.link_styp[i] = DView.getInt32(internalOffset, true);
      offset += 4;
      internalOffset += 4;
    }
    //_read( hsim, s_nr+1, sizeof(IX) * _nafpt );
    for(i=1; i<=sr.nafpt; ++i)
    {
      sr.link_s_nr[i] = DView.getInt32(internalOffset, true);
      offset += 4;
      internalOffset += 4;
    }
    for( n=1; n<=sr.nafpt; n++ )
    {
      if( sr.link_styp[n]==0 ) // path
      {
        if( prj.PathList[sr.link_s_nr[n]] )
          prj.PathList[sr.link_s_nr[n]].afp_nr = n;
      }
      else if( sr.link_styp[n]==1 ) // duct
      {
        if( prj.DctList[sr.link_s_nr[n]] )
          prj.DctList[sr.link_s_nr[n]].afp_nr = n;
      }
      else if( sr.link_styp[n]==2 ) // term
      {
        sr.nterms++;
        if( prj.JctList[sr.link_s_nr[n]] )
          prj.JctList[sr.link_s_nr[n]].aft_nr = n;
      }
      else if( sr.link_styp[n]==3 ) // leak
      {
        sr.nleaks++;
        if( prj.JctList[sr.link_s_nr[n]] )
          prj.JctList[sr.link_s_nr[n]].afl_nr = n;
      }
      else
        CONTAM.error(2, "Invalid AF path type number");
    }
  }

  return offset;
}  /* End get_stnr() */

CONTAM.Simread.res_new_day = function(date)
{
  var j;
  var sr = CONTAM.Simread;

//#ifdef DEBUG
  //fprintf( _ulog, "res_new_day: %d\n", date );
  //fflush( _ulog);
//#endif
  /* check date */
  if( date > 365 ) date = 1;
  if( date < 1 ) date = 365;
  if( sr.dtres1 >= sr.dtres0 )
  {
    if( date < sr.dtres0 || date > sr.dtres1 )
      date = 0;
  }
  else if( sr.dtres1 < sr.dtres0 )
  {
    if( date < sr.dtres0 && date > sr.dtres1 )
      date = 0;
  }
  if( !date )
  {
    //MessageBeep(MB_ICONEXCLAMATION);
    return 0;
  }

  sr.nstep = sr.set_day_ofst( date );
  sr.date = date;
  if( sr.nstep < 0 )
    CONTAM.error( 3, "date failure");

  //CONTAM.grstatus( " Reading simulation details file", 0 );

  /* set _sim_times */
  for( j=0; j<=sr.nstep; j++ )
  {
    sr.read_time_wthr( j, sr.tim_wthr );
    sr.sim_times[j] = sr.tim_wthr.sim_time;
  }
  if( sr.sim_times[0] == 86400 )
    sr.sim_times[0] = 0;

  return 1;

}  /* end res_new_day */

CONTAM.Simread.res_sum = function()
{
  var i, olddate;
  var sr = CONTAM.Simread;

//#ifdef DEBUG
  //R4 tdiff;
  //fprintf( _ulog, "res_sum\n" );
  //fflush( _ulog);
//#endif

  sr.Fmax = sr.dPmax = 0.0;
  olddate = sr.date;

  if( sr.dtres0 <= sr.dtres1 )
  {
    for ( i=sr.dtres0; i<=sr.dtres1; i++ )
    {
      if ( sr.res_sum_day(i) )
        return 0;
    }
  }
  else
  {
    for ( i=sr.dtres0; i<=365; i++ )
    {
      if ( sr.res_sum_day(i) )
        return 0;
    }
    for ( i=1; i<=sr.dtres1; i++ )
    {
      if ( sr.res_sum_day(i) )
        return 0;
    }
  }
  if( sr.dPmax < 1.0 ) sr.dPmax = 1.0;
  if( sr.Fmax < 0.001 ) sr.Fmax = 0.001;
//#ifdef DEBUG
  //fprintf( _ulog, "dPmax %g, Fmax %g\n", _dPmax, _Fmax );
  //fflush( _ulog);
//#endif
  sr.nstep = sr.set_day_ofst( olddate );
  sr.date = olddate;

//#ifdef DEBUG
  //tdiff = ((R4)clock() / (R4)CLOCKS_PER_SEC) - tdiff;
  //fprintf( _ulog, "Time to read max values of %d airflow paths %f\n", _nafpt, tdiff);
//#endif

//#ifdef YYY
  //flowdP_show();         /* display scales */
//#endif

  return 1;
} /* end res_sum */

CONTAM.Simread.res_close = function()
{
  sr.pfres = sr.zfres = sr.zcres = 0;
}  /* end res_close */

CONTAM.Simread.res_sum_day = function(date)
{
  var j, n;
  var pfd = {};
  var sr = CONTAM.Simread;

  sr.nstep = sr.set_day_ofst( date );
  sr.date = date;
  if( sr.nstep < 0 )
    CONTAM.error( 3, "date failure");

  if( sr.pfres )
  {
    j = sr.nstep + 1;
    for( n=1; n<=sr.nafpt; n++ )
    {
      if( sr.read_link_flow( n, j, pfd ) == 0 )
        return 1;
      if( pfd.Flow0 > sr.Fmax )
        sr.Fmax = pfd.Flow0;
      if( pfd.dP > sr.dPmax )
        sr.dPmax = pfd.dP;
    }
  }

  return 0;
} // end res_sum_day

//return array of jct numbers that are leaks
// must be done after get_stnr which is called by res_open
CONTAM.Simread.getLeaks = function()
{
  var sr = CONTAM.Simread;
  var results = [];
  for( n=1; n<=sr.nafpt; n++ )
  {
    if( sr.link_styp[n]==3 ) // leak
    {
      results.push(sr.link_s_nr[n]);
    }
  }
  return results;  
}

//type: 0=path, 1=duct, 2=term, 3=leak
//the number of the type above
//return the number of the link, -1 if not found
CONTAM.Simread.GetLinkNumber = function(type, number)
{
  var sr = CONTAM.Simread;
  for( n=1; n<=sr.nafpt; n++ )
  {
    if( sr.link_styp[n] == type && sr.link_s_nr[n] == number)
    {
      return n;
    }
  }
  return -1;
}

//type: 0=zone, 1=jct, 2=term
//the number of the type above
//return the number of the node, -1 if not found
CONTAM.Simread.GetNodeNumber = function(type, number)
{
  var sr = CONTAM.Simread;
  for( n=1; n<=sr.nafnd; n++ )
  {
    if(sr.node_styp[n] == type && sr.node_s_nr[n] == number)
    {
      return n;
    }
  }
  return -1;
}