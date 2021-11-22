import { SelectValue } from "../modules/SelectValue/1.0/SelectValue.js";
import { eventMixin } from "../modules/EventMixin/EventMixin.js"
import { sprintf } from "../modules/sprintf/sprintf.js";
import { DisplayValue } from "../modules/DisplayValue/1.0/DisplayValue.js"
import { HoverBox } from "../modules/hoverBox/1.0/hoverbox.js"

export class ViperCaseState {
  #bldgSize;
  #visitDuration;
  #addRunTime;
  #pac;
  #vent;
  #filt;
  #fanOp;
  #programState;
  #integratedExposure;
  #particleCount;
  #status;
  #statusColor;
  #integratedExposure60;
  #particleCount60;
  #status60;
  #statusColor60;

  constructor(programState) {
    this.#bldgSize = "Sma";
    this.#visitDuration = "Visit030";
    this.#addRunTime = "Add00";
    this.#pac = "PACNone";
    this.#vent = "VentNo";
    this.#filt = "FiltNon";
    this.#fanOp = "FanInt";
    this.setCase = this.setCase.bind(this);
    this.#programState = programState;
  }

  get bldgSize(){
    return this.#bldgSize;
  }
  set bldgSize(v){
    if(v != this.#bldgSize){
      this.#bldgSize = v;
      this.trigger("bldgSize", v);
      this.setCases();
    }
  }
  
  get bldgSizeOptions(){
    return ["Small", "Medium", "Large"];
  }
  
  get bldgSizeValues(){
    return ["Sma", "Med", "Lar"];
  }
  
  get visitDuration(){
    return this.#visitDuration;
  }
  set visitDuration(v){
    if(v != this.#visitDuration){
      this.#visitDuration = v;
      this.trigger("visitDuration", v);
      this.setCases();
    }
  }

  get visitDurationOptions() {
    return ["1/2 hour", "2 Hours", "4 Hours"];
  }
  
  get visitDurationValues() {
    return ["Visit030", "Visit120", "Visit240"];
  }

  get addRunTime(){
    return this.#addRunTime;
  }
  set addRunTime(v){
    if(v != this.#addRunTime){
      this.#addRunTime = v;
      this.trigger("addRunTime", v);
      this.setCases();
    }
  }

  get addRunTimeOptions() {
    return ["None", "60 Minutes"];
  }
  
  get addRunTimeValues() {
    return ["Add00", "Add60"];
  }

  get pac(){
    return this.#pac;
  }
  set pac(v){
    if(v != this.#pac){
      this.#pac = v;
      this.trigger("pac", v);
      this.setCases();
    }
  }

  get pacOptions() {
    return ["None", "Low speed", "High speed"];
  }
  
  get pacValues() {
    return ["PACNone", "PACMedi", "PACHigh"];
  }

  get vent(){
    return this.#vent;
  }
  set vent(v){
    if(v != this.#vent){
      this.#vent = v;
      this.trigger("vent", v);
      this.setCases();
    }
  }

  get ventOptions() {
    return ["None/Don't Know", "Low", "High", "Window Only"];
  }
  
  get ventValues() {
    return ["VentNo", "VentLo", "VentHi", "VentWi"];
  }

  get filt(){
    return this.#filt;
  }
  set filt(v){
    if(v != this.#filt){
      this.#filt = v;
      this.trigger("filt", v);
      this.setCases();
    }
  }

  get filtOptions() {
    return ["None/Don't Know", "MERV 6", "MERV 13"];
  }
  
  get filtValues() {
    return ["FiltNon", "FiltM06", "FiltM13"];
  }

  get fanOp(){
    return this.#fanOp;
  }
  set fanOp(v){
    if(v != this.#fanOp){
      this.#fanOp = v;
      this.trigger("fanOp", v);
      this.setCases();
    }
  }

  get fanOpOptions() {
    return ["AUTO/Intermittent", "ON/Continuous"];
  }
  
  get fanOpValues() {
    return ["FanInt", "FanCon"];
  }
  
  get integratedExposure(){
    return this.#integratedExposure;
  }
  set integratedExposure(v){
    if(v != this.#integratedExposure){
      this.#integratedExposure = v;
      this.trigger("integratedExposure", v);
    }
  }
  
  get integratedExposure60(){
    return this.#integratedExposure60;
  }
  set integratedExposure60(v){
    if(v != this.#integratedExposure60){
      this.#integratedExposure60 = v;
      this.trigger("integratedExposure60", v);
    }
  }
  
