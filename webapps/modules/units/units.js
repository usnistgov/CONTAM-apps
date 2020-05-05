//TODO: when private fields are supported use them

class UnitConverter {
    
    md = 1e-6;
    ed = 1000;
    dr = 1e-5;
    mw = 30;

    constructor() {
    }

    setMeanDiam(mDiam){
        if(mDiam >=0)
            this.md = mDiam;
    }

    setEffDens(eDens){
        if(setEffDens >=0)
            this.ed = eDens;
    }

    setDecayRate(decayRate){
        if(decayRate >=0)
            this.dr = decayRate;
    }

    setMolWt(molWt){
        if(molWt >=0)
           this.mw = molWt;
    }

    getUnitTypes()
    {
        return [
            "length", "time", "mass", "temperature", "pressure", "flow rate", "area", "volume", "speed", "per unit length", "per unit area", 
            "conss", "time const", "density", "duct leak", "moldif", "spec heat", "concen", "concen surf", "energy", "therm cond", "power", 
            "power area", "occ dens", "flow area", "vol flow area", "integrated conc", "none"
        ];
    }

    getUnits(unitType)
    {
        var unitTypes = new Map([
            ["length", [
                {displayString: "m", simpleString: "m"},
                {displayString: "ft", simpleString: "ft"},
                {displayString: "cm", simpleString: "cm"},
                {displayString: "in", simpleString: "in"},
                {displayString: "mm", simpleString: "mm"},
                {displayString: "dm", simpleString: "dm"},
                {displayString: "\xB5m", simpleString: "um"},
                {displayString: "nm", simpleString: "nm"},
                {displayString: "km", simpleString: "km"},
                {displayString: "NM", simpleString: "NM"},
                {displayString: "mi", simpleString: "mi"},
            ]],
            ["time", [
                {displayString: "s", simpleString: "s"},
                {displayString: "min", simpleString: "min"},
                {displayString: "h", simpleString: "h"},
                {displayString: "dy", simpleString: "dy"},
                {displayString: "yr", simpleString: "yr"},
            ]],
            ["mass", [
                {displayString: "kg", simpleString: "kg"},
                {displayString: "lb", simpleString: "lb"},
                {displayString: "g", simpleString: "g"},
                {displayString: "mg", simpleString: "mg"},
                {displayString: "\xB5g", simpleString: "ug"},
                {displayString: "ng", simpleString: "ng"},
                {displayString: "#", simpleString: "#"},
                {displayString: "pCi", simpleString: "pCi"},
                {displayString: "Bq", simpleString: "Bq"},
                {displayString: "m3", simpleString: "m3e"},
                {displayString: "ft3", simpleString: "ft3e"},
                {displayString: "L", simpleString: "Le"},
                {displayString: "\xB5L", simpleString: "uLe"},
            ]],
            ["temperature", [
                {displayString: "K", simpleString: "K"},
                {displayString: "R", simpleString: "R"},
                {displayString: "\xB0C", simpleString: "C"},
                {displayString: "\xB0F", simpleString: "F"},
            ]],
            ["pressure", [
                {displayString: "Pa", simpleString: "Pa"},
                {displayString: "in. H20", simpleString: "inH20"},
                {displayString: "kPa", simpleString: "kPa"},
                {displayString: "in. Hg", simpleString: "inHg"},
                {displayString: "atm", simpleString: "atm"},
                {displayString: "psi", simpleString: "psi"},
                {displayString: "mm. Hg", simpleString: "mmHg"},
            ]],
            ["flow rate", [
                {displayString: "kg/s", simpleString: "kg/s"},
                {displayString: "lb/s", simpleString: "lb/s"},
                {displayString: "g/s", simpleString: "g/s"},
                {displayString: "mg/s", simpleString: "mg/s"},
                {displayString: "\xB5g/s", simpleString: "ug/s"},
                {displayString: "ng/s", simpleString: "ng/s"},
                {displayString: "m\xB3/s", simpleString: "m3e/s"},
                {displayString: "L/s", simpleString: "Le/s"},
                {displayString: "mL/s", simpleString: "mLe/s"},
                {displayString: "\xB5L/s", simpleString: "uLe/s"},
                {displayString: "ft\xB3/s", simpleString: "ft3e/s"},
                {displayString: "#/s", simpleString: "#/s"},
                {displayString: "kg/min", simpleString: "kg/min"},
                {displayString: "lb/min", simpleString: "lb/min"},
                {displayString: "g/min", simpleString: "g/min"},
                {displayString: "mg/min", simpleString: "mg/min"},
                {displayString: "\xB5g/min", simpleString: "ug/min"},
                {displayString: "ng/min", simpleString: "ng/min"},
                {displayString: "m\xB3/min", simpleString: "m3e/min"},
                {displayString: "L/min", simpleString: "Le/min"},
                {displayString: "mL/min", simpleString: "mLe/min"},
                {displayString: "\xB5L/min", simpleString: "uLe/min"},
                {displayString: "ft\xB3/min", simpleString: "ft3e/min"},
                {displayString: "#/min", simpleString: "#/min"},
                {displayString: "kg/h", simpleString: "kg/h"},
                {displayString: "lb/h", simpleString: "lb/h"},
                {displayString: "g/h", simpleString: "g/h"},
                {displayString: "mg/h", simpleString: "mg/h"},
                {displayString: "\xB5g/h", simpleString: "ug/h"},
                {displayString: "ng/h", simpleString: "ng/h"},
                {displayString: "m\xB3/h", simpleString: "m3e/h"},
                {displayString: "L/h", simpleString: "Le/h"},
                {displayString: "mL/h", simpleString: "mLe/h"},
                {displayString: "\xB5L/h", simpleString: "uLe/h"},
                {displayString: "ft\xB3/h", simpleString: "ft3e/h"},
                {displayString: "#/h", simpleString: "#/h"},

            ]],
            ["area", [
                {displayString: "m\xB2", simpleString: "m2"},
                {displayString: "ft\xB2", simpleString: "ft2"},
                {displayString: "cm\xB2", simpleString: "cm2"},
                {displayString: "in\xB2", simpleString: "in2"},
                {displayString: "mm\xB2", simpleString: "mm2"},
                {displayString: "dm\xB2", simpleString: "dm2"},
                {displayString: "\xB5m\xB2", simpleString: "um2"},
            ]],
            ["volume", [
                {displayString: "m\xB3", simpleString: "m3"},
                {displayString: "ft\xB3", simpleString: "ft3"},
                {displayString: "cm\xB3", simpleString: "cm3"},
                {displayString: "in\xB3", simpleString: "in3"},
                {displayString: "mm\xB3", simpleString: "mm3"},
                {displayString: "dm\xB3", simpleString: "dm3"},
                {displayString: "\xB5m\xB3", simpleString: "um3"},
            ]],
            ["speed", [
                {displayString: "m/s", simpleString: "m/s"},
                {displayString: "fpm", simpleString: "ft/min"},
                {displayString: "cm/s", simpleString: "cm/s"},
                {displayString: "mph", simpleString: "mi/h"},
                {displayString: "m/h", simpleString: "m/h"},
                {displayString: "km/h", simpleString: "km/h"},
                {displayString: "knot", simpleString: "NM/h"},
            ]],
            ["per unit length", [
                {displayString: "m\xB2/m", simpleString: "m2/m"},
                {displayString: "in\xB2/ft", simpleString: "in2/ft"},
                {displayString: "cm\xB2/m", simpleString: "cm2/m"},
            ]],
            ["per unit area", [
                {displayString: "m\xB2/m\xB2", simpleString: "m2/m2"},
                {displayString: "in\xB2/ft\xB2", simpleString: "in2/ft2"},
                {displayString: "cm\xB2/m\xB2", simpleString: "cm2/m2"},
            ]],
            ["conss", [
                {displayString: "kg/s", simpleString: "kg/s"},
                {displayString: "lb/s", simpleString: "lb/s"},
                {displayString: "Bq/s", simpleString: "Bq/s"},
                {displayString: "pCi/s", simpleString: "pCi/s"},
                {displayString: "g/s", simpleString: "g/s"},
                {displayString: "mg/s", simpleString: "mg/s"},
                {displayString: "\xB5g/s", simpleString: "ug/s"},
                {displayString: "ng/s", simpleString: "ng/s"},
                {displayString: "m\xB3/s", simpleString: "m3e/s"},
                {displayString: "L/s", simpleString: "Le/s"},
                {displayString: "mL/s", simpleString: "mLe/s"},
                {displayString: "\xB5L/s", simpleString: "uLe/s"},
                {displayString: "kg/min", simpleString: "kg/min"},
                {displayString: "lb/min", simpleString: "lb/min"},
                {displayString: "Bq/min", simpleString: "Bq/min"},
                {displayString: "pCi/min", simpleString: "pCi/min"},
                {displayString: "g/min", simpleString: "g/min"},
                {displayString: "mg/min", simpleString: "mg/min"},
                {displayString: "\xB5g/min", simpleString: "ug/min"},
                {displayString: "ng/min", simpleString: "ng/min"},
                {displayString: "m\xB3/min", simpleString: "m3e/min"},
                {displayString: "L/min", simpleString: "Le/min"},
                {displayString: "mL/min", simpleString: "mLe/min"},
                {displayString: "\xB5L/min", simpleString: "uLe/min"},
                {displayString: "kg/h", simpleString: "kg/h"},
                {displayString: "lb/h", simpleString: "lb/h"},
                {displayString: "Bq/h", simpleString: "Bq/h"},
                {displayString: "pCi/h", simpleString: "pCi/h"},
                {displayString: "g/h", simpleString: "g/h"},
                {displayString: "mg/h", simpleString: "mg/h"},
                {displayString: "\xB5g/h", simpleString: "ug/h"},
                {displayString: "ng/h", simpleString: "ng/h"},
                {displayString: "m\xB3/h", simpleString: "m3e/h"},
                {displayString: "L/h", simpleString: "Le/h"},
                {displayString: "mL/h", simpleString: "mLe/h"},
                {displayString: "\xB5L/h", simpleString: "uLe/h"},
                {displayString: "#/s", simpleString: "#/s"},
                {displayString: "#/min", simpleString: "#/min"},
                {displayString: "#/h", simpleString: "#/h"},
            ]],
            ["time const", [
                {displayString: "1/s", simpleString: "1/s"},
                {displayString: "1/min", simpleString: "1/min"},
                {displayString: "1/h", simpleString: "1/h"},
                {displayString: "1/dy", simpleString: "1/dy"},
                {displayString: "1/yr", simpleString: "1/yr"},
            ]],
            ["density", [
                {displayString: "kg/m\xB3", simpleString: "kg/m3"},
                {displayString: "lb/ft\xB3", simpleString: "lb/ft3"},
                {displayString: "g/cm\xB3", simpleString: "g/cm3"},
            ]],
            ["duct leak", [
                {displayString: "L/s/m\xB2", simpleString: "L/s/m2"},
                {displayString: "cfm/100ft\xB2", simpleString: "ft3/min/100ft2"},
            ]],
            ["moldif", [
                {displayString: "m\xB2/s", simpleString: "m2/s"},
                {displayString: "ft\xB2/s", simpleString: "ft2/s"},
                {displayString: "cm\xB2/s", simpleString: "cm2/s"},
                {displayString: "ft\xB2/h", simpleString: "ft2/h"},
            ]],
            ["spec heat", [
                {displayString: "J/kg K", simpleString: "J/kg K"},
                {displayString: "Btu/lb F", simpleString: "Btu/lb R"},
                {displayString: "kJ/kg K", simpleString: "kJ/kg K"},
            ]],
            ["concen", [
                {displayString: "kg/kg", simpleString: "kg/kg"},
                {displayString: "ppm", simpleString: "mLe/m3s"},
                {displayString: "ppb", simpleString: "uLe/m3s"},
                {displayString: "Bq/kg", simpleString: "Bq/kg"},
                {displayString: "Bq/m\xB3", simpleString: "Bq/m3s"},
                {displayString: "pCi/lb", simpleString: "pCi/lb"},
                {displayString: "pCi/L", simpleString: "pCi/Ls"},
                {displayString: "kg/m\xB3", simpleString: "kg/m3s"},
                {displayString: "lb/lb", simpleString: "lb/lb"},
                {displayString: "lb/ft\xB3", simpleString: "lb/ft3s"},
                {displayString: "g/kg", simpleString: "g/kg"},
                {displayString: "g/m\xB3", simpleString: "g/m3s"},
                {displayString: "g/lb", simpleString: "g/lb"},
                {displayString: "g/ft\xB3", simpleString: "g/ft3s"},
                {displayString: "mg/kg", simpleString: "mg/kg"},
                {displayString: "mg/m\xB3", simpleString: "mg/m3s"},
                {displayString: "mg/lb", simpleString: "mg/lb"},
                {displayString: "mg/ft\xB3", simpleString: "mg/ft3s"},
                {displayString: "\xB5g/kg", simpleString: "ug/kg"},
                {displayString: "\xB5g/m\xB3", simpleString: "ug/m3s"},
                {displayString: "\xB5g/lb", simpleString: "ug/lb"},
                {displayString: "\xB5g/ft\xB3", simpleString: "ug/ft3s"},
                {displayString: "ng/kg", simpleString: "ng/kg"},
                {displayString: "ng/m\xB3", simpleString: "ng/m3s"},
                {displayString: "ng/lb", simpleString: "ng/lb"},
                {displayString: "ng/ft\xB3", simpleString: "ng/ft3s"},
                {displayString: "m\xB3/kg", simpleString: "m3e/kg"},
                {displayString: "m\xB3/m\xB3", simpleString: "m3e/m3s"},
                {displayString: "m\xB3/lb", simpleString: "m3e/lb"},
                {displayString: "m\xB3/ft\xB3", simpleString: "m3e/ft3s"},
                {displayString: "L/kg", simpleString: "Le/kg"},
                {displayString: "L/m\xB3", simpleString: "Le/m3s"},
                {displayString: "L/lb", simpleString: "Le/lb"},
                {displayString: "L/ft\xB3", simpleString: "Le/ft3s"},
                {displayString: "mL/kg", simpleString: "mLe/kg"},
                {displayString: "mL/m\xB3", simpleString: "mLe/m3s"},
                {displayString: "mL/lb", simpleString: "mLe/lb"},
                {displayString: "mL/ft\xB3", simpleString: "mLe/ft3s"},
                {displayString: "\xB5L/kg", simpleString: "uLe/kg"},
                {displayString: "\xB5L/m\xB3", simpleString: "uLe/m3s"},
                {displayString: "\xB5L/lb", simpleString: "uLe/lb"},
                {displayString: "\xB5L/ft\xB3", simpleString: "uLe/ft3s"},
                {displayString: "#/kg", simpleString: "#/kg"},
                {displayString: "#/m\xB3", simpleString: "#/m3s"},
                {displayString: "#/lb", simpleString: "#/lb"},
                {displayString: "#/ft\xB3", simpleString: "#/ft3s"},
                {displayString: "#/L", simpleString: "#/Ls"},
                {displayString: "#/cm\xB3", simpleString: "#/cm3s"},
            ]],
            ["concen surf", [
                {displayString: "kg/m\xB2", simpleString: "kg/m2"},
                {displayString: "g/m\xB2", simpleString: "g/m2"},
                {displayString: "mg/m\xB2", simpleString: "mg/m2"},
                {displayString: "\xB5g/m\xB2", simpleString: "ug/m2"},
                {displayString: "#/m\xB2", simpleString: "#/m2"},
                {displayString: "mg/cm\xB2", simpleString: "mg/cm2"},
                {displayString: "g/cm\xB2", simpleString: "g/cm2"},
                {displayString: "mg/cm\xB2", simpleString: "mg/cm2"},
                {displayString: "\xB5g/cm\xB2", simpleString: "ug/cm2"},
                {displayString: "#/cm\xB2", simpleString: "#/cm2"},
                {displayString: "lb/ft\xB2", simpleString: "lb/ft2"},
                {displayString: "#/ft\xB2", simpleString: "#/ft2"},
                {displayString: "lb/in\xB2", simpleString: "lb/in2"},
                {displayString: "#/in\xB2", simpleString: "#/in2"},
            ]],
            ["energy", [
                {displayString: "J", simpleString: "J"},
                {displayString: "Btu", simpleString: "Btu"},
                {displayString: "kJ", simpleString: "kJ"},
            ]],
            ["therm cond", [
                {displayString: "W/m\xB2 K", simpleString: "J/s m2 K"},
                {displayString: "kJ/h m\xB2 K", simpleString: "kJ/h m2 K"},
                {displayString: "Btu/h ft\xB2 F", simpleString: "Btu/h ft2 R"},
                {displayString: "Btu/h in\xB2 F", simpleString: "Btu/h in2 R"},
            ]],
            ["power", [
                {displayString: "W", simpleString: "J/s"},
                {displayString: "kW", simpleString: "kJ/s"},
                {displayString: "kJ/h", simpleString: "kJ/h"},
                {displayString: "Btu/h", simpleString: "Btu/h"},
            ]],
            ["power area", [
                {displayString: "W/m\xB2", simpleString: "J/s m2"},
                {displayString: "Btu/h/ft\xB2", simpleString: "Btu/h ft2"},
                {displayString: "W/ft\xB2", simpleString: "J/s ft2"},
                {displayString: "kJ/h m\xB2", simpleString: "kJ/h m2"},
            ]],
            ["occ dens", [
                {displayString: "#/m\xB2", simpleString: "#/m2"},
                {displayString: "#/ft\xB2", simpleString: "#/ft2"},
                {displayString: "#/100m\xB2", simpleString: "#/100m2"},
                {displayString: "#/1000ft\xB2", simpleString: "#/1000ft2"},
            ]],
            ["flow area", [
                {displayString: "kg/s m\xB2", simpleString: "kg/s m2"},
                {displayString: "scfm/ft\xB2", simpleString: "ft3s/min ft2"},
                {displayString: "sL/s m\xB2", simpleString: "Ls/s m2"},
                {displayString: "sm\xB3/s m\xB2", simpleString: "m3s/s m2"},
                {displayString: "sm\xB3/h m\xB2", simpleString: "m3s/h m2"},
                {displayString: "lb/s ft\xB2", simpleString: "lb/s ft2"},
                {displayString: "sft\xB3/h ft\xB2", simpleString: "ft3s/h ft2"},
                {displayString: "sL/min m\xB2", simpleString: "Ls/min m2"},
                {displayString: "kg/h m\xB2", simpleString: "kg/h m2"},
            ]],
            ["vol flow area", [
                {displayString: "m\xB3/s m\xB2", simpleString: "m3s/s m2"},
                {displayString: "cfm/ft\xB2", simpleString: "ft3s/min ft2"},
                {displayString: "L/s m\xB2", simpleString: "Ls/s m2"},
                {displayString: "L/min m\xB2", simpleString: "Ls/min m2"},
                {displayString: "m\xB3/h m\xB2", simpleString: "m3s/h m2"},
                {displayString: "ft\xB3/h ft\xB2", simpleString: "ft3s/h ft2"},
            ]],
            ["integrated conc", [
                {displayString: "kg s/m\xB3", simpleString: "kg s/m3"},
                {displayString: "mg s/m\xB3", simpleString: "mg s/m3"},
                {displayString: "\xB5g s/m\xB3", simpleString: "ug s/m3"},
                {displayString: "# s/m\xB3", simpleString: "# s/m3"},
                {displayString: "mg s/L", simpleString: "mg s/L"},
                {displayString: "\xB5g s/L", simpleString: "ug s/L"},
                {displayString: "# s/L", simpleString: "# s/L"},
                {displayString: "mg min/m\xB3", simpleString: "mg min/m3"},
                {displayString: "\xB5g min/m\xB3", simpleString: "ug min/m3"},
                {displayString: "mg min/L", simpleString: "mg min/L"},
                {displayString: "\xB5g min/L", simpleString: "ug min/L"},
                {displayString: "# min/L", simpleString: "# min/L"},
                {displayString: "kg h/L", simpleString: "kg h/L"},
                {displayString: "g h/L", simpleString: "g h/L"},
                {displayString: "# h/L", simpleString: "# h/L"},
                {displayString: "kg h/cm\xB3", simpleString: "kg h/cm3"},
                {displayString: "g h/cm\xB3", simpleString: "g h/cm3"},
                {displayString: "# h/cm\xB3", simpleString: "# h/cm3"},
                {displayString: "lb h/ft\xB3", simpleString: "lb h/ft3"},
                {displayString: "# h/ft\xB3", simpleString: "# h/ft3"},
                {displayString: "lb min/ft\xB3", simpleString: "lb min/ft3"},
                {displayString: "# min/ft\xB3", simpleString: "# min/ft3"},
                {displayString: "lb h/in\xB3", simpleString: "lb h/in3"},
                {displayString: "# h/in\xB3", simpleString: "# h/in3"},
                {displayString: "lb min/in\xB3", simpleString: "lb min/in3"},
                {displayString: "# min/in\xB3", simpleString: "# min/in3"},
            ]],
            ["none", []],
            
        ]);
        return unitTypes.get(unitType);
    }

//\xB5 - micro
//\xB0 - degrees
//\xB3 - cubed
//\xB2 - squared 

