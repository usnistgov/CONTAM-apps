//requires 
// reader.js
// ElementList.js
// units.js 
// icons.js
// upgraders.js
// c24toc30.js
// c30toc31.js
// c31toc32.js

//TODO: replaced alert with throw new Error('') which is better
// but not all of those should throw errors some should just send a message to console
// so need an error function like CONTAM and use the error level to take appropriate action


if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.Project = {};
CONTAM.Project.UNK = -999;
CONTAM.ProjectText = 'empty';
CONTAM.Project.Name = 'untitled';
CONTAM.Project.EOL = "\r\n"; //end of line 

CONTAM.Project.openProject = function (file)
{
  console.log("Reading Project");
  var reader = new FileReaderSync();
  CONTAM.Project.Name = file.name;
  var result = reader.readAsText(file);
  return CONTAM.Project.ParseProject(result);
}

CONTAM.Project.ParseProject = function(projectText)
{
  CONTAM.ProjectText = projectText;
  //CONTAM.LogWrite(CONTAM.ProjectText);
  var retVal = CONTAM.Project.Read();
  if(CONTAM.Project.nctrl > 0)
    CONTAM.Project.ctrl_ptrs();
  return retVal;
}

CONTAM.Project.Read = function ()
{
  var prog, ver, echo;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var u = CONTAM.Project.Upgraders;

  rdr.Init(CONTAM.ProjectText);
  
  prj.ambt=
  { 
    next:null, 
    nr:CONTAM.Globals.AMBT, 
    flags:0, 
    relHt:0.0, 
    Vol:0.0, 
    T0:293.15, 
    P0:0.0, 
    ps:null, 
    pc:null, 
    pk:null,
    pld:null, 
    X1:0.0, 
    Y1:0.0, 
    H1:0.0, 
    X2:0.0, 
    Y2:0.0, 
    H2:0.0, 
    celldx:0.0, 
    axialD:0.0, 
    name: "ambt"
  }
  var current=0;
  var upgrade = 0;

  while(!current)
  {
    prj.prog = rdr.nextword(0);
    prj.ver  = rdr.nextword(0);
    prj.echo = rdr.nextword(0);

    if(prj.prog.length < 7 || prj.prog.substring(0,7) != "ContamW")        // if not "ContamW",
    {
      CONTAM.error( 2, "This does not appear to be a CONTAM Project ");
      break;
    }

    prj.revision = prj.ver[3];
    prj.ver = prj.ver.substring(0,3);
    for(version=CONTAM.Globals.cversion; version>=0; version--)
      if( prj.ver == CONTAM.Globals.versions[version] )
        break;
    if(version < 5)
    {
      CONTAM.error(2, "Cannot upgrade CONTAM projects previous to version 2.4");
      break;
    }
    else if(version < CONTAM.Globals.cversion)
    {
      if(version == 5)
      {
        rdr.Rewind();
        if(u.C24toC30.upgrade())   // Try to read as ContamW 2.4 file
          break;             // Conversion failed.
        prj.ProjectText = u.C24toC30.c30File;
        rdr.Init(prj.ProjectText);
      }
      if(version == 6)
      {
        rdr.Rewind();
        if(u.C30toC31.upgrade())   // Try to read as ContamW 3.0 file
          break;             // Conversion failed.
        prj.ProjectText = u.C30toC31.c31File;
        rdr.Init(prj.ProjectText);
      }
      if(version == 7)
      {
        rdr.Rewind();
        if(u.C31toC32.upgrade())   // Try to read as ContamW 3.0 file
          break;             // Conversion failed.
        prj.ProjectText = u.C31toC32.c32File;
        rdr.Init(prj.ProjectText);
      }
      prj.upgrade = 1;      // Conversion occurred.
      continue;          // PRJ file has been converted to next higher version
    }

    current = 1;
  }  /* end file conversions (while loop) */

  if( !current )
    return 1;


  //fprintf( _ulog, "\nReading project file: %s\n", prjfile );
  rdr.Rewind();
  prj.prog = rdr.nextword(0);
  prj.ver  = rdr.nextword(0);
  prj.echo = rdr.nextword(0);

  if(prj.prog != "ContamW")
  {
    CONTAM.error( 2, "Not a ContamW file");
    return 1;
  }
  prj.revision = prj.ver[3];
  prj.ver = prj.ver.substring(0,3);
  for(version=CONTAM.Globals.cversion; version>=0; version--)
    if(prj.ver == CONTAM.Globals.versions[version])
      break;
  if(version != CONTAM.Globals.cversion)
  {
    CONTAM.error( 2, "This is a ContamW " + prj.ver + " file");
    return 1;
  }
  if(prj.revision > CONTAM.Globals.revision)                            /* 2004/06/04 */
  {
    CONTAM.error(1, "PRJ file may require revision (" + prj.revision + 
      ") of ContamW " + CONTAM.Globals.versions[CONTAM.Globals.cversion]);
  }

  prj.desc = CONTAM.Reader.nextword(3);
  prj.run_read();
  prj.nspcs = prj.spcs_read(true, false);
  prj.nlev = prj.LevelRead();
  prj.ndsch = prj.dschd_read(false);
  prj.nwsch = prj.wschd_read(prj.ndsch, false);
  prj.nwpf  = prj.wind_read(false);
  prj.nkinr = prj.kinetic_read(false);
  prj.nflte = prj.flte_read(false);
  prj.nfilt = prj.filter_read();  
  prj.ncse = prj.cselmt_read(false);
  prj.nafe = prj.afelmt_read(false, false);
  prj.ndfe = prj.afelmt_read(false, true);
  prj.nselmt = prj.ctrlse_read(false);
  prj.nctrl = prj.ctrl_read(0, null);
  prj.nahs = prj.system_read();
  prj.nzone = prj.zone_read();
  prj.npath = prj.path_read();
  prj.njct = prj.jct_read();
  prj.ndct = prj.duct_read();
  
  if( prj.njct > 0 )
    for( j=1; j<=prj.njct; j++ )    /* inter-level ducts */
      if( prj.JctList[j].dnr )
        prj.JctList[j].pdd = prj.DctList[prj.JctList[j].dnr];

  prj.ncss = prj.css_read();
  prj.nosch = prj.oschd_read();
  prj.npexp = prj.pexp_read();
  prj.nnote = prj.note_read();
  return 0;
}

CONTAM.Project.LevelRead = function ()
{
  var i, j, nlev, pld, level, nicon, icon;
  
  nlev = CONTAM.Reader.readIX(1);
  CONTAM.Project.LevList = new Array(nlev+1);
  for( i=1; i<=nlev; i++ )
  {
    level = {};
    level.below = pld;
    if(pld !== undefined)
    {
      pld.above = level;
      pld = level;
    }
    else
      CONTAM.Project.Lev0 = pld = level;
    CONTAM.Project.LevList[i] = level;
     
    level.nr = CONTAM.Reader.readIX(1);
    if(level.nr !== i)
      throw new Error('Level number mis-match');  
    level.refht = CONTAM.Reader.readR4(0);
    level.delht = CONTAM.Reader.readR4(0);
    nicon = CONTAM.Reader.readIX(0);
    level.u_rfht = CONTAM.Reader.readIX(0);
    level.u_dlht = CONTAM.Reader.readIX(0);
    level.name = CONTAM.Reader.nextword(0);
    for(j=nicon; j>0; --j)
    {
      var pid = {};
      pid.icon = CONTAM.Reader.readIX(1);
      pid.col = CONTAM.Reader.readIX(0);
      pid.row = CONTAM.Reader.readIX(0);
      pid.nr = CONTAM.Reader.readIX(0);
      if(level.pid === undefined)
      {
        level.pid = icon = pid;
      }
      else
      {
        icon.next = pid;
        icon = pid;         
      }
    }
  }  
  CONTAM.Project.LevH = pld;
  
  if(CONTAM.Reader.readIX(1) !== CONTAM.Project.UNK)
    throw new Error("PRJ read error - Levels");
  return nlev;
}

