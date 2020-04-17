importScripts("element_list.js", "globals.js", "read_epw.js", "reader_1.js",
  "read_tmy2.js", "read_tmy3.js", "simread.js", 
  "unitsConversions.js","unitsSetup.js","unitsStrings.js",
  "project/icons.js", "project/project_1.js", "project/upgraders.js", 
  "project/c24toc30.js", "project/c30toc31.js", "project/c31toc32.js", 
  "project/prjsave_1.js", "utils/date_utilities.js", "utils/sprintf_1.js", 
  "utils/time_utilities.js", "utils/utils_1.js");

//TODO : need functions to add/delete/get etc zones, paths etc

Worker = {};

//set a variable to the value given
//the value will be a number or string
Worker.SetValue = function(variableName, variableValue)
{
  // try block needed?
  var e=self, i;
  var tokens = variableName.split(".");
  //get down to the last token
  for(i=0; i<tokens.length-1;++i)
  {
    //token contains an array index
    if(tokens[i].indexOf("[") >= 0)
    {
      var subtoken = tokens[i].substring(0, tokens[i].indexOf("["));
      var index = tokens[i].substring(tokens[i].indexOf("[") + 1, tokens[i].indexOf("]"));
      if(!e.hasOwnProperty(subtoken))
      {
        return {result: true, msg: "Variable not found: " + variableName + ", subtoken: " + subtoken};
      }
      e = e[subtoken];
      //TODO: check this property too?
      e = e[index];
    }
    //token contains a function call
    else if(tokens[i].indexOf("(") >= 0)
    {
      var func = tokens[i].substring(0, tokens[i].indexOf("("));
      var params = tokens[i].substring(tokens[i].indexOf("(") + 1, tokens[i].indexOf(")"));
      var ptokens = params.split(",");
      var paramsarray = [];
      for(var j=0; j<ptokens.length; ++j)
      {
        var param = ptokens[j];
        if(isNaN(param))
        {
          //add string to param array
          paramsarray.push(param);
        }
        else
        {
          //add number to param array
          var num = parseFloat(param);
          paramsarray.push(num);
        }
      }
      //the function needs to be called with this object as 'this'
      var func_this = e;
      //get the function
      e = e[func];
      //call the function
      e = e.apply(func_this, paramsarray);
    }
    else
    {
      if(!e.hasOwnProperty(tokens[i]))
      {
        return {result: true, msg: "Variable not found: " + variableName + ", token: " + tokens[i]};
      }
      e = e[tokens[i]];
    }
  }
  //set the last token to the value given
  //token contains an array index
  if(tokens[i].indexOf("[") >= 0)
  {
    var subtoken = tokens[i].substring(0, tokens[i].indexOf("["));
    var index = tokens[i].substring(tokens[i].indexOf("[") + 1, tokens[i].indexOf("]"));
    if(!e.hasOwnProperty(subtoken))
    {
      return {result: true, msg: "Variable not found: " + variableName + ", subtoken: " + subtoken};
    }
    e = e[subtoken];
    e[index] = variableValue;
    return {result: false, msg: "ok"};
  }
  else
  {
    if(!e.hasOwnProperty(tokens[i]))
    {
      return {result: true, msg: "Variable not found: " + variableName + ", token: " + tokens[i]};
    }
    e[tokens[i]] = variableValue;
    return {result: false, msg: "ok"};
  }

}

//ListOfValues is an array of objects each containing
// variableName - the fully qualified variable name 
//                e.g. to set sim_af you would need CONTAM.Project.rcdat.sim_af
// variableValue - the value to set the variable
Worker.SetListOfValues = function(ListOfValues)
{
  ListOfValues.forEach(function(ListEntry, index)
  {
    var ret = Worker.SetValue(ListEntry.variableName, ListEntry.variableValue);
    if(ret.result)
    {
      console.log(ret.msg);
      //postMessage(ret.msg);
      return true;
    }
  });
  return false;
}

