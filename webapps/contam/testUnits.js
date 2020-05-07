import { sprintf } from '../modules/sprintf/sprintf.js';

window.addEventListener('load', 
  function()
  {
    testUnits();
  }
);

function testUnits(){

  let Species = {};
  Species.edens = 1000;
  Species.mdiam = 1e-006;
  Species.decay = 1e-5;
  Species.molwt = 30;

  var unitTypes = CONTAM.Units.TypeList;
  var resultDiv = document.getElementById("testResults");
  for(const unitType of unitTypes){
    //var unitOjects = unitConverter.getUnits(unitType);
    var unitTable = document.createElement("TABLE");
    var caption = unitTable.createCaption();
    caption.textContent = unitType.label;
    resultDiv.appendChild(unitTable);
    var tableHead = unitTable.createTHead();
    var headRow = tableHead.insertRow();
    //insert blank first cell
    var firstCell = headRow.insertCell();
    //insert headings
    for(const unitString of unitType.strings){
      var currentCell = headRow.insertCell();
      currentCell.innerHTML = unitString;
    }

    for(let from=0;from<unitType.strings.length;++from){
      var currentRow = unitTable.insertRow();
      var labelCell = currentRow.insertCell();
      labelCell.innerHTML = unitType.strings[from];
      for(let to=0;to<unitType.strings.length;++to){
        let baseValue = unitType.func(1, from, 1, Species);
        let result = unitType.func(baseValue, to, 0, Species);
        var resultCell = currentRow.insertCell();
        let baseAgain = unitType.func(result, to, 1, Species);
        let reverse = unitType.func(baseAgain, from, 0, Species);
        resultCell.textContent = sprintf("%.6g (%.6g)", result, reverse);
        if(sprintf("(%.6g)", reverse) != "(1.00000)"){
          resultCell.style.backgroundColor = "red";
        }
      }
    }

  }
}