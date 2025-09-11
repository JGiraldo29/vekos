import type { ModuleOptions } from '../utils';
type Options = ModuleOptions & {
    noUselessIndex?: boolean;
};
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<"useless", [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
