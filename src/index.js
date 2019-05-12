import { controlsView } from "./views/controlsView";
let prevTs = 0;
const animate = (ts = 0) => {
  if ((controlsView.data.isRunning && ts - prevTs > 800) || prevTs === 0) {
    controlsView.data.info = ts;
    prevTs = ts;
  }
  window.requestAnimationFrame((ts) => {
    animate(ts);
  });
};

animate();