//returns an object that is the variable name given
// you must use returnVal[returnIndex] if the return is an array
// if the 'set' variable is true then the object that holds the variable will be 
// returned with the token to set the proper variable 
// but this has not effect on an array return
// using the 'set' variable will not work with a function as the last token - it will return what the function returns
// e.g. returnVal[returnToken] = somevalue
Worker.getVariableFromName = function(variableName, set)
{
  var e=self, i;

  //find the variable to return
  var tokens = variableName.split(".");
  //get down to the last token
  for(i=0; i<tokens.length-1;++i)
  {
    //token contains an array index
    if(tokens[i].indexOf("[") >= 0)
    {
      var subtoken = tokens[i].substring(0, tokens[i].indexOf("["));
      var index = tokens[i].substring(tokens[i].indexOf("[") + 1, tokens[i].indexOf("]"));
      if(!e.hasOwnProperty(subtoken))
      {
        return {result: true, msg: "CONTAM worker: Variable not found: " + subtoken};
      }
      e = e[subtoken];
      //TODO: check this property too?
      e = e[index];
    }
    //token contains a function call
    else if(tokens[i].indexOf("(") >= 0)
    {
      var func = tokens[i].substring(0, tokens[i].indexOf("("));
      var params = tokens[i].substring(tokens[i].indexOf("(") + 1, tokens[i].indexOf(")"));
      var ptokens = params.split(",");
      var paramsarray = [];
      for(var j=0; j<ptokens.length; ++j)
      {
        var param = ptokens[j];
        if(isNaN(param))
        {
          //add string to param array
          paramsarray.push(param);
        }
        else
        {
          //add number to param array
          var num = parseFloat(param);
          paramsarray.push(num);
        }
      }
      //the function needs to be called with this object as 'this'
      var func_this = e;
      //get the function
      e = e[func];
      //call the function
      e = e.apply(func_this, paramsarray);
    }
    else
    {
      if(!e.hasOwnProperty(tokens[i]))
      {
        return {result: true, msg: "CONTAM worker: Variable not found: " + tokens[i]};
      }
      e = e[tokens[i]];
    }
  }
  if(tokens[i].indexOf("[") >= 0)
  {
    var subtoken = tokens[i].substring(0, tokens[i].indexOf("["));
    var index = tokens[i].substring(tokens[i].indexOf("[") + 1, tokens[i].indexOf("]"));
    if(!e.hasOwnProperty(subtoken))
    {
      return {result: true, msg: "CONTAM worker: Variable not found: " + subtoken};
    }
    e = e[subtoken];
    //e[index] = variableValue;
    return { 
      result: false, 
      msg: "ok", 
      returnType: "array", 
      returnVal: e, 
      returnIndex: index
    };
  }
  else if(tokens[i].indexOf("(") >= 0)
  {
    var func = tokens[i].substring(0, tokens[i].indexOf("("));
    var params = tokens[i].substring(tokens[i].indexOf("(") + 1, tokens[i].indexOf(")"));
    var ptokens = params.split(",");
    var paramsarray = [];
    for(var j=0; j<ptokens.length; ++j)
    {
      var param = ptokens[j];
      if(isNaN(param))
      {
        //add string to param array
        paramsarray.push(param);
      }
      else
      {
        //add number to param array
        var num = parseFloat(param);
        paramsarray.push(num);
      }
    }
    //the function needs to be called with this object as 'this'
    var func_this = e;
    //get the function
    e = e[func];
    //call the function
    e = e.apply(func_this, paramsarray);
    return { 
      result: false, 
      msg: "ok", 
      returnType: "variable", 
      returnVal: e
    };
  }
  else
  {
    if(!e.hasOwnProperty(tokens[i]))
    {
      return {result: true, msg: "CONTAM worker: Variable not found"};
    }
    if(set)
    {
      return { 
        result: false, 
        msg: "ok", 
        returnType: "variable with token", 
        returnVal: e,
        returnToken: tokens[i]
      };
    }
    else
    {
      e = e[tokens[i]];
      return { 
        result: false, 
        msg: "ok", 
        returnType: "variable", 
        returnVal: e
      };
    }
  }
  
}