    convertUnitToken(fromToken, toToken)
    {

        if(fromToken == toToken)
            return [value => value];

        var volumeConversions = new Map([
            ["m3 ft3", value => value * 35.3146667],
            ["m3 cm3", value => value * 1e6],
            ["m3 in3", value => value * 61023.7440576],
            ["m3 mm3", value => value * 1e9],
            ["m3 dm3", value => value * 1e3],
            ["m3 L", value => value * 1e3],
            ["m3 um3", value => value * 1e18],
            ["ft3 m3", value => value / 35.3146667],
            ["cm3 m3", value => value / 1e6],
            ["in3 m3", value => value / 61023.7440576],
            ["mm3 m3", value => value / 1e9],
            ["dm3 m3", value => value / 1e3],
            ["L m3", value => value / 1e3],
            ["um3 m3", value => value / 1e18]
        ]);
        volumeConversions.baseUnit = "m3";

        var areaConversions = new Map([
            ["m2 ft2", value => value * 10.764],
            ["m2 cm2", value => value * 10000],
            ["m2 in2", value => value * 1550],
            ["m2 mm2", value => value * 1e6],
            ["m2 dm2", value => value * 100],
            ["m2 um2", value => value * 1e12],
            ["m2 100ft2", value => value * 10.764 / 100],
            ["m2 100m2", value => value / 100],
            ["m2 1000ft2", value => value * 10.764 / 1000],
            ["ft2 m2", value => value / 10.764],
            ["cm2 m2", value => value / 10000],
            ["in2 m2", value => value / 1550],
            ["mm2 m2", value => value / 1e6],
            ["dm2 m2", value => value / 100],
            ["um2 m2", value => value / 1e12],
            ["100ft2 m2", value => value * 100 / 10.764],
            ["100m2 m2", value => value * 100],
            ["1000ft2 m2", value => value * 1000 / 10.764],
        ]);
        areaConversions.baseUnit = "m2";

        var lengthConversions = new Map([
            ["m ft", value => value / 0.3048],
            ["m cm", value => value * 100],
            ["m in", value => value / 0.3048 * 12],
            ["m mm", value => value * 1000],
            ["m dm", value => value * 10],
            ["m um", value => value * 1e6],
            ["m nm", value => value * 1e9],
            ["m km", value => value / 1000],
            ["m NM", value => value / 1852],
            ["m mi", value => value / 1609.344],
            ["ft m", value => value * 0.3048],
            ["cm m", value => value / 100],
            ["in m", value => value / 12 * 0.3048],
            ["mm m", value => value / 1000],
            ["dm m", value => value / 10],
            ["um m", value => value / 1e6],
            ["nm m", value => value / 1e9],
            ["km m", value => value * 1000],
            ["NM m", value => value * 1852],
            ["mi m", value => value * 1609.344],
        ]);
        lengthConversions.baseUnit = "m";

        var temperatureConversions = new Map([
            ["K R", value => value * 1.8],
            ["K C", value => value - 273.15],
            ["K F", value => (value - 273.15) * 1.8 + 32],
            ["R K", value => value / 1.8],
            ["C K", value => value + 273.15],
            ["F K", value => (value - 32) / 1.8 + 273.15]
        ]);
        temperatureConversions.baseUnit = "K";
        
        var timeConversions = new Map([
            ["s min", value => value / 60],
            ["s h", value => value / 3600],
            ["s dy", value => value / 86400],
            ["s yr", value => value / 31556926],
            ["min s", value => value * 60],
            ["h s", value => value * 3600],
            ["dy s", value => value * 86400],
            ["yr s", value => value * 31556926]
        ]);
        timeConversions.baseUnit = "s";

        var pressureConversions = new Map([
            ["Pa inH20", value => value / 248.84],
            ["Pa kPa", value => value / 1000],
            ["Pa inHg", value => value / 3386.42],
            ["Pa atm", value => value / 101325],
            ["Pa psi", value => value / 6894.757],
            ["Pa mmHg", value => value / 133.331],
            ["inH20 Pa", value => value * 248.84],
            ["kPa Pa", value => value * 1000],
            ["inHg Pa", value => value * 3386.42],
            ["atm Pa", value => value * 101325],
            ["psi Pa", value => value * 6894.757],
            ["mmHg Pa", value => value * 133.331]
        ]);
        pressureConversions.baseUnit = "Pa";
        
        var massConversions = new Map([
            ["kg lb", value => value / 0.45359237],
            ["kg g", value => value / 0.001],
            ["kg mg", value => value / 1e-6],
            ["kg ug", value => value / 1e-9],
            ["kg ng", value => value / 1e-12],
            ["kg #", value => value / (0.16666667 * Math.PI * this.md * this.md * this.md * this.ed)],
            ["kg pCi", value => (value / 0.037) * (1000 * 6.023E+23 * this.dr) / this.mw],
            ["kg Bq", value => value * 1000 * 6.023E+23 * this.dr / this.mw],
            ["kg m3e", value => value * 24.05 / this.mw],
            ["kg ft3e", value => value * 24.05 * 35.3146 / this.mw],
            ["kg Le", value => value * 1000 * 24.05 / this.mw],
            ["kg mLe", value => value * 1000 * 24.05 / this.mw * 1000],
            ["kg uLe", value => value * 1000 * 24.05 / this.mw * 1e6],
            ["kg m3s", value => value / 1.20410],
            ["kg cm3s", value => value / 1.20410 * 1e6],
            ["kg ft3s", value => value / 1.20410 * 35.3146],
            ["kg Ls", value => value * 1000 / 1.20410],
            ["kg mLs", value => value * 1000 / 1.20410 * 1000],
            ["kg uLs", value => value * 1000 / 1.20410 * 1e6],
            ["lb kg", value => value * 0.45359237],
            ["g kg", value => value * 0.001],
            ["mg kg", value => value * 1e-6],
            ["ug kg", value => value * 1e-9],
            ["ng kg", value => value * 1e-12],
            ["# kg", value => value * (0.16666667 * Math.PI * this.md * this.md * this.md * this.ed)],
            ["pCi kg", value => (value * 0.037) * this.mw / (1000 * 6.023E+23 * this.dr)],
            ["Bq kg", value => value * this.mw / (1000 * 6.023E+23 * this.dr)],
            ["m3e kg", value => value * this.mw / 24.05],
            ["ft3e kg", value => value * this.mw / 35.3146 / 24.05],
            ["Le kg", value => value * this.mw / 1000 / 24.05],
            ["mLe kg", value => value / 1000 * this.mw / 1000 / 24.05],
            ["uLe kg", value => value / 1e6 * this.mw / 1000 / 24.05],
            ["m3s kg", value => value * 1.20410],
            ["cm3s kg", value => value / 1e6 * 1.20410],
            ["ft3s kg", value => value / 35.3146 * 1.20410],
            ["Ls kg", value => value * 1.20410 / 1000],
            ["mLs kg", value => value / 1000 * 1.20410 / 1000],
            ["uLs kg", value => value / 1e6 * 1.20410 / 1000],
        ]);
        massConversions.baseUnit = "kg";

        var energyConversions = new Map([
            ["J Btu", value => value / 1055.056 ], ["J kJ", value => value / 1000], ["Btu J", value => value * 1055.056], ["kJ J", value => value * 1000],
        ]);
        energyConversions.baseUnit = "J";

        var groups = new Map([
            ["m3",volumeConversions], ["ft3",volumeConversions], ["cm3",volumeConversions], ["in3",volumeConversions], ["mm3",volumeConversions],
            ["dm3",volumeConversions], ["L",volumeConversions], ["um3",volumeConversions], ["m2", areaConversions], ["ft2", areaConversions],
            ["cm2", areaConversions], ["in2", areaConversions], ["mm2", areaConversions], ["dm2", areaConversions], ["um2", areaConversions],
            ["100ft2", areaConversions], ["100m2", areaConversions], ["1000ft2", areaConversions], ["m", lengthConversions], ["ft", lengthConversions],
            ["cm", lengthConversions], ["in", lengthConversions], ["mm", lengthConversions], ["dm", lengthConversions], ["um", lengthConversions],
            ["nm", lengthConversions], ["km", lengthConversions], ["NM", lengthConversions], ["mi", lengthConversions], ["K", temperatureConversions],
            ["R", temperatureConversions], ["C", temperatureConversions], ["F", temperatureConversions],  ["s", timeConversions],  ["min", timeConversions],
            ["h", timeConversions], ["dy", timeConversions], ["yr", timeConversions], ["Pa", pressureConversions], ["inH20", pressureConversions],
            ["kPa", pressureConversions], ["inHg", pressureConversions], ["atm", pressureConversions], ["psi", pressureConversions],
            ["mmHg", pressureConversions], ["kg", massConversions], ["lb", massConversions], ["g", massConversions], ["mg", massConversions],
            ["ug", massConversions], ["ng", massConversions], ["#", massConversions], ["pCi", massConversions], ["Bq", massConversions],
            ["m3e", massConversions], ["ft3e", massConversions], ["Le", massConversions], ["mLe", massConversions], ["uLe", massConversions],
            ["m3s", massConversions], ["cm3s", massConversions], ["ft3s", massConversions], ["Ls", massConversions], ["mLs", massConversions],
            ["uLs", massConversions], ["J", energyConversions], ["Btu", energyConversions], ["kJ", energyConversions],
        ]);
        var conversionArray = [];
        var conversions;

        conversions = groups.get(fromToken);
        if(!conversions)
            throw "unsupported unit found: " + fromToken;
        let conversion = conversions.get(fromToken + " " + toToken);
        if(conversion){
            conversionArray.push(conversion);
        }else{
            // e.g. if asked for (ft to in) return both (ft to m) and (m to in)
            let conv1 = conversions.get(fromToken + " " + conversions.baseUnit);
            if(!conv1)
                throw "unsupported unit found: " + fromToken;
            conversionArray.push(conv1);

            let conv2 = conversions.get(conversions.baseUnit + " " + toToken);
            if(!conv2)
                throw "unsupported unit found: " + toToken;
            conversionArray.push(conv2);
        }
        return conversionArray;
    }

