if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

if(typeof CONTAM.Units == "undefined")
{
  CONTAM.Units = {};
}

//UnitDirection.base_to_non_base = 0
//UnitDirection.non_base_to_base = 1

//used to change 3 orders of magnitude (g to kg)
CONTAM.Units.k = 1000;
//used to change 3 orders of magnitude (kg to g)
CONTAM.Units.m = 0.001;
//used in time conversions
CONTAM.Units.min = 60;
//used in time conversions
CONTAM.Units.hour = 3600;
CONTAM.Units.Av = 6.023E+23;  // Avagadro's number
CONTAM.Units.rho20 = 1.20410;   // standard air density [kg/m^3] at 20 C
CONTAM.Units.vol20 = 24.05;   // standard molar volume [m^3] at 20 C
CONTAM.Units.SRHO  = 1.097315;     /* sqrt( RHOAIR ) */
CONTAM.Units.DPTMIN = 1.0e-10;     /* minimum L-T transition dP   1998/07/17 */
CONTAM.Units.MUAIR  = 1.81625e-5;   /* viscosity of standard air */
CONTAM.Units.RE_LT  = 30.0;         /* Reynolds number at L-T transition for pipe/orifice */

CONTAM.Units.Types = {};
CONTAM.Units.Types.NoUnits            = 1;
CONTAM.Units.Types.Length             = 2;
CONTAM.Units.Types.Time               = 3;
CONTAM.Units.Types.Mass               = 4;
CONTAM.Units.Types.Temperature        = 5;
CONTAM.Units.Types.Pressure           = 6;
CONTAM.Units.Types.Temp_Diff          = 7;
CONTAM.Units.Types.Pressure_Diff      = 8;
CONTAM.Units.Types.Flow               = 9;
CONTAM.Units.Types.Area               = 10;
CONTAM.Units.Types.Volume             = 11;
CONTAM.Units.Types.Angle              = 12;
CONTAM.Units.Types.Speed              = 13;
CONTAM.Units.Types.Vol_Flow           = 14;
CONTAM.Units.Types.Leak2              = 15;
CONTAM.Units.Types.Leak3              = 16;
CONTAM.Units.Types.ConcSS             = 17;
CONTAM.Units.Types.DepFlow            = 18;
CONTAM.Units.Types.Time_Constant      = 19;
CONTAM.Units.Types.Density            = 20;
CONTAM.Units.Types.Duct_Leak          = 21;
CONTAM.Units.Types.Mol_Diff           = 22;
CONTAM.Units.Types.Spec_Heat          = 23;
CONTAM.Units.Types.Concentration_MP   = 24;
CONTAM.Units.Types.Concentration_MDP  = 25;
CONTAM.Units.Types.Concentration_MD   = 26;
CONTAM.Units.Types.Concentration_M    = 27;
CONTAM.Units.Types.Concentration_P    = 28;
CONTAM.Units.Types.Concentration_N    = 29;
CONTAM.Units.Types.Concentration_Surf = 30;
CONTAM.Units.Types.Therm_Cond         = 31;
CONTAM.Units.Types.Power              = 32;
CONTAM.Units.Types.Power_Area         = 33;
CONTAM.Units.Types.Occ_Dens           = 34;
CONTAM.Units.Types.Flow_Area          = 35;
CONTAM.Units.Types.Vol_Flow_Area      = 36;
CONTAM.Units.Types.Mass2              = 37;
CONTAM.Units.Types.Mass3              = 38;
CONTAM.Units.Types.IntegratedConcen   = 39;
CONTAM.Units.Types.ConcSS2            = 40;
CONTAM.Units.Types.PartConcen         = 41;


//converts temperature units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - 0 base units to non-base units, 
//            1 non-base units to base units
//return - the value in the new units
CONTAM.Units.TemperatureConvert = function(Value,
    Cnvrt, Direction)
{
  var Conversion = Cnvrt;
  if (Direction == 1 && Conversion != 0)
    Conversion += 3;

  switch (Conversion)
  {
    case 0:
      {
        return Value;
      }
    case 1:
      {
        return Value * 1.8;                   // K -> R
      }
    case 2:
      {
        Value = Value - 273.15;               // K -> C
        if (Math.abs(Value) < 0.00001)
            return 0;
        else
            return Value;
      }
    case 3:
      {
        Value = (Value - 273.15) * 1.8 + 32;  // K -> F
        if (Math.abs(Value) < 0.00002)
            return 0;
        else
            return Value;
      }
    case 4:
      {
        return Value / 1.8;                   // R -> K
      }
    case 5:
      {
        return Value + 273.15;                // C -> K
      }
    case 6:
      {
        return (Value - 32) / 1.8 + 273.15;   // F -> K
      }
  } // end switch
  return Value;

}

//converts length units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.LengthConvert = function(Value,
    Cnvrt, Direction)
{
  var Conversion = Cnvrt;

  if (Direction == 1 && Conversion != 0)
    Conversion = Conversion + 6;
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value / 0.3048;                          // m -> ft
    case 2:
      return Value * 100;                             // m -> cm
    case 3:
      return (Value / 0.3048) * 12;                   // m -> in
    case 4:
      return Value * CONTAM.Units.k;                  // m -> mm
    case 5:
      return Value * 10;                              // m -> dm
    case 6:
      return Value * CONTAM.Units.k * CONTAM.Units.k; // m -> micro-m
    case 7:
      return Value * 0.3048;                          // ft -> m
    case 8:
      return Value * 0.01;                            // cm -> m
    case 9:
      return (Value / 12) * 0.3048;                   // in -> m
    case 10:
      return Value * CONTAM.Units.m;                  // mm -> m
    case 11:
      return Value * 0.1;                             // dm -> m
    case 12:
      return Value * CONTAM.Units.m * CONTAM.Units.m; //micro-m -> m
  }
}

//converts flow per area units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.FlowPerAreaConvert = function (Value,
    Cnvrt, Direction)
{
  var Conversion = Cnvrt;

  if (Direction == 1 && Conversion != 0)
      Conversion = Conversion + 8;

  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value * 2118.88 / CONTAM.Units.rho20 * 0.09290304;                     // kg/s/m^2 -> ft3/min/ft^2
    case 2:
      return Value * (CONTAM.Units.k / CONTAM.Units.rho20);                         // kg/s/m^2 -> L/s/m^2
    case 3:
      return Value / CONTAM.Units.rho20;                                            // kg/s/m^2 -> m3/s/m^2
    case 4:
      return (Value * CONTAM.Units.hour) / CONTAM.Units.rho20;                      // kg/s/m^2 -> m3/h/m^2
    case 5:
      return Value * 2.204622622 * 0.09290304;                                      // kg/s/m^2 -> lb/s/ft^2
    case 6:
      return Value * CONTAM.Units.min * 2118.88 / CONTAM.Units.rho20 * 0.09290304;  // kg/s/m^2 -> ft3/h/ft^2
    case 7:
      return Value * CONTAM.Units.min * CONTAM.Units.k / CONTAM.Units.rho20;        // kg/s/m^2 -> L/min/m^2
    case 8:
      return Value * CONTAM.Units.hour;                                             // kg/s/m^2 -> kg/h/m^2
    case 9:
      return Value * CONTAM.Units.rho20 / 2118.88 / 0.09290304;                     // ft3/min/ft^2 -> kg/s/m^2
    case 10:
      return Value * (CONTAM.Units.rho20 / CONTAM.Units.k);                         // L/s/m^2 -> kg/s/m^2
    case 11:
      return Value * CONTAM.Units.rho20;                                            // m3/s/m^2 -> kg/s/m^2
    case 12:
      return Value / CONTAM.Units.hour * CONTAM.Units.rho20;                        // m3/h/m^2 -> kg/s/m^2
    case 13:
      return Value * 0.45359237 / 0.09290304;                                       // lb/s/ft^2 -> kg/s/m^2
    case 14:
      return Value / CONTAM.Units.min * CONTAM.Units.rho20 / 2118.88 / 0.09290304;  // ft3/h/ft^2 -> kg/s/m^2
    case 15:
      return Value / CONTAM.Units.min * (CONTAM.Units.rho20 / CONTAM.Units.k);      // L/min/m^2 -> kg/s/m^2
    case 16:
      return (Value / CONTAM.Units.hour);                                           // kg/h/m^2 -> kg/s/m^2
  }

}

