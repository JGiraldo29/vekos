import { BuilderHandler, Handler } from '../function/handler.js';
import '../function/handler_context.js';
import '../function/handler_event.js';
import '../function/handler_response.js';
import 'node:stream';

declare const wrapHandler: (handler: BuilderHandler) => Handler;

export { wrapHandler as builder };
