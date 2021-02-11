CONTAM.Project.Upgraders.C33toC34 = {};
CONTAM.Project.Upgraders.C33toC34.c34File = ""; //new project file contents

/***  run_data34.c  ************************************************************/

/*  Read run control / weather / miscelaneous data.  */

CONTAM.Project.Upgraders.C33toC34.run_data34 = function()
{
  var u = CONTAM.Project.Upgraders;
  var fc = ""
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  
  //fprintf( uprj, "! rows cols ud uf    T   uT     N     wH  u  Ao    a\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!  scale     us  orgRow  orgCol  invYaxis showGeom\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "! Ta       Pb      Ws    Wd    rh  day u..\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "%7.3f %8.1f %6.3f %5.1f %5.3f %d %d %d %d %d ! wind pressure test\n",
  fc += u.same_line();

  //fprintf( uprj, "%s ! weather file\n", _WTHfile );
  fc += u.same_line();

  //fprintf( uprj, "%s ! contaminant file\n", _CTMfile );
  fc += u.same_line();

  //fprintf( uprj, "%s ! continuous values file\n", _CVFfile );
  fc += u.same_line();

  //fprintf( uprj, "%s ! discrete values file\n", _DVFfile );
  fc += u.same_line();

  //fprintf( uprj, "%s ! WPC file\n", _PLDdat.WPCfile );
  fc += u.same_line();

  //fprintf( uprj, "%s ! EWC file\n", _PLDdat.EWCfile );
  fc += u.same_line();

  //fprintf( uprj, "%s\n", _PLDdat.WPCdesc );
  fc += u.same_line();

  //fprintf( uprj, "!  Xref    Yref    Zref   angle u\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "! epsP epsS  tShift  dStart dEnd wp mf wpctrig\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "! latd  longtd   tznr  altd  Tgrnd u..\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!sim_af afcalc afmaxi afrcnvg afacnvg afrelax uac Pbldg uPb\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!   slae rs aflmaxi aflcnvg aflinit Tadj\n" );  // CW 2.2
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!sim_mf slae rs maxi   relcnvg   abscnvg relax gamma ucc\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "      %5d %3d %4d %9.2e %9.2e %5.3f %5.3f %3d ! (non-trace)\n",
  fc += u.same_line();

  //fprintf( uprj, "      %5d %3d %4d %9.2e %9.2e %5.3f %5.3f %3d ! (trace)\n",
  fc += u.same_line();

  //fprintf( uprj, "      %5d %3d %4d %9.2e %9.2e %5.3f       %3d ! (cvode)\n",
  fc += u.same_line();

  //fprintf( uprj, "!mf_solver sim_1dz sim_1dd   celldx  sim_vjt udx\n" ); // CW 2.2, 3.1
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!cvode    rcnvg     acnvg    dtmax\n" ); // CW 3.1
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!tsdens relax tsmaxi cnvgSS densZP stackD dodMdt\n" ); // CW 2.2, 3.1
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!date_st time_st  date_0 time_0   date_1 time_1    t_step   t_list   t_scrn\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!restart  date  time\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!list doDlg pfsave zfsave zcsave\n" ); // CW 2.2
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!vol ach -bw cbw exp -bw age -bw\n" ); // CW 2.1a
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!rzf rzm rz1 csm srf log\n" ); // CW 3.1
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!bcx dcx pfq zfq zcq\n" ); // CW 3.2
  fc += u.same_line();
  fc += u.same_line();

  fc += sprintf( "!dens   grav" ) + prj.EOL;                    // CW 3.4
  fc += sprintf( " %6.4f %6.4f", 1.2041, 9.8055 ) + prj.EOL;  // CW 3.4

  //fc += sprintf( uprj, "! 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 <- extra[]\n" );
  fc += u.same_line();
  fc += u.same_line();

  nrvals = rdr.readIX( 1 );
  if( nrvals > 1 )
  {
    var j;
    for( j = 0; j < nrvals; j++ )
      rdr.readR4( 0 );
    nrvals = 0;
  }
  doBldgFlowZ = rdr.readI2( 1 );
  doBldgFlowD = rdr.readI2( 0 );
  doBldgFlowC = rdr.readI2( 0 );

  fc += sprintf( "%d ! rvals:", nrvals ) + prj.EOL; // CW 3.4
  fc += sprintf( "!valZ valD valC" ) + prj.EOL;
  fc += sprintf( "%4d %4d %4d",
    doBldgFlowZ, doBldgFlowD, doBldgFlowC ) + prj.EOL;

  cfd_ctype = rdr.readI2( 1 );
  cfd_convcpl = rdr.readR4( 0 );
  cfd_var = rdr.readI2( 0 );
  rdr.readI2( 0 ); // reference zone
  cfd_imax = rdr.readI2( 0 );
  cfd_dtcmo = rdr.readI2( 0 );

  fc += sprintf( "!cfd   cfdcnvg  var zref maxi dtcmo solv smooth   cnvgUVW     cnvgT" ) + prj.EOL; // CW 3.0, CW 3.4
  fc += sprintf( "%4d %9.2e %4d  %3d %4d  %4d %4d   %4d %9.2e %9.2e",
    cfd_ctype, cfd_convcpl, cfd_var, 0, cfd_imax, cfd_dtcmo,
    1, 1, 0.001, 0.001 ) + prj.EOL;

  fc += prj.UNK + prj.EOL;
  if( rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in run data section");
  u.C33toC34.c34File += fc;

}  /* end run_data34 */

/***  C33toC34.c  ************************************************************/

/*  PRJ file format conversion function: ContamW 3.3 to ContamW 3.4
*  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C33toC34.upgrade = function()
{
  var rdr = CONTAM.Reader;
  var fc = "";
  var c34 = CONTAM.Project.Upgraders.C33toC34;
  var u = CONTAM.Project.Upgraders;
  var prj = CONTAM.Project;
  
  console.log("Upgrade 3.3 prj file to 3.4");
  
  var prog = rdr.nextword(0);   // read first word of first line.
  if(prog != "ContamW")
  {
    CONTAM.error( 2, "Not a ContamW file");
    return 1;
  }
  var ver = rdr.nextword(0);   // check version & revision.
  var revision = ver[3];
  ver = ver.substring(0,3);

  var echo = rdr.readIX( 0 );    /* echo remainder of PRJ file */
  fc = "ContamW 3.4.0.0 " + echo + prj.EOL;

  var desc = rdr.nextword(3);   // read description
  fc += desc + prj.EOL;
  u.C33toC34.c34File = fc;
  
  c34.run_data34();   // run data
  fc = u.same_data();    // species data
  fc += u.same_data();    // level data
  fc += u.same_data();    // day schd data
  fc += u.same_data();    // week schd data
  fc += u.same_data();    // wind data
  fc += u.same_data();    // kinetic data
  fc += u.same_data();    // filter element data
  fc += u.same_data();    // filter data
  fc += u.same_data();    // css elmt data
  fc += u.same_data();    // air flow elmt data
  fc += u.same_data();    // duct flow elmt data
  fc += u.same_data();    // super element data
  fc += u.same_data();    // control data
  fc += u.same_data();    // simple AHS data
  fc += u.same_data();    // zone data
  fc += u.same_data();    // zone contaminants
  fc += u.same_data();    // path data - add color
  fc += u.same_data();    // junction data
  fc += u.same_data();    // junction contaminants
  fc += u.same_data();    // segment data
  fc += u.same_data();    // ctm s/s data - add color
  fc += u.same_data();    // occupancy data
  fc += u.same_data();    // exposure data - add color
  fc += u.same_data();    // annotation data - add color

  buffer = rdr.nextword(2); // skip remainder last line

  fc += sprintf( "* end project file." ) + prj.EOL;
  u.C33toC34.c34File += fc;

}  // End fcn C33toC34().