//1 W is 3.413 BTUs

CONTAM.Units.HeatGainsConvert = function (Value,
    Cnvrt, Direction)
{
  if (Direction == 1 && Cnvrt != 0)
    Cnvrt += 3;
  switch (Cnvrt)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value / 3.15491;     /* W/m^2 -> Btu/h ft^2 */
    case 2:
      return Value * 0.09290304;  /* W/m2 -> W/ft2 */
    case 3:
      return Value * 3.6;         /* W/m2 -> kJ/h m2 */
    case 4:
      return Value * 3.15491;     /* Btu/h ft^2 -> W/m^2 */
    case 5:
      return Value / 0.09290304;  /* W/ft2 -> W/m2 */
    case 6:
      return Value / 3.6;         /* kJ/h m2 -> W/m2 */
  }
}

//converts pressure units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.PressureConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;
  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 6;
  }
  switch (Conversion)
  {
    case 0:
      return Value;
    case 1:
      return Value / 248.84;          // Pa -> in.H2O
    case 2:
      return Value * CONTAM.Units.m;  // Pa -> kPa
    case 3:
      return Value / 3386.42;         // Pa -> in.Hg
    case 4:
      return Value / 101325;          // Pa -> atm.
    case 5:
      return Value / 6894.757;        // Pa -> psi
    case 6:
      return Value / 133.331;         // Pa -> mm.Hg
    case 7:
      return Value * 248.84;          // in.H2O -> Pa
    case 8:
      return Value * CONTAM.Units.k;  // kPa -> Pa
    case 9:
      return Value * 3386.42;         // in.Hg -> Pa
    case 10:
      return Value * 101325;          // atm. -> Pa
    case 11:
      return Value * 6894.757;        // psi -> Pa
    case 12:
      return Value * 133.331;         // mm.Hg -> Pa
  }
  return Value;
}

//converts density units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.DensityConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;
  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 2;
  }
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value * 0.0624279606;    // kg/m3 -> lb/ft3
    case 2:
      return Value * CONTAM.Units.m;  // kg/m3 -> g/cm3
    case 3:
      return Value / 0.0624279606;    // lb/ft3 -> kg/m3
    case 4:
      return Value * CONTAM.Units.k;  // g/cm3 -> kg/m3
  }
}

//converts pressure units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.PressureDiffConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;
  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 1;
  }
  switch (Conversion)
  {
    case 0:
      return Value;
    case 1:
      return Value / 248.84;  // Pa -> in.H2O
    case 2:
      return Value * 248.84;  // in.H2O -> Pa
  }
  return Value;
}

//converts flowrate units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.FlowConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;

  if (Direction == 1 && Conversion != 0)
    Conversion = Conversion + 8;

  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value * (2118.88 / CONTAM.Units.rho20);                            // kg/s -> ft3/min
    case 2:
      return Value * (CONTAM.Units.k / CONTAM.Units.rho20);                     // kg/s -> L/s
    case 3:
      return Value / CONTAM.Units.rho20;                                        // kg/s -> m3/s
    case 4:
      return (Value * CONTAM.Units.hour) / CONTAM.Units.rho20;                  // kg/s -> m3/h
    case 5:
      return Value * 2.204622622;                                               // kg/s -> lb/s
    case 6:
      return Value * CONTAM.Units.min * (2118.88 / CONTAM.Units.rho20);         // kg/s -> ft3/h
    case 7:
      return Value * CONTAM.Units.min * (CONTAM.Units.k / CONTAM.Units.rho20);  // kg/s -> L/min
    case 8:
      return Value * CONTAM.Units.hour;                                         // kg/s -> kg/h
    case 9:
      return Value * (CONTAM.Units.rho20 / 2118.88);                            // ft3/min -> kg/s
    case 10:
      return Value * (CONTAM.Units.rho20 / CONTAM.Units.k);                     // L/s -> kg/s
    case 11:
      return Value * CONTAM.Units.rho20;                                        // m3/s -> kg/s
    case 12:
      return Value / CONTAM.Units.hour * CONTAM.Units.rho20;                    // m3/h -> kg/s
    case 13:
      return Value * 0.45359237;                                                // lb/s -> kg/s
    case 14:
      return Value / CONTAM.Units.min * (CONTAM.Units.rho20 / 2118.88);         // ft3/h -> kg/s
    case 15:
      return Value / CONTAM.Units.min * (CONTAM.Units.rho20 / CONTAM.Units.k);  // L/min -> kg/s
    case 16:
      return (Value / CONTAM.Units.hour);                                       // kg/h -> kg/s
  }
}

