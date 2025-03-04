interface Metadata {
    host: string;
    method: string;
    nf_req_id: string;
    ts: number;
    path: string;
}
declare class MetadataStore {
    entries: Map<string, Metadata>;
    constructor();
    private static getFilePath;
    save(req: Request, awsRequestID: string): Promise<void>;
    flush(): void;
}
export declare const metadata: MetadataStore;
export {};
