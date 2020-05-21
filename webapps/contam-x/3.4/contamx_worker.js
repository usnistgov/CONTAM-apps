var Module = {
  printErr: function(text) {
    if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
    console.log(text);
    var postdata = {};
    postdata.text = text;
    postdata.cmd ="console";
    postMessage(postdata);
  },
  noInitialRun: true,
}
console.log('loading webAssembly CX');
importScripts('contamx3.js');

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
    var result = Module.callMain([data.PrjName]);
    console.log("ContamX returned " + result);
    
    var prjFileNameNoExt = data.PrjName.substring(0, data.PrjName.indexOf("."));
    var directoryList = FS.readdir(FS.cwd());
    let fileNames = [];
    for(let name of directoryList){
      if(name.indexOf(prjFileNameNoExt) >= 0){
        fileNames.push(name);
      }
    }
    readResultFiles(fileNames);
    return result;
  }
  else if(data.cmd == "get file")
  {
    
  }
  //postMessage("Hi " + oEvent.data);
};


readResultFiles = function(fileList){
  
  let saveFilesData = [];
  for(let fileName of fileList){
    let fileExt = fileName.substring(fileName.indexOf(".") + 1);
    //check file extension for binary files
    if(fileExt == "sim" || fileExt == "rst" || fileExt == "sqlite"){
      let binaryContent = FS.readFile(fileName);
      let File = {};
      File.name = fileName;
      File.contents = binaryContent;
      File.blob = new Blob([binaryContent], {type: 'application/octet-binary'});
      File.linktext = "Save " + fileName;
      saveFilesData.push(File);
    } else {
      let text = FS.readFile(fileName, { encoding: 'utf8' });
      let File = {};
      File.name = fileName;
      File.contents = text;
      File.blob = new Blob([text], {type:'text/plain'})
      File.linktext = "Save " + fileName;
      saveFilesData.push(File);
    }
  }
  
  var postdata = {};
  postdata.saveFilesData = saveFilesData;
  postdata.cmd ="save files";
  
  postMessage(postdata);
}
