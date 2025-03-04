import {
  BUILDER_FUNCTIONS_FLAG,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  METADATA_VERSION
} from "./chunk-WACUD2EK.mjs";

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

export {
  wrapHandler
};
