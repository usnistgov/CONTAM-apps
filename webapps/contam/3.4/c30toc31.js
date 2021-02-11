/*subfile:  C30toC31.c  ******************************************************/

/*  Convert ContamW 3.0 PRJ file to a ContamW 3.1 file.  */

CONTAM.Project.Upgraders.C30toC31 = {};

CONTAM.Project.Upgraders.C30toC31.revision = "";   /* revision I.D.  */
CONTAM.Project.Upgraders.C30toC31.fg_WPC_Trigger = 0;
CONTAM.Project.Upgraders.C30toC31.fg_cnvgSS = 0;
CONTAM.Project.Upgraders.C30toC31.fg_densZP = 0;
CONTAM.Project.Upgraders.C30toC31.fg_stackD = 0;
CONTAM.Project.Upgraders.C30toC31.fg_dodMdt = 0;
CONTAM.Project.Upgraders.C30toC31.fg_tsdens = 0;
CONTAM.Project.Upgraders.C30toC31.fg_rzf = 0;
CONTAM.Project.Upgraders.C30toC31.fg_rzm = 0;
CONTAM.Project.Upgraders.C30toC31.fg_rz1 = 0;
CONTAM.Project.Upgraders.C30toC31.c31File = ""; //new project file contents

//Find save flags to move out of save array
//assumed that reader is initialized with the project
CONTAM.Project.Upgraders.C30toC31.FindSaveFlags = function()
{
  var buffer, i;
  var rdr = CONTAM.Reader;
  var c31 = CONTAM.Project.Upgraders.C30toC31;

  for(i=0;i<30; ++i)
  {
    rdr.nextword(4);
  }
  c31.fg_tsdens = rdr.readIX(0);
  for(i=0;i<9; ++i)
  {
    rdr.nextword(4);
  }

  rdr.readIX(0); //11
  c31.fg_rzf = rdr.readIX(0); //12
  c31.fg_rzm = rdr.readIX(0); //13
  c31.fg_rz1 = rdr.readIX(0); //14
  rdr.readIX(0); //15
  rdr.readIX(0); //16
  rdr.readIX(0); //17
  rdr.readIX(0); //18
  rdr.readIX(0); //19
  rdr.readIX(0); //20
  c31.fg_cnvgSS = rdr.readIX(0);//21
  c31.fg_densZP = rdr.readIX(0);//22
  c31.fg_stackD = rdr.readIX(0);//23
  c31.fg_dodMdt = rdr.readIX(0);//24
  rdr.readIX(0); //25
  rdr.readIX(0); //26
  rdr.readIX(0); //27
  rdr.readIX(0); //28
  rdr.readIX(0); //29
  rdr.readIX(0); //30
  c31.fg_WPC_Trigger = rdr.readIX(0);//31

  // Set all variable density and transient simulation flags one and all if either 
  //   tsdens or dodMdt is set. Compressible air, e.g., scheduled zone temperatures,
  //   should be handled as a "non-flow" process. dodMdt code does not affect 
  //   runtime, so just do it whenever tsdens is active. 
  //
  if( c31.fg_tsdens || c31.fg_dodMdt )
  {
    c31.fg_tsdens = 1;    // tsdens
    c31.fg_densZP = 1;  // densZP
    c31.fg_dodMdt = 1;  // dodMdt
  }

  //On Mar 29 2011 (78cc6e6d8b18) - densZP was defaulted to 1 
  //with tsdens defaulted to 0 which is incorrect - correct that here
  if (c31.fg_densZP == 1 && c31.fg_tsdens == 0)
    c31.fg_densZP = 0;

  rdr.Rewind();

  return 0;
}

/***  C30toC31.c  ************************************************************/

/*  PRJ file format conversion function: ContamW 3.0 to ContamW 3.1
 *  Return 0 for successful conversion; 1 for failure.  */
 //be sure to init the reader before calling

