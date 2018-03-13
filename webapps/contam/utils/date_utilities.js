if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.DateUtilities = {};

CONTAM.DateUtilities.StringDateXToIntDateX = function (Date)
{
  var c, day = 0, month = 0;
  var lom =     /* length of month - no leap year */
  [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  var som = /* start of month - 1 (day-of-year) */
  [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];


  c = Date.indexOf("/");
  month = parseInt(Date.substring(0, c));
  day = parseInt(Date.substring(c + 1, Date.length));

  if (month < 1 || month > 12 || day < 1 || day > lom[month - 1])
  {
    alert("Invalid date string given: " + Date);
    return -1;
  }
  return som[month - 1] + day;
}

CONTAM.DateUtilities.IntDateXToStringDateX = function(Date)
{
  var stringDate;
  var month, day_of_month = 0;
  var som = 
      [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

  for (month = 1; month < 12; month++)
  {
    if (som[month] >= Date) break;
  }
  day_of_month = Date - som[month - 1];

  stringDate = month.toString() + "/" + day_of_month.toString();

  return stringDate;
}


CONTAM.DateUtilities.IntDateToStringDate = function (intDate)
{
  var date;  /* string long enough for a date */
  var month, day_of_month;
  var months = 
  [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" 
  ];
  var som =  /* start of month - 1 (day-of-year) */
      [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

  for (month = 1; month < 12; month++)
  {
    if (som[month] >= intDate) break;
  }
  month -= 1;
  day_of_month = intDate - som[month];

  date = months[month];
  if (day_of_month < 10)
    date += "0";
  date += day_of_month.toString();

  return date;
}

CONTAM.DateUtilities.StringDateToIntDate = function (DateString)
{
  var DateNumber = 1;
  var i = 0, j = 0, k, day = 0;
  var mon = "";
  var months = 
  [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" 
  ];
  var som =     /* start of month - 1 (day-of-year) */
      [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];
  var lom =     /* length of month - no leap year */
      [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  for (k = 0; k < DateString.length; k++)  /* split string into day and month string */
  {
    if (CONTAM.Utils.IsLetter(DateString[k]))   /* add character to month */
    {
      if (j > 0)
        mon += DateString[j++].toLowerCase();
      else
        mon += DateString[j++].toUpperCase();
      if (j > 3)
      {
        return -1;
      }
    }
    else if (CONTAM.Utils.IsNumber(DateString[k]))  /* add digit to day */
    {
      if (++i > 2)
      {
        return -1;
      }
      day = 10 * day + parseInt(DateString[k]);
    }
    else if (DateString[j] != ' ')    /* skip blanks */
    {
      return -1;
    }
  }

  for (i = 0; i < 12; i++)
    if (mon == months[i]) break;
  if (i == 12 || day < 1 || day > lom[i])
  {
    return -1;
  }
  else
  {
    DateNumber = som[i] + day;
    return DateNumber;
  }

}

//find if a date is inside of a date range
//date - the date in question
//date0 - the start of the date range
//date1 - the end of the date range
CONTAM.DateUtilities.IsDateInRange = function(date, date0, date1)
{
  if(date1 >= date0)
    return date >= date0 && date <= date1;
  else
    return date >= date0 || date <= date1;
}

//find if a date is inside of a date range
//date - the date in question
//time - the time in question
//date0 - the start date of the range
//date1 - the end date of the range
//time0 - the start time of the range
//time1 - the end time of the range
CONTAM.DateUtilities.IsDateTimeInRange = function(date, time, date0, date1, time0, time1)
{
  if(!CONTAM.DateUtilities.IsDateInRange(date, date0, date1))
    return false;

  if(date == date0)
  {
    if(time < time0)
      return false;
  }
  if(date == date1)
  {
    if(time > time1)
      return false;
  }
  return true;
}

CONTAM.DateUtilities.Months = 
["January", "February", "March", "April", "May", "June", "July", 
"August", "September", "October", "November", "December"];

