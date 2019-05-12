export default class View {
  constructor(template, components, dataObject, rootDivId = "root") {
    this.dataObject = dataObject;
    this.components = components;

    this.rootDiv = document.getElementById(rootDivId);

    const wrapper = document.createElement("div");

    wrapper.innerHTML = template;

    this.elements = wrapper.querySelectorAll("*");

    this.elements.forEach((element) => {
      const elementFunction = this.components[element.id];
      if (elementFunction) {
        for (const [attributeName, method] of Object.entries(
          elementFunction()
        )) {
          element.addEventListener(attributeName, (e) => {
            method(e, this.data);
          });
        }
      }
      element.innerText &&
        element.setAttribute("data-value", element.innerText);
    });

    this.data = {};

    for (const prop in dataObject) {
      const propRef = `_${prop}`;
      const propDescriptor = Object.getOwnPropertyDescriptor(dataObject, prop);
      const self = this;

      if (propDescriptor.get) {
        Object.defineProperty(this.data, prop, {
          get: propDescriptor.get,
          set(value) {
            this[propRef] = value;
            self.render();
          }
        });
      } else {
        this.data[propRef] = dataObject[prop];

        Object.defineProperty(this.data, prop, {
          set(value) {
            this[propRef] = value;
            self.render();
          },

          get() {
            return this[propRef];
          }
        });
      }
    }

    this.render = this.render.bind(this);

    this.render();
  }

  render() {
    this.rootDiv.innerHTML = "";
    this.elements.forEach((element) => {
      // Data Bool
      if (element.matches(`[v-data-bool]`)) {
        const dataAttribute = element.getAttribute(`v-data-bool`);

        const [trueString, falseString] = element
          .getAttribute("data-value")
          .split("||");

        element.innerText = this.data[dataAttribute] ? trueString : falseString;
      }

      // Data String
      if (element.matches(`[v-data-string]`)) {
        const dataAttribute = element.getAttribute(`v-data-string`);

        element.innerText = this.data[dataAttribute];
      }

      this.rootDiv.appendChild(element);
    });
  }
}
