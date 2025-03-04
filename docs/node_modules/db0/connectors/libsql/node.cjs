"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = libSqlConnector;
var _client2 = require("@libsql/client");
var _core = _interopRequireDefault(require("./core.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function libSqlConnector(opts) {
  let _client;
  const getClient = () => {
    if (!_client) {
      _client = (0, _client2.createClient)(opts);
    }
    return _client;
  };
  return (0, _core.default)({
    name: "libsql-node",
    getClient
  });
}