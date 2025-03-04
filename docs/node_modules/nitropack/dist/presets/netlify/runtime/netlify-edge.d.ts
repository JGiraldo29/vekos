import "#nitro-internal-pollyfills";
import "./_deno-env-polyfill";
import type { Context } from "@netlify/edge-functions";
export default function netlifyEdge(request: Request, _context: Context): Promise<any>;