CONTAM.Project.Upgraders.C30toC31.upgrade = function()
{
  var fc = "";
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var c31 = CONTAM.Project.Upgraders.C30toC31;
  var u = CONTAM.Project.Upgraders;

  if(c31.FindSaveFlags())
  {
    CONTAM.error( 2, "Could not find save flags");
    return 1;
  }

  //TODO: rewind reader???
  var prog = rdr.nextword(0);   // read first word of first line.
  if(prog != "ContamW")
  {
    CONTAM.error(2, "Not a ContamW file");
    return 1;
  }

  var ver = rdr.nextword(0);   // check version & revision.
  var revision = ver[3];
  ver = ver.substring(0,3);

  var echo = rdr.readIX( 0 );    /* echo remainder of PRJ file */
  fc = "ContamW 3.1 " + echo + prj.EOL;
  var desc = rdr.nextword(3);   // read description
  fc += desc + prj.EOL;

  CONTAM.Project.Upgraders.C30toC31.c31File = fc;
  c31.run_data31();
  fc = u.same_data();  // species data
  fc += u.same_data();    // level data
  fc += u.same_data();    // day schd data
  fc += u.same_data();    // week schd data
  fc += u.same_data();    // wind data
  fc += u.same_data();    // kinetic data
  fc += u.same_data();    // filter element data
  fc += u.same_data();    // filter data
  fc += u.same_data();    // css elmt data
  CONTAM.Project.Upgraders.C30toC31.c31File += fc;
  c31.afelmt_data31(false);    // air flow elmt data
  c31.afelmt_data31(true);    // duct flow elmt data
  fc = u.same_data();    // super element data
  fc += u.same_data();    // control data
  fc += u.same_data();    // simple AHS data
  fc += u.same_data();    // zone data
  fc += u.same_data();    // zone contaminants
  fc += u.same_data();    // path data
  fc += u.same_data();    // junction data
  fc += u.same_data();    // junction contaminants
  fc += u.same_data();    // segment data
  fc += u.same_data();    // ctm s/s data
  fc += u.same_data();    // occupancy data
  fc += u.same_data();    // exposure data
  fc += u.same_data();    // annotation data
  
  buffer = rdr.nextword(2); // skip remainder last line

  fc += "* end project file." + prj.EOL;
  CONTAM.Project.Upgraders.C30toC31.c31File += fc;

  return 0;

}  // End fcn C30toC31().

