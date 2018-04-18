//requires
// globals.js
// project.js
// sprintf.js
// TimeUtilities.js
// DateUtilities.js
// utils.js - error
// icons.js

//TODO: try to save a new project - need a new project setup function

if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

if(typeof CONTAM.Project == "undefined")
{
  CONTAM.Project = {};
}
CONTAM.Project.pst = ""; //project save text
CONTAM.Project.EOL = "\r\n"; //end of line 

CONTAM.Project.prjsave = function ()
{
  var prj = CONTAM.Project;

  prj.run_save();
  prj.nspcs = prj.spcs_save(false, true);
  prj.icons_chk();
  prj.nlev = prj.level_save();
  prj.ndsch = prj.dschd_save(false);
  prj.nwsch = prj.wschd_save(false);
  prj.nwpf = prj.wind_save(false);
  prj.nkinr = prj.kinetic_save(false);
  prj.nflte = prj.flte_save(false);
  prj.filter_save();
  prj.ncse = prj.cselmt_save(false);
  prj.nafe = prj.afelmt_save(false, false);
  prj.ndfe = prj.afelmt_save(false, true);
  prj.nselmt = prj.ctrlse_save(false);
  prj.ctrl_save(prj.nctrl, prj.CtrlList, 0 );
  prj.system_save();
  prj.zone_save();
  prj.path_save();
  prj.jct_save();
  prj.duct_save();
  prj.css_save();
  prj.nosch = prj.oschd_save();
  prj.pexp_save();
  prj.note_save();
  prj.pst += sprintf("* end project file.%s", prj.EOL);
  return {projectText: prj.pst};
}

CONTAM.Project.run_save = function()
{
  var i;
  var prj = CONTAM.Project;
  var pst = "";

  pst += "ContamW " + CONTAM.Globals.versions[CONTAM.Globals.cversion] + 
    CONTAM.Globals.revision + " " + prj.echo + prj.EOL;
  pst += prj.desc + prj.EOL;
  pst += "! rows cols ud uf    T   uT     N     wH  u  Ao    a" + prj.EOL;
  pst += sprintf("%6d %4d %2u %2u %7.3f %d %7.2f %5.2f %d %5.3f %5.3f%s",
    prj.skheight, prj.skwidth, prj.proj_def_units, prj.proj_def_flows, 
    prj.proj_def_T, prj.proj_udefT, prj.rel_N, prj.wind_H, prj.uwH, 
    prj.wind_Ao, prj.wind_a, prj.EOL );
  pst += sprintf("!  scale     us  orgRow  orgCol  invYaxis showGeom%s", prj.EOL);
  pst += sprintf(" %10.3e  %2d   %5d   %5d    %2d       %2d%s",
    prj.scale_factor, prj.scale_units, prj.origin_row, prj.origin_col, 
    prj.invert_y_axis, prj.show_geom, prj.EOL );

  pst += sprintf("! Ta       Pb      Ws    Wd    rh  day u..%s", prj.EOL);
  pst += sprintf("%7.3f %8.1f %6.3f %5.1f %5.3f %d %d %d %d %d ! steady simulation%s",
           prj.wthdat.Tambt, prj.wthdat.barpres, prj.wthdat.windspd, 
           prj.wthdat.winddir, prj.wthdat.relhum, prj.wthdat.daytyp, 
           prj.wthdat.uTa, prj.wthdat.ubP, prj.wthdat.uws, prj.wthdat.uwd, prj.EOL );

  pst += sprintf("%7.3f %8.1f %6.3f %5.1f %5.3f %d %d %d %d %d ! wind pressure test%s",
           prj.windat.Tambt, prj.windat.barpres, prj.windat.windspd, 
           prj.windat.winddir, prj.windat.relhum, prj.windat.daytyp, 
           prj.windat.uTa, prj.windat.ubP, prj.windat.uws, prj.windat.uwd, prj.EOL );

  if( prj.WTHfile == "null" || prj.WTHfile.length == 0 )
    pst += sprintf("null ! no weather file%s", prj.EOL );
  else
    pst += sprintf("%s ! weather file%s", prj.WTHfile, prj.EOL );

  if( prj.CTMfile == "null" || prj.CTMfile.length == 0 )
    pst += sprintf("null ! no contaminant file%s", prj.EOL );
  else
    pst += sprintf("%s ! contaminant file%s", prj.CTMfile, prj.EOL );

  if( prj.CVFfile == "null" || prj.CVFfile.length == 0 )
    pst += sprintf("null ! no continuous values file%s", prj.EOL );
  else
    pst += sprintf("%s ! continuous values file%s", prj.CVFfile, prj.EOL );

  if( prj.DVFfile == "null" || prj.DVFfile.length == 0 )
    pst += sprintf("null ! no discrete values file%s", prj.EOL );
  else
    pst += sprintf("%s ! discrete values file%s", prj.DVFfile, prj.EOL );

  if( prj.PLDdat.WPCfile == "null" )
  {
    pst += sprintf("null ! no WPC file%s", prj.EOL );
    prj.rcdat.WPC_Trigger = 0;
  }
  else
    pst += sprintf("%s ! WPC file%s", prj.PLDdat.WPCfile, prj.EOL );

  if( prj.PLDdat.EWCfile == "null" )
    pst += sprintf("null ! no EWC file%s", prj.EOL );
  else
    pst += sprintf("%s ! EWC file%s", prj.PLDdat.EWCfile, prj.EOL );

  pst += sprintf("%s%s", prj.PLDdat.WPCdesc, prj.EOL );
  pst += sprintf("!  Xref    Yref    Zref   angle u%s", prj.EOL );
  pst += sprintf(" %7.3f %7.3f %7.3f %6.2f %d%s",
    prj.PLDdat.X0, prj.PLDdat.Y0, prj.PLDdat.Z0, 
    prj.PLDdat.angle, prj.PLDdat.u_XYZ, prj.EOL );
  pst += sprintf("! epsP epsS  tShift  dStart dEnd wp mf wpctrig%s", prj.EOL );
  
  var tshift = CONTAM.TimeUtilities.IntTimeToStringTime(prj.PLDdat.tShift);
  var dstart = CONTAM.DateUtilities.IntDateXToStringDateX(prj.PLDdat.dStart);
  var dend = CONTAM.DateUtilities.IntDateXToStringDateX(prj.PLDdat.dEnd);
  pst += sprintf("  %.2f %.2f %s %5s %5s %2d %2d %2d%s",
    prj.PLDdat.epsPath, prj.PLDdat.epsSpcs, tshift, dstart, dend, 
    prj.useWPCwp, prj.useWPCmf, prj.rcdat.WPC_Trigger, prj.EOL );

  pst += sprintf("! latd  longtd   tznr  altd  Tgrnd u..%s", prj.EOL );
  pst += sprintf("%6.2f %7.2f %6.2f %5.0f %6.2f %d %d%s",
           prj.locdat.latd, prj.locdat.lgtd, prj.locdat.tznr, prj.locdat.altd,
           prj.locdat.Tgrnd, prj.locdat.utg, prj.locdat.u_a, prj.EOL );

  pst += sprintf("!sim_af afcalc afmaxi afrcnvg afacnvg afrelax uac Pbldg uPb%s", prj.EOL );
  pst += sprintf("%6d %6d %6d %7e %7e %7.2f %3d %5.2f %3d%s",
           prj.rcdat.sim_af, prj.rcdat.afcalc, prj.rcdat.afmaxi, prj.rcdat.afrcnvg,
           prj.rcdat.afacnvg, prj.rcdat.afrelax, prj.rcdat.uac2, 
           prj.rcdat.bldgPres, prj.rcdat.ubp, prj.EOL );                         // CW 2.4

  pst += sprintf("!   slae rs aflmaxi aflcnvg aflinit Tadj%s", prj.EOL );  // CW 2.2
  pst += sprintf("%7d %3d %6d %7e %6d %4d%s",
           prj.rcdat.afslae, prj.rcdat.afrseq, prj.rcdat.aflmaxi,
           prj.rcdat.aflcnvg ,prj.rcdat.aflinit, prj.rcdat.Tadj, prj.EOL );

  pst += sprintf("!sim_mf slae rs maxi   relcnvg   abscnvg relax gamma ucc%s", prj.EOL );
  pst += sprintf("%5d         %6d %9.2e %9.2e %5.3f       %3d ! (cyclic)%s",
           prj.rcdat.sim_mf, prj.rcdat.ccmaxi, prj.rcdat.ccrcnvg, 
           prj.rcdat.ccacnvg, prj.rcdat.ccrelax, prj.rcdat.uccc, prj.EOL );
  pst += sprintf("      %5d %3d %4d %9.2e %9.2e %5.3f %5.3f %3d ! (non-trace)%s",
           prj.rcdat.mfnmthd, prj.rcdat.mfnrseq,  prj.rcdat.mfnmaxi, prj.rcdat.mfnrcnvg, 
           prj.rcdat.mfnacnvg, prj.rcdat.mfnrelax, prj.rcdat.mfngamma, prj.rcdat.uccn, prj.EOL );
  pst += sprintf("      %5d %3d %4d %9.2e %9.2e %5.3f %5.3f %3d ! (trace)%s",
           prj.rcdat.mftmthd, prj.rcdat.mftrseq, prj.rcdat.mftmaxi, prj.rcdat.mftrcnvg, 
           prj.rcdat.mftacnvg, prj.rcdat.mftrelax, prj.rcdat.mftgamma, prj.rcdat.ucct, prj.EOL );
  pst += sprintf("      %5d %3d %4d %9.2e %9.2e %5.3f       %3d ! (cvode)%s",
           prj.rcdat.mfcmthd, prj.rcdat.mfcrseq, prj.rcdat.mfcmaxi, prj.rcdat.mfcrcnvg, 
           prj.rcdat.mfcacnvg, prj.rcdat.mfcrelax, prj.rcdat.uccv, prj.EOL );

  pst += sprintf("!mf_solver sim_1dz sim_1dd   celldx  sim_vjt udx%s", prj.EOL ); // CW 2.2, 3.1
  pst += sprintf("%6d %8d %7d    %9.2e %4d %5d%s",
    prj.rcdat.sim_transportSolver, prj.rcdat.sim_1dz, prj.rcdat.sim_1dd, 
    prj.rcdat.celldx, prj.rcdat.sim_vjt, prj.rcdat.ucdx, prj.EOL );

  pst += sprintf("!cvode    rcnvg     acnvg    dtmax%s", prj.EOL ); // CW 3.1
  pst += sprintf("%4d    %9.2e %9.2e %6.2f%s", prj.rcdat.cvode_mthd,
    prj.rcdat.cvode_rcnvg, prj.rcdat.cvode_acnvg, prj.rcdat.cvode_dtmax, prj.EOL );

  pst += sprintf("!tsdens relax tsmaxi cnvgSS densZP stackD dodMdt%s", prj.EOL ); // CW 2.2, 3.1
  pst += sprintf("%4d  %6.2f %5d %5d  %5d  %5d  %5d%s", 
          prj.rcdat.tsdens, prj.rcdat.tsrelax, prj.rcdat.tsmaxi, prj.rcdat.cnvgSS, 
          prj.rcdat.densZP, prj.rcdat.stackD, prj.rcdat.dodMdt, prj.EOL);

  pst += sprintf("!date_st time_st  date_0 time_0   date_1 time_1    t_step   t_list   t_scrn%s", prj.EOL );
  var datest = CONTAM.DateUtilities.IntDateToStringDate( prj.rcdat.date_st );
  var timest = CONTAM.TimeUtilities.IntTimeToStringTime(prj.rcdat.time_st);
  pst += sprintf("%7s %s", datest, timest);
  var date0 = CONTAM.DateUtilities.IntDateToStringDate( prj.rcdat.date_0 );
  var time0 = CONTAM.TimeUtilities.IntTimeToStringTime(prj.rcdat.time_0);
  pst += sprintf("%7s %s", date0, time0); 
  var date1 = CONTAM.DateUtilities.IntDateToStringDate( prj.rcdat.date_1 );
  var time1 = CONTAM.TimeUtilities.IntTimeToStringTime(prj.rcdat.time_1);
  pst += sprintf("%7s %s", date1, time1);
  var timestep = CONTAM.TimeUtilities.IntTimeToStringTime(prj.rcdat.time_step);
  pst += sprintf("  %s", timestep); 
  var timelist = CONTAM.TimeUtilities.IntTimeToStringTime(prj.rcdat.time_list);
  pst += sprintf(" %s", timelist); 
  var timescrn = CONTAM.TimeUtilities.IntTimeToStringTime(prj.rcdat.time_scrn);
  pst += sprintf(" %s%s", timescrn, prj.EOL);

  pst += sprintf("!restart  date  time%s", prj.EOL );
  var rstdate = CONTAM.DateUtilities.IntDateToStringDate( prj.rcdat.rstdate );
  var rsttime = CONTAM.TimeUtilities.IntTimeToStringTime( prj.rcdat.rsttime );
  pst += sprintf("%5d    %5s %s%s", prj.rcdat.restart, rstdate, rsttime, prj.EOL);

  pst += sprintf("!list doDlg pfsave zfsave zcsave%s", prj.EOL ); // CW 2.2
  pst += sprintf("%4d %5d %6d %6d %6d%s", prj.rcdat.list,//3.1
           prj.doDlg, prj.rcdat.pfsave, prj.rcdat.zfsave, prj.rcdat.zcsave, prj.EOL );
  pst += sprintf("!vol ach -bw cbw exp -bw age -bw%s", prj.EOL ); // CW 2.1a
  pst += sprintf("%3d %3d %3d %3d %3d %3d %3d %3d%s", //3.1
    prj.rcdat.achvol, prj.rcdat.achsave, prj.rcdat.abwsave, prj.rcdat.cbwsave,
    prj.rcdat.expsave, prj.rcdat.ebwsave, prj.rcdat.zaasave, prj.rcdat.zbwsave, prj.EOL);
  pst += sprintf("!rzf rzm rz1 csm srf log%s", prj.EOL ); // CW 3.1
  pst += sprintf("%3d %3d %3d %3d %3d %3d%s", 
    prj.rcdat.rzfsave, prj.rcdat.rzmsave, prj.rcdat.rz1save,
    prj.rcdat.csmsave, prj.rcdat.srfsave, prj.rcdat.clgsave, prj.EOL);

  pst += sprintf("!bcx dcx pfq zfq zcq%s", prj.EOL ); // CW 3.2
  pst += sprintf("%3d %3d %3d %3d %3d%s", 
    prj.rcdat.bcexsave, prj.rcdat.dcexsave, prj.rcdat.pfsqlsave,
    prj.rcdat.zfsqlsave, prj.rcdat.zcsqlsave, prj.EOL);

  pst += sprintf("! 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 <- extra[]%s", prj.EOL );
  for( i=0; i<16; i++ )
    pst += sprintf(" %2d", prj.rcdat.extra[i] );
  pst += sprintf("%s", prj.EOL );
  pst += sprintf("%d ! rvals:%s", prj.rcdat.nrvals, prj.EOL ); // CW 2.4b
  for( i=0; i<prj.rcdat.nrvals; i++ ) 
    pst += sprintf("%e ", prj.rcdat.rvals[i] );
  pst += sprintf("%s", prj.EOL );

  pst += sprintf("!valZ valD valC%s", prj.EOL ); // CW 2.4
  pst += sprintf("%4d %4d %4d%s", 
           prj.rcdat.doBldgFlowZ, prj.rcdat.doBldgFlowD, prj.rcdat.doBldgFlowC, prj.EOL );

  pst += sprintf("!cfd  cfdcnvg   var zref  maxi dtcmo%s", prj.EOL); // CW 3.0
  pst += sprintf("%3d  %9.2e %3d %3d   %5d %3d%s", prj.rcdat.cfd_ctype, 
           prj.rcdat.cfd_convcpl, prj.rcdat.cfd_var, 0, prj.rcdat.cfd_imax, 
           prj.rcdat.cfd_dtcmo, prj.EOL);
  pst += prj.UNK.toString() + prj.EOL;
    
  prj.pst = pst;
  return 0;

}  /* end run_save */