  get particleCount(){
    return this.#particleCount;
  }
  set particleCount(v){
    if(v != this.#particleCount){
      this.#particleCount = v;
      this.trigger("particleCount", v);
    }
  }
  
  get particleCount60(){
    return this.#particleCount60;
  }
  set particleCount60(v){
    if(v != this.#particleCount60){
      this.#particleCount60 = v;
      this.trigger("particleCount60", v);
    }
  }
  
  get status(){
    return this.#status;
  }
  set status(v){
    if(v != this.#status){
      this.#status = v;
      this.trigger("status", v);
    }
  }
  
  get status60(){
    return this.#status60;
  }
  set status60(v){
    if(v != this.#status60){
      this.#status60 = v;
      this.trigger("status60", v);
    }
  }
  
  get statusColor(){
    return this.#statusColor;
  }
  set statusColor(v){
    if(v != this.#statusColor){
      this.#statusColor = v;
      this.trigger("statusColor", v);
    }
  }
  
  get statusColor60(){
    return this.#statusColor60;
  }
  set statusColor60(v){
    if(v != this.#statusColor60){
      this.#statusColor60 = v;
      this.trigger("statusColor60", v);
    }
  }
  
  setCases(){
      this.#programState.cases.forEach((acase) =>  acase.setCase());
  }
  
  setCase(){
    if(this.#programState.cases.length == 0){
      return;
    }
    //console.log('setCase');

    let caseName = "Single_";
    caseName += this.#bldgSize;

    caseName += "_" + this.#visitDuration;
    caseName += "_" + this.#addRunTime;
    caseName += "_" + this.#pac;
    caseName += "_" + this.#vent;
    caseName += "_" + this.#filt;
    caseName += "_" + this.#fanOp;
    //console.log(caseName);
    //console.log(this.#programState.results[caseName]);
    this.integratedExposure = this.#programState.results['IE_EOV'][caseName];
    this.integratedExposure60 = this.#programState.results['IE_EOV+60'][caseName];
    this.particleCount = this.#programState.results['CZone_EOV'][caseName];
    this.particleCount60 = this.#programState.results['CZone_EOV+60'][caseName];
    //console.log(this.particleCount);
    //console.log(this.particleCount60);

    // if this is the base case
    if(this.#programState.cases.indexOf(this) == 0){
      this.status = "&nbsp;"
      this.status60 = "&nbsp;"
    } else {
      if(this.#programState.resultType == "Part"){
        //console.log('part');
        // Part
        let basePart = this.#programState.cases[0].particleCount;
        let casePart = this.#particleCount;
        console.log("base part: " + basePart);
        console.log("comp part: " + casePart);
        let change;
        if(basePart > casePart){
          change = (basePart - casePart) / basePart * 100;
          this.status = sprintf("%4g", Math.round(change))  + "% decrease";
          this.statusColor = "green";
          
        } else if(basePart < casePart) {
          change = (casePart - basePart) / basePart * 100;
          console.log('change: ' + change);
          if(change >= 100){
            this.status = sprintf("%4.2g", (change+100)/100)  + " times greater";
          } else {
            this.status = sprintf("%4g", Math.round(change))  + "% increase";
          }
          this.statusColor = "red";
        } else {
          this.status = "No change."
          this.statusColor = "black";
        }
        // Part + 60
        let basePart60 = this.#programState.cases[0].particleCount60;
        let casePart60 = this.#particleCount60;
        console.log("base60: " + basePart60);
        console.log("comp60: " + casePart60);
        let change60;
        if(basePart60 > casePart60){
          change60 = (basePart60 - casePart60) / basePart60 * 100;
          this.status60 = sprintf("%4g", Math.round(change60))  + "% decrease";
          this.statusColor60 = "green";
          
        } else if(basePart60 < casePart60) {
          change60 = (casePart60 - basePart60) / basePart60 * 100;
          console.log('change60: ' + change60);
          if(change60 >= 100){
            this.status60 = sprintf("%4.2g", (change60+100)/100)  + " times greater";
          } else {
            this.status60 = sprintf("%4g", Math.round(change60))  + "% increase";
          }
          this.statusColor60 = "red";
        } else {
          this.status60 = "No change."
          this.statusColor60 = "black";
        }
      } else {
        // IE
        //console.log('IE');
        let baseIE = this.#programState.cases[0].integratedExposure;
        let caseIE = this.#integratedExposure;
        console.log("base IE: " + baseIE);
        console.log("comp IE: " + caseIE);
        let change;
        if(baseIE > caseIE){
          change = (baseIE - caseIE) / baseIE * 100;
          this.status = sprintf("%4g", Math.round(change))  + "% decrease";
          this.statusColor = "green";
          
        } else if(baseIE < caseIE) {
          change = (caseIE - baseIE) / baseIE * 100;
          console.log('change: ' + change);
          if(change >= 100){
            this.status = sprintf("%4.2g", (change+100)/100)  + " times greater";
          } else {
            this.status = sprintf("%4g", Math.round(change))  + "% increase";
          }
          this.statusColor = "red";
        } else {
          this.status = "No change."
          this.statusColor = "black";
        }
        // IE + 60
        let baseIE60 = this.#programState.cases[0].integratedExposure60;
        let caseIE60 = this.#integratedExposure60;
        console.log("base60: " + baseIE60);
        console.log("comp60: " + caseIE60);
        let change60;
        if(baseIE60 > caseIE60){
          change60 = (baseIE60 - caseIE60) / baseIE60 * 100;
          this.status60 = sprintf("%4g", Math.round(change60))  + "% decrease";
          this.statusColor60 = "green";
          
        } else if(baseIE60 < caseIE60) {
          change60 = (caseIE60 - baseIE60) / baseIE60 * 100;
          console.log('change60: ' + change60);
          if(change60 >= 100){
            this.status60 = sprintf("%4.2g", (change60+100)/100)  + " times greater";
          } else {
            this.status60 = sprintf("%4g", Math.round(change60))  + "% increase";
          }
          this.statusColor60 = "red";
        } else {
          this.status60 = "No change."
          this.statusColor60 = "black";
        }
      }
    }
  }
}
Object.assign(ViperCaseState.prototype, eventMixin);

