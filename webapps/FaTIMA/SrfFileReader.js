
if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.SrfFileReader = {};

CONTAM.SrfFileReader.ReadSurfaceFile = function(SrfFileText)
{
  var rdr = CONTAM.Reader;

  rdr.Init(SrfFileText);

  var projectline = rdr.nextword(2);
  var descriptionline = rdr.nextword(3);
  var header1line = rdr.nextword(3);
  var top1line = rdr.nextword(3);
  var top2line = rdr.nextword(3);
  var top3line = rdr.nextword(3);
  var emptyline = rdr.nextword(3);
  var header2line = rdr.nextword(3);

  var done = false;
  var values = [];

  while(!done)
  {
    var date = rdr.nextword(1);
    var time = rdr.nextword(0);
    if(date == undefined || time == undefined)
    {
      done = true;
      continue;
    }
    var dvr3 = rdr.readR4(0);
    var dvr4 = rdr.readR4(0);
    var dvr5 = rdr.readR4(0);
    var timeTokens = time.split(":");
    
    // add a record with time, dvr3, dvr4, dvr5 and the total of the three
    values.push([[parseInt(timeTokens[0]), parseInt(timeTokens[1]), 
      parseInt(timeTokens[2])], parseFloat(dvr3) + parseFloat(dvr4) + parseFloat(dvr5),
      parseFloat(dvr3), parseFloat(dvr4), parseFloat(dvr5)]);
  }
  return {records: values};
  
}