CONTAM.Project.spcs_save = function(lib, cflag)
{
  var spcs;
  var nspcs=0, nctm=0;
  var j;
  var pe0;
  var prj = CONTAM.Project;
  var pst = "";
  
  if(lib)
    pe0 = prj.SpcsLib0;
  else
    pe0 = prj.Spcs0;
  
  for( spcs=pe0.start; spcs; spcs=spcs.next )
  {
    spcs.nr = ++nspcs;             /* renumber species */
    if( spcs.sflag ) 
      nctm++;       /* count contaminants */
  }

  if( cflag )
  {
    if( prj.nctm != nctm ) 
      CONTAM.error( 2, " nctm mis-match" );
  }
  else
  {
    if( nctm > 0 )
    {
      for( spcs=pe0.start; spcs; spcs=spcs.next )
      {
        if( spcs.sflag ) 
          spcs.sflag = 0;
      }
      nctm = 0;
    }
  }

  pst += sprintf("%d ! contaminants:%s", nctm, prj.EOL );
  if( nctm )
  {
    pst += sprintf("  " );
    for( j=0; j<nctm; j++ )
      pst += sprintf(" %d", CONTAM.Project.Ctm[j].nr );   /* order from ctm_set */
    pst += prj.EOL;
  }

  pst += sprintf("%d ! species:%s", nspcs, prj.EOL );
  if( nspcs > 0 )
    pst += sprintf("! # s t   molwt    mdiam       edens       decay         Dm         CCdef        Cp          Kuv     u[5]      name%s", prj.EOL );

  for( spcs=pe0.start; spcs; spcs=spcs.next )
  {
    pst += sprintf("%3d %d %d %8.4f %11.4e %11.4e %11.4e %11.4e %11.4e %11.4e %11.4e %d %d %d %d %d %s%s",
      spcs.nr, spcs.sflag, spcs.ntflag, spcs.molwt, spcs.mdiam, 
      spcs.edens, spcs.decay, spcs.Dm, spcs.ccdef, spcs.Cp,  spcs.Kuv,
      spcs.ucc, spcs.umd, spcs.ued, spcs.udm, spcs.ucp, spcs.name, prj.EOL );
    pst += sprintf("%s%s", spcs.desc, prj.EOL );
  }

  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nspcs;

}  /* end spcs_save */


