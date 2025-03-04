"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = planetscaleConnector;
var _database = require("@planetscale/database");
function planetscaleConnector(opts) {
  let _client;
  function getClient() {
    if (_client) {
      return _client;
    }
    const client = new _database.Client(opts);
    _client = client;
    return client;
  }
  function query(sql, params) {
    const client = getClient();
    return client.execute(sql, params);
  }
  return {
    name: "planetscale",
    dialect: "mysql",
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