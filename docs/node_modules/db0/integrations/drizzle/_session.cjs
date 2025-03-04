"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DB0Session = exports.DB0PreparedQuery = void 0;
var _drizzleOrm = require("drizzle-orm");
var _sqliteCore = require("drizzle-orm/sqlite-core");
class DB0Session extends _sqliteCore.SQLiteSession {
  constructor(db, dialect, schema, options = {}) {
    super(dialect);
    this.db = db;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new _drizzleOrm.NoopLogger();
  }
  dialect;
  logger;
  prepareQuery(query, fields, executeMethod, customResultMapper) {
    const stmt = this.db.prepare(query.sql);
    return new DB0PreparedQuery(stmt, query, this.logger, fields, executeMethod, customResultMapper);
  }
  // TODO: Implement batch
  // TODO: Implement transaction
  transaction(transaction, config) {
    throw new Error("transaction is not implemented!");
  }
}
exports.DB0Session = DB0Session;
class DB0PreparedQuery extends _sqliteCore.SQLitePreparedQuery {
  constructor(stmt, query, logger, fields, executeMethod, customResultMapper) {
    super("async", executeMethod, query);
    this.stmt = stmt;
    this.logger = logger;
  }
  static [_drizzleOrm.entityKind] = "DB0PreparedQuery";
  run() {
    return this.stmt.run(...this.query.params);
  }
  all() {
    return this.stmt.all(...this.query.params);
  }
  get() {
    return this.stmt.get(...this.query.params);
  }
  values() {
    return Promise.reject(new Error("values is not implemented!"));
  }
}
exports.DB0PreparedQuery = DB0PreparedQuery;