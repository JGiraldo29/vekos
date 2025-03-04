import { resolve, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
export default function sqliteConnector(opts) {
  let _db;
  const getDB = () => {
    if (_db) {
      return _db;
    }
    if (opts.name === ":memory:") {
      _db = new Database(":memory:");
      return _db;
    }
    const filePath = resolve(
      opts.cwd || ".",
      opts.path || `.data/${opts.name || "db"}.sqlite3`
    );
    mkdirSync(dirname(filePath), { recursive: true });
    _db = new Database(filePath);
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
        bind(...params) {
          if (params.length > 0) {
            _stmt.bind(...params);
          }
          return stmt;
        },
        all(...params) {
          return Promise.resolve(_stmt.all(...params));
        },
        run(...params) {
          const res = _stmt.run(...params);
          return Promise.resolve({ success: res.changes > 0 });
        },
        get(...params) {
          return Promise.resolve(_stmt.get(...params));
        }
      };
      return stmt;
    }
  };
}
