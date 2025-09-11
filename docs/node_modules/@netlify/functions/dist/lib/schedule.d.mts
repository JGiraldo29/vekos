import { Handler } from '../function/handler.mjs';
import '../function/handler_context.mjs';
import '../function/handler_event.mjs';
import '../function/handler_response.mjs';
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
