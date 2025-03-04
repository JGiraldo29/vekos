import "#nitro-internal-pollyfills";
import { DurableObject } from "cloudflare:workers";
import wsAdapter from "crossws/adapters/cloudflare-durable";
import { useNitroApp } from "nitropack/runtime";
import { isPublicAssetURL } from "#nitro-internal-virtual/public-assets";
import { createHandler } from "./_module-handler.mjs";
const nitroApp = useNitroApp();
const ws = import.meta._websocket ? wsAdapter(nitroApp.h3App.websocket) : void 0;
export default createHandler({
  fetch(request, env, context, url) {
    if (env.ASSETS && isPublicAssetURL(url.pathname)) {
      return env.ASSETS.fetch(request);
    }
    if (import.meta._websocket && request.headers.get("upgrade") === "websocket") {
      return ws.handleUpgrade(request, env, context);
    }
  }
});
export class $DurableObject extends DurableObject {
  constructor(state, env) {
    super(state, env);
    state.waitUntil(
      nitroApp.hooks.callHook("cloudflare:durable:init", this, {
        state,
        env
      })
    );
    if (import.meta._websocket) {
      ws.handleDurableInit(this, state, env);
    }
  }
  fetch(request) {
    if (import.meta._websocket) {
      return ws.handleDurableUpgrade(this, request);
    }
    return new Response("404", { status: 404 });
  }
  alarm() {
    this.ctx.waitUntil(
      nitroApp.hooks.callHook("cloudflare:durable:alarm", this)
    );
  }
  async webSocketMessage(client, message) {
    if (import.meta._websocket) {
      return ws.handleDurableMessage(this, client, message);
    }
  }
  async webSocketClose(client, code, reason, wasClean) {
    if (import.meta._websocket) {
      return ws.handleDurableClose(this, client, code, reason, wasClean);
    }
  }
}
