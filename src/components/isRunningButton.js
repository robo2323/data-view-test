const handleIsRunningButton = (e, data) => {
  switch (e.type) {
  case "click":
    data.isRunning = !data.isRunning;
    break;

  default:
    break;
  }
};

const style = (data) => `
color: ${data.isRunning ? "#111" : "#f2f2f2"};
background-color: ${data.isRunning ? "#cc5555" : "#55cc55"};
`;

//TODO: HTML template as part of the component here
export const isRunningButton = () => ({
  handlers: { click: handleIsRunningButton },
  style
});
