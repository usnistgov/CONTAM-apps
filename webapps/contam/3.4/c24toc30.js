//requires
// project
// upgraders
// globals

/*subfile:  c24toc30.c  ******************************************************/

/*  Convert ContamW 2.4 PRJ file to a ContamW 3.0 file.  */

CONTAM.Project.Upgraders.C24toC30 = {};
CONTAM.Project.Upgraders.C24toC30.zone1D = [];
CONTAM.Project.Upgraders.C24toC30.revision = "";
CONTAM.Project.Upgraders.C24toC30.c30File = ""; //new project file contents

/***  C24toC30.c  ************************************************************/

/*  PRJ file format conversion function: ContamW 2.4 to ContamW 3.0
 *  Return 0 for successful conversion; 1 for failure.  */
//be sure to initialize the CONTAM reader before calling

CONTAM.Project.Upgraders.C24toC30.upgrade = function()
{
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var c30 = CONTAM.Project.Upgraders.C24toC30;
  var u = CONTAM.Project.Upgraders;
  var fc = ""

  var prog = rdr.nextword(0);
  var ver  = rdr.nextword(0);
  var echo = rdr.nextword(0);
  if(prog != "ContamW")
  {
    CONTAM.error(2, "Not a ContamW file");
    return 1;
  }
  c30.revision = ver[3];
  ver = ver.substring(0,3);

  fc += "ContamW 3.0 " + echo + prj.EOL;
  var buffer = rdr.nextword(3);   // read description
  fc += buffer + prj.EOL;

  CONTAM.Project.Upgraders.C24toC30.c30File = fc;
  c30.run_data30();
  c30.spcs_data30();  // species data
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
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  c30.ctrl_data30();
  fc = u.same_data();    // simple AHS data
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  c30.zone_data30();    // zone data
  fc = u.same_data();    // zone contaminants
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  c30.path_data30();    // path data
  fc = u.same_data();    // junction data
  fc += u.same_data();    // junction contaminants
  fc += u.same_data();    // segment data
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  // ctm s/s data
  c30.css_data30();
  fc = u.same_data();    // occupancy data
  fc += u.same_data();    // exposure data
  fc += u.same_data();    // annotation data
  
  buffer = rdr.nextword(2); // skip remainder last line
  fc += "* end project file." + prj.EOL;
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  return 0;
}  // End fcn C24toC30().


/***  run_data30.c  ************************************************************/

/*  validity check data added for 2.4
 *  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C24toC30.run_data30 = function()
{
  var j, buffer, buffer2, tsdens;
  var prj = CONTAM.Project;
  var u = CONTAM.Project.Upgraders;
  var fc = "";
  var rdr = CONTAM.Reader;
  
  //! rows cols ud uf    T   uT     N     wH  u  Ao    a
  fc += u.same_line();
  fc += u.same_line();

  //! Ta       Pb      Ws    Wd    rh  day u..
  fc += u.same_line();
  fc += u.same_line();
  fc += u.same_line();

  fc += u.same_line(); /* weather file */
  fc += u.same_line();/* contaminant file */
  fc += u.same_line();/* continuous values file */
  fc += u.same_line();/* discrete values file */
  fc += u.same_line();/* WPC file */
  fc += u.same_line();/* EWC file */
  fc += u.same_line();/* WPC description */

  //!  Xref    Yref    Zref   angle u
  fc += u.same_line();
  fc += u.same_line();
  
  //! epsP epsS  tShift  dStart dEnd wp mf\n" );
  fc += u.same_line();
  fc += u.same_line();

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

  //!sim_sts sim_1dz sim_1dd celldx sim_vjt udx
  fc += u.same_line();
  fc += u.same_line();
  
  //!tsdens relax tsmaxi
  fc += u.same_line();
  fc += u.same_line();

  //!date_st time_st  date_0 time_0   date_1 time_1    t_step   t_list   t_scrn\n" );
  fc += u.same_line();
  fc += u.same_line();

  //!restart  date  time\n" );
  fc += u.same_line();
  fc += u.same_line();

  //!list doDlg pfsave zfsave zcsave
  fc += u.same_line();
  fc += u.same_line();

  //!vol ach -bw cbw exp -bw age -bw
  fc += u.same_line();
  fc += u.same_line();

  //!...
  fc += u.same_line();
  fc += u.same_line();

  //! rvals:
  fc += u.same_line();
  fc += u.same_line();
  
  //!valZ valD valC
  fc += u.same_line();
  fc += u.same_line();

  fc += "!ctype conv var zref imax dtcmo" + prj.EOL; // CW 3.0
  fc += sprintf("%4d %5f %4d %4d %4d %4d", 0, 0.01, 0, 0, 1000, 1) + prj.EOL;

  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error in run control section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;

  return 0;

}  // End fcn run_data30().

