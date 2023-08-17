import { SelectValue } from "./SelectValue.js";
import { eventMixin } from "../EventMixin/EventMixin.js"
import { AutoButton } from "../AutoButton/AutoButton.js"

class SelectValueState{
  #selectedValue;
  #displayStrings;
  #values;
  
  constructor(){
    this.#selectedValue = 2;
    this.#displayStrings = ['first', 'second', 'third'];
    this.#values = [1, 2, 3];
  }
  
  get selectedValue(){
    return this.#selectedValue;
  }
  set selectedValue(v){
    if(v != this.#selectedValue){
      this.#selectedValue = v;
      this.trigger("selectedValue", v);
    }
  }
  
  get displayStrings(){
    return this.#displayStrings;
  }
  set displayStrings(v){
    if(v != this.#displayStrings){
      this.#displayStrings = v;
      this.trigger("displayStrings", v);
    }
  }

  get values(){
    return this.#values;
  }
  set values(v){
    if(v != this.#values){
      this.#values = v;
      this.trigger("values", v);
    }
  }
  
  setNewOptions(){
    this.displayStrings = ['1st', '2nd', '3rd'];
    this.values = [4,5,6];
    this.selectedValue = 5;
  }
}
Object.assign(SelectValueState.prototype, eventMixin);
console.log('create state');
document.state = new SelectValueState();

const app = () => {
  let selectTest = document.getElementById("selectTest");
  //selectTest.stateStringsProperty = 'displayStrings';
  //selectTest.stateValuesProperty = 'values';
  //selectTest.stateValueProperty = 'selectedValue';
  //let state = new SelectValueState()
  //state.selectedValue = 'second';
  //selectTest.state = state;
  let selValue = document.querySelector("#selValue");
  selValue.value = document.state.selectedValue;
  
  document.state.on("selectedValue",  () => {
    let selValue = document.querySelector("#selValue");
    selValue.value = document.state.selectedValue;
  });
};

setTimeout(app, 0);
