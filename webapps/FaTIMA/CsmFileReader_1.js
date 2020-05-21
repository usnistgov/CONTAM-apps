
if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.CsmFileReader = {};

// this assumes only one contaminant in the filter and filter loading sections
CONTAM.CsmFileReader.ReadCSMFile = function(CsmFileText)
{
  var i, j;
  var rdr = CONTAM.Reader;
  
  var burstMassAdded = 0;
  var continuousMassAdded = 0;
  var floorMassStored = 0;
  var wallsMassStored = 0;
  var ceilingMassStored = 0;
  var otherMassStored = 0;
  var recFiltMassSto = 0;
  var oaFiltMassSto = 0;
  var acFiltMassSto = 0;
  var ctm_exfil = 0;
  var ctm_entered = 0;
  var massDeactivated = 0;
  var penetrationPath5 = 0;
  var penetrationPath3 = 0;
  rdr.Init(CsmFileText);  
  
  rdr.nextword(4); // line 1
  var nctm = rdr.readIX(1);
  rdr.nextword(3); // header line
  for(i=0;i<nctm;++i)
  {
    var ctmName = rdr.nextword(1);
    var ctmEffDens = rdr.readR4(0);
    var ctmMDiam = rdr.readR4(0);
  }
  rdr.nextword(3); // blank line
  rdr.nextword(3); // ctm summary
  var ncss = rdr.nextword(1); 
  rdr.nextword(3); // header line
  
  for(i=0;i<ncss;++i)
  {
    var cssNum = rdr.readIX(1);
    var cssType = rdr.nextword(0);
    var cssSpcs = rdr.nextword(0);
    var cssZoneNr = rdr.readIX(0);
    var cssAs = rdr.readR4(0);
    var cssMult = rdr.readR4(0);
    var cssXMin = rdr.readR4(0);
    var cssXMax = rdr.readR4(0);
    var cssYMin = rdr.readR4(0);
    var cssYMax = rdr.readR4(0);
    var cssZMin = rdr.readR4(0);
    var cssZMax = rdr.readR4(0);
    var cssRel = rdr.readR4(0);
    if(i==0)
      burstMassAdded = cssRel;
    if(i==1)
      continuousMassAdded = cssRel;
    var cssRem = rdr.readR4(0);
    var cssSto = rdr.readR4(0);
    if(i==3)
      floorMassStored = cssSto
    if(i==4)
      wallsMassStored = cssSto
    if(i==5)
      ceilingMassStored = cssSto
    if(i==6)
      otherMassStored = cssSto
    if(i==2)
      massDeactivated = cssRem
  }

  rdr.nextword(3); // blank line
  rdr.nextword(3); // filter summary
  var nfilt = rdr.nextword(1); 
  rdr.nextword(3); // header line
  for(i=0;i<nfilt;++i)
  {
    var filtPath = rdr.nextword(0);
    var filtCtm1 = rdr.readR4(0);
    var filtEl1 = rdr.nextword(0);
    var filtDashDash = rdr.nextword(0);
    var filtCtm2 = rdr.readR4(0);
    var filtEl2 = rdr.nextword(0);
  }
  
  rdr.nextword(3); // blank line
  rdr.nextword(3); // filter loading summary
  var nfiltLoad = rdr.nextword(1); 
  rdr.nextword(3); // header line
  for(i=0;i<nfiltLoad;++i)
  {
    var filtPath = rdr.nextword(0);
    var filtCtm1 = rdr.readR4(0);
    if(i==2)
      penetrationPath3 = filtCtm1
    if(i==3)
      penetrationPath5 = filtCtm1
    if(i==4)
      recFiltMassSto = filtCtm1
    if(i==5)
      oaFiltMassSto = filtCtm1
    if(i==6)
      acFiltMassSto = filtCtm1
    var filtEl = rdr.nextword(0);
    var filtns = rdr.nextword(0);
  }

  rdr.nextword(3); // blank line
  rdr.nextword(3); // filter breakthrough summary
  var nfilt_bt = rdr.nextword(1); 
  rdr.nextword(3); // header line
  rdr.nextword(3); // header line
  //nfilt_bt assumed to be zero
  //for(i=0;i<nfilt_bt;++i)
  //{
  //}
  rdr.nextword(3); // blank line
  rdr.nextword(3); // interactions with ambient
  rdr.nextword(3); // header line
  for(i=0;i<nctm;++i)
  {
    var ctm_name = rdr.nextword(0);
    ctm_entered = rdr.readR4(0);
    ctm_exfil = rdr.readR4(0);
  }

  return {
  'burstMassAdded' : burstMassAdded,
  'continuousMassAdded' : continuousMassAdded,
  'floorMassStored' : floorMassStored,
  'wallsMassStored' : wallsMassStored,
  'ceilingMassStored' : ceilingMassStored,
  'otherMassStored' : otherMassStored,
  'recFiltMassSto' : recFiltMassSto,
  'oaFiltMassSto' : oaFiltMassSto,
  'acFiltMassSto' : acFiltMassSto,
  'ctm_exfil': ctm_exfil,
  'ctm_entered': ctm_entered,
  'massDeactivated': massDeactivated,
  'penetrationPath5': penetrationPath5,
  'penetrationPath3': penetrationPath3,
  };
}