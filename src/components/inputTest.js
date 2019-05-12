const handleInput = (e, data) => {
  data.inputTest = { ...data.inputTest, text: e.target.value };
};

export const inputTest = () => ({
  handlers: { input: handleInput }
});