export class ViperCase extends HTMLElement {
  #state;
  #stateStringsProperty;
  #stateLocation;

  static ViperCaseCounter = 0;

  constructor() {
    super();
    const template = document.createElement('template');
    //let id = this.constructor.ViperCaseCounter++;

    template.innerHTML = `
      <link href="app.css" rel="stylesheet">
      <style>
        .worse{
          color: red;
        }
        .better{
          color: green;
        }
        .nochange{
          color: black;
        }
        .flex-end{
          display: flex;
          align-items:flex-end;
          justify-content:space-between;
        }
        
        .tooltip{
          background-color: #e4f2fc;
          width: 700px;
          border: double 5px #12659c;
          padding:1ex;
        }
      </style>
      <div style="margin:5px;" class="section">
        <h3 id="caseHeading" style="margin:1ex 0px;">Case</h3>
        <div style="display:grid;row-gap: 1ex;">
          <div class="flex-end">
            <select-value id="bldgSizeSelect" value="bldgSize" strings="bldgSizeOptions" values="bldgSizeValues">Home Size</select-value>
            <hover-box>
              <img slot="pageContent" class="helpIcon" src="../../images/Info_icon.svg" width="25" height="25" style="vertical-align: top;display:none;" alt="information icon">
              <div slot="boxContent" class="tooltip">
                <div>Select the option that most closely reflects the home size where the visit will take place. </div>
                <ul>
                  <li>‘Small’ = 92.9 m<sup>2</sup> (1,000 ft<sup>2</sup>)</li>
                  <li>‘Medium’ = 162.6 m<sup>2</sup> (1,750 ft<sup>2</sup>)</li>
                  <li>‘Large’ = 232.3 m<sup>2</sup> (2,500 ft<sup>2</sup>)</li>
                </ul>
              </div>
            </hover-box>
          </div>
          <div class="flex-end">
            <select-value id="visitDurationSelect" value="visitDuration" strings="visitDurationOptions" values="visitDurationValues">Visit Duration</select-value>
            <hover-box>
              <img slot="pageContent" class="helpIcon" src="../../images/Info_icon.svg" width="25" height="25" style="vertical-align: top;display:none;" alt="information icon">
              <div slot="boxContent" class="tooltip">
                <div>Select the option that most closely reflects the length of time the visitor will continuously be in the home.</div>
              </div>
            </hover-box>
          </div>
          <div class="flex-end">
            <select-value id="pacSelect" value="pac" strings="pacOptions" values="pacValues">Portable Air Cleaner</select-value>
            <hover-box>
              <img slot="pageContent" class="helpIcon" src="../../images/Info_icon.svg" width="25" height="25" style="vertical-align: top;display:none;" alt="information icon">
              <div slot="boxContent" class="tooltip">
                <div>Select the option that most closely reflects the clean air delivery rate of the HEPA portable air cleaner that will be operating inside the  home during the visit. Clean air delivery rate (CADR) is defined by ANSI/AHAM AC-1: Method for Measuring the Performance of Portable Household Electric Room Air Cleaners for smoke particles.
                  <ul>
                    <li>‘None’ = No portable air cleaner or will be off</li>
                    <li>‘Medium’ = 99 CADR</li>
                    <li>‘High’ = 297 CADR</li>
                  </ul>
                </div>
              </div>
            </hover-box>
          </div>
          <div class="flex-end">
            <select-value id="fanOpSelect" value="fanOp" strings="fanOpOptions" values="fanOpValues"><abbr title="Heating, Ventilation and Air Condtioning System">HVAC</abbr> Fan Operation</select-value>
            <hover-box>
              <img slot="pageContent" class="helpIcon" src="../../images/Info_icon.svg" width="25" height="25" style="vertical-align: top;display:none;" alt="information icon">
              <div slot="boxContent" class="tooltip">
                <div>Select the option that most closely reflects how the home’s HVAC system will be operated during the visit. To model a system that is ‘off’, select ‘None/Don't Know’ and the ‘AUTO/Intermittent’ fan operation.
                  <ul>
                    <li>‘AUTO/Intermittent’ = operates according to thermostat. Keep in mind that your system’s operation time may be less (or more) than the time assumed in this tool.</li>
                    <li>‘ON/Constant’ </li>
                  </ul>
                </div>
              </div>
            </hover-box>
          </div>
          <div class="flex-end">
            <select-value id="filtSelect" value="filt" strings="filtOptions" values="filtValues"><abbr title="Heating, Ventilation and Air Condtioning System">HVAC</abbr> Filter</select-value>
            <hover-box>
              <img slot="pageContent" class="helpIcon" src="../../images/Info_icon.svg" width="25" height="25" style="vertical-align: top;display:none;" alt="information icon">
              <div slot="boxContent" class="tooltip">
                <div>Select the option that most closely reflects what type of filter is placed within the home’s HVAC system. If you have a system that only recirculates air (split-system, window air conditioner, baseboard heating, etc.), select ‘None/Don't Know’. To model a system that is ‘off’, select ‘None/Don't Know’ and the ‘AUTO/Intermittent’ fan operation.
                  <ul>
                    <li>‘None/Don't Know’</li>
                    <li>MERV 6</li>
                    <li>MERV 13</li>
                  </ul>
                </div>
              </div>
            </hover-box>
          </div>
          <div class="flex-end">
            <select-value id="ventSelect" value="vent" strings="ventOptions" values="ventValues">Outdoor Air Ventilation</select-value>
            <hover-box>
              <img slot="pageContent" class="helpIcon" src="../../images/Info_icon.svg" width="25" height="25" style="vertical-align: top;display:none;" alt="information icon">
              <div slot="boxContent" class="tooltip">
                <div>Select the option that most closely reflects how the home’s mechanical ventilation system will be operated during the visit. Mechanical ventilation is any outdoor air that is brought in (or drawn in) by a mechanical fan, such as a system attached to a central heating/air-conditioning system or an exhaust fan. Choose the “Low” option if you have a mechanical ventilation system but do not know its airflow rate.
                  <ul>
                    <li>‘None/Don't Know’ = No mechanical ventilation system present</li>
                    <li>‘Low’ = Mechanical ventilation meets ASHRAE Standard 62.2 </li>
                    <li>‘High’ = Mechanical ventilation meets ASHRAE Standard 62.2 plus additional fan(s) (window fans, supply fans, exhaust fans, and other fans that move outdoor air into or remove air from a home (not a ceiling or recirculating fan))</li>
                    <li>‘Window only’</li>
                  </ul>
                </div>
              </div>
            </hover-box>
          </div>
          <div class="flex-end">
            <select-value id="addRunTimeSelect" value="addRunTime" strings="addRunTimeOptions" values="addRunTimeValues">Post-Visit Runtime</select-value>
            <hover-box>
              <img slot="pageContent" class="helpIcon" src="../../images/Info_icon.svg" width="25" height="25" style="vertical-align: top;display:none;" alt="information icon">
              <div slot="boxContent" class="tooltip">
                <div>Select the option that most closely reflects how long systems will continue to operate once the visitor has left the home. For instance, this tool assumes that if “60 minutes” is selected, all three controls – if selected – will run an additional 60 minutes.
                  <ul>
                    <li>‘None’ = Systems off once visitor has left the home</li>
                    <li>’60 minutes’ = Systems remain on for an hour after visitor has left the home</li>
                  </ul>
                </div>
              </div>
            </hover-box>
          </div>
          <h4 id="expChangeHeading" style="margin:1ex 0px;">Result change from base:</h4>
          <div id="expChangeAV" style="font-weight:bold;">End of visit:</div>
          <display-value id="statusDisplay" value="status"></display-value>
          <div id="expChange60" style="font-weight:bold;">60 minutes after visit:</div>
          <display-value id="statusDisplay60" value="status60"></display-value>
        </div>
      </div>
    `;

    // ensure that the 'this' for these functions is the instance of this class 
    // other wise it would likely be the window object
    this.onLoad = this.onLoad.bind(this);
    this.changeStatusColor = this.changeStatusColor.bind(this);
    this.changeStatusColor60 = this.changeStatusColor60.bind(this);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.visitDurationSelect = this.shadowRoot.querySelector('#visitDurationSelect');
    this.addRunTimeSelect = this.shadowRoot.querySelector('#addRunTimeSelect');
    this.bldgSizeSelect = this.shadowRoot.querySelector('#bldgSizeSelect');
    this.pacSelect = this.shadowRoot.querySelector('#pacSelect');
    this.ventSelect = this.shadowRoot.querySelector('#ventSelect');
    this.filtSelect = this.shadowRoot.querySelector('#filtSelect');
    this.fanOpSelect = this.shadowRoot.querySelector('#fanOpSelect');
    this.caseHeading = this.shadowRoot.querySelector('#caseHeading');
    this.statusDisplay = this.shadowRoot.querySelector('#statusDisplay');
    this.statusDisplay.style.fontSize = "20px";
    this.statusDisplay60 = this.shadowRoot.querySelector('#statusDisplay60');
    this.statusDisplay60.style.fontSize = "20px";
    this.expChangeHeading = this.shadowRoot.querySelector('#expChangeHeading');
    this.expChangeAV = this.shadowRoot.querySelector('#expChangeAV');
    this.expChange60 = this.shadowRoot.querySelector('#expChange60');
  }