CONTAM.Units.ConvertConcUnits = function(fromType, toType, unit)
{
  if( fromType == toType)
    return unit;
  switch(fromType)
  {
  case CONTAM.Globals.Concentration_MDP:
    {
      switch(toType)
      {
      case CONTAM.Globals.Concentration_MD:
        {
          return unit;
        }
      case CONTAM.Globals.Concentration_M:
      case CONTAM.Globals.Concentration_MP:
        {
          if( unit <= 2 )
            return unit;
          else
            return unit - 4;
        }
      case CONTAM.Globals.Concentration_P:
        {
          if( unit == 0 || ( unit >= 1 && unit <= 6 ) ||
            (unit >= 26 && unit <= 39 ) )
            return 0;
          else if( unit > 6 && unit < 26 )
            return unit - 6;
          else // unit >= 39 
            return unit - 20;
        }
      case CONTAM.Globals.Concentration_N:
        {
          if( unit == 0 || ( unit >= 1 && unit <= 6 ) ||
            unit >= 26  )
            return 0;
          else if( unit > 6 && unit < 26 )
            return unit - 6;
        }
      }
    }
  case CONTAM.Globals.Concentration_MP:
    {
      switch(toType)
      {
      case CONTAM.Globals.Concentration_MDP:
        {
          if( unit > 2 )
            return unit + 4;
          else
            return unit;
        }
      case CONTAM.Globals.Concentration_MD:
        {
          if( unit > 36 )
            return 0;
          else if( unit > 2 )
            return unit + 4;
          else
            return unit;
        }
      case CONTAM.Globals.Concentration_M:
        {
          if( unit > 36 )
            return 0;
          else
            return unit;
        }
      case CONTAM.Globals.Concentration_P:
        {
          if( (unit > 21 && unit <= 36) || unit < 3 )
            return 0;
          else if( unit > 36 )
            return unit - 16;
          else
            return unit - 2;          
        }
      case CONTAM.Globals.Concentration_N:
        {
          if( (unit > 21 && unit <= 36) || unit < 3 || unit > 36 )
            return 0;
          else
            return unit - 2;          
        }
      }
    }
  case CONTAM.Globals.Concentration_MD:
    {
      switch(toType)
      {
      case CONTAM.Globals.Concentration_MDP:
        {
          return unit;
        }
      case CONTAM.Globals.Concentration_MP:
      case CONTAM.Globals.Concentration_M:
        {
          if( unit > 2 && unit < 7 )
            return 0;
          else if( unit > 6 )
            return unit - 4;
          else
            return unit;
        }
      case CONTAM.Globals.Concentration_P:
      case CONTAM.Globals.Concentration_N:
        {
          if( unit < 7 || unit > 26 )
            return 0;
          else 
            return unit - 6;
        }
      }
    }
  case CONTAM.Globals.Concentration_M:
    {
      switch(toType)
      {
      case CONTAM.Globals.Concentration_MDP:
      case CONTAM.Globals.Concentration_MD: 
        {
          if( unit < 3 )
            return unit;
          else 
            return unit + 4;
        }
      case CONTAM.Globals.Concentration_MP:
        {
          return unit;
        }
      case CONTAM.Globals.Concentration_P:
      case CONTAM.Globals.Concentration_N:
        {
          if( unit < 3 || unit > 22 )
            return 0;
          if( unit > 2 )
            return unit - 2;
        }
      }
    }
  case CONTAM.Globals.Concentration_P:
    {
      switch(toType)
      {
      case CONTAM.Globals.Concentration_MDP:
        {
          if( unit == 0 )
            return 0;
          else if( unit > 0 && unit < 20 )
            return unit + 6;
          else
            return unit + 20;
        }
      case CONTAM.Globals.Concentration_MP:
        {
          if( unit == 0 )
            return 0;
          else if( unit > 0 && unit < 20 )
            return unit + 2;
          else 
            return unit + 16;
        }
      case CONTAM.Globals.Concentration_MD:
        {
          if( unit > 0 && unit < 20 )
            return unit + 6;
          else
            return 0;
        }
      case CONTAM.Globals.Concentration_M:
        {
          if( unit > 0 && unit < 20 )
            return unit + 2;
          else
            return 0;
        }
      case CONTAM.Globals.Concentration_N:
        {
          if( unit < 20 )
            return unit;
          else
            return 0;
        }
      }
    }
  case CONTAM.Globals.Concentration_N:
    {
      switch(toType)
      {
      case CONTAM.Globals.Concentration_MDP:
      case CONTAM.Globals.Concentration_MD:
        {
          if( unit == 0 )
            return 0;
          else 
            return unit + 6;
        }
      case CONTAM.Globals.Concentration_MP:
      case CONTAM.Globals.Concentration_M:
        {
          if( unit == 0 )
            return 0;
          else
            return unit + 2;
        }
      case CONTAM.Globals.Concentration_P:
        {
          return unit;
        }
      }
    }
  }
  CONTAM.error(2, "Bad Concn Unit Type");
  return 0;
} // end ConvertConcUnits

CONTAM.Units.GetConcUnitType = function(spcs)
{
  if (spcs.molwt > 0)
  {
    if (spcs.edens > 0 && spcs.mdiam > 0)
    {
      if (spcs.decay > 0)
        return CONTAM.Units.Types.Concentration_MDP;
      else
        return CONTAM.Units.Types.Concentration_MP;
    }
    else
    {
      if (spcs.decay > 0)
        return CONTAM.Units.Types.Concentration_MD;
      else
        return CONTAM.Units.Types.Concentration_M;
    }
  }
  else if (spcs.edens > 0 && spcs.mdiam > 0)
    return CONTAM.Units.Types.Concentration_P;
  else
    return CONTAM.Units.Types.Concentration_N;
}


CONTAM.Units.Concen_P_Convert = function(Value, Conversion, Direction, Spcs)
{
  if (Conversion == 0)
    return CONTAM.Units.ConcenConvert(Value, Conversion, Direction, Spcs);
  else if (Conversion > 0 && Conversion <= 19)
    return CONTAM.Units.ConcenConvert(Value, Conversion + 6, Direction, Spcs);
  else
    return CONTAM.Units.ConcenConvert(Value, Conversion + 20, Direction, Spcs);
}

CONTAM.Units.Concen_N_Convert = function(Value, Conversion, Direction, Spcs)
{
  if (Conversion == 0)
    return CONTAM.Units.ConcenConvert(Value, Conversion, Direction, Spcs);
  else if (Conversion > 0 && Conversion <= 19)
    return CONTAM.Units.ConcenConvert(Value, Conversion + 6, Direction, Spcs);
  else
    return CONTAM.Units.ConcenConvert(Value, Conversion + 20, Direction, Spcs);
}

CONTAM.Units.Concen_MP_Convert = function(Value, Conversion, Direction, Spcs)
{
  if (Conversion <= 2)
    return CONTAM.Units.ConcenConvert(Value, Conversion, Direction, Spcs);
  else
    return CONTAM.Units.ConcenConvert(Value, Conversion + 4, Direction, Spcs);
}

CONTAM.Units.Concen_M_Convert = function(Value, Conversion, Direction, Spcs)
{
  if (Conversion <= 2)
    return CONTAM.Units.ConcenConvert(Value, Conversion, Direction, Spcs);
  else
    return CONTAM.Units.ConcenConvert(Value, Conversion + 4, Direction, Spcs);
}

