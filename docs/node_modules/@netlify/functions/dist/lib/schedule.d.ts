import { Handler } from '../function/handler.js';
import '../function/handler_context.js';
import '../function/handler_event.js';
import '../function/handler_response.js';
import 'node:stream';

/**
 * Declares a function to run on a cron schedule.
 * Not reachable via HTTP.
 *
 * @example
 * ```
 * export const handler = cron("5 4 * * *", async () => {
 *   // ...
 * })
 * ```
 *
 * @param schedule expressed as cron string.
 * @param handler
 * @see https://ntl.fyi/sched-func
 */
declare const schedule: (cron: string, handler: Handler) => Handler;

export { schedule };
