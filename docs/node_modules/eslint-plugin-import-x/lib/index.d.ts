import type { TSESLint } from '@typescript-eslint/utils';
import { createNodeResolver } from './node-resolver';
import type { PluginConfig, PluginFlatConfig } from './types';
import { importXResolverCompat } from './utils';
declare const _default: {
    configs: {
        recommended: {
            plugins: ["import-x"];
            rules: {
                'import-x/no-unresolved': "error";
                'import-x/named': "error";
                'import-x/namespace': "error";
                'import-x/default': "error";
                'import-x/export': "error";
                'import-x/no-named-as-default': "warn";
                'import-x/no-named-as-default-member': "warn";
                'import-x/no-duplicates': "warn";
            };
            parserOptions: {
                sourceType: "module";
                ecmaVersion: 2018;
            };
        };
        errors: {
            plugins: ["import-x"];
            rules: {
                'import-x/no-unresolved': 2;
                'import-x/named': 2;
                'import-x/namespace': 2;
                'import-x/default': 2;
                'import-x/export': 2;
            };
        };
        warnings: {
            plugins: ["import-x"];
            rules: {
                'import-x/no-named-as-default': 1;
                'import-x/no-named-as-default-member': 1;
                'import-x/no-rename-default': 1;
                'import-x/no-duplicates': 1;
            };
        };
        'stage-0': PluginConfig;
        react: {
            settings: {
                'import-x/extensions': (".js" | ".jsx")[];
            };
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true;
                    };
                };
            };
        };
        'react-native': {
            settings: {
                'import-x/resolver': {
                    node: {
                        extensions: string[];
                    };
                };
            };
        };
        electron: {
            settings: {
                'import-x/core-modules': string[];
            };
        };
        typescript: {
            settings: {
                'import-x/extensions': readonly [".ts", ".tsx", ".cts", ".mts", ".js", ".jsx", ".cjs", ".mjs"];
                'import-x/external-module-folders': string[];
                'import-x/parsers': {
                    '@typescript-eslint/parser': (".ts" | ".tsx" | ".cts" | ".mts")[];
                };
                'import-x/resolver': {
                    typescript: true;
                };
            };
            rules: {
                'import-x/named': "off";
            };
        };
    };
    flatConfigs: {
        recommended: PluginFlatConfig;
        errors: PluginFlatConfig;
        warnings: PluginFlatConfig;
        'stage-0': PluginFlatConfig;
        react: {
            settings: {
                'import-x/extensions': (".js" | ".mjs" | ".cjs" | ".jsx")[];
            };
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true;
                    };
                };
            };
        };
        'react-native': {
            settings: {
                'import-x/resolver': {
                    node: {
                        extensions: string[];
                    };
                };
            };
        };
        electron: {
            settings: {
                'import-x/core-modules': string[];
            };
        };
        typescript: {
            settings: {
                'import-x/extensions': readonly [".ts", ".tsx", ".cts", ".mts", ".js", ".jsx", ".cjs", ".mjs"];
                'import-x/external-module-folders': string[];
                'import-x/parsers': {
                    '@typescript-eslint/parser': (".ts" | ".tsx" | ".cts" | ".mts")[];
                };
                'import-x/resolver': {
                    typescript: true;
                };
            };
            rules: {
                'import-x/named': "off";
            };
        };
    };
    rules: {
        'no-unresolved': TSESLint.RuleModule<"unresolved" | "casingMismatch", [((import("./utils").ModuleOptions & {
            caseSensitive?: boolean;
            caseSensitiveStrict?: boolean;
        }) | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        named: TSESLint.RuleModule<"notFound" | "notFoundDeep", [(import("./utils").ModuleOptions | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        default: TSESLint.RuleModule<"noDefaultExport", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        namespace: TSESLint.RuleModule<"noNamesFound" | "computedReference" | "namespaceMember" | "topLevelNames" | "notFoundInNamespace" | "notFoundInNamespaceDeep", [{
            allowComputed?: boolean;
        }], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-namespace': TSESLint.RuleModule<"noNamespace", [({
            ignore?: string[];
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        export: TSESLint.RuleModule<"noNamed" | "multiDefault" | "multiNamed", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-mutable-exports': TSESLint.RuleModule<"noMutable", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        extensions: TSESLint.RuleModule<"missing" | "missingKnown" | "unexpected", [] | ["always" | "ignorePackages" | "never"] | ["always" | "ignorePackages" | "never", {
            ignorePackages?: boolean;
            checkTypeImports?: boolean;
        }] | ["always" | "ignorePackages" | "never", {
            ignorePackages?: boolean;
            checkTypeImports?: boolean;
            pattern: Partial<Record<string, "always" | "ignorePackages" | "never">>;
        }] | ["always" | "ignorePackages" | "never", Partial<Record<string, "always" | "ignorePackages" | "never">>] | [Partial<Record<string, "always" | "ignorePackages" | "never">>], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-restricted-paths': TSESLint.RuleModule<"path" | "mixedGlob" | "glob" | "zone", [({
            basePath?: string;
            zones?: Array<{
                from: import("./types").Arrayable<string>;
                target: import("./types").Arrayable<string>;
                message?: string;
                except?: string[];
            }>;
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-internal-modules': TSESLint.RuleModule<"noAllowed", [({
            allow?: string[];
            forbid?: string[];
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'group-exports': TSESLint.RuleModule<"ExportNamedDeclaration" | "AssignmentExpression", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-relative-packages': TSESLint.RuleModule<"noAllowed", [(import("./utils").ModuleOptions | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-relative-parent-imports': TSESLint.RuleModule<"noAllowed", [(import("./utils").ModuleOptions | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'consistent-type-specifier-style': TSESLint.RuleModule<"inline" | "topLevel", [(("prefer-inline" | "prefer-top-level") | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-self-import': TSESLint.RuleModule<"self", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-cycle': TSESLint.RuleModule<"cycle" | "cycleSource", [(({
            allowUnsafeDynamicCyclicDependency?: boolean;
            ignoreExternal?: boolean;
            maxDepth?: number | "\u221E";
        } & import("./utils").ModuleOptions) | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-named-default': TSESLint.RuleModule<"default", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-named-as-default': TSESLint.RuleModule<"default", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-named-as-default-member': TSESLint.RuleModule<"member", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-anonymous-default-export': TSESLint.RuleModule<"assign" | "anonymous", [({
            allowArray?: boolean;
            allowArrowFunction?: boolean;
            allowCallExpression?: boolean;
            allowAnonymousClass?: boolean;
            allowAnonymousFunction?: boolean;
            allowLiteral?: boolean;
            allowObject?: boolean;
            allowNew?: boolean;
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-rename-default': TSESLint.RuleModule<"renameDefault", [((import("./utils").ModuleOptions & {
            preventRenamingBindings?: boolean;
        }) | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-unused-modules': TSESLint.RuleModule<"notFound" | "unused", {
            src?: string[];
            ignoreExports?: string[];
            missingExports?: true;
            unusedExports?: boolean;
            ignoreUnusedTypeExports?: boolean;
        }[], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-commonjs': TSESLint.RuleModule<"import" | "export", [(({
            allowPrimitiveModules?: boolean;
            allowRequire?: boolean;
            allowConditionalRequire?: boolean;
        } | "allow-primitive-modules") | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-amd': TSESLint.RuleModule<"amd", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-duplicates': TSESLint.RuleModule<"duplicate", [({
            considerQueryString?: boolean;
            'prefer-inline'?: boolean;
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        first: TSESLint.RuleModule<"absolute" | "order", [(("absolute-first" | "disable-absolute-first") | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'max-dependencies': TSESLint.RuleModule<"max", [({
            ignoreTypeImports?: boolean;
            max?: number;
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-extraneous-dependencies': TSESLint.RuleModule<"missing" | "pkgNotFound" | "pkgUnparsable" | "devDep" | "optDep", [({
            packageDir?: string | string[];
            devDependencies?: boolean | string[];
            optionalDependencies?: boolean | string[];
            peerDependencies?: boolean | string[];
            bundledDependencies?: boolean | string[];
            includeInternal?: boolean;
            includeTypes?: boolean;
            whitelist?: string[];
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-absolute-path': TSESLint.RuleModule<"absolute", [(import("./utils").ModuleOptions | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-nodejs-modules': TSESLint.RuleModule<"builtin", [({
            allow?: string[];
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-webpack-loader-syntax': TSESLint.RuleModule<"unexpected", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        order: TSESLint.RuleModule<"error" | "order" | "noLineWithinGroup" | "noLineBetweenGroups" | "oneLineBetweenGroups", [({
            'newlines-between'?: "always" | "always-and-inside-groups" | "ignore" | "never";
            alphabetize?: Partial<import("./types").AlphabetizeOptions>;
            distinctGroup?: boolean;
            groups?: ReadonlyArray<import("./types").Arrayable<import("./types").ImportType>>;
            pathGroupsExcludedImportTypes?: import("./types").ImportType[];
            pathGroups?: import("./types").PathGroup[];
            warnOnUnassignedImports?: boolean;
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'newline-after-import': TSESLint.RuleModule<"newline", [({
            count?: number;
            exactCount?: boolean;
            considerComments?: boolean;
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'prefer-default-export': TSESLint.RuleModule<"any" | "single", [({
            target?: "single" | "any";
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-default-export': TSESLint.RuleModule<"preferNamed" | "noAliasDefault", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-named-export': TSESLint.RuleModule<"noAllowed", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-dynamic-require': TSESLint.RuleModule<"import" | "require", [({
            esmodule?: boolean;
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        unambiguous: TSESLint.RuleModule<"module", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-unassigned-import': TSESLint.RuleModule<"unassigned", [({
            allow?: string[];
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-useless-path-segments': TSESLint.RuleModule<"useless", [((import("./utils").ModuleOptions & {
            noUselessIndex?: boolean;
        }) | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'dynamic-import-chunkname': TSESLint.RuleModule<"leadingComment" | "blockComment" | "paddedSpaces" | "webpackComment" | "chunknameFormat" | "webpackEagerModeNoChunkName" | "webpackRemoveEagerMode" | "webpackRemoveChunkName", [({
            allowEmpty?: boolean;
            importFunctions?: readonly string[];
            webpackChunknameFormat?: string;
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-import-module-exports': TSESLint.RuleModule<"notAllowed", [({
            exceptions?: string[];
        } | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-empty-named-blocks': TSESLint.RuleModule<"emptyNamed" | "unused" | "emptyImport", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'exports-last': TSESLint.RuleModule<"end", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'no-deprecated': TSESLint.RuleModule<"deprecated" | "deprecatedDesc", [], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
        'imports-first': TSESLint.RuleModule<"absolute" | "order", [(("absolute-first" | "disable-absolute-first") | undefined)?], {
            category?: string;
            recommended?: true;
        }, TSESLint.RuleListener>;
    };
    importXResolverCompat: typeof importXResolverCompat;
    createNodeResolver: typeof createNodeResolver;
};
export = _default;
