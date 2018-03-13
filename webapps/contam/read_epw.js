/*requires CONTAM reader*/

var ReadEPW = {};

ReadEPW.WeatherRecords = [];
ReadEPW.ErrorMessage = "";
ReadEPW.ReadWeatherFile = function (WeatherFileContents) 
{
  var reader = CONTAM.Reader;
  ReadEPW.WeatherRecords = [];
  
  reader.Init(WeatherFileContents);
  //skip most of the header
  for(var i=0;i<7;++i)
  {
    var templine = reader.nextline(1024);
  }
  
  var line = reader.nextline(1024);
  var items = line.split(",");
  
  // RecordsPerHour
  if (items[1] != 1)
  {
    ErrorMessage = "The EPW file does not have hourly data.";
    return true;
  }
  
  //start/end dates 
  //remove spaces
  var startDate = items[5].trim();
  var endDate = items[6].trim();

  var spaceIndex = startDate.indexOf(' ');
  while (spaceIndex >= 0)
  {
    startDate = startDate.replace(" ", "");
    spaceIndex = startDate.indexOf(' ');
  }
  spaceIndex = endDate.indexOf(' ');
  while (spaceIndex >= 0)
  {
    endDate = endDate.replace(" ", "");
    spaceIndex = endDate.IndexOf(' ');
  }

  if (startDate != "1/1" || endDate != "12/31")
  {
    ErrorMessage = "The EPW file does not start and end at the new year.";
    return true;
  }

  while (!reader.EOF())
  {
    items = reader.nextline(1024).split(',');
    var date = items[1] + "/" + items[2];
    var WeatherRecord = {};
    WeatherRecord.Date = CONTAM.DateUtilities.StringDateXToIntDateX(date);
    var time = "";
    if (items[3].length < 2)
        time = "0";
    time = time + items[3];
    time = time + ":00:00";
    WeatherRecord.Time = CONTAM.TimeUtilities.StringTimeToIntTime(time);
    WeatherRecord.DryBulbTemperature = parseFloat(items[6]);
    WeatherRecord.DewPointTemperature = parseFloat(items[7]);
    ReadEPW.WeatherRecords.push(WeatherRecord);
  }
  return false;
}
