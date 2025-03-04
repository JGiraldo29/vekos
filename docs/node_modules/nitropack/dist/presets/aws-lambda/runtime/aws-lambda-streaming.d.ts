import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import "#nitro-internal-pollyfills";
export declare const handler: any;
declare global {
    namespace awslambda {
        function streamifyResponse(handler: (event: APIGatewayProxyEventV2, responseStream: NodeJS.WritableStream, context: Context) => Promise<void>): any;
        namespace HttpResponseStream {
            function from(stream: NodeJS.WritableStream, metadata: {
                statusCode: APIGatewayProxyStructuredResultV2["statusCode"];
                headers: APIGatewayProxyStructuredResultV2["headers"];
            }): NodeJS.WritableStream;
        }
    }
}