//set a variable to another object 
Worker.SetVariableToVariable = function(setVariableName, toVariableName)
{
  // try block needed?
  var e=self, i;

  //find the variable to use for setting the set variable
  var toVariableResult = Worker.getVariableFromName(toVariableName);
  //invalid return
  if(toVariableResult.result)
    return {result: true, msg: "toVariableName not found: " + toVariableName};

  //find the variable to set
  var setVariableResult = Worker.getVariableFromName(setVariableName, true);
  //invalid return
  if(setVariableResult.result)
    return {result: true, msg: "setVariableName not found: " + setVariableName};
  
  if(toVariableResult.returnType == "array" &&
    setVariableResult.returnType == "array")
  {
    setVariableResult.returnVal[setVariableResult.returnIndex] = 
      toVariableResult.returnVal[toVariableResult.returnIndex];
  }
  else if(toVariableResult.returnType == "array")
  {
    setVariableResult.returnVal[setVariableResult.returnToken] = 
      toVariableResult.returnVal[toVariableResult.returnIndex];
  }
  else if(setVariableResult.returnType == "array")
  {
    setVariableResult.returnVal[setVariableResult.returnIndex] = 
      toVariableResult.returnVal;
  }
  else
  {
    setVariableResult.returnVal[setVariableResult.returnToken] = toVariableResult.returnVal;
  }
  return {result: false, msg: "ok"};
}

//iterate over array to set a variable to another object 
Worker.SetArrayOfVariableToVariable = function(arrayOfParameters)
{
  for (const param of arrayOfParameters) 
  {
    var retVal = Worker.SetVariableToVariable(param.setVariableName, param.toVariableName);
    if(retVal.result)
    {
      return retVal;
    }
  }
  return {result: false, msg: "ok"};
}

