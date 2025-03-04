import "#nitro-internal-pollyfills";
import type * as CF from "@cloudflare/workers-types";
import { DurableObject } from "cloudflare:workers";
interface Env {
    ASSETS?: {
        fetch: typeof CF.fetch;
    };
}
declare const _default: CF.ExportedHandler<Env, unknown, unknown>;
export default _default;
export declare class $DurableObject extends DurableObject {
    constructor(state: DurableObjectState, env: Record<string, any>);
    fetch(request: Request): Response | Promise<Response>;
    alarm(): void | Promise<void>;
    webSocketMessage(client: WebSocket, message: ArrayBuffer | string): Promise<void>;
    webSocketClose(client: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void>;
}
