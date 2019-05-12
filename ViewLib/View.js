const codeRegex = /\{(.*?)\}/;
const stringRegex = /(?<=(["']\b))(?:(?=(\\?))\2.)*?(?=\1)/;

export default class View {
  constructor(template, components, dataObject, rootDivId = "root") {
    this.dataObject = dataObject;

    this.data = {};

    for (const prop in dataObject) {
      const propRef = `_${prop}`;
      const self = this;

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

    this.components = components;

    this.rootDiv = document.getElementById(rootDivId);

    const wrapper = document.createElement("div");

    wrapper.innerHTML = template;

    this.elements = wrapper.querySelectorAll("*");

    this.elements.forEach((element) => {
      const elementFunction = this.components[element.id];
      if (typeof elementFunction === "function") {
        const component = elementFunction();
        for (const [attributeName, method] of Object.entries(
          component.handlers
        )) {
          element.addEventListener(attributeName, (e) => {
            method(e, this.data);
          });
        }
        if (typeof component.style === "function") {
          element.setAttribute("style", component.style(this.data));
        }
      }
      element.innerText &&
        element.setAttribute("data-value", element.innerText);
      this.rootDiv.appendChild(element);
    });

    this.render = this.render.bind(this);

    this.render();
  }

  render() {
    const focusedElement = document.activeElement;
    // this.rootDiv.innerHTML = "";
    this.elements.forEach((element) => {
      const dataValue = element.getAttribute("data-value");
      const codeRegexMatch = codeRegex.exec(dataValue);
      let newData;
      const dataKey = element.getAttribute("data-key");

      if (codeRegexMatch) {
        const [_, codeMatch] = codeRegexMatch; // eslint-disable-line no-unused-vars
        const matchParts = codeMatch.split("?");
        //TODO: moe this regex stuff to constructor
        if (matchParts.length > 1) {
          const [condition, values] = matchParts;
          const [isTrueValue, isFalseValue] = values.split(":");

          const value = this.data[condition.trim()]
            ? isTrueValue.trim()
            : isFalseValue.trim();

          const stringRegexMatch = stringRegex.exec(value);

          if (stringRegexMatch) {
            const [stringMatch] = stringRegexMatch; // eslint-disable-line no-unused-vars
            newData = stringMatch;
          } else {
            newData = dataKey ? this.data[dataKey][value] : this.data[value];
          }
        } else {
          newData = dataKey
            ? this.data[dataKey][codeMatch]
            : this.data[codeMatch];
        }
      } else {
        newData = dataValue;
      }

      if (element.innerText !== newData) {
        element.innerText = newData;
      }
      const elementFunction = this.components[element.id];
      
      if (typeof elementFunction === "function") {
        const component = elementFunction();
        if (typeof component.style === "function") {
          element.setAttribute("style", component.style(this.data));
        }
      }
      // this.rootDiv.appendChild(element);
    });
    focusedElement.focus();
  }
}
