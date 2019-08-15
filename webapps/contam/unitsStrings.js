if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

if(typeof CONTAM.Units == "undefined")
{
  CONTAM.Units = {};
}

//when using these in a document set the innerHTML of the element
//to get the entities converted to characters
CONTAM.Units.Strings = {};
CONTAM.Units.Strings.TimeConstant = ["1/s", "1/min", "1/h", "1/dy", "1/yr"];
CONTAM.Units.Strings.Speed = 
  ["m/s", "fpm", "cm/s", "mph", "m/h", "km/h", "knots"];
CONTAM.Units.Strings.MolecularDiffusion = 
  ["m&sup2;/s", "ft&sup2;/s", "cm&sup2;/s", "ft&sup2;/h"];
CONTAM.Units.Strings.SpecificHeat = ["J/kgK", "Btu/lbF", "kJ/kgK"];
CONTAM.Units.Strings.Length = ["m", "ft", "cm", "in", "mm", "dm", "&micro;m"];
CONTAM.Units.Strings.Time = ["s", "min", "h"];
CONTAM.Units.Strings.Mass = ["kg", "lb", "g"];
CONTAM.Units.Strings.Temperature = ["K", "R", " &deg;C", " &deg;F"];
CONTAM.Units.Strings.Pressure = 
  ["Pa", "inH2O", "kPa", "inHg", "atm", "psi", "mmHg"];
CONTAM.Units.Strings.Area = ["m&sup2;", "ft&sup2;", "cm&sup2;", "in&sup2;", 
  "mm&sup2;", "dm&sup2;", "&micro;m&sup2;"];
CONTAM.Units.Strings.Volume = ["m&sup3;", "ft&sup3;", "cm&sup3;", 
  "in&sup3;", "mm&sup3;", "dm&sup3;", "&micro;m&sup3;"];
CONTAM.Units.Strings.Flow = ["kg/s", "scfm", "sL/s", "sm&sup3;/s", 
  "sm&sup3;/h", "lb/s", "sft&sup3;/h", "sL/min", "kg/h"];
CONTAM.Units.Strings.FlowPerArea = ["kg/(s m&sup2;)", "scfm/ft&sup2;", 
  "sL/(s m&sup2;)", "sm&sup3;/(s m&sup2;)", "sm&sup3;/(h m&sup2;)", 
  "lb/(s ft&sup2;)", "sft&sup3;/(h ft&sup2;)", "sL/(min m&sup2;)", "kg/(h m&sup2;)"];
CONTAM.Units.Strings.Density = ["kg/m&sup3;", "lb/ft&sup3;", "g/cm&sup3;"];
CONTAM.Units.Strings.ConSS = ["kg/s", "lb/s", "Bq/s", "pCi/s", "g/s", "mg/s", 
  "&micro;g/s", "ng/s", "m&sup3;/s", "L/s", "mL/s", "&micro;L/s", "kg/min", "lb/min", 
  "Bq/min", "pCi/min", "g/min", "mg/min", "&micro;g/min", "ng/min", "m&sup3;/min", 
  "L/min", "mL/min", "&micro;L/min", "kg/h", "lb/h", "Bq/h", "pCi/h", "g/h", "mg/h", 
  "&micro;g/h", "ng/h", "m&sup3;/h", "L/h", "mL/h", "&micro;L/h", "#/s", "#/min", "#/h"];
CONTAM.Units.Strings.ConSS2 = ["kg/s", "lb/s", "g/s", "mg/s", "&micro;g/s", "ng/s", 
  "kg/min", "lb/min", "g/min", "mg/min", "&micro;g/min", "ng/min", "kg/h", "lb/h", 
  "g/h", "mg/h", "&micro;g/h", "ng/h", "#/s", "#/min", "#/h"];
