"use strict";
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const utils_1 = require("../utils");
function toRelativePath(relativePath) {
    const stripped = relativePath.replaceAll(/\/$/g, '');
    return /^((\.\.)|(\.))($|\/)/.test(stripped) ? stripped : `./${stripped}`;
}
function normalize(filepath) {
    return toRelativePath(node_path_1.default.posix.normalize(filepath));
}
function countRelativeParents(pathSegments) {
    return pathSegments.filter(x => x === '..').length;
}
module.exports = (0, utils_1.createRule)({
    name: 'no-useless-path-segments',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Static analysis',
            description: 'Forbid unnecessary path segments in import and require statements.',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    commonjs: { type: 'boolean' },
                    noUselessIndex: { type: 'boolean' },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            useless: 'Useless path segments for "{{importPath}}", should be "{{proposedPath}}"',
        },
    },
    defaultOptions: [],
    create(context) {
        const currentDir = node_path_1.default.dirname(context.physicalFilename);
        const options = context.options[0] || {};
        return (0, utils_1.moduleVisitor)(source => {
            const { value: importPath } = source;
            function reportWithProposedPath(proposedPath) {
                context.report({
                    node: source,
                    messageId: 'useless',
                    data: {
                        importPath,
                        proposedPath,
                    },
                    fix: fixer => proposedPath
                        ? fixer.replaceText(source, JSON.stringify(proposedPath))
                        : null,
                });
            }
            if (!importPath.startsWith('.')) {
                return;
            }
            const resolvedPath = (0, utils_1.resolve)(importPath, context);
            const normedPath = normalize(importPath);
            const resolvedNormedPath = (0, utils_1.resolve)(normedPath, context);
            if (normedPath !== importPath && resolvedPath === resolvedNormedPath) {
                return reportWithProposedPath(normedPath);
            }
            const fileExtensions = (0, utils_1.getFileExtensions)(context.settings);
            const regexUnnecessaryIndex = new RegExp(`.*\\/index(\\${[...fileExtensions].join('|\\')})?$`);
            if (options.noUselessIndex && regexUnnecessaryIndex.test(importPath)) {
                const parentDirectory = node_path_1.default.dirname(importPath);
                if (parentDirectory !== '.' && parentDirectory !== '..') {
                    for (const fileExtension of fileExtensions) {
                        if ((0, utils_1.resolve)(`${parentDirectory}${fileExtension}`, context)) {
                            return reportWithProposedPath(`${parentDirectory}/`);
                        }
                    }
                }
                return reportWithProposedPath(parentDirectory);
            }
            if (importPath.startsWith('./')) {
                return;
            }
            if (resolvedPath === undefined) {
                return;
            }
            const expected = node_path_1.default.relative(currentDir, resolvedPath);
            const expectedSplit = expected.split(node_path_1.default.sep);
            const importPathSplit = importPath.replace(/^\.\//, '').split('/');
            const countImportPathRelativeParents = countRelativeParents(importPathSplit);
            const countExpectedRelativeParents = countRelativeParents(expectedSplit);
            const diff = countImportPathRelativeParents - countExpectedRelativeParents;
            if (diff <= 0) {
                return;
            }
            return reportWithProposedPath(toRelativePath([
                ...importPathSplit.slice(0, countExpectedRelativeParents),
                ...importPathSplit.slice(countImportPathRelativeParents + diff),
            ].join('/')));
        }, options);
    },
});
//# sourceMappingURL=no-useless-path-segments.js.map