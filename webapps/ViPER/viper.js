import { SelectValue } from "../modules/SelectValue/1.0/SelectValue.js";
import { eventMixin } from "../modules/EventMixin/EventMixin.js"
import { sprintf } from "../modules/sprintf/sprintf.js";
import { AutoButton } from "../modules/AutoButton/1.0/AutoButton.js";
import { HowtoTabs, HowtoTab, HowtoPanel } from "../modules/howto-tabs/howto-tabs.js";
import { ViperCase } from "./case.js";
import { HoverBox } from "../modules/hoverBox/1.0/hoverbox.js"

class Viper {
  // declare private variables
  #cases;
  #results;
  #resultType;
  
  constructor(){
    this.#cases = [];
    this.#resultType = "Part";
        
    this.receiveResultFile = this.receiveResultFile.bind(this);
    this.addCase = this.addCase.bind(this);
    this.resultTypeSelect = document.querySelector('#resultTypeSelect');
    this.resultTypeSelect.state = this;

    //fetch the result file
    let myRequest = new Request("results.json");
    let responseFunc = this.receiveResultFile;
    fetch(myRequest).then(function(response) {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
      }
      return response.json().then(responseFunc);
    });

  }

  get resultType(){
    return this.#resultType;
  }
  set resultType(v){
    if(v != this.#resultType){
      this.#resultType = v;
      this.trigger("resultType", v);
      this.cases.forEach((acase) =>  acase.setCase());
    }
  }

  get resultTypeOptions() {
    return ["Particle Concentration", "Integrated Exposure"];
  }
  
  get resultTypeValues() {
    return ["Part", "IE"];
  }
  
  receiveResultFile(results){
    //console.log("received results");
    //console.dir(results);
    this.#results = results;
    
    let caseObjs = document.querySelectorAll("viper-case");
    //console.dir(caseObjs);
    for(let caseObj of Array.from(caseObjs)){
      caseObj.state = this;
    }
    //console.dir("states set");
  }
  
  addCase(){
    let caseContainer = document.querySelector("#caseContainer");

    let fcase = document.createElement("viper-case");
    caseContainer.appendChild(fcase);
    fcase.state = this;
  }

  get cases(){
    return this.#cases;
  }
  
  set cases(v){
    if(v != this.#cases){
      this.#cases = v;
      this.trigger("cases", v);
    }
  }
  
  get results(){
    return this.#results;
  }
    
}
// add the eventMixin so the Viper class can do events
Object.assign(Viper.prototype, eventMixin);

//console.log('create state');
document.state = new Viper();
