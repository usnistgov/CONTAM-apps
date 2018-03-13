if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.TimeUtilities = {};

CONTAM.TimeUtilities.StringTimeToIntTime = function (value)
{
  var Hours;
  var Minutes;
  var Seconds;
  
  if(typeof value != "string")
    return -1;
  
  if(value.length != 8)
    return -1;
  
  Hours = parseInt(value.substring(0, 2));
  if(isNaN(Hours))
    return -1;
  Minutes = parseInt(value.substring(3, 5));
  if(isNaN(Minutes))
    return -1;
  Seconds = parseInt(value.substring(6, 8));
  if(isNaN(Seconds))
    return -1;
  var intTime = (Hours * 60 + Minutes) * 60 + Seconds;
  if(intTime > 86400)
    return -1;
  else
    return intTime;
}

CONTAM.TimeUtilities.HourString = function (Time)
{
  var hours;
  var numHours;

  numHours = Time / 3600;
  if (numHours < 10)
    hours = "0" + numHours.toString();
  else
    hours = numHours.toString();
  return hours;
}

CONTAM.TimeUtilities.IntTimeToStringTime = function(time)
{
  var strHours, strMinutes, strSeconds;
  var intHours, intMinutes, intSeconds;

  intMinutes = Math.floor(time / 60);
  intSeconds = time % 60;
  intHours = Math.floor(intMinutes / 60);
  intMinutes = intMinutes % 60;
  if (intHours < 10)
      strHours = "0" + intHours.toString();
  else
      strHours = intHours.toString();
  if (intSeconds < 10)
      strSeconds = "0" + intSeconds.toString();
  else
      strSeconds = intSeconds.toString();
  if (intMinutes < 10)
      strMinutes = "0" + intMinutes.toString();
  else
      strMinutes = intMinutes.toString();
  return strHours + ":" + strMinutes + ":" + strSeconds;
}



