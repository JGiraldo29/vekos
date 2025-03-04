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

// src/lib/builder.ts
var builder_exports = {};
__export(builder_exports, {
  builder: () => wrapHandler
});
module.exports = __toCommonJS(builder_exports);

// src/lib/consts.ts
var BUILDER_FUNCTIONS_FLAG = true;
var HTTP_STATUS_METHOD_NOT_ALLOWED = 405;
var METADATA_VERSION = 1;

// src/lib/builder.ts
var augmentResponse = (response) => {
  if (!response) {
    return response;
  }
  const metadata = { version: METADATA_VERSION, builder_function: BUILDER_FUNCTIONS_FLAG, ttl: response.ttl || 0 };
  return {
    ...response,
    metadata
  };
};
var wrapHandler = (handler) => (
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  (event, context, callback) => {
    if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
      return Promise.resolve({
        body: "Method Not Allowed",
        statusCode: HTTP_STATUS_METHOD_NOT_ALLOWED
      });
    }
    const modifiedEvent = {
      ...event,
      multiValueQueryStringParameters: {},
      queryStringParameters: {}
    };
    const wrappedCallback = (error, response) => (
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      callback ? callback(error, augmentResponse(response)) : null
    );
    const execution = handler(modifiedEvent, context, wrappedCallback);
    if (typeof execution === "object" && typeof execution.then === "function") {
      return execution.then(augmentResponse);
    }
    return execution;
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder
});
