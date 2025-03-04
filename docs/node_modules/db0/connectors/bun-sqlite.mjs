import { resolve, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { Database } from "bun:sqlite";
export default function bunSqliteConnector(opts) {
  let _db;
  const getDB = () => {
    if (_db) {
      return _db;
    }
    if (opts.name === ":memory:") {
      _db = new Database(":memory:");
    } else {
      const filePath = resolve(
        opts.cwd || ".",
        opts.path || `.data/${opts.name || "db"}.bun.sqlite`
      );
      mkdirSync(dirname(filePath), { recursive: true });
      _db = new Database(filePath);
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
          return Promise.resolve({ success: true });
        },
        get(...params) {
          return Promise.resolve(_stmt.get(...params));
        }
      };
      return stmt;
    }
  };
}
