
if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.CtrlLogFileReader = {};

CONTAM.CtrlLogFileReader.ReadLogFile = function(LogFileText)
{
  var rdr = CONTAM.Reader;

  rdr.Init(LogFileText);  
  
  var line1 = rdr.nextword(4);
  var tokens = line1.split("\t");
  
  var done = false;
  
  var concdata = [];
  var exposdata = [];
  var integralResult;
  var maxConcen = 0;
  var sumConcen = 0;
  var countConcen = 0;
  var averageConcen = 0;
  var finalConcen = 0;
  
  while(!done)
  {
    var lineX = rdr.nextword(3);
    if(lineX == null)
    {
      done = true;
      continue;
    }
    var tokensX = lineX.split("\t");
    if(tokensX.length < 6)
    {
      done = true;
      continue;
    }
    var time = tokensX[1];
    if(time==undefined)
      alert("no time");
    var timeTokens = time.split(":");
    
    var concen = parseFloat(tokensX[3])
    concdata.push([[parseInt(timeTokens[0]), parseInt(timeTokens[1]), parseInt(timeTokens[2])], concen]);
    exposdata.push([[parseInt(timeTokens[0]), parseInt(timeTokens[1]), parseInt(timeTokens[2])], parseFloat(tokensX[4]), parseFloat(tokensX[5])]);
    integralResult = parseFloat(tokensX[5]);
    finalConcen = parseFloat(tokensX[3]);
    if(concen > maxConcen)
      maxConcen = concen;
    countConcen++;
    sumConcen += concen;
  }
  averageConcen = sumConcen / countConcen;

  return {concendata: concdata, exposuredata: exposdata, integral: integralResult, 
    maxConcen: maxConcen, averageConcen: averageConcen, finalConcen: finalConcen};
}
