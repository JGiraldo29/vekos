import { Database } from "bun:sqlite";
import type { Connector } from "../types";
export interface ConnectorOptions {
    cwd?: string;
    path?: string;
    name?: string;
}
export default function bunSqliteConnector(opts: ConnectorOptions): Connector<Database>;