CONTAM.Project.Upgraders.C24toC30.zone_readahead = function()
{
  var i;
  var name;
  var u = CONTAM.Project.Upgraders;
  var rdr = CONTAM.Reader;
  var file_pos = rdr.GetPosition();
  var prj = CONTAM.Project;
  var c30 = CONTAM.Project.Upgraders.C24toC30;

  u.skip_data(); //ctrl 
  u.skip_data(); // simple AHS data

  var nzone = rdr.readIX(1);
  if(nzone==0)
  {
    rdr.SetPosition(file_pos);
    return 0; 
  }

  for( i=1; i<=nzone; i++ )
  {
    rdr.readIX(1); // pzn->nr
    rdr.readIX(0); // flags
    rdr.readIX(0); // pzn->ps
    rdr.readIX(0); // pzn->pc
    rdr.readIX(0); // pzn->pk
    rdr.readIX(0); // pzn->pld
    rdr.readR4(0); // pzn->relHt
    rdr.readR4(0); // pzn->Vol
    rdr.readR4(0); // pzn->T0
    rdr.readR4(0); // pzn->P0
    name = rdr.nextword(0);

    rdr.readIX(0); // pzn->color
    rdr.readIX(0); // pzn->u_Ht
    rdr.readIX(0); // pzn->u_T
    rdr.readIX(0); // pzn->u_P
    rdr.readIX(0); // pzn->u_V
    c30.zone1D[i] = rdr.readIX(0); // pzn->cdaxis // CW 2.3
    if( c30.zone1D[i] )  // 2006/06/23 // CW 2.3
    {
      var buffer = rdr.nextword(0);  // "1D:"
      rdr.readR4(0); // pzn->X1
      rdr.readR4(0); // pzn->Y1
      rdr.readR4(0); // pzn->H1
      rdr.readR4(0); // pzn->X2
      rdr.readR4(0); // pzn->Y2
      rdr.readR4(0); // pzn->H2
      rdr.readR4(0); // pzn->celldx
      rdr.readR4(0); // pzn->axialD
      rdr.readIX(0); // pzn->u_aD
      rdr.readIX(0); // pzn->u_L
    }
  }

  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error");

  rdr.SetPosition(file_pos);
  return 0; 
} // end zone_readahead

/***  ctrl_data30.c  *********************************************************/

