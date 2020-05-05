import { UnitConverter } from "./units.js";
import { sprintf } from '../sprintf/sprintf.js';

window.addEventListener('load', 
  function()
  {
    testUnits();
  }
);

function testUnits(){

  var unitConverter = new UnitConverter();
  var unitTypes = unitConverter.getUnitTypes();
  var resultDiv = document.getElementById("testResults");
  for(const unitType of unitTypes){
    var unitOjects = unitConverter.getUnits(unitType);
    var unitTable = document.createElement("TABLE");
    var caption = unitTable.createCaption();
    caption.textContent = unitType;
    resultDiv.appendChild(unitTable);
    var tableHead = unitTable.createTHead();
    var headRow = tableHead.insertRow();
    //insert blank first cell
    var firstCell = headRow.insertCell();
    //insert headings
    for(const unitObject of unitOjects){
      var currentCell = headRow.insertCell();
      currentCell.textContent = unitObject.displayString;
    }

    for(const fromUnitObject of unitOjects){
      var currentRow = unitTable.insertRow();
      var labelCell = currentRow.insertCell();
      labelCell.textContent = fromUnitObject.displayString;
      for(const toUnitObject of unitOjects){
          var result = unitConverter.unitConvert(1, fromUnitObject.simpleString, toUnitObject.simpleString);
          var resultCell = currentRow.insertCell();
          var reverse = unitConverter.unitConvert(result, toUnitObject.simpleString, fromUnitObject.simpleString);
          resultCell.textContent = sprintf("%.6g (%.6g)", result, reverse);
          if(sprintf("(%.6g)", reverse) != "(1.00000)"){
            resultCell.style.backgroundColor = "red";
          }
      }
    }

  }
}