onmessage = function (oEvent) 
{
  var data = oEvent.data;
  //Calls a function in this contamWorker
  //requires an object with these members
  // funcName - the name of the function to call
  // funcParams - an array containing the parameters to call the function with
  //              if passing just an array to a function you must pass array inside of an array
  if(data.cmd == "CallFunction")
  {
    console.log("CONTAM worker (start): CallFunction: " + data.funcName);
    var e=self, i;
    var tokens = data.funcName.split(".");
    for(i=0; i<tokens.length-1;++i)
    {
      if(!e.hasOwnProperty(tokens[i]))
      {
        console.log("CONTAM worker: Variable not found: " + tokens[i]);
        //postMessage("CONTAM worker: Variable not found: " + tokens[i]);
        return;
      }
      e = e[tokens[i]];
    }
    if(!e.hasOwnProperty(tokens[i]))
    {
      console.log("CONTAM worker: Variable not found: " + tokens[i]);
      //postMessage("CONTAM worker: Variable not found: " + tokens[i]);
      return;
    }
    var result = e[tokens[i]].apply(self, data.funcParams)
    console.log("CONTAM worker (end): CallFunction: " + data.funcName + " returns " + result);
    postMessage({cmd:"functionReturn",fresult:result, fname: data.funcName});
  }
  //sets a variable in this contamWorker
  //requires an object with these members
  // variableName - the fully qualified variable name 
  //                e.g. to set sim_af you would need CONTAM.Project.rcdat.sim_af
  // variableValue - the value to set the variable
  else if(data.cmd == "SetValue")
  {
    console.log("CONTAM worker (start): SetValue: " + data.variableName);
    var ret = Worker.SetValue(data.variableName, data.variableValue);
    if(ret.result)
      console.log(ret.msg);
    console.log("CONTAM worker (end): SetValue return: " + ret.msg);
    postMessage(ret.msg);
  }
  //sets a list of variables in this contamWorker
  //requires an array (variableList) with objects with these members
  // variableName - the fully qualified variable name 
  //                e.g. to set sim_af you would need CONTAM.Project.rcdat.sim_af
  // variableValue - the value to set the variable
  else if(data.cmd == "SetValueArray")
  {
    console.log("CONTAM worker (start): SetValueArray");
    if(Worker.SetListOfValues(data.variableList))
    {
      console.log("CONTAM worker (end): SetValueArray failed: " + ret.msg);
      postMessage(ret.msg);
    }
    else
    {
      console.log("CONTAM worker (end): SetValueArray Succeeded");
      postMessage("ok");
    }
  }
  //gets a variable in this contamWorker
  //requires an object with these members
  // variableName - the fully qualified variable name 
  //                e.g. to set sim_af you would need CONTAM.Project.rcdat.sim_af
  // returns the value of the variable
  else if(data.cmd == "GetValue")
  {
    console.log("CONTAM worker (start): GetValue:" + data.variableName);
    var e = self;
    var tokens = data.variableName.split(".");
    for(var i=0; i<tokens.length;++i)
    {
      if(!e.hasOwnProperty(tokens[i]))
      {
        postMessage("CONTAM worker (end): Variable not found: " + tokens[i]);
        return;
      }
      e = e[tokens[i]];
    }
    console.log("CONTAM worker (end): GetValue: " + e);
    postMessage(e);
  }
  //gets an array of variables in this contamWorker
  //requires an object with these members
  // variableNameArray - an array of fully qualified variable names 
  // returns an object with members that are the variable names in the array
  else if(data.cmd == "GetValueArray")
  {
    var returnObject = {};
    console.log("CONTAM worker (start): GetValueArray");
        
    data.variableNameArray.forEach(addVariable, self);    
    
    console.log("CONTAM worker (end): GetValueArray");
    postMessage(returnObject);
  }
  //the file js from the given URL on this contam worker
  else if(data.cmd == "LoadJSFile")
  {
    console.log("CONTAM worker (start): LoadJSFile: " + data.jsFileURL);
    var retVal = importScripts(data.jsFileURL);
    console.log("CONTAM worker (end): LoadJSFile: " + retVal);
    postMessage(retVal);
  }
  //the js files from the given URL on this contam worker
  //jsFileURLs is an array of URLs
  else if(data.cmd == "LoadJSFiles")
  {
    console.log("CONTAM worker (start): LoadJSFiles: " + data.jsFileURLs);
    var retVal = self["importScripts"].apply(self, data.jsFileURLs);
    console.log("CONTAM worker (end): LoadJSFiles: " + retVal);
    postMessage(retVal);
  }
  else if(data.cmd == "SetVariableToVariable")
  {
    console.log("CONTAM worker (start): SetVariableToVariable: " + data.setVariableName);
    var ret = Worker.SetVariableToVariable(data.setVariableName, data.toVariableName);
    if(ret.result)
      console.log(ret.msg);
    console.log("CONTAM worker (end): SetVariableToVariable: " + data.setVariableName);
    postMessage(ret.msg);
  }
  else if(data.cmd == "SetArrayOfVariableToVariable")
  {
    console.log("CONTAM worker (start): SetArrayOfVariableToVariable: " + data.arrayOfParameters);
    var ret = Worker.SetArrayOfVariableToVariable(data.arrayOfParameters);
    if(ret.result)
      console.log(ret.msg);
    console.log("CONTAM worker (end): SetVariableToVariable: " + data.arrayOfParameters);
    postMessage(ret.msg);
  }
  else
  {
    console.log("CONTAM worker: unknown command: " + data.cmd);
  }
  
  function addVariable(element, index, array)
  {
    var e = self;
    var tokens = element.split(".");
    for(var i=0; i<tokens.length;++i)
    {
      if(!e.hasOwnProperty(tokens[i]))
      {
        postMessage("CONTAM worker: Variable not found: " + tokens[i]);
        return;
      }
      e = e[tokens[i]];
    }
    returnObject[tokens[i-1]] = e;
  }
  
}