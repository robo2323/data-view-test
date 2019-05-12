const handleIsRunningButton = (e, data) => {
  switch (e.type) {
    case "click":
      data.isRunning = !data.isRunning;
      break;

    default:
      break;
  }
};

export const isRunningButton = () => ({ click: handleIsRunningButton });
