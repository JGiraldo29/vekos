import type { CookieStore } from './cookie_store.js';
import { NetlifyRequest } from './request.js';
export type Context = Omit<ReturnType<typeof getContext>['context'], 'waitUntil'>;
interface State {
    enqueuedPromises: Promise<unknown>[];
}
export declare const getContext: (req: NetlifyRequest, cookies: CookieStore, useWaitUntil: boolean) => {
    context: {
        account: {
            id: string;
        };
        cookies: import("./cookie_store.js").Cookies;
        deploy: {
            context: string;
            id: string;
            published: boolean;
        };
        flags: import("./flags.js").Flags;
        geo: import("./geo.js").Geo;
        ip: string;
        json: (input: unknown) => Response;
        log: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
        next: () => never;
        params: Record<string, string>;
        requestId: string;
        rewrite: (input: string | URL) => Promise<Response>;
        server: import("./server.js").Server;
        site: import("./site.js").Site;
        url: URL;
        waitUntil: ((promise: Promise<unknown>) => void) | undefined;
    };
    state: State;
};
export {};
