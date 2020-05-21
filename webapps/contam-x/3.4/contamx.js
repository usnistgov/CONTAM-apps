if(typeof CONTAMX == "undefined")
{
  var CONTAMX = {};
}
CONTAMX.WthName = "null";
CONTAMX.CtmName = "null";
CONTAMX.WpcName = "null";
CONTAMX.CvfName = "null";
CONTAMX.DvfName = "null";

window.onload = function()
{
  CONTAMX.ConsoleDiv = document.getElementById("ConsoleDiv");
    
  CONTAMX.Worker = new Worker("contamx_worker.js");

  CONTAMX.Worker.onmessage = CONTAMX.onWorkerMessage;

}

CONTAMX.RunSim = function()
{
  if(!document.getElementById('prj-input').files[0])
  {
    alert("A project file must be selcted to run a simulation");
    return;
  }
  CONTAMX.setPrjFile(document.getElementById('prj-input').files[0], CONTAMX.RunSim2);
}

CONTAMX.RunSim2 = function()
{
  if(document.getElementById('wth-input').files[0])
  {
    CONTAMX.setWthFile(document.getElementById('wth-input').files[0], CONTAMX.RunSim3);
  }
  else
    CONTAMX.RunSim3();
}

CONTAMX.RunSim3 = function()
{
  if(document.getElementById('ctm-input').files[0])
  {
    CONTAMX.setCtmFile(document.getElementById('ctm-input').files[0], CONTAMX.RunSim4);
  }
  else
    CONTAMX.RunSim4();
}

CONTAMX.RunSim4 = function()
{
  if(document.getElementById('wpc-input').files[0])
  {
    CONTAMX.setWpcFile(document.getElementById('wpc-input').files[0], CONTAMX.RunSim5);
  }
  else
    CONTAMX.RunSim5();
}

CONTAMX.RunSim5 = function()
{
  if(document.getElementById('cvf-input').files[0])
  {
    CONTAMX.setCvfFile(document.getElementById('cvf-input').files[0], CONTAMX.RunSim6);
  }
  else
    CONTAMX.RunSim6();
}

CONTAMX.RunSim6 = function()
{
  if(document.getElementById('dvf-input').files[0])
  {
    CONTAMX.setDvfFile(document.getElementById('dvf-input').files[0], CONTAMX.RunSim7);
  }
  else
    CONTAMX.RunSim7();
}

CONTAMX.RunSim7 = function()
{
  //clear save files div contents
  var saveInsertDiv = document.getElementById("saveInsertDiv");
  while (saveInsertDiv.firstChild) {
      saveInsertDiv.removeChild(saveInsertDiv.firstChild);
  }

  var data = {};
  data.cmd = "start";
  data.PrjName = CONTAMX.PrjName;
  data.PrjText = CONTAMX.PrjText;
  data.WthName = CONTAMX.WthName;
  data.WthText = CONTAMX.WthText;
  data.CtmName = CONTAMX.CtmName;
  data.CtmText = CONTAMX.CtmText;
  data.WpcName = CONTAMX.WpcName;
  data.WpcText = CONTAMX.WpcText;
  data.CvfName = CONTAMX.CvfName;
  data.CvfText = CONTAMX.CvfText;
  data.DvfName = CONTAMX.DvfName;
  data.DvfText = CONTAMX.DvfText;
  CONTAMX.consoleText = "";

  CONTAMX.Worker.postMessage(data);
}

CONTAMX.setPrjFile = function(file, callback)
{
  var reader = new FileReader();
  CONTAMX.PrjName = file.name;
  reader.onload = ProjectFileRead;
  reader.readAsText(file);
  
  function ProjectFileRead()
  {
    CONTAMX.PrjText = reader.result;
    if(callback)
      callback();
  }
}

CONTAMX.setWthFile = function(file, callback)
{
  var reader = new FileReader();
  CONTAMX.WthName = file.name;
  reader.onload = WthFileRead;
  reader.readAsText(file);
  
  function WthFileRead()
  {
    CONTAMX.WthText = reader.result;
    if(callback)
      callback();
  }
}

