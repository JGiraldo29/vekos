// src/lib/stream.ts
import { pipeline as pipelineSync } from "stream";
import { promisify } from "util";
var pipeline = promisify(pipelineSync);
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

export {
  stream
};
