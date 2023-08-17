
export class AutoButton extends HTMLElement {
  #state;
  #stateFuncProperty;
  #stateLocation;
  #stateDisable;

  constructor() {
    super();
    
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        #btn{
        }
      </style>
      <input type="file" id="filebtn" style="display:none;">
      <button part="button" id="btn"><slot>default</slot></button>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.button = this.shadowRoot.querySelector('#btn');
    this.filebutton = this.shadowRoot.querySelector('#filebtn');
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.changeDisable = this.changeDisable.bind(this);
    this.clickFileButton = this.clickFileButton.bind(this);
  }
  
  static get observedAttributes() {
    return ['accept', 'multiple'];
  }
  
  connectedCallback() {
    //console.log('connectedCallback');

    this.button.addEventListener('click', this.onButtonClick);
    
    this.filebutton.addEventListener('change', this.clickFileButton);

    // this attribute is for permanent disabling
    if (this.hasAttribute('disabled')) {
      this.button.disabled = true;
    }
    
    this.#stateFuncProperty = this.getAttribute('func');
    this.#stateLocation = this.getAttribute('state');
    // this attribute is for toggling disable
    this.#stateDisable = this.getAttribute('disableControl');
    if(this.hasAttribute('file')){
      this.isFile = true;
    }
    if(this.isFile && this.hasAttribute('accept')){
      this.filebutton.accept = this.getAttribute('accept');
    }
    if(this.isFile && this.hasAttribute('multiple')){
      this.filebutton.multiple = true;
    }

    //console.log('this.#stateFuncProperty: ' + this.#stateFuncProperty);
    //console.log('this.#stateLocation: ' + this.#stateLocation);
    //console.log('this.#stateDisable: ' + this.#stateDisable);

    document.addEventListener('DOMContentLoaded', this.onLoad);
    document.addEventListener('newState', this.onLoad);
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this.onButtonClick);
    document.removeEventListener('DOMContentLoaded', this.onLoad);
    document.reomveEventListener('newState', this.onLoad);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'accept':
        this.filebutton.accept = newValue;
        break;
      case 'multiple':
        this.filebutton.multiple = this.hasAttribute('multiple');
        break;
  }
}
  get state() {
    return this.#state;
  }

  set state(newState) {
    this.#state = newState;
    if(this.#stateDisable)
      this.#state.on(this.#stateDisable, this.changeDisable);
  }
  
  onLoad(){
    this.state = new Function("return " + this.#stateLocation)();//document[this.#stateLocation];
  }

  clickFileButton(){
    //console.log('clickFileButton');
    //console.dir(this.#state);
    //console.dir(this.#stateFuncProperty);
    this.#state[this.#stateFuncProperty].call(this.#state, this.filebutton.files);
  }
  
  onButtonClick() {
      //console.log('auto-button state: ' + this.state);
    if(this.isFile){
      let fileButton = this.shadowRoot.querySelector('#filebtn');
      fileButton.click();
    } else {    
      //console.log('auto-button state: ' + this.state);
      //this.#state[this.#stateFuncProperty]();
      this.#state[this.#stateFuncProperty].call(this.#state);
    }
  }
  
  changeDisable(newValue){
    //console.log("changeDisable: " + newValue);
    this.button.disabled = newValue;
  }

}

window.customElements.define('auto-button', AutoButton);