  connectedCallback() {
    //this.valueSelect.addEventListener('change', this.onSelectChange);

    this.#stateLocation = this.getAttribute('state');
    //console.log('this.#stateLocation: ' + this.#stateLocation);

    document.addEventListener('DOMContentLoaded', this.onLoad);
  }
  
  onLoad(){
    this.state = new Function("return " + this.#stateLocation)();//document[this.#stateLocation];
  }

  disconnectedCallback() {
    //this.valueSelect.removeEventListener('change', this.onSelectChange);
  }
  
  get state() {
    return this.#state;
  }

  set state(newState) {
    //console.log('newstate');
    if(this.#state != newState){
      this.#state = newState;
      this.onStateChange();
    }
  }
  
  onStateChange(){
    //console.log('onStateChange');
    //console.log(this.#state.results);
    this.case = new ViperCaseState(this.#state);
    this.case.on("statusColor", this.changeStatusColor);
    this.case.on("statusColor60", this.changeStatusColor60);
    this.#state.cases.push(this.case);
    this.case.setCase();
    if(this.#state.cases.length == 1){
      this.caseHeading.textContent = "Base Case";
      this.expChangeHeading.innerHTML = "&nbsp;";
      this.expChangeAV.innerHTML = "&nbsp;";
      this.expChange60.innerHTML = "&nbsp;";
      let helpItems = this.shadowRoot.querySelectorAll('.helpIcon');
      helpItems.forEach((helpItem) => {
        helpItem.style.display = "inline";
      });
    } else {
      this.caseHeading.textContent = "Comparison Case " + (this.#state.cases.length - 1);
    }
    this.visitDurationSelect.state = this.case;
    this.addRunTimeSelect.state = this.case;
    this.bldgSizeSelect.state = this.case;
    this.pacSelect.state = this.case;
    this.ventSelect.state = this.case;
    this.filtSelect.state = this.case;
    this.fanOpSelect.state = this.case;
    //console.log("get results");
    //console.dir(this.#state.results);
    this.statusDisplay.state = this.case;
    this.statusDisplay60.state = this.case;
  }

  changeStatusColor(){
    this.statusDisplay.style.color = this.case.statusColor;
  }

  changeStatusColor60(){
    this.statusDisplay60.style.color = this.case.statusColor60;
  }
}

window.customElements.define('viper-case', ViperCase);
