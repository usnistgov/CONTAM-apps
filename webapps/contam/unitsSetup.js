if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

if(typeof CONTAM.Units == "undefined")
{
  CONTAM.Units = {};
}

// unitObject     - an object with unit data / objects chich must be included which are:
//   initialValue - this is a number field which holds the base value of the field
//   convert      - the units to use to display the unit value and the select will be set to this index
//   func         - this is the function, usually in this file, that will be used to do the unit conversion
//   strings      - this is the array of unit strings to add to the select, usually is from the unit strings above
//   input        - the input element that the user will input the unit value
//   select       - the select element that the user will use to select units
//   unitDisplay  - the text element that the selected unit string will be displayed in
CONTAM.Units.SetupUnitInputs = function(unitObject)
{
  //check the unitObject
  if(unitObject == undefined)
    throw new Error('unitObject is undefined.');
  if(unitObject.initialValue == undefined)
    throw new Error('unitObject.initialValue is undefined.');
  if(unitObject.convert == undefined)
    throw new Error('unitObject.convert is undefined.');
  if(unitObject.func == undefined)
    throw new Error('unitObject.func is undefined.');
  if(unitObject.strings == undefined)
    throw new Error('unitObject.strings is undefined.');
  if(unitObject.input == undefined)
    throw new Error('unitObject.input is undefined.');
  if(unitObject.select == undefined)
    throw new Error('unitObject.select is undefined.');

  // the baseValue is stored with the numeric input where the non-base value is input
  unitObject.input.baseValue = unitObject.initialValue;
  if(unitObject.maxValue != null)
    unitObject.input.baseMax = unitObject.maxValue;
  if(unitObject.minValue != null)  
    unitObject.input.baseMin = unitObject.minValue;
  unitObject.input.unitObject = unitObject;
  unitObject.input.addEventListener("change", CONTAM.Units.ChangeUnitValue); 

  // only define the inputs array and add event listener once 
  // in case of using more than one input with one select
  if(unitObject.select.inputs == undefined)
  {
    unitObject.select.inputs = [];
    unitObject.select.addEventListener("input", CONTAM.Units.ChangeUnits); 
  }
  unitObject.select.inputs.push(unitObject.input);
  unitObject.select.unitObject = unitObject;
  
  //clear the combo box
  while(unitObject.select.firstChild)
  {
    unitObject.select.removeChild(unitObject.select.firstChild);
  }
  // add unit strings to combo box
  unitObject.strings.forEach(function(uString, index)
  {
    var opt = document.createElement("option");
    opt.innerHTML = uString;
    opt.value = index;
    unitObject.select.appendChild(opt);
  });
  unitObject.select.selectedIndex = unitObject.convert;

  //check if the unit display parameter is set
  if(unitObject.unitDisplay != undefined)
  {
    if(unitObject.select.displayUnits == undefined)
      unitObject.select.displayUnits = [];
    unitObject.select.displayUnits.push(unitObject.unitDisplay);
  }
  // this will make the input display the value in the proper units
  CONTAM.Units.ChangeUnits.apply(unitObject.select);
}

// this occurs when the user changes the select element  which holds the unit options
// it can also occur from the SetupUnitInputs function
// this changes the input to display the value in the correct units
// it also changes the unitDisplays to display the newly selected units
CONTAM.Units.ChangeUnits = function ()
{
  this.unitObject.convert = this.selectedIndex; 
  for(var i=0; i<this.inputs.length; ++i)
  {
    this.inputs[i].unitObject.convert = this.selectedIndex;
    //since the units have changed the min and max must also change to the new units
    // if they are present
    if(this.inputs[i].baseMax != null)
      this.inputs[i].max = this.unitObject.func(this.inputs[i].baseMax,
        this.unitObject.convert, 0);
    if(this.inputs[i].baseMin != null)
      this.inputs[i].min = this.unitObject.func(this.inputs[i].baseMin,
        this.unitObject.convert, 0);
  
    // for each input assigned to this select
    // change the display of the value to the new units selected
    var convertedValue = this.unitObject.func(this.inputs[i].baseValue,
      this.unitObject.convert, 0);
    // use sprintf to cut down the digits in the number
    // convert back to a number using parseFloat
    var printvalue = parseFloat(sprintf("%4.5g", convertedValue));
    this.inputs[i].value = printvalue;
  }
  
  if(this.displayUnits)
  {
    // if there are any displayUnits
    // show the currently selected units 
    for(var i=0; i<this.displayUnits.length; ++i)
    {
      // get the units string that is selected in the select element 
      // and put it in the unit display
      this.displayUnits[i].textContent = this.options[this.selectedIndex].text;
    }
  }
}

// this occurs when the value of the numeric input changes from user input
CONTAM.Units.ChangeUnitValue = function ()
{
  //convert from non-base to base units and store the result in basevalue
  this.baseValue = this.unitObject.func(parseFloat(this.value), 
    this.unitObject.convert, 1);
  //console.log("new base value: " + this.baseValue);
}