//converts concentration units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.ConcenConvert = function(Value, Cnvrt, Direction, Spcs)
{
  var Conversion = Cnvrt;
  var mw = Spcs.molwt; // molecular weight
  var ed = Spcs.edens; // effective density
  var md = Spcs.mdiam; // mean diameter
  var dr = Spcs.decay; // decay rate
  var k     = CONTAM.Units.k;
  var m     = CONTAM.Units.m;
  var vol20 = CONTAM.Units.vol20;
  var rho20 = CONTAM.Units.rho20;
  var Av    = CONTAM.Units.Av;
  
  if (Direction == 1 && Conversion != 0)
    Conversion = Conversion + 45;
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1: // kg/kg -> ppm
      return Value * Math.pow(k, 2) * (vol20 / mw) * rho20;
    case 2: //kg/kg -> ppb
      return Value * Math.pow(k, 3) * (vol20 / mw) * rho20;
    case 3: // kg/kg -> Bq/kg
      return Value * k * Av * dr / mw;
    case 4: // kg/kg -> Bq/m3
      return (Value * k * Av * dr / mw) * rho20;
    case 5: // kg/kg -> pCi/lb
      return ((Value * k * Av * dr / mw) / 0.037) * 0.45359;
    case 6: // kg/kg -> pCi/L
      return ((Value * k * Av * dr / mw) / 0.037) * 0.001204;
    case 7: // kg/kg -> kg/m3
      return Value * rho20;
    case 8: // kg/kg -> lb/lb
      return Value;
    case 9: // kg/kg -> lb/ft3
      return Value * 2.2046 * (rho20 / 35.3147);
    case 10: // kg/kg -> g/kg
      return Value * k;
    case 11: // kg/kg -> g/m3
      return Value * k * rho20;
    case 12: // kg/kg -> g/lb
      return Value * k * 0.45359;
    case 13: // kg/kg -> g/ ft3
      return Value * k * (rho20 / 35.3147);
    case 14: // kg/kg -> mg/kg
      return Value * Math.pow(k, 2);
    case 15: // kg/kg -> mg/m3
      return Value * Math.pow(k, 2) * rho20;
    case 16: // kg/kg -> mg/lb
      return Value * Math.pow(k, 2) * 0.45359;
    case 17: // kg/kg -> mg/ft3
      return Value * Math.pow(k, 2) * (rho20 / 35.3147);
    case 18: // kg/kg -> �g/kg
      return Value * Math.pow(k, 3);
    case 19: // kg/kg -> �g/m3
      return Value * Math.pow(k, 3) * rho20;
    case 20: // kg/kg -> �g/lb
      return Value * Math.pow(k, 3) * 0.45359;
    case 21: // kg/kg -> �g/ft3
      return Value * Math.pow(k, 3) * (rho20 / 35.3147);
    case 22: // kg/kg -> nano-g/kg
      return Value * Math.pow(k, 4);
    case 23: // kg/kg -> nano-g/m3
      return Value * Math.pow(k, 4) * rho20;
    case 24: // kg/kg -> nano-g/lb
      return Value * Math.pow(k, 4) * 0.45359;
    case 25: // kg/kg -> nano-g/ft3
      return Value * Math.pow(k, 4) * (rho20 / 35.3147);
    case 26: // kg/kg -> m3/kg
      return Value * (vol20 / mw);
    case 27: // kg/kg -> m3/m3
      return Value * (vol20 / mw) * rho20;
    case 28: // kg/kg -> ft3/lb
      return Value * vol20 * 35.3147 / mw * 0.45359;
    case 29: // kg/kg -> ft3/ft3
      return Value * vol20 * 35.3147 / mw * (rho20 / 35.3147);
    case 30: // kg/kg -> L/kg
      return Value * k * (vol20 / mw);
    case 31: // kg/kg -> L/m3
      return Value * k * (vol20 / mw) * rho20;
    case 32: // kg/kg -> L/lb
      return Value * k * (vol20 / mw) * 0.45359;
    case 33: // kg/kg -> L/ft3
      return Value * k * (vol20 / mw) * (rho20 / 35.3147);
    case 34: // kg/kg -> mL/kg
      return Value * Math.pow(k, 2) * (vol20 / mw);
    case 35: // kg/kg -> mL/m3
      return (Value * Math.pow(k, 2) * (vol20 / mw) * rho20);
    case 36: // kg/kg -> mL/lb
      return Value * Math.pow(k, 2) * (vol20 / mw) * 0.45359;
    case 37: // kg/kg -> �L/kg
      return Value * Math.pow(k, 3) * (vol20 / mw);
    case 38: // kg/kg -> �L/m3
      return Value * Math.pow(k, 3) * (vol20 / mw) * rho20;
    case 39: // kg/kg -> �L/lb
      return Value * Math.pow(k, 3) * (vol20 / mw) * 0.45359;
    case 40: // kg/kg -> # / kg
      return Value / (0.16666667 * Math.PI * md * md * md * ed);
    case 41: //kg/kg -> #/m&sup3;
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * rho20;
    case 42: // kg/kg -> #/lb
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * 0.45359;
    case 43: // kg/kg -> #/ft&sup3;
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * (rho20 / 35.3147);
    case 44: // kg/kg -> #/L
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * rho20 * m;
    case 45: // kg/kg -> #/cm&sup3;
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * rho20 * m * m;
    case 46: // ppm -> kg/kg
      return Value * 0.000001 * (mw / vol20) / rho20;
    case 47: // ppb -> kg/kg
      return Value * 0.000000001 * (mw / vol20) / rho20;
    case 48: // Bq/kg -> kg/kg
      return Value * mw / (k * Av * dr);
    case 49: // Bq/m3 -> kg/kg
      return (Value * mw / (k * Av * dr)) / rho20;
    case 50: // pCi/lb -> kg/kg
      return ((Value * mw / (k * Av * dr)) * 0.037) / 0.45359;
    case 51: // pCi/L -> kg/kg
      return ((Value * mw / (k * Av * dr)) * 0.037) /  0.001204;
    case 52: // kg/m3 -> kg/kg
      return Value / rho20;
    case 53: // lb/lb -> kg/kg
      return Value;
    case 54: // lb/ft3 -> kg/kg
      return Value / 2.2046 * 35.3147 / rho20;
    case 55: // g/kg -> kg/kg
      return Value * m;
    case 56: // g/m3 -> kg/kg
      return Value * m / rho20;
    case 57: // g/lb -> kg/kg
      return Value * m / 0.45359;
    case 58: // g/ft3 -> kg/kg
      return Value * m * (35.3147 / rho20);
    case 59: // mg/kg -> kg/kg
      return Value * Math.pow(m, 2);
    case 60: // mg/m3 -> kg/kg
      return Value * Math.pow(m, 2) / rho20;
    case 61: // mg/lb -> kg/kg
      return Value * Math.pow(m, 2) / 0.45359;
    case 62: // mg/ft3 -> kg/kg
      return Value * Math.pow(m, 2) * (35.3147 / rho20);
    case 63: // �g/kg -> kg/kg
      return Value * Math.pow(m, 3);
    case 64: // �g/m3 -> kg/kg
      return Value * Math.pow(m, 3) / rho20;
    case 65: // �g/lb -> kg/kg
      return Value * Math.pow(m, 3) / 0.45359;
    case 66: // �g/ft3 -> kg/kg
      return Value * Math.pow(m, 3) * (35.3147 / rho20);
    case 67: // nano-g/kg -> kg/kg
      return Value * Math.pow(m, 4);
    case 68: // nano-g/m3 -> kg/kg
      return Value * Math.pow(m, 4) / rho20;
    case 69: // nano-g/lb -> kg/kg
      return Value * Math.pow(m, 4) / 0.45359;
    case 70: // nano-g/ft3 -> kg/kg
      return Value * Math.pow(m, 4) * (35.3147 / rho20);
    case 71: // m3/kg -> kg/kg
      return Value * (mw / vol20);
    case 72: // m3/m3 -> kg/kg
      return Value * (mw / vol20) / rho20;
    case 73: // ft3/lb -> kg/kg
      return Value * mw / 35.3147 / vol20 / 0.45359;
    case 74: // ft3/ft3 -> kg/kg
      return Value * mw / 35.3147 / vol20 * 35.3147 / rho20;
    case 75: // L/kg -> kg/kg
      return Value * m * (mw / vol20);
    case 76: // L/m3 -> kg/kg
      return Value * m * (mw / vol20) / rho20;
    case 77: // L/lb -> kg/kg
      return Value * m * (mw / vol20) / 0.45359;
    case 78: // L/ft3 -> kg/kg
      return Value * m * (mw / vol20) * (35.3147 / rho20);
    case 79: // mL/kg -> kg/kg
      return Value * Math.pow(m, 2) * (mw / vol20);
    case 80: // mL/m3 -> kg/kg
      return Value * Math.pow(m, 2) * (mw / vol20) / rho20;
    case 81: // mL/lb -> kg/kg
      return Value * Math.pow(m, 2) * (mw / vol20) / 0.45359;
    case 82: // �L/kg -> kg/kg
      return Value * Math.pow(m, 3) * (mw / vol20);
    case 83: // �L/m3 -> kg/kg
      return Value * Math.pow(m, 3) * (mw / vol20) / rho20;
    case 84: // �L/lb -> kg/kg
      return Value * Math.pow(m, 3) * (mw / vol20) / 0.45359;
    case 85: // # / kg -> kg/kg
      return Value * (0.16666667 * Math.PI * md * md * md * ed);
    case 86: //#/m&sup3; -> kg/kg
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / rho20;
    case 87: // #/lb -> kg/kg
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / 0.45359;
    case 88: // #/ft&sup3; -> kg/kg
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / rho20 * 35.3147;
    case 89: // #/L -> kg/kg
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / rho20 * k;
    case 90: // #/cm&sup3; -> kg/kg
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / rho20 * k * k;
  }
}