    unitConvertLevel(fromUnits, toUnits)
    {
        var fromTokens = fromUnits.split(" ");
        var toTokens = toUnits.split(" ");
        var conversionFuncArray = [];

        if(fromTokens.length != toTokens.length)
            throw "Number of unit tokens do not match."; 

        for(let i=0; i<fromTokens.length; ++i)
        {
            conversionFuncArray = conversionFuncArray.concat(this.convertUnitToken(fromTokens[i], toTokens[i]));
        }

        return conversionFuncArray;
    }

    unitConvert(value, fromUnits, toUnits)
    {
        var fromLevels = fromUnits.split("/");
        var toLevels = toUnits.split("/");
        var conversions = [];

        if(fromLevels.length != toLevels.length)
            throw "Number of unit levels do not match. from(" + fromUnits + ") to(" + toUnits + ")" ; 

        var newValue = value;
        for(let l=0; l<fromLevels.length; ++l)
        {
            if(l==0)
                conversions = this.unitConvertLevel(fromLevels[l], toLevels[l]);
            else
                conversions = this.unitConvertLevel(toLevels[l], fromLevels[l]);
            for(let i=0; i<conversions.length; ++i)
            {
                newValue = conversions[i](newValue);
            }
        }
        return newValue;
    }
}

export { UnitConverter };