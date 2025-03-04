"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = cloudflareD1Connector;
function cloudflareD1Connector(options) {
  const getDB = () => {
    const binding = globalThis.__env__?.[options.bindingName] || globalThis.__cf_env__?.[options.bindingName];
    if (!binding) {
      throw new Error(`[db0] [d1] binding \`${options.bindingName}\` not found`);
    }
    return binding;
  };
  return {
    name: "cloudflare-d1",
    dialect: "sqlite",
    getInstance: () => getDB(),
    exec: sql => getDB().exec(sql),
    prepare: sql => {
      const _stmt = getDB().prepare(sql);
      const onError = err => {
        if (err.cause) {
          err.message = err.cause.message + ' "' + sql + '"';
        }
        throw err;
      };
      const stmt = {
        bind(...params) {
          _stmt.bind(...params);
          return stmt;
        },
        all(...params) {
          return _stmt.bind(...params).all().catch(onError);
        },
        run(...params) {
          return _stmt.bind(...params).run().then(res => {
            return {
              success: res.success
            };
          }).catch(onError);
        },
        get(...params) {
          return _stmt.bind(...params).first().catch(onError);
        }
      };
      return stmt;
    }
  };
}