//converts flowrate units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.AreaConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;

  if (Direction == 1 && Conversion != 0)
      Conversion = Conversion + 6;
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value / 0.09290304;          // m2 -> ft2
    case 2:
      return Value * 1e4;                 // m2 -> cm2
    case 3:
      return (Value / 0.09290304) * 144;  // m2 -> in2
    case 4:
      return Value * 1e6;                 // m2 -> mm2
    case 5:
      return Value * 100;                 // m2 -> dm2
    case 6:
      return Value * 1e12;                // m2 -> um2
    case 7:
      return Value * 0.09290304;          // ft2 -> m2
    case 8:
      return Value * 1e-4;                // cm2 -> m2
    case 9:
      return (Value / 144) * 0.09290304;  // in2 -> m2
    case 10:
      return Value * 1e-6;                // mm2 -> m2
    case 11:
      return Value * 0.01;                // dm2 -> m2
    case 12:
      return Value * 1e-12;               // um2 -> m2
  }
}

CONTAM.Units.SpeedConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;
  if (Direction == 1 && Conversion != 0)
      Conversion = Conversion + 6;
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1: //m/s -> fpm
      return Value / 0.00508;
    case 2: //m/s -> cm/s
      return Value * 100;
    case 3: //m/s -> mph
      return Value / 0.44704;
    case 4: // m/s -> m/h
      return Value * 3600;
    case 5: //m/s -> km/h
      return Value * 3.6;
    case 6: //m/s -> kn
      return Value / 0.5144444;
    case 7: //m/s <- fpm
      return Value * 0.00508;
    case 8: //m/s <- cm/s
      return Value / 100;
    case 9: //m/s <- mph
      return Value * 0.44704;
    case 10: // m/s <- m/h
      return Value / 3600;
    case 11: //m/s <- km/h
      return Value / 3.6;
    case 12: //m/s <- kn
      return Value * 0.5144444;
  }
}

//converts area units
//value - the value to be converted
//cnvrt - the conversion to use on the value
//direction - the direction of the conversion
//return - the value in the new units
CONTAM.Units.VolumeConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;
  var k     = CONTAM.Units.k;
  var m     = CONTAM.Units.m;

  if (Direction == 1 && Conversion != 0)
    Conversion = Conversion + 6;
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value * 35.3146667;      // m3 -> ft3
    case 2:
      return Value * Math.pow(k, 2);  // m3 -> cm3
    case 3:
      return Value * 61023.7440576;   // m3 -> in3
    case 4:
      return Value * Math.pow(k, 3);  //m3 -> mm3
    case 5:
      return Value * k;               // m3 -> dm3
    case 6:
      return Value * Math.pow(k, 6);  // m3 -> um3
    case 7:
      return Value / 35.3146667;      // ft3 -> m3
    case 8:
      return Value * Math.pow(m, 2); // cm3 -> m3
    case 9:
      return Value / 61023.7440576;   // in3 -> m3
    case 10:
      return Value * Math.pow(m, 3); // mm3 -> m3
    case 11:
      return Value * m;               // dm3 -> m3
    case 12:
      return Value * Math.pow(m, 6); // um3 -> m3
  }
}

CONTAM.Units.TimeConstantConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;
  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 4;
  }
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value * CONTAM.Units.min;  // s -> min
    case 2:
      return Value * CONTAM.Units.hour; // s -> h
    case 3:
      return Value * 86400;             /* 1/s -> 1/day */
    case 4:
      return Value * 86400* 365.2422;   /* 1/s -> 1/year */
    case 5:
      return Value / CONTAM.Units.min;  // min -> s
    case 6:
      return Value / CONTAM.Units.hour; // h -> s
    case 7:
      return Value / 86400;             /* 1/day -> 1/s */
    case 8:
      return Value / 86400 / 365.2422;  /* 1/year -> 1/s */
  }
}

CONTAM.Units.TimeConvert = function(Value, Cnvrt, Direction)
{
  var Conversion = Cnvrt;
  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 2;
  }
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value / CONTAM.Units.min;  // s -> min
    case 2:
      return Value / CONTAM.Units.hour; // s -> h
    case 3:
      return Value * CONTAM.Units.min;  // min -> s
    case 4:
      return Value * CONTAM.Units.hour; // h -> s
  }

}

CONTAM.Units.ConcnSurfConvert = function(Value, Conversion, Direction, Spcs)
{
  var ed = Spcs.edens; // effective density
  var md = Spcs.mdiam; // mean diameter
  var k     = CONTAM.Units.k;
  var m     = CONTAM.Units.m;

  if (Direction == 1 && Conversion != 0)
    Conversion += 13;
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1: /* kg -> g */
      return Value * k;
    case 2:  /* kg -> mg */
      return Value * k * k;
    case 3: /* kg -> ug */
      return Value * k * k * k;
    case 4: /* kg -> # */
      // V = 4/3 pi R^3
      return Value / (0.16666667 * Math.PI * md * md * md * ed);
    case 5: /* 1/m^2 -> 1/cm^2  */
      return Value * 0.0001;
    case 6: /* kg -> g */ /* 1/m^2 -> 1/cm^2  */
      return Value * k * 0.0001;
    case 7:  /* kg -> mg */ /* 1/m^2 -> 1/cm^2  */
      return Value * k * k * 0.0001;
    case 8: /* kg -> ug */ /* 1/m^2 -> 1/cm^2  */
      return Value * k * k * k * 0.0001;
    case 9: /* kg -> # */ /* 1/m^2 -> 1/cm^2  */
      // V = 4/3 pi R^3
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * 0.0001;
    case 10: /* kg/m2 -> lb/m2 */
      return Value * 2.2046 * 0.092903;
    case 11: /* kg -> # */ /* 1/m^2 -> 1/ft^2  */
      // V = 4/3 pi R^3
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * 0.092903;
    case 12: /* kg/m2 -> lb/m2 */ /* 1/ft^2 -> 1/in^2 */
      return Value * 2.2046 / 144.0 * 0.092903;
    case 13:/* kg -> # */ /* 1/ft^2 -> 1/in^2 */
      // V = 4/3 pi R^3
      return Value / (0.16666667 * Math.PI * md * md * md * ed) / 144.0 * 0.092903;
    case 14: //1 /* g  -> kg */
      return Value * m;
    case 15: // 2 /* mg -> kg */
      return Value * m * m;
    case 16: //3 /* ug -> kg */
      return Value * m * m * m;
    case 17: //4 /* # -> kg */
      // V = 4/3 pi R^3
      return Value * (0.16666667 * Math.PI * md * md * md * ed);
    case 18: //5 /* 1/cm^2 -> 1/m^2  */
      return Value * 10000;
    case 19: //6 /* g  -> kg *//* 1/cm^2 -> 1/m^2  */
      return Value * m * 10000;
    case 20: //7 /* mg -> kg */  /* 1/cm^2 -> 1/m^2  */
      return Value * m * m * 10000;
    case 21: //8 /* ug -> kg *//* 1/cm^2 -> 1/m^2  */
      return Value * m * m * m * 10000;
    case 22: //9 /* # -> kg */
      // V = 4/3 pi R^3
      return Value * (0.16666667 * Math.PI * md * md * md * ed) * 10000;
    case 23: //10 /* lb/m2 -> kg/m2 *//* 1/ft^2 -> 1/m^2  */
      return Value / 2.2046 / 0.092903;
    case 24: //11 /* # -> kg */ /* 1/ft^2 -> 1/m^2  */
      // V = 4/3 pi R^3
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / 0.092903;
    case 25: //12 /* lb/m2 -> kg/m2 *//* 1/in^2 -> 1/ft^2 */
      return Value / 2.2046 * 144.0 / 0.092903;
    case 26: //13  /* # -> kg *//* 1/in^2 -> 1/ft^2 */
      // V = 4/3 pi R^3
      return Value * (0.16666667 * Math.PI * md * md * md * ed) * 144.0 / 0.092903;
  }
}

