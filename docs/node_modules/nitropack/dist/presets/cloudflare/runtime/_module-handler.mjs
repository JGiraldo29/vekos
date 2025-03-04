import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import { requestHasBody, runCronTasks } from "nitropack/runtime/internal";
export function createHandler(hooks) {
  const nitroApp = useNitroApp();
  return {
    async fetch(request, env, context) {
      const url = new URL(request.url);
      if (hooks.fetch) {
        const res = await hooks.fetch(request, env, context, url);
        if (res) {
          return res;
        }
      }
      let body;
      if (requestHasBody(request)) {
        body = Buffer.from(await request.arrayBuffer());
      }
      globalThis.__env__ = env;
      return nitroApp.localFetch(url.pathname + url.search, {
        context: {
          cf: request.cf,
          waitUntil: (promise) => context.waitUntil(promise),
          cloudflare: {
            request,
            env,
            context
          }
        },
        host: url.hostname,
        protocol: url.protocol,
        method: request.method,
        headers: request.headers,
        body
      });
    },
    scheduled(controller, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(
        nitroApp.hooks.callHook("cloudflare:scheduled", {
          controller,
          env,
          context
        })
      );
      if (import.meta._tasks) {
        context.waitUntil(
          runCronTasks(controller.cron, {
            context: {
              cloudflare: {
                env,
                context
              }
            },
            payload: {}
          })
        );
      }
    },
    email(message, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(
        nitroApp.hooks.callHook("cloudflare:email", {
          message,
          event: message,
          // backward compat
          env,
          context
        })
      );
    },
    queue(batch, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(
        nitroApp.hooks.callHook("cloudflare:queue", {
          batch,
          event: batch,
          env,
          context
        })
      );
    },
    tail(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(
        nitroApp.hooks.callHook("cloudflare:tail", {
          traces,
          env,
          context
        })
      );
    },
    trace(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(
        nitroApp.hooks.callHook("cloudflare:trace", {
          traces,
          env,
          context
        })
      );
    }
  };
}
