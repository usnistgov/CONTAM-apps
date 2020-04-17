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
  console.log("CWD.SetOnMessageFunction");
  CWD.onMessageFunc = func;
}

CWD.onMessage = function(oEvent)
{
  console.log("CWD.onMessage");
  if(CWD.onMessageFunc)
    CWD.onMessageFunc(oEvent);
}

CWD.CallContamFunction = function(funcName, funcParams)
{
  console.log("CONTAM Driver (start): CallFunction: " + funcName);
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
      {
        console.log("progressUpdate");
        CWD.onMessage(oEvent);
      }
      else if(oEvent.data.cmd == "functionReturn")
      {
        console.log("CONTAM Driver (end): CallFunction Resolve (" + funcName + "): " + oEvent.data.fresult);
        resolve(oEvent.data.fresult);
      }
      else if(oEvent.data.cmd)
      {
        throw("CONTAM Driver: Unknown command: " + oEvent.data.cmd);
      }
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): CallFunction Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

CWD.SetContamVariable = function(variableName, variableValue)
{
  console.log("CONTAM Driver (start): SetValue: " + variableName);
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
      console.log("CONTAM Driver (end): SetValue Resolve (" + variableName + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): SetValue Reject: " + e.message);
      reject(e.message);
    }
  });
  return promise;
}

CWD.GetContamVariable = function(variableName)
{
  console.log("CONTAM Driver (start): GetValue: " + variableName);
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
      console.log("CONTAM Driver (end): GetValue Resolve (" + variableName + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): GetValue Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

//Pass an array of variable names to get from CONTAM
//return an object which has those variables as members
CWD.GetArrayOfContamVariables = function(variableNameArray)
{
  console.log("CONTAM Driver (start): GetValueArray: " + variableNameArray);
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
      console.log("CONTAM Driver (end): GetValueArray Resolve (" + variableNameArray + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): GetValueArray Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

//Pass an array of variable names and values to set from CONTAM
CWD.SetArrayOfContamVariables = function(variableList)
{
  console.log("CONTAM Driver (start): SetValueArray");
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
      console.log("CONTAM Driver (end): SetValueArray Resolve: " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): SetValueArray Reject: " + e.message);
      reject(e);
    }
  });
  return promise;
}

CWD.SetContamVariableToVariable = function(setVariableName, toVariableName)
{
  console.log("CONTAM Driver (start): SetVariableToVariable: " + setVariableName + ", " + toVariableName);
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
      console.log("CONTAM Driver (end): SetVariableToVariable Resolve (" + setVariableName + ", " + toVariableName + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): SetVariableToVariable Reject: " + e.message);
      reject(e.message);
    }
  });
  return promise;
}

CWD.SetArrayOfContamVariableToVariable = function(arrayOfParameters)
{
  console.log("CONTAM Driver (start): SetArrayOfVariableToVariable: " + arrayOfParameters);
  var promise = new Promise(function(resolve, reject) 
  {
    CWD.worker.onmessage = onWorkerMessage;
    CWD.worker.onerror = onWorkerError;
    var data = {};
    data.cmd = "SetArrayOfVariableToVariable";
    data.arrayOfParameters = arrayOfParameters;
    CWD.worker.postMessage(data);
    function onWorkerMessage(oEvent)
    {
      console.log("CONTAM Driver (end): SetVariableToVariable Resolve (" + arrayOfParameters + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): SetVariableToVariable Reject: " + e.message);
      reject(e.message);
    }
  });
  return promise;
}

//this function will load a javascript file on the worker thread 
// this is useful to add app specific code to run with the contam backend
CWD.LoadURLOnWorker = function(codeURL)
{
  console.log("CONTAM Driver (start): LoadJSFile: " + codeURL);
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
      console.log("CONTAM Driver (end): LoadJSFile Resolve (" + codeURL + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): LoadJSFile Reject: " + e.message);
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
  console.log("CONTAM Driver (start): LoadJSFiles: " + codeURLs);
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
      console.log("CONTAM Driver (end): LoadJSFiles Resolve (" + codeURLs + "): " + oEvent.data);
      resolve(oEvent.data);
    }
    function onWorkerError(e)
    {
      console.log("CONTAM Driver (end): LoadJSFiles Rejected");
      reject(e);
    }
  });
  return promise;
}

