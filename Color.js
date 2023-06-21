(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
    :host {
    border-width: 10px;
    border-color: black;
    border-style: solid;
    width:98%;
    height:300px;
    display: block;
    }
    p {
      text-align: center;
      font-weight: bold;
    }
    </style>
    <p id="middeltext">MANSI</p>
    `;
  class ColoredBox extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this.addEventListener("click", (event) => {
        // alert("Click the button");
        var event = new Event("onClick");
        this.dispatchEvent(event);
      });
      this._props = {};
    }
      
    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = { ...this._props, ...changedProperties };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      if ("color" in changedProperties) {
        this.style["background-color"] = changedProperties["color"];
      }
      if ("opacity" in changedProperties) {
        this.style["opacity"] = changedProperties["opacity"];
      }
      if ("radius" in changedProperties) {
        this.style["border-color"] = changedProperties["radius"];
      }
      if("text"in changedProperties){
        console.log(this._props);
        this.shadowRoot.getElementById("middeltext").innerHTML = changedProperties["text"];
      }
    }
  }
  customElements.define("com-sap-sample-coloredbox-mk", ColoredBox);
})();