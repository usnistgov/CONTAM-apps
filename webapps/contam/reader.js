// requires utils.js, TimeUtilities and DateUtilities 

if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.Reader = {};

CONTAM.Reader.Init = function (string)
{
  CONTAM.Reader.content = string;
  CONTAM.Reader.index = 0;
}

CONTAM.Reader.GetPosition = function()
{
  return CONTAM.Reader.index;
}

CONTAM.Reader.SetPosition = function(pos)
{
  CONTAM.Reader.index = pos;
}

CONTAM.Reader.Rewind = function()
{
  CONTAM.Reader.index = 0;
}

CONTAM.Reader.nextChar = function ()
{
  if(CONTAM.Reader.index >= CONTAM.Reader.content.length)
    return null;
  return CONTAM.Reader.content[CONTAM.Reader.index++];
}

CONTAM.Reader.backup = function ()
{
  CONTAM.Reader.index--;
}

CONTAM.Reader.nextline = function()
{
  var char = 0;
  var i = 0;
  var str = '';
  
  while(char !== '\n' && char !== '\r')
  {
    char = CONTAM.Reader.nextChar();
    if(char === null)
      return null;
    if(char == '\r')
    {
      char = CONTAM.Reader.nextChar(); // get the /n
      return str;
    }
    str += char;
    i++;
  }
  return str;
}

CONTAM.Reader.nextword = function(flag)
{
  var char = CONTAM.Reader.nextChar();
  var str = '';
  var done = 0;
  var i = 0;
  
  if(flag > 0)
  {
    if(char !== '\n')
    {
      if(flag === 2)
      {
        if(char !== ' ')
          CONTAM.Reader.backup();
        str = CONTAM.Reader.nextline();
      }
      else
        CONTAM.Reader.nextline();
    }
    if(flag > 1)
    {
      if(flag > 2)
      {
        str = CONTAM.Reader.nextline();
        if(str == null)
          return char;
        if(flag === 3)
        {
          while(str[0] == '!')
          {
            str = CONTAM.Reader.nextline();
            if(str == null)
              return char;
          }
        }
        if(flag > 4)
        {
          alert('invalid flag');
        }
      }
      CONTAM.Reader.backup();
      return str;      
    }
  }
  else
  {
    if(char !== ' ' && char !== ',' && char !== '\n' && char !== '\t')
      CONTAM.Reader.backup();
  }
  
  while(done === 0)
  {
    char = CONTAM.Reader.nextChar();
    if(char === null)
      return null;
    switch(char)
    {
      case ' ':
      case ',':
      case '\n':
      case '\r':
      case '\t':
      case '':
        break;
      case '!':
        CONTAM.Reader.nextline();
        break;
      case '*':
        return null;
      default:
        str += char;
        i++;
        done = 1;
        break;
    }
  }
  
  done = 0;
  while(done === 0)
  {
    char = CONTAM.Reader.nextChar();
    if(char === null)
      break;
    switch(char)
    {
      case '\n':
      case ' ':
      case ',':
      case '\t':
        done = 1;
        break;
      case '\r':
        break;
      default:
        str += char;
        i++;
        break;
    }
  }
  CONTAM.Reader.backup();
  return str;
}

CONTAM.Reader.skipData = function ()
{
  var buffer;

  for(;;)
  {
    buffer = CONTAM.Reader.nextword( 3 );
    if( buffer.substr(0,4) === "-999" ) 
      break;
  }
}

CONTAM.Reader.readIX = function (flag)
{
  var buffer = CONTAM.Reader.nextword(flag);
  return parseInt(buffer);
}  

CONTAM.Reader.readI2 = function (flag)
{
  var buffer = CONTAM.Reader.nextword(flag);
  return parseInt(buffer);
}  

CONTAM.Reader.readR4 = function (flag)
{
  var buffer = CONTAM.Reader.nextword(flag);
  return parseFloat(buffer);
}  

CONTAM.Reader.EOF = function()
{
  return CONTAM.Reader.index >= CONTAM.Reader.content.length;
}

CONTAM.Reader.readHMS = function (flag)
{
  var value;
  var buffer;

  buffer = CONTAM.Reader.nextword(flag);
  if( buffer[1] == ':' || buffer[2] == ':' )
  {
    value = CONTAM.TimeUtilities.StringTimeToIntTime( buffer );
  }
  else
  {
    value = parseInt(buffer);
    if( value < 0 || value > 86400 )
      alert( buffer + " is not a valid time" );
  }
  return value;
}  /* end readHMS */


CONTAM.Reader.readMD = function( flag )
{
  var value;
  var buffer;

  buffer = CONTAM.Reader.nextword(flag);
  if( CONTAM.Utils.IsLetter( buffer[2] ) )
  {
    value = CONTAM.DateUtilities.StringDateToIntDate( buffer );
    if( value == -1 )
      alert( buffer + " is not a valid date" );
  }
  else
  {
    value = parseInt(buffer);
    if( isNaN(value) )
      alert( buffer + " is not a valid date" );
    else if( value < 1 || value >365 )
      alert( buffer + " is not a valid date" );
  }

  return value;

}  /* end readMD */

CONTAM.Reader.readMDx = function(flag)
{
  var value;
  var buffer;

  buffer = CONTAM.Reader.nextword(flag);
  value = CONTAM.DateUtilities.StringDateXToIntDateX(buffer);
  if( value == -1 )
    alert(buffer + " is not a valid mm/dd date" );

  return value;

}  /* end readMDx */