CONTAM.Project.run_read = function ()
{
  var j;
  var nrvals;
  var prj = CONTAM.Project;
  var rdr = CONTAM.Reader;

  prj.skheight = rdr.readIX( 1 );      /* SketchPad size */
  prj.skwidth = rdr.readIX( 0 );
  prj.proj_def_units = rdr.readI2( 0 );      /* default units & values */
  prj.proj_def_flows = rdr.readI2( 0 );
  prj.proj_def_T = rdr.readR4( 0 );          /* wind pressure data */
  prj.proj_udefT = rdr.readI2( 0 );
  prj.rel_N = rdr.readR4( 0 );
  prj.wind_H = rdr.readR4( 0 );
  prj.uwH = rdr.readI2( 0 );
  prj.wind_Ao = rdr.readR4( 0 );
  prj.wind_a = rdr.readR4( 0 );
  prj.wPmod = prj.wind_Ao * 
    Math.pow( 0.1*prj.wind_H, prj.wind_a );
  prj.wPmod *= prj.wPmod;

  prj.scale_factor = rdr.readR4(1);
  prj.scale_units = rdr.readI2(0);
  prj.origin_row = rdr.readI2(0);
  prj.origin_col = rdr.readI2(0);
  prj.invert_y_axis = rdr.readI2(0);
  prj.show_geom = rdr.readI2(0);
  
  prj.wthdat = {};
  prj.wthdat.Tambt = rdr.readR4( 1 );   /* weather */
  prj.wthdat.barpres = rdr.readR4( 0 );
  prj.wthdat.windspd = rdr.readR4( 0 );
  prj.wthdat.winddir = rdr.readR4( 0 );
  prj.wthdat.relhum = rdr.readR4( 0 );
  prj.wthdat.daytyp = rdr.readI2( 0 );
  prj.wthdat.uTa = rdr.readI2( 0 );
  prj.wthdat.ubP = rdr.readI2( 0 );
  prj.wthdat.uws = rdr.readI2( 0 );
  prj.wthdat.uwd = rdr.readI2( 0 );

  prj.windat = {};
  prj.windat.Tambt = rdr.readR4( 1 );   /* wind data */
  prj.windat.barpres = rdr.readR4( 0 );
  prj.windat.windspd = rdr.readR4( 0 );
  prj.windat.winddir = rdr.readR4( 0 );
  prj.windat.relhum = rdr.readR4( 0 );
  prj.windat.daytyp = rdr.readI2( 0 );
  prj.windat.uTa = rdr.readI2( 0 );
  prj.windat.ubP = rdr.readI2( 0 );
  prj.windat.uws = rdr.readI2( 0 );
  prj.windat.uwd = rdr.readI2( 0 );

  prj.WTHfile = rdr.nextword(3);  /* weather file */
  prj.WTHfile = prj.FileNameFix(prj.WTHfile);
  prj.CTMfile = rdr.nextword(3);  /* contaminant file */
  prj.CTMfile = prj.FileNameFix(prj.CTMfile);
  prj.CVFfile = rdr.nextword(3);  /* continuous values file */
  prj.CVFfile = prj.FileNameFix(prj.CVFfile);
  prj.DVFfile = rdr.nextword(3);  /* discrete values file */
  prj.DVFfile = prj.FileNameFix(prj.DVFfile);

  prj.PLDdat = {};
  prj.PLDdat.WPCfile = rdr.nextword(3);  /* WPC file */
  prj.PLDdat.WPCfile = prj.FileNameFix(prj.PLDdat.WPCfile );
  prj.PLDdat.EWCfile = rdr.nextword(3);  /* EWC file */
  prj.PLDdat.EWCfile = prj.FileNameFix(prj.PLDdat.EWCfile );
  prj.PLDdat.WPCdesc = rdr.nextword(3);  /* WPC description */
  prj.PLDdat.X0 = rdr.readR4( 1 );
  prj.PLDdat.Y0 = rdr.readR4( 0 );
  prj.PLDdat.Z0 = rdr.readR4( 0 );
  prj.PLDdat.angle = rdr.readR4( 0 );
  prj.PLDdat.u_XYZ = rdr.readI2( 0 );
  prj.PLDdat.epsPath = rdr.readR4( 1 );
  prj.PLDdat.epsSpcs = rdr.readR4( 0 );
  prj.PLDdat.tShift = rdr.readHMS( 0 );
  prj.PLDdat.dStart = rdr.readMDx( 0 );
  prj.PLDdat.dEnd = rdr.readMDx( 0 );

  prj.useWPCwp = rdr.readI2( 0 );
  prj.useWPCmf = rdr.readI2( 0 );
  prj.rcdat = {};
  prj.rcdat.WPC_Trigger = rdr.readI2( 0 );
  prj.useWPC = prj.useWPCmf | prj.useWPCwp;

  prj.locdat = {};
  prj.locdat.latd = rdr.readR4( 1 );    /* site data */
  prj.locdat.sinL = Math.sin( prj.locdat.latd*0.0174532925 ); /* angle: degrees . radians */
  prj.locdat.cosL = Math.cos( prj.locdat.latd*0.0174532925 );
  prj.locdat.lgtd = rdr.readR4( 0 );
  prj.locdat.tznr = rdr.readR4( 0 );
  prj.locdat.altd = rdr.readR4( 0 );
  prj.locdat.Tgrnd = rdr.readR4( 0 );
  prj.locdat.utg = rdr.readI2( 0 );
  prj.locdat.u_a = rdr.readI2( 0 );

  prj.rcdat.sim_af = rdr.readI2( 1 );   /* run control - airflow */
  prj.rcdat.afcalc = rdr.readI2( 0 );
  prj.rcdat.afmaxi = rdr.readI2( 0 );
  prj.rcdat.afrcnvg = rdr.readR4( 0 );
  prj.rcdat.afacnvg = rdr.readR4( 0 );
  prj.rcdat.afrelax = rdr.readR4( 0 );
  prj.rcdat.uac2 = rdr.readI2( 0 );
  prj.rcdat.bldgPres = rdr.readR4( 0 );  // CW 2.4
  prj.rcdat.ubp = rdr.readI2( 0 );       // CW 2.4

  prj.rcdat.afslae = rdr.readI2( 1 );
  prj.rcdat.afrseq = rdr.readI2( 0 );
  prj.rcdat.aflmaxi = rdr.readI2( 0 );
  prj.rcdat.aflcnvg = rdr.readR4( 0 );
  prj.rcdat.aflinit = rdr.readI2( 0 );
  prj.rcdat.Tadj = rdr.readI2( 0 );

  prj.rcdat.sim_mf = rdr.readI2( 1 );   /* run control - mass fractions */
  prj.rcdat.ccmaxi = rdr.readI2( 0 );   /* day-cyclic */
  prj.rcdat.ccrcnvg = rdr.readR4( 0 );
  prj.rcdat.ccacnvg = rdr.readR4( 0 );
  prj.rcdat.ccrelax = rdr.readR4( 0 );
  prj.rcdat.uccc = rdr.readI2( 0 );

  prj.rcdat.mfnmthd = rdr.readI2( 1 );  /* non-trace */
  prj.rcdat.mfnrseq = rdr.readI2( 0 );
  prj.rcdat.mfnmaxi = rdr.readI2( 0 );
  prj.rcdat.mfnrcnvg = rdr.readR4( 0 );
  prj.rcdat.mfnacnvg = rdr.readR4( 0 );
  prj.rcdat.mfnrelax = rdr.readR4( 0 );
  prj.rcdat.mfngamma = rdr.readR4( 0 );
  prj.rcdat.uccn = rdr.readI2( 0 );

  prj.rcdat.mftmthd = rdr.readI2( 1 );  /* trace */
  prj.rcdat.mftrseq = rdr.readI2( 0 );
  prj.rcdat.mftmaxi = rdr.readI2( 0 );
  prj.rcdat.mftrcnvg = rdr.readR4( 0 );
  prj.rcdat.mftacnvg = rdr.readR4( 0 );
  prj.rcdat.mftrelax = rdr.readR4( 0 );
  prj.rcdat.mftgamma = rdr.readR4( 0 );
  prj.rcdat.ucct = rdr.readI2( 0 );

  prj.rcdat.mfcmthd = rdr.readI2( 1 );  /* CVODE  3.1 */
  prj.rcdat.mfcrseq = rdr.readI2( 0 );
  prj.rcdat.mfcmaxi = rdr.readI2( 0 );
  prj.rcdat.mfcrcnvg = rdr.readR4( 0 );
  prj.rcdat.mfcacnvg = rdr.readR4( 0 );
  prj.rcdat.mfcrelax = rdr.readR4( 0 );
  prj.rcdat.uccv = rdr.readI2( 0 );

  prj.rcdat.sim_transportSolver = rdr.readI2( 1 );  /* cvode CW 3.1 */
  prj.rcdat.sim_1dz = rdr.readI2( 0 );  // 2005/01/10
  prj.rcdat.sim_1dd = rdr.readI2( 0 );  // 2005/01/10
  prj.rcdat.celldx = rdr.readR4( 0 );
  prj.rcdat.sim_vjt = rdr.readI2( 0 );
  prj.rcdat.ucdx = rdr.readI2( 0 );

  prj.rcdat.cvode_mthd  = rdr.readIX( 1 ); /* cvode CW 3.1 */
  prj.rcdat.cvode_rcnvg = rdr.readR4( 0 );
  prj.rcdat.cvode_acnvg = rdr.readR4( 0 );
  prj.rcdat.cvode_dtmax = rdr.readR4( 0 );

  prj.rcdat.tsdens = rdr.readI2( 1 );   /* run control - variable density */
  prj.rcdat.tsrelax = rdr.readR4( 0 );
  prj.rcdat.tsmaxi = rdr.readI2( 0 );
  if( prj.rcdat.tsmaxi < 2 )
    prj.rcdat.tsmaxi = 2;
  prj.rcdat.cnvgSS = rdr.readI2( 0 );
  prj.rcdat.densZP = rdr.readI2( 0 );
  prj.rcdat.stackD = rdr.readI2( 0 );
  prj.rcdat.dodMdt = rdr.readI2( 0 );

  prj.rcdat.date_st = rdr.readMD( 1 );  /* run control - start, stop, & step */
  prj.rcdat.time_st = rdr.readHMS( 0 );
  prj.rcdat.date_0 = rdr.readMD( 0 );
  prj.rcdat.time_0 = rdr.readHMS( 0 );
  prj.rcdat.date_1 = rdr.readMD( 0 );
  prj.rcdat.time_1 = rdr.readHMS( 0 );
  prj.rcdat.time_step = rdr.readHMS( 0 );
  prj.rcdat.time_list = rdr.readHMS( 0 );     // 2006/09/13
  prj.rcdat.time_scrn = rdr.readHMS( 0 );

  prj.rcdat.restart = rdr.readI2( 1 );  /* run control - restart */
  prj.rcdat.rstdate = rdr.readMD( 0 );
  prj.rcdat.rsttime = rdr.readHMS( 0 );

  prj.rcdat.list = rdr.readI2( 1 );     /* run control - output */
  prj.doDlg = rdr.readI2( 0 );  // CW 2.2
  prj.rcdat.pfsave = rdr.readIX( 0 );
  prj.rcdat.zfsave = rdr.readIX( 0 );
  prj.rcdat.zcsave = rdr.readIX( 0 );

  prj.rcdat.achvol  = rdr.readIX( 1 );
  prj.rcdat.achsave = rdr.readIX( 0 );
  prj.rcdat.abwsave = rdr.readIX( 0 );
  prj.rcdat.cbwsave = rdr.readIX( 0 );
  prj.rcdat.expsave = rdr.readIX( 0 );
  prj.rcdat.ebwsave = rdr.readIX( 0 );
  prj.rcdat.zaasave = rdr.readIX( 0 );
  prj.rcdat.zbwsave = rdr.readIX( 0 );

  prj.rcdat.rzfsave = rdr.readIX( 1 );
  prj.rcdat.rzmsave = rdr.readIX( 0 );
  prj.rcdat.rz1save = rdr.readIX( 0 );
  prj.rcdat.csmsave = rdr.readIX( 0 );
  prj.rcdat.srfsave = rdr.readIX( 0 );
  prj.rcdat.clgsave = rdr.readIX( 0 );

  prj.rcdat.bcexsave = rdr.readIX( 1 );
  prj.rcdat.dcexsave = rdr.readIX( 0 );
  prj.rcdat.pfsqlsave = rdr.readIX( 0 );
  prj.rcdat.zfsqlsave = rdr.readIX( 0 );
  prj.rcdat.zcsqlsave = rdr.readIX( 0 );

  prj.rcdat.extra = [];
  for( j=0; j<16; j++ )
  {
    prj.rcdat.extra[j] = rdr.readIX( 0 );
  }

  nrvals = rdr.readI2( 1 ); // CW 2.4b
  if( prj.rcdat.nrvals != nrvals )
  {
    prj.rcdat.rvals = [];
    prj.rcdat.nrvals = nrvals;
  }
  for( j=0; j<prj.rcdat.nrvals; j++ )
    prj.rcdat.rvals[j] = rdr.readR4( 0 );
  prj.rcdat.doBldgFlowZ = rdr.readI2( 1 );  // CW 2.4
  prj.rcdat.doBldgFlowD = rdr.readI2( 0 );  // CW 2.4
  prj.rcdat.doBldgFlowC = rdr.readI2( 0 );  // CW 2.4

  prj.rcdat.cfd_ctype   = rdr.readI2( 1 );  // CW 3.0
  prj.rcdat.cfd_convcpl = rdr.readR4( 0 );
  prj.rcdat.cfd_var     = rdr.readI2( 0 );
  rdr.readI2( 0 ); // reference zone
  prj.rcdat.cfd_imax    = rdr.readI2( 0 );
  prj.rcdat.cfd_dtcmo   = rdr.readI2( 0 );

  if( rdr.readI2( 1 ) != CONTAM.Project.UNK )
    throw new Error( "PRJ read error in run read" );
  
}

CONTAM.Project.FileNameFix = function (filename)
{
  var j;

  for( j=0; filename[j]; j++ )        // Terminate search at end of line
    if( filename[j] == '!' ) break;   // or at start of comment '!'.

  while( filename[j-1] == ' ' )       // Backspace through trailing blanks.
    j -= 1;
  filename = filename.substring(0, j); ///TODO: test this
  //filename[j] = '\0';                 // Terminate filename string.
  return filename;

}  /* end FileNameFix */

CONTAM.Project.spcs_read = function(cflag, lib)
{
  var ctmnr = [];
  var nspcs, i, j, spcs_number;
  var tempSpecies;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  if(lib)
    CONTAM.Project.SpcsLib0 = CONTAM.ElementList.CreateList();
  else
    CONTAM.Project.Spcs0 = CONTAM.ElementList.CreateList();
    
  if (cflag)
  {
    prj.nctm = rdr.readIX(1);
    if (prj.nctm > 0)
    {
      ctmnr = [];
      for (i = 0; i < prj.nctm; i++)
        ctmnr[i] = rdr.readIX(0);
    }
  }
  else
    rdr.readI2(1);

  nspcs = rdr.readIX(1);

  for (i = 1; i <= nspcs; i++)
  {
    var pspcs = {};
    pspcs.nr = rdr.readIX( 1 );
    if( pspcs.nr != i ) 
      throw new Error("Species number mis-match: " + i.toString() );
    pspcs.sflag = rdr.readI2( 0 );
    pspcs.ntflag = rdr.readI2( 0 );
    pspcs.molwt = rdr.readR4( 0 );
    pspcs.mdiam = rdr.readR4( 0 );
    pspcs.edens = rdr.readR4( 0 );
    pspcs.decay = rdr.readR4( 0 );
    pspcs.Dm = rdr.readR4( 0 );
    pspcs.ccdef = rdr.readR4( 0 );
    pspcs.Cp = rdr.readR4( 0 );
    pspcs.Kuv = rdr.readR4( 0 );
    pspcs.ucc = rdr.readI2( 0 );
    pspcs.umd = rdr.readI2( 0 );
    pspcs.ued = rdr.readI2( 0 );
    pspcs.udm = rdr.readI2( 0 );
    pspcs.ucp = rdr.readI2( 0 );
    pspcs.name = rdr.nextword(0);
    pspcs.desc = rdr.nextword(3);

    pspcs.sflag = 0;
    if (cflag)
      for (j = 0; j < prj.nctm; j++)
        if (ctmnr[j] == i)
          pspcs.sflag = 1;

    CONTAM.Project.Spcs0.AddNode(pspcs);
  }

  if( prj.nctm > 0 && cflag > 0  )  /* set contaminant pointers */
  {
    CONTAM.Project.Ctm = [];
    for( j=0; j<prj.nctm; j++ )
    {
      CONTAM.Project.Ctm[j] = CONTAM.Project.Spcs0.GetByNumber(ctmnr[j]);
      if( CONTAM.Project.Ctm[j].name == "H2O" )
        CONTAM.Project.wthdat.humindex = j;
    }
    CONTAM.Project.ambt.CC0 = [];
    for( j=0; j<prj.nctm; j++ )
      CONTAM.Project.ambt.CC0[j] = CONTAM.Project.Ctm[j].ccdef;  /* set ambient concentrations */
  }
  
  if (rdr.readI2(1) != CONTAM.Project.UNK)
  {
    throw new Error("PRJ read error in species section");
    return true;
  }
  return false;

}  /* end spcs_read */

