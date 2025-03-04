'use strict';

const flat = require('./shared/eslint-config.b5211f62.cjs');
require('eslint-flat-config-utils');
require('eslint-config-flat-gitignore');
require('pathe');
require('local-pkg');
require('@nuxt/eslint-plugin');
require('@eslint/js');
require('globals');



exports.createConfigForNuxt = flat.createConfigForNuxt;
exports.defineFlatConfigs = flat.defineFlatConfigs;
exports.resolveOptions = flat.resolveOptions;
