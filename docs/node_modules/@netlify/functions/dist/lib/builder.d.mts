import { BuilderHandler, Handler } from '../function/handler.mjs';
import '../function/handler_context.mjs';
import '../function/handler_event.mjs';
import '../function/handler_response.mjs';
import 'node:stream';

declare const wrapHandler: (handler: BuilderHandler) => Handler;

export { wrapHandler as builder };
