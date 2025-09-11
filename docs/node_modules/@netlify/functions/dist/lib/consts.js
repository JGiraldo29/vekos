"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib/consts.ts
var consts_exports = {};
__export(consts_exports, {
  BUILDER_FUNCTIONS_FLAG: () => BUILDER_FUNCTIONS_FLAG,
  HTTP_STATUS_METHOD_NOT_ALLOWED: () => HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_OK: () => HTTP_STATUS_OK,
  METADATA_VERSION: () => METADATA_VERSION
});
module.exports = __toCommonJS(consts_exports);
var BUILDER_FUNCTIONS_FLAG = true;
var HTTP_STATUS_METHOD_NOT_ALLOWED = 405;
var HTTP_STATUS_OK = 200;
var METADATA_VERSION = 1;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BUILDER_FUNCTIONS_FLAG,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_OK,
  METADATA_VERSION
});
