const handleInput = (e, data) => {
  data.inputText = e.target.value;
};

export const inputTest = () => ({
  input: handleInput
});
