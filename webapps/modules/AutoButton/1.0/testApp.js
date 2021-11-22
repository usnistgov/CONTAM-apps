import { AutoButton } from "./AutoButton.js";

class AutoButtonTestApp {
  constructor(){
    
  }
  
  testButton() {
    alert('clicked');
  }
  testFileButton(files) {
    alert('clicked2');
    console.dir(files);
  }
}
let gbta = new AutoButtonTestApp();
document.state = gbta;

//const app = () => {
//};

//setTimeout(app, 0);
