//These are functions that the nano tool will inject into the contam worker
// so that they can be called by the tool

// change the filter element of the path number given to the 
// element with the given name
// pathNumber - this is the number of the path to alter
// filterElementName - this is the name of the filter element to use for the path
CONTAM.setPathFilterElement = function(pathNumber, filterElementName)
{
  var path = CONTAM.Project.PathList[pathNumber];
  if(path == undefined)
    return "path not found, number: " + pathNumber;
  
  var filterElement = CONTAM.Project.Flte0.GetByName(filterElementName);
  if(filterElement == undefined)
    return "filter element not found, name: " + filterElementName;
    
  path.pf.pe = filterElement;
  console.log("Path " + path.nr + ": filter element changed to: " + 
    path.pf.pe.name);
  return "ok";
}

//edit the occupant day schedule based on the exposure times given
//the times are assumed to be already checked for correctness
CONTAM.SetOccDaySchedule = function(startTime, endTime, isIntemitent, interval, duration)
{
  var time = [];
  var zone = [];
  var X = [];
  var Y = [];
  var relHt = [];
  
  console.log("SetOccDaySchedule: ", JSON.parse(JSON.stringify(arguments)));
  if(isIntemitent)
  {
    if(startTime == 0)
    {
      time.push(0);
      zone.push(CONTAM.Project.ZoneList[1]);
      X.push(0);
      Y.push(0);
      relHt.push(0);
    }
    else
    {
      time.push(0);
      zone.push(0);
      X.push(0);
      Y.push(0);
      relHt.push(0);
      time.push(startTime);
      zone.push(CONTAM.Project.ZoneList[1]);
      X.push(0);
      Y.push(0);
      relHt.push(0);
    }
    var currentTime = startTime
    do
    {
      time.push(currentTime + duration);
      zone.push(0);
      X.push(0);
      Y.push(0);
      relHt.push(0);
      currentTime += interval;
      if(currentTime < endTime)
      {
        time.push(currentTime);
        zone.push(CONTAM.Project.ZoneList[1]);
        X.push(0);
        Y.push(0);
        relHt.push(0);
        }
    }
    while(currentTime < endTime)
    if(endTime == 86400)
    {
      time.push(86400);
      zone.push(0);
      X.push(0);
      Y.push(0);
      relHt.push(0);
    }
    else
    {
      time.push(endTime);
      zone.push(0);
      X.push(0);
      Y.push(0);
      relHt.push(0);
      time.push(86400);
      zone.push(0);
      X.push(0);
      Y.push(0);
      relHt.push(0);
    }
  
  }
  else
  {
    if(startTime == 0)
    {
      time.push(0);
      zone.push(CONTAM.Project.ZoneList[1]);
      X.push(0);
      Y.push(0);
      relHt.push(0);
    }
    else
    {
      time.push(0);
      zone.push(0);
      X.push(0);
      Y.push(0);
      relHt.push(0);
      time.push(startTime);
      zone.push(CONTAM.Project.ZoneList[1]);
      X.push(0);
      Y.push(0);
      relHt.push(0);
    }
    if(endTime == 86400)
    {
      if(startTime == 0)
      {
        time.push(86400);
        zone.push(0);
        X.push(0);
        Y.push(0);
        relHt.push(0);
      }
      else
      {
        time.push(86400);
        zone.push(0);
        X.push(0);
        Y.push(0);
        relHt.push(0);
        }
    }
    else
    {
      if(startTime == 0)
      {
        time.push(endTime);
        zone.push(0);
        X.push(0);
        Y.push(0);
        relHt.push(0);

        time.push(86400);
        zone.push(0);
        X.push(0);
        Y.push(0);
        relHt.push(0);
        }
      else
      {
        time.push(endTime);
        zone.push(0);
        X.push(0);
        Y.push(0);
        relHt.push(0);

        time.push(86400);
        zone.push(0);
        X.push(0);
        Y.push(0);
        relHt.push(0);
        }
    }
  }
  
  CONTAM.Project.PexpList[1].odsch[0].npts = time.length;
  CONTAM.Project.PexpList[1].odsch[0].time = time;
  CONTAM.Project.PexpList[1].odsch[0].zone = zone;
  CONTAM.Project.PexpList[1].odsch[0].X = X;
  CONTAM.Project.PexpList[1].odsch[0].Y = Y;
  CONTAM.Project.PexpList[1].odsch[0].relHt = relHt;
  return "ok";
}


//edit the day schedule with the given number based on the times given
//the times are assumed to be already checked for correctness
CONTAM.SetDaySchedule = function(scheduleNumber, startTime, endTime, useInterval, interval, timestep, isBurst)
{
  var time = [];
  var ctrl = [];
  
  console.log("SetDaySchedule: " + startTime + ", " + endTime + ", " + useInterval + ", " +  interval );
  if(startTime == 0)
  {
    time.push(0);
    ctrl.push(1);
  }
  else
  {
    time.push(0);
    ctrl.push(0);
    time.push(startTime);
    ctrl.push(1);
  }
  if(useInterval)
  {
    var currentTime = startTime
    do
    {
      time.push(currentTime + timestep);
      ctrl.push(0);
      currentTime += interval;
      if(currentTime < endTime)
      {
        time.push(currentTime);
        ctrl.push(1);
      }
    }
    while(currentTime < endTime)
  }
  else
  {
    if(isBurst)
    {
      time.push(startTime + timestep);
      ctrl.push(0);
    }
  }
  if(endTime == 86400)
  {
    time.push(86400);
    ctrl.push(0);
  }
  else
  {
    time.push(endTime);
    ctrl.push(0);
    time.push(86400);
    ctrl.push(0);
  }
  
  var daySchedule = CONTAM.Project.Dsch0.GetByNumber(scheduleNumber);
  
  daySchedule.npts = time.length;
  daySchedule.time = time;
  daySchedule.ctrl = ctrl;
  return "ok";
}