const codeRegex = /\{(.*?)\}/;
const stringRegex = /(?<=(["']\b))(?:(?=(\\?))\2.)*?(?=\1)/;

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
      const self = this;
      const elements = this.elements;

      this.data[propRef] = dataObject[prop];

      Object.defineProperty(this.data, prop, {
        set(value) {
          this[propRef] = value;
          console.log(elements, propRef, prop);

          self.render();
        },

        get() {
          return this[propRef];
        }
      });
    }

    this.render = this.render.bind(this);

    this.render();
  }

  render() {
    const focusedElement = document.activeElement;
    this.rootDiv.innerHTML = "";
    this.elements.forEach((element) => {
      const dataValue = element.getAttribute("data-value");
      const codeRegexMatch = codeRegex.exec(dataValue);

      if (codeRegexMatch) {
        const [_, codeMatch] = codeRegexMatch; // eslint-disable-line no-unused-vars
        const matchParts = codeMatch.split("?");

        if (matchParts.length > 1) {
          const [condition, values] = matchParts;
          const [isTrueValue, isFalseValue] = values.split(":");

          const value = this.data[condition.trim()]
            ? isTrueValue.trim()
            : isFalseValue.trim();

          const stringRegexMatch = stringRegex.exec(value);

          if (stringRegexMatch) {
            const [stringMatch] = stringRegexMatch; // eslint-disable-line no-unused-vars
            element.innerText = stringMatch;
          } else {
            const dataKey = element.getAttribute("data-key");
            element.innerText = dataKey
              ? this.data[dataKey][value]
              : this.data[value];
          }
        } else {
          element.innerText = this.data[codeMatch];
        }
      } else {
        element.innerText = dataValue;
      }

      this.rootDiv.appendChild(element);
    });
    focusedElement.focus();
  }
}
