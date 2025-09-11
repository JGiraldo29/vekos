import type { ModuleOptions } from '../utils';
type Options = ModuleOptions & {
    preventRenamingBindings?: boolean;
};
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<"renameDefault", [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