CONTAM.Units.Strings.DepFlow = ["kg/s", "lb/s", "g/s", "mg/s", "&micro;g/s", "ng/s", 
  "m&sup3;/s", "L/s", "mL/s", "&micro;L/s", "kg/min", "lb/min", "g/min", "mg/min", 
  "&micro;g/min", "ng/min", "m&sup3;/min", "L/min", "mL/min", "&micro;L/min", "kg/h", 
  "lb/h", "g/h", "mg/h", "&micro;g/h", "ng/h", "m&sup3;/h", "L/h", "mL/h", "&micro;L/h", 
  "#/s", "#/min", "#/h"];
CONTAM.Units.Strings.PressureDiff = ["Pa", "inH20"];
CONTAM.Units.Strings.VolumeFlow = 
  ["m&sup3;/s", "cfm", "L/s", "L/min", "m&sup3;/h", "ft&sup3;/h"];
CONTAM.Units.Strings.DuctLeakage = ["L/s/m&sup2;", "cfm/100ft&sup2;"];
CONTAM.Units.Strings.Leak3 = 
  ["m&sup2;/m&sup2;", "in&sup2;/ft&sup2;", "cm&sup2;/m&sup2;"];
CONTAM.Units.Strings.Leak2 = ["m&sup2;/m", "in&sup2;/ft", "cm&sup2;/m"];
CONTAM.Units.Strings.Mass2 = ["kg", "lb", "g", "#"];
CONTAM.Units.Strings.Mass3 = ["kg", "lb", "g", "#", "Bq", "pCi"];
CONTAM.Units.Strings.Concentration_MP = 
  ["kg/kg", "ppm", "ppb", "kg/m&sup3;", "lb/lb", "lb/ft&sup3;", "g/kg", 
  "g/m&sup3;", "g/lb", "g/ft&sup3;", "mg/kg", "mg/m&sup3;", "mg/lb", 
  "mg/ft&sup3;", "&micro;g/kg", "&micro;g/m&sup3;", "&micro;g/lb", "&micro;g/ft&sup3;", "ng/kg", 
  "ng/m&sup3;", "ng/lb", "ng/ft&sup3;", "m&sup3;/kg", "m&sup3;/m&sup3;", 
  "ft&sup3;/lb", "ft&sup3;/ft&sup3;", "L/kg", "L/m&sup3;", "L/lb", 
  "L/ft&sup3;", "mL/kg", "mL/m&sup3;", "mL/lb", "&micro;L/kg", "&micro;L/m&sup3;", 
  "&micro;L/lb", "#/kg", "#/m&sup3;", "#/lb", "#/ft&sup3;", "#/L", "#/cm&sup3;"];
CONTAM.Units.Strings.Concentration_MDP = 
  ["kg/kg", "ppm", "ppb", "Bq/kg", "Bq/m&sup3;", "pCi/lb", "pCi/L", 
  "kg/m&sup3;", "lb/lb", "lb/ft&sup3;", "g/kg", "g/m&sup3;", "g/lb", 
  "g/ft&sup3;", "mg/kg", "mg/m&sup3;", "mg/lb", "mg/ft&sup3;", "&micro;g/kg", 
  "&micro;g/m&sup3;", "&micro;g/lb", "&micro;g/ft&sup3;", "ng/kg", "ng/m&sup3;", "ng/lb", 
  "ng/ft&sup3;", "m&sup3;/kg", "m&sup3;/m&sup3;", "ft&sup3;/lb", 
  "ft&sup3;/ft&sup3;", "L/kg", "L/m&sup3;", "L/lb", "L/ft&sup3;", "mL/kg", 
  "mL/m&sup3;", "mL/lb", "&micro;L/kg", "&micro;L/m&sup3;", "&micro;L/lb", "#/kg", "#/m&sup3;", 
  "#/lb", "#/ft&sup3;", "#/L", "#/cm&sup3;"];
