/*requires CONTAM reader*/

var ReadTMY3 = {};

ReadTMY3.WeatherRecords = [];
ReadTMY3.ErrorMessage = "";

ReadTMY3.ReadWeatherFile = function (WeatherFileContents) 
{
  var reader = CONTAM.Reader;
  ReadTMY3.WeatherRecords = [];
  reader.Init(WeatherFileContents);

  //skip the header
  var line1 = reader.nextword(2);
  //skip the column headings
  var line2 = reader.nextword(3);

  while (reader.EOF() == false)
  {
    var line = reader.nextword(3);
    var items = line.split(',');
    if(items.length < 35)
      return false;
    var fulldate = items[0];
    var date = fulldate.substring(0, 5);
    var wr = {};
    wr.Date = CONTAM.DateUtilities.StringDateXToIntDateX(date);
    var time = items[1];
    time = time + ":00";
    wr.Time = CONTAM.TimeUtilities.StringTimeToIntTime(time);
    wr.DryBulbTemperature = parseFloat(items[31]);
    wr.DewPointTemperature = parseFloat(items[34]);
    ReadTMY3.WeatherRecords.push(wr);
  }
  return false;

}
