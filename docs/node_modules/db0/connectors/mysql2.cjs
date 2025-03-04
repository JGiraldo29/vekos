"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = mysqlConnector;
var _promise = _interopRequireDefault(require("mysql2/promise"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function mysqlConnector(opts) {
  let _connection;
  const getConnection = async () => {
    if (_connection) {
      return _connection;
    }
    _connection = await _promise.default.createConnection({
      ...opts
    });
    return _connection;
  };
  return {
    name: "mysql",
    dialect: "mysql",
    getInstance: () => getConnection(),
    exec(sql) {
      return getConnection().then(c => c.query(sql).then(res => res[0]));
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
          return getConnection().then(c => c.query(this._sql, params || this._params).then(res => res[0]));
        },
        run(...params) {
          return getConnection().then(c => c.query(this._sql, params || this._params).then(res => res[0]));
        },
        get(...params) {
          return getConnection().then(c => c.query(this._sql, params || this._params).then(res => res[0][0]));
        }
      };
      return stmt;
    }
  };
}