CONTAM.Units.Strings.Concentration_MD = 
  ["kg/kg", "ppm", "ppb", "Bq/kg", "Bq/m&sup3;", "pCi/lb", "pCi/L", 
  "kg/m&sup3;", "lb/lb", "lb/ft&sup3;", "g/kg", "g/m&sup3;", "g/lb", 
  "g/ft&sup3;", "mg/kg", "mg/m&sup3;", "mg/lb", "mg/ft&sup3;", "&micro;g/kg", 
  "&micro;g/m&sup3;", "&micro;g/lb", "&micro;g/ft&sup3;", "ng/kg", "ng/m&sup3;", "ng/lb", 
  "ng/ft&sup3;", "m&sup3;/kg", "m&sup3;/m&sup3;", "ft&sup3;/lb", 
  "ft&sup3;/ft&sup3;", "L/kg", "L/m&sup3;", "L/lb", "L/ft&sup3;", "mL/kg", 
  "mL/m&sup3;", "mL/lb", "&micro;L/kg", "&micro;L/m&sup3;", "&micro;L/lb"];
CONTAM.Units.Strings.Concentration_M = 
  ["kg/kg", "ppm", "ppb", "kg/m&sup3;", "lb/lb", "lb/ft&sup3;", "g/kg", 
  "g/m&sup3;", "g/lb", "g/ft&sup3;", "mg/kg", "mg/m&sup3;", "mg/lb", 
  "mg/ft&sup3;", "&micro;g/kg", "&micro;g/m&sup3;", "&micro;g/lb", "&micro;g/ft&sup3;", "ng/kg", 
  "ng/m&sup3;", "ng/lb", "ng/ft&sup3;", "m&sup3;/kg", "m&sup3;/m&sup3;", 
  "ft&sup3;/lb", "ft&sup3;/ft&sup3;", "L/kg", "L/m&sup3;", "L/lb", 
  "L/ft&sup3;", "mL/kg", "mL/m&sup3;", "mL/lb", "&micro;L/kg", "&micro;L/m&sup3;", "&micro;L/lb"];
CONTAM.Units.Strings.Concentration_P = 
  ["kg/kg", "kg/m&sup3;", "lb/lb", "lb/ft&sup3;", "g/kg", "g/m&sup3;", "g/lb", 
  "g/ft&sup3;", "mg/kg", "mg/m&sup3;", "mg/lb", "mg/ft&sup3;", "&micro;g/kg",
  "&micro;g/m&sup3;", "&micro;g/lb", "&micro;g/ft&sup3;", "ng/kg", "ng/m&sup3;", "ng/lb", 
  "ng/ft&sup3;", "#/kg", "#/m&sup3;", "#/lb", "#/ft&sup3;", "#/L", "#/cm&sup3;"];
CONTAM.Units.Strings.Concentration_N = 
  ["kg/kg", "kg/m&sup3;", "lb/lb", "lb/ft&sup3;", "g/kg", "g/m&sup3;", 
  "g/lb", "g/ft&sup3;", "mg/kg", "mg/m&sup3;", "mg/lb", "mg/ft&sup3;", 
  "&micro;g/kg", "&micro;g/m&sup3;", "&micro;g/lb", "&micro;g/ft&sup3;", "ng/kg", "ng/m&sup3;", 
  "ng/lb", "ng/ft&sup3;"];
CONTAM.Units.Strings.Concentration_Surf =  // surface area concentration for DVR
  ["kg/m&sup2;" , "g/m&sup2;" , "mg/m&sup2;" , "&micro;g/m&sup2;" , "#/m&sup2;", 
  "kg/cm&sup2;", "g/cm&sup2;", "mg/cm&sup2;", "&micro;g/cm&sup2;", "#/cm&sup2;", 
  "lb/ft&sup2;", "#/ft&sup2;", "lb/in&sup2;", "#/in&sup2;" ];

CONTAM.Units.Strings.Energy = ["W", "BTU"];
CONTAM.Units.Strings.HeatGains = 
  ["W/m&sup2;", "BTU/h/ft&sup2;", "W/ft&sup2;", "kJ/h·m&sup2;"];
