'use strict';

const eslintPluginRegexp = require('eslint-plugin-regexp');

function regexp() {
  return [
    {
      ...eslintPluginRegexp.configs["flat/recommended"],
      name: "nuxt/tooling/regexp"
    }
  ];
}

exports.default = regexp;
