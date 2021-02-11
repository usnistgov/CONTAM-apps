CONTAM.Project.Upgraders.C32toC33 = {};
CONTAM.Project.Upgraders.C32toC33.c33File = ""; //new project file contents

/***  note_data33.c  *********************************************************/

/*  Add color to annotations
 *  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C32toC33.note_data33 = function()
{
  var u = CONTAM.Project.Upgraders;
  var prj = CONTAM.Project;
  var fc = "";
  var rdr = CONTAM.Reader;
  var nnote, j, nr, n;
  var note;  /* annotation */

  nnote = rdr.rdr.readIX(1);    /* read note data */
  fc += sprintf("%d ! annotations:", nnote ) + prj.EOL;

  for( j=1; j<=nnote; j++ )
    {
    n = rdr.rdr.readIX(1);
    if( n != j ) 
      CONTAM.error( 2, "Note number mis-match: " + i.toString());
    nr = n;
    note = rdr.nextword(2);
    fc += sprintf("%d %d %s", nr, -1, note ) + prj.EOL;
    }
  fc += prj.UNK + prj.EOL;

  if( rdr.rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in note section");
  CONTAM.Project.Upgraders.C32toC33.c33File += fc;

} // end note_data33

/***  path_data33()  *********************************************************/

/* Add color to paths */

