import type { TSESLint } from '@typescript-eslint/utils';
import type { AlphabetizeOptions, Arrayable, ImportType, PathGroup } from '../types';
type Options = {
    'newlines-between'?: 'always' | 'always-and-inside-groups' | 'ignore' | 'never';
    alphabetize?: Partial<AlphabetizeOptions>;
    distinctGroup?: boolean;
    groups?: ReadonlyArray<Arrayable<ImportType>>;
    pathGroupsExcludedImportTypes?: ImportType[];
    pathGroups?: PathGroup[];
    warnOnUnassignedImports?: boolean;
};
type MessageId = 'error' | 'noLineWithinGroup' | 'noLineBetweenGroups' | 'oneLineBetweenGroups' | 'order';
declare const _default: TSESLint.RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, TSESLint.RuleListener>;
export = _default;