CONTAM.Project.icons_chk = function()
{
  var pld;
  var pid;
  var buffer;
  var undefined = "\nThe icon has been set to undefined.";
  var err=0;
  var prj = CONTAM.Project;

  for( pld=CONTAM.Project.Lev0; pld; pld=pld.above )
  {
    for( pid=pld.pid; pid; pid=pid.next )            /* write icons */
    {
      buffer = sprintf(": level %d icon (%d %d %d %d)",
        pld.nr, pid.icon, pid.col, pid.row, pid.nr );
      switch (pid.icon)
      {
        case CONTAM.Icons.ZONE_ST:  /*   5  zone - standard */
        case CONTAM.Icons.ZONE_PH:  /*   6  zone - phantom */
          if( pid.nr < CONTAM.Icons.ZNDF || 
              pid.nr > prj.nzone || pid.nr == 0 )
          {
            CONTAM.error( 2, "Invalid zone #", buffer, undefined );
            pid.nr = CONTAM.Icons.ZNDF;
          }
          break;
        case CONTAM.Icons.WL_EW:    /*  11  wall - east/west */
        case CONTAM.Icons.WL_NS:    /*  12  wall - north/south */
        case CONTAM.Icons.WL_ES:    /*  14  wall - northwest corner */
        case CONTAM.Icons.WL_SW:    /*  15  wall - northeast corner */
        case CONTAM.Icons.WL_NW:    /*  16  wall - southeast corner */
        case CONTAM.Icons.WL_NE:    /*  17  wall - southwest corner */
        case CONTAM.Icons.WL_NES:   /*  18  walls - to north, east, and south */
        case CONTAM.Icons.WL_ESW:   /*  19  walls - to east, south, and west */
        case CONTAM.Icons.WL_NSW:   /*  20  walls - to south, west, and north */
        case CONTAM.Icons.WL_NEW:   /*  21  walls - to west, north, and east */
        case CONTAM.Icons.WL_NESW:  /*  22  wall quad corner */
          if( pid.nr != 0 )
          {
            CONTAM.error( 2, "Invalid wall #", buffer, "\nThe icon has been corrected.");
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.OPNG:     /*  23  opening - 1-way airflow */
        case CONTAM.Icons.DOOR:     /*  24  opening - 2-way airflow */
        case CONTAM.Icons.LG_OPNG:  /*  25  large 1-way opening */
        case CONTAM.Icons.LG_DOOR:  /*  27  large 2-way opening */
        case CONTAM.Icons.FAN_E:    /*  28  fan - flow to the east */
        case CONTAM.Icons.FAN_W:    /*  29  fan - flow to the west */
        case CONTAM.Icons.FAN_N:    /*  30  fan - flow to the north */
        case CONTAM.Icons.FAN_S:    /*  31  fan - flow to the south */
        case CONTAM.Icons.BOX_S:    /* 128  box - AHS supply */
        case CONTAM.Icons.BOX_R:    /* 129  box - AHS return */
          if( pid.nr < 0 || pid.nr > prj.npath )
          {
            CONTAM.error( 2, "Invalid path #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.NOTE:     /*  42  note - '*' */
          if( pid.nr < 0 || pid.nr > prj.nnote )
          {
            CONTAM.error( 2, "Invalid note #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.S_AHS:    /* 130  simple AHS zones/element */
          if( pid.nr < 0 || pid.nr > prj.nahs )
          {
            CONTAM.error( 2, "Invalid AHS #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.PEXP:     /* 131  personal exposure */
          if( pid.nr < 0 || pid.nr > prj.npexp )
          {
            CONTAM.error( 2, "Invalid exposure #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.CONT_SS:  /* 133  contaminant source/sink (C95) */
          if( pid.nr < 0 || pid.nr > prj.ncss )
          {
            CONTAM.error( 2, "Invalid source #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.DCT_EWk:  /* 145  duct (saved) - east/west */
        case CONTAM.Icons.DCT_NSk:  /* 146  duct (saved) - north/south */
        case CONTAM.Icons.DCT_ES:   /* 147  duct - east/south */
        case CONTAM.Icons.DCT_SW:   /* 148  duct - south/west */
        case CONTAM.Icons.DCT_NW:   /* 149  duct - north/west */
        case CONTAM.Icons.DCT_NE:   /* 150  duct - north/east */
        case CONTAM.Icons.DCT_X:    /* 151  duct crossing */
          if( pid.nr < 0 || pid.nr > prj.ndct )
          {
            CONTAM.error( 2, "Invalid duct #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.DCT_NSn:  /* 154  duct - north/south - north positive */
        case CONTAM.Icons.DCT_EWe:  /* 155  duct - east/west - east positive */
        case CONTAM.Icons.DCT_NSs:  /* 156  duct - north/south - south positive */
        case CONTAM.Icons.DCT_EWw:  /* 157  duct - east/west - west positive */
          if( pid.nr < 1 || pid.nr > prj.ndct )
          {
            CONTAM.error( 2, "Invalid duct #", buffer, "\nThis icon cannot be undefined." );
            err=1;
          }
          break;
        case CONTAM.Icons.JCT:      /* 158  junction */
        case CONTAM.Icons.JCT_CA:   /* 159  junction - connected to level above */
        case CONTAM.Icons.JCT_CB:   /* 160  junction - connected to level below */
        case CONTAM.Icons.JCT_CAB:  /* 161  junction - connected above & below */
        case CONTAM.Icons.IOJ:      /* 162  junction terminal */
        case CONTAM.Icons.IOJ_CA:   /* 163  terminal - connected to level above */
        case CONTAM.Icons.IOJ_CB:   /* 164  terminal - connected to level below */
          if( pid.nr < 0 || pid.nr > prj.njct )
          {
            CONTAM.error( 2, "Invalid junction #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.ZONE_AM:  /*   7  zone - ambient */
          if( pid.nr != CONTAM.AMBT )
          {
            CONTAM.error( 2, "Invalid AMBT #", buffer, "\nThe icon has been corrected." );
            pid.nr = CONTAM.AMBT;
          }
          break;
        case CONTAM.Icons.CS_N:     /*   control sensors */
        case CONTAM.Icons.CS_E:
        case CONTAM.Icons.CS_S:
        case CONTAM.Icons.CS_W:
        case CONTAM.Icons.CTRLN:    /* control nodes */
        case CONTAM.Icons.CTRLP:
        case CONTAM.Icons.CTRLS:
          if( pid.nr < 0 || pid.nr > prj.nctrl )
          {
            CONTAM.error( 2, "Invalid control #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        case CONTAM.Icons.CL_EW:    /* control links */
        case CONTAM.Icons.CL_NS:
        case CONTAM.Icons.CL_EWk:
        case CONTAM.Icons.CL_NSk:
        case CONTAM.Icons.CL_ES:
        case CONTAM.Icons.CL_SW:
        case CONTAM.Icons.CL_NW:
        case CONTAM.Icons.CL_NE:
        case CONTAM.Icons.CL_X:
        case CONTAM.Icons.CA_N:     /* control actuators */
        case CONTAM.Icons.CA_E:
        case CONTAM.Icons.CA_S:
        case CONTAM.Icons.CA_W:
          if( pid.nr < 0 || pid.nr > prj.nctrl )
          {
            CONTAM.error( 2, "Invalid link #", buffer, undefined );
            pid.nr = 0;
          }
          break;
        default:
          CONTAM.error( 2, "Invalid icon", buffer );
          err=1;
          break;
      }  /* end switch */
    }  /* end icon loop */
  }  /* end level loop */

  return err;
}  /* end icons_chk */

CONTAM.Project.level_save = function ()
{
  var pld;
  var pid;
  var nicon, nlev=0;
  var prj = CONTAM.Project;
  var pst = "";
  
  for( pld=prj.Lev0; pld; pld=pld.above )
    pld.nr = ++nlev;
  pst += sprintf( "%d ! levels plus icon data:%s", nlev, prj.EOL );
  pst += sprintf( "! #  refHt   delHt  ni  u  name%s", prj.EOL );

  for( pld=CONTAM.Project.Lev0; pld; pld=pld.above )
  {
    for( nicon=0,pid=pld.pid; pid; pid=pid.next )    /* count icons */
      nicon++;
    pst += sprintf("%3d %7.3f %7.3f %d %d %d %s%s", pld.nr, pld.refht,
      pld.delht, nicon, pld.u_rfht, pld.u_dlht, pld.name, prj.EOL );
    pst += sprintf("!icn col row  #%s", prj.EOL );
    for( pid=pld.pid; pid; pid=pid.next )            /* write icons */
      pst += sprintf(" %3d %3d %3d %3d%s",
        pid.icon, pid.col, pid.row, pid.nr, prj.EOL );
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nlev;

}  /* end level_save */


CONTAM.Project.dschd_save = function (lib)
{
  var pds, pe0;
  var ndsch=0, j;
  var prj = CONTAM.Project;
  var pst = "";

  if(lib)
    pe0 = prj.DschLib0;
  else
    pe0 = prj.Dsch0;

  for( pds=pe0.start; pds; pds=pds.next )
    pds.nr = ++ndsch;
  pst += sprintf("%d ! day-schedules:%s", ndsch, prj.EOL);
  if( ndsch > 0 )
    pst += sprintf("! # npts shap utyp ucnv name%s", prj.EOL);

  for( pds=pe0.start; pds; pds=pds.next )
  {
    pst += sprintf("%3d %4d %4d %4d %4d %s%s%s%s",
      pds.nr, pds.npts, pds.shape, pds.utyp, 
      pds.ucnv, pds.name, prj.EOL, pds.desc, prj.EOL);

    for( j=0; j<pds.npts; j++ )
    {
      var time = CONTAM.TimeUtilities.IntTimeToStringTime(pds.time[j]);
      pst += sprintf(" %s %f%s", time, pds.ctrl[j], prj.EOL);
    }
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return ndsch;

}  /* end dschd_save */

CONTAM.Project.wschd_save = function(lib)
{
  var pws, pe0;
  var nwsch=0, j, k;
  var prj = CONTAM.Project;
  var pst = "";

  if(lib)
    pe0 = prj.WschLib0;
  else
    pe0 = prj.Wsch0;

  for( pws=pe0.start; pws; pws=pws.next )
    pws.nr = ++nwsch;
  pst += sprintf("%d ! week-schedules:%s", nwsch, prj.EOL);
  if( nwsch > 0 )
    pst += sprintf("! # utyp ucnv name%s", prj.EOL);

  for( pws=pe0.start; pws; pws=pws.next )
  {
    pst += sprintf("%3d %4d %4d %s%s%s%s",
      pws.nr, pws.utyp, pws.ucnv, pws.name, prj.EOL, pws.desc, prj.EOL);
    for( j=0; j<12; j++ )
    {
      if( !pws.pds[j] ) 
        CONTAM.error( 2, "Bad week-schedule: ", pws.name);
      k = pws.pds[j].nr;
      if( k<1 || k>prj.ndsch ) 
        CONTAM.error( 2, "Bad week-schedule: ", pws.name);
      pst += sprintf(" %d", k);
    }
    pst += prj.EOL;
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nwsch;

}  /* end wschd_save */

CONTAM.Project.wind_save = function(lib)
{
  var pwp; /* wind pressure profile */
  var nwpf=0, j, pe0;
  var prj = CONTAM.Project;
  var pst = "";

  if(lib)
    pe0 = prj.WpfLib0;
  else
    pe0 = prj.Wpf0;

  for( pwp=pe0.start; pwp; pwp=pwp.next )
    pwp.nr = ++nwpf;
  pst += sprintf("%d ! wind pressure profiles:%s", nwpf, prj.EOL);

  for( pwp=pe0.start; pwp; pwp=pwp.next )
  {
    pst += sprintf("%d %d %d %s%s%s%s",
      pwp.nr, pwp.npts, pwp.type, pwp.name, prj.EOL, pwp.desc, prj.EOL);
    for( j=0; j<pwp.npts; j++ )
      pst += sprintf(" %5.1f %6.3f", pwp.azm[j], pwp.coef[j]) + prj.EOL;
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nwpf;
}  /* end wind_save */

CONTAM.Project.kinetic_save = function(lib)
{
  var pkr; /* kinetic rection data */
  var nkinr=0, pe0;
  var prj = CONTAM.Project;
  var pst = "";

  if(lib)
    pe0 = prj.KinrLib0;
  else
    pe0 = prj.Kinr0;

  for( pkr=pe0.start; pkr; pkr=pkr.next )
    pkr.nr = ++nkinr;
  pst += sprintf("%d ! kinetic reactions:%s", nkinr, prj.EOL);

  for( pkr=pe0.start; pkr; pkr=pkr.next )
  {
    var pkd;
    var nkrd=0;
    for( pkd=pkr.pkd; pkd; pkd=pkd.next )    /* count reactions */
      nkrd++;
    pst += sprintf("%d %d %s%s%s%s",
      pkr.nr, nkrd, pkr.name, prj.EOL, pkr.desc, prj.EOL);
    for( pkd=pkr.pkd; pkd; pkd=pkd.next )    /* print reactions */
      pst += sprintf(" %s %s %f",
        pkd.product.name, pkd.source.name, pkd.coef) + prj.EOL;
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nkinr;

}  /* end kinetic_save */

CONTAM.Project.flte_save = function(lib)
{
  var pfe; /* filter element data */
  var k, nflte=0, pe0;
  var prj = CONTAM.Project;
  var pst = "";
  
  if(lib)
    pe0 = prj.FlteLib0;
  else
    pe0 = prj.Flte0;

  for( pfe=pe0.start; pfe; pfe=pfe.next )
    pfe.nr = ++nflte;

  pst += sprintf("%d ! filter elements:%s", nflte, prj.EOL);

  for( pfe=pe0.start; pfe; pfe=pfe.next ) // ####
  {
    pst += sprintf("%d %s %f %f %f %d %d %s%s",
      pfe.nr, CONTAM.Globals.flte_names[pfe.ftype], pfe.area, pfe.depth,
      pfe.dens, pfe.ual, pfe.ud, pfe.name, prj.EOL);
    pst += sprintf("%s%s", pfe.desc, prj.EOL);
    switch (pfe.ftype)
    {
    case CONTAM.Globals.FL_CEF: 
      {
        var ped = pfe.ped;         /* constant efficieny filter */
        pst += sprintf("%3d%s", ped.nspcs, prj.EOL);
        for( k=0; k<ped.nspcs; k++ )
          pst += sprintf("  %s %f%s", ped.spcs[k].name, ped.eff[k], prj.EOL);
        break;
      } 
    case CONTAM.Globals.FL_PF0: 
      {
        var ped = pfe.ped;         /* particle filter 0 */
        pst += sprintf(" %d %d%s", ped.npts, ped.usz, prj.EOL);
        for( k=0; k<ped.npts; k++ )
          pst += sprintf("  %f %f%s", ped.size[k], ped.eff[k], prj.EOL);
        break;
      }
    case CONTAM.Globals.FL_GF0: 
      {
        var ped = pfe.ped;         /* gas filter 0 */
        var n;
        pst += sprintf(" %d%s", ped.nspcs, prj.EOL);
        for( n=0; n<ped.nspcs; n++ )
        {
          pst += sprintf("  %s %f %d%s",
            ped.spcs[n].name, ped.bthru[n], ped.npts[n], prj.EOL );
          for( k=0; k<ped.npts[n]; k++ )
            pst+= sprintf("  %f %f%s", ped.load[n][k], ped.eff[n][k], prj.EOL );
        }
        break;
      }
    case CONTAM.Globals.FL_UV1:  // UVGI Penn State model 1
      {
        var ped = pfe.ped;
        pst += sprintf(" %f %f %f %f %d %f %f %f %f %f %f %f %d %d", 
          ped.Sdes, ped.Udes, ped.Fdes, ped.Kdes, ped.age, 
          ped.C0, ped.C1, ped.C2, ped.C3, ped.C4, ped.K0, 
          ped.K1, ped.u_Fdes, ped.u_Udes) + prj.EOL;
        break;
      }
    case CONTAM.Globals.FL_SPF:  // Super filter
      {
        var nsflte=0;
        var psl;
        for( psl=pfe.ped; psl; psl=psl.next )
          nsflte++;
        pst += sprintf("%d%s", nsflte, prj.EOL);
        for ( psl=pfe.ped; psl; psl=psl.next )
          pst += sprintf(" %d", psl.pflte.nr );
        pst += prj.EOL;
        break;
      }
    default:
      CONTAM.error( 2, "Invalid element type ", pfe.ftype.toString());
    }  /* end switch */
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nflte;

}  /* end flte_save */

CONTAM.Project.filter_save = function()
{
  var pfl; /* filter data */
  var psl;
  var pl;
  var pil;
  var i, k;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! filters:%s", prj.nfilt, prj.EOL );

  for( i=1;i<=prj.nfilt;i++ )
  {
    pfl = prj.FiltList[i];
    if ( !pfl ) 
      continue;
    if ( pfl.pe.ftype == CONTAM.Globals.FL_SPF )
      for ( psl=pfl.pe.ped,k=0; psl; psl=psl.next,k++); // find number of sub elements
    else 
      k=1;
    pst += sprintf("%3d %3d %3d%s", pfl.nr, pfl.pe.nr, k, prj.EOL );/* print filter */
    for( pl=pfl.pl; pl; pl=pl.next)
    {
      for ( k=0, pil=pl.pll; pil; pil=pil.next, k++); //find number of iloadings
      pst += sprintf("   %f %d%s", pl.tload, k, prj.EOL );
      for ( pil=pl.pll; pil; pil=pil.next)                      //@@@ This does not look right.
        pst += sprintf("   %s %f\n", pil.ps.name, pil.loadi ); //@@@  OK for now k always 0.
    }
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;
}  /* end filter_save */

CONTAM.Project.cselmt_save = function(lib)
{
  var pss; /* s/s element */
  var ncse=0, pe0;
  var prj = CONTAM.Project;
  var pst = "";

  if(lib)
    pe0 = prj.CseLib0;
  else
    pe0 = prj.Cse0;

  for( pss=pe0.start; pss; pss=pss.next )
    pss.nr = ++ncse;
  pst += sprintf("%d ! source/sink elements:%s", ncse, prj.EOL);

  for( pss=pe0.start; pss; pss=pss.next )
  {
    if ( pss.ctype != CONTAM.Globals.CS_SUP )
    {
      pst += sprintf("%d %s %s %s%s%s%s", pss.nr, pss.spcs.name, 
        CONTAM.Globals.csse_names[pss.ctype], pss.name, prj.EOL, pss.desc, prj.EOL);
    }
    else
    {
      pst += sprintf("%d %s %s %s%s%s%s", pss.nr, "null", 
        CONTAM.Globals.csse_names[pss.ctype], pss.name, prj.EOL, pss.desc, prj.EOL);
    }
    switch (pss.ctype)
    {
    case CONTAM.Globals.CS_CCF: 
      {
        var ped = pss.ped; /* s/s const coef data */
        pst += sprintf(" %f %f %d %d", ped.G, ped.D, ped.u_G, ped.u_D) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_PRS: 
      {
        var ped = pss.ped; /* s/s pressure data */
        pst += sprintf(" %f %f %d", ped.G, ped.x, ped.u_G) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_CUT: 
      {
        var ped = pss.ped; /* s/s cutoff data */
        pst += sprintf(" %f %f %d %d", ped.G, ped.Co, ped.u_G, ped.u_C) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_EDS: 
      {
        var ped = pss.ped; /* exponentially decaying s/s data */
        pst += sprintf(" %f %f %d %d", ped.G0, ped.k, ped.u_G, ped.u_k) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_BLS: 
      {
        var ped = pss.ped; /* boundary layer reversible sink data */
        pst += sprintf(" %f %f %f %f %d %d %d", ped.hm, ped.rho, 
                  ped.Kp, ped.M, ped.u_h, ped.u_r, ped.u_M) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_BRS: 
      {
        var ped = pss.ped; /* burst source data */
        pst += sprintf(" %f %d", ped.M, ped.u_M) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_DVS: 
      {
        var ped = pss.ped; /* deposition velocity sink - 2004/06/03 */
        pst += sprintf(" %f %f %d %d", ped.dV, ped.dA, ped.u_V, ped.u_A) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_DRS: 
      {
        var ped = pss.ped; /* deposition velocity sink - 2004/06/03 */
        pst += sprintf(" %f %d", ped.kd, ped.u_k) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_DVR: 
      {
        var ped = pss.ped; /* deposition velocity w/ resuspension - 2009/05/27 */
        pst += sprintf(" %f %f %f %f %d %d %d %d", ped.dV, ped.R, ped.dA, 
          ped.rA, ped.u_V, ped.u_R, ped.u_dA, ped.u_rA) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_PLM: 
      {
        var ped = pss.ped; /* Power Law - 2006/04/17 */
        pst += sprintf(" %f %f %f %d %d", ped.a, 
                  ped.b, ped.tp, ped.u_a, ped.u_tp) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_PKM: 
      {
        var ped = pss.ped; /* Peak Model - 2006/02/07 */
        pst += sprintf(" %f %f %f %d %d", 
          ped.a, ped.b, ped.tp, ped.u_a, ped.u_tp) + prj.EOL;
        break;
      }
    case CONTAM.Globals.CS_SUP: /* super source element - 2006/03/31 */
      {
        var nscse=0;
        var psl;
        for( psl=pss.ped; psl; psl=psl.next )
          nscse++;
        pst += sprintf("%d%s", nscse, prj.EOL );
        for ( psl=pss.ped; psl; psl=psl.next )
          pst += sprintf(" %d", psl.pcse.nr );
        pst += prj.EOL;
        break;
      }
    default:
      CONTAM.error( 2, "Invalid element type " + pss.ctype.toString());
    }  /* end switch */
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return ncse;

}  /* end cselmt_save */

CONTAM.Project.afelmt_save = function(lib, ducts)
{
  var pe;  /* element data */
  var nafe=0, j, pe0;
  var prj = CONTAM.Project;
  var pst = "";

  if(ducts)
  {
    if(lib)
      pe0 = prj.DfeLib0;
    else
      pe0 = prj.Dfe0;
  }
  else
  {
    if(lib)
      pe0 = prj.AfeLib0;
    else
      pe0 = prj.Afe0;
  }

  for( pe=pe0.start; pe; pe=pe.next )
    pe.nr = ++nafe;
  if( ducts )
    pst += sprintf("%d ! duct elements:%s", nafe, prj.EOL);
  else
    pst += sprintf("%d ! flow elements:%s", nafe , prj.EOL);

  for( pe=pe0.start; pe; pe=pe.next )
  {
    pst += sprintf("%d %d %s %s%s%s%s", pe.nr, pe.icon, 
      CONTAM.Globals.afe_dnames[pe.dtype], pe.name, prj.EOL, pe.desc, prj.EOL );
    switch (pe.dtype)
    {
      case CONTAM.Globals.PL_ORFC: 
      {
        var ped = pe.ped; /* orifice area data */
        pst += sprintf(" %f %f %f %f %f %f %f %d %d",
          ped.lam, ped.turb, ped.expt,
          ped.area, ped.dia, ped.coef,
          ped.Re, ped.u_A, ped.u_D) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_LEAK1:
      case CONTAM.Globals.PL_LEAK2:
      case CONTAM.Globals.PL_LEAK3: 
      {
        var ped = pe.ped; /* leakage area data */
        pst += sprintf(" %f %f %f %f %f %f %f %f %d %d %d %d", ped.lam, 
          ped.turb, ped.expt, ped.coef, ped.pres, ped.area1, ped.area2, 
          ped.area3, ped.u_A1, ped.u_A2, ped.u_A3, ped.u_dP) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_CONN: 
      {
        var ped = pe.ped; /* connection data */
        pst += sprintf(" %f %f %f %f %f %d",
          ped.lam, ped.turb, ped.expt, ped.area, ped.coef, ped.u_A) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_QCN: 
      {
        var ped = pe.ped;  /* direct coef data */
        pst += sprintf(" %f %f %g", ped.lam, ped.turb, ped.expt) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_FCN: 
      {
        var ped = pe.ped;  /* direct coef data */
        pst += sprintf(" %f %f %f", ped.lam, ped.turb, ped.expt) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_TEST1: 
      {
        var ped = pe.ped; /* test1 data */
        pst += sprintf(" %f %f %f %f %f %d %d", ped.lam, ped.turb, 
          ped.expt, ped.dP, ped.Flow, ped.u_P, ped.u_F) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_TEST2: 
      {
        var ped = pe.ped; /* test2 data */
        pst += sprintf(" %f %f %f %f %f %f %f %d %d %d %d",
          ped.lam, ped.turb, ped.expt, ped.dP1, ped.F1, ped.dP2, ped.F2, 
          ped.u_P1, ped.u_F1, ped.u_P2, ped.u_F2) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_CRACK: 
      {
        var ped = pe.ped; /* crack data */
        pst += sprintf(" %f %f %f %f %f %d %d", ped.lam, ped.turb, 
          ped.expt, ped.length, ped.width, ped.u_L, ped.u_W) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_STAIR: 
      {
        var ped = pe.ped; /* stairwell data */
        pst += sprintf(" %f %f %f %f %f %f %d %d %d", ped.lam, ped.turb, ped.expt,
          ped.Ht, ped.area, ped.peo, ped.tread, ped.u_A, ped.u_D) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_SHAFT: 
      {
        var ped = pe.ped; /* shaft data */
        pst += sprintf(" %f %f %f %f %f %f %f %d %d %d %d", 
          ped.lam, ped.turb, ped.expt, ped.Ht, ped.area, ped.perim, 
          ped.rough, ped.u_A, ped.u_D, ped.u_P, ped.u_R) + prj.EOL;
        break;
      }
      case CONTAM.Globals.SR_JWA: 
      {
        var ped = pe.ped; /* self-regulating vent */
        pst += sprintf(" %f %f %f %d %d",
          ped.F0, ped.P0, ped.f, ped.u_F0, ped.u_P0) + prj.EOL;
        break;
      }
      case CONTAM.Globals.QF_QAB: 
      {
        var ped = pe.ped;  /* direct coef data */
        pst += sprintf(" %f %f", ped.a, ped.b) + prj.EOL;
        break;
      }
      case CONTAM.Globals.QF_FAB: 
      {
        var ped = pe.ped;  /* direct coef data */
        pst += sprintf(" %f %f", ped.a, ped.b) + prj.EOL;
        break;
      }
      case CONTAM.Globals.QF_CRACK: 
      {
        var ped = pe.ped; /* crack data */
        pst += sprintf(" %f %f %f %f %f %d %d %d %d",
          ped.a, ped.b, ped.length, ped.width, ped.depth,
          ped.nB, ped.u_L, ped.u_W, ped.u_D) + prj.EOL;
        break;
      }
      case CONTAM.Globals.QF_TEST2: 
      {
        var ped = pe.ped; /* test2 data */
        pst += sprintf(" %f %f %f %f %f %f %d %d %d %d",
          ped.a, ped.b, ped.dP1, ped.F1, ped.dP2, ped.F2, 
          ped.u_P1, ped.u_F1, ped.u_P2, ped.u_F2) + prj.EOL;
        break;
      }
      case CONTAM.Globals.DR_DOOR: 
      {
        var ped = pe.ped; /* door data */
        pst += sprintf(" %f %f %f %f %f %f %f %d %d %d",
          ped.lam, ped.turb, ped.expt, ped.dTmin, ped.ht,
          ped.wd, ped.cd, ped.u_T, ped.u_H, ped.u_W) + prj.EOL;
        break;
      }
      case CONTAM.Globals.DR_PL2: 
      {
        var ped = pe.ped; /* 2-opening data */
        pst += sprintf(" %f %f %f %f %f %f %f %d %d",
          ped.lam, ped.turb, ped.expt, ped.dH,
          ped.ht, ped.wd, ped.cd, ped.u_H, ped.u_W) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_BDQ: 
      {
        var ped = pe.ped; /* damper coef data */
        pst += sprintf(" %f %f %f %f %f",
          ped.lam, ped.Cp, ped.xp, ped.Cn, ped.xn) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_BDF: 
      {
        var ped = pe.ped; /* damper coef data */
        pst += sprintf(" %f %f %f %f %f",
          ped.lam, ped.Cp, ped.xp, ped.Cn, ped.xn) + prj.EOL;
        break;
      }
      case CONTAM.Globals.FN_CMF: 
      {
        var ped = pe.ped; /* const mass flow data */
        pst += sprintf(" %f %d", ped.Flow, ped.u_F) + prj.EOL;
        break;
      }
      case CONTAM.Globals.FN_CVF: 
      {
        var ped = pe.ped; /* const volume flow data */
        pst += sprintf(" %f %d", ped.Flow, ped.u_F) + prj.EOL;
        break;
      }
      case CONTAM.Globals.FN_FAN: 
      {
        var ped = pe.ped; /* cubic polynomial fan data */
        pst += sprintf(" %f %f %f %f %f %f %f", ped.lam, ped.turb, 
          ped.expt, ped.rdens, ped.fdf, ped.sop, ped.off) + prj.EOL;
        pst += sprintf(" %f %f %f %f %f %f %d",
          ped.fpc[0], ped.fpc[1], ped.fpc[2], ped.fpc[3],
          ped.npts, ped.Sarea, ped.u_Sa) + rpj.EOL;
        for( j=0; j<ped.npts; j++ )
          pst += sprintf("  %f %d %f %d %f %d", ped.mF[j], ped.u_mF[j],
            ped.dP[j], ped.u_dP[j], ped.rP[j], ped.u_rP[j]) + prj.EOL;
        break;
      }
      case CONTAM.Globals.DD_DWC: 
      {
        var ped = pe.ped; /* Darcy-Weisbach duct */
        pst += sprintf(" %f %f %d", ped.rough, ped.lam, ped.u_R) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.DD_PLR: 
      {
        var ped = pe.ped; /* orifice model duct */
        pst += sprintf(" %f %f %f %f %f %f %d %d", ped.lam, ped.turb, ped.expt,
          ped.area, ped.dia, ped.coef, ped.u_A, ped.u_D) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.DD_FCN: 
      {
        var ped = pe.ped; /* direct coef duct */
        pst += sprintf(" %f %f %f", ped.lam, ped.turb, ped.expt) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.DD_QCN: 
      {
        var ped = pe.ped; /* direct coef duct */
        pst += sprintf(" %f %f %f", ped.lam, ped.turb, ped.expt) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.DD_FAN: 
      {
        var ped = pe.ped; /* cubic polynomial fan duct */
        pst += sprintf(" %f %f %f %f %f %f %f", ped.lam, ped.turb, 
          ped.expt, ped.rdens, ped.fdf, ped.sop, ped.off) + prj.EOL;
        pst += sprintf(" %f %f %f %f %d %f %d",
          ped.fpc[0], ped.fpc[1], ped.fpc[2], ped.fpc[3],
          ped.npts, ped.Sarea, ped.u_Sa) + prj.EOL;
        for( j=0; j<ped.npts; j++ )
          pst += sprintf("  %f %d %f %d %f %d", ped.mF[j], ped.u_mF[j],
            ped.dP[j], ped.u_dP[j], ped.rP[j], ped.u_rP[j]) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.DD_CMF: 
      {
        var ped = pe.ped; /* const mass flow duct */
        pst += sprintf(" %f %d", ped.Flow, ped.u_F) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }  
      case CONTAM.Globals.DD_CVF: 
      {
        var ped = pe.ped; /* const volume flow duct */
        pst += sprintf(" %f %d", ped.Flow, ped.u_F) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.DD_BDF: 
      {
        var ped = pe.ped; /* damper (mass flow) duct */
        pst += sprintf(" %f %f %f %f %f",
          ped.lam, ped.Cp, ped.xp, ped.Cn, ped.xn) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.DD_BDQ: 
      {
        var ped = pe.ped; /* damper (volume flow) duct */
        pst += sprintf(" %f %f %f %f %f",
          ped.lam, ped.Cp, ped.xp, ped.Cn, ped.xn) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.CS_FSP:
      case CONTAM.Globals.CS_QSP:
      case CONTAM.Globals.CS_PSF:
      case CONTAM.Globals.CS_PSQ: 
      {
        var ped = pe.ped;         
        pst += sprintf(" %d %d %d", ped.npts, ped.u_X, ped.u_Y) + prj.EOL;
        for( j=0; j<ped.npts; j++ )
          pst += sprintf("  %f %f", ped.X[j], ped.Y[j]) + prj.EOL;
        break;
      }
      case CONTAM.Globals.DD_FSP:
      case CONTAM.Globals.DD_QSP:
      case CONTAM.Globals.DD_PSF:
      case CONTAM.Globals.DD_PSQ:
      {
        var ped = pe.ped;         
        pst += sprintf(" %d %d %d", ped.npts, ped.u_X, ped.u_Y) + prj.EOL;
        for( j=0; j<ped.npts; j++ )
          pst += sprintf("  %f %f", ped.X[j], ped.Y[j]) + prj.EOL;
        pst += prj.dfedat_save(ped.dd);
        break;
      }
      case CONTAM.Globals.AF_SUP:
      {
        var ps = pe.ped;
        var psl;
        var psch=null;
        var count=0;

        for ( psl=ps.list; psl; psl=psl.next )
        {
          count++;
          if ( psl && psl.Sched )
            psch = psl.pafe;
        }
        if ( psch )
        {
          pst += sprintf("  %d %d %d", count, psch.nr, ps.u_Ht) + prj.EOL;
        }
        else
        {
          pst += sprintf("  %d %d %d", count, 0, ps.u_Ht)  + prj.EOL;
        }
        for ( psl=ps.list; psl; psl=psl.next )
        {
          pst += sprintf("  %d %f %d", psl.pafe.nr, psl.relHt, psl.Filtered) + prj.EOL;
        }
        break;
      }
      default:
        CONTAM.error( 2, "Invalid element type " + pe.dtype.toString());
    }  /* end switch */
  }  /* end for loop */
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nafe;

}  /* end afelmt_save */

CONTAM.Project.dfedat_save = function(pdd)
{
  var pst = "";
  pst += sprintf(" %f %f %f %f %f %f %f %f", 
    pdd.hdia, pdd.perim, pdd.area, pdd.major, pdd.minor,
    pdd.As, pdd.Qr, pdd.Pr) + prj.EOL;
  pst += sprintf(" %d %d %d %d %d %d %d %d", 
    pdd.shape, pdd.u_D, pdd.u_P, pdd.u_A, 
    pdd.u_mj, pdd.u_mn, pdd.u_Qr, pdd.u_Pr) + prj.EOL;
  return pst;
}  /* end dfedat_save */

CONTAM.Project.ctrlse_save = function(lib)
{
  var pe;  /* element data */
  var pid;
  var pld, pe0;
  var nse=0, j, nicon;
  var prj = CONTAM.Project;
  var pst = "";

  if(lib)
    pe0 = prj.SEelmtLib0;
  else
    pe0 = prj.SEelmt0;

  for( pe=pe0.start; pe; pe=pe.next )
    pe.nr = ++nse;
  pst += sprintf("%d ! control super elements:%s", nse, prj.EOL);

  if( nse>0 )
    pst += sprintf("! #   f  in out  nn  ni name%s", prj.EOL);
  for( pe=pe0.start; pe; pe=pe.next )
  {
    /* CTRLSE_DAT data */
    /* nr flags in out nn ni name[] CRLF desc[] */
    pst += sprintf("%3d %3d", pe.nr, pe.flags );
    if( pe.pin )
      j = pe.pin.nr;
    else
      j = 0;
    pst += sprintf(" %3d",j);
    if( pe.pout )
      j = pe.pout.nr;
    else
      j = 0;
    pst += sprintf(" %3d", j);

    nicon=0;
    pld = pe.pld;
    if( pld )
      for( pid=pld.pid; pid; pid=pid.next )    /* count icons */
        nicon++;
    pst += sprintf(" %3d %3d %s%s%s%s", 
      pe.nn, nicon, pe.name, prj.EOL, pe.desc, prj.EOL );

    /* CTRL_DSC Sub-node Data */
    prj.ctrl_save(pe.nn, pe.pnl, 1);

    /* Sketch icon data */
    if( pld )
      for( pid=pld.pid; pid; pid=pid.next )            /* write icons */
        pst += sprintf(" %3d %3d %3d %3d%s", 
          pid.icon, pid.col, pid.row, pid.nr, prj.EOL );
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nse;

} /* End ctrlse_save() */

CONTAM.Project.ctrl_save = function(nctrl, pList, subnodes)
{
  var pc,i;
  var prj = CONTAM.Project;
  var pst = "";
  
  if( subnodes )
    pst += sprintf("%d ! sub-nodes:%s", nctrl, prj.EOL); /* _nctrl set in ctrl_pack() */
  else
    pst += sprintf("%d ! control nodes:%s", nctrl, prj.EOL); /* _nctrl set in ctrl_pack() */
  if( nctrl>0 )
    pst += sprintf("! # typ seq f n  c1  c2 name%s", prj.EOL);   // 2005/2/25
  for( i=1; i<=nctrl; i++ )
  {
    pc = pList[i];
    if( !pc )
      CONTAM.error(3, "Null pointer - control: " + i.toString());
    pc.n1 = pc.n2 = 0;
    if( i != pc.nr )
      CONTAM.error(2, "Controls out of order");
    if( pc.pc1 )
      pc.n1 = pc.pc1.nr;
    if( pc.pc2 )
      pc.n2 = pc.pc2.nr;

    pst += sprintf("%3d %3s %3d %1d %1d %3d %3d %s%s",
      pc.nr, CONTAM.Globals.ctrl_names[pc.type], pc.seqnr, pc.flags,
      pc.inreq, pc.n1, pc.n2, pc.name, prj.EOL);
    pst += sprintf("%s%s", pc.desc, prj.EOL );

    switch (pc.type)
    {
      case CONTAM.Globals.CT_SNS: 
      {
        var spcsname="none"; /* species name */
        var pcd = pc.pcd;
        switch (pcd.type)
        {
          case 1: 
          {
            var pzn = pcd.src;
            if( pzn == prj.ambt )
              pcd.source = -1;
            else if( pcd.source != 0 ) // => Super Element sensor (source == 0)
              pcd.source = pzn.nr;
            break;
          }
          case 2: 
          {
            var pp = pcd.src;
            pcd.source = pp.nr;
            break;
          }
          case 6:
          case 3: 
          {
            var pj = pcd.src;
            pcd.source = pj.nr;
            break;
          }
          case 4: 
          {
            var pd = pcd.src;
            pcd.source = pd.nr;
            break;
          }
          case 5: 
          {
            var px = pcd.src;
            pcd.source = px.nr;
            break;
          }
          default:
            CONTAM.error(2, " Unidentified sensor pointer");
            break;
        }
        if( pcd.measure == 0 )
          spcsname = pcd.spcs.name;
// @@@ CW2.3
        pst += sprintf(" %f %f %f %f %d %d %d %7.3f %7.3f %7.3f %d %s", 
          pcd.offset, pcd.scale, pcd.tau, pcd.oldsig, pcd.source, pcd.type,
          pcd.measure, pcd.X, pcd.Y, pcd.relHt, pcd.u_XYZ, spcsname) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_SCH: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %d%s", pcd.ps.nr, prj.EOL);
        break;
      }
      case CONTAM.Globals.CT_SET: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %f", pcd.value) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_CVF:
      case CONTAM.Globals.CT_DVF: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %s%s", pcd.name, prj.EOL);
        break;
      }
      case CONTAM.Globals.CT_LOG: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %f %f %d %s %s",
          pcd.offset, pcd.scale, pcd.udef, pcd.header, pcd.units) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_MOD: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %f %f", pcd.offset, pcd.scale) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_HYS: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %f %f %f", pcd.slack, pcd.slope, pcd.oldsig) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_DLS: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %d %d", pcd.pdsincr.nr, pcd.pdsdecr.nr) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_DLX: 
      {
        var pcd = pc.pcd;
        var incr = CONTAM.TimeUtilities.IntTimeToStringTime(pcd.tauincr);
        var decr = CONTAM.TimeUtilities.IntTimeToStringTime(pcd.taudecr);
        pst += sprintf(" %s %s%s", incr, decr, prj .EOL );
        break;
      }
      case CONTAM.Globals.CT_RAV: 
      {
        var pcd = pc.pcd;
        var time = CONTAM.TimeUtilities.IntTimeToStringTime(pcd.tspan);
        pst += sprintf(" %s%s", time, prj.EOL);
        break;
      }
      case CONTAM.Globals.CT_LBS:
      case CONTAM.Globals.CT_UBS: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %f", pcd.band) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_PC1: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %f", pcd.kp) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_PI1: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %f %f %f %f", pcd.kp, pcd.ki,
          pcd.oldsig, pcd.olderr) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_SUP: 
      {
        var pcd = pc.pcd;
        pst += sprintf(" %d %d %d %d", pcd.def, pcd.pse.nr, 
          pcd.pin ? pcd.pin.nr : 0, pcd.pout ? pcd.pout.nr : 0) + prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_SUM:
      case CONTAM.Globals.CT_AVG:
      case CONTAM.Globals.CT_MAX:
      case CONTAM.Globals.CT_MIN: 
      {
        var pcd = pc.pcd;
        var n;
        pst += sprintf(" %d ", pcd.npcs );
        for( n=0; n<pcd.npcs; n++ )
          pst += sprintf(" %d", pcd.pc[n].nr );
        pst += prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_PLY:
      {
        var pply = pc.pcd;
        var n;
        pst += sprintf(" %d", pply.n );
        for( n=0; n<=pply.n; ++n )
          pst += sprintf(" %f", pply.a[n]);
        pst += prj.EOL;
        break;
      }
      case CONTAM.Globals.CT_PAS:    /* no data with following types */
      case CONTAM.Globals.CT_BIN:
      case CONTAM.Globals.CT_ABS:
      case CONTAM.Globals.CT_INT:
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

      case CONTAM.Globals.CT_POW:
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
        pst += prj.EOL;  /* no data */
        break;
      default:
        CONTAM.error( 2, "Invalid element type " + pc.type.toString());
        break;
    }  /* end control type switch */
  }
  if( !subnodes )
    pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

}  /* end ctrl_save */

CONTAM.Project.system_save = function()
{
  var pa;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! simple AHS:%s", prj.nahs, prj.EOL);
  if( prj.nahs )
    pst += sprintf("! # zr# zs# pr# ps# px# name%s", prj.EOL);

  for( pa=prj.Ahs0.start; pa; pa=pa.next )
  {
    if( pa.zone_r<1 || pa.zone_r>prj.nzone) 
      error( 2, "Invalid zone number, AHS " + pa.nr.toString());
    if( pa.zone_s<1 || pa.zone_s>prj.nzone) 
      error( 2, "Invalid zone number, AHS " + pa.nr.toString());
    if( pa.path_r<1 || pa.path_r>prj.npath) 
      error( 2, "Invalid path number, AHS " + pa.nr.toString());
    if( pa.path_s<1 || pa.path_s>prj.npath) 
      error( 2, "Invalid path number, AHS " + pa.nr.toString());
    if( pa.path_x<1 || pa.path_x>prj.npath  ) 
      error( 2, "Invalid path number, AHS " + pa.nr.toString());
    pst += sprintf("%3d %3d %3d %3d %3d %3d %s",
             pa.nr, pa.zone_r, pa.zone_s, pa.path_r,
             pa.path_s, pa.path_x, pa.name) + prj.EOL;
    pst += sprintf("%s%s", pa.desc, prj.EOL);
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

}  /* end system_save */

CONTAM.Project.zone_save = function()    /*** _nzone set in zone_pack() ***/
{
  var pzn;
  var i, j, jc, js, jk, jl;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! zones:%s", prj.nzone, prj.EOL);
  if( prj.nzone > 0 )
    pst += sprintf("! Z#  f  s#  c#  k#  l#  relHt    Vol  T0  P0  name  clr u[4]  axs cdvf <cdvf name> cfd <cfd name> <1D data:>%s", prj.EOL);

  for( i=1; i<=prj.nzone; i++ )
  {
    pzn = prj.ZoneList[i];
    if( !pzn ) 
      CONTAM.error(3, "Null pointer - zone: " + i.toString());
    if( pzn.nr != i ) 
      CONTAM.error(2, "Zone number mis-match: " + i.toString());

    jc = js = jk = jl = 0;
    if( pzn.ps )
    {
      js = pzn.ps.nr;
      if( js<1 || js>prj.nwsch ) 
        CONTAM.error( 2, "Invalid week-schedule number, path " + i.toString());
    }

    if( pzn.pc )
    {
      jc = pzn.pc.nr;
      if( jc<1 || jc>prj.nctrl ) 
        CONTAM.error(2, "Invalid control node number, path " + i.toString());
    }

    if( pzn.pk )
    {
      jk = pzn.pk.nr;
      if( jk<1 || jk>prj.nkinr ) 
        CONTAM.error( 2, "Invalid reaction number, path " + i.toString());
    }

    if( pzn.pld )
      jl = pzn.pld.nr;
    if( jl<1 || jl>prj.nlev ) 
      CONTAM.error( 2, "Invalid level number, path " + i.toString());
    //TODO: this sprintf chokes on %5f for large zone volumes, it should be changed to something larger
    pst += sprintf("%4d %2d %3d %3d %3d %3d %7.3f %f %6f %f %s %d %d %d %d %d %d",
      pzn.nr, pzn.flags, js, jc, jk, jl, pzn.relHt, pzn.Vol, pzn.T0, 
      pzn.P0, pzn.name, pzn.color, pzn.u_Ht, pzn.u_T, pzn.u_P, pzn.u_V, pzn.cdaxis);

    pst += sprintf(" %d", pzn.vf_type);  // CW 3.2, cvf/dvf w/o control network
    if( pzn.vf_type > 0 )
      pst += sprintf(" %s", pzn.vf_node_name);

    if(pzn.cfd_name !== undefined && pzn.cfd_name.length > 0) // CW 3.0
      pst += sprintf(" 1 %s", pzn.cfd_name);
    else
      pst += " 0";
    if( pzn.cdaxis )
    {
      pst += sprintf(" 1D: %7.3f %7.3f %7.3f %7.3f %7.3f %7.3f %f %f %d %d",
        pzn.X1, pzn.Y1, pzn.H1, pzn.X2, pzn.Y2, pzn.H2, 
        pzn.celldx, pzn.axialD, pzn.u_aD, pzn.u_L);
    }
    pst += prj.EOL;
  }
  pst += prj.UNK.toString() + prj.EOL;

  pst += sprintf("%d ! initial zone concentrations:%s", prj.nzone*prj.nctm, prj.EOL );
  if( prj.nzone > 0 && prj.nctm > 0 )
  {
    pst += "! Z#";
    for( j=0; j<prj.nctm; j++ )
    {
      var buffer;
      buffer = prj.Ctm[j].name;
      if(buffer.length > 10)
        buffer = buffer.subString(0,10);
      pst += sprintf(" %10s", buffer );
    }
    pst += prj.EOL;
    for( i=1; i<=prj.nzone; i++ )
    {
      pzn = prj.ZoneList[i];
      pst += sprintf("%4d", i );
      for( j=0; j<prj.nctm; j++ )
        pst += sprintf(" %10.3e", pzn.CC0[j]);
      pst += prj.EOL;
    }
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

}  /* end zone_save */

CONTAM.Project.path_save = function()
{
  var ppd;
  var i, jn, jm, je, jf, jw, ja, js, jc, jl;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! flow paths:%s", prj.npath, prj.EOL);
  if( prj.npath > 0 )
    pst += sprintf("! P#    f  n#  m#  e#  f#  w#  a#  s#  c#  l#    X       Y      relHt  mult wPset wPmod wazm Fahs Xmax Xmin icn dir u[4] cdvf <cdvf name> cfd <cfd data[4]>%s", prj.EOL);

  for( i=1; i<=prj.npath; i++ )
  {
    ppd = prj.PathList[i];
    if( !ppd ) 
      CONTAM.error( 3, "Null pointer - path: " + i.toString());
    if( ppd.nr != i ) 
      CONTAM.error( 2, "Path number mis-match: " + i.toString());

    jn = jm = je = jf = jw = ja = js = jc = jl = 0;   /* only jl required */
    if( ppd.pzn )
      jn = ppd.pzn.nr;
    if( jn==CONTAM.Globals.AMBT )
      jn = -1;
    else if( ppd.pzn )
      if( jn<1 || jn>prj.nzone ) 
        CONTAM.error( 2, "Invalid zone number, path " + i.toString());

    if( ppd.pzm )
      jm = ppd.pzm.nr;
    if( jm==CONTAM.Globals.AMBT )
      jm = -1;
    else if( ppd.pzm )
      if( jm<1 || jm>prj.nzone ) 
        CONTAM.error( 2, "Invalid zone number, path " + i.toString());

    if( ppd.pe )
    {
      je = ppd.pe.nr;
      if( je<1 || je>prj.nafe ) 
        CONTAM.error( 2, "Invalid flow element number, path " + i.toString());
    }

    if( ppd.pf )
    {
      jf = ppd.pf.nr;
      if( jf<1 || jf>prj.nfilt ) 
        CONTAM.error( 2, "Invalid filter number, path " + i.toString());
    }

    if( ppd.pw )
    {
      jw = ppd.pw.nr;
      if( jw<1 || jw>prj.nwpf ) 
        CONTAM.error( 2, "Invalid wind profile number, path " + i.toString());
    }

    if( ppd.pa )
    {
      ja = ppd.pa.nr;
      if( ja<1 || ja>prj.nahs ) 
        CONTAM.error( 2, "Invalid AHS number, path " + i.toString());
    }

    if( ppd.ps )
    {
      js = ppd.ps.nr;
      if( js<1 || js>prj.nwsch ) 
        CONTAM.error( 2, "Invalid week-schedule number, path " + i.toString());
    }

    if( ppd.pc )
    {
      jc = ppd.pc.nr;
      if( jc<1 || jc>prj.nctrl ) 
        CONTAM.error( 2, "Invalid control node number, path " + i.toString());
    }

    if( ppd.pld )
      jl = ppd.pld.nr;
    if( jl<1 || jl>prj.nlev ) 
      error( 2, "Invalid level number, path " + i.toString());

    pst += sprintf("%4d %4d %3d %3d %3d %3d %3d %3d %3d %3d %3d ",
             ppd.nr, ppd.flags, jn, jm, je, jf, jw, ja, js, jc, jl );
    pst += sprintf("%7.3f %7.3f %7.3f %f %f %f %f %f %f %f ",
             ppd.X, ppd.Y, ppd.relHt, ppd.mult, ppd.wPset, ppd.wPmod, 
             ppd.wazm, ppd.Fahs, ppd.Xmax, ppd.Xmin );
    pst += sprintf("%3d %2d %d %d %d %d",
             ppd.icon, ppd.dir, ppd.u_Ht, ppd.u_XY, ppd.u_dP, ppd.u_F );

    pst += sprintf(" %d", ppd.vf_type);  // CW 3.2, cvf/dvf w/o control network
    if( ppd.vf_type > 0 )
      pst += sprintf(" %s", ppd.vf_node_name );

    if(ppd.cfd_pname !== undefined && ppd.cfd_pname.length > 0 )      // CW 3.0, cfd data
    {
      pst += sprintf(" 1 %s %d %d %d", ppd.cfd_pname, ppd.cfd_ptyp, 
        ppd.cfd_btyp, ppd.cfd_capp);
    }
    else
    {
      pst += sprintf(" 0");
    }
    pst += prj.EOL;
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

}  /* end path_save */

CONTAM.Project.jct_save = function()    /*** _njct set in misc_pack() ***/
{
  var pj;
  var pd;
  var i, j, jn, jw, jd, jf, jk, js, jc, jl;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! duct junctions:%s", prj.njct, prj.EOL);
  if( prj.njct > 0 )
    pst += sprintf("! J#  f t  z#  dct  k#  s#  c#  l#    X       Y     relHt  T0    P0 icon clr u[4] <T: terminal data>%s", prj.EOL);

  for( i=1; i<=prj.njct; i++ )
  {
    pj = prj.JctList[i];
    jn = jw = jd = jf = jk = js = jc = jl = 0;   /* jl required */

    if( pj.pzn )
      jn = pj.pzn.nr;
    if( jn==CONTAM.Globals.AMBT )
      jn = -1;
    else if( pj.pzn )
      if( jn<1 || jn>prj.nzone ) 
        CONTAM.error( 2, "Invalid zone number, junction " + i.toString());

    if( pj.pw )
    {
      jw = pj.pw.nr;
      if( jw<1 || jw>prj.nwpf ) 
        CONTAM.error( 2, "Invalid wind profile number, junction " + i.toString());
    }

    pd = pj.pdd;
    if( pd )
    {
      jd = pd.nr;
      if( jd<1 || jd>prj.ndct ) 
        CONTAM.error( 2, "Invalid duct number, junction " + i.toString());
    }

    if( pj.pf )   // CW2.3
    {
      jf = pj.pf.nr;
      if( jf<1 || jf>prj.nfilt ) 
        CONTAM.error( 2, "Invalid filter number, junction " + i.toString());
    }

    if( pj.pk )
    {
      jk = pj.pk.nr;
      if( jk<1 || jk>prj.nkinr ) 
        CONTAM.error( 2, "Invalid kinetic reaction number, junction " + i.toString());
    }

    if( pj.ps )
    {
      js = pj.ps.nr;
      if( js<1 || js>prj.nwsch ) 
        CONTAM.error( 2, "Invalid week-schedule number, junction " + i.toString());
    }

    if( pj.pc )
    {
      jc = pj.pc.nr;
      if( jc<1 || jc>prj.nctrl ) 
        CONTAM.error( 2, "Invalid control node number, junction " + i.toString());
    }

    if( pj.pld )
      jl = pj.pld.nr;
    if( jl<1 || jl>prj.nlev ) 
      error( 2, "Invalid level number, junction " + i.toString());

    pst += sprintf("%4d %2d %1d %3d %3d %3d %3d %3d %3d",
             pj.nr, pj.flags, pj.jtype, jn, jd, jk, js, jc, jl);
    pst += sprintf(" %7.3f %7.3f %7.3f %f %f",
             pj.X, pj.Y, pj.relHt, pj.T0, pj.P0);
    pst += sprintf(" %d %d %d %d %d %d",  //CW 2.4
             pj.icon, pj.color, pj.u_Ht, pj.u_XY, pj.u_T, pj.u_dP);

    pst += sprintf(" %d", pj.vf_type );        // CW 3.2, cdvf type
    if( pj.vf_type > 0 )
      pst += sprintf(" %s", pj.vf_node_name );

    if( pj.jtype > 0 )
    {
      pst += sprintf(" T: %d %d %f %f %f %d %f %f %f", jf, jw,
        pj.wPset, pj.wPmod, pj.wazm, pj.bal, pj.Ad, pj.Af, pj.Fdes);
      pst += sprintf(" %f %f %f %d %d %d %d",
        pj.Ct, pj.Cb, pj.Cbmax, pj.u_A, pj.u_F, pj.ddir, pj.fdir);

    }
    pst += prj.EOL;
  }
  pst += prj.UNK.toString() + prj.EOL;

  pst += sprintf("%d ! initial junction concentrations:%s", prj.njct*prj.nctm, prj.EOL);
  if( prj.njct > 0 && prj.nctm > 0 )
  {
    pst += sprintf("! J#");
    for( j=0; j<prj.nctm; j++ )
    {
      var buffer;
      buffer = prj.Ctm[j].name;
      if(buffer.length > 10)
        buffer = buffer.subString(0,10);
      pst += sprintf(" %10s", buffer);
    }
    pst += prj.EOL;
    for( i=1; i<=prj.njct; i++ )
    {
      pj = prj.JctList[i];
      pst += sprintf("%4d", i);
      for( j=0; j<prj.nctm; j++ )
        pst += sprintf(" %10.3e", pj.CC0[j]);
      pst += prj.EOL;
    }
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;
}  /* end jct_save */

CONTAM.Project.duct_save = function()    /*** _ndct set in misc_pack() ***/
{
  var pd;
  var i, jn, jm, je, js, jc, jf;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! duct segments:%s", prj.ndct, prj.EOL);
  if( prj.ndct > 0 )
    pst += sprintf("! D#  f  n#  m#  e#  f#  s#  c# dir len Ain Aout sllc clr u[2] cdvf <cdvf name>%s", prj.EOL);

  for( i=1; i<=prj.ndct; i++ )
  {
    pd = prj.DctList[i];
    if( !pd ) 
      CONTAM.error( 3, "Null pointer - duct: " + i.toString());
    if( pd.nr != i ) 
      CONTAM.error( 2, "Duct number mis-match: " + i.toString());

    jn = jm = jf = js = jc = je = 0;   /* je required */
    if( pd.pjn )
    {
      jn = pd.pjn.nr;
      if( jn<1 || jn>prj.njct ) 
        CONTAM.error( 2, "Invalid junction number, duct " + i.toString());
    }

    if( pd.pjm )
    {
      jm = pd.pjm.nr;
      if( jm<1 || jm>prj.njct ) 
        CONTAM.error( 2, "Invalid junction number, duct " + i.toString());
    }

    if( pd.pe )
      je = pd.pe.nr;
    if( je<1 || je>prj.ndfe ) 
      CONTAM.error( 2, "Invalid duct element number, duct " + i.toString());

    if( pd.pf )
    {
      jf = pd.pf.nr;
      if( jf<1 || jf>prj.nfilt ) 
        CONTAM.error( 2, "Invalid filter number, duct " + i.toString());
    }

    if( pd.ps )
    {
      js = pd.ps.nr;
      if( js<1 || js>prj.nwsch ) 
        CONTAM.error( 2, "Invalid week-schedule number, duct " + i.toString());
    }

    if( pd.pc )
    {
      jc = pd.pc.nr;
      if( jc<1 || jc>prj.nctrl ) 
        CONTAM.error( 2, "Invalid control node number, duct " + i.toString());
    }

    pst += sprintf("%4d %2d %3d %3d %3d %3d %3d %3d %3d %f %f %f %f %d %d %d",
             pd.nr, pd.flags, jn, jm, je, jf, js, jc, pd.dir, pd.length,
             pd.Ain, pd.Aout, pd.sllc, pd.color, pd.u_L, pd.u_A );

    pst += sprintf(" %d", pd.vf_type );        // CW 3.2, cdvf type
    if( pd.vf_type > 0 )
      pst += sprintf(" %s", pd.vf_node_name );

    pst += prj.EOL;

  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;
}  /* end duct_save */

CONTAM.Project.css_save = function()
{
  var pss;
  var i, jz, je, js, jc;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! source/sinks:%s", prj.ncss, prj.EOL);
  if( prj.ncss > 0 )
    pst += sprintf("! #  z#  e#  s#  c#  mult   CC0  (X, Y, H)min  (X, Y, H)max u[1] cdvf <cdvf name> cfd <cfd name>%s", prj.EOL);

  for( i=1; i<=prj.ncss; i++ )
  {
    pss = prj.CssList[i];
    js = jc = je = jz = 0;    /* je, jz required */

    if( pss.pz )
      jz = pss.pz.nr;
    else
      jz = 0;

    if( pss.pe )
      je = pss.pe.nr;
    if( je<1 || je>prj.ncse ) 
      CONTAM.error( 2, "Invalid element number, source " + i.toString());

    if( pss.ps )
    {
      js = pss.ps.nr;
      if( js<1 || js>prj.nwsch ) 
        CONTAM.error( 2, "Invalid week-schedule number, source " + i.toString());
    }

    if( pss.pc )
    {
      jc = pss.pc.nr;
      if( jc<0 || jc>prj.nctrl ) 
        CONTAM.error( 2, "Invalid control node number, source " + i.toString());
    }

    pst += sprintf("%3d %3d %3d %3d %3d %f %f  %f %f %f  %f %f %f  %d",
      pss.nr, jz, je, js, jc, pss.mult, pss.CC0, pss.Xmin, pss.Ymin,
      pss.Hmin, pss.Xmax, pss.Ymax, pss.Hmax, pss.u_XYZ );

    pst += sprintf(" %d", pss.vf_type );       // CW 3.2, cdvf type
    if( pss.vf_type > 0 )
      pst += sprintf(" %s", pss.vf_node_name );

    if(pss.cfd_name !== undefined && pss.cfd_name.length>0)
      pst += sprintf(" 1 %s", pss.cfd_name);
    else
      pst += " 0";

    pst += prj.EOL;
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;
}  /* end css_save */

CONTAM.Project.oschd_save = function()
{
  var pos;  /* pointer to occupancy structure */
  var nosch=0, j, k;
  var prj = CONTAM.Project;
  var pst = "";

  for( pos=prj.Osch0.start; pos; pos=pos.next )
    pos.nr = ++nosch;
  pst += sprintf("%d ! occupancy schedules:%s", nosch, prj.EOL);

  for( pos=prj.Osch0.start; pos; pos=pos.next )
  {
    pst += sprintf("%d %d %d %s%s%s%s", pos.nr, pos.npts, 
            pos.u_XYZ, pos.name, prj.EOL, pos.desc, prj.EOL);
    for( j=0; j<pos.npts; j++ )
    {
      if( pos.zone[j] )
      {
        k = pos.zone[j].nr;
        if( k==CONTAM.Globals.AMBT )
          k = -1;
        else            // k == 0 for null zone
          if( k<0 || k>prj.nzone ) 
            CONTAM.error( 2, "Invalid zone number, schedule " + pos.nr.toString());
      }
      else
        k = 0;
// @@@ CW2.3
      var time = CONTAM.TimeUtilities.IntTimeToStringTime(pos.time[j]);
      pst += sprintf(" %s %d %7.3f %7.3f %7.3f%s",
        time, k, pos.X[j], pos.Y[j], pos.relHt[j], prj.EOL );
    }
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

  return nosch;

}  /* end oschd_save */

CONTAM.Project.pexp_save = function()
{
  var pocg;
  var px;
  var i, j, k, ncg;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! exposures:%s", prj.npexp, prj.EOL);

  for( i=1; i<=prj.npexp; i++ )
  {
    px = prj.PexpList[i];
    if( !px ) 
      CONTAM.error( 3, "Null pointer - exposure: " + i.toString());
    if( px.nr != i ) 
      CONTAM.error( 2, "Exposure number mis-match: " + i.toString());

    for( ncg=0,pocg=px.pogd; pocg; pocg=pocg.next )
      ncg += 1;
    pst += sprintf("%d %d %d %f %s%s%s",
      px.nr, px.gen, ncg, px.cgmlt, prj.EOL, px.desc, prj.EOL);

    for( k=0; k<12; k++ )
    {
      if( px.odsch[k] )
        j = px.odsch[k].nr;
      else
        j = 0;
      pst += sprintf(" %d", j);
    }
    pst += sprintf(" ! occ. schd%s", prj.EOL);

    for( pocg=px.pogd; pocg; pocg=pocg.next )
    {
      if( pocg.ps )
        j = pocg.ps.nr;
      else
        j = 0;
      pst += sprintf(" %s %d %f %d",
        pocg.spcs.name, j, pocg.cgmax, pocg.u_G);
      pst += sprintf(" %d", pocg.vf_type);  // CW 3.2, cvf/dvf w/o control network
      if( pocg.vf_type > 0 )
        pst += sprintf(" %s", pocg.vf_node_name );
      pst += sprintf(" ! occ. gen%s", prj.EOL);
    }
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

}  /* end pexp_save */

CONTAM.Project.note_save = function()
{
  var pn;
  var j;
  var prj = CONTAM.Project;
  var pst = "";

  pst += sprintf("%d ! annotations:%s", prj.nnote, prj.EOL);

  for( j=1; j<=prj.nnote; j++ )
  {
    pn = prj.NoteList[j];
    if( !pn ) 
      CONTAM.error( 3, "Null pointer - note: " + j.toString());
    if( pn.nr != j ) 
      CONTAM.error( 2, "Note number mis-match: " + j.toString());
    pst += sprintf("%d %s%s", pn.nr, pn.note, prj.EOL);
  }
  pst += prj.UNK.toString() + prj.EOL;
  prj.pst += pst;

}  /* end note_save */
  