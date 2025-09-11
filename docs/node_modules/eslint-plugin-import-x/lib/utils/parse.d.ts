import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { ChildContext, RuleContext } from '../types';
export declare function parse(path: string, content: string, context: ChildContext | RuleContext): {
    ast: TSESTree.Program;
    visitorKeys: TSESLint.Parser.VisitorKeys | null;
};
