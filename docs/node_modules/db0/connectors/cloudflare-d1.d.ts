import type { Connector } from "../types";
export interface ConnectorOptions {
    bindingName?: string;
}
export default function cloudflareD1Connector(options: ConnectorOptions): Connector;
