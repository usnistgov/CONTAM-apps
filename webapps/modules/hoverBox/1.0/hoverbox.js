
export class HoverBox extends HTMLElement {
  constructor() {
    super();
    this._state = {};
    
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        #boxContent{
          position: absolute;
          top:100%;
          left: calc(100% + 15px);
          display:none;
          z-index: 20;
        }
      </style>
      <div style="position:relative;display:inline-block;" id="compContent" part="container">
        <div id="pageContent" part="pageContent">
          <slot name="pageContent"></slot>
        </div>
        <div id="boxContent" part="boxContent">
          <slot name="boxContent"></slot>
        </div>
      </div>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.pageContent = this.shadowRoot.querySelector('#pageContent');
    this.boxContent = this.shadowRoot.querySelector('#boxContent');
    this.clickContent = this.clickContent.bind(this);
    this.clickOutside = this.clickOutside.bind(this);
    this.mouseEnterContent = this.mouseEnterContent.bind(this);
    this.mouseLeaveContent = this.mouseLeaveContent.bind(this);

  }

  connectedCallback() {
    //console.log('connectedCallback');
    this.pageContent.addEventListener('click', this.clickContent);
    this.pageContent.addEventListener('mouseenter', this.mouseEnterContent);
    this.pageContent.addEventListener('mouseleave', this.mouseLeaveContent);
    document.body.addEventListener('click', this.clickOutside, true); 
  }

  disconnectedCallback() {
    this.pageContent.removeEventListener('click', this.clickContent);
    this.pageContent.removeEventListener('mouseenter', this.mouseEnterContent);
    this.pageContent.removeEventListener('mouseleave', this.mouseLeaveContent);
    document.body.removeEventListener('click', this.clickOutside, true); 
  }

  clickContent() {
    this.boxContent.style.display = "block";
  }
  
  clickOutside(){
    this.boxContent.style.display = "none";
  }
  
  mouseEnterContent(){
    this.boxContent.style.display = "block";
  }
  
  mouseLeaveContent(){
    this.boxContent.style.display = "none";
  }
}

window.customElements.define('hover-box', HoverBox);
