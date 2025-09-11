import { HandlerContext } from './handler_context.js';
import { HandlerEvent } from './handler_event.js';
import { HandlerResponse, BuilderResponse, StreamingResponse } from './handler_response.js';
import 'node:stream';

interface HandlerCallback<ResponseType extends HandlerResponse = HandlerResponse> {
    (error: any, response: ResponseType): void;
}
interface BaseHandler<ResponseType extends HandlerResponse = HandlerResponse, C extends HandlerContext = HandlerContext> {
    (event: HandlerEvent, context: C, callback?: HandlerCallback<ResponseType>): void | Promise<ResponseType>;
}
interface BackgroundHandler<C extends HandlerContext = HandlerContext> {
    (event: HandlerEvent, context: C): void | Promise<void>;
}
type Handler = BaseHandler<HandlerResponse, HandlerContext>;
type BuilderHandler = BaseHandler<BuilderResponse, HandlerContext>;
interface StreamingHandler {
    (event: HandlerEvent, context: HandlerContext): Promise<StreamingResponse>;
}

export type { BackgroundHandler, BaseHandler, BuilderHandler, Handler, HandlerCallback, StreamingHandler };
