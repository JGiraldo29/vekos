import type { Client } from "@libsql/client";
import type { Connector } from "../../types";
export type ConnectorOptions = {
    getClient: () => Client;
    name?: string;
};
export default function libSqlCoreConnector(opts: ConnectorOptions): Connector<Client>;