CONTAM.Units.MassConvert = function(Value, Cnvrt, Direction)
{
  var k     = CONTAM.Units.k;
  var m     = CONTAM.Units.m;
  var Conversion = Cnvrt;

  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 2;
  }
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value / 0.45359237;  // kg -> lb
    case 2:
      return Value * k;           // kg -> g
    case 3:
      return Value * 0.45359237;  // lb -> kg
    case 4:
      return Value * m;           // g -> kg
  }
}

CONTAM.Units.Mass2Convert = function(Value, Cnvrt, Direction, Spcs)
{
  if (Spcs == null)
    throw new Error('A species must be set for Mass2 Conversions');
  var k     = CONTAM.Units.k;
  var m     = CONTAM.Units.m;
  var ed = Spcs.edens; // effective density
  var md = Spcs.mdiam; // mean diameter
  var Conversion = Cnvrt;
  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 5;
  }
  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:
      return Value / 0.45359237;  // kg -> lb
    case 2:
      return Value * k;           // kg -> g
    case 3:
      return Value * k * k;           // kg -> mg
    case 4:
      return Value * k * k * k;           // kg -> ug
    case 5:                       /* kg -> # - 2003/10/15 */
      return Value / (0.16666667 * Math.PI * md * md * md * ed);
    case 6:
      return Value * 0.45359237;  // lb -> kg
    case 7:
      return Value * m;           // g -> kg
    case 8:
      return Value * m * m;           // mg -> kg
    case 9:
      return Value * m * m * m;           // ug -> kg
    case 10:                       /* # -> kg - 2003/10/15 */
      return Value * (0.16666667 * Math.PI * md * md * md * ed);
              }
}

CONTAM.Units.ConSSConvert = function(Value, Cnvrt, Direction, Spcs)
{
  if (Spcs == null)
    throw new Error('A species must be set for ConSS Conversions');
  var k  = CONTAM.Units.k;
  var m  = CONTAM.Units.m;
  var ed = Spcs.edens; // effective density
  var md = Spcs.mdiam; // mean diameter
  var dr = Spcs.decay;
  var mw = Spcs.molwt;
  var Av = CONTAM.Units.Av;
  var vol20 = CONTAM.Units.vol20;
  var min = CONTAM.Units.min;
  var hour = CONTAM.Units.hour;
  var Conversion = Cnvrt;

  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 38;
  }

  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:   // kg/s -> lb/s
      return Value * 2.2046;
    case 2:   // kg/s -> Bq/s
      return Value * k * Av * dr / mw;
    case 3:   // kg/s -> pCi/s
      return (Value * k * Av * dr / mw) / 0.037;
    case 4:   // kg/s -> g/s
      return Value * k;
    case 5:   // kg/s -> mg/s
      return Value * Math.pow(k, 2);
    case 6:   // kg/s -> micro-g/s
      return Value * Math.pow(k, 3);
    case 7:   // kg/s -> nano-g/s
      return Value * Math.pow(k, 4);
    case 8:   // kg/s -> m3/s
      return Value * vol20 / mw;
    case 9:   // kg/s -> L/s
      return Value * k * vol20 / mw;
    case 10:  // kg/s -> mL/s
      return Value * Math.pow(k, 2) * vol20 / mw;
    case 11:  // kg/s -> micro-L/s
      return Value * Math.pow(k, 3) * vol20 / mw;
    case 12:  //kg/s -> kg/min
      return Value * min;
    case 13:  // kg/s -> lb/min
      return Value * 2.2046 * min;
    case 14:  // kg/s -> Bq/min
      return Value * k * Av * dr / mw * min;
    case 15:  // kg/s -> pCi/min
      return (Value * k * Av * dr / mw) / 0.037 * min;
    case 16:  // kg/s -> g/min
      return Value * k * min;
    case 17:  // kg/s -> mg/min
      return Value * Math.pow(k, 2) * min;
    case 18:  // kg/s -> micro-g/min
      return Value * Math.pow(k, 3) * min;
    case 19:  // kg/s -> nano-g/min
      return Value * Math.pow(k, 4) * min;
    case 20:  // kg/s -> m3/min
      return Value * vol20 / mw * min;
    case 21:  // kg/s -> L/min
      return Value * k * vol20 / mw * min;
    case 22:  // kg/s -> mL/min
      return Value * Math.pow(k, 2) * vol20 / mw * min;
    case 23:  // kg/s -> micro-L/min
      return Value * Math.pow(k, 3) * vol20 / mw * min;
    case 24:  // kg/s -> kg/h
      return Value * hour;
    case 25:  // kg/s -> lb/h
      return Value * 2.2046 * hour;
    case 26:  // kg/s -> Bq/h
      return Value * k * Av * dr / mw * hour;
    case 27:  // kg/s -> pCi/h
      return (Value * k * Av * dr / mw * hour) / 0.037;
    case 28:  // kg/s -> g/h
      return Value * k * hour;
    case 29:  // kg/s -> mg/h
      return Value * Math.pow(k, 2) * hour;
    case 30:  // kg/s -> micro-g/h
      return Value * Math.pow(k, 3) * hour;
    case 31:  // kg/s -> nano-g/h
      return Value * Math.pow(k, 4) * hour;
    case 32:  // kg/s -> m3/h
      return Value * vol20 / mw * hour;
    case 33:  // kg/s -> L/h
      return Value * k * vol20 / mw * hour;
    case 34:  // kg/s -> mL/h
      return Value * Math.pow(k, 2) * vol20 / mw * hour;
    case 35:  // kg/s -> micro-L/h
      return Value * Math.pow(k, 3) * vol20 / mw * hour;
    case 36:  // kg/s -> #/s
      return Value / (0.16666667 * Math.PI * md * md * md * ed);
    case 37:  // kg/s -> #/min
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * min;
    case 38:  // kg/s -> #/h
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * hour;
    case 39:  // lb/s -> kg/s
      return Value / 2.2046;
    case 40:  // Bq/s -> kg/s
      return Value * mw / (k * Av * dr);
    case 41:  // pCi/s -> kg/s
      return Value * mw / (k * Av * dr) * 0.037;
    case 42:  // g/s -> kg/s
      return Value * m;
    case 43:  // mg/s -> kg/s
      return Value * Math.pow(m, 2);
    case 44:  // micro-g/s -> kg/s
      return Value * Math.pow(m, 3);
    case 45:  // nano-g/s -> kg/s
      return Value * Math.pow(m, 4);
    case 46:  // m3/s -> kg/s
      return Value * mw / vol20;
    case 47:  // L/s -> kg/s
      return Value * m * mw / vol20;
    case 48:  // mL/s -> kg/s
      return Value * Math.pow(m, 2) * mw / vol20;
    case 49:  // micro-L/s -> kg/s
      return Value * Math.pow(m, 3) * mw / vol20;
    case 50:  //kg/min -> kg/s
      return Value / min;
    case 51:  // lb/min -> kg/s
      return Value / 2.2046 / min;
    case 52:  // Bq/min -> kg/s
      return Value * mw / (k * Av * dr) / min;
    case 53:  // pCi/min -> kg/s
      return (Value * mw / (k * Av * dr)) * 0.037 / min;
    case 54:  // g/min -> kg/s
      return (Value * m) / min;
    case 55:  // mg/min -> kg/s
      return Value * Math.pow(m, 2) / min;
    case 56:  // micro-g/min -> kg/s
      return Value * Math.pow(m, 3) / min;
    case 57:  // nano-g/min -> kg/s
      return Value * Math.pow(m, 4) / min;
    case 58:  // m3/min -> kg/s
      return Value * mw / vol20 / min;
    case 59:  // L/min -> kg/s
      return Value * m * mw / vol20 / min;
    case 60:  // mL/min -> kg/s
      return Value * Math.pow(m, 2) * mw / vol20 / min;
    case 61:  // micro-L/min -> kg/s
      return Value * Math.pow(m, 3) * mw / vol20 / min;
    case 62:  // kg/h -> kg/s
      return Value / hour;
    case 63:  // lb/h -> kg/s
      return Value / 2.2046 / hour;
    case 64:  // Bq/h -> kg/s
      return Value * mw / (k * Av * dr) / hour;
    case 65:  // pCi/h -> kg/s
      return (Value * mw / (k * Av * dr) / hour) * 0.037;
    case 66:  // g/h -> kg/s
      return Value * m / hour;
    case 67:  // mg/h -> kg/s
      return Value * Math.pow(m, 2) / hour;
    case 68:  // micro-g/h -> kg/s
      return Value * Math.pow(m, 3) / hour;
    case 69:  // nano-g/h -> kg/s
      return Value * Math.pow(m, 4) / hour;
    case 70:  // m3/h -> kg/s
      return Value * mw / vol20 / hour;
    case 71: // L/h -> kg/s
      return Value * m * mw / vol20 / hour;
    case 72:  // mL/h -> kg/s
      return Value * Math.pow(m, 2) * mw / vol20 / hour;
    case 73:  // micro-L/h -> kg/s                    {
      return Value * Math.pow(m, 3) * mw / vol20 / hour;
    case 74:  // #/s -> kg/s
      return Value * (0.16666667 * Math.PI * md * md * md * ed);
    case 75:  // #/min -> kg/s
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / min;
    case 76:  // #/h -> kg/s
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / hour;
  }
}

