/*requires CONTAM reader*/

var ReadTMY2 = {};

ReadTMY2.WeatherRecords = [];
ReadTMY2.ErrorMessage = "";

ReadTMY2.ReadWeatherFile = function (WeatherFileContents) 
{
  var reader = CONTAM.Reader;
  ReadTMY2.WeatherRecords = [];
  reader.Init(WeatherFileContents);

  //skip the header
  var line1 = reader.nextword(2);

  var line;
  while (reader.EOF() == false)
  {
    line = reader.nextword(3);
    if(line.length < 77)
      break;
    var date = line.substring(3,5);
    date += "/";
    date += line.substring(5,7);
    var wr = {};
    wr.Date = CONTAM.DateUtilities.StringDateXToIntDateX(date);
    var time = line.substring(7,9);
    time += ":00:00";
    wr.Time = CONTAM.TimeUtilities.StringTimeToIntTime(time);
    wr.DryBulbTemperature = parseFloat(line.substring(67, 71)) / 10;
    wr.DewPointTemperature = parseFloat(line.substring(73, 77)) / 10;
    ReadTMY2.WeatherRecords.push(wr);
  }
  return false;

}
