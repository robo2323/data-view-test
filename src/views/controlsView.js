import View from "../../ViewLib/View";
import controls from "../templates/controls";
import { isRunningButton } from "../components/isRunningButton";

const data = {
  isRunning: false,
  status: null,
  get status() {
    return this.isRunning
      ? `loop is running ${this._status || ""}`
      : "loop is not running";
  }
};

const components = {
  isRunningButton
};

const controlsView = new View(controls, components, data);

export { controlsView };
