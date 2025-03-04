"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = nodeSqlite3Connector;
var _nodePath = require("node:path");
var _nodeFs = require("node:fs");
var _sqlite = _interopRequireDefault(require("sqlite3"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function nodeSqlite3Connector(opts) {
  let _db;
  const getDB = () => {
    if (_db) {
      return _db;
    }
    if (opts.name === ":memory:") {
      _db = new _sqlite.default.Database(":memory:");
      return _db;
    }
    const filePath = (0, _nodePath.resolve)(opts.cwd || ".", opts.path || `.data/${opts.name || "db"}.sqlite3`);
    (0, _nodeFs.mkdirSync)((0, _nodePath.dirname)(filePath), {
      recursive: true
    });
    _db = new _sqlite.default.Database(filePath);
    return _db;
  };
  return {
    name: "node-sqlite3",
    dialect: "sqlite",
    getInstance: () => getDB(),
    exec(sql) {
      return new Promise((resolve2, reject) => {
        getDB().exec(sql, err => {
          if (err) {
            return reject(err);
          }
          resolve2({
            success: true
          });
        });
      });
    },
    prepare(sql) {
      const _stmt = getDB().prepare(sql);
      const stmt = {
        bind(...params) {
          if (params.length > 0) {
            _stmt.bind(...params);
          }
          return stmt;
        },
        all(...params) {
          return new Promise((resolve2, reject) => {
            _stmt.all(...params, (err, rows) => {
              if (err) {
                return reject(err);
              }
              resolve2(rows);
            });
          });
        },
        run(...params) {
          return new Promise((resolve2, reject) => {
            _stmt.run(...params, function (err) {
              if (err) {
                return reject(err);
              }
              resolve2({
                success: true
              });
            });
          });
        },
        get(...params) {
          return new Promise((resolve2, reject) => {
            _stmt.get(...params, (err, row) => {
              if (err) {
                return reject(err);
              }
              resolve2(row);
            });
          });
        }
      };
      return stmt;
    }
  };
}