declare const modifierValues: readonly ["always", "ignorePackages", "never"];
type Modifier = (typeof modifierValues)[number];
type ModifierByFileExtension = Partial<Record<string, Modifier>>;
type OptionsItemWithPatternProperty = {
    ignorePackages?: boolean;
    checkTypeImports?: boolean;
    pattern: ModifierByFileExtension;
};
type OptionsItemWithoutPatternProperty = {
    ignorePackages?: boolean;
    checkTypeImports?: boolean;
};
type Options = [] | [Modifier] | [Modifier, OptionsItemWithoutPatternProperty] | [Modifier, OptionsItemWithPatternProperty] | [Modifier, ModifierByFileExtension] | [ModifierByFileExtension];
type MessageId = 'missing' | 'missingKnown' | 'unexpected';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, Options, {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
