if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.Utils = {};
  
CONTAM.Utils.IsNumber = function(c)
{
  if (c >= '0' && c <= '9') 
  {
    // it is a number
    return true;
  } 
  else 
  {
    // it isn't
    return false;
  }
}

CONTAM.Utils.IsLetter = function(c)
{
  var charc = c.toUpperCase();
  if (charc >= "A" && charc <= "Z") 
    return true;
  else
    return false;
}

CONTAM.Utils.Create2DArray = function(size1, size2)
{
  var arry = [], i;
  for(i=0; i<size1;++i)
  {
    arry[i] = new Array(size2);
  }
  
  return arry;
}

/***  old_name_chk.c  ********************************************************/

/*  Check for old element name; 
 *  return pointer to element if name exists; return 0 if it does not.  */

CONTAM.Utils.old_name_chk = function(pe0, name )
{
  var pe=null;

  if( name[0] != ' ' )   /* not " <none>" or " <required>" */
  {
    pe = CONTAM.Utils.elmt_find( pe0, name );
    if( pe == null ) 
      throw("Name not found: " + name );
  }

  return pe;

}  /* end old_name_chk */

/***  elmt_find.c  **************************************************************/

/*  Find element NAME in linked list starting at PE0.
 *  Return pointer to element; NULL for no match.  
 *  Linear search: short lists searched interactively ==>
 *    execution time should not be a problem.  */

CONTAM.Utils.elmt_find = function(pe0, name)
{
  var pe=null;

  for( pe=pe0.start; pe; pe=pe.next )
    if( pe.name == name ) 
      break;

  return pe;

}  /* end elmt_find */


/***  lin_search.c  **********************************************************/

/*  Linear search through unordered list to match word.
    Return list array index.  */

CONTAM.Utils.lin_search = function(word, list)
{
  var n=0;

  for(n=0; n<list.length; ++n)
  {
    if(word == list[n])
    return n;
  }

  alert("Undefined Element Type: " + word );      
  return -1;

}  /* end lin_search */

CONTAM.error = function(severity) // string can be sent even though no parameters are present
{
  var sev;
  switch(severity)
  {
    case 0:
      sev = "INFO: ";
      break;
    case 1: 
      sev = "WARNING: ";
      break;
    case 2: 
      sev = "ERROR: ";
      break;
    case 3:
      sev = "FATAL: ";
      break;
  }
  var msg = "", i;
  for(i=1; i<arguments.length;++i)
  {
    msg += arguments[i];
  }
  //if(alert)
    //alert(sev + msg);
  //else
    throw(sev + msg);
  //TODO: need fatal ending
}


/*--------------------------------------------------------------- PsyRhoAirFnPbTdbW_Eplus() -----*/
//
// Calculate air density using EnergyPlus calculation
// E+ code from PsycRoutines.f90
//   function PsyRhoAirFnPbTdbW(pb,tdb,dw,calledfrom)  result(rhoair)
//     rhoair = pb/(287.0*(tdb+KelvinConv)*(1.0+1.6077687*w))
//     pb  = barometric pressure [Pa], 101300 Pa
//     w   = humidity ratio  [kg_w/kg_da], min 1e-05
//     tdb = dry bulb temperature [C], 20 C
//     KelvinConv = 273.15
// RHOstdEplus = 1.204012 at 20 C, 101300 Pa
/*-----------------------------------------------------------------------------------------------*/
CONTAM.Utils.PsyRhoAirFnPbTdbW_Eplus = function(Pbar, Tdb, HumRat)
{
  var w;       // humidity ratio used in calculation
  var rhoair;  // calculated air density

  // Upper limit on w
  //
  w = HumRat < 1.0e-05 ? 1.0e-05 : HumRat;
  rhoair = Pbar/(287.0 * (Tdb + 273.15) * (1.0 + 1.6077687 * w));

  // OR ignoring HR
  // rhoair = 1.204012 * 293.15 / (Tdb + 273.15);

  return rhoair;
}
