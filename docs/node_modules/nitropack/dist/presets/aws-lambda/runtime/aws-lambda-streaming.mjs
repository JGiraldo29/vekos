import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import {
  normalizeLambdaIncomingHeaders,
  normalizeLambdaOutgoingHeaders
} from "nitropack/runtime/internal";
import { withQuery } from "ufo";
const nitroApp = useNitroApp();
export const handler = awslambda.streamifyResponse(
  async (event, responseStream, context) => {
    const query = {
      ...event.queryStringParameters
    };
    const url = withQuery(event.rawPath, query);
    const method = event.requestContext?.http?.method || "get";
    if ("cookies" in event && event.cookies) {
      event.headers.cookie = event.cookies.join(";");
    }
    const r = await nitroApp.localCall({
      event,
      url,
      context,
      headers: normalizeLambdaIncomingHeaders(event.headers),
      method,
      query,
      body: event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body
    });
    const httpResponseMetadata = {
      statusCode: r.status,
      headers: {
        ...normalizeLambdaOutgoingHeaders(r.headers, true),
        "Transfer-Encoding": "chunked"
      }
    };
    if (r.body) {
      const writer = awslambda.HttpResponseStream.from(
        responseStream,
        httpResponseMetadata
      );
      if (!r.body.getReader) {
        writer.write(
          r.body
          /* TODO */
        );
        writer.end();
        return;
      }
      const reader = r.body.getReader();
      await streamToNodeStream(reader, responseStream);
      writer.end();
    }
  }
);
async function streamToNodeStream(reader, writer) {
  let readResult = await reader.read();
  while (!readResult.done) {
    writer.write(readResult.value);
    readResult = await reader.read();
  }
  writer.end();
}