/*  set zone sensor flag 
 *  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C24toC30.ctrl_data30 = function()
{
  var nctrl, i, j, buffer, nr, type,seqnr, n1, n2;
  var flags, inreq, name, desc;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var fc = "";
  var g = CONTAM.Globals;
  var c30 = CONTAM.Project.Upgraders.C24toC30;

  if(CONTAM.Project.Upgraders.C24toC30.zone_readahead())
    return 1;

  nctrl = rdr.readIX(1);    /* read control data */
  fc += sprintf("%d ! control nodes:", nctrl) + prj.EOL; 
  for(i=1; i<=nctrl; i++)
  {
    nr = rdr.readIX(1);
    if(nr != i) 
      CONTAM.error(2, "Control number mis-match: " + i);
    buffer = rdr.nextword(buffer);
    type = CONTAM.Utils.lin_search(buffer, g.ctrl_names);
    seqnr = rdr.readIX(0);
    flags = rdr.readIX(0);
    inreq = rdr.readIX(0);
    n1 = rdr.readIX(0);
    n2 = rdr.readIX(0);
    name = rdr.nextword(0);              /* 2004 bridge */
    desc = rdr.nextword(3);

    switch (type )
    {
      case g.CT_SNS: 
        {
          var offset, scale, tau, X, Y, relHt, source, stype, measure, u_XYZ;
          offset = rdr.readR4(1);
          scale = rdr.readR4(0);
          tau = rdr.readR4(0);
          /*oldsig = */ rdr.readR4(0);
          source = rdr.readIX(0);
          stype = rdr.readIX(0);
          measure = readIX(0);
          X = rdr.readR4(0);  // CW 2.3
          Y = rdr.readR4(0);
          relHt = rdr.readR4(0);
          u_XYZ = rdr.readIX(0);
          buffer = rdr.nextword(0);      /* species name */
          if(CONTAM.Project.Upgraders.C24toC30.revision.length == 0 || 
             CONTAM.Project.Upgraders.C24toC30.revision == " ")  // CX 2.4 to 2.4a sensor flags @@@
          {
            if(stype == 1 && measure == 0)
            {
              if(c30.zone1D[source])
                flags |= g.S_CELL;
            }
          }

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            CONTAM.Globlas.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;

          fc += sprintf(" %f %f %f %f %d %d %d %7.3f %7.3f %7.3f %d %s", 
            offset, scale, tau, 0.0, source, stype, measure, X, Y, relHt, 
            u_XYZ, buffer) + prj.EOL;
          break;
        } 
      case g.CT_SCH: 
        {
          j = rdr.readIX(1);
          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %d", j) + prj.EOL;
          break;
        } 
      case g.CT_SET: 
        {
          var value = rdr.readR4(1);
          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %f", value) + prj.EOL;
          break;
        } 
      case g.CT_CVF:
      case g.CT_DVF: 
        {
          var filename = rdr.nextword(0);

          fc += fprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += filename + prj.EOL;
          break;
        } 
      case g.CT_LOG: 
        {
          var header; /* header string */   // 2005/06/27 2.4
          var units; /* units string */
          var offset = rdr.readR4(1);
          var scale = rdr.readR4(0);
          var udef = rdr.readIX(0);
          header = rdr.nextword(0);
          units = rdr.nextword(0);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %f %f %d %s %s",
            offset, scale, udef, header, units) + prj.EOL;
          break;
        } 
      case g.CT_MOD: 
        {
          var offset = rdr.readR4(1);
          var scale = rdr.readR4(0);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %f %f", offset, scale) + prj.EOL;
          break;
        } 
      case g.CT_HYS: 
        {
          var slack = rdr.readR4(1);
          var slope = rdr.readR4(0);
          var oldsig = rdr.readR4(0);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %f %f %f", slack, slope, oldsig) + prj.EOL;
          break;
        } 
      case g.CT_DLS: 
        {
          var pdsincr = rdr.readIX(1);
          var pdsdecr = rdr.readIX(0);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %d %d", pdsincr, pdsdecr) + prj.EOL;
          break;
        } 
      case g.CT_DLX: 
        {
          var tauincr = rdr.nextword(1);
          var taudecr = rdr.nextword(0);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %s %s", tauincr, taudecr) + prj.EOL;
          break;
        } 
      case g.CT_RAV: 
        {
          var tspan = rdr.nextword(1);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %s", tspan) + prj.EOL;
          break;
        } 
      case g.CT_LBS:
      case g.CT_UBS: 
        {
          var band = rdr.readR4(1);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %f", band) + prj.EOL;
          break;
        } 
      case g.CT_PC1: 
        {
          var kp = rdr.readR4(1);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc  +prj.EOL;
          fc += sprintf(" %f", kp) + prj.EOL;
          break;
        } 
      case g.CT_PI1: 
        {
          var kp = rdr.readR4(1);
          var ki = rdr.readR4(0);
          var oldsig = rdr.readR4(0);
          var olderr = rdr.readR4(0);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s\n", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %f %f %f %f", kp, ki, oldsig, olderr) + prj.EOL;
          break;
        } 
      case g.CT_SUP: 
        {
          var def = rdr.readIX(1);
          var pse = rdr.readIX(0);
          var nin = rdr.readIX(0);
          var nout = rdr.readIX(0);

          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %d %d %d %d", def, pse, nin, nout) + prj.EOL;
          /* list set in ctrl_ptrs() */
          break;
        } 
      case g.CT_SUM:
      case g.CT_AVG:
      case g.CT_MAX:
      case g.CT_MIN: 
        {
          var n, cnode;
          var npcs = rdr.readIX(1);    /* read first value on line */
          fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
            g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
          fc += desc + prj.EOL;
          fc += sprintf(" %d ", npcs);
          for(n=0; n<npcs; n++)    /* read node numbers */
          {
            cnode = rdr.readIX(0);
            fc += sprintf(" %d", cnode);
          }
          fc += prj.EOL;
          break;
        } 
   /* no data with following types */
      case g.CT_INT: 
      case g.CT_PAS:
      case g.CT_BIN:
      case g.CT_ABS:
      case g.CT_INV:
      case g.CT_AND:
      case g.CT_OR:
      case g.CT_XOR:
      case g.CT_ADD:
      case g.CT_SUB:
      case g.CT_MUL:
      case g.CT_DIV:
      case g.CT_LLC:
      case g.CT_ULC:
      case g.CT_LLS:
      case g.CT_ULS:
      case g.CT_SPH:
      case g.CT_POW: // 2.4c
      case g.CT_MDU:
      case g.CT_EXP:  
      case g.CT_LGN:
      case g.CT_LG1:
      case g.CT_SQT:
      case g.CT_SIN:
      case g.CT_COS:
      case g.CT_TAN:
      case g.CT_CEL:
      case g.CT_FLR:
        fc += sprintf("%3d %3s %3d %1d %1d %3d %3d %s", nr, 
          g.ctrl_names[type], seqnr, flags, inreq, n1, n2, name) + prj.EOL;
        fc += desc + prj.EOL;
        fc += prj.EOL;
        break;
      default:
        CONTAM.error( 2, "Invalid control type " + type);
        break;
      }  /* end control type switch */
  }  /* end control element loop */

  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error in control section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  return 0;
}  /* end ctrl_data30 */

