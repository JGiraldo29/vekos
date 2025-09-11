'use strict';

const defu = require('defu');
const jiti = require('jiti');
const schema = require('../shared/untyped.kaUOsshY.cjs');
const loader_babel = require('./babel.cjs');
require('../shared/untyped.B9ocnjd2.cjs');
require('scule');
require('@babel/types');

async function loadSchema(entryPath, options = {}) {
  const jiti$1 = jiti.createJiti(
    process.cwd(),
    defu.defu(options.jiti, {
      interopDefault: true,
      transformOptions: {
        babel: {
          plugins: [[loader_babel, { experimentalFunctions: true }]]
        }
      }
    })
  );
  let rawSchema = await jiti$1.import(entryPath);
  const rawSchemaKeys = Object.keys(rawSchema);
  if (rawSchemaKeys.length === 1 && rawSchemaKeys[0] === "default") {
    rawSchema = rawSchema.default;
  }
  const schema$1 = await schema.resolveSchema(rawSchema, options.defaults, {
    ignoreDefaults: options.ignoreDefaults
  });
  return schema$1;
}

exports.loadSchema = loadSchema;