// changes 
// Add flag for WPC/DVF trigger
// move density flags out of the save array 
// add scaling factor, origin, and invert Y axis values
CONTAM.Project.Upgraders.C30toC31.run_data31 = function()
{
  var fc = "";
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var u = CONTAM.Project.Upgraders;
  var c31 = CONTAM.Project.Upgraders.C30toC31;

  //! rows cols ud uf    T   uT     N     wH  u  Ao    a
  var skheight = rdr.readIX(1);
  var skwidth = rdr.readIX(0);
  var def_units = rdr.readIX(0);
  var def_flows = rdr.readIX(0);
  var def_T = rdr.readR4(0);
  var udefT = rdr.readIX(0);
  var rel_N = rdr.readR4(0);
  var wind_H = rdr.readR4(0);
  var uwH = rdr.readIX(0);
  var wind_Ao = rdr.readR4(0);
  var wind_a = rdr.readR4(0);
  fc += "! rows cols ud uf    T   uT     N     wH  u  Ao    a" + prj.EOL;
  fc += sprintf("%6d %4d %2d %2d %7.3f %d %7.2f %5.2f %d %5.3f %5.3f",
           skheight, skwidth, def_units, def_flows, def_T, udefT,
           rel_N, wind_H, uwH, wind_Ao, wind_a) + prj.EOL;
  fc += "!  scale     us  orgRow  orgCol  invYaxis showGeom" + prj.EOL;
  fc += sprintf(" %10.3e  %2d   %5d   %5d    %2d       %2d", 
          1.0, 1, skheight-2, 1, 0, 0 ) + prj.EOL;

  //! Ta       Pb      Ws    Wd    rh  day u..
  fc += u.same_line();
  fc += u.same_line();
  fc += u.same_line();
  //weather file
  fc += u.same_line();
  //contaminant file
  fc += u.same_line();
  //continuous values file
  fc += u.same_line();
  //discrete values file
  fc += u.same_line();
  //WPC file
  fc += u.same_line();
  //EWC file
  fc += u.same_line();
  //WPC description
  fc += u.same_line();

  //!  Xref    Yref    Zref   angle u
  fc += u.same_line();
  fc += u.same_line();

  var epsPath = rdr.readR4(1);
  var epsSpcs = rdr.readR4(0);
  var tShift = rdr.nextword(0);
  var dStart = rdr.nextword(0);
  var dEnd = rdr.nextword(0);
  var useWPCwp = rdr.readIX(0);
  var useWPCmf = rdr.readIX(0);
  fc += "! epsP epsS  tShift  dStart dEnd wp mf wpctrig" + prj.EOL;
  fc += sprintf("  %.2f %.2f %s %5s %5s %2d %2d %2d", epsPath, epsSpcs, tShift,
    dStart, dEnd, useWPCwp, useWPCmf, c31.fg_WPC_Trigger) + prj.EOL;

  //! latd  longtd   tznr  altd  Tgrnd u..
  fc += u.same_line();
  fc += u.same_line();

  //!sim_af afcalc afmaxi afrcnvg afacnvg afrelax uac Pbldg uPb
  fc += u.same_line();
  fc += u.same_line();

  //!   slae rs aflmaxi aflcnvg aflinit Tadj
  fc += u.same_line();
  fc += u.same_line();

  //!sim_mf slae rs maxi   relcnvg   abscnvg relax gamma ucc
  fc += u.same_line();
  fc += u.same_line();
  fc += u.same_line();
  fc += u.same_line();
  fc += sprintf("      %5d %3d %4d %9.2e %9.2e %5.3f       %3d ! (cvode)",
           0, 1, 100, 1.0e-6, 1.0e-15, 1.1, 0) + prj.EOL; // CW 3.1

  //!sim_sts sim_1dz sim_1dd celldx sim_vjt udx
  var sim_transportSolver = rdr.readIX(1);
  var sim_1dz = rdr.readIX(0);
  var sim_1dd = rdr.readIX(0);
  var celldx = rdr.readR4(0);
  var sim_vjt = rdr.readIX(0);
  var ucdx = rdr.readIX(0);

  fc += "!mf_solver sim_1dz sim_1dd   celldx  sim_vjt udx" + prj.EOL; // CW 2.2, 3.1
  fc += sprintf("%6d %8d %7d    %9.2e %4d %5d",
    sim_transportSolver, sim_1dz, sim_1dd, celldx, sim_vjt, ucdx) + prj.EOL;

  fc += "!cvode    rcnvg     acnvg    dtmax" + prj.EOL; // CW 3.1
  fc += sprintf("%4d    %9.2e %9.2e %6.2f", 0, 1.0e-6, 1.0e-13, 0.0) + prj.EOL;

  //!tsdens relax tsmaxi
  //var tsdens = 
  rdr.readIX(1);
  var tsrelax = rdr.readR4(0);
  var tsmaxi = rdr.readIX(0);
  fc += "!tsdens relax tsmaxi cnvgSS densZP stackD dodMdt" + prj.EOL; // CW 2.2
  fc += sprintf("%6d %6.2f %5d %5d %5d %5d %5d", c31.fg_tsdens, tsrelax, tsmaxi,
           c31.fg_cnvgSS, c31.fg_densZP, c31.fg_stackD, c31.fg_dodMdt) + prj.EOL;

  //!date_st time_st  date_0 time_0   date_1 time_1    t_step   t_list   t_scrn
  fc += u.same_line();
  fc += u.same_line();

  //!restart  date  time
  fc += u.same_line();
  fc += u.same_line();

  //!list doDlg pfsave zfsave zcsave
  fc += u.same_line();
  fc += u.same_line();

  //!vol ach -bw cbw exp -bw age -bw
  fc += u.same_line();
  fc += u.same_line();

  //!rzf rzm rz1 // CW 3.1
  fc += "!rzf rzm rz1 csm srf log" + prj.EOL;
  fc += sprintf("%3d %3d %3d   1   1   1", c31.fg_rzf, c31.fg_rzm, c31.fg_rz1) + prj.EOL;

  //! 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15\n
  rdr.readIX(0); // 11
  rdr.readIX(0); // 12
  rdr.readIX(0); // 13
  rdr.readIX(0); // 14
  rdr.readIX(0); // 15
  rdr.readIX(0); // 16
  rdr.readIX(0); // 17
  var f18 = rdr.readIX(0);
  var f19 = rdr.readIX(0);
  var f20 = rdr.readIX(0);
  var f21 = rdr.readIX(0);
  var f22 = rdr.readIX(0);
  var f23 = rdr.readIX(0);
  var f24 = rdr.readIX(0);
  var f25 = rdr.readIX(0);
  var f26 = rdr.readIX(0);
  var f27 = rdr.readIX(0);
  var f28 = rdr.readIX(0);
  var f29 = rdr.readIX(0);
  var f30 = rdr.readIX(0);
  var f31 = rdr.readIX(0);
  f21 = f22 = f23 = f24 = f31 = 0;
  fc += "! 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 <- extra[]" + prj.EOL;
  fc += sprintf(
    "   0   0 %2d %2d  %2d  %2d  %2d  %2d  %2d  %2d  %2d  %2d  %2d  %2d  %2d  %2d", 
    f18, f19, f20, f21, f22, f23, f24,
    f25, f26, f27, f28, f29, f30, f31) + prj.EOL;

  //! rvals:
  fc += u.same_line();
  fc += u.same_line();

  //!valZ valD valC
  fc += u.same_line();
  fc += u.same_line();

  //!cfd  cfdcnvg   var zref  maxi dtcmo
  var cfd_ctype = rdr.readIX(1);
  var cfd_convcpl = rdr.readR4(0);
  var cfd_var = rdr.readIX(0);
  var zref = rdr.readIX(0);
  var cfd_imax = rdr.readIX(0);
  var cfd_dtcmo = rdr.readIX(0);
  fc += "!cfd  cfdcnvg   var zref  maxi dtcmo" + prj.EOL; // CW 3.0
  fc += sprintf("%3d  %9.2e %3d %3d   %5d %3d", 
    cfd_ctype, cfd_convcpl, cfd_var, zref, cfd_imax, cfd_dtcmo) + prj.EOL;

  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error in run control section" );
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C30toC31.c31File += fc;
  return 0;
}  /* end run_data31 */