CONTAMX.setCtmFile = function(file, callback)
{
  var reader = new FileReader();
  CONTAMX.CtmName = file.name;
  reader.onload = CtmFileRead;
  reader.readAsText(file);
  
  function CtmFileRead()
  {
    CONTAMX.CtmText = reader.result;
    if(callback)
      callback();
  }
}

CONTAMX.setWpcFile = function(file, callback)
{
  var reader = new FileReader();
  CONTAMX.WpcName = file.name;
  reader.onload = WpcFileRead;
  reader.readAsText(file);
  
  function WpcFileRead()
  {
    CONTAMX.WpcText = reader.result;
    if(callback)
      callback();
  }
}

CONTAMX.setCvfFile = function(file, callback)
{
  var reader = new FileReader();
  CONTAMX.CvfName = file.name;
  reader.onload = CvfFileRead;
  reader.readAsText(file);
  
  function CvfFileRead()
  {
    CONTAMX.CvfText = reader.result;
    if(callback)
      callback();
  }
}

CONTAMX.setDvfFile = function(file, callback)
{
  var reader = new FileReader();
  CONTAMX.DvfName = file.name;
  reader.onload = DvfFileRead;
  reader.readAsText(file);
  
  function DvfFileRead()
  {
    CONTAMX.DvfText = reader.result;
    if(callback)
      callback();
  }
}

CONTAMX.onWorkerMessage = function(oEvent)
{
  var data = oEvent.data;
  if(data.cmd == "console")
    CONTAMX.console(data.text);
  else if(data.cmd = "save files")
  {
    CONTAMX.saveFilesData = data.saveFilesData;
    CONTAMX.SaveFiles();
  }
  else
  {
    alert("Unknown command from worker: " + data.cmd);
  }
}

CONTAMX.SaveFiles = function()
{
  //clear save files div contents
  var saveInsertDiv = document.getElementById("saveInsertDiv");
  while (saveInsertDiv.firstChild) {
      saveInsertDiv.removeChild(saveInsertDiv.firstChild);
  }

  for (i = 0; i < CONTAMX.saveFilesData.length; i++) 
  {
    var saveDiv = document.createElement("div");
    var savelink = document.createElement("a");
    var filename = CONTAMX.saveFilesData[i].name;
    //microsoft doing their own thing again
    if(window.navigator.msSaveOrOpenBlob) 
    {
      savelink.onclick  = function()
      {
        window.navigator.msSaveOrOpenBlob(CONTAMX.saveFilesData[i].blob, filename);
      }
      savelink.style.cursor = "pointer";
      savelink.style.color = "#00f";
      savelink.style.textDecoration = "underline";
    }
    else
    {
      savelink.download = filename;
      savelink.href = window.URL.createObjectURL(CONTAMX.saveFilesData[i].blob);
    }
    savelink.textContent = CONTAMX.saveFilesData[i].linktext;
    saveDiv.className = "redback";
    savelink.className = "whitelink";
    saveDiv.appendChild(savelink);
    saveInsertDiv.appendChild(saveDiv);
  }
}

CONTAMX.replaceFileInput = function(fileinputid)
{
  var oldInput = document.getElementById(fileinputid);
  
  var newInput = document.createElement("input");
  
  newInput.type = "file";
  newInput.id = oldInput.id;
  newInput.name = oldInput.name;
  newInput.className = oldInput.className;
  newInput.style.cssText = oldInput.style.cssText;
  // copy any other relevant attributes
  
  oldInput.parentNode.replaceChild(newInput, oldInput);
}

CONTAMX.consoleText = "";
CONTAMX.console = function(text)
{
  var firstChild = CONTAMX.ConsoleDiv.firstChild;
  CONTAMX.ConsoleDiv.removeChild(firstChild);
  firstChild.textContent = text;
  CONTAMX.ConsoleDiv.appendChild(firstChild);
}