// unitObject     - an object with unit data / objects chich must be included which are:
//   initialValue - this is a number field which holds the base value of the field
//   convert      - the units to use to display the unit value and the select will be set to this index
//   func         - this is the function, usually in this file, that will be used to do the unit conversion
//   strings      - this is the array of unit strings to add to the select, usually is from the unit strings above
//   input        - the input element that the user will input the unit value
//   select       - the select element that the user will use to select units
//   unitDisplay  - the text element that the selected unit string will be displayed in
//   species      - the species to use in the unit conversion
CONTAM.Units.SetupSpeciesUnitInputs = function(unitObject)
{
  //check the unitObject
  if(unitObject == undefined)
    throw new Error('unitObject is undefined.');
  if(unitObject.initialValue == undefined)
    throw new Error('unitObject.initialValue is undefined.');
  if(unitObject.convert == undefined)
    throw new Error('unitObject.convert is undefined.');
  if(unitObject.func == undefined)
    throw new Error('unitObject.func is undefined.');
  if(unitObject.strings == undefined)
    throw new Error('unitObject.strings is undefined.');
  if(unitObject.input == undefined)
    throw new Error('unitObject.input is undefined.');
  if(unitObject.select == undefined)
    throw new Error('unitObject.select is undefined.');
  if(unitObject.species == undefined)
    throw new Error('unitObject.species is undefined.');
  
  // the basevalue is stored with the numeric input where the non-base value is input
  unitObject.input.baseValue = unitObject.initialValue;
  if(unitObject.maxValue != null)
    unitObject.input.baseMax = unitObject.maxValue;
  if(unitObject.minValue != null)  
    unitObject.input.baseMin = unitObject.minValue;
  unitObject.input.unitObject = unitObject;
  unitObject.input.addEventListener("change", CONTAM.Units.ChangeSpeciesUnitValue); 
  
  // only define the inputs array and add event listener once 
  // in case of using more than one input with one select
  if(unitObject.select.inputs == undefined)
  {
    unitObject.select.inputs = [];
    unitObject.select.addEventListener("input", CONTAM.Units.ChangeSpeciesUnits); 
  }
  unitObject.select.inputs.push(unitObject.input);
  unitObject.select.unitObject = unitObject;

  //clear the combo box
  while(unitObject.select.firstChild)
  {
    unitObject.select.removeChild(unitObject.select.firstChild);
  }
  // add unit strings to combo box
  unitObject.strings.forEach(function(uString, index)
  {
    var opt = document.createElement("option");
    opt.innerHTML = uString;
    opt.value = index;
    unitObject.select.appendChild(opt);
  });
  unitObject.select.selectedIndex = unitObject.convert;

  //check if the unit display parameter is set
  if(unitObject.unitDisplay != undefined)
  {
    if(unitObject.select.displayUnits == undefined)
      unitObject.select.displayUnits = [];
    unitObject.select.displayUnits.push(unitObject.unitDisplay);
  }
  CONTAM.Units.ChangeSpeciesUnits.apply(unitObject.select);
}

// this occurs when the user changes the select element  which holds the unit options
// it can also occur from the SetupUnitInputs function
// this changes the input to display the value in the correct units
// it also changes the unitDisplays to display the newly selected units
CONTAM.Units.ChangeSpeciesUnits = function ()
{
  this.unitObject.convert = this.selectedIndex; 
  for(var i=0; i<this.inputs.length; ++i)
  {
    this.inputs[i].unitObject.convert = this.selectedIndex;
    //since the units have changed the min and max must also change to the new units
    // if they are present
    if(this.inputs[i].baseMax != null)
      this.inputs[i].max = this.unitObject.func(this.inputs[i].baseMax,
        this.unitObject.convert, 0, this.unitObject.species);
    if(this.inputs[i].baseMin != null)
      this.inputs[i].min = this.unitObject.func(this.inputs[i].baseMin,
        this.unitObject.convert, 0, this.unitObject.species);
    // for each input assigned to this select
    // change the display of the value to the new units selected
    var convertedValue = this.unitObject.func(this.inputs[i].baseValue,
      this.unitObject.convert, 0, this.unitObject.species);
    // use sprintf to cut down the digits in the number
    // convert back to a number using parseFloat
    var printvalue = parseFloat(sprintf("%4.5g", convertedValue));
    this.inputs[i].value = printvalue;
  }
  
  if(this.displayUnits)
  {
    // if there are any displayUnits
    // show the currently selected units 
    for(var i=0; i<this.displayUnits.length; ++i)
    {
      // get the units string that is selected in the select element 
      // and put it in the unit display
      this.displayUnits[i].textContent = this.options[this.selectedIndex].text;
    }
  }
}

// this occurs when the value of the numeric input changes from user input
CONTAM.Units.ChangeSpeciesUnitValue = function ()
{
  //convert from non-base to base units and store the result in basevalue
  this.baseValue = this.unitObject.func(parseFloat(this.value), 
    this.unitObject.convert, 1, this.unitObject.species);
}
