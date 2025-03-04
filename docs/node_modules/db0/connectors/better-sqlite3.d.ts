import Database from "better-sqlite3";
import type { Connector } from "../types";
export interface ConnectorOptions {
    cwd?: string;
    path?: string;
    name?: string;
}
export default function sqliteConnector(opts: ConnectorOptions): Connector<Database.Database>;
