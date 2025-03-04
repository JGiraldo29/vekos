export default function libSqlCoreConnector(opts) {
  function query(sql) {
    const client = opts.getClient();
    return client.execute(sql);
  }
  return {
    name: opts.name || "libsql-core",
    dialect: "libsql",
    getInstance: async () => opts.getClient(),
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
          return query({ sql: this._sql, args: params || this._params }).then(
            (r) => r.rows
          );
        },
        run(...params) {
          return query({ sql: this._sql, args: params || this._params }).then(
            (r) => ({
              result: r,
              rows: r.rows
            })
          );
        },
        get(...params) {
          return query({ sql: this._sql, args: params || this._params }).then(
            (r) => r.rows[0]
          );
        }
      };
      return stmt;
    }
  };
}
