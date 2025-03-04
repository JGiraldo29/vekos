type Options = {
    packageDir?: string | string[];
    devDependencies?: boolean | string[];
    optionalDependencies?: boolean | string[];
    peerDependencies?: boolean | string[];
    bundledDependencies?: boolean | string[];
    includeInternal?: boolean;
    includeTypes?: boolean;
    whitelist?: string[];
};
type MessageId = 'pkgNotFound' | 'pkgUnparsable' | 'devDep' | 'optDep' | 'missing';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
