export class SelectValue extends HTMLElement {
  #state;
  #stateStringsProperty;
  #stateValuesProperty;
  #stateValueProperty;
  #stateLocation;
  #stateDisable;
  
  constructor() {
    super();
    const template = document.createElement('template');

    template.innerHTML = `
      <style>
      </style>
      <div>
        <label id="valueLabel" for="valueSelect"><slot>value label</slot></label><br><select id="valueSelect" part="select"></select> <slot name="extra-text"></slot>
      </div>
    `;

    // ensure that the 'this' for these functions is the instance of this class 
    // other wise it would likely be the window object
    this.onSelectChange = this.onSelectChange.bind(this);
    this.newValue = this.newValue.bind(this);
    this.newValues = this.newValues.bind(this);
    this.newStrings = this.newStrings.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.changeDisable = this.changeDisable.bind(this);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.valueSelect = this.shadowRoot.querySelector('#valueSelect');
    this.connected = false;
  }

  connectedCallback() {
    this.connected = true;
    this.valueSelect.addEventListener('change', this.onSelectChange);

    this.#stateValueProperty = this.getAttribute('value');
    this.#stateStringsProperty = this.getAttribute('strings');
    this.#stateValuesProperty = this.getAttribute('values');
    this.#stateLocation = this.getAttribute('state');
    //console.log('this.#stateValueProperty: ' + this.#stateValueProperty);
    //console.log('this.#stateStringsProperty: ' + this.#stateStringsProperty);
    //console.log('this.#stateValuesProperty: ' + this.#stateValuesProperty);
    //console.log('this.#stateLocation: ' + this.#stateLocation);

    // this attribute is for toggling disable
    this.#stateDisable = this.getAttribute('disableControl');
    //console.log('this.#stateDisable: ' + this.#stateDisable);

    document.addEventListener('DOMContentLoaded', this.onLoad);
  }
  
  onLoad(){
    //console.log(document[this.#stateLocation]);
    //let test = new Function("return document['" + this.#stateLocation + "']")();
    if(!this.state)
      this.state = new Function("return " + this.#stateLocation)();//document[this.#stateLocation];
  }

  onSelectChange() {
    this.#state[this.#stateValueProperty] = this.valueSelect.value;
    // send change event
    let event = new Event("change");
    this.dispatchEvent(event);
  }

  disconnectedCallback() {
    this.valueSelect.removeEventListener('change', this.onSelectChange);
  }
  
  get stateStringsProperty() {
    return this.#stateStringsProperty;
  }

  set stateStringsProperty(newStateProperty) {
    this.#stateStringsProperty = newStateProperty;
  }
  
  get stateValuesProperty() {
    return this.#stateValuesProperty;
  }

  set stateValuesProperty(newStateProperty) {
    this.#stateValuesProperty = newStateProperty;
  }
  
  get stateValueProperty() {
    return this.#stateValueProperty;
  }

  set stateValueProperty(newStateProperty) {
    this.#stateValueProperty = newStateProperty;
  }
  
  get state() {
    return this.#state;
  }

  set state(newState) {
    //console.log('newstate');
    this.#state = newState;
    if(this.#state && this.#stateValueProperty && this.#stateStringsProperty){
      this.#state.on(this.#stateValueProperty, this.newValue);
      this.#state.on(this.#stateValuesProperty, this.newValues);
      this.#state.on(this.#stateStringsProperty, this.newStrings);
      if(this.#stateDisable)
        this.#state.on(this.#stateDisable, this.changeDisable);
      this.onStateChange();
    }
  }
  
  changeDisable(newValue){
    //console.log("changeDisable: " + newValue);
    this.valueSelect.disabled = newValue;
  }
  
  onStateChange(){
    //console.log('onStateChange');
    if(this.#state && this.#stateValueProperty && this.#stateStringsProperty){
      this.valueSelect.options.length = 0;
      this.#state[this.#stateStringsProperty].forEach((value, index) => {
        const opt = document.createElement("option");
        opt.text = value;
        if(this.#stateValuesProperty)
          opt.value = this.#state[this.#stateValuesProperty][index];
        else
          opt.value = value;
        this.valueSelect.add(opt);
      });
      //console.log('this.#state[this.#stateValueProperty]: ' + typeof(this.#state[this.#stateValueProperty]));
      this.valueSelect.value = this.#state[this.#stateValueProperty];
    }
  }
  
  newValue(){
    this.valueSelect.value = this.#state[this.#stateValueProperty];
  }
  
  newValues(){
    this.onStateChange();
  }
  
  newStrings(){
    this.onStateChange();
  }
  
  get disabled() {
    return this.valueSelect.disabled;
  }

  set disabled(newValue) {
    this.valueSelect.disabled = newValue;
  }

}

window.customElements.define('select-value', SelectValue);
