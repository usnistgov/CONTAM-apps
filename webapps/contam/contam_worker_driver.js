//ContamWorkerDriver
//this is made to work on the main thread to communicate with the CONTAM worker
var CWD = {};

CWD.Init = function(worker) 
{ 
  CWD.worker = worker;
  CWD.worker.onmessage = CWD.onMessage;
};

CWD.SetOnMessageFunction = function(func)
{
  CWD.onMessageFunc = func;
}

CWD.onMessage = function(oEvent)
{
  if(CWD.onMessageFunc)
    CWD.onMessageFunc(oEvent);
}

CWD.CallContamFunction = function(funcName, funcParams)
{
  console.log("Driver: Call CONTAM Function: " + funcName);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "CallFunction";
    data.funcName = funcName;
    data.funcParams = funcParams;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      if(oEvent.data.cmd == "progressUpdate")
        CWD.onMessage(oEvent);
      else if(oEvent.data.cmd == "functionReturn")
        resolve(oEvent.data.fresult);
      else if(oEvent.data.cmd)
      {
        throw("Driver: Unknown command: " + oEvent.data.cmd);
      }
    }
    function onWorkerError(e)
    {
      reject(e);
    }
  });
  return promise;
}

CWD.SetContamVariable = function(variableName, variableValue)
{
  console.log("Driver: Set Contam Variable: " + variableName);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "SetValue";
    data.variableName = variableName;
    data.variableValue = variableValue;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      reject(e.message);
    }
  });
  return promise;
}

CWD.GetContamVariable = function(variableName)
{
  console.log("Driver: Get Contam Variable: " + variableName);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "GetValue";
    data.variableName = variableName;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      console.log("Driver: Resolve (" + variableName + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("Driver: Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

//Pass an array of variable names to get from CONTAM
//return an object which has those variables as members
CWD.GetArrayOfContamVariables = function(variableNameArray)
{
  console.log("Driver: Get Contam Variable Array: " + variableNameArray);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "GetValueArray";
    data.variableNameArray = variableNameArray;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      console.log("Driver: Resolve (" + variableNameArray + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("Driver: Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

//Pass an array of variable names and values to set from CONTAM
CWD.SetArrayOfContamVariables = function(variableList)
{
  console.log("Driver: Set Contam Variable Array: " + variableList);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "SetValueArray";
    data.variableList = variableList;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      console.log("Driver: Resolve (" + variableList + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("Driver: Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

CWD.SetContamVariableToVariable = function(setVariableName, toVariableName)
{
  console.log("Driver: Set Contam Variable to Variable: " + setVariableName + ", " + toVariableName);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "SetVariableToVariable";
    data.setVariableName = setVariableName;
    data.toVariableName = toVariableName;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      reject(e.message);
    }
  });
  return promise;
}

//this function will load a javascript file on the worker thread 
// this is useful to add app specific code to run with the contam backend
CWD.LoadURLOnWorker = function(codeURL)
{
  console.log("Driver: Load js file on contam worker: " + codeURL);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "LoadJSFile";
    data.jsFileURL = codeURL;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      console.log("Driver: Resolve (" + codeURL + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("Driver: Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

//this function will load a list of javascript files on the worker thread 
// this is useful to add app specific code to run with the contam backend
// codeURLs - an array of URLS to load 
// the URLs need to be absolute or relative to the location of contamworker.js
CWD.LoadURLsOnWorker = function(codeURLs)
{
  console.log("Driver: Load js files on contam worker: " + codeURLs);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "LoadJSFiles";
    data.jsFileURLs = codeURLs;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      console.log("Driver: Resolve (" + codeURLs + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("Driver: Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

