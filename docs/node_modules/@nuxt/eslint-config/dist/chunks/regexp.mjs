import { configs } from 'eslint-plugin-regexp';

function regexp() {
  return [
    {
      ...configs["flat/recommended"],
      name: "nuxt/tooling/regexp"
    }
  ];
}

export { regexp as default };