/***  zone_data30.c  *********************************************************/

/*  add field for CFD
 *  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C24toC30.zone_data30 = function()
{
  var i, nzone, name, u_aD=0, u_L=0;
  var X1=0, X2=0, Y1=0, Y2=0, H1=0, H2=0, celldx=0, axialD=0;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var fc = "";

  nzone = rdr.readIX(1);
  fc += sprintf("%d ! zones:", nzone) + prj.EOL;
  if(nzone > 0)
    fc += "! Z#  f  s#  c#  k#  l#  relHt    Vol  T0  P0  name  clr u..  axs  1-D data:" + prj.EOL;

  for(i=1; i<=nzone; i++)
  {
    var nr = rdr.readIX(1);
    var flags = rdr.readIX(0);
    var ps = rdr.readIX(0);
    var pc = rdr.readIX(0);
    var pk = rdr.readIX(0);
    var pld = rdr.readIX(0);
    var relHt = rdr.readR4(0);
    var Vol = rdr.readR4(0);
    var T0 = rdr.readR4(0);  
    var P0 = rdr.readR4(0);
    name = rdr.nextword(0);

    var color = rdr.readIX(0);
    var u_Ht = rdr.readIX(0);
    var u_T = rdr.readIX(0);
    var u_P = rdr.readIX(0);
    var u_V = rdr.readIX(0);
    var cdaxis = rdr.readIX(0);   // CW 2.3
    if(cdaxis)  // 2006/06/23 // CW 2.3
    {
      var buffer = rdr.nextword(0);  // "1D:"
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
    fc += sprintf("%4d %2d %3d %3d %3d %3d %7.3f %5f %6f %f %s %d %d %d %d %d %d 0", // CW 3.0
      nr, flags, ps, pc, pk, pld, relHt, Vol, T0, 
      P0, name, color, u_Ht, u_T, u_P, u_V, cdaxis );
    if(cdaxis)
    {
      fc += sprintf(" 1D: %7.3f %7.3f %7.3f %7.3f %7.3f %7.3f %f %f %d %d",
        X1, Y1, H1, X2, Y2, H2, celldx, axialD, u_aD, u_L);
    }
    fc += prj.EOL;
  }

  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in zone section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  return 0;
} // end zone_data30

/***  path_data30.c  *********************************************************/

