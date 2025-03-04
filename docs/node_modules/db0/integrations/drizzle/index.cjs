"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drizzle = drizzle;
var _sqliteCore = require("drizzle-orm/sqlite-core");
var _session = require("./_session.cjs");
function drizzle(db) {
  const schema = void 0;
  const dialect = new _sqliteCore.SQLiteAsyncDialect();
  const session = new _session.DB0Session(db, dialect, schema);
  return new _sqliteCore.BaseSQLiteDatabase("async", dialect, session, schema);
}