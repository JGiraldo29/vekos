"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = postgresqlConnector;
var _pg = _interopRequireDefault(require("pg"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function postgresqlConnector(opts) {
  let _client;
  function getClient() {
    if (_client) {
      return _client;
    }
    const client = new _pg.default.Client("url" in opts ? opts.url : opts);
    _client = client.connect().then(() => {
      _client = client;
      return _client;
    });
    return _client;
  }
  async function query(sql, params) {
    const client = await getClient();
    return client.query(normalizeParams(sql), params);
  }
  return {
    name: "postgresql",
    dialect: "postgresql",
    getInstance: () => getClient(),
    exec(sql) {
      return query(sql);
    },
    prepare(sql) {
      const stmt = {
        _sql: sql,
        _params: [],
        bind(...params) {
          if (params.length > 0) {
            this._params = params;
          }
          return stmt;
        },
        all(...params) {
          return query(this._sql, params || this._params).then(r => r.rows);
        },
        run(...params) {
          return query(this._sql, params || this._params).then(r => ({
            result: r,
            rows: r.rows
          }));
        },
        get(...params) {
          return query(this._sql, params || this._params).then(r => r.rows[0]);
        }
      };
      return stmt;
    }
  };
}
function normalizeParams(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}