CONTAM.Units.Strings.IntegratedConcen =
  ["kg s/m&sup3;", "g s/m&sup3;", "mg s/m&sup3;", "&micro;g s/m&sup3;", "&num; s/m&sup3;"];
  
// these don't need escaping like ones above
CONTAM.Units.Strings2 = {};
CONTAM.Units.Strings2.TimeConstant = ["1/s", "1/min", "1/h", "1/dy", "1/yr"];
CONTAM.Units.Strings2.Speed = 
  ["m/s", "fpm", "cm/s", "mph", "m/h", "km/h", "knots"];
CONTAM.Units.Strings2.MolecularDiffusion = 
  ["m\xB2/s", "ft\xB2/s", "cm\xB2/s", "ft\xB2/h"];
CONTAM.Units.Strings2.SpecificHeat = ["J/kgK", "Btu/lbF", "kJ/kgK"];
CONTAM.Units.Strings2.Length = ["m", "ft", "cm", "in", "mm", "dm", "\xB5m"];
CONTAM.Units.Strings2.Time = ["s", "min", "h"];
CONTAM.Units.Strings2.Mass = ["kg", "lb", "g"];
CONTAM.Units.Strings2.Temperature = ["K", "R", " \xB0C", " \xB0F"];
CONTAM.Units.Strings2.Pressure = 
  ["Pa", "inH2O", "kPa", "inHg", "atm", "psi", "mmHg"];
CONTAM.Units.Strings2.Area = ["m\xB2", "ft\xB2", "cm\xB2", "in\xB2", 
  "mm\xB2", "dm\xB2", "\xB5m\xB2"];
CONTAM.Units.Strings2.Volume = ["m\xB3", "ft\xB3", "cm\xB3", 
  "in\xB3", "mm\xB3", "dm\xB3", "\xB5m\xB3"];
CONTAM.Units.Strings2.Flow = ["kg/s", "scfm", "sL/s", "sm\xB3/s", 
  "sm\xB3/h", "lb/s", "sft\xB3/h", "sL/min", "kg/h"];
CONTAM.Units.Strings2.FlowPerArea = ["kg/(s m\xB2)", "scfm/ft\xB2", 
  "sL/(s m\xB2)", "sm\xB3/(s m\xB2)", "sm\xB3/(h m\xB2)", 
  "lb/(s ft\xB2)", "sft\xB3/(h ft\xB2)", "sL/(min m\xB2)", "kg/(h m\xB2)"];
CONTAM.Units.Strings2.Density = ["kg/m\xB3", "lb/ft\xB3", "g/cm\xB3"];
CONTAM.Units.Strings2.ConSS = ["kg/s", "lb/s", "Bq/s", "pCi/s", "g/s", "mg/s", 
  "\xB5g/s", "ng/s", "m\xB3/s", "L/s", "mL/s", "\xB5L/s", "kg/min", "lb/min", 
  "Bq/min", "pCi/min", "g/min", "mg/min", "\xB5g/min", "ng/min", "m\xB3/min", 
  "L/min", "mL/min", "\xB5L/min", "kg/h", "lb/h", "Bq/h", "pCi/h", "g/h", "mg/h", 
  "\xB5g/h", "ng/h", "m\xB3/h", "L/h", "mL/h", "\xB5L/h", "#/s", "#/min", "#/h"];
CONTAM.Units.Strings2.ConSS2 = ["kg/s", "lb/s", "g/s", "mg/s", "\xB5g/s", "ng/s", 
  "kg/min", "lb/min", "g/min", "mg/min", "\xB5g/min", "ng/min", "kg/h", "lb/h", 
  "g/h", "mg/h", "\xB5g/h", "ng/h", "#/s", "#/min", "#/h"];
