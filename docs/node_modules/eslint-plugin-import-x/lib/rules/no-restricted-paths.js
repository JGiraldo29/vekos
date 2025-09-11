"use strict";
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const is_glob_1 = tslib_1.__importDefault(require("is-glob"));
const minimatch_1 = require("minimatch");
const utils_1 = require("../utils");
const containsPath = (filepath, target) => {
    const relative = node_path_1.default.relative(target, filepath);
    return relative === '' || !relative.startsWith('..');
};
function isMatchingTargetPath(filename, targetPath) {
    if ((0, is_glob_1.default)(targetPath)) {
        const mm = new minimatch_1.Minimatch(targetPath);
        return mm.match(filename);
    }
    return containsPath(filename, targetPath);
}
function areBothGlobPatternAndAbsolutePath(areGlobPatterns) {
    return (areGlobPatterns.some(Boolean) && areGlobPatterns.some(isGlob => !isGlob));
}
module.exports = (0, utils_1.createRule)({
    name: 'no-restricted-paths',
    meta: {
        type: 'problem',
        docs: {
            category: 'Static analysis',
            description: 'Enforce which files can be imported in a given folder.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    zones: {
                        type: 'array',
                        minItems: 1,
                        items: {
                            type: 'object',
                            properties: {
                                target: {
                                    anyOf: [
                                        { type: 'string' },
                                        {
                                            type: 'array',
                                            items: { type: 'string' },
                                            uniqueItems: true,
                                            minItems: 1,
                                        },
                                    ],
                                },
                                from: {
                                    anyOf: [
                                        { type: 'string' },
                                        {
                                            type: 'array',
                                            items: { type: 'string' },
                                            uniqueItems: true,
                                            minItems: 1,
                                        },
                                    ],
                                },
                                except: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    uniqueItems: true,
                                },
                                message: { type: 'string' },
                            },
                            additionalProperties: false,
                        },
                    },
                    basePath: { type: 'string' },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            path: 'Restricted path exceptions must be descendants of the configured `from` path for that zone.',
            mixedGlob: 'Restricted path `from` must contain either only glob patterns or none',
            glob: 'Restricted path exceptions must be glob patterns when `from` contains glob patterns',
            zone: 'Unexpected path "{{importPath}}" imported in restricted zone.{{extra}}',
        },
    },
    defaultOptions: [],
    create(context) {
        const options = context.options[0] || {};
        const restrictedPaths = options.zones || [];
        const basePath = options.basePath || process.cwd();
        const filename = context.physicalFilename;
        const matchingZones = restrictedPaths.filter(zone => [zone.target]
            .flat()
            .map(target => node_path_1.default.resolve(basePath, target))
            .some(targetPath => isMatchingTargetPath(filename, targetPath)));
        function isValidExceptionPath(absoluteFromPath, absoluteExceptionPath) {
            const relativeExceptionPath = node_path_1.default.relative(absoluteFromPath, absoluteExceptionPath);
            return (0, utils_1.importType)(relativeExceptionPath, context) !== 'parent';
        }
        function reportInvalidExceptionPath(node) {
            context.report({
                node,
                messageId: 'path',
            });
        }
        function reportInvalidExceptionMixedGlobAndNonGlob(node) {
            context.report({
                node,
                messageId: 'mixedGlob',
            });
        }
        function reportInvalidExceptionGlob(node) {
            context.report({
                node,
                messageId: 'glob',
            });
        }
        function computeMixedGlobAndAbsolutePathValidator() {
            return {
                isPathRestricted: () => true,
                hasValidExceptions: false,
                reportInvalidException: reportInvalidExceptionMixedGlobAndNonGlob,
            };
        }
        function computeGlobPatternPathValidator(absoluteFrom, zoneExcept) {
            let isPathException;
            const mm = new minimatch_1.Minimatch(absoluteFrom);
            const isPathRestricted = (absoluteImportPath) => mm.match(absoluteImportPath);
            const hasValidExceptions = zoneExcept.every(it => (0, is_glob_1.default)(it));
            if (hasValidExceptions) {
                const exceptionsMm = zoneExcept.map(except => new minimatch_1.Minimatch(except));
                isPathException = (absoluteImportPath) => exceptionsMm.some(mm => mm.match(absoluteImportPath));
            }
            const reportInvalidException = reportInvalidExceptionGlob;
            return {
                isPathRestricted,
                hasValidExceptions,
                isPathException,
                reportInvalidException,
            };
        }
        function computeAbsolutePathValidator(absoluteFrom, zoneExcept) {
            let isPathException;
            const isPathRestricted = (absoluteImportPath) => containsPath(absoluteImportPath, absoluteFrom);
            const absoluteExceptionPaths = zoneExcept.map(exceptionPath => node_path_1.default.resolve(absoluteFrom, exceptionPath));
            const hasValidExceptions = absoluteExceptionPaths.every(absoluteExceptionPath => isValidExceptionPath(absoluteFrom, absoluteExceptionPath));
            if (hasValidExceptions) {
                isPathException = absoluteImportPath => absoluteExceptionPaths.some(absoluteExceptionPath => containsPath(absoluteImportPath, absoluteExceptionPath));
            }
            const reportInvalidException = reportInvalidExceptionPath;
            return {
                isPathRestricted,
                hasValidExceptions,
                isPathException,
                reportInvalidException,
            };
        }
        function reportInvalidExceptions(validators, node) {
            for (const validator of validators)
                validator.reportInvalidException(node);
        }
        function reportImportsInRestrictedZone(validators, node, importPath, customMessage) {
            for (const _ of validators) {
                context.report({
                    node,
                    messageId: 'zone',
                    data: {
                        importPath,
                        extra: customMessage ? ` ${customMessage}` : '',
                    },
                });
            }
        }
        const makePathValidators = (zoneFrom, zoneExcept = []) => {
            const allZoneFrom = [zoneFrom].flat();
            const areGlobPatterns = allZoneFrom.map(it => (0, is_glob_1.default)(it));
            if (areBothGlobPatternAndAbsolutePath(areGlobPatterns)) {
                return [computeMixedGlobAndAbsolutePathValidator()];
            }
            const isGlobPattern = areGlobPatterns.every(Boolean);
            return allZoneFrom.map(singleZoneFrom => {
                const absoluteFrom = node_path_1.default.resolve(basePath, singleZoneFrom);
                if (isGlobPattern) {
                    return computeGlobPatternPathValidator(absoluteFrom, zoneExcept);
                }
                return computeAbsolutePathValidator(absoluteFrom, zoneExcept);
            });
        };
        const validators = [];
        return (0, utils_1.moduleVisitor)(source => {
            const importPath = source.value;
            const absoluteImportPath = (0, utils_1.resolve)(importPath, context);
            if (!absoluteImportPath) {
                return;
            }
            for (const [index, zone] of matchingZones.entries()) {
                if (!validators[index]) {
                    validators[index] = makePathValidators(zone.from, zone.except);
                }
                const applicableValidatorsForImportPath = validators[index].filter(validator => validator.isPathRestricted(absoluteImportPath));
                const validatorsWithInvalidExceptions = applicableValidatorsForImportPath.filter(validator => !validator.hasValidExceptions);
                reportInvalidExceptions(validatorsWithInvalidExceptions, source);
                const applicableValidatorsForImportPathExcludingExceptions = applicableValidatorsForImportPath.filter(validator => validator.hasValidExceptions &&
                    !validator.isPathException(absoluteImportPath));
                reportImportsInRestrictedZone(applicableValidatorsForImportPathExcludingExceptions, source, importPath, zone.message);
            }
        }, { commonjs: true });
    },
});
//# sourceMappingURL=no-restricted-paths.js.map