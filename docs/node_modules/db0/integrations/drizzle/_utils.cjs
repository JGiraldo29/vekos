"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapResultRow = mapResultRow;
var _drizzleOrm = require("drizzle-orm");
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce((result2, {
    path,
    field
  }, columnIndex) => {
    let decoder;
    if ((0, _drizzleOrm.is)(field, _drizzleOrm.Column)) {
      decoder = field;
    } else if ((0, _drizzleOrm.is)(field, _drizzleOrm.SQL)) {
      decoder = "decoder" in field && field.decoder;
    } else {
      decoder = "decoder" in field.sql && field.sql.decoder;
    }
    let node = result2;
    for (const [pathChunkIndex, pathChunk] of path.entries()) {
      if (pathChunkIndex < path.length - 1) {
        if (!(pathChunk in node)) {
          node[pathChunk] = {};
        }
        node = node[pathChunk];
      } else {
        const rawValue = row[columnIndex];
        const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
        if (joinsNotNullableMap && (0, _drizzleOrm.is)(field, _drizzleOrm.Column) && path.length === 2) {
          const objectName = path[0];
          if (!(objectName in nullifyMap)) {
            nullifyMap[objectName] = value === null ? (0, _drizzleOrm.getTableName)(field.table) : false;
          } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== (0, _drizzleOrm.getTableName)(field.table)) {
            nullifyMap[objectName] = false;
          }
        }
      }
    }
    return result2;
  }, {});
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}