CONTAM.Units.Strings2.DepFlow = ["kg/s", "lb/s", "g/s", "mg/s", "\xB5g/s", "ng/s", 
  "m\xB3/s", "L/s", "mL/s", "\xB5L/s", "kg/min", "lb/min", "g/min", "mg/min", 
  "\xB5g/min", "ng/min", "m\xB3/min", "L/min", "mL/min", "\xB5L/min", "kg/h", 
  "lb/h", "g/h", "mg/h", "\xB5g/h", "ng/h", "m\xB3/h", "L/h", "mL/h", "\xB5L/h", 
  "#/s", "#/min", "#/h"];
CONTAM.Units.Strings2.PressureDiff = ["Pa", "inH20"];
CONTAM.Units.Strings2.VolumeFlow = 
  ["m\xB3/s", "cfm", "L/s", "L/min", "m\xB3/h", "ft\xB3/h"];
CONTAM.Units.Strings2.DuctLeakage = ["L/s/m\xB2", "cfm/100ft\xB2"];
CONTAM.Units.Strings2.Leak3 = 
  ["m\xB2/m\xB2", "in\xB2/ft\xB2", "cm\xB2/m\xB2"];
CONTAM.Units.Strings2.Leak2 = ["m\xB2/m", "in\xB2/ft", "cm\xB2/m"];
CONTAM.Units.Strings2.Mass2 = ["kg", "lb", "g", "#"];
CONTAM.Units.Strings2.Mass3 = ["kg", "lb", "g", "#", "Bq", "pCi"];
CONTAM.Units.Strings2.Concentration_MP = 
  ["kg/kg", "ppm", "ppb", "kg/m\xB3", "lb/lb", "lb/ft\xB3", "g/kg", 
  "g/m\xB3", "g/lb", "g/ft\xB3", "mg/kg", "mg/m\xB3", "mg/lb", 
  "mg/ft\xB3", "\xB5g/kg", "\xB5g/m\xB3", "\xB5g/lb", "\xB5g/ft\xB3", "ng/kg", 
  "ng/m\xB3", "ng/lb", "ng/ft\xB3", "m\xB3/kg", "m\xB3/m\xB3", 
  "ft\xB3/lb", "ft\xB3/ft\xB3", "L/kg", "L/m\xB3", "L/lb", 
  "L/ft\xB3", "mL/kg", "mL/m\xB3", "mL/lb", "\xB5L/kg", "\xB5L/m\xB3", 
  "\xB5L/lb", "#/kg", "#/m\xB3", "#/lb", "#/ft\xB3", "#/L", "#/cm\xB3"];
CONTAM.Units.Strings2.Concentration_MDP = 
  ["kg/kg", "ppm", "ppb", "Bq/kg", "Bq/m\xB3", "pCi/lb", "pCi/L", 
  "kg/m\xB3", "lb/lb", "lb/ft\xB3", "g/kg", "g/m\xB3", "g/lb", 
  "g/ft\xB3", "mg/kg", "mg/m\xB3", "mg/lb", "mg/ft\xB3", "\xB5g/kg", 
  "\xB5g/m\xB3", "\xB5g/lb", "\xB5g/ft\xB3", "ng/kg", "ng/m\xB3", "ng/lb", 
  "ng/ft\xB3", "m\xB3/kg", "m\xB3/m\xB3", "ft\xB3/lb", 
  "ft\xB3/ft\xB3", "L/kg", "L/m\xB3", "L/lb", "L/ft\xB3", "mL/kg", 
  "mL/m\xB3", "mL/lb", "\xB5L/kg", "\xB5L/m\xB3", "\xB5L/lb", "#/kg", "#/m\xB3", 
  "#/lb", "#/ft\xB3", "#/L", "#/cm\xB3"];