CONTAM.Project.dschd_read = function (lib)
{
  var ndsch, i, j;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  ndsch = rdr.readIX( 1 );     /* read day-schedule data */
  if(lib)
    prj.DschLib0 = CONTAM.ElementList.CreateList();
  else
    prj.Dsch0 = CONTAM.ElementList.CreateList();

  for( i=1; i<=ndsch; i++ )
  {
    pds = {};
    pds.nr = rdr.readIX( 1 );
    if( pds.nr != i ) 
      throw new Error( "Day-schedule number mis-match: " + i.toString());

    pds.npts = rdr.readI2( 0 );
    pds.shape = rdr.readI2( 0 );
    pds.nmax = pds.npts;
    pds.utyp = rdr.readI2( 0 );
    pds.ucnv = rdr.readI2( 0 );
    pds.name = rdr.nextword(0);
    pds.desc = rdr.nextword(3);
    pds.time = [];
    pds.ctrl = [];
    for( j=0; j<pds.npts; j++ )  /* read day-schedule points */
    {
      pds.time[j] = rdr.readHMS( 1 );
      pds.ctrl[j] = rdr.readR4( 0 );
    }
    if(lib)
      prj.DschLib0.AddNode(pds);
    else
      prj.Dsch0.AddNode(pds);
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in day schedule section" );

  return ndsch;

}  /* end dschd_read */

CONTAM.Project.wschd_read = function (ndsch, lib)
{
  var nwsch, i, j, k;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  nwsch = rdr.readIX( 1 );     /* read week-schedule data */
  if(lib)
    prj.WschLib0 = CONTAM.ElementList.CreateList();
  else
    prj.Wsch0 = CONTAM.ElementList.CreateList();

  for( i=1; i<=nwsch; i++ )
  {
    var pws = {};
    pws.nr = rdr.readIX( 1 );
    if( pws.nr != i ) 
      throw new Error("Week-schedule number mis-match: " + i.toString() );

    pws.utyp = rdr.readI2( 0 );
    pws.ucnv = rdr.readI2( 0 );
    pws.name = rdr.nextword(0);
    pws.desc = rdr.nextword(3);
    if( pws.utyp == 0 )
      pws.utyp = 1;//NOUNITS;   // fix conversion
    pws.pds = [];
    for( j=0; j<12; j++ )  /* set day-schedule pointers */
    {
      k = rdr.readIX(0);
      if( k<1 || k>ndsch ) 
        throw new Error("Bad day-schedule: " + k.toString() );
      else
        pws.pds[j] = CONTAM.Project.Dsch0.GetByNumber(k);
    }
    if(lib)
      prj.WschLib0.AddNode(pws);
    else
      prj.Wsch0.AddNode(pws);
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in Week Schedule section" );

  return nwsch;

}  /* end wschd_read */

CONTAM.Project.wind_read = function(lib)
{
  var nwpf, i, j;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  nwpf = rdr.readIX( 1 );     /* read wind data */
  if(lib)
    prj.WpfLib0 = CONTAM.ElementList.CreateList();
  else
    prj.Wpf0 = CONTAM.ElementList.CreateList();

  for( i=1; i<=nwpf; i++ )
  {
    var pwp = {};
    pwp.nr = rdr.readIX( 1 );
    if( pwp.nr != i ) 
      throw new Error( "Wind number mis-match: " + i.toString());

    pwp.npts = rdr.readI2( 0 );
    pwp.type = rdr.readI2( 0 );
    pwp.name = rdr.nextword(0);
    pwp.desc = rdr.nextword(3);
    pwp.azm = [];
    pwp.coef = [];
    for( j=0; j<pwp.npts; j++ )  /* read wind data points */
    {
      pwp.azm[j] = rdr.readR4( 1 );
      pwp.coef[j] = rdr.readR4( 0 );
    }
    for( ; j<17; j++ )      /* set unused wind data points */
      pwp.azm[j] = 360.0;
    pwp.coef[pwp.npts-1] = pwp.coef[0];                   /* 2000/07/10 */

    if( pwp.type == 2 )    /* cubic spline interpolation */
    {
      pwp.a = CONTAM.Utils.Create2DArray(pwp.npts, 5);
      //for( j=0; j<pwp.npts; j++ )
        //pwp.a[j] = [];
      if( !CONTAM.Project.wp_ccspl( pwp.npts, pwp.azm, pwp.coef, pwp.a ) )
        pwp.type = 1;      /* revert to simple profile */
    }
    else if( pwp.type == 3 )  /* trigonometric interpolation */
    {
      pwp.cp = [];
      CONTAM.Project.wp_htrig( pwp.npts, pwp.azm, pwp.coef, pwp.cp );
    }
    else
      pwp.type = 1;
    if(lib)
      prj.WpfLib0.AddNode(pwp);
    else
      prj.Wpf0.AddNode(pwp);
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in Wind Pressure Profile section" );

  return nwpf;

}  /* end wind_read */

/***  wp_ccspl.c  ************************************************************/

/*  Compute coefficients of cyclic cubic spline fit to data.
 *  This prepares an array used by SPLINT.C for spline interpolation.
 *  Return 1 for successful fit.
 *  Ref:  C.F. Gerald & P.O. Wheatley, "Applied Numerical Analysis",
 *  3rd Ed., Addison-Wesley, 1984, pp 198-206.
 */

CONTAM.Project.wp_ccspl = function (npts, x, y, a )
/*  npts;  number of points.
 *  x;     vector in independent variable values;  x[i] < x[i+1].
 *  y;     vector of dependent variable values [0..npts-1].
 *  a;     array of spline coefficients [0..npts-1][0..4]:
 *           a[i][0] = x[i], h = x - x[i],
 *           y = a[i][1] + h*(a[i][2] + h*(a[i][3] + h*a[i][4]));
 *  NOTE:  externally use:  R4 **a;
 *                          a = alc_mc( 0, npts-1, 0, 5, sizeof(R4), " " );
 */
{
  var  dx0, dx1, dy0, dy1;
  var c;
  var S;
  var  i, j, nm1, nm2, nm3;
  nm1 = npts - 1;
  nm2 = nm1 - 1;
  nm3 = nm2 - 1;
  if( nm3 < 0 )
  {
    throw new Error("too few data points for spline");
    return 0;
  }

  if( y[nm1] != y[0] )
  {
    throw new Error(" Wind pressure profile data is not periodic");
    return 0;
  }

//#if( DEBUG > 1 )
//  fprintf( _ulog, "wp_ccspl: npts %d\n", npts );
//  for( i=0; i<npts; i++ )
//    fprintf( _ulog, " x %12g,  y %12g\n", x[i], y[i] );
//#endif

  c = CONTAM.Utils.Create2DArray(nm1+1, nm1+1);//alc_mc( 1, nm1, 1, nm1, sizeof(R8), "spln-c" );
  S = [];//alc_v( 0, nm1, sizeof(R8), "spln-S" );

      /* create system of equations for 2nd derivatives at x[i] */
  dx0 = x[nm2]-x[nm3];              /* last row [nm1] */
  dx1 = x[nm1]-x[nm2];
  dy0 = (y[nm2]-y[nm3])/dx0;
  dy1 = (y[nm1]-y[nm2])/dx1;
  c[nm1][nm2] = dx0;
  c[nm1][nm1] = 2.0 * (dx0 + dx1);
  c[nm1][1] = dx1;
  S[nm1] = 6.0 * (dy1 - dy0);
  dx0 = dx1;                        /* first row [1] */
  dy0 = dy1;
  dx1 = x[1]-x[0];
  dy1 = (y[1]-y[0])/dx0;
  c[1][nm1] = dx0;
  c[1][1] = 2.0 * (dx0 + dx1);
  c[1][2] = dx1;
  S[1] = 6.0 * (dy1 - dy0);
  for( i=2; i<nm1; i++ )            /* middle rows [i] */
  {
    dx0 = dx1;
    dy0 = dy1;
    dx1 = x[i]-x[i-1];
    dy1 = (y[i]-y[i-1])/dx1;
    c[i][i-1] = dx0;
    c[i][i] = 2.0 * (dx0 + dx1);
    c[i][i+1] = dx1;
    S[i] = 6.0 * (dy1 - dy0);
  }
     /*  solve equations; S[i] = 2nd derivative at x[i] */
  if( CONTAM.Project.gauss1( c, S, nm1 ) )
  {
    //c = fre_mc( c, 1, nm1, 1, nm1, sizeof(R8), "spln-c" );
    //S = fre_v( S, 0, nm1, sizeof(R8), "spln-S" );
    return 0;
  }
  for( i=0; i<nm1; i++ )
    S[i] = S[i+1];
  S[nm1] = S[0];
  //c = fre_mc( c, 1, nm1, 1, nm1, sizeof(R8), "spln-c" );

     /*  compute spline array coefficients */
  for( i=0; i<nm1; i++ )
  {
    dx0 = x[i+1] - x[i];
    a[i][0] = x[i];
    a[i][1] = y[i];
    a[i][2] = ((y[i+1] - y[i]) / dx0 - (2.0 * S[i] + S[i+1]) * dx0 / 6.0);
    a[i][3] = (0.5 * S[i]);
    a[i][4] = ((S[i+1] - S[i]) / (6.0 * dx0));
    for( j=0; j<5; j++ )
      if( Math.abs( a[i][j] ) < 1.0e-12 )
        a[i][j] = 0.0;
//#if( DEBUG > 1 )
    //fprintf( _ulog, " a %d: %12g %12g %12g %12g %12g\n", i,
             //a[i][0], a[i][1], a[i][2], a[i][3], a[i][4] );
//#endif
  }
  a[nm1][0] = x[nm1];
  a[nm1][1] = y[nm1];
//#if( DEBUG > 1 )
  //  fprintf( _ulog, " a %d: %12g %12g\n", nm1, a[nm1][0], a[nm1][1] );
//#endif

  //S = fre_v( S, 0, nm1, sizeof(R8), "spln-S" );

  return 1;

}  /*  end wp_ccspl  */
  
/***  gauss1.c  **************************************************************/

/*   Solution of simultaneous equations [A] * {x} = {b}.
 *   Using a Gauss elimination algorithm; [A] is not symmetric.
 *   No pivoting!  No scaling!  Return 1 for division by zero!
 *   Elements of [A] stored by rows; factored by row elimination.
 *   Dimensions A[1:N][1:N] and b[1:N].
 *   Best for relatively small problems with diagonal dominance.
 */
CONTAM.Project.gauss1 = function( a, b, neq )
{        
  var n, k, j;
  var d;

  for( n=1; n<=neq; n++ )     /* Gauss row-wise elimination */
  {
    for( k=1; k<n; k++ )
      if( a[n][k] != 0.0 )
      {
        d = a[n][k] *= a[k][k];
        for( j=k+1; j<=neq; j++ )
          a[n][j] -= a[k][j]*d;
      }
    if( Math.abs( a[n][n] ) < Number.EPSILON) //FLT_EPSILON )
      if( a[n][n] == 0.0 )
      {
        throw new Error("Zero on the diagonal, row " + n.toString());
        return 1;
      }
      else
        throw new Error("Near zero on the diagonal, row " + n.toString());
    a[n][n] = 1.0 / a[n][n];
    for( d=0.0, j=1; j<n; j++ )
      d += a[n][j] * b[j];
    b[n] -= d;
  }

  b[neq] *= a[neq][neq];      /* back substitution */
  for( n=neq-1; n; n-- )
  { 
    for( d=0.0, j=n+1; j<=neq; j++)
      d += a[n][j] * b[j];
    b[n] = (b[n] - d) * a[n][n];
  }

  return 0;

}  /*  end of gauss1  */

/***  wp_htrig.c  ************************************************************/

/*  Compute coefficients of harmonic trigonometric fit to data.
 *  Return 1 for successful fit.
 */

CONTAM.Project.wp_htrig = function(npts, x, y, cp )
/*  npts;  number of points.
 *  x;     vector in independent variable values;  x[i] < x[i+1].
 *  y;     vector of dependent variable values [0..npts-1].
 */
{
  var i, n;
  var theta, data = [];

  for( theta=0.0,n=i=0; i<npts; i++ )
    if( Math.abs(x[i]-theta) < 0.01 )
    {
      data[n++] = y[i];
      theta += 90.0;
    }

  if( n==5 )
  {
    cp[0] = data[0] + data[2];
    cp[1] = data[0] - data[2];
    cp[2] = data[1] + data[3];
    cp[3] = data[1] - data[3];
    return 1;
  }
  else
    return 0;

}  /*  end wp_hptrig */

CONTAM.Project.kinetic_read = function(lib)
{
  var nkinr, nkrd, i, j;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var pspcs0;

  nkinr = rdr.readIX( 1 );     /* read kinetic reaction data */
  if(lib)
  {
    pspcs0 = prj.SpcsLib0;
    prj.KinrLib0 = CONTAM.ElementList.CreateList();
  }
  else
  {
    pspcs0 = prj.Spcs0;
    prj.Kinr0 = CONTAM.ElementList.CreateList();
  }

  for( i=1; i<=nkinr; i++ )
  {
    var pkd = null;
    var pkr = {};
    pkr.nr = rdr.readIX( 1 );
    if( pkr.nr != i ) 
      throw new Error("Reaction number mis-match: " + i.toString());
    nkrd = rdr.readIX( 0 );
    pkr.name = rdr.nextword(0);
    pkr.desc = rdr.nextword(3);
    for( j=0; j<nkrd; j++ )
    {
      var buffer;
      var pkt = {};
      if( pkd )
        pkd.next = pkt;    /* build linked list */
      else
        pkr.pkd = pkt;     /* start linked list */
      pkd = pkt;
      buffer = rdr.nextword(1);   /* product species */
      pkd.product = CONTAM.Utils.old_name_chk( pspcs0, buffer );
      buffer = rdr.nextword(0);   /* source species */
      pkd.source = CONTAM.Utils.old_name_chk( pspcs0, buffer );
      pkd.coef = rdr.readR4( 0 );                 /* reaction coefficient */
      if(lib)
        prj.KinrLib0.AddNode(pkr);
      else
        prj.Kinr0.AddNode(pkr);
    }
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in Kinetic Reaction section" );

  return nkinr;

}  /* end kinetic_read */

CONTAM.Project.flte_read = function(lib)
{
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var pspcs0;
  var nflte, j, k;

  nflte = rdr.readIX( 1 );     /* read filter data */
  if(lib)
  {
    prj.FlteLib0 = CONTAM.ElementList.CreateList();
    pspcs0 = prj.SpcsLib0;
  }
  else
  {
    prj.Flte0 = CONTAM.ElementList.CreateList();
    pspcs0 = prj.Spcs0;
  }

  for( j=1; j<=nflte; j++ )
  {
    var buffer;
    var pfe = {};
    pfe.nr = rdr.readIX( 1 );
    if( pfe.nr != j ) 
      throw new Error("Filter element number mis-match: " + j.toString());
    buffer = rdr.nextword(0);
    pfe.ftype = CONTAM.Utils.lin_search( buffer, CONTAM.Globals.flte_names );
    pfe.area = rdr.readR4( 0 );
    pfe.depth = rdr.readR4( 0 );
    pfe.dens = rdr.readR4( 0 );
    pfe.ual = rdr.readI2( 0 );
    pfe.ud = rdr.readI2( 0 );
    pfe.name = rdr.nextword(0);
    pfe.desc = rdr.nextword(3);

    switch( pfe.ftype )
    {
      // MODEL: Constant efficiency filter
      //
      case CONTAM.Globals.FL_CEF: 
      {
        var ped = {};
        pfe.ped = ped;
        ped.nspcs = rdr.readIX( 1 );  // number of species
        if(ped.nspcs > 0)
        {
          ped.spcs = [];
          ped.eff = [];
        }
        for( k=0; k<ped.nspcs; k++ )
        {
          var buffer;
          buffer = rdr.nextword(1);
          ped.spcs[k] = CONTAM.Utils.old_name_chk( pspcs0, buffer );
          ped.eff[k] = rdr.readR4( 0 );  // efficiency
        }
        break;
      } 

      // MODEL: Particle filter curve => efficiency vs. particle diameter
      //
      case CONTAM.Globals.FL_PF0: 
      {
        var ped = {};
        pfe.ped = ped;
        ped.npts = rdr.readI2( 1 );  // number of data points - at least 3
        ped.size = [];
        ped.eff = [];
        ped.usz = rdr.readI2( 0 );
        for( k=0; k<ped.npts; k++ )
        {
          ped.size[k] = rdr.readR4( 1 );
          ped.eff[k] = rdr.readR4( 0 );
        }
        break;
      } 

      // MODEL: Gas filter curve => efficiency vs. filter loading
      //
      case CONTAM.Globals.FL_GF0: 
      {
        var n, npts;
        var ped = {};
        pfe.ped = ped;
        ped.nspcs = rdr.readIX( 1 );
        ped.spcs  = [];
        ped.npts  = [];
        ped.bthru = [];
        ped.load  = [];
        ped.eff   = [];
        for( n=0; n<ped.nspcs; n++ )
        {
          var buffer;
          buffer = rdr.nextword(1);
          ped.spcs[n]  = CONTAM.Utils.old_name_chk( pspcs0, buffer );
          ped.bthru[n] = rdr.readR4( 0 );  // breakthrough efficiency
          ped.npts[n]  = npts = rdr.readI2( 0 );  // number of data points
          ped.load[n]  = [];
          ped.eff[n] = [];
          for( k=0; k<npts; k++ )
          {
            ped.load[n][k] = rdr.readR4( 1 );
            ped.eff[n][k] = rdr.readR4( 0 );
          }
        }
        break;
      } 

      // MODEL: UVGI based on PSU OUT_TU and OUTage {Lau et al.}
      //
      case CONTAM.Globals.FL_UV1: 
      {
        var ped = {};
        pfe.ped = ped;

        // User-input parameters
        ped.Sdes = rdr.readR4( 1 );  // design survivability
        ped.Udes = rdr.readR4( 0 );  // design velocity
        ped.Fdes = rdr.readR4( 0 );  // design mass flow rate
        ped.Kdes = rdr.readR4( 0 );  // design minimum susceptability
        ped.age  = rdr.readI2( 0 );  // use OUTage() model too
        ped.C0 = rdr.readR4( 0 );    // design output coefficients for PSU OUT(T,U) model
        ped.C1 = rdr.readR4( 0 );    //   C0 - C1: yield OUT_TU as percent [0 - 100]
        ped.C2 = rdr.readR4( 0 );
        ped.C3 = rdr.readR4( 0 );
        ped.C4 = rdr.readR4( 0 );
        ped.K0 = rdr.readR4( 0 );    // design output coefficients for PSU OUT(t) model
        ped.K1 = rdr.readR4( 0 );    //   K0, K1: yield OUT_age(t)
        ped.u_Fdes = rdr.readI2( 0 );
        ped.u_Udes = rdr.readI2( 0 );

        // Calculated parameters
        ped.Ades  = (ped.Fdes/(ped.Udes * CONTAM.Units.rho20));   // A = mdot/(rho U) [m2]
        ped.ITdes = (-Math.log(ped.Sdes)/ped.Kdes);        // design dose = It(Tdes,Udes) = -ln(Sdes/Kdes) [J/m2]
        break;
      } 

      // MODEL: Super filter
      //
      case CONTAM.Globals.FL_SPF: 
      {
        var n;
        var pFltes, nsfe;
        nsfe = rdr.readI2( 1 );  // number of simple elements
        pfe.ped =[];
        pFltes = pfe.ped;
        pFltes[0] = nsfe;
        for( n=0; n<nsfe; n++ )
          pFltes[n+1] = rdr.readI2( 0 );  // simple element number
        break;
      } 
      default:
        throw new Error("Invalid filter element type " + pfe.ftype.toString());
    }  /* end element type switch */

    prj.Flte0.AddNode(pfe);
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in the Filter Element section" );

  for( j=1; j<=nflte; j++ )  // set super filter sub-filter pointers
  {
    var n;
    var psl1=null, psl2=null;
    var pfe = prj.Flte0.GetByNumber(j);
    if( pfe.ftype == CONTAM.Globals.FL_SPF )
    {
      var pFltes;
      pFltes = pfe.ped;
      pfe.ped = null;
      for( n=0; n<pFltes[0]; n++ )
      {
        psl2 = {};//alc_ec(block, sizeof(FLTE_SLL), "flte_sll");
        psl2.pflte = prj.Flte0.GetByNumber(pFltes[n+1]);
        if( pfe.ped )
          psl1.next = psl2;
        else
          pfe.ped = psl2;
        psl1 = psl2;
      }
    }
  }
  return nflte;

}  /* end flte_read */

CONTAM.Project.filter_read = function()
{
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var nfilt, i, j, k;
  var buffer;
  var pl2=null;

  nfilt = rdr.readIX( 1 );     /* read filter data */
  
  var pspcs0 = prj.Spcs0;
  prj.FiltList = [];
  
  for( j=1; j<=nfilt; j++ )
  {
    var nload, n;
    var nsfe;
    var pf = {};
    prj.FiltList[j] = pf;
    pf.nr = rdr.readIX( 1 );
    if( pf.nr != j ) 
      throw new Error("Filter number mis-match: " + j.toString());
    i = rdr.readIX( 0 );  // filter element number
    nsfe = rdr.readI2(0); // number of sub-filters
    if( i<1 || i>prj.nflte ) 
      throw new Error("Invalid filter element number: " + i.toString());
    else
      pf.pe = prj.Flte0.GetByNumber(i);
    pf.nsfe = nsfe;
    pf.pl=null;
    for( n=0; n<pf.nsfe; n++ )
    {
      var pl = {};
      if( pf.pl )
        pl2.next = pl;
      else
        pf.pl = pl;
      pl2 = pl;
      pl.tload = rdr.readR4( 0 );    // initial total relative loading
      if( pf.nsfe == 1 )
        pl.pe = pf.pe;
      else
      {
        var i;
        var psl = pf.pe.ped;
        for ( i=0; i<n; i++)
          psl = psl.next;
        pl.pe = psl.pflte;
      }
      nload = rdr.readI2( 0 );    // number of initial loadings
      if(nload > 0)
      {
        var pil=null, pil2;
        for( k=0; k<nload; k++ )
        {
          pil2 = pil;
          pil = {};
          if( pl.pll )
            pil2.next = pil;
          else
            pl.pll = pil;
          buffer =  rdr.nextword(1);
          pil.ps = CONTAM.Utils.old_name_chk( pspcs0, buffer );
          pil.loadi = rdr.readR4( 0 );  // initial relative loading
        }
      }
    }
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in the Filter section" );

  return nfilt;

}  /* end filter_read */

CONTAM.Project.cselmt_read = function(lib)
{
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var pe;   /* element data */
  var ncse, j;
  var buffer;
  var name;

  ncse = rdr.readIX( 1 );    /* read S/S element data */
  if(lib)
  {
    prj.CseLib0 = CONTAM.ElementList.CreateList();
    pspcs0 = prj.SpcsLib0;
  }
  else
  {
    prj.Cse0 = CONTAM.ElementList.CreateList();
    pspcs0 = prj.Spcs0;
  }
  
  for( j=1; j<=ncse; j++ )
  {
    var pe = {};
    pe.nr = rdr.readIX( 1 );
    if( pe.nr != j ) 
      throw new Error("S/S element number mis-match: " + j.toString());
    name = rdr.nextword(0);      /* species name */
    buffer = rdr.nextword(0);      /* element type */
    pe.ctype = CONTAM.Utils.lin_search( buffer, CONTAM.Globals.csse_names );
    if( pe.ctype != CONTAM.Globals.CS_SUP )
      pe.spcs = CONTAM.Utils.old_name_chk( pspcs0, name );
    pe.name = rdr.nextword(0);
    pe.desc = rdr.nextword(3);

    switch (pe.ctype)
    {
      case CONTAM.Globals.CS_CCF: 
      {
        var ped = {};
        pe.ped = ped;
        ped.G = rdr.readR4( 1 );
        ped.D = rdr.readR4( 0 );
        ped.u_G = rdr.readI2( 0 );
        ped.u_D = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_PRS: 
      {
        var ped = {};
        pe.ped = ped;
        ped.G = rdr.readR4( 1 );
        ped.x = rdr.readR4( 0 );
        ped.u_G = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_CUT: 
      {
        var ped = {};
        pe.ped = ped;
        ped.G = rdr.readR4( 1 );
        ped.Co = rdr.readR4( 0 );
        ped.u_G = rdr.readI2( 0 );
        ped.u_C = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_EDS: 
      {
        var ped = {};
        pe.ped = ped;
        ped.G0 = rdr.readR4( 1 );
        ped.k = rdr.readR4( 0 );
        ped.u_G = rdr.readI2( 0 );
        ped.u_k = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_BLS: 
      {
        var ped = {};
        pe.ped = ped;
        ped.hm = rdr.readR4( 1 );
        ped.rho = rdr.readR4( 0 );
        ped.Kp = rdr.readR4( 0 );
        ped.M = rdr.readR4( 0 );
        ped.u_h = rdr.readI2( 0 );
        ped.u_r = rdr.readI2( 0 );
        ped.u_M = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_BRS: 
      {
        var ped = {};
        pe.ped = ped;
        ped.M = rdr.readR4( 1 );
        ped.u_M = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_DVS: 
      {
        var ped = {};
        pe.ped = ped;
        ped.dV = rdr.readR4( 1 );
        ped.dA = rdr.readR4( 0 );
        ped.u_V = rdr.readI2( 0 );
        ped.u_A = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_DRS: 
      {
        var ped = {};
        pe.ped = ped;
        ped.kd = rdr.readR4( 0 );
        ped.u_k = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_DVR: 
      {
        var ped = {};
        pe.ped = ped;
        ped.dV = rdr.readR4( 1 );
        ped.R  = rdr.readR4( 0 );
        ped.dA = rdr.readR4( 0 );
        ped.rA = rdr.readR4( 0 );
        ped.u_V  = rdr.readI2( 0 );
        ped.u_R  = rdr.readI2( 0 );
        ped.u_dA = rdr.readI2( 0 );
        ped.u_rA = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_SXD: 
      {
        var ped = {};
        pe.ped = ped;
        ped.a = rdr.readR4( 1 );
        ped.d = rdr.readR4( 0 );
        break;
      }
      case CONTAM.Globals.CS_DXD: 
      {
        var ped = {};
        pe.ped = ped;
        ped.a1 = rdr.readR4( 1 );
        ped.d1 = rdr.readR4( 0 );
        ped.a2 = rdr.readR4( 0 );
        ped.d2 = rdr.readR4( 0 );
        break;
      }
      case CONTAM.Globals.CS_PLM: 
      {
        var ped = {};
        pe.ped = ped;
        ped.a = rdr.readR4( 1 );
        ped.b = rdr.readR4( 0 );
        ped.tp = rdr.readR4( 0 );
        ped.u_a = rdr.readI2( 0 );
        ped.u_tp = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_PKM: 
      {
        var ped = {};
        pe.ped = ped;
        ped.a = rdr.readR4( 1 );
        ped.b = rdr.readR4( 0 );
        ped.tp = rdr.readR4( 0 );
        ped.u_a = rdr.readI2( 0 );
        ped.u_tp = rdr.readI2( 0 );
        break;
      }
      case CONTAM.Globals.CS_SUP: 
      {
        var n;
        var ped = {};
        pe.ped = ped;
        ped.nsselts = rdr.readIX( 1 );
        ped.ssenr = [];
        for( n=0; n<ped.nsselts; n++ )
          ped.ssenr[n] = rdr.readIX( 0 );
        break;
      }

      default:
        throw new Error("Invalid S/S element type " + pe.ctype.toString());
    }  /* end element type switch */

    if(lib)
      prj.CseLib0.AddNode(pe);
    else
      prj.Cse0.AddNode(pe);
  }  /* end element loop */

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in S/S element section" );

  var pse, pe0;
  if(lib)
    pe0 = prj.CseLib0.start;
  else
    pe0 = prj.Cse0.start;
  for( pse=pe0; pse; pse=pse.next )  // set super source sub-source pointers
  {
    var n;
    var psl1=null, psl2=null;
    if( pse.ctype == CONTAM.Globals.CS_SUP )
    {
      var pCSEs;
      pCSEs = pse.ped;
      pse.ped = null;
      for( n=0; n<pCSEs[0]; n++ )
      {
        psl2 = {};
        if(lib)
          psl2.pcse = prj.CseLib0.GetByNumber(pCSEs[n+1]);
        else
          psl2.pcse = prj.Cse0.GetByNumber(pCSEs[n+1]);
        if( pse.ped )
          psl1.next = psl2;
        else
          pse.ped = psl2;
        psl1 = psl2;
      }
    }
  }

  return ncse;

}  /* end cselmt_read */

CONTAM.Project.afelmt_read = function(lib, duct)
{
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var pe;   /* element data */
  var buffer;
  var nafe, i, j;

  nafe = rdr.readIX( 1 );    /* read airflow element data */
  if(duct)
  {
    prj.DfeLib0 = CONTAM.ElementList.CreateList();
    prj.Dfe0 = CONTAM.ElementList.CreateList();
  }
  else
  {
    prj.AfeLib0 = CONTAM.ElementList.CreateList();
    prj.Afe0 = CONTAM.ElementList.CreateList();
  }

  for( i=1; i<=nafe; i++ )
  {
    pe = {};

    pe.nr = rdr.readIX( 1 );
    if( pe.nr != i ) 
      throw new Error("Element number mis-match: " + i.toString());
    pe.icon = rdr.readI2( 0 );
    buffer = rdr.nextword(0);
    pe.dtype = CONTAM.Utils.lin_search( buffer, CONTAM.Globals.afe_dnames );
    pe.name = rdr.nextword(0);
    pe.desc = rdr.nextword(3);

    switch (pe.dtype )
    {
      case CONTAM.Globals.PL_ORFC: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.area = rdr.readR4( 0 );
        ped.dia = rdr.readR4( 0 );
        ped.coef = rdr.readR4( 0 );
        ped.Re = rdr.readR4( 0 );
        ped.u_A = rdr.readI2( 0 );
        ped.u_D = rdr.readI2( 0 );
        ped.dia = Math.sqrt(1.273240 * ped.area);    // 2003/12/01
        ped.lam = CONTAM.Project.setLamCoef( ped.turb, ped.expt,
          ped.area, ped.dia, ped.Re, 1, pe.name );
        break;
      } 
      case CONTAM.Globals.PL_LEAK1:
      case CONTAM.Globals.PL_LEAK2:
      case CONTAM.Globals.PL_LEAK3: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.coef = rdr.readR4( 0 );
        ped.pres = rdr.readR4( 0 );
        ped.area1 = rdr.readR4( 0 );
        ped.area2 = rdr.readR4( 0 );
        ped.area3 = rdr.readR4( 0 );
        ped.u_A1 = rdr.readI2( 0 );
        ped.u_A2 = rdr.readI2( 0 );
        ped.u_A3 = rdr.readI2( 0 );
        ped.u_dP = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.PL_CONN: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.area = rdr.readR4( 0 );
        ped.coef = rdr.readR4( 0 );
        ped.u_A = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.PL_CRACK: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.length = rdr.readR4( 0 );
        ped.width = rdr.readR4( 0 );
        ped.u_L = rdr.readI2( 0 );
        ped.u_W = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.PL_TEST1: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.dP = rdr.readR4( 0 );
        ped.Flow = rdr.readR4( 0 );
        ped.u_P = rdr.readI2( 0 );
        ped.u_F = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.PL_TEST2: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.dP1 = rdr.readR4( 0 );
        ped.F1 = rdr.readR4( 0 );
        ped.dP2 = rdr.readR4( 0 );
        ped.F2 = rdr.readR4( 0 );
        ped.u_P1 = rdr.readI2( 0 );
        ped.u_F1 = rdr.readI2( 0 );
        ped.u_P2 = rdr.readI2( 0 );
        ped.u_F2 = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.PL_STAIR: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.Ht = rdr.readR4( 0 );
        ped.area = rdr.readR4( 0 );
        ped.peo = rdr.readR4( 0 );
        ped.tread = rdr.readI2( 0 );
        ped.u_A = rdr.readI2( 0 );
        ped.u_D = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.PL_SHAFT: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.Ht = rdr.readR4( 0 );
        ped.area = rdr.readR4( 0 );
        ped.perim = rdr.readR4( 0 );
        ped.rough = rdr.readR4( 0 );
        ped.u_A = rdr.readI2( 0 );
        ped.u_D = rdr.readI2( 0 );
        ped.u_P = rdr.readI2( 0 );
        ped.u_R = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.PL_QCN: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.PL_FCN: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.QF_QAB: 
      {
        var ped = {};
        pe.ped = ped;
        ped.a = rdr.readR4( 1 );
        ped.b = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.QF_FAB: 
      {
        var ped = {};
        pe.ped = ped;
        ped.a = rdr.readR4( 1 );
        ped.b = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.QF_CRACK: 
      {
        var ped = {};
        pe.ped = ped;
        ped.a = rdr.readR4( 1 );
        ped.b = rdr.readR4( 0 );
        ped.length = rdr.readR4( 0 );
        ped.width = rdr.readR4( 0 );
        ped.depth = rdr.readR4( 0 );
        ped.nB = rdr.readI2( 0 );
        ped.u_L = rdr.readI2( 0 );
        ped.u_W = rdr.readI2( 0 );
        ped.u_D = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.QF_TEST2: 
      {
        var ped = {};
        pe.ped = ped;
        ped.a = rdr.readR4( 1 );
        ped.b = rdr.readR4( 0 );
        ped.dP1 = rdr.readR4( 0 );
        ped.F1 = rdr.readR4( 0 );
        ped.dP2 = rdr.readR4( 0 );
        ped.F2 = rdr.readR4( 0 );
        ped.u_P1 = rdr.readI2( 0 );
        ped.u_F1 = rdr.readI2( 0 );
        ped.u_P2 = rdr.readI2( 0 );
        ped.u_F2 = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.DR_DOOR: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.dTmin = rdr.readR4( 0 );
        ped.ht = rdr.readR4( 0 );
        ped.wd = rdr.readR4( 0 );
        ped.cd = rdr.readR4( 0 );
        ped.u_T = rdr.readI2( 0 );
        ped.u_H = rdr.readI2( 0 );
        ped.u_W = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.DR_PL2: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.dH = rdr.readR4( 0 );
        ped.ht = rdr.readR4( 0 );
        ped.wd = rdr.readR4( 0 );
        ped.cd = rdr.readR4( 0 );
        ped.u_H = rdr.readI2( 0 );
        ped.u_W = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.PL_BDQ: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.Cp = rdr.readR4( 0 );
        ped.xp = rdr.readR4( 0 );
        ped.Cn = rdr.readR4( 0 );
        ped.xn = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.PL_BDF: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.Cp = rdr.readR4( 0 );
        ped.xp = rdr.readR4( 0 );
        ped.Cn = rdr.readR4( 0 );
        ped.xn = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.SR_JWA: 
      {
        var ped = {};
        pe.ped = ped;
        ped.F0 = rdr.readR4( 1 );
        ped.P0 = rdr.readR4( 0 );
        ped.f = rdr.readR4( 0 );
        ped.u_F0 = rdr.readI2( 0 );
        ped.u_P0 = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.FN_CMF: 
      {
        var ped = {};
        pe.ped = ped;
        ped.Flow = rdr.readR4( 1 );
        ped.u_F = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.FN_CVF: 
      {
        var ped = {};
        pe.ped = ped;
        ped.Flow = rdr.readR4( 1 );
        ped.u_F = rdr.readI2( 0 );
        break;
      } 
      case CONTAM.Globals.FN_FAN: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.rdens = rdr.readR4( 0 );
        ped.fdf = rdr.readR4( 0 );
        ped.sop = rdr.readR4( 0 );
        ped.off = rdr.readR4( 0 );
        ped.fpc = [];
        ped.fpc[0] = rdr.readR4( 1 );
        ped.fpc[1] = rdr.readR4( 0 );
        ped.fpc[2] = rdr.readR4( 0 );
        ped.fpc[3] = rdr.readR4( 0 );
        ped.npts = rdr.readI2( 0 );
        ped.Sarea = rdr.readR4( 0 );
        ped.u_Sa = rdr.readI2( 0 );
        ped.mF = [];
        ped.u_mF = [];
        ped.dP = [];
        ped.u_dP = [];
        ped.rP = [];
        ped.u_rP = [];
        for( j=0; j<ped.npts; j++ )
        {
          ped.mF[j] = rdr.readR4( 1 );
          ped.u_mF[j] = rdr.readI2( 0 );
          ped.dP[j] = rdr.readR4( 0 );
          ped.u_dP[j] = rdr.readI2( 0 );
          ped.rP[j] = rdr.readR4( 0 );
          ped.u_rP[j] = rdr.readI2( 0 );
        }
        break;
      } 
      case CONTAM.Globals.DD_DWC: 
      {
        var ped = {};
        pe.ped = ped;
        ped.rough = rdr.readR4( 1 );
        ped.lam = rdr.readR4( 0 );
        ped.u_R = rdr.readI2( 0 );
        ped.dd = {};
        CONTAM.Project.dfedat_read( ped.dd );
        ped.hdia = ped.dd.hdia;
        ped.area = ped.dd.area;
        ped.ed = ped.rough / ped.hdia;
        break;
      } 
      case CONTAM.Globals.DD_PLR: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.area = rdr.readR4( 0 );
        ped.dia = rdr.readR4( 0 );
        ped.coef = rdr.readR4( 0 );
        ped.u_A = rdr.readI2( 0 );
        ped.u_D = rdr.readI2( 0 );
        ped.dia = Math.sqrt(1.273240 * ped.area);    // 2003/12/01
        ped.lam = CONTAM.Project.setLamCoef( ped.turb, ped.expt,
          ped.area, ped.dia, CONTAM.Units.RE_LT, 1, pe.name );
        ped.dd = {};
        CONTAM.Project.dfedat_read( ped.dd );
        break;
      } 
      case CONTAM.Globals.DD_FCN: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.dd = {};
        CONTAM.Project.dfedat_read(ped.dd);
        break;
      } 
      case CONTAM.Globals.DD_QCN: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.dd = {};
        CONTAM.Project.dfedat_read(ped.dd);
        break;
      } 
      case CONTAM.Globals.DD_FAN: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.turb = rdr.readR4( 0 );
        ped.expt = rdr.readR4( 0 );
        ped.rdens = rdr.readR4( 0 );
        ped.fdf = rdr.readR4( 0 );
        ped.sop = rdr.readR4( 0 );
        ped.off = rdr.readR4( 0 );
        ped.fpc = [];
        ped.fpc[0] = rdr.readR4( 1 );
        ped.fpc[1] = rdr.readR4( 0 );
        ped.fpc[2] = rdr.readR4( 0 );
        ped.fpc[3] = rdr.readR4( 0 );
        ped.npts = rdr.readI2( 0 );
        ped.Sarea = rdr.readR4( 0 );
        ped.u_Sa = rdr.readI2( 0 );
        ped.mF = [];
        ped.u_mF = [];
        ped.dP = [];
        ped.u_dP = [];
        ped.rP = [];
        ped.u_rP = [];
        for( j=0; j<ped.npts; j++ )
        {
          ped.mF[j] = rdr.readR4( 1 );
          ped.u_mF[j] = rdr.readI2( 0 );
          ped.dP[j] = rdr.readR4( 0 );
          ped.u_dP[j] = rdr.readI2( 0 );
          ped.rP[j] = rdr.readR4( 0 );
          ped.u_rP[j] = rdr.readI2( 0 );
        }
        ped.dd = {};
        CONTAM.Project.dfedat_read(ped.dd);
        break;
      } 
      case CONTAM.Globals.DD_CMF: 
      {
        var ped = {};
        pe.ped = ped;
        ped.Flow = rdr.readR4( 1 );
        ped.u_F = rdr.readI2( 0 );
        ped.dd = {};
        CONTAM.Project.dfedat_read(ped.dd);
        break;
      } 
      case CONTAM.Globals.DD_CVF: 
      {
        var ped = {};
        pe.ped = ped;
        ped.Flow = rdr.readR4( 1 );
        ped.u_F = rdr.readI2( 0 );
        ped.dd = {};
        CONTAM.Project.dfedat_read(ped.dd);
        break;
      } 
      case CONTAM.Globals.DD_BDF: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.Cp = rdr.readR4( 0 );
        ped.xp = rdr.readR4( 0 );
        ped.Cn = rdr.readR4( 0 );
        ped.xn = rdr.readR4( 0 );
        ped.dd = {};
        CONTAM.Project.dfedat_read(ped.dd);
        break;
      } 
      case CONTAM.Globals.DD_BDQ: 
      {
        var ped = {};
        pe.ped = ped;
        ped.lam = rdr.readR4( 1 );
        ped.Cp = rdr.readR4( 0 );
        ped.xp = rdr.readR4( 0 );
        ped.Cn = rdr.readR4( 0 );
        ped.xn = rdr.readR4( 0 );
        ped.dd = {};
        CONTAM.Project.dfedat_read(ped.dd);
        break;
      } 
      case CONTAM.Globals.CS_FSP:
      case CONTAM.Globals.CS_QSP:
      case CONTAM.Globals.CS_PSF:
      case CONTAM.Globals.CS_PSQ: 
      {
        var ped = {};
        pe.ped = ped;
        ped.npts = rdr.readI2( 1 );  // number of data points - at least 4
        ped.X = [];
        ped.Y = [];
        ped.u_X = rdr.readI2( 0 );
        ped.u_Y = rdr.readI2( 0 );
        for( j=0; j<ped.npts; j++ )
        {
          ped.X[j] = rdr.readR4( 1 );
          ped.Y[j] = rdr.readR4( 0 );
        }
        break;
      } 
      case CONTAM.Globals.DD_FSP:
      case CONTAM.Globals.DD_QSP:
      case CONTAM.Globals.DD_PSF:
      case CONTAM.Globals.DD_PSQ: 
      {
        var ped = {};
        pe.ped = ped;
        ped.npts = rdr.readI2( 1 );  // number of data points - at least 4
        ped.X = [];
        ped.Y = [];
        ped.u_X = rdr.readI2( 0 );
        ped.u_Y = rdr.readI2( 0 );
        for( j=0; j<ped.npts; j++ )
        {
          ped.X[j] = rdr.readR4( 1 );
          ped.Y[j] = rdr.readR4( 0 );
        }
        ped.dd = {};
        CONTAM.Project.dfedat_read(ped.dd);
        break;
      } 
      case CONTAM.Globals.AF_SUP: 
      {
        var n, nsafe = rdr.readIX( 0 );  // number of sub elements
        var nsched = rdr.readIX( 0 );  // number of element to schedule
        var ped = {};
        var psl1=null, psl2=null;
        pe.ped = ped;
        ped.u_Ht = rdr.readI2( 0 );
        for( n=1; n<=nsafe; n++ )
        {
          psl1 = {};
          if( ped.list )
            psl2.next = psl1;
          else
            ped.list = psl1;
          psl2 = psl1;
          psl1.afe_nr = rdr.readIX( 0 );
          psl1.relHt = rdr.readR4( 0 );
          psl1.Filtered = rdr.readI2( 0 );
          if( psl1.afe_nr == nsched )
          {
            psl1.Sched = 1;
          }
        }
        break;
      } 
      default:
        throw new Error("Invalid element type " + pe.dtype.toString() );
    }  /* end element type switch */

    if(lib)
    {
      if(duct)
      {
        prj.DfeLib0.AddNode(pe);
      }
      else
      {
        prj.AfeLib0.AddNode(pe);
      }
    }
    else
    {
      if(duct)
      {
        prj.Dfe0.AddNode(pe);
      }
      else
      {
        prj.Afe0.AddNode(pe);
      }
    }
  }  /* end element loop */

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in the airflow element section" );

  if( !duct )
  {
    for( j=1; j<=nafe; j++ )  // set super AFE sub-element pointers
    {
      var psl1;
      var pfe = prj.Afe0.GetByNumber(j);
      if( pfe.dtype == CONTAM.Globals.AF_SUP )
      {
        for( psl1=pfe.ped.list; psl1; psl1=psl1.next )
        {
          psl1.pafe = prj.Afe0.GetByNumber(psl1.afe_nr);
        }
      }
    }
  }
  return nafe;

}  /* end afelmt_read */

/***  setLamCoef.c  **********************************************************/

/*  Set laminar flow coefficient for powerlaw flow element.
 *  Flow equation types:
 *  0:  F = Ct * rho * dP^x  (Q = Ct * dP^x)
 *  1:  F = Ct * sqrt(rho) * dP^x  (orifice)
 *  2:  F = Ct * dP^x  */

CONTAM.Project.setLamCoef = function( Ct, x, A, D, Re, type, name )
{
  /* Ct  turbulent flow coefficient 
   * x   exponent
   * A   flow area
   * D   hydraulic diameter
   * Re  Reynolds number of L-T transition */
  var Cl;  // laminar flow coefficient
  var F;   // mass flow rate at L-T transition
  var dP=0;  // pressure drop at L-T transition

    // Re = rho * V * D / mu; F = rho * V * A; therefore
  F = CONTAM.Units.MUAIR * Re * A / D;
  switch (type)
  {
    case 0:   // F = Ct * rho * dP^x
      dP = Math.pow( F / (Ct * CONTAM.Units.rho20), 1.0 / x );
      break;
    case 1:   // F = Ct * sqrt(rho) * dP^x
      dP = Math.pow( F / (Ct * CONTAM.Units.SRHO), 1.0 / x );
      break;
    case 2:   // F = Ct * dP^x
      dP = Math.pow( F / Ct, 1.0 / x );
      break;
    default:
      throw new Error("Invalid equation type: " + type.toString() + " element: " + name );
  }
  if( dP < CONTAM.Units.DPTMIN ) dP = CONTAM.Units.DPTMIN;   // 1998/07/17 - dPt > 0 
    // F = Cl * (rho / mu) * dP
  Cl = (CONTAM.Units.MUAIR * F) / (CONTAM.Units.rho20 * dP);

  /*
#ifdef DEBUG
  fprintf( _ulog, "%s: Cl %g, Ct %g, expt %g\n", name, Cl, Ct, x );
  fprintf( _ulog, "   Re %g, F %g,", Re, F );
  switch (type)
    {
    case 0:   // F = Ct * rho * dP^x
      fprintf( _ulog, " Ft %g,", Ct * RHOAIR * pow( dP, x ) );
      break;
    case 1:   // F = Ct * sqrt(rho) * dP^x
      fprintf( _ulog, " Ft %g,", Ct * SRHO * pow( dP, x ) );
      break;
    case 2:   // F = Ct * dP^x
      fprintf( _ulog, " Ft %g,", Ct * pow( dP, x ) );
      break;
    }
  fprintf( _ulog, " Fl %g\n",  Cl * RHOAIR * dP / MUAIR );
  fflush(_ulog);
#endif
*/
  return Cl;

}  /* end setLamCoef */

/***  dfedat_read.c  *********************************************************/

/*  Read duct shape and leakage data.  */

CONTAM.Project.dfedat_read = function(pdd)
{
  var rdr = CONTAM.Reader;
  pdd.hdia = rdr.readR4( 1 );   /* 2003/11/18  0 -. 1 */
  pdd.perim = rdr.readR4( 0 );
  pdd.area = rdr.readR4( 0 );
  pdd.major = rdr.readR4( 0 );
  pdd.minor = rdr.readR4( 0 );
  pdd.As = rdr.readR4( 0 );     // this value is not used; GNW 2005/08/24
  pdd.Qr = rdr.readR4( 0 );
  pdd.Pr = rdr.readR4( 0 );
  pdd.shape = rdr.readI2( 1 );
  pdd.u_D = rdr.readI2( 0 );
  pdd.u_P = rdr.readI2( 0 );
  pdd.u_A = rdr.readI2( 0 );
  pdd.u_mj = rdr.readI2( 0 );
  pdd.u_mn = rdr.readI2( 0 );
  pdd.u_Qr = rdr.readI2( 0 );
  pdd.u_Pr = rdr.readI2( 0 );

}  /* end dfedat_read */

CONTAM.Project.ctrlse_read = function (lib)
{
  var pe;   /* element data */
  var pld;
  var pid;
  var nse, i, j;
  var in_node, out_node;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  nse = rdr.readIX( 1 );
  if(lib)
    prj.SEelmtLib0 = CONTAM.ElementList.CreateList();
  else
    prj.SEelmt0 = CONTAM.ElementList.CreateList();

  for( i=1; i<=nse; i++ )
  {
    /* CTRLSE_DAT Data */
    pe = {};
    pe.pin = pe.pout = null;
    pe.pld = null;

    pe.nr = rdr.readIX( 1 );
    if( pe.nr != i ) 
      throw new Error("Element number mis-match: " + i.toString());
    pe.flags = rdr.readI2( 0 );
    in_node  = rdr.readIX( 0 );
    out_node = rdr.readIX( 0 );
    pe.nn = rdr.readIX( 0 );
    pe.ni = rdr.readI2( 0 );
    pe.name = rdr.nextword(0);              /* 2004 bridge */
    pe.desc = rdr.nextword(3);

    /* Sub-node data */
    if(lib)
      pe.nn = prj.ctrl_read(2, pe);
    else
      pe.nn = prj.ctrl_read(1, pe);

    /* Set input and output pointers */
    if( in_node )
      pe.pin = pe.pnl[in_node];
    if( out_node )
      pe.pout = pe.pnl[out_node];
    pe.inreq = (pe.pin)?1:0;
              /* compute & test spline coefficients @@@ */

    /* Sketch data */
    if( pe.ni )
    {
      pld = {};
      pld.name = "SEsketch";
      pe.pld = pld;
      pid = null;             /* new "level" */
      for( j=pe.ni; j; j-- )
      {
        var prev = pid;
        pid = {};
        if(prev)
          prev.next = pid;
        //pid = icon_add( pid );
        if( pld.pid == null )
          pld.pid = pid;
        pid.icon = rdr.readI2( 1 );
        pid.col = rdr.readI2( 0 );
        pid.row = rdr.readI2( 0 );
        pid.nr = rdr.readIX( 0 );
      } /* icon loop */
    }
    if(lib)
      prj.SEelmtLib0.AddNode(pe);
    else    
      prj.SEelmt0.AddNode(pe);

    prj.ctrlse_ptrs( pe );

  } /* super element loop */

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in control super element section" );

  return nse;

} /* End ctrlse_read() */


//mode 0 = project, 1 = SE project, 2 = SE lib
CONTAM.Project.ctrl_read = function(mode, SE)
{
  var nctrl, i, j;
  var buffer;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var pList;

  nctrl = rdr.readIX( 1 );    /* read control data */
  switch(mode)
  {
    case 0:
      prj.CtrlList = [];
      pList = prj.CtrlList;
      pspcs0 = prj.Spcs0;
      break;
    case 1:
      SE.pnl = [];
      pList = SE.pnl;
      pspcs0 = prj.Spcs0;
      break;
    case 2: 
      SE.pnl = [];
      pList = SE.pnl;
      pspcs0 = prj.SpcsLib0;
      break;

  }

  for( i=1; i<=nctrl; i++ )
  {
    var pc = {};
    pc.nr = rdr.readIX( 1 );
    if( pc.nr != i ) 
      throw new Error("Control number mis-match: " + i.toString());
    pList[i] = pc;
    pc.nphref = 0;
    
    buffer = rdr.nextword(0);
    pc.type = CONTAM.Utils.lin_search( buffer, CONTAM.Globals.ctrl_names );
    pc.seqnr = rdr.readIX( 0 );
    pc.flags = rdr.readI2( 0 );
    pc.inreq = rdr.readI2( 0 );
    j = rdr.readIX( 0 );
    if( j<0 || j>nctrl ) 
      throw new Error("Invalid control node number, node " + i.toString() );
    else
      pc.n1 = j;
    j = rdr.readIX( 0 );
    if( j<0 || j>nctrl ) 
      throw new Error("Invalid control node number, node " + i.toString() );
    else
      pc.n2 = j;
    pc.name = rdr.nextword(0);              /* 2004 bridge */
    pc.desc = rdr.nextword(3);

    switch (pc.type )
    {
      case CONTAM.Globals.CT_SNS: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.offset = rdr.readR4( 1 );
        pcd.scale = rdr.readR4( 0 );
        pcd.tau = rdr.readR4( 0 );
     /* pcd.oldsig = */ rdr.readR4( 0 );
        pcd.oldsig = 0;
        pcd.source = rdr.readIX( 0 );
        pcd.type = rdr.readI2( 0 );
        pcd.measure = rdr.readI2( 0 );
        pcd.X = rdr.readR4( 0 );  // CW 2.3
        pcd.Y = rdr.readR4( 0 );
        pcd.relHt = rdr.readR4( 0 );
        pcd.u_XYZ = rdr.readI2( 0 );
        buffer = rdr.nextword(0);      /* species name */
        if( pcd.measure == 0 )
          pcd.spcs = CONTAM.Utils.old_name_chk( pspcs0, buffer );
        break;
      } 
      case CONTAM.Globals.CT_SCH: 
      {
        var pcd = {};
        pc.pcd = pcd;
        j = rdr.readIX( 1 );
        pcd.ps = prj.Wsch0.GetByNumber(j);
        pcd.ps.used += 1;
        break;
      } 
      case CONTAM.Globals.CT_SET: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.value = rdr.readR4( 1 );
        break;
      } 
      case CONTAM.Globals.CT_CVF:
      case CONTAM.Globals.CT_DVF: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.name = rdr.nextword(0);
        break;
      } 
      case CONTAM.Globals.CT_LOG: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.offset = rdr.readR4( 1 );
        pcd.scale = rdr.readR4( 0 );
        pcd.udef = rdr.readI2( 0 );
        pcd.header = rdr.nextword(0);
        pcd.units = rdr.nextword(0);
        break;
      } 
      case CONTAM.Globals.CT_MOD: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.offset = rdr.readR4( 1 );
        pcd.scale = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.CT_HYS: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.slack = rdr.readR4( 1 );
        pcd.slope = rdr.readR4( 0 );
        pcd.oldsig = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.CT_DLS: 
      {
        var pcd = {};
        pc.pcd = pcd;
        j = rdr.readIX( 1 );
        pcd.pdsincr = prj.Dsch0.GetByNumber(j);
        pcd.pdsincr.used += 1;
        j = rdr.readIX( 0 );
        pcd.pdsdecr = prj.Dsch0.GetByNumber(j);
        pcd.pdsdecr.used += 1;
        break;
      } 
      case CONTAM.Globals.CT_DLX: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.tauincr = rdr.readHMS( 1 );
        pcd.taudecr = rdr.readHMS( 0 );
        break;
      } 
      case CONTAM.Globals.CT_IRS:    // CX 2.4b but not used in 2.4b
      case CONTAM.Globals.CT_ARS: 
      {  
        var pcd = {};
        pc.pcd = pcd;
        pcd.shape = rdr.readIX( 0 );
        break;
      } 
      case CONTAM.Globals.CT_INT: 
      {
        var pcd = {};
        pc.pcd = pcd;
        break;
      } 
      case CONTAM.Globals.CT_RAV: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.tspan = rdr.readHMS( 1 );
        break;
      } 
      case CONTAM.Globals.CT_LBS:
      case CONTAM.Globals.CT_UBS: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.band = rdr.readR4( 1 );
        break;
      } 
      case CONTAM.Globals.CT_PC1: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.kp = rdr.readR4( 1 );
        break;
      } 
      case CONTAM.Globals.CT_PI1: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.kp = rdr.readR4( 1 );
        pcd.ki = rdr.readR4( 0 );
        pcd.oldsig = rdr.readR4( 0 );
        pcd.olderr = rdr.readR4( 0 );
        break;
      } 
      case CONTAM.Globals.CT_SUP: 
      {
        var pcd = {};
        pc.pcd = pcd;
        pcd.def = rdr.readI2( 1 );
        j = rdr.readIX( 0 );
        pcd.pse = prj.SEelmt0.GetByNumber(j);
        pcd.pse.used++;
        pcd.nin  = rdr.readIX( 0 );
        pcd.nout = rdr.readIX( 0 );
        pcd.pnl = [];
        /* list set in ctrl_ptrs() */
        break;
      } 
      case CONTAM.Globals.CT_SUM:
      case CONTAM.Globals.CT_AVG:
      case CONTAM.Globals.CT_MAX:
      case CONTAM.Globals.CT_MIN: 
      {
        var n;
        var pcd = {};
        pc.pcd = pcd;
        pcd.npcs = rdr.readIX( 1 );    /* read first value on line */
        pcd.ncmax = pcd.npcs + 1; /* ncmax > 0 for alc_v() */
        pcd.pc = [];
        pcd.cnode = [];
        for( n=0; n<pcd.npcs; n++ )    /* read node numbers */
          pcd.cnode[n] = rdr.readIX( 0 );
        break; 
      } 
      case CONTAM.Globals.CT_PLY: 
      {  /* 2.4c */
        var n;
        var pcd = {};
        pc.pcd = pcd;
        pcd.n = rdr.readI4( 1 );
        pcd.a = [];
        for( n=0; n<=pcd.n; n++ )
          pcd.a[n] = rdr.readR4( 0 );
        break;
      } 
   /* no data with following types */
      case CONTAM.Globals.CT_PAS:
      case CONTAM.Globals.CT_BIN:
      case CONTAM.Globals.CT_ABS:
      case CONTAM.Globals.CT_INV:
      case CONTAM.Globals.CT_AND:
      case CONTAM.Globals.CT_OR:
      case CONTAM.Globals.CT_XOR:
      case CONTAM.Globals.CT_ADD:
      case CONTAM.Globals.CT_SUB:
      case CONTAM.Globals.CT_MUL:
      case CONTAM.Globals.CT_DIV:
      case CONTAM.Globals.CT_LLC:
      case CONTAM.Globals.CT_ULC:
      case CONTAM.Globals.CT_LLS:
      case CONTAM.Globals.CT_ULS:
      case CONTAM.Globals.CT_SPH:

      case CONTAM.Globals.CT_POW: // 2.4c
      case CONTAM.Globals.CT_MDU:
      case CONTAM.Globals.CT_EXP:  
      case CONTAM.Globals.CT_LGN:
      case CONTAM.Globals.CT_LG1:
      case CONTAM.Globals.CT_SQT:
      case CONTAM.Globals.CT_SIN:
      case CONTAM.Globals.CT_COS:
      case CONTAM.Globals.CT_TAN:
      case CONTAM.Globals.CT_CEL:
      case CONTAM.Globals.CT_FLR:
        break;
      default:
        throw new Error("Invalid control type " + pc.type.toString() );
        break;
    }  /* end control type switch */
  }  /* end control element loop */

  if( mode == 0 )
    if( rdr.readI2( 1 ) != prj.UNK )
      throw new Error("PRJ read error in control section" );

  return nctrl;

}  /* end ctrl_read */

/***  ctrlse_ptrs.c  ***********************************************************/

/*  Set control Super Element sub-node pointers based on node numbers as
    stored to/read from PRJ file and count phantom sub-node links.             */

CONTAM.Project.ctrlse_ptrs = function(pse)
{
  var pld;
  var pid;
  var j, nctrl;
  var pList;

  pList = pse.pnl;
  pld   = pse.pld;
  nctrl = pse.nn;

  if( !pld )  /* No sub-nodes defined */
    return;

  for( pid=pld.pid; pid; pid=pid.next )
    if( pid.icon==CONTAM.Globals.CTRLP && pid.nr>0 )  /* defined phantom icon */
      pList[pid.nr].nphref += 1;

  for( j=1; j<=nctrl; j++ )
  {
    var pc = pList[j];
    if( pc.n1 )
      pc.pc1 = pList[pc.n1];
    if( pc.n2 )
      pc.pc2 = pList[pc.n2];

    if( pc.type == CONTAM.Globals.CT_SUM || pc.type == CONTAM.Globals.CT_AVG ||
        pc.type == CONTAM.Globals.CT_MAX || pc.type == CONTAM.Globals.CT_MIN )     // 2004/01/29
    {
      var pcd = pc.pcd;
      var n;
      for( n=0; n<pcd.npcs; n++ )
        pcd.pc[n] = pList[pcd.cnode[n]];
    }
  }
}  /* end ctrlse_ptrs() */

CONTAM.Project.system_read = function()
{
  var pa;
  var nahs, i;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  nahs = rdr.readIX( 1 );
  prj.Ahs0 = CONTAM.ElementList.CreateList();

  for( i=1; i<=nahs; i++ )
  {
    pa = {};
    pa.nr = rdr.readIX( 1 );
    if( pa.nr != i ) 
      throw new Error("System number mis-match: " + i.toString());
    pa.zone_r = rdr.readIX( 0 );
    pa.zone_s = rdr.readIX( 0 );
    pa.path_r = rdr.readIX( 0 );
    pa.path_s = rdr.readIX( 0 );
    pa.path_x = rdr.readIX( 0 );
      /* cannot test zone and path numbers; data not yet read */
    pa.name = rdr.nextword(0);
    pa.desc = rdr.nextword(3);
    prj.Ahs0.AddNode(pa);
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in AHS section" );

  return nahs;

}  /* end system_read */

CONTAM.Project.zone_read = function()
{
  var pzn;
  var nzone, i, j, k;
  var nn;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  nzone = rdr.readIX( 1 );
  prj.nCFDzone = 0;
  prj.ZoneList = [];

  for( i=1; i<=nzone; i++ )
  {
    pzn = {};
    prj.ZoneList[i] = pzn;
    pzn.nr = rdr.readIX( 1 );
    if( pzn.nr != i ) 
      throw new Error("Zone number mis-match: " + i.toString());

    pzn.flags = rdr.readI2( 0 );
    pzn.flags &= CONTAM.Globals.FLAG_N;
    if( pzn.flags & CONTAM.Globals.CFDZN )
      prj.nCFDzone++;

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nwsch )
      throw new Error("Invalid schedule number, zone " + i.toString());
    else if( j > 0 )
    {
      pzn.ps = prj.Wsch0.GetByNumber(j);
      pzn.ps.used += 1;
    }
    else 
      pzn.ps = null;

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nctrl )
      throw new Error("Invalid control node number, zone " + i.toString());
    else if( j > 0 )
      pzn.pc = prj.CtrlList[j];
    else 
      pzn.pc = null;

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nkinr )
      throw new Error("Invalid reaction number, zone " + i.toString());
    else if( j > 0 )
      pzn.pk = prj.Kinr0.GetByNumber(j);
    else 
      pzn.pk = null;

    j = rdr.readIX( 0 );
    if( j<1 || j>prj.nlev )
      throw new Error("Invalid level number, zone " + i.toString());
    else
      pzn.pld = prj.LevList[j];

    pzn.relHt = rdr.readR4( 0 );
    pzn.Vol = rdr.readR4( 0 );
    pzn.T0 = rdr.readR4( 0 );  // round-off! either R8 or R4 [C] +273.15  2006/06/27
    pzn.P0 = rdr.readR4( 0 );
    pzn.name = rdr.nextword(0);

    pzn.color = rdr.readI2( 0 );
    pzn.u_Ht = rdr.readI2( 0 );
    pzn.u_T = rdr.readI2( 0 );
    pzn.u_P = rdr.readI2( 0 );
    pzn.u_V = rdr.readI2( 0 );
    pzn.cdaxis = rdr.readI2( 0 );    // CW 2.3 2006-06, 1D zone
    pzn.vf_type = rdr.readI2( 0 );   // CW 3.2 2014-01, cvf & dvf w/o control network
    if(pzn.vf_type == 1 || pzn.vf_type == 2)
      pzn.vf_node_name = rdr.nextword(0);
    else
      pzn.vf_node_name = "";
    if( rdr.readI2( 0 ) == 1 )    // CW 3.0, cfd
      pzn.cfd_name = rdr.nextword(0);
    else
      pzn.cfd_name = "";
    if( pzn.cdaxis )   // CW 2.3, 1D zone
    {
      var buffer;
      buffer = rdr.nextword(0);  // "1D:"
      pzn.X1 = rdr.readR4( 0 );
      pzn.Y1 = rdr.readR4( 0 );
      pzn.H1 = rdr.readR4( 0 );
      pzn.X2 = rdr.readR4( 0 );
      pzn.Y2 = rdr.readR4( 0 );
      pzn.H2 = rdr.readR4( 0 );
      pzn.celldx = rdr.readR4( 0 );
      pzn.axialD = rdr.readR4( 0 );
      pzn.u_aD = rdr.readI2( 0 );
      pzn.u_L = rdr.readI2( 0 );
    }
    else
      pzn.cdaxis = 0;
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in Zones section" );

  nn = rdr.readIX( 1 );   /* nzone * nctm */
  if( nn != nzone * prj.nctm ) 
    throw new Error("Zones*contaminant count mis-match: " + nn.toString());
  if( nn > 0 )
  {
    for( i=1; i<=nzone; i++ )
    {
      j = rdr.readIX( 1 );
      if( j != i ) 
        throw new Error("Zone number mis-match: " + i.toString());
      pzn = prj.ZoneList[i];
      pzn.CC0 = [];
      for( k=0; k<prj.nctm; k++ )
        pzn.CC0[k] = rdr.readR4( 0 );
    }
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in zone initial concentration section" );

  return nzone;

}  /* end zone_read */

CONTAM.Project.path_read = function()
{
  var ppd;  /* pointer to current path structure */
  var npath, i, j;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  npath = rdr.readIX( 1 );    /* read path data */
  prj.PathList = [];

  for( i=1; i<=npath; i++ )
  {
    ppd = {};
    prj.PathList[i] = ppd;

    ppd.nr = rdr.readIX( 1 );
    if( ppd.nr != i ) 
      throw new Error("Path number mis-match: " + i.toString());
    ppd.flags = rdr.readI2( 0 );
    ppd.flags &= CONTAM.Globals.FLAG_P;

    j = rdr.readIX( 0 );
    if( j==CONTAM.Globals.AMBT )
      ppd.pzn = prj.ambt;
    else if( j==0 )
      ppd.pzn = null;
    else if( j<1 || j>prj.nzone ) 
      error("Invalid zone number, path " + i.toSting());
    else
      ppd.pzn = prj.ZoneList[j];

    j = rdr.readIX( 0 );
    if( j==CONTAM.Globals.AMBT )
      ppd.pzm = prj.ambt;
    else if( j==0 )
      ppd.pzm = null;
    else if( j<1 || j>prj.nzone ) 
      throw new Error("Invalid zone number, path " + i.toString());
    else
      ppd.pzm = prj.ZoneList[j];

    j = rdr.readIX( 0 );
    if( !(ppd.flags & CONTAM.Globals.AHS_P) )
    {
      if( j<1 || j>prj.nafe )
        throw new Error("Invalid flow element number, path " + i.toString());
      else if( j>0 )
        ppd.pe = prj.Afe0.GetByNumber(j);
    }

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nfilt ) 
      throw new Error("Invalid filter number, path " + i.toString());
    else if( j>0 )
      ppd.pf = prj.FiltList[j];

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nwpf ) 
      throw new Error("Invalid wind profile number, path " + i.toString());
    else if( j>0 )
      ppd.pw = prj.Wpf0.GetByNumber(j);

    j = rdr.readIX( 0 );
    if( ppd.flags & CONTAM.Globals.AHS_S )
      if( j<1 || j>prj.nahs ) 
        throw new Error("Invalid AHS number, path " +i.toString());
      else
        ppd.pa = prj.Ahs0.GetByNumber(j);
    else
      if( j!=0 ) 
        throw new Error("Invalid AHS number, path " + i.toString());

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nwsch ) 
      throw new Error("Invalid week-schedule number, path " + i.toString());
    else if( j>0 )
    {
      ppd.ps = prj.Wsch0.GetByNumber(j);
      ppd.ps.used += 1;
    }

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nctrl ) 
      throw new Error("Invalid control node number, path " + i.toString());
    else if( j>0 )
      ppd.pc = prj.CtrlList[j];

    j = rdr.readIX( 0 );
    if( j<1 || j>prj.nlev ) 
      throw new Error("Invalid level number, path " + i.toString());
    else
      ppd.pld = prj.LevList[j];

    ppd.X = rdr.readR4( 0 );
    ppd.Y = rdr.readR4( 0 );
    ppd.relHt = rdr.readR4( 0 );
    ppd.mult = rdr.readR4( 0 );
    ppd.wPset = rdr.readR4( 0 );
    ppd.wPmod = rdr.readR4( 0 );
    ppd.wazm = rdr.readR4( 0 );
    ppd.Fahs = rdr.readR4( 0 );
    ppd.Xmax = rdr.readR4( 0 );
    ppd.Xmin = rdr.readR4( 0 );
    ppd.icon = rdr.readI2( 0 );
    ppd.dir = rdr.readI2( 0 );
    ppd.u_Ht = rdr.readI2( 0 );
    ppd.u_XY = rdr.readI2( 0 );
    ppd.u_dP = rdr.readI2( 0 );
    ppd.u_F = rdr.readI2( 0 );

    ppd.vf_type = rdr.readI2( 0 );     // CW 3.2, cvf/dvf type
    if(ppd.vf_type == 1 || // cvf
       ppd.vf_type == 2)    // dvf
      ppd.vf_node_name = rdr.nextword(0);
    else
      ppd.vf_node_name = "";
    if( rdr.readI2( 0 ) == 1 ) // CW 3.0
    {
      ppd.cfd_pname = rdr.nextword(0);
      ppd.cfd_ptyp = rdr.readI2( 0 );
      ppd.cfd_btyp = rdr.readI2( 0 );
      ppd.cfd_capp = rdr.readI2( 0 );
    }
    else
    {
      ppd.cfd_pname = "";
      ppd.cfd_ptyp = 0;
      ppd.cfd_btyp = 0;
      ppd.cfd_capp = 0;
    }
    
  }
  prj.UpdateAllPathIcons();
  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in path sections" );

  return npath;

}  /* end path_read */

/***  UpdateAllPathIcons.c  **********************************************************/

/*  make sure all of the icons in the AFEs, Paths,
      and path icons (in level data) match  */

CONTAM.Project.UpdateAllPathIcons = function()
{
  var pld;
  var pid;

  for( pld = CONTAM.Project.Lev0; pld; pld = pld.above )
  {
    for( pid = pld.pid; pid; pid = pid.next )
    {
      if ( pid.icon >= CONTAM.Icons.OPNG && 
           pid.icon <= CONTAM.Icons.LG_DOOR && pid.nr > 0 )
      {
        var path;

        path = CONTAM.Project.PathList[pid.nr];
        if( path && path.pe )
        {
          pid.icon = path.icon = path.pe.icon;
        }
      }
    } // end for(pid)
  } // end for (pld)
} // end UpdatePathIcons

CONTAM.Project.jct_read = function()
{
  var pj;
  var njct, i, j, k;
  var nn;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  njct = rdr.readIX( 1 );    /* read junction data */
  prj.JctList = [];

  for( i=1; i<=njct; i++ )
  {
    pj = {};
    prj.JctList[i] = pj;
    pj.nr = rdr.readIX( 1 );
    if( pj.nr != i ) 
      throw new Error("Junction number mis-match: " + i.toString());

    pj.flags = rdr.readI2( 0 );
    pj.jtype = rdr.readI2( 0 );

    j = rdr.readIX( 0 );
    if( j==CONTAM.Globals.AMBT )
      pj.pzn = prj.ambt;
    else if( j==0 )
      pj.pzn = null;
    else if( j<1 || j>prj.nzone ) 
      throw new Error("Invalid zone number, junction " + i.toString());
    else
      pj.pzn = prj.ZoneList[j];

    pj.dnr = rdr.readIX( 0 );

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nkinr ) 
      throw new Error("Invalid reaction number, junction " + i.toString());
    else if( j>0 )
      pj.pk = rdr.KinrList[j];

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nwsch ) 
      throw new Error("Invalid schedule number, junction " + i.toString());
    else if( j>0 )
    {
      pj.ps = prj.Wsch0.GetByNumber(j);
      pj.ps.used += 1;
    }

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nctrl ) 
      throw new Error("Invalid control node number, junction " + i.toString());
    else if( j>0 )
      pj.pc = prj.CtrlList[j];

    j = rdr.readIX( 0 );
    if( j<1 || j>prj.nlev ) 
      throw new Error("Invalid level number, junction " + i.toString());
    else
      pj.pld = prj.LevList[j];

    pj.X = rdr.readR4( 0 );
    pj.Y = rdr.readR4( 0 );
    pj.relHt = rdr.readR4( 0 );
    pj.T0 = rdr.readR4( 0 );
    pj.P0 = rdr.readR4( 0 );
    pj.icon = rdr.readI2( 0 );
    pj.color = rdr.readI2( 0 );
    pj.u_Ht = rdr.readI2( 0 );
    pj.u_XY = rdr.readI2( 0 );
    pj.u_T = rdr.readI2( 0 );
    pj.u_dP = rdr.readI2( 0 );
    pj.vf_type = rdr.readI2( 0 );
    if(pj.vf_type == 1 ||  // cvf
      pj.vf_type == 2)     // dvf
    {
      pj.vf_node_name = rdr.nextword(0);
    }
    if( pj.jtype > 0 ) // CW 2.3 terminal
    {
      var buffer;
      buffer = rdr.nextword(0);  // "T:"
      j = rdr.readIX( 0 );
      if( j<0 || j>rdr.nfilt ) 
        throw new Error("Invalid filter number, junction " + i.toString());
      else if( j>0 )
        pj.pf = prj.FiltList[j];
      j = rdr.readIX( 0 );
      if( j<0 || j>prj.nwpf ) 
        throw new Error("Invalid wind profile number, junction " + i.toString());
      else if( j>0 )
        pj.pw = prj.Wpf0.GetByNumber(j);
      pj.wPset = rdr.readR4( 0 );
      pj.wPmod = rdr.readR4( 0 );
      pj.wazm = rdr.readR4( 0 );
      pj.bal = rdr.readI2( 0 );
      pj.Ad = rdr.readR4( 0 );
      pj.Af = rdr.readR4( 0 );
      pj.Fdes = rdr.readR4( 0 );
      pj.Ct = rdr.readR4( 0 );
      pj.Cb = rdr.readR4( 0 );
      pj.Cbmax = rdr.readR4( 0 );
      pj.u_A = rdr.readI2( 0 );
      pj.u_F = rdr.readI2( 0 );
      pj.ddir = rdr.readI2( 0 );
      pj.fdir = rdr.readI2( 0 );
    }
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in junction section" );

  nn = rdr.readIX( 1 );   /* njct * nctm */
  if( nn != njct * prj.nctm ) 
    throw new Error("Junctions*contaminant count mis-match: " + nn.toString());
  if( nn > 0 )
  {
    for( i=1; i<=njct; i++ )
    {
      j = rdr.readIX( 1 );
      if( j != i ) 
        throw new Error("Junction number mis-match: " + i.toString());
      pj = prj.JctList[i];
      pj.CC0 = [];
      for( k=0; k<prj.nctm; k++ )
        pj.CC0[k] = rdr.readR4( 0 );
    }
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in junction initial concentration section" );

  return njct;

}  /* end jct_read */

CONTAM.Project.duct_read = function()
{
  var pd;
  var ndct, i, j;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  ndct = rdr.readIX( 1 );    /* read duct data */
  prj.DctList = [];

  for( i=1; i<=ndct; i++ )
  {
    pd = {};
    prj.DctList[i] = pd;
    pd.nr = rdr.readIX( 1 );
    if( pd.nr != i ) 
      throw new Error("Duct number mis-match: " + i.toString());
    pd.flags = rdr.readI2( 0 );

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.njct ) 
      throw new Error("Invalid junction number, duct " + i.toString());
    else if( j>0 )
      pd.pjn = prj.JctList[j];

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.njct ) 
      throw new Error("Invalid junction number, duct " + i.toString());
    else if( j>0 )
      pd.pjm = prj.JctList[j];

    j = rdr.readIX( 0 );
    if( j<1 || j>prj.ndfe ) 
      throw new Error("Invalid duct element number, duct " + i.toString());
    else if( j>0 )
      pd.pe = prj.Dfe0.GetByNumber(j);

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nfilt ) 
      throw new Error("Invalid filter number, duct " + i.toString());
    else if( j>0 )
      pd.pf = prj.FiltList[j];

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nwsch ) 
      throw new Error("Invalid week-schedule number, duct " + i.toString());
    else if( j>0 )
    {
      pd.ps = prj.Wsch0.GetByNumber(j);
      pd.ps.used += 1;
    }

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nctrl ) 
      throw new Error("Invalid control node number, duct " + i.toString());
    else if( j>0 )
      pd.pc = prj.CtrlList[j];

    pd.dir = rdr.readI2( 0 );
    pd.length = rdr.readR4( 0 );
    pd.Ain = rdr.readR4( 0 );
    pd.Aout = rdr.readR4( 0 );
    pd.sllc = rdr.readR4( 0 );
    pd.color = rdr.readI2( 0 );
    pd.u_L = rdr.readI2( 0 );
    pd.u_A = rdr.readI2( 0 );
    pd.vf_type = rdr.readI2( 0 );
    if(pd.vf_type == 1 || // cvf
      pd.vf_type == 2) // dvf
    {
      pd.vf_node_name = rdr.nextword(0);
    }
    if( pd.pe.dtype == CONTAM.Icons.DD_DWC && 
        pd.length <= 0 && pd.sllc <= 0 )  // 2004/11/18
      throw new Error("Duct " + pd.nr.toString() + 
        " with DWC element has neither length nor loss coefficient");
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in duct section" );

  return ndct;

}  /* end duct_read */