//removed decay and volume units
CONTAM.Units.ConSSConvert2 = function(Value, Cnvrt, Direction, Spcs)
{
  if (Spcs == null)
    throw new Error('A species must be set for ConSS Conversions');
  var k  = CONTAM.Units.k;
  var m  = CONTAM.Units.m;
  var ed = Spcs.edens; // effective density
  var md = Spcs.mdiam; // mean diameter
  var min = CONTAM.Units.min;
  var hour = CONTAM.Units.hour;
  var Conversion = Cnvrt;

  if (Direction == 1 && Conversion != 0)
  {
    Conversion = Conversion + 20;
  }

  switch (Conversion)
  {
    default:
    case 0:
      return Value;
    case 1:   // kg/s -> lb/s
      return Value * 2.2046;
    case 2:   // kg/s -> g/s
      return Value * 1.0e3;
    case 3:   // kg/s -> mg/s
      return Value * 1.0e6;
    case 4:   // kg/s -> micro-g/s
      return Value * 1.0e9;
    case 5:   // kg/s -> nano-g/s
      return Value * 1.0e12;
    case 6:  //kg/s -> kg/min
      return Value * min;
    case 7:  // kg/s -> lb/min
      return Value * 2.2046 * min;
    case 8:  // kg/s -> g/min
      return Value * 1.0e3 * min;
    case 9:  // kg/s -> mg/min
      return Value * 1.0e6 * min;
    case 10:  // kg/s -> micro-g/min
      return Value * 1.0e9 * min;
    case 11:  // kg/s -> nano-g/min
      return Value * 1.0e12 * min;
    case 12:  // kg/s -> kg/h
      return Value * hour;
    case 13:  // kg/s -> lb/h
      return Value * 2.2046 * hour;
    case 14:  // kg/s -> g/h
      return Value * 1.0e3 * hour;
    case 15:  // kg/s -> mg/h
      return Value * 1.0e6 * hour;
    case 16:  // kg/s -> micro-g/h
      return Value * 1.0e9 * hour;
    case 17:  // kg/s -> nano-g/h
      return Value * 1.0e12 * hour;
    case 18:  // kg/s -> #/s
      return Value / (0.16666667 * Math.PI * md * md * md * ed);
    case 19:  // kg/s -> #/min
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * min;
    case 20:  // kg/s -> #/h
      return Value / (0.16666667 * Math.PI * md * md * md * ed) * hour;
    case 21:  // lb/s -> kg/s
      return Value / 2.2046;
    case 22:  // g/s -> kg/s
      return Value * 1.0e-03;
    case 23:  // mg/s -> kg/s
      return Value * 1.0e-06;
    case 24:  // micro-g/s -> kg/s
      return Value * 1.0e-09;
    case 25:  // nano-g/s -> kg/s
      return Value * 1.0e-12;
    case 26:  //kg/min -> kg/s
      return Value / min;
    case 27:  // lb/min -> kg/s
      return Value / 2.2046 / min;
    case 28:  // g/min -> kg/s
      return (Value * 1.0e-03) / min;
    case 29:  // mg/min -> kg/s
      return Value * 1.0e-06 / min;
    case 30:  // micro-g/min -> kg/s
      return Value * 1.0e-09 / min;
    case 31:  // nano-g/min -> kg/s
      return Value * 1.0e-12 / min;
    case 32:  // kg/h -> kg/s
      return Value / hour;
    case 33:  // lb/h -> kg/s
      return Value / 2.2046 / hour;
    case 34:  // g/h -> kg/s
      return Value * 1.0e-03 / hour;
    case 35:  // mg/h -> kg/s
      return Value * 1.0e-06 / hour;
    case 36:  // micro-g/h -> kg/s
      return Value * 1.0e-09 / hour;
    case 37:  // nano-g/h -> kg/s
      return Value * 1.0e-12 / hour;
    case 38:  // #/s -> kg/s
      return Value * (0.16666667 * Math.PI * md * md * md * ed);
    case 39:  // #/min -> kg/s
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / min;
    case 40:  // #/h -> kg/s
      return Value * (0.16666667 * Math.PI * md * md * md * ed) / hour;
  }
}

