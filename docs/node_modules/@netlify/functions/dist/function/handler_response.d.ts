import { PipelineSource } from 'node:stream';

interface HandlerResponse {
    statusCode: number;
    headers?: {
        [header: string]: boolean | number | string;
    };
    multiValueHeaders?: {
        [header: string]: ReadonlyArray<boolean | number | string>;
    };
    body?: string;
    isBase64Encoded?: boolean;
}
interface BuilderResponse extends HandlerResponse {
    ttl?: number;
}
interface StreamingResponse extends Omit<HandlerResponse, 'body'> {
    body?: string | PipelineSource<any>;
}

export type { BuilderResponse, HandlerResponse, StreamingResponse };
