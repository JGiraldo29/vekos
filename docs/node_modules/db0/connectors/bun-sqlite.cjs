"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = bunSqliteConnector;
var _nodePath = require("node:path");
var _nodeFs = require("node:fs");
var _bunSqlite = require("bun:sqlite");
function bunSqliteConnector(opts) {
  let _db;
  const getDB = () => {
    if (_db) {
      return _db;
    }
    if (opts.name === ":memory:") {
      _db = new _bunSqlite.Database(":memory:");
    } else {
      const filePath = (0, _nodePath.resolve)(opts.cwd || ".", opts.path || `.data/${opts.name || "db"}.bun.sqlite`);
      (0, _nodeFs.mkdirSync)((0, _nodePath.dirname)(filePath), {
        recursive: true
      });
      _db = new _bunSqlite.Database(filePath);
    }
    return _db;
  };
  return {
    name: "sqlite",
    dialect: "sqlite",
    getInstance: () => getDB(),
    exec(sql) {
      return getDB().exec(sql);
    },
    prepare(sql) {
      const _stmt = getDB().prepare(sql);
      const stmt = {
        _params: [],
        bind(...params) {
          if (params.length > 0) {
            this._params = params;
          }
          return stmt;
        },
        all(...params) {
          return Promise.resolve(_stmt.all(...params));
        },
        run(...params) {
          const res = _stmt.run(...params);
          return Promise.resolve({
            success: true
          });
        },
        get(...params) {
          return Promise.resolve(_stmt.get(...params));
        }
      };
      return stmt;
    }
  };
}