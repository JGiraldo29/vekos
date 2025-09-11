import { ESLintUtils } from '@typescript-eslint/utils';
type ImportXPluginDocs = {
    category?: string;
    recommended?: true;
};
export declare const createRule: <Options extends readonly unknown[], MessageIds extends string>({ meta, name, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<Options, MessageIds, ImportXPluginDocs>>) => ESLintUtils.RuleModule<MessageIds, Options, ImportXPluginDocs, ESLintUtils.RuleListener>;
export {};