/*  add field for CFD
 *  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C24toC30.path_data30 = function()
{
  var npath, i;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var fc = "";

  npath = rdr.readIX(1);    /* read path data */
  fc += sprintf("%d ! flow paths:", npath) + prj.EOL;
  if(npath > 0)
    fc += "! P#    f  n#  m#  e#  f#  w#  a#  s#  c#  l#    X       Y      relHt  mult wPset wPmod wazm Fahs Xmax Xmin icn dir u.." + prj.EOL;

  for(i=1; i<=npath; i++)
  {
    var nr = rdr.readIX(1);
    var flags = rdr.readIX(0);
    var pzn = rdr.readIX(0);
    var pzm = rdr.readIX(0);
    var pe = rdr.readIX(0);
    var pf = rdr.readIX(0);
    var pw = rdr.readIX(0);
    var pa = rdr.readIX(0);
    var ps = rdr.readIX(0);
    var pc = rdr.readIX(0);
    var pld = rdr.readIX(0);
    var X = rdr.readR4(0);
    var Y = rdr.readR4(0);
    var relHt = rdr.readR4(0);
    var mult = rdr.readR4(0);
    var wPset = rdr.readR4(0);
    var wPmod = rdr.readR4(0);
    var wazm = rdr.readR4(0);
    var Fahs = rdr.readR4(0);
    var Xmax = rdr.readR4(0);
    var Xmin = rdr.readR4(0);
    var icon = rdr.readIX(0);
    var dir = rdr.readIX(0);
    var u_Ht = rdr.readIX(0);
    var u_XY = rdr.readIX(0);
    var u_dP = rdr.readIX(0);
    var u_F = rdr.readIX(0);
    fc += sprintf("%4d %4d %3d %3d %3d %3d %3d %3d %3d %3d %3d ",
             nr, flags, pzn, pzm, pe, pf, pw, pa, ps, pc, pld );
    fc += sprintf("%7.3f %7.3f %7.3f %f %f %f %f %f %f %f ",
             X, Y, relHt, mult, wPset, wPmod, wazm, Fahs, Xmax, Xmin );
    fc += sprintf("%3d %2d %d %d %d %d 0",
             icon, dir, u_Ht, u_XY, u_dP, u_F) + prj.EOL;
  }

  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error in the path section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  return 0; 
} // end path_data30

/***  spcs_data30.c  *********************************************************/

