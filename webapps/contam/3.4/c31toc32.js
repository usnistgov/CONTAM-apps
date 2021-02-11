CONTAM.Project.Upgraders.C31toC32 = {};
CONTAM.Project.Upgraders.C31toC32.c32File = ""; //new project file contents

/***  run_data32.c  ************************************************************/

/*  Read run control / weather / miscelaneous data.  */

CONTAM.Project.Upgraders.C31toC32.run_data32 = function()
{
  var u = CONTAM.Project.Upgraders;
  var prj = CONTAM.Project;
  var fc = "";

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

  fc += "!bcx dcx pfq zfq zcq" + prj.EOL; // CW 3.2
  fc += sprintf("%3d %3d %3d %3d %3d", 0, 0, 0, 0, 0) + prj.EOL;

  //fprintf( uprj, "! 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 <- extra[]\n" );
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "%d ! rvals:\n", _rcdat.nrvals ); // CW 2.4b
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!valZ valD valC\n" ); // CW 2.4
  fc += u.same_line();
  fc += u.same_line();

  //fprintf( uprj, "!cfd  cfdcnvg   var zref  maxi dtcmo\n"); // CW 3.0
  fc += u.same_line();
  fc += u.same_line();

  if( CONTAM.Reader.readIX(1) != CONTAM.Project.UNK )
    CONTAM.error( 2, "PRJ read error in run control section");
  fc += CONTAM.Project.UNK + CONTAM.Project.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
  return 0;
}  /* end run_data32 */

/***  spcs_data32.c  *********************************************************/