CONTAM.Units.IntegratedConcenConvert = function(Value, Cnvrt, Direction, Spcs)
{
  if (Spcs == null)
    throw new Error('A species must be set for Integrated Concentration Conversions');
  var ed = Spcs.edens; // effective density
  var md = Spcs.mdiam; // mean diameter
  var Conversion = Cnvrt;
  // Define new unit conversion constants
  var kg_to_g  = 1e3;
  var kg_to_mg = 1e6;
  var kg_to_ug = 1e9;
  var kg_to_lb = 2.20462;
  var kg_to_num = 1.0/(0.16666667 * Math.PI * md * md * md * ed)  // 1/(Vpart*RHOpart)
  var s_to_min = 1.66667e-2; // 1/60
  var s_to_h = 2.77778e-4;   // 1/3600
  var m3_to_L = 1.0e3;
  var m3_to_cm3 = 1.0e6;
  var m3_to_ft3 = 35.315;
  var m3_to_in3 = 6.1024e4;
  
  switch (Conversion)
  {
    default:
      case 0:  // kg-s/m3
            conv = 1.0;
            break;
      case 1:  // mg-s/m3
            conv = kg_to_mg;
            break;
      case 2:  // ug-s/m3
            conv = kg_to_ug;
            break;
      case 3:  // #-s/m3
            conv = kg_to_num;
            break;
      case 4:  // mg-s/L
            conv = kg_to_mg / m3_to_L;
            break;
      case 5:  // ug-s/L
            conv = kg_to_ug / m3_to_L;
            break;
      case 6:  // #-s/L
            conv = kg_to_num / m3_to_L;
            break;
      case 7:  // mg-min/m3
            conv = kg_to_mg * s_to_min;
            break;
      case 8:  // ug-min/m3
            conv = kg_to_ug * s_to_min;
            break;
      case 9:  // mg-min/L
            conv = kg_to_mg * s_to_min / m3_to_L;
            break;
      case 10:  // ug-min/L
            conv = kg_to_ug * s_to_min / m3_to_L;
            break;
      case 11:  // #-min/L
            conv = kg_to_num * s_to_min / m3_to_L;
            break;
      case 12:  // kg-h/L
            conv = s_to_h / m3_to_L;
            break;
      case 13:  // g-h/L
            conv = kg_to_g * s_to_h / m3_to_L;
            break;
      case 14:  // #-h/L
            conv = kg_to_num * s_to_h / m3_to_L;
            break;
      case 15:  // kg-h/cm3
            conv = s_to_h / m3_to_cm3;
            break;
      case 16:  // g-h/cm3
            conv = kg_to_g * s_to_h / m3_to_cm3;
            break;
      case 17:  // #-h/cm3
            conv = kg_to_num * s_to_h / m3_to_cm3;
            break;
      case 18:  // lb-h/ft3
            conv = kg_to_lb * s_to_h / m3_to_ft3;
            break;
      case 19:  // #-h/ft3
            conv = kg_to_num * s_to_h / m3_to_ft3;
            break;
      case 20:  // lb-min/ft3
            conv = kg_to_lb * s_to_min / m3_to_ft3;
            break;
      case 21:  // #-min/ft3
            conv = kg_to_num * s_to_min / m3_to_ft3;
            break;
      case 22:  // lb-h/in3
            conv = kg_to_lb * s_to_h / m3_to_in3;
            break;
      case 23:  // #-h/in3
            conv = kg_to_num * s_to_h / m3_to_in3;
            break;
      case 24:  // lb-min/in3
            conv = kg_to_lb * s_to_min / m3_to_in3;
            break;
      case 25:  // #-min/in3
            conv = kg_to_num * s_to_min / m3_to_in3;
  }

  if (Direction == 0 )
  {
        return Value * conv;
  }
  else
  {
        return Value / conv;
  }
}



CONTAM.Units.PartConcenConvert = function(Value, Cnvrt, Direction, Spcs)
{
  if (Spcs == null)
    throw new Error('A species must be set for Integrated Concentration Conversions');
  var ed = Spcs.edens; // effective density
  var md = Spcs.mdiam; // mean diameter
  var Conversion = Cnvrt;
  // Define new unit conversion constants
  var kg_to_g  = 1e3;
  var kg_to_mg = 1e6;
  var kg_to_ug = 1e9;
  var kg_to_lb = 2.20462;
  var kg_to_num = 1.0/(0.16666667 * Math.PI * md * md * md * ed)  // 1/(Vpart*RHOpart)
  var m3_to_L = 1.0e3;
  var m3_to_cm3 = 1.0e6;
  var m3_to_ft3 = 35.315;
  var m3_to_in3 = 6.1024e4;
  switch (Conversion)
  {
    default:
      case 0:  // kg/m3
            conv = 1.0;
            break;
      case 1:  // g/m3
            conv = kg_to_g;
            break;
      case 2:  // mg/m3
            conv = kg_to_mg;
            break;
      case 3:  // ug/m3
            conv = kg_to_ug;
            break;
      case 4:  // #/m3
            conv = kg_to_num;
            break;
      case 5:  // kg/L
            conv = m3_to_L;
            break;
      case 6:  // g/L
            conv = kg_to_g / m3_to_L;
            break;
      case 7:  // mg/L
            conv = kg_to_mg / m3_to_L;
            break;
      case 8:  // ug/L
            conv = kg_to_ug / m3_to_L;
            break;
      case 9:  // #/L
            conv = kg_to_num / m3_to_L;
            break;
      case 10:  // kg/cm3
            conv = m3_to_cm3;
            break;
      case 11:  // g/cm3
            conv = kg_to_g / m3_to_cm3;
            break;
      case 12:  // mg/cm3
            conv = kg_to_mg / m3_to_cm3;
            break;
      case 13:  // ug/cm3
            conv = kg_to_ug / m3_to_cm3;
            break;
      case 14:  // #/cm3
            conv = kg_to_num / m3_to_cm3;
            break;
      case 15:  // lb/ft3
            conv = kg_to_lb / m3_to_ft3;
            break;
      case 16:  // #/ft3
            conv = kg_to_num / m3_to_ft3;
            break;
      case 17:  // lb/in3
            conv = kg_to_lb / m3_to_in3;
            break;
      case 18:  // #/in3
            conv = kg_to_num / m3_to_in3;
  }
  if (Direction == 0 )
  {
      return Value * conv;
  }
  else
  {
      return Value / conv;
  }
}

CONTAM.Units.TypeList = [
  {label: "Temperature", strings: CONTAM.Units.Strings.Temperature, func: CONTAM.Units.TemperatureConvert, species: false},
  {label: "Length", strings: CONTAM.Units.Strings.Length, func: CONTAM.Units.LengthConvert, species: false},
  {label: "FlowPerArea", strings: CONTAM.Units.Strings.FlowPerArea, func: CONTAM.Units.FlowPerAreaConvert, species: false},
  {label: "HeatGains", strings: CONTAM.Units.Strings.HeatGains, func: CONTAM.Units.HeatGainsConvert, species: false},
  {label: "Pressure", strings: CONTAM.Units.Strings.Pressure, func: CONTAM.Units.PressureConvert, species: false},
  {label: "Density", strings: CONTAM.Units.Strings.Density, func: CONTAM.Units.DensityConvert, species: false},
  {label: "PressureDiff", strings: CONTAM.Units.Strings.PressureDiff, func: CONTAM.Units.PressureDiffConvert, species: false},
  {label: "Flow", strings: CONTAM.Units.Strings.Flow, func: CONTAM.Units.FlowConvert, species: false},
  {label: "Concentration", strings: CONTAM.Units.Strings.Concentration_MDP, func: CONTAM.Units.ConcenConvert, species: true},
  {label: "Area", strings: CONTAM.Units.Strings.Area, func: CONTAM.Units.AreaConvert, species: false},
  {label: "Speed", strings: CONTAM.Units.Strings.Speed, func: CONTAM.Units.SpeedConvert, species: false},
  {label: "Volume", strings: CONTAM.Units.Strings.Volume, func: CONTAM.Units.VolumeConvert, species: false},
  {label: "TimeConstant", strings: CONTAM.Units.Strings.TimeConstant, func: CONTAM.Units.TimeConstantConvert, species: false},
  {label: "Time", strings: CONTAM.Units.Strings.Time, func: CONTAM.Units.TimeConvert, species: false},
  {label: "Concentration_Surf", strings: CONTAM.Units.Strings.Concentration_Surf, func: CONTAM.Units.ConcnSurfConvert, species: true},
  {label: "Mass", strings: CONTAM.Units.Strings.Mass, func: CONTAM.Units.MassConvert, species: false},
  {label: "Mass2", strings: CONTAM.Units.Strings.Mass2, func: CONTAM.Units.Mass2Convert, species: true},
  {label: "ConSS", strings: CONTAM.Units.Strings.ConSS , func: CONTAM.Units.ConSSConvert, species: true},
  {label: "ConSS2", strings: CONTAM.Units.Strings.ConSS2, func: CONTAM.Units.ConSSConvert2, species: true},
  {label: "IntegratedConcen", strings: CONTAM.Units.Strings.IntegratedConcen, func: CONTAM.Units.IntegratedConcenConvert, species: true},
  {label: "PartConcen", strings: CONTAM.Units.Strings.PartConcen, func: CONTAM.Units.PartConcenConvert, species: true},
];
