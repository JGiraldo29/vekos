'use strict';

const stylistic$1 = require('@stylistic/eslint-plugin');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const stylistic__default = /*#__PURE__*/_interopDefaultCompat(stylistic$1);

const stylistic = (options) => {
  return {
    name: "nuxt/stylistic",
    ...stylistic__default.configs.customize(options)
  };
};

exports.default = stylistic;
