"use strict";
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const utils_1 = require("../utils");
const modifierValues = ['always', 'ignorePackages', 'never'];
const modifierSchema = {
    type: 'string',
    enum: [...modifierValues],
};
const modifierByFileExtensionSchema = {
    type: 'object',
    patternProperties: { '.*': modifierSchema },
};
const properties = {
    type: 'object',
    properties: {
        pattern: modifierByFileExtensionSchema,
        ignorePackages: {
            type: 'boolean',
        },
        checkTypeImports: {
            type: 'boolean',
        },
    },
};
function buildProperties(context) {
    const result = {
        defaultConfig: 'never',
        pattern: {},
        ignorePackages: false,
        checkTypeImports: false,
    };
    for (const obj of context.options) {
        if (typeof obj === 'string') {
            result.defaultConfig = obj;
            continue;
        }
        if (typeof obj !== 'object' || !obj) {
            continue;
        }
        if ((!('pattern' in obj) || obj.pattern === undefined) &&
            obj.ignorePackages === undefined &&
            obj.checkTypeImports === undefined) {
            Object.assign(result.pattern, obj);
            continue;
        }
        if ('pattern' in obj && obj.pattern !== undefined) {
            Object.assign(result.pattern, obj.pattern);
        }
        if (typeof obj.ignorePackages === 'boolean') {
            result.ignorePackages = obj.ignorePackages;
        }
        if (typeof obj.checkTypeImports === 'boolean') {
            result.checkTypeImports = obj.checkTypeImports;
        }
    }
    if (result.defaultConfig === 'ignorePackages') {
        result.defaultConfig = 'always';
        result.ignorePackages = true;
    }
    return result;
}
function isExternalRootModule(file) {
    if (file === '.' || file === '..') {
        return false;
    }
    const slashCount = file.split('/').length - 1;
    if (slashCount === 0) {
        return true;
    }
    if ((0, utils_1.isScoped)(file) && slashCount <= 1) {
        return true;
    }
    return false;
}
module.exports = (0, utils_1.createRule)({
    name: 'extensions',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Style guide',
            description: 'Ensure consistent use of file extension within the import path.',
        },
        schema: {
            anyOf: [
                {
                    type: 'array',
                    items: [modifierSchema],
                    additionalItems: false,
                },
                {
                    type: 'array',
                    items: [modifierSchema, properties],
                    additionalItems: false,
                },
                {
                    type: 'array',
                    items: [properties],
                    additionalItems: false,
                },
                {
                    type: 'array',
                    items: [modifierSchema, modifierByFileExtensionSchema],
                    additionalItems: false,
                },
                {
                    type: 'array',
                    items: [modifierByFileExtensionSchema],
                    additionalItems: false,
                },
            ],
        },
        messages: {
            missing: 'Missing file extension for "{{importPath}}"',
            missingKnown: 'Missing file extension "{{extension}}" for "{{importPath}}"',
            unexpected: 'Unexpected use of file extension "{{extension}}" for "{{importPath}}"',
        },
    },
    defaultOptions: [],
    create(context) {
        const props = buildProperties(context);
        function getModifier(extension) {
            return props.pattern[extension] || props.defaultConfig;
        }
        function isUseOfExtensionRequired(extension, isPackage) {
            return (getModifier(extension) === 'always' &&
                (!props.ignorePackages || !isPackage));
        }
        function isUseOfExtensionForbidden(extension) {
            return getModifier(extension) === 'never';
        }
        function isResolvableWithoutExtension(file) {
            const extension = node_path_1.default.extname(file);
            const fileWithoutExtension = file.slice(0, -extension.length);
            const resolvedFileWithoutExtension = (0, utils_1.resolve)(fileWithoutExtension, context);
            return resolvedFileWithoutExtension === (0, utils_1.resolve)(file, context);
        }
        return (0, utils_1.moduleVisitor)((source, node) => {
            if (!source || !source.value) {
                return;
            }
            const importPathWithQueryString = source.value;
            if ((0, utils_1.isBuiltIn)(importPathWithQueryString, context.settings)) {
                return;
            }
            const importPath = importPathWithQueryString.replace(/\?(.*)$/, '');
            if (isExternalRootModule(importPath)) {
                return;
            }
            const resolvedPath = (0, utils_1.resolve)(importPath, context);
            const extension = node_path_1.default
                .extname(resolvedPath || importPath)
                .slice(1);
            const isPackage = (0, utils_1.isExternalModule)(importPath, (0, utils_1.resolve)(importPath, context), context) || (0, utils_1.isScoped)(importPath);
            if (!extension || !importPath.endsWith(`.${extension}`)) {
                if (!props.checkTypeImports &&
                    (('importKind' in node && node.importKind === 'type') ||
                        ('exportKind' in node && node.exportKind === 'type'))) {
                    return;
                }
                const extensionRequired = isUseOfExtensionRequired(extension, isPackage);
                const extensionForbidden = isUseOfExtensionForbidden(extension);
                if (extensionRequired && !extensionForbidden) {
                    context.report({
                        node: source,
                        messageId: extension ? 'missingKnown' : 'missing',
                        data: {
                            extension,
                            importPath: importPathWithQueryString,
                        },
                    });
                }
            }
            else if (extension &&
                isUseOfExtensionForbidden(extension) &&
                isResolvableWithoutExtension(importPath)) {
                context.report({
                    node: source,
                    messageId: 'unexpected',
                    data: {
                        extension,
                        importPath: importPathWithQueryString,
                    },
                });
            }
        }, { commonjs: true });
    },
});
//# sourceMappingURL=extensions.js.map