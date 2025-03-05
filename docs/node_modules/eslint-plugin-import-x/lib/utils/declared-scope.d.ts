import type { ScopeType } from '@typescript-eslint/scope-manager';
import type { TSESTree } from '@typescript-eslint/utils';
import type { RuleContext } from '../types';
export declare function declaredScope(context: RuleContext, node: TSESTree.Node, name: string): ScopeType | undefined;
