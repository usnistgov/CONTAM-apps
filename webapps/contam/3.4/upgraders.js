
CONTAM.Project.Upgraders = {};

/* same_line *****************************************************************/
/* read the next line from nxt and write it to uout */
CONTAM.Project.Upgraders.same_line = function()
{
  var buffer;

  buffer = CONTAM.Reader.nextword(4);
  return buffer + CONTAM.Project.EOL;
}

/***  same_data.c  ***********************************************************/

/*  Section of PRJ file data is unchanged.  */

CONTAM.Project.Upgraders.same_data = function()
{
  var buffer;  /* buffer for a character string */
  var fc = "";
  for(;;)
  {
    buffer = CONTAM.Reader.nextword(4);  // 4 = copy comment lines
    if("-999" == buffer.substring(0,4)) 
      break;
    fc += buffer + CONTAM.Project.EOL;
  }
  fc += CONTAM.Project.UNK + CONTAM.Project.EOL;
  return fc;
}  /* end same_data */

/***  skip_data.c  ***********************************************************/

/*  Skip through section of PRJ file data.  */

CONTAM.Project.Upgraders.skip_data = function()
{
  for(;;)
  {
    var buffer = CONTAM.Reader.nextword(3);
    if(buffer.length >= 4 && "-999" == buffer.substring(0, 4)) 
      break;
  }
}   /* end skip_data */
