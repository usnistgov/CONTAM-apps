if(typeof COAG == "undefined")
{
  var COAG = {};
}

window.onload = function()
{
  COAG.ConsoleDiv = document.getElementById("ConsoleDiv");
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(COAG.drawChart);
}

COAG.decodeHtml = function(html) 
{
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

COAG.drawChart = function()
{
  if(COAG.simResultData != undefined)
  {
    var vaxisTitle = "Particle Concentration [#/cm" + COAG.decodeHtml("&sup3;") + "]";
    var options = {
      title: 'Particle Bin Chart',
      curveType: 'function',
      hAxis: {logScale: true},
      legend: { position: 'bottom' },
      vAxis: { title: vaxisTitle }
    };
    var data = google.visualization.arrayToDataTable(COAG.simResultData);
    var view = new google.visualization.DataView(data);

    var chart = new google.visualization.LineChart(document.getElementById('Bin_Chart'));

    chart.draw(view, options);
  }
}

COAG.RunSim = function()
{
  if(!document.getElementById('prj-input').files[0])
  {
    alert("A project file must be selcted to run a simulation");
    return;
  }
  COAG.setPrjFile(document.getElementById('prj-input').files[0], COAG.RunSim2);
}

COAG.RunSim2 = function()
{
  //clear save files div contents
  //var saveInsertDiv = document.getElementById("saveInsertDiv");
  //while (saveInsertDiv.firstChild) {
      //saveInsertDiv.removeChild(saveInsertDiv.firstChild);
  //}
  
  var myWorker = new Worker("coag_worker.js");

  myWorker.onmessage = COAG.onWorkerMessage;

  var data = {};
  data.cmd = "start";
  data.PrjName = COAG.PrjName;
  data.PrjText = COAG.PrjText;
  COAG.consoleText = "";

  myWorker.postMessage(data);
}

COAG.setPrjFile = function(file, callback)
{
  var reader = new FileReader();
  COAG.PrjName = file.name;
  reader.onload = ProjectFileRead;
  reader.readAsText(file);
  
  function ProjectFileRead()
  {
    COAG.PrjText = reader.result;
    if(callback)
      callback();
  }
}

COAG.onWorkerMessage = function(oEvent)
{
  var data = oEvent.data;
  if(data.cmd == "console")
    COAG.console(data.text);
  else if(data.cmd = "result file")
  {
    COAG.simFile = data.simFile;
    COAG.ParseSimFile();
    COAG.drawChart();
    //COAG.SaveFiles();
  }
  else
  {
    alert("Unknown command from worker: " + data.cmd);
  }
}

COAG.ParseSimFile = function()
{
  // array to hold the chart data
  COAG.simResultData = [];

  // add labels to chart data
  COAG.simResultData.push(["Bins", "Before", "After"]);
  
  // parse contents into lines
  var lines = COAG.simFile.split("\n");
  
  // get the header data
  var line1 = lines[1].split("\t");
  var nBins = parseInt(line1[0]);
  
  // data set 1 starts on the 6th line
  for(var i = 5; i < nBins + 5; ++i)
  {
    var line = lines[i].split("\t");
    COAG.simResultData.push([parseFloat(line[1]), parseFloat(line[2])]);
  }
  
  //data set 2 starts on the nBins + 9th line
  for(var i = nBins + 8, j=1; i < nBins * 2 + 8; ++i, ++j)
  {
    var line = lines[i].split("\t");
    COAG.simResultData[j].push(parseFloat(line[2]));
  }

}

COAG.SaveFiles = function()
{
  //clear save files div contents
  var saveInsertDiv = document.getElementById("saveInsertDiv");
  while (saveInsertDiv.firstChild) {
      saveInsertDiv.removeChild(saveInsertDiv.firstChild);
  }
  /*

  for (i = 0; i < COAG.saveFilesData.length; i++) 
  {
    var saveDiv = document.createElement("div");
    var savelink = document.createElement("a");
    var filename = COAG.saveFilesData[i].name;
    //microsoft doing their own thing again
    if(window.navigator.msSaveOrOpenBlob) 
    {
      savelink.onclick  = function()
      {
        window.navigator.msSaveOrOpenBlob(COAG.saveFilesData[i].blob, filename);
      }
      savelink.style.cursor = "pointer";
      savelink.style.color = "#00f";
      savelink.style.textDecoration = "underline";
    }
    else
    {
      savelink.download = filename;
      savelink.href = window.URL.createObjectURL(COAG.saveFilesData[i].blob);
    }
    savelink.textContent = COAG.saveFilesData[i].linktext;
    saveDiv.className = "redback";
    savelink.className = "whitelink";
    saveDiv.appendChild(savelink);
    saveInsertDiv.appendChild(saveDiv);
    
    
  }
    */
  saveInsertDiv.textContent = COAG.simFile;
}

COAG.replaceFileInput = function(fileinputid)
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

COAG.consoleText = "";
COAG.console = function(text)
{
  var firstChild = COAG.ConsoleDiv.firstChild;
  COAG.ConsoleDiv.removeChild(firstChild);
  firstChild.textContent = text;
  COAG.ConsoleDiv.appendChild(firstChild);
}