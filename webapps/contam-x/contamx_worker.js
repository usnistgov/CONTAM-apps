//postMessage("I\'m working before postMessage(\'ali\').");
console.log('loading emscripten CX');
//importScripts('CX-Emscripten.js');
importScripts('contam-x-em-Debug-emcc.js');

//receive messages from the main thread
onmessage = function (oEvent) 
{
  var data = oEvent.data;
  if(data.cmd == "start")
  {
    //put input files into the Emscripten File System
    FS.writeFile(data.PrjName, data.PrjText);
    if(data.WthName != "null")
      FS.writeFile(data.WthName, data.WthText);
    if(data.CtmName != "null")
      FS.writeFile(data.CtmName, data.CtmText);
    if(data.WpcName != "null")
      FS.writeFile(data.WpcName, data.WpcText);
    if(data.CvfName != "null")
      FS.writeFile(data.CvfName, data.CvfText);
    if(data.DvfName != "null")
      FS.writeFile(data.DvfName, data.DvfText);

    console.log('Starting simulation: ' + data.PrjName);
    // Call C from JavaScript
    var result = Module.ccall('RunSimulation', // name of C function
        'number', // return type
        ['string', 'string', 'string', 'string', 'string', 'string'], // argument types
        [data.PrjName, data.WthName, data.CtmName, data.WpcName, data.CvfName, data.DvfName]); // arguments
    console.log("ContamX returned " + result);
  }
  else if(data.cmd == "get file")
  {
    
  }
  //postMessage("Hi " + oEvent.data);
};

readResultFiles = function(data)
{
  var saveFilesData = [];

  for(i=0; i<data.fileNames.length; ++i)
  {
    if(data.fileTypes[i] == 0) //text file
    {
      var text = FS.readFile(data.fileNames[i], { encoding: 'utf8' });
      var File = {};
      File.name = data.fileNames[i];
      File.contents = text;
      File.blob = new Blob([text], {type:'text/plain'})
      File.linktext = "Save " + data.fileNames[i];
      saveFilesData.push(File);
    }
    else //binary file
    {
      var binaryContent = FS.readFile(data.fileNames[i]);
      var File = {};
      File.name = data.fileNames[i];
      File.contents = binaryContent;
      File.blob = new Blob([binaryContent], {type: 'application/octet-binary'});
      File.linktext = "Save " + data.fileNames[i];
      saveFilesData.push(File);
    }    
  }
  
  var postdata = {};
  postdata.saveFilesData = saveFilesData;
  postdata.cmd ="save files";
  
  postMessage(postdata);
}