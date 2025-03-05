import stylistic$1 from '@stylistic/eslint-plugin';

const stylistic = (options) => {
  return {
    name: "nuxt/stylistic",
    ...stylistic$1.configs.customize(options)
  };
};

export { stylistic as default };