/***  setLamCoef.c  **********************************************************/

/*  Set laminar flow coefficient for powerlaw flow element.
 *  Flow equation types:
 *  0:  F = Ct * rho * dP^x  (Q = Ct * dP^x)
 *  1:  F = Ct * sqrt(rho) * dP^x  (orifice)
 *  2:  F = Ct * dP^x  */

CONTAM.Project.Upgraders.C30toC31.setLamCoef31 = function(Ct, x, A, D, Re, type)
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
      dP = Math.pow( F / (Ct * CONTAM.Units.RHOAIR), 1.0 / x );
      break;
    case 1:   // F = Ct * sqrt(rho) * dP^x
      dP = Math.pow( F / (Ct * CONTAM.Units.SRHO), 1.0 / x );
      break;
    case 2:   // F = Ct * dP^x
      dP = Math.pow( F / Ct, 1.0 / x );
      break;
  }
  if( dP < CONTAM.Units.DPTMIN ) 
    dP = CONTAM.Units.DPTMIN;   // 1998/07/17 - dPt > 0 
    // F = Cl * (rho / mu) * dP
  Cl = (CONTAM.Units.MUAIR * F) / (CONTAM.Units.RHOAIR * dP);

  return Cl;
}  /* end setLamCoef */

//recalculate orifice and duct plr diameters and laminar coefs
// as is done in CW prjRead
CONTAM.Project.Upgraders.C30toC31.afelmt_data31 = function(duct)
{
  var nafe, i, j, nr, dtype, icon;
  var buffer, name, desc;
  var fc = "";
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var u = CONTAM.Project.Upgraders;
  var c31 = CONTAM.Project.Upgraders.C30toC31;

  nafe = rdr.readIX(1);    /* read airflow element data */
  if(duct)
    fc += sprintf("%d ! duct elements:", nafe) + prj.EOL;
  else
    fc += sprintf("%d ! flow elements:", nafe) + prj.EOL;

  for(i=1; i<=nafe; i++)
  {
    nr = rdr.readIX(1);
    if(nr != i) 
      CONTAM.error(2, "Element number mis-match: " + i);
    icon = rdr.readIX(0);
    buffer = rdr.nextword(0);
    dtype = CONTAM.Utils.lin_search(buffer, CONTAM.Globals.afe_dnames);
    name = rdr.nextword(0);
    desc = rdr.nextword(3);
    fc += sprintf("%d %d %s %s%s%s%s", nr, icon, 
            CONTAM.Globals.afe_dnames[dtype], name, prj.EOL, desc, prj.EOL);

    switch (dtype)
    {
      case CONTAM.Globals.PL_ORFC: 
      {
        var lam = rdr.readR4(1);
        var turb = rdr.readR4(0);
        var expt = rdr.readR4(0);
        var area = rdr.readR4(0);
        var dia = rdr.readR4(0);
        var coef = rdr.readR4(0);
        var Re = rdr.readR4(0);
        var u_A = rdr.readI2(0);
        var u_D = rdr.readI2(0);
        dia = Math.sqrt(1.273240 * area);
        lam = c31.setLamCoef31( turb, expt, area, dia, Re, 1);
        fc += sprintf(" %f %f %f %f %f %f %f %d %d",
          lam, turb, expt, area, dia, coef, Re, u_A, u_D) + prj.EOL;
        break;
      }
      case CONTAM.Globals.PL_LEAK1:
      case CONTAM.Globals.PL_LEAK2:
      case CONTAM.Globals.PL_LEAK3:
      case CONTAM.Globals.PL_CONN:
      case CONTAM.Globals.PL_CRACK:
      case CONTAM.Globals.PL_TEST1:
      case CONTAM.Globals.PL_TEST2:
      case CONTAM.Globals.PL_STAIR:
      case CONTAM.Globals.PL_SHAFT:
      case CONTAM.Globals.PL_QCN:
      case CONTAM.Globals.PL_FCN:
      case CONTAM.Globals.QF_QAB:
      case CONTAM.Globals.QF_FAB:
      case CONTAM.Globals.QF_CRACK:
      case CONTAM.Globals.QF_TEST2:
      case CONTAM.Globals.DR_DOOR: 
      case CONTAM.Globals.DR_PL2:
      case CONTAM.Globals.PL_BDQ:
      case CONTAM.Globals.PL_BDF:
      case CONTAM.Globals.SR_JWA:
      case CONTAM.Globals.FN_CMF:
      case CONTAM.Globals.FN_CVF: 
      {
        fc += u.same_line();
        break;
      }
      case CONTAM.Globals.FN_FAN: 
      {
        var fpc0, fpc1, fpc2, fpc3, Sarea;
        var npts, u_Sa;
        fc += u.same_line(); // lam, turb, etc
        fpc0 = rdr.readR4(1);
        fpc1 = rdr.readR4(0);
        fpc2 = rdr.readR4(0);
        fpc3 = rdr.readR4(0);
        npts = rdr.readIX(0);
        Sarea = rdr.readR4(0);
        u_Sa = rdr.readIX(0);
        fc += sprintf(" %f %f %f %f %d %f %d", fpc0, 
          fpc1, fpc2, fpc3, npts, Sarea, u_Sa) + prj.EOL;

        for(j=0; j<npts; j++)
        {
          fc += u.same_line();
        }
        break;
      }
      case CONTAM.Globals.DD_DWC: 
      {
        fc += u.same_line(); // rough, lam, etc
        fc += u.same_line(); // dfedat_read 1
        fc += u.same_line(); // dfedat_read 2
        break;
      } 
      case CONTAM.Globals.DD_PLR: 
      {
        var lam = rdr.readR4(1);
        var turb = rdr.readR4(0);
        var expt = rdr.readR4(0);
        var area = rdr.readR4(0);
        var dia = rdr.readR4(0);
        var coef = rdr.readR4(0);
        var u_A = rdr.readIX(0);
        var u_D = rdr.readIX(0);
        dia = Math.sqrt(1.273240 * area);
        lam = c31.setLamCoef31(turb, expt, area, dia, CONTAM.Units.RE_LT, 1);
        fc += sprintf(" %f %f %f %f %f %f %d %d",
          lam, turb, expt, area, dia, coef, u_A, u_D) + prj.EOL;
        fc += u.same_line(); // dfedat_read 1
        fc += u.same_line(); // dfedat_read 2
        break;
      }
      case CONTAM.Globals.DD_FCN:
      case CONTAM.Globals.DD_QCN:
      case CONTAM.Globals.DD_CMF:
      case CONTAM.Globals.DD_CVF:
      case CONTAM.Globals.DD_BDF:
      case CONTAM.Globals.DD_BDQ: 
      {
        fc += u.same_line();
        fc += u.same_line(); // dfedat_read 1
        fc += u.same_line(); // dfedat_read 2
        break;
      }
      case CONTAM.Globals.DD_FAN: 
      {
        var fpc0, fpc1, fpc2, fpc3, Sarea;
        var npts, u_Sa;
        fc += u.same_line(); // lam, turb etc
        fpc0 = rdr.readR4(1);
        fpc1 = rdr.readR4(0);
        fpc2 = rdr.readR4(0);
        fpc3 = rdr.readR4(0);
        npts = rdr.readIX(0);
        Sarea = rdr.readR4(0);
        u_Sa = rdr.readIX(0);
        fc += sprintf(" %f %f %f %f %d %f %d",
          fpc0, fpc1, fpc2, fpc3, npts, Sarea, u_Sa) + prj.EOL;
        for(j=0; j<npts; j++)
        {
          fc += u.same_line();
        }
        fc += u.same_line(); // dfedat_read 1
        fc += u.same_line(); // dfedat_read 2
        break;
      }
      case CONTAM.Globals.CS_FSP:
      case CONTAM.Globals.CS_QSP:
      case CONTAM.Globals.CS_PSF:
      case CONTAM.Globals.CS_PSQ: 
      {
        var npts = rdr.readIX(1);  // number of data points - at least 4
        var u_X = rdr.readIX(0);
        var u_Y = rdr.readIX(0);
        fc += sprintf(" %d %d %d", npts, u_X, u_Y) + prj.EOL;
        for(j=0; j<npts; j++)
        {
          fc += u.same_line();
        }
        break;
      }
      case CONTAM.Globals.DD_FSP:
      case CONTAM.Globals.DD_QSP:
      case CONTAM.Globals.DD_PSF:
      case CONTAM.Globals.DD_PSQ: 
      {
        var npts = rdr.readIX(1);  // number of data points - at least 4
        var u_X = rdr.readIX(0);
        var u_Y = rdr.readIX(0);
        fc += sprintf(" %d %d %d", npts, u_X, u_Y) + prj.EOL;
        for(j=0; j<npts; j++)
        {
          fc += u.same_line();
        }
        fc += u.same_line(); // dfedat_read 1
        fc += u.same_line(); // dfedat_read 2
        break;
      }
      case CONTAM.Globals.AF_SUP: 
      {
        var n, nsafe = rdr.readIX(0);
        var nsched = rdr.readIX(0);
        var u_Ht = rdr.readIX(0);
        fc += sprintf("  %d %d %d", nsafe, nsched, u_Ht) + prj.EOL;
        for(n=1; n<=nsafe; n++)
        {
          fc += u.same_line();
        }
        break;
      }
      default:
        CONTAM.error( 2, "Invalid element type: " + dtype);
    }  /* end element type switch */

  }  /* end element loop */

  if( rdr.readIX(1) != prj.UNK )
    CONTAM.error( 2, "PRJ read error in airflow element section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C30toC31.c31File += fc;
  return nafe;
}  /* end afelmt_data */