CONTAM.Units.Strings2.Concentration_MD = 
  ["kg/kg", "ppm", "ppb", "Bq/kg", "Bq/m\xB3", "pCi/lb", "pCi/L", 
  "kg/m\xB3", "lb/lb", "lb/ft\xB3", "g/kg", "g/m\xB3", "g/lb", 
  "g/ft\xB3", "mg/kg", "mg/m\xB3", "mg/lb", "mg/ft\xB3", "\xB5g/kg", 
  "\xB5g/m\xB3", "\xB5g/lb", "\xB5g/ft\xB3", "ng/kg", "ng/m\xB3", "ng/lb", 
  "ng/ft\xB3", "m\xB3/kg", "m\xB3/m\xB3", "ft\xB3/lb", 
  "ft\xB3/ft\xB3", "L/kg", "L/m\xB3", "L/lb", "L/ft\xB3", "mL/kg", 
  "mL/m\xB3", "mL/lb", "\xB5L/kg", "\xB5L/m\xB3", "\xB5L/lb"];
CONTAM.Units.Strings2.Concentration_M = 
  ["kg/kg", "ppm", "ppb", "kg/m\xB3", "lb/lb", "lb/ft\xB3", "g/kg", 
  "g/m\xB3", "g/lb", "g/ft\xB3", "mg/kg", "mg/m\xB3", "mg/lb", 
  "mg/ft\xB3", "\xB5g/kg", "\xB5g/m\xB3", "\xB5g/lb", "\xB5g/ft\xB3", "ng/kg", 
  "ng/m\xB3", "ng/lb", "ng/ft\xB3", "m\xB3/kg", "m\xB3/m\xB3", 
  "ft\xB3/lb", "ft\xB3/ft\xB3", "L/kg", "L/m\xB3", "L/lb", 
  "L/ft\xB3", "mL/kg", "mL/m\xB3", "mL/lb", "\xB5L/kg", "\xB5L/m\xB3", "\xB5L/lb"];
CONTAM.Units.Strings2.Concentration_P = 
  ["kg/kg", "kg/m\xB3", "lb/lb", "lb/ft\xB3", "g/kg", "g/m\xB3", "g/lb", 
  "g/ft\xB3", "mg/kg", "mg/m\xB3", "mg/lb", "mg/ft\xB3", "\xB5g/kg",
  "\xB5g/m\xB3", "\xB5g/lb", "\xB5g/ft\xB3", "ng/kg", "ng/m\xB3", "ng/lb", 
  "ng/ft\xB3", "#/kg", "#/m\xB3", "#/lb", "#/ft\xB3", "#/L", "#/cm\xB3"];
CONTAM.Units.Strings2.Concentration_N = 
  ["kg/kg", "kg/m\xB3", "lb/lb", "lb/ft\xB3", "g/kg", "g/m\xB3", 
  "g/lb", "g/ft\xB3", "mg/kg", "mg/m\xB3", "mg/lb", "mg/ft\xB3", 
  "\xB5g/kg", "\xB5g/m\xB3", "\xB5g/lb", "\xB5g/ft\xB3", "ng/kg", "ng/m\xB3", 
  "ng/lb", "ng/ft\xB3"];
CONTAM.Units.Strings2.Concentration_Surf =  // surface area concentration for DVR
  ["kg/m\xB2" , "g/m\xB2" , "mg/m\xB2" , "\xB5g/m\xB2" , "#/m\xB2", 
  "kg/cm\xB2", "g/cm\xB2", "mg/cm\xB2", "\xB5g/cm\xB2", "#/cm\xB2", 
  "lb/ft\xB2", "#/ft\xB2", "lb/in\xB2", "#/in\xB2" ];

CONTAM.Units.Strings2.Energy = ["W", "BTU"];
CONTAM.Units.Strings2.HeatGains = 
  ["W/m\xB2", "BTU/h/ft\xB2", "W/ft\xB2", "kJ/h·m\xB2"];
CONTAM.Units.Strings2.IntegratedConcen =
  ["kg s/m\xB3", "g s/m\xB3", "mg s/m\xB3", "\xB5g s/m\xB3", "# s/m\xB3"];