CONTAM.Project.css_read = function()
{
  var ncss, i, j;
  var pss;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  ncss = rdr.readIX( 1 );     /* read number of items */
  prj.CssList = [];

  for( i=1; i<=ncss; i++ )
  {
    pss = {};
    prj.CssList[i] = pss;   // not used by ContamX
    pss.nr = rdr.readIX( 1 );
    if( pss.nr != i ) 
      throw new Error("S/S number mis-match" + i.toString());

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nzone ) 
      throw new Error("Invalid zone number, source " + i.toString());
    else if( j==0 )
      pss.pz = null;
    else
      pss.pz = prj.ZoneList[j];

    j = rdr.readIX( 0 );
    if( j<1 || j>prj.ncse ) 
      throw new Error("Invalid element number, source " + i.toString());
    else
      pss.pe = prj.Cse0.GetByNumber(j);

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nwsch ) 
      throw new Error("Invalid week-schedule number, source " + i.toString());
    else if( j>0 )
      pss.ps = prj.Wsch0.GetByNumber(j);

    j = rdr.readIX( 0 );
    if( j<0 || j>prj.nctrl ) 
      throw new Error("Invalid control node number, source " + i.toString());
    else if( j>0 )
    {
      pss.pc = prj.CtrlList[j];
    }

    pss.mult = rdr.readR4( 0 );
    pss.CC0 = rdr.readR4( 0 );
    pss.Xmin = rdr.readR4( 0 );  // CW 2.3
    pss.Ymin = rdr.readR4( 0 );
    pss.Hmin = rdr.readR4( 0 );
    pss.Xmax = rdr.readR4( 0 );
    pss.Ymax = rdr.readR4( 0 );
    pss.Hmax = rdr.readR4( 0 );
    pss.u_XYZ = rdr.readI2( 0 );

    pss.vf_type = rdr.readI2( 0 );     // CW 3.2, cdvf type
    if(pss.vf_type == 1 || // cvf
      pss.vf_type == 2)    // dvf
      pss.vf_node_name = rdr.nextword(0);
    else
      pss.vf_node_name = "";
    if(rdr.readI2(0)) // cfd name exists
      pss.cfd_name = rdr.nextword(0);
    else
      pss.cfd_name = "";
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in the Source/Sink section" );

  return ncss;

}  /* end css_read */

