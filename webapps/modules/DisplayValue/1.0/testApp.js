import { DisplayValue } from "./DisplayValue.js";
import { eventMixin } from "../EventMixin/EventMixin.js"

class DisplayStringState{
  #value;
  
  constructor(){
    this.#value = "<div style='color: brown'>hello world</div>";
  }
  
  get value(){
    return this.#value;
  }
  
  set value(v){
    if(v != this.#value){
      this.#value = v;
      this.trigger("value", v);
    }
  }

}
// Add the mixin with event-related methods
Object.assign(DisplayStringState.prototype, eventMixin);

document.state = new DisplayStringState();
