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

// src/lib/stream.ts
var stream_exports = {};
__export(stream_exports, {
  stream: () => stream
});
module.exports = __toCommonJS(stream_exports);
var import_node_stream = require("stream");
var import_node_util = require("util");
var pipeline = (0, import_node_util.promisify)(import_node_stream.pipeline);
var stream = (handler) => awslambda.streamifyResponse(async (event, responseStream, context) => {
  const { body, ...httpResponseMetadata } = await handler(event, context);
  const responseBody = awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata);
  if (typeof body === "undefined") {
    responseBody.end();
  } else if (typeof body === "string") {
    responseBody.write(body);
    responseBody.end();
  } else {
    await pipeline(body, responseBody);
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  stream
});
