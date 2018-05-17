//postMessage("I\'m working before postMessage(\'ali\').");
console.log('loading emscripten Coag');
//importScripts('CX-Emscripten.js');
importScripts('coagLibraryEm.js');

//receive messages from the main thread
onmessage = function (oEvent) 
{
  var data = oEvent.data;
  if(data.cmd == "start")
  {
    //put input files into the Emscripten File System
    //FS.writeFile(data.PrjName, data.PrjText);

    console.log('Starting simulation: ' + data.PrjName);
    // Call C from JavaScript
    var result = Module.ccall('RunSimulation', // name of C function
        'number', // return type
        ['string'], // argument types
        [data.PrjText]); // arguments
    console.log("Coag returned " + result);
  }
  else if(data.cmd == "get file")
  {
    
  }
  //postMessage("Hi " + oEvent.data);
};

// get the sim results from the coagLib
passSimulationResults = function(data)
{
  // pass the simulation results file back to the main thread
  var postdata = {};
  postdata.simFile = data;
  postdata.cmd ="result file";
  
  postMessage(postdata);
}