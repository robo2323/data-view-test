import View from "../../ViewLib/View";
import controls from "../templates/controls";
import { isRunningButton } from "../components/isRunningButton";
import { inputTest } from "../components/inputTest";

const data = {
  isRunning: false,
  info: 0,
  runningMessage: { running: "Loop is Running", stopped: "Loop is Stopped" },
  inputText: ""
};

const components = {
  isRunningButton,
  inputTest
};

const controlsView = new View(controls, components, data);

export { controlsView };
