"use strict";
const tslib_1 = require("tslib");
const package_json_1 = require("../package.json");
const electron_1 = tslib_1.__importDefault(require("./config/electron"));
const errors_1 = tslib_1.__importDefault(require("./config/errors"));
const electron_2 = tslib_1.__importDefault(require("./config/flat/electron"));
const errors_2 = tslib_1.__importDefault(require("./config/flat/errors"));
const react_1 = tslib_1.__importDefault(require("./config/flat/react"));
const react_native_1 = tslib_1.__importDefault(require("./config/flat/react-native"));
const recommended_1 = tslib_1.__importDefault(require("./config/flat/recommended"));
const stage_0_1 = tslib_1.__importDefault(require("./config/flat/stage-0"));
const typescript_1 = tslib_1.__importDefault(require("./config/flat/typescript"));
const warnings_1 = tslib_1.__importDefault(require("./config/flat/warnings"));
const react_2 = tslib_1.__importDefault(require("./config/react"));
const react_native_2 = tslib_1.__importDefault(require("./config/react-native"));
const recommended_2 = tslib_1.__importDefault(require("./config/recommended"));
const stage_0_2 = tslib_1.__importDefault(require("./config/stage-0"));
const typescript_2 = tslib_1.__importDefault(require("./config/typescript"));
const warnings_2 = tslib_1.__importDefault(require("./config/warnings"));
const node_resolver_1 = require("./node-resolver");
const consistent_type_specifier_style_1 = tslib_1.__importDefault(require("./rules/consistent-type-specifier-style"));
const default_1 = tslib_1.__importDefault(require("./rules/default"));
const dynamic_import_chunkname_1 = tslib_1.__importDefault(require("./rules/dynamic-import-chunkname"));
const export_1 = tslib_1.__importDefault(require("./rules/export"));
const exports_last_1 = tslib_1.__importDefault(require("./rules/exports-last"));
const extensions_1 = tslib_1.__importDefault(require("./rules/extensions"));
const first_1 = tslib_1.__importDefault(require("./rules/first"));
const group_exports_1 = tslib_1.__importDefault(require("./rules/group-exports"));
const imports_first_1 = tslib_1.__importDefault(require("./rules/imports-first"));
const max_dependencies_1 = tslib_1.__importDefault(require("./rules/max-dependencies"));
const named_1 = tslib_1.__importDefault(require("./rules/named"));
const namespace_1 = tslib_1.__importDefault(require("./rules/namespace"));
const newline_after_import_1 = tslib_1.__importDefault(require("./rules/newline-after-import"));
const no_absolute_path_1 = tslib_1.__importDefault(require("./rules/no-absolute-path"));
const no_amd_1 = tslib_1.__importDefault(require("./rules/no-amd"));
const no_anonymous_default_export_1 = tslib_1.__importDefault(require("./rules/no-anonymous-default-export"));
const no_commonjs_1 = tslib_1.__importDefault(require("./rules/no-commonjs"));
const no_cycle_1 = tslib_1.__importDefault(require("./rules/no-cycle"));
const no_default_export_1 = tslib_1.__importDefault(require("./rules/no-default-export"));
const no_deprecated_1 = tslib_1.__importDefault(require("./rules/no-deprecated"));
const no_duplicates_1 = tslib_1.__importDefault(require("./rules/no-duplicates"));
const no_dynamic_require_1 = tslib_1.__importDefault(require("./rules/no-dynamic-require"));
const no_empty_named_blocks_1 = tslib_1.__importDefault(require("./rules/no-empty-named-blocks"));
const no_extraneous_dependencies_1 = tslib_1.__importDefault(require("./rules/no-extraneous-dependencies"));
const no_import_module_exports_1 = tslib_1.__importDefault(require("./rules/no-import-module-exports"));
const no_internal_modules_1 = tslib_1.__importDefault(require("./rules/no-internal-modules"));
const no_mutable_exports_1 = tslib_1.__importDefault(require("./rules/no-mutable-exports"));
const no_named_as_default_1 = tslib_1.__importDefault(require("./rules/no-named-as-default"));
const no_named_as_default_member_1 = tslib_1.__importDefault(require("./rules/no-named-as-default-member"));
const no_named_default_1 = tslib_1.__importDefault(require("./rules/no-named-default"));
const no_named_export_1 = tslib_1.__importDefault(require("./rules/no-named-export"));
const no_namespace_1 = tslib_1.__importDefault(require("./rules/no-namespace"));
const no_nodejs_modules_1 = tslib_1.__importDefault(require("./rules/no-nodejs-modules"));
const no_relative_packages_1 = tslib_1.__importDefault(require("./rules/no-relative-packages"));
const no_relative_parent_imports_1 = tslib_1.__importDefault(require("./rules/no-relative-parent-imports"));
const no_rename_default_1 = tslib_1.__importDefault(require("./rules/no-rename-default"));
const no_restricted_paths_1 = tslib_1.__importDefault(require("./rules/no-restricted-paths"));
const no_self_import_1 = tslib_1.__importDefault(require("./rules/no-self-import"));
const no_unassigned_import_1 = tslib_1.__importDefault(require("./rules/no-unassigned-import"));
const no_unresolved_1 = tslib_1.__importDefault(require("./rules/no-unresolved"));
const no_unused_modules_1 = tslib_1.__importDefault(require("./rules/no-unused-modules"));
const no_useless_path_segments_1 = tslib_1.__importDefault(require("./rules/no-useless-path-segments"));
const no_webpack_loader_syntax_1 = tslib_1.__importDefault(require("./rules/no-webpack-loader-syntax"));
const order_1 = tslib_1.__importDefault(require("./rules/order"));
const prefer_default_export_1 = tslib_1.__importDefault(require("./rules/prefer-default-export"));
const unambiguous_1 = tslib_1.__importDefault(require("./rules/unambiguous"));
const utils_1 = require("./utils");
const rules = {
    'no-unresolved': no_unresolved_1.default,
    named: named_1.default,
    default: default_1.default,
    namespace: namespace_1.default,
    'no-namespace': no_namespace_1.default,
    export: export_1.default,
    'no-mutable-exports': no_mutable_exports_1.default,
    extensions: extensions_1.default,
    'no-restricted-paths': no_restricted_paths_1.default,
    'no-internal-modules': no_internal_modules_1.default,
    'group-exports': group_exports_1.default,
    'no-relative-packages': no_relative_packages_1.default,
    'no-relative-parent-imports': no_relative_parent_imports_1.default,
    'consistent-type-specifier-style': consistent_type_specifier_style_1.default,
    'no-self-import': no_self_import_1.default,
    'no-cycle': no_cycle_1.default,
    'no-named-default': no_named_default_1.default,
    'no-named-as-default': no_named_as_default_1.default,
    'no-named-as-default-member': no_named_as_default_member_1.default,
    'no-anonymous-default-export': no_anonymous_default_export_1.default,
    'no-rename-default': no_rename_default_1.default,
    'no-unused-modules': no_unused_modules_1.default,
    'no-commonjs': no_commonjs_1.default,
    'no-amd': no_amd_1.default,
    'no-duplicates': no_duplicates_1.default,
    first: first_1.default,
    'max-dependencies': max_dependencies_1.default,
    'no-extraneous-dependencies': no_extraneous_dependencies_1.default,
    'no-absolute-path': no_absolute_path_1.default,
    'no-nodejs-modules': no_nodejs_modules_1.default,
    'no-webpack-loader-syntax': no_webpack_loader_syntax_1.default,
    order: order_1.default,
    'newline-after-import': newline_after_import_1.default,
    'prefer-default-export': prefer_default_export_1.default,
    'no-default-export': no_default_export_1.default,
    'no-named-export': no_named_export_1.default,
    'no-dynamic-require': no_dynamic_require_1.default,
    unambiguous: unambiguous_1.default,
    'no-unassigned-import': no_unassigned_import_1.default,
    'no-useless-path-segments': no_useless_path_segments_1.default,
    'dynamic-import-chunkname': dynamic_import_chunkname_1.default,
    'no-import-module-exports': no_import_module_exports_1.default,
    'no-empty-named-blocks': no_empty_named_blocks_1.default,
    'exports-last': exports_last_1.default,
    'no-deprecated': no_deprecated_1.default,
    'imports-first': imports_first_1.default,
};
const configs = {
    recommended: recommended_2.default,
    errors: errors_1.default,
    warnings: warnings_2.default,
    'stage-0': stage_0_2.default,
    react: react_2.default,
    'react-native': react_native_2.default,
    electron: electron_1.default,
    typescript: typescript_2.default,
};
const plugin = {
    meta: { name: package_json_1.name, version: package_json_1.version },
    rules,
};
const createFlatConfig = (baseConfig, configName) => ({
    ...baseConfig,
    name: `import-x/${configName}`,
    plugins: { 'import-x': plugin },
});
const flatConfigs = {
    recommended: createFlatConfig(recommended_1.default, 'recommended'),
    errors: createFlatConfig(errors_2.default, 'errors'),
    warnings: createFlatConfig(warnings_1.default, 'warnings'),
    'stage-0': createFlatConfig(stage_0_1.default, 'stage-0'),
    react: react_1.default,
    'react-native': react_native_1.default,
    electron: electron_2.default,
    typescript: typescript_1.default,
};
module.exports = {
    configs,
    flatConfigs,
    rules,
    importXResolverCompat: utils_1.importXResolverCompat,
    createNodeResolver: node_resolver_1.createNodeResolver,
};
//# sourceMappingURL=index.js.map