CONTAM.Project.Upgraders.C32toC33.path_data33 = function()
{
  var npath, i, nr, jn, jm, je , jf, jw, ja, js, jc, jl;
  var flags;
  var icon, dir;
  var X, Y, relHt, mult, wPset, wPmod, wazm, Fahs, Xmax, Xmin;
  var u_Ht, u_XY, u_dP, u_F, vf_type, cfd_ptyp=0, cfd_btyp=0, cfd_capp=0;
  var cfd_pname;   // CFD ID of path from PRJ file
  var vf_node_name; /* value file node name */ 
  var fc = "";
  var rdr = CONTAM.Reader;

  npath = rdr.readIX(0);    /* read path data */
  fc += sprintf("%d ! flow paths:", npath ) + prj.EOL;
  if( npath > 0 )
    fc += sprintf( "! P#    f  n#  m#  e#  f#  w#  a#  s#  c#  l#    X       Y      relHt  mult wPset wPmod wazm Fahs Xmax Xmin icn dir u[4] cdvf <cdvf name> cfd <cfd data[4]>") + prj.EOL;

  for( i=1; i<=npath; i++ )
  {
    nr = rdr.readIX(1);
    if( nr != i ) 
      CONTAM.error( 2, "Path number mis-match: " + i.toString());
    flags = rdr.readIX( 0 );
    flags &= FLAG_P;

    jn = rdr.readIX( 0 );
    jm = rdr.readIX( 0 );
    je = rdr.readIX( 0 );
    jf = rdr.readIX( 0 );
    jw = rdr.readIX( 0 );
    ja = rdr.readIX( 0 );
    js = rdr.readIX( 0 );
    jc = rdr.readIX( 0 );
    jl = rdr.readIX( 0 );

    X = rdr.readR4( 0 );
    Y = rdr.readR4( 0 );
    relHt = rdr.readR4( 0 );
    mult = rdr.readR4( 0 );
    wPset = rdr.readR4( 0 );
    wPmod = rdr.readR4( 0 );
    wazm = rdr.readR4( 0 );
    Fahs = rdr.readR4( 0 );
    Xmax = rdr.readR4( 0 );
    Xmin = rdr.readR4( 0 );
    icon = rdr.readIX( 0 );
    dir = rdr.readIX( 0 );
    u_Ht = rdr.readIX( 0 );
    u_XY = rdr.readIX( 0 );
    u_dP = rdr.readIX( 0 );
    u_F = rdr.readIX( 0 );
    vf_type = rdr.readIX( 0 );     // CW 3.2, cvf/dvf type
    if(vf_type == 1 || // cvf
      vf_type == 2)    // dvf
    {
       vf_node_name = rdr.nextword(0);
    }
    if( rdr.readIX( 0 ) == 1 ) // CW 3.0
    {
      cfd_pname = rdr.nextword(0);
      cfd_ptyp = rdr.readIX( 0 );
      cfd_btyp = rdr.readIX( 0 );
      cfd_capp = rdr.readIX( 0 );
    }
    else
      cfd_pname =  "";

    fc += sprintf( "%4d %4u %3d %3d %3d %3d %3d %3d %3d %3d %3d ",
             nr, flags, jn, jm, je, jf, jw, ja, js, jc, jl );
    fc += sprintf( "%7.3f %7.3f %7.3f %g %g %g %g %g %g %g ",
             X, Y, relHt, mult, wPset, wPmod, 
             wazm, Fahs, Xmax, Xmin );
    fc += sprintf( "%3u %2u %d %d %d %d %d",
             icon, dir, -1, u_Ht, u_XY, u_dP, u_F );

    fc += sprintf( " %d", vf_type);  // CW 3.2, cvf/dvf w/o control network
    if( vf_type > 0 )
      fc += sprintf( " %s", vf_node_name );

    if( cfd_pname.length > 0 )      // CW 3.0, cfd data
    {
      fc += sprintf( " 1 %s %d %d %d", cfd_pname, cfd_ptyp, 
        cfd_btyp, cfd_capp);
    }
    else
    {
      fc += sprintf(" 0");
    }
    fc += prj.EOL;
  }
  fc += prj.UNK + prj.EOL;
  if( rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in path section");
  CONTAM.Project.Upgraders.C32toC33.c33File += fc;
}  /* end path_data33() */

/***  css_data33()  *********************************************************/

/* Add color to css */

CONTAM.Project.Upgraders.C32toC33.css_data33 = function()
{
  var ncss, i, nr, jz, je, js, jc;
  var mult, CC0, Xmin, Ymin, Hmin, Xmax, Ymax, Hmax;
  var u_XYZ, vf_type;
  var cfd_name=""; /* name to couple with CFD model CW3.0 */
  var vf_node_name=""; /* value file node name */ 
  var fc = "";
  var rdr = CONTAM.Reader;

  ncss = rdr.readIX( 0 );     /* read number of items */
  fc += sprintf("%d ! source/sinks:", ncss ) + prj.EOL;
  if( ncss > 0 )
    fc += sprintf( "! #  z#  e#  s#  c#  mult   CC0  (X, Y, H)min  (X, Y, H)max u[1] cdvf <cdvf name> cfd <cfd name>") + prj.EOL;

  for( i=1; i<=ncss; i++ )
    {
    nr = rdr.readIX( 1 );
    if( nr != i ) 
      CONTAM.error( 2, "S/S number mis-match: " + i.toString());

    jz = rdr.readIX( 0 );
    je = rdr.readIX( 0 );
    js = rdr.readIX( 0 );
    jc = rdr.readIX( 0 );

    mult = rdr.readR4( 0 );
    CC0 = rdr.readR4( 0 );
    Xmin = rdr.readR4( 0 );  // CW 2.3
    Ymin = rdr.readR4( 0 );
    Hmin = rdr.readR4( 0 );
    Xmax = rdr.readR4( 0 );
    Ymax = rdr.readR4( 0 );
    Hmax = rdr.readR4( 0 );
    u_XYZ = readI2( 0 );

    vf_type = readI2( 0 );     // CW 3.2, cdvf type
    if(vf_type == 1 || // cvf
      vf_type == 2)    // dvf
    {
       vf_node_name = rdr.nextword(0);
    }
    if(readI2(0)) // cfd name exists
      cfd_name = rdr.nextword(0);
    else
      strcpy(cfd_name,"");

    fc += sprintf( "%3d %3d %3d %3d %3d %5g %5g  %g %g %g  %g %g %g %d %d",
      nr, jz, je, js, jc, mult, CC0, Xmin, Ymin,
      Hmin, Xmax, Ymax, Hmax, -1, u_XYZ );

    fc += sprintf( " %d", vf_type );       // CW 3.2, cdvf type
    if( vf_type > 0 )
      fc += sprintf( " %s", vf_node_name );

    if(strlen(cfd_name)>0)
      fc += sprintf(" 1 %s", cfd_name);
    else
      fc += sprintf(" 0");

    fc += prj.EOL;

    }

  fc += prj.UNK + prj.EOL;
  if( rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in css section");
  CONTAM.Project.Upgraders.C32toC33.c33File += fc;

}  /* end css_data33() */

/***  pexp_data33.c  ***********************************************************/

/*  Add color to pexp  */

CONTAM.Project.Upgraders.C32toC33.pexp_data33 = function()
{
  var npexp, ncg, i, j, k, nr;
  var gen;
  var cgmlt;
  var desc; /* exposure/person description */
  var fc = "";
  var rdr = CONTAM.Reader;

  npexp = rdr.readIX( 0 );    /* read pexp data */
  fc += sprintf( "%d ! exposures:", npexp ) + prj.EOL;

  for( i=1; i<=npexp; i++ )
    {
    nr = rdr.readIX( 1 );
    if( nr != i ) 
      CONTAM.error( 2, "Exposure number mis-match: " + i.toString());
    gen = rdr.readIX( 0 );
    ncg = rdr.readIX( 0 );
    cgmlt = rdr.readR4( 0 );

    desc = rdr.nextword(3);
    fc += sprintf("%d %d %d %g %d", nr, gen, ncg, cgmlt, -1 );
    fc += prj.EOL;
    fc += sprintf("%s", desc );
    fc += prj.EOL;

    for( j=1,k=0; k<12; k++,j=0 )
      {
      j = rdr.readIX( j );
      fc += sprintf(" %d", j );
      }
    fc += sprintf(" ! occ. schd" ) + prj.EOL;

    for( k=0; k<ncg; k++ )
      {
      var cgmax;
      var u_G, vf_type;
      var spcs_name;
      var vf_node_name; /* value file node name */ 

      spcs_name = rdr.nextword(1);   /* species */
      j = rdr.readIX( 0 );
      cgmax = rdr.readR4( 0 );
      u_G = rdr.readIX( 0 );
      vf_type = rdr.readIX( 0 );   // CW 3.2 2015-07, cvf & dvf w/o control network
      if(vf_type == 1 || vf_type == 2)
      {
         vf_node_name = rdr.nextword(0);
      }
      fc += sprintf( " %s %d %g %d", spcs_name, j, cgmax, u_G );
      fc += sprintf( " %d", vf_type);  // CW 3.2, cvf/dvf w/o control network
      if( vf_type > 0 )
        fc += sprintf( " %s", vf_node_name );
      fc += sprintf( " ! occ. gen") + prj.EOL;
      }
    }

  fc += prj.UNK + prj.EOL;
  if( rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in pexp section");
  CONTAM.Project.Upgraders.C32toC33.c33File += fc;
}  /* end pexp_data33 */

/***  system_data33.c  *********************************************************/

/*  add color to AHS  */

CONTAM.Project.Upgraders.C32toC33.system_data33 = function()
  {
  var nahs, i, nr, zone_r, zone_s, path_r, path_s, path_x;
  var name; /* system name */
  var desc; /* system description */

  nahs = rdr.readIX( 0 );
  fc += sprintf( "%d ! simple AHS:", nahs )+ prj.EOL;
  if( nahs )
    fc += sprintf( "! # zr# zs# pr# ps# px# name" ) + prj.EOL;

  for( i=1; i<=nahs; i++ )
    {
    nr = rdr.readIX( 1 );
    if( nr != i ) 
      CONTAM.error( 2, "System number mis-match: " + i.toString());
    zone_r = rdr.readIX( 0 );
    zone_s = rdr.readIX( 0 );
    path_r = rdr.readIX( 0 );
    path_s = rdr.readIX( 0 );
    path_x = rdr.readIX( 0 );
      /* cannot test zone and path numbers; data not yet read */
    name = rdr.nextword(0);
    desc = rdr.nextword(3);
    fc += sprintf( "%3d %3d %3d %3d %3d %3d %d %s",
             nr, zone_r, zone_s, path_r,
             path_s, path_x, -1, name ) + prj.EOL;
    fc += sprintf( "%s", desc ) + prj.EOL;
    }

  fc += prj.UNK + prj.EOL;
  if( rdr.readIX(1) != prj.UNK)
    CONTAM.error( 2, "PRJ read error in system section");
  CONTAM.Project.Upgraders.C32toC33.c33File += fc;

  }  /* end system_data33 */

/***  C32toC33.c  ************************************************************/

/*  PRJ file format conversion function: ContamW 3.2 to ContamW 3.3
*  Return 0 for successful conversion; 1 for failure.  */

CONTAM.Project.Upgraders.C32toC33.upgrade = function()
{
  var rdr = CONTAM.Reader;
  var fc = "";
  var c33 = CONTAM.Project.Upgraders.C32toC33;
  var u = CONTAM.Project.Upgraders;
  
  console.log("Upgrade 3.2 prj file to 3.3");
  
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
  fc = "ContamW 3.3 " + echo + prj.EOL;

  var desc = rdr.nextword(3);   // read description
  fc += desc + prj.EOL;
  CONTAM.Project.Upgraders.C32toC33.c33File = fc;

  fc = u.same_data();    // run data
  fc += u.same_data();  // species data
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
  c33.system_data33( uprj );    // simple AHS data
  fc += u.same_data();    // zone data
  fc += u.same_data();    // zone contaminants
  c33.path_data33( uprj );    // path data - add color
  fc += u.same_data();    // junction data
  fc += u.same_data();    // junction contaminants
  fc += u.same_data();    // segment data
  c33.css_data33 ( uprj );    // ctm s/s data - add color
  c33.same_data  ( uprj );    // occupancy data
  c33.pexp_data33( uprj );    // exposure data - add color
  c33.note_data33( uprj );    // annotation data - add color

  buffer = rdr.nextword(2); // skip remainder last line

  fc += sprintf( uprj, "* end project file." ) + prj.EOL;

}  // End fcn C32toC33().