CONTAM.Project.oschd_read = function()
{
  var nosch, i, j, jz;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  nosch = rdr.readIX( 1 );     /* read occ-schedule data */
  prj.Osch0 = CONTAM.ElementList.CreateList();

  for( i=1; i<=nosch; i++ )
  {
    var pos = {};
    pos.nr = rdr.readIX( 1 );
    if( pos.nr != i ) 
      throw new Error("Occpancy-schedule number mis-match: " + i.toString());
    pos.npts = rdr.readI2( 0 );
    pos.nmax = pos.npts;
    pos.u_XYZ = rdr.readI2( 0 );  // CW 2.3
    pos.name = rdr.nextword(0);
    pos.desc = rdr.nextword(3);
    pos.time = [];
    pos.zone = [];
    pos.X = [];
    pos.Y = [];
    pos.relHt = [];
    for( j=0; j<pos.npts; j++ )  /* read day-schedule points */
    {
      pos.time[j] = rdr.readHMS( 1 );
      jz = rdr.readIX( 0 );
      if( jz==0 )
        if( pos.time[j] == 86400 )
          pos.zone[j] = pos.zone[j-1];
        else
          pos.zone[j] = null;
      else if( jz==-1 )
        pos.zone[j] = prj.ambt;
      else if( jz<0 || jz>prj.nzone ) 
        throw new Error("Invalid zone number, Occ " + i.toString());
      else
        pos.zone[j] = prj.ZoneList[jz];
      pos.X[j] = rdr.readR4( 0 );  // CW 2.3
      pos.Y[j] = rdr.readR4( 0 );
      pos.relHt[j] = rdr.readR4( 0 );
    }

    prj.Osch0.AddNode(pos);
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in occupant schedule section" );

  return nosch;

}  /* end oschd_read */

CONTAM.Project.pexp_read = function()
{
  var npexp, ncg, i, j, k;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  npexp = rdr.readIX( 1 );    /* read pexp data */
  prj.PexpList = [];

  for( i=1; i<=npexp; i++ )
  {
    var ocgt, pocg=null;
    var px = {};
    prj.PexpList[i] = px;
    px.nr = rdr.readIX( 1 );
    if( px.nr != i ) 
      throw new Error("Exposure number mis-match: " + i.toString());
    px.gen = rdr.readI2( 0 );
    ncg = rdr.readIX( 0 );
    px.cgmlt = rdr.readR4( 0 );
    px.desc = rdr.nextword(3);

    px.odsch = [];
    for( j=1,k=0; k<12; k++,j=0 )
    {
      j = rdr.readIX( j );
      if( j<0 || j>prj.nosch ) 
        throw new Error("Invalid occupancy-schedule number, exposure " + i.toString());
      else if( j>0 )
        px.odsch[k] = prj.Osch0.GetByNumber(j);
    }
    if( prj.nctm>0 )
    {
      px.expos = [];
    }

    for( k=0; k<ncg; k++ )
    {
      var buffer;
      var spcs;
      ocgt = {};
      if( pocg )
        pocg = pocg.next = ocgt;    /* create linked list */
      else
        pocg = px.pogd = ocgt;
      buffer = rdr.nextword(1);   /* species */
      spcs = CONTAM.Utils.old_name_chk( prj.Spcs0, buffer );
      if( spcs )
        pocg.spcs = spcs;
      else
        throw new Error('Species not found: ' + buffer);
      j = rdr.readIX( 0 );
      if( j<0 || j>prj.nwsch ) 
        throw new Error('Invalid week-schedule number, exposure ' + i.toString());
      else if( j>0 )
      {
        pocg.ps = prj.Wsch0.GetByNumber(j);
        pocg.ps.used += 1;
      }
      pocg.cgmax = rdr.readR4( 0 );
      pocg.u_G = rdr.readI2( 0 );
      pocg.vf_type = rdr.readI2( 0 );   // CW 3.2 2015-07, cvf & dvf w/o control network
      if(pocg.vf_type == 1 || pocg.vf_type == 2)
      {
        pocg.vf_node_name = rdr.nextword( 0 );
      }
    }
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error('PRJ read error occupant exposure section');

  return npexp;

}  /* end pexp_read */

CONTAM.Project.note_read = function()
{
  var nnote, j, n;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;

  nnote = rdr.readIX( 1 );    /* read note data */
  prj.NoteList = [];

  for( j=1; j<=nnote; j++ )
  {
    var pn = {};
    prj.NoteList[j] = pn;
    n = rdr.readIX( 1 );
    if( n != j ) 
      throw new Error("Note number mis-match: " + j.toString());
    pn.nr = n;
    pn.note = rdr.nextword(2);
  }

  if( rdr.readI2( 1 ) != prj.UNK )
    throw new Error("PRJ read error in notes section" );

  return nnote;

}  /* end note_read */


/***  ctrl_ptrs.c  ***********************************************************/
/*  Set control node pointers and count phantom node links.  */
CONTAM.Project.ctrl_ptrs = function()
{
  var pld;
  var pid;
  var j;

  for( pld=CONTAM.Project.Lev0; pld; pld=pld.above )
    for( pid=pld.pid; pid; pid=pid.next )
      if( pid.icon==CONTAM.Icons.CTRLP && pid.nr>0 )  /* defined phantom icon */
        CONTAM.Project.CtrlList[pid.nr].nphref += 1; //TODO: nphref is not set to zero anywhere

  for( j=1; j<=CONTAM.Project.nctrl; j++ )
    {
    var pc = CONTAM.Project.CtrlList[j];
    if( pc.n1 > 0 )
      pc.pc1 = CONTAM.Project.CtrlList[pc.n1];
    if( pc.n2 > 0 )
      pc.pc2 = CONTAM.Project.CtrlList[pc.n2];
    if( pc.type == CONTAM.Globals.CT_SNS )
      {
      var pcd = pc.pcd;
      switch (pcd.type)
        {
        case 1:
          if( pcd.source == -1 )   /* WSD TO DO: handle Super Node sub-node sensors */
            pcd.src = CONTAM.Project.ambt;
          else if( pcd.source == 0 ) /* Super Element sub-node */
            pcd.src = undefined;
          else
            pcd.src = CONTAM.Project.ZoneList[pcd.source];
          break;
        case 2:
          pcd.src = CONTAM.Project.PathList[pcd.source];
          break;
        case 6:
        case 3:
          pcd.src = CONTAM.Project.JctList[pcd.source];
          break;
        case 4:
          pcd.src = CONTAM.Project.DctList[pcd.source];
          break;
        case 5:
          pcd.src = CONTAM.Project.PexpList[pcd.source];
          break;
        default:
          throw new Error( 2, " Unidentified sensor type" );
          break;
        }
      }
    else if( pc.type == CONTAM.Globals.CT_SUM || 
             pc.type == CONTAM.Globals.CT_AVG ||
             pc.type == CONTAM.Globals.CT_MAX || 
             pc.type == CONTAM.Globals.CT_MIN )     // 2004/01/29
      {
      var pcd = pc.pcd;
      var n;
      for( n=0; n<pcd.npcs; n++ )
        pcd.pc[n] = CONTAM.Project.CtrlList[pcd.cnode[n]];
      }
    else if( pc.type == CONTAM.Globals.CT_SPH ) /* Phantom refs - SN sub-nodes */
      {
      if( pc.n1 > 0 )
        {
        pc.pc1 = CONTAM.Project.CtrlList[pc.n1];
        CONTAM.Project.CtrlList[pc.n1].nphref += 1;
        }
      }
    else if( pc.type == CONTAM.Globals.CT_SUP ) /* Handle Super Nodes */
      {
      var i;
      var pcd = pc.pcd;
      for( i=1; i<=pcd.pse.nn; i++ )
        pcd.pnl[i] = CONTAM.Project.CtrlList[j+i];
      pcd.pin  = pcd.nin  ? CONTAM.Project.CtrlList[pcd.nin] : undefined;
      pcd.pout = pcd.nout ? CONTAM.Project.CtrlList[pcd.nout]: undefined;
      }
    }
}  /* end ctrl_ptrs */