/*  Add uvgi parameter Kuv
 *  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C31toC32.spcs_data32 = function()
{
  var nspcs, i;
  var nctm, nr;
  var sflag, ntflag, ucc, umd, ued, udm, ucp;
  var molwt, mdiam, edens, decay, Dm, ccdef, Cp; 
  var name; /* species name */
  var desc; /* species description */
  var Kuv = 0.0;     /* UVGI susceptability constant [m2/J] */
  var rdr = CONTAM.Reader;
  var fc = "";
  var prj = CONTAM.Project;

  nctm = rdr.readIX(1);
  fc += sprintf("%d ! contaminants:", nctm ) + prj.EOL;
  if(nctm)
  {
    fc += "  " ;
    for( i=0; i<nctm; i++ )
    {
      fc += sprintf(" %d", rdr.readIX(0));   /* order from ctm_set */
    }
    fc += prj.EOL;
  }

  nspcs = rdr.readIX(1);
  fc += sprintf("%d ! species:", nspcs ) + prj.EOL;
  if(nspcs > 0)
    fc += sprintf("! # s t   molwt    mdiam       edens       decay       Dm          CCdef        Cp    u[5]  name") + prj.EOL;

  for(i=1; i<=nspcs; i++)
  {
    nr = rdr.readIX(1);
    sflag = rdr.readI2(0);
    ntflag = rdr.readI2(0);
    molwt = rdr.readR4(0);
    mdiam = rdr.readR4(0);
    edens = rdr.readR4(0);
    decay = rdr.readR4(0);
    Dm = rdr.readR4(0);
    ccdef = rdr.readR4(0);
    Cp = rdr.readR4(0);
    ucc = rdr.readI2(0);
    umd = rdr.readI2(0);
    ued = rdr.readI2(0);
    udm = rdr.readI2(0);
    ucp = rdr.readI2(0);
    name = rdr.nextword(0);
    desc = rdr.nextword(3);

    fc += sprintf("%3d %d %d %8.4f %11.4e %11.4e %11.4e %11.4e %11.4e %8.3f %8.3f %d %d %d %d %d %s",
      nr, sflag, ntflag, molwt, mdiam, edens, decay, Dm, ccdef, Cp, Kuv,
      ucc, umd, ued, udm, ucp, name) + prj.EOL;
    fc += sprintf("%s", desc) + prj.EOL;
  }

  if(rdr.readI2(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error in Species section" );
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
  return nspcs;
} // end spcs_data32

/***  zone_data32()  *********************************************************/

/* Add cvf/dvf information to allow cvf & dvf w/o control network */

CONTAM.Project.Upgraders.C31toC32.zone_data32 = function()
{
  var nzone, i, nr, ws, pc, kr, pld;
  var flags;
  var relHt, Vol, T0, P0;
  var name; /* zone name */
  var color, u_Ht, u_T, u_P, u_V, cdaxis;
  var cfd_name;  /* CFD zone ID */
  var X1=0, Y1=0, H1=0, X2=0, Y2=0, H2=0, celldx=0, axialD=0;
  var u_aD=0, u_L=0;
  var rdr = CONTAM.Reader;
  var fc = "";
  var prj = CONTAM.Project;

  name = "";
  cfd_name = "";
  nzone = rdr.readIX(1);
  fc += sprintf("%d ! zones:", nzone) + prj.EOL;
  if(nzone > 0)
  {
    fc += "! Z#  f  s# c#  k#  l#  relHt    Vol  T0  P0  name  clr u[4]  axs cdvf <cdvf name> cfd <cfd name> <1D data:>" + prj.EOL;
  }

  for(i=1; i<=nzone; i++)
  {
    nr = rdr.readIX(1);
    if(nr != i) 
      CONTAM.error( 2, "Zone number mis-match: " + i.toString());

    flags = rdr.readIX(0);
    ws = rdr.readIX(0);
    pc = rdr.readIX(0);
    kr = rdr.readIX(0);
    pld = rdr.readIX(0);
    relHt = rdr.readR4(0);
    Vol = rdr.readR4(0);
    T0 = rdr.readR4(0);
    P0 = rdr.readR4(0);
    name = rdr.nextword(0);
    color = rdr.readIX(0);
    u_Ht = rdr.readIX(0);
    u_T = rdr.readIX(0);
    u_P = rdr.readIX(0);
    u_V = rdr.readIX(0);
    cdaxis = rdr.readIX(0);   // CW 2.3
    if(rdr.readIX(0) == 1) // CW 3.0
    {
      cfd_name = rdr.nextword(0);
    }
    if(cdaxis)  // 2006/06/23 // CW 2.3
    {
      var buffer;
      buffer = rdr.nextword(0);  // "1D:"
      X1 = rdr.readR4(0);
      Y1 = rdr.readR4(0);
      H1 = rdr.readR4(0);
      X2 = rdr.readR4(0);
      Y2 = rdr.readR4(0);
      H2 = rdr.readR4(0);
      celldx = rdr.readR4(0);
      axialD = rdr.readR4(0);
      u_aD = rdr.readIX(0);
      u_L = rdr.readIX(0);
    }
    fc += sprintf("%4d %2d %3d %3d %3d %3d %7.3f %f %f %f %s %d %d %d %d %d %d",
      nr, flags, ws, pc, kr, pld, relHt, Vol, T0, P0, name, color, u_Ht, u_T, u_P, u_V, cdaxis);
    fc += " 0";      // vf_type = 0 // 3.2
    if(cfd_name.length > 0)  // CW 3.0
    {
      fc += sprintf(" 1 %s", cfd_name);
    }
    else
    {
      fc += " 0";
    }
    if(cdaxis)
    {
      fc += sprintf(" 1D: %7.3f %7.3f %7.3f %7.3f %7.3f %7.3f %f %f %d %d",
        X1, Y1, H1, X2, Y2, H2, celldx, axialD, u_aD, u_L);
    }
    fc += prj.EOL;;
  }

  if( rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in zone section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;

}  /* end zone_data32() */

/***  path_data32()  *********************************************************/

/* Add cvf/dvf information to allow cvf & dvf w/o control network */

CONTAM.Project.Upgraders.C31toC32.path_data32 = function()
{
  var flags;
  var icon, dir;
  var npath, i, nr, pzn, pzm, pe, pf, pw, pa, ps, pc, pld;
  var X, Y, relHt, mult, wPset, wPmod, wazm, Fahs, Xmax, Xmin;
  var u_Ht, u_XY, u_dP, u_F;
  var cfd_pname;  /* CFD zone ID */
  var cfd_ptyp=0, cfd_btyp=0, cfd_capp=0;
  var rdr = CONTAM.Reader;
  var fc = "";
  var prj = CONTAM.Project;

  cfd_pname = "";
  npath = rdr.readIX(1);    /* read path data */
  fc += sprintf("%d ! flow paths:", npath) + prj.EOL;
  if(npath > 0)
    fc += sprintf("! P#    f  n#  m#  e#  f#  w#  a#  s#  c#  l#    X       Y      relHt  mult wPset wPmod wazm Fahs Xmax Xmin icn dir u[4] cdvf <cdvf name> cfd <cfd data[4]>") + prj.EOL;

  for(i=1; i<=npath; i++)
  {
    nr = rdr.readIX(1);
    if(nr != i) 
      CONTAM.error(2, "Path number mis-match: " + i);
    flags = rdr.readIX(0);
    pzn = rdr.readIX(0);
    pzm = rdr.readIX(0);
    pe = rdr.readIX(0);
    pf = rdr.readIX(0);
    pw = rdr.readIX(0);
    pa = rdr.readIX(0);
    ps = rdr.readIX(0);
    pc = rdr.readIX(0);
    pld = rdr.readIX(0);
    X = rdr.readR4(0);
    Y = rdr.readR4(0);
    relHt = rdr.readR4(0);
    mult = rdr.readR4(0);
    wPset = rdr.readR4(0);
    wPmod = rdr.readR4(0);
    wazm = rdr.readR4(0);
    Fahs = rdr.readR4(0);
    Xmax = rdr.readR4(0);
    Xmin = rdr.readR4(0);
    icon = rdr.readIX(0);
    dir = rdr.readIX(0);
    u_Ht = rdr.readIX(0);
    u_XY = rdr.readIX(0);
    u_dP = rdr.readIX(0);
    u_F = rdr.readIX(0);
    if(rdr.readIX(0) == 1) // CW 3.0
    {
      cfd_pname = rdr.nextword(0);
      cfd_ptyp = rdr.readIX(0);
      cfd_btyp = rdr.readIX(0);
      cfd_capp = rdr.readIX(0);
    }

    fc += sprintf("%4d %4d %3d %3d %3d %3d %3d %3d %3d %3d %3d ",
      nr, flags, pzn, pzm, pe, pf, pw, pa, ps, pc, pld);
    fc += sprintf("%7.3f %7.3f %7.3f %f %f %f %f %f %f %f ",
      X, Y, relHt, mult, wPset, wPmod, wazm, Fahs, Xmax, Xmin);
    fc += sprintf("%3d %2d %d %d %d %d", icon, dir, u_Ht, u_XY, u_dP, u_F);
    fc += " 0";      // CW 3.2, vf_type = 0
    if(cfd_pname.length > 0) // CW 3.0
    {
      fc += sprintf(" 1 %s %d %d %d", cfd_pname, cfd_ptyp, cfd_btyp, cfd_capp);
    }
    else
    {
      fc += " 0";
    }
    fc += prj.EOL;
  }
  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error in path section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
}  /* end path_data32() */

/***  css_data32()  *********************************************************/

/* Add cvf/dvf information to allow cvf & dvf w/o control network */

CONTAM.Project.Upgraders.C31toC32.css_data32 = function()
{
  var ncss, i, nr, pz, pe, ps, pc;
  var mult, CC0, Xmin, Ymin, Hmin, Xmax, Ymax, Hmax;
  var u_XYZ;
  var cfd_name;  /* CFD zone ID */
  var rdr = CONTAM.Reader;
  var fc = "";
  var prj = CONTAM.Project;

  cfd_name = "";
  ncss = rdr.readIX(1);     /* read number of items */
  fc += sprintf("%d ! source/sinks:", ncss) + prj.EOL;
  if(ncss > 0)
    fc += sprintf("! #  z#  e#  s#  c#  mult   CC0  (X, Y, H)min  (X, Y, H)max u[1] cdvf <cdvf name> cfd <cfd name>") + prj.EOL;

  for(i=1; i<=ncss; i++)
  {
    nr = rdr.readIX(1);
    if(nr != i) 
      CONTAM.error( 2, "S/S number mis-match" + i);

    pz = rdr.readIX(0);
    pe = rdr.readIX(0);
    ps = rdr.readIX(0);
    pc = rdr.readIX(0);
    mult = rdr.readR4(0);
    CC0 = rdr.readR4(0);
    Xmin = rdr.readR4(0);  // CW 2.3
    Ymin = rdr.readR4(0);
    Hmin = rdr.readR4(0);
    Xmax = rdr.readR4(0);
    Ymax = rdr.readR4(0);
    Hmax = rdr.readR4(0);
    u_XYZ = rdr.readIX(0);
    if(rdr.readIX(0)) // cfd name exists
      cfd_name = rdr.nextword(0);

    fc += sprintf("%3d %3d %3d %3d %3d %f %f  %f %f %f  %f %f %f  %d",
      nr, pz, pe, ps, pc, mult, CC0, Xmin, Ymin, Hmin, Xmax, Ymax, Hmax, u_XYZ);
    fc += " 0";    // CW 3.2, vf_type type = 0
    if(cfd_name.length > 0)
      fc += sprintf(" 1 %s", cfd_name);
    else
      fc += " 0";
    fc += prj.EOL;
  }

  if(rdr.readI2(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in source/sink section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
}  /* end css_data32() */

/***  jct_data32()  *********************************************************/

/* Add cvf/dvf information to allow cvf & dvf w/o control network */

CONTAM.Project.Upgraders.C31toC32.jct_data32 = function()
{
  var flags, icon;
  var njct, i, nr, pzn, dnr, pk, ps, pc, pld;
  var jtype, color, u_Ht, u_XY, u_T, u_dP;
  var X, Y, relHt, T0, P0;
  var pf=0, pw=0;
  var wPset=0, wPmod=0, wazm=0, Ad=0, Af=0, Fdes=0, Ct=0, Cb=0, Cbmax=0;
  var bal=0, u_A=0, u_F=0;
  var ddir=0, fdir=0;
  var rdr = CONTAM.Reader;
  var fc = "";
  var prj = CONTAM.Project;

  njct = rdr.readIX(1);    /* read junction data */
  fc += sprintf("%d ! duct junctions:", njct) + prj.EOL;
  if(njct > 0)
    fc += sprintf("! J#  f t  z#  dct  k#  s#  c#  l#    X       Y     relHt  T0    P0 icon clr u[4] <T: terminal data>") + prj.EOL;

  for(i=1; i<=njct; i++)
  {
    nr = rdr.readIX(1);
    if(nr != i) 
      CONTAM.error(2, "Junction number mis-match: " + i);
    flags = rdr.readIX(0);
    jtype = rdr.readIX(0);
    pzn = rdr.readIX(0);
    dnr = rdr.readIX(0);
    pk = rdr.readIX(0);
    ps = rdr.readIX(0);
    pc = rdr.readIX(0);
    pld = rdr.readIX(0);
    X = rdr.readR4(0);
    Y = rdr.readR4(0);
    relHt = rdr.readR4(0);
    T0 = rdr.readR4(0);
    P0 = rdr.readR4(0);
    icon = rdr.readIX(0);
    color = rdr.readIX(0);
    u_Ht = rdr.readIX(0);
    u_XY = rdr.readIX(0);
    u_T = rdr.readIX(0);
    u_dP = rdr.readIX(0);
    if(jtype > 0) // CW 2.3 terminal
    {
      var buffer;
      buffer = rdr.nextword(0);  // "T:"
      pf = rdr.readIX(0);
      pw = rdr.readIX(0);
      wPset = rdr.readR4(0);
      wPmod = rdr.readR4(0);
      wazm = rdr.readR4(0);
      bal = rdr.readIX(0);
      Ad = rdr.readR4(0);
      Af = rdr.readR4(0);
      Fdes = rdr.readR4(0);
      Ct = rdr.readR4(0);
      Cb = rdr.readR4(0);
      Cbmax = rdr.readR4(0);
      u_A = rdr.readIX(0);
      u_F = rdr.readIX(0);
      ddir = rdr.readIX(0);
      fdir = rdr.readIX(0);
    }
    fc += sprintf("%4d %2d %1d %3d %3d %3d %3d %3d %3d",
      nr, flags, jtype, pzn, dnr, pk, ps, pc, pld);
    fc += sprintf(" %7.3f %7.3f %7.3f %f %f", X, Y, relHt, T0, P0);
    fc += sprintf(" %d %d %d %d %d %d",  //CW 2.4
      icon, color, u_Ht, u_XY, u_T, u_dP);
    fc += " 0"; // CW 3.2, vf_type = 0 
    if(jtype > 0)
    {
      fc += sprintf(" T: %d %d %f %f %f %d %f %f %f", pf, pw,
        wPset, wPmod, wazm, bal, Ad, Af, Fdes);
      fc += sprintf(" %f %f %f %d %d %d %d",
        Ct, Cb, Cbmax, u_A, u_F, ddir, fdir);

    }
    fc += prj.EOL;
  }

  if( rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in junction section" );
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
}  /* end jct_data32() */

/***  duct_data32()  *********************************************************/

/* Add cvf/dvf information to allow cvf & dvf w/o control network */

CONTAM.Project.Upgraders.C31toC32.duct_data32 = function()
{
  var flags, dir;
  var ndct, i, nr, pjn, pjm, pe, pf, ps, pc;
  var length, Ain, Aout, sllc;
  var color, u_L, u_A;
  var rdr = CONTAM.Reader;
  var fc = "";
  var prj = CONTAM.Project;

  ndct = rdr.readIX(1);    /* read duct data */
  fc += sprintf("%d ! duct segments:", ndct) + prj.EOL;
  if(ndct > 0)
    fc += sprintf("! D#  f  n#  m#  e#  f#  s#  c# dir len Ain Aout sllc clr u[2] cdvf <cdvf name>") + prj.EOL;

  for(i=1; i<=ndct; i++)
  {
    nr = rdr.readIX(1);
    if(nr != i) 
      CONTAM.error(2, "Duct number mis-match: " + i);
    flags = rdr.readIX(0);
    pjn = rdr.readIX(0);
    pjm = rdr.readIX(0);
    pe = rdr.readIX(0);
    pf = rdr.readIX(0);
    ps = rdr.readIX(0);
    pc = rdr.readIX(0);
    dir = rdr.readIX(0);
    length = rdr.readR4(0);
    Ain = rdr.readR4(0);
    Aout = rdr.readR4(0);
    sllc = rdr.readR4(0);
    color = rdr.readIX(0);
    u_L = rdr.readIX(0);
    u_A = rdr.readIX(0);
    fc += sprintf("%4d %2d %3d %3d %3d %3d %3d %3d %3d %f %f %f %f %d %d %d",
      nr, flags, pjn, pjm, pe, pf, ps, pc, dir, length,
      Ain, Aout, sllc, color, u_L, u_A);
    fc += " 0" + prj.EOL;  // CW 3.2, cdvf type
  }

  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error in duct section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
}  /* end duct_data32() */

/***  C31toC32.c  ************************************************************/

/*  PRJ file format conversion function: ContamW 3.1 to ContamW 3.2
*  Return 0 for successful conversion; 1 for failure.  */
// be sure to init the reader before calling

CONTAM.Project.Upgraders.C31toC32.upgrade = function()
{
  var rdr = CONTAM.Reader;
  var fc = "";
  var prj = CONTAM.Project;
  var c32 = CONTAM.Project.Upgraders.C31toC32;
  var u = CONTAM.Project.Upgraders;
  
  console.log("Upgrade 3.1 prj file to 3.2");
  var prog = rdr.nextword(0);   // read first word of first line.
  if(prog != "ContamW")
  {
    CONTAM.error( 2, "Not a ContamW file");
    return 1;
  }
  var ver = rdr.nextword(0);   // check version & revision.
  var revision = ver[3];
  ver = ver.substring(0,3);

  var echo = rdr. readI2( 0 );    /* echo remainder of PRJ file */
  fc = "ContamW 3.2 " + echo + prj.EOL;
  var desc = rdr.nextword(3);   // read description
  fc += desc + prj.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File = fc;

  c32.run_data32();    // run data
  c32.spcs_data32();  // species data - add UVGI susceptibility parameter, Kuv
  fc = u.same_data();    // level data
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
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
  c32.zone_data32();    // zone data - add cvf/dvf
  fc = u.same_data();    // zone contaminants
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
  c32.path_data32();    // path data - add cvf/dvf
  c32.jct_data32();    // junction data - add cvf/dvf
  fc = u.same_data();    // junction contaminants
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
  c32.duct_data32();    // segment data - add cvf/dvf
  c32.css_data32();    // ctm s/s data - add cvf/dvf
  fc = u.same_data();    // occupancy data
  fc += u.same_data();    // exposure data
  fc += u.same_data();    // annotation data

  buffer = rdr.nextword(2); // skip remainder last line
  fc += "* end project file." + prj.EOL;
  CONTAM.Project.Upgraders.C31toC32.c32File += fc;
  return 0;
}  // End C31toC32().