/*  change conc units
 *  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C24toC30.spcs_data30 = function()
{
  var nspcs, i, nctm, nr, sflag, ntflag, ucc, umd, ued, udm, ucp, new_ucc_type;
  var molwt, mdiam, edens, decay, Dm, ccdef, Cp, name, desc;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var fc = "";
  var g = CONTAM.Globals;

  nctm = rdr.readIX(1);
  fc += sprintf("%d ! contaminants:", nctm) + prj.EOL;
  if(nctm)
  {
    fc += "  ";
    for(i=0; i<nctm; i++)
    {
      fc += sprintf(" %d", rdr.readIX(0));   /* order from ctm_set */
    }
    fc += prj.EOL;
  }

  nspcs = rdr.readIX(1);
  fc += sprintf("%d ! species:", nspcs) + prj.EOL;
  if(nspcs > 0)
    fc += "! # s t   molwt    mdiam       edens       decay       Dm          CCdef        Cp    u...  name" + prj.EOL;

  for(i=1; i<=nspcs; i++)
  {
    nr = rdr.readIX(1);
    sflag = rdr.readIX(0);
    ntflag = rdr.readIX(0);
    molwt = rdr.readR4(0);
    mdiam = rdr.readR4(0);
    edens = rdr.readR4(0);
    decay = rdr.readR4(0);
    Dm = rdr.readR4(0);
    ccdef = rdr.readR4(0);
    Cp = rdr.readR4(0);
    ucc = rdr.readIX(0);
    umd = rdr.readIX(0);
    ued = rdr.readIX(0);
    udm = rdr.readIX(0);
    ucp = rdr.readIX(0);
    name = rdr.nextword(0);
    desc = rdr.nextword(3);

    // code from GetSpeciesConcUnitType()
    if(molwt > 0)
    {
      if(edens > 0 && mdiam > 0)
      {
        if(decay > 0)
          new_ucc_type = g.Concentration_MDP;
        else
          new_ucc_type = g.Concentration_MP;
      }
      else
      {
        if(decay > 0)
          new_ucc_type = g.Concentration_MD;
        else
          new_ucc_type = g.Concentration_M;
      }
    }
    else if(edens > 0 && mdiam > 0)
      new_ucc_type = g.Concentration_P;
    else 
      new_ucc_type = g.Concentration_N;

    ucc = CONTAM.Units.ConvertConcUnits(g.Concentration_MDP, new_ucc_type, ucc);

    fc += sprintf("%3d %d %d %8.4f %11.4e %11.4e %11.4e %11.4e %11.4e %8.3f %d %d %d %d %d %s",
      nr, sflag, ntflag, molwt, mdiam, edens, decay, Dm, ccdef, Cp, ucc, umd, ued, udm, 
      ucp, name) + prj.EOL;
    fc += desc + prj.EOL;
  }

  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in species section");
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  return nspcs;
} // end spcs_data30

/***  css_read.c  ************************************************************/

/*  Read css data from project file.  */

CONTAM.Project.Upgraders.C24toC30.css_data30 = function()
{
  var ncss, i, jz, je, js, jc;
  var mult, CC0, Xmin, Ymin, Hmin, Xmax, Ymax, Hmax, u_XYZ;
  var rdr = CONTAM.Reader;
  var prj = CONTAM.Project;
  var fc = "";
  
  ncss = rdr.readIX(1);     /* read number of items */
  fc += sprintf("%d ! source/sinks:", ncss) + prj.EOL;
  if(ncss > 0)
    fc += "! #  z#  e#  s#  c#  mult   CC0  (X, Y, H)min  (X, Y, H)max u" + prj.EOL;

  for(i=1; i<=ncss; i++)
  {
    if(rdr.readIX(1) != i) 
      CONTAM.error(2, "S/S number mis-match" + i);
    jz = rdr.readIX(0);
    je = rdr.readIX(0);
    js = rdr.readIX(0);
    jc = rdr.readIX(0);
    mult = rdr.readR4(0);
    CC0 = rdr.readR4(0);
    Xmin = rdr.readR4(0);  // CW 2.3
    Ymin = rdr.readR4(0);
    Hmin = rdr.readR4(0);
    Xmax = rdr.readR4(0);
    Ymax = rdr.readR4(0);
    Hmax = rdr.readR4(0);
    u_XYZ = rdr.readIX(0);
    fc += sprintf("%3d %3d %3d %3d %3d %5f %5f  %f %f %f  %f %f %f  %d",
      i, jz, je, js, jc, mult, CC0, Xmin, Ymin, Hmin, Xmax, Ymax, Hmax, u_XYZ);
    fc += " 0" + prj.EOL;

  }
  if(rdr.readIX(1) != prj.UNK)
    CONTAM.error(2, "PRJ read error in Source/Sink section" );
  fc += prj.UNK + prj.EOL;
  CONTAM.Project.Upgraders.C24toC30.c30File += fc;
  return ncss;
}  /* end css_data30 */


