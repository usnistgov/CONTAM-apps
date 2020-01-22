console.log('loading emscripten WthTool');
importScripts('CONTAM_EPWtoWeatherFile.js');

//receive messages from the main thread
onmessage = function (oEvent) 
{
  var data = oEvent.data;
  if(data.cmd == "start")
  {
    console.log('Starting conversion: ' + data.wthName);
    //put input files into the Emscripten File System
    FS.writeFile(data.wthName, data.wthText);
    
    // Call C from JavaScript
    var result = Module.ccall('ConvertEPW', // name of C function
        'number', // return type
        ['string', 'string'], // argument types
        [data.wthName, data.config]); // arguments
    console.log("WthTool returned " + result);
  }
  else if(data.cmd == "get file")
  {
    
  }
  //postMessage("Hi " + oEvent.data);
};

// get the wth file result the wthtool
passWeatherFile = function(data)
{
  // pass the simulation results file back to the main thread
  var postdata = {};
  postdata.wthFile = data;
  postdata.cmd ="result file";
  
  postMessage(postdata);
}