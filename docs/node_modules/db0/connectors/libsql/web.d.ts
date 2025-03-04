import type { Config } from "@libsql/client";
export type ConnectorOptions = Config;
export default function libSqlConnector(opts: ConnectorOptions): import("../../types").Connector<import("@libsql/client/.").Client>;
