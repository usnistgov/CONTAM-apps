
export class DisplayValue extends HTMLElement {
  #state;
  #stateProperty;
  #stateLocation;
  
  constructor() {
    super();
    const template = document.createElement('template');

    template.innerHTML = `
      <style>
      </style>
      <div>
        <div id="container" style="padding:5px;"></div>
      </div>
    `;

    // these ensure that when these functions are called that the 'this' variable is set to the instance of this class
    this.newValue = this.newValue.bind(this);
    this.onLoad = this.onLoad.bind(this);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.valueContainer = this.shadowRoot.querySelector('#container');
  }

  connectedCallback() {
    
    this.#stateProperty = this.getAttribute('value');
    this.#stateLocation = this.getAttribute('state');
    //console.log('this.#stateProperty: ' + this.#stateProperty);
    //console.log('this.#stateLocation: ' + this.#stateLocation);

    document.addEventListener('DOMContentLoaded', this.onLoad);
  }
  
  onLoad(){
    //this.state = document[this.#stateLocation];
    this.state = new Function("return " + this.#stateLocation)();//document[this.#stateLocation];
  }
  
  updateValueDisplay() {
    //console.log('edit value update value display:');
    //console.dir(this.#state);
    //console.dir(this.#stateProperty);
    //console.dir(this.#state[this.#stateProperty]);
    if(this.#state[this.#stateProperty] != undefined){
        this.valueContainer.innerHTML = this.#state[this.#stateProperty];
    }
  }

  disconnectedCallback() {
    document.removeEventListener('DOMContentLoaded', this.onLoad);
  }
  
  get stateProperty() {
    return this.#stateProperty;
  }

  set stateProperty(newStateProperty) {
    this.#stateProperty = newStateProperty;
  }
  
  get state() {
    return this.#state;
  }

  set state(newState) {
    //console.log("edit state change: " + newState);
    this.#state = newState;
    if(this.#state && this.#stateProperty){
      //console.log("edit state change");
      this.#state.on(this.#stateProperty, this.newValue);
      this.updateValueDisplay();
    }
  }
  
  newValue(){
    this.updateValueDisplay();
  }

}

window.customElements.define('display-value', DisplayValue);
