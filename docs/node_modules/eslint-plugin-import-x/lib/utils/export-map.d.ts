import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { Annotation } from 'doctrine';
import type { ChildContext, DocStyle, ParseError, RuleContext } from '../types';
export type DocStyleParsers = Record<DocStyle, (comments: TSESTree.Comment[]) => Annotation | undefined>;
export type DeclarationMetadata = {
    source: Pick<TSESTree.Literal, 'value' | 'loc'>;
    importedSpecifiers?: Set<string>;
    dynamic?: boolean;
    isOnlyImportingTypes?: boolean;
};
export type ModuleNamespace = {
    doc?: Annotation;
    namespace?: ExportMap | null;
};
export type ModuleImport = {
    getter: () => ExportMap | null;
    declarations: Set<DeclarationMetadata>;
};
export declare class ExportMap {
    path: string;
    static for(context: ChildContext): ExportMap | null;
    static get(source: string, context: RuleContext): ExportMap | null;
    static parse(filepath: string, content: string, context: ChildContext): ExportMap | null;
    namespace: Map<string, ModuleNamespace>;
    reexports: Map<string, {
        local: string;
        getImport(): ExportMap | null;
    }>;
    dependencies: Set<() => ExportMap | null>;
    imports: Map<string, ModuleImport>;
    exports: Map<string, TSESTree.Identifier | TSESTree.ProgramStatement>;
    errors: ParseError[];
    parseGoal: 'ambiguous' | 'Module' | 'Script';
    visitorKeys: TSESLint.SourceCode.VisitorKeys | null;
    private mtime;
    doc: Annotation | undefined;
    constructor(path: string);
    get hasDefault(): boolean;
    get size(): number;
    has(name: string): boolean;
    hasDeep(name: string): {
        found: boolean;
        path: ExportMap[];
    };
    get(name: string): ModuleNamespace | null | undefined;
    forEach(callback: (value: ModuleNamespace | null | undefined, name: string, map: ExportMap) => void, thisArg?: unknown): void;
    reportErrors(context: RuleContext, declaration: {
        source: TSESTree.Literal | null;
    }): void;
}
export declare function recursivePatternCapture(pattern: TSESTree.Node, callback: (node: TSESTree.DestructuringPattern) => void): void;
