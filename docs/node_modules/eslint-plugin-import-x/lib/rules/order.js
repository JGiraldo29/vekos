"use strict";
const minimatch_1 = require("minimatch");
const utils_1 = require("../utils");
const groupBy = (array, grouper) => array.reduce((acc, curr, index) => {
    const key = grouper(curr, index);
    (acc[key] ||= []).push(curr);
    return acc;
}, {});
const defaultGroups = [
    'builtin',
    'external',
    'parent',
    'sibling',
    'index',
];
function reverse(array) {
    return array
        .map(function (v) {
        return { ...v, rank: -v.rank };
    })
        .reverse();
}
function getTokensOrCommentsAfter(sourceCode, node, count) {
    let currentNodeOrToken = node;
    const result = [];
    for (let i = 0; i < count; i++) {
        currentNodeOrToken = sourceCode.getTokenAfter(currentNodeOrToken, {
            includeComments: true,
        });
        if (currentNodeOrToken == null) {
            break;
        }
        result.push(currentNodeOrToken);
    }
    return result;
}
function getTokensOrCommentsBefore(sourceCode, node, count) {
    let currentNodeOrToken = node;
    const result = [];
    for (let i = 0; i < count; i++) {
        currentNodeOrToken = sourceCode.getTokenBefore(currentNodeOrToken, {
            includeComments: true,
        });
        if (currentNodeOrToken == null) {
            break;
        }
        result.push(currentNodeOrToken);
    }
    return result.reverse();
}
function takeTokensAfterWhile(sourceCode, node, condition) {
    const tokens = getTokensOrCommentsAfter(sourceCode, node, 100);
    const result = [];
    for (const token of tokens) {
        if (condition(token)) {
            result.push(token);
        }
        else {
            break;
        }
    }
    return result;
}
function takeTokensBeforeWhile(sourceCode, node, condition) {
    const tokens = getTokensOrCommentsBefore(sourceCode, node, 100);
    const result = [];
    for (let i = tokens.length - 1; i >= 0; i--) {
        if (condition(tokens[i])) {
            result.push(tokens[i]);
        }
        else {
            break;
        }
    }
    return result.reverse();
}
function findOutOfOrder(imported) {
    if (imported.length === 0) {
        return [];
    }
    let maxSeenRankNode = imported[0];
    return imported.filter(function (importedModule) {
        const res = importedModule.rank < maxSeenRankNode.rank;
        if (maxSeenRankNode.rank < importedModule.rank) {
            maxSeenRankNode = importedModule;
        }
        return res;
    });
}
function findRootNode(node) {
    let parent = node;
    while (parent.parent != null &&
        (!('body' in parent.parent) || parent.parent.body == null)) {
        parent = parent.parent;
    }
    return parent;
}
function findEndOfLineWithComments(sourceCode, node) {
    const tokensToEndOfLine = takeTokensAfterWhile(sourceCode, node, commentOnSameLineAs(node));
    const endOfTokens = tokensToEndOfLine.length > 0
        ? tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1]
        : node.range[1];
    let result = endOfTokens;
    for (let i = endOfTokens; i < sourceCode.text.length; i++) {
        if (sourceCode.text[i] === '\n') {
            result = i + 1;
            break;
        }
        if (sourceCode.text[i] !== ' ' &&
            sourceCode.text[i] !== '\t' &&
            sourceCode.text[i] !== '\r') {
            break;
        }
        result = i + 1;
    }
    return result;
}
function commentOnSameLineAs(node) {
    return (token) => (token.type === 'Block' || token.type === 'Line') &&
        token.loc.start.line === token.loc.end.line &&
        token.loc.end.line === node.loc.end.line;
}
function findStartOfLineWithComments(sourceCode, node) {
    const tokensToEndOfLine = takeTokensBeforeWhile(sourceCode, node, commentOnSameLineAs(node));
    const startOfTokens = tokensToEndOfLine.length > 0 ? tokensToEndOfLine[0].range[0] : node.range[0];
    let result = startOfTokens;
    for (let i = startOfTokens - 1; i > 0; i--) {
        if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t') {
            break;
        }
        result = i;
    }
    return result;
}
function isRequireExpression(expr) {
    return (expr != null &&
        expr.type === 'CallExpression' &&
        expr.callee != null &&
        'name' in expr.callee &&
        expr.callee.name === 'require' &&
        expr.arguments != null &&
        expr.arguments.length === 1 &&
        expr.arguments[0].type === 'Literal');
}
function isSupportedRequireModule(node) {
    if (node.type !== 'VariableDeclaration') {
        return false;
    }
    if (node.declarations.length !== 1) {
        return false;
    }
    const decl = node.declarations[0];
    const isPlainRequire = decl.id &&
        (decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
        isRequireExpression(decl.init);
    const isRequireWithMemberExpression = decl.id &&
        (decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
        decl.init != null &&
        decl.init.type === 'CallExpression' &&
        decl.init.callee != null &&
        decl.init.callee.type === 'MemberExpression' &&
        isRequireExpression(decl.init.callee.object);
    return isPlainRequire || isRequireWithMemberExpression;
}
function isPlainImportModule(node) {
    return (node.type === 'ImportDeclaration' &&
        node.specifiers != null &&
        node.specifiers.length > 0);
}
function isPlainImportEquals(node) {
    return (node.type === 'TSImportEqualsDeclaration' &&
        'expression' in node.moduleReference &&
        !!node.moduleReference.expression);
}
function canCrossNodeWhileReorder(node) {
    return (isSupportedRequireModule(node) ||
        isPlainImportModule(node) ||
        isPlainImportEquals(node));
}
function canReorderItems(firstNode, secondNode) {
    const parent = firstNode.parent;
    const [firstIndex, secondIndex] = [
        parent.body.indexOf(firstNode),
        parent.body.indexOf(secondNode),
    ].sort();
    const nodesBetween = parent.body.slice(firstIndex, secondIndex + 1);
    for (const nodeBetween of nodesBetween) {
        if (!canCrossNodeWhileReorder(nodeBetween)) {
            return false;
        }
    }
    return true;
}
function makeImportDescription(node) {
    if ('importKind' in node.node) {
        if (node.node.importKind === 'type') {
            return 'type import';
        }
        if (node.node.importKind === 'typeof') {
            return 'typeof import';
        }
    }
    return 'import';
}
function fixOutOfOrder(context, firstNode, secondNode, order) {
    const { sourceCode } = context;
    const firstRoot = findRootNode(firstNode.node);
    const firstRootStart = findStartOfLineWithComments(sourceCode, firstRoot);
    const firstRootEnd = findEndOfLineWithComments(sourceCode, firstRoot);
    const secondRoot = findRootNode(secondNode.node);
    const secondRootStart = findStartOfLineWithComments(sourceCode, secondRoot);
    const secondRootEnd = findEndOfLineWithComments(sourceCode, secondRoot);
    const canFix = canReorderItems(firstRoot, secondRoot);
    let newCode = sourceCode.text.slice(secondRootStart, secondRootEnd);
    if (newCode[newCode.length - 1] !== '\n') {
        newCode = `${newCode}\n`;
    }
    const firstImport = `${makeImportDescription(firstNode)} of \`${firstNode.displayName}\``;
    const secondImport = `\`${secondNode.displayName}\` ${makeImportDescription(secondNode)}`;
    context.report({
        node: secondNode.node,
        messageId: 'order',
        data: {
            firstImport,
            secondImport,
            order,
        },
        fix: canFix
            ? fixer => order === 'before'
                ? fixer.replaceTextRange([firstRootStart, secondRootEnd], newCode +
                    sourceCode.text.slice(firstRootStart, secondRootStart))
                : fixer.replaceTextRange([secondRootStart, firstRootEnd], sourceCode.text.slice(secondRootEnd, firstRootEnd) + newCode)
            : null,
    });
}
function reportOutOfOrder(context, imported, outOfOrder, order) {
    for (const imp of outOfOrder) {
        fixOutOfOrder(context, imported.find(importedItem => importedItem.rank > imp.rank), imp, order);
    }
}
function makeOutOfOrderReport(context, imported) {
    const outOfOrder = findOutOfOrder(imported);
    if (outOfOrder.length === 0) {
        return;
    }
    const reversedImported = reverse(imported);
    const reversedOrder = findOutOfOrder(reversedImported);
    if (reversedOrder.length < outOfOrder.length) {
        reportOutOfOrder(context, reversedImported, reversedOrder, 'after');
        return;
    }
    reportOutOfOrder(context, imported, outOfOrder, 'before');
}
const compareString = (a, b) => {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};
const DEFAULT_IMPORT_KIND = 'value';
const getNormalizedValue = (node, toLowerCase) => {
    const value = node.value;
    return toLowerCase ? String(value).toLowerCase() : value;
};
function getSorter(alphabetizeOptions) {
    const multiplier = alphabetizeOptions.order === 'asc' ? 1 : -1;
    const orderImportKind = alphabetizeOptions.orderImportKind;
    const multiplierImportKind = orderImportKind !== 'ignore' &&
        (alphabetizeOptions.orderImportKind === 'asc' ? 1 : -1);
    return (nodeA, nodeB) => {
        const importA = getNormalizedValue(nodeA, alphabetizeOptions.caseInsensitive);
        const importB = getNormalizedValue(nodeB, alphabetizeOptions.caseInsensitive);
        let result = 0;
        if (!importA.includes('/') && !importB.includes('/')) {
            result = compareString(importA, importB);
        }
        else {
            const A = importA.split('/');
            const B = importB.split('/');
            const a = A.length;
            const b = B.length;
            for (let i = 0; i < Math.min(a, b); i++) {
                result = compareString(A[i], B[i]);
                if (result) {
                    break;
                }
            }
            if (!result && a !== b) {
                result = a < b ? -1 : 1;
            }
        }
        result = result * multiplier;
        if (!result && multiplierImportKind) {
            result =
                multiplierImportKind *
                    compareString(('importKind' in nodeA.node && nodeA.node.importKind) ||
                        DEFAULT_IMPORT_KIND, ('importKind' in nodeB.node && nodeB.node.importKind) ||
                        DEFAULT_IMPORT_KIND);
        }
        return result;
    };
}
function mutateRanksToAlphabetize(imported, alphabetizeOptions) {
    const groupedByRanks = groupBy(imported, item => item.rank);
    const sorterFn = getSorter(alphabetizeOptions);
    const groupRanks = Object.keys(groupedByRanks).sort((a, b) => +a - +b);
    for (const groupRank of groupRanks) {
        groupedByRanks[groupRank].sort(sorterFn);
    }
    let newRank = 0;
    const alphabetizedRanks = groupRanks.reduce((acc, groupRank) => {
        for (const importedItem of groupedByRanks[groupRank]) {
            acc[`${importedItem.value}|${'importKind' in importedItem.node ? importedItem.node.importKind : ''}`] = Number.parseInt(groupRank, 10) + newRank;
            newRank += 1;
        }
        return acc;
    }, {});
    for (const importedItem of imported) {
        importedItem.rank =
            alphabetizedRanks[`${importedItem.value}|${'importKind' in importedItem.node ? importedItem.node.importKind : ''}`];
    }
}
function computePathRank(ranks, pathGroups, path, maxPosition) {
    for (let i = 0, l = pathGroups.length; i < l; i++) {
        const { pattern, patternOptions, group, position = 1 } = pathGroups[i];
        if ((0, minimatch_1.minimatch)(path, pattern, patternOptions || { nocomment: true })) {
            return ranks[group] + position / maxPosition;
        }
    }
}
function computeRank(context, ranks, importEntry, excludedImportTypes) {
    let impType;
    let rank;
    if (importEntry.type === 'import:object') {
        impType = 'object';
    }
    else if ('importKind' in importEntry.node &&
        importEntry.node.importKind === 'type' &&
        !ranks.omittedTypes.includes('type')) {
        impType = 'type';
    }
    else {
        impType = (0, utils_1.importType)(importEntry.value, context);
    }
    if (!excludedImportTypes.has(impType)) {
        rank = computePathRank(ranks.groups, ranks.pathGroups, importEntry.value, ranks.maxPosition);
    }
    if (rank === undefined) {
        rank = ranks.groups[impType];
    }
    if (importEntry.type !== 'import' &&
        !importEntry.type.startsWith('import:')) {
        rank += 100;
    }
    return rank;
}
function registerNode(context, importEntry, ranks, imported, excludedImportTypes) {
    const rank = computeRank(context, ranks, importEntry, excludedImportTypes);
    if (rank !== -1) {
        imported.push({ ...importEntry, rank });
    }
}
function getRequireBlock(node) {
    let n = node;
    while (n.parent &&
        ((n.parent.type === 'MemberExpression' && n.parent.object === n) ||
            (n.parent.type === 'CallExpression' && n.parent.callee === n))) {
        n = n.parent;
    }
    if (n.parent?.type === 'VariableDeclarator' &&
        n.parent.parent?.type === 'VariableDeclaration' &&
        n.parent.parent.parent?.type === 'Program') {
        return n.parent.parent.parent;
    }
}
const types = [
    'builtin',
    'external',
    'internal',
    'unknown',
    'parent',
    'sibling',
    'index',
    'object',
    'type',
];
function convertGroupsToRanks(groups) {
    const rankObject = groups.reduce((res, group, index) => {
        for (const groupItem of [group].flat()) {
            if (!types.includes(groupItem)) {
                throw new Error(`Incorrect configuration of the rule: Unknown type \`${JSON.stringify(groupItem)}\``);
            }
            if (res[groupItem] !== undefined) {
                throw new Error(`Incorrect configuration of the rule: \`${groupItem}\` is duplicated`);
            }
            res[groupItem] = index * 2;
        }
        return res;
    }, {});
    const omittedTypes = types.filter(function (type) {
        return rankObject[type] === undefined;
    });
    const ranks = omittedTypes.reduce(function (res, type) {
        res[type] = groups.length * 2;
        return res;
    }, rankObject);
    return { groups: ranks, omittedTypes };
}
function convertPathGroupsForRanks(pathGroups) {
    const after = {};
    const before = {};
    const transformed = pathGroups.map((pathGroup, index) => {
        const { group, position: positionString } = pathGroup;
        let position = 0;
        if (positionString === 'after') {
            if (!after[group]) {
                after[group] = 1;
            }
            position = after[group]++;
        }
        else if (positionString === 'before') {
            if (!before[group]) {
                before[group] = [];
            }
            before[group].push(index);
        }
        return { ...pathGroup, position };
    });
    let maxPosition = 1;
    for (const group of Object.keys(before)) {
        const groupLength = before[group].length;
        for (const [index, groupIndex] of before[group].entries()) {
            transformed[groupIndex].position = -1 * (groupLength - index);
        }
        maxPosition = Math.max(maxPosition, groupLength);
    }
    for (const key of Object.keys(after)) {
        const groupNextPosition = after[key];
        maxPosition = Math.max(maxPosition, groupNextPosition - 1);
    }
    return {
        pathGroups: transformed,
        maxPosition: maxPosition > 10 ? Math.pow(10, Math.ceil(Math.log10(maxPosition))) : 10,
    };
}
function fixNewLineAfterImport(context, previousImport) {
    const prevRoot = findRootNode(previousImport.node);
    const tokensToEndOfLine = takeTokensAfterWhile(context.sourceCode, prevRoot, commentOnSameLineAs(prevRoot));
    let endOfLine = prevRoot.range[1];
    if (tokensToEndOfLine.length > 0) {
        endOfLine = tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1];
    }
    return (fixer) => fixer.insertTextAfterRange([prevRoot.range[0], endOfLine], '\n');
}
function removeNewLineAfterImport(context, currentImport, previousImport) {
    const { sourceCode } = context;
    const prevRoot = findRootNode(previousImport.node);
    const currRoot = findRootNode(currentImport.node);
    const rangeToRemove = [
        findEndOfLineWithComments(sourceCode, prevRoot),
        findStartOfLineWithComments(sourceCode, currRoot),
    ];
    if (/^\s*$/.test(sourceCode.text.slice(rangeToRemove[0], rangeToRemove[1]))) {
        return (fixer) => fixer.removeRange(rangeToRemove);
    }
}
function makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup) {
    const getNumberOfEmptyLinesBetween = (currentImport, previousImport) => {
        return context
            .getSourceCode()
            .lines.slice(previousImport.node.loc.end.line, currentImport.node.loc.start.line - 1)
            .filter(line => line.trim().length === 0).length;
    };
    const getIsStartOfDistinctGroup = (currentImport, previousImport) => currentImport.rank - 1 >= previousImport.rank;
    let previousImport = imported[0];
    for (const currentImport of imported.slice(1)) {
        const emptyLinesBetween = getNumberOfEmptyLinesBetween(currentImport, previousImport);
        const isStartOfDistinctGroup = getIsStartOfDistinctGroup(currentImport, previousImport);
        if (newlinesBetweenImports === 'always' ||
            newlinesBetweenImports === 'always-and-inside-groups') {
            if (currentImport.rank !== previousImport.rank &&
                emptyLinesBetween === 0) {
                if (distinctGroup || (!distinctGroup && isStartOfDistinctGroup)) {
                    context.report({
                        node: previousImport.node,
                        messageId: 'oneLineBetweenGroups',
                        fix: fixNewLineAfterImport(context, previousImport),
                    });
                }
            }
            else if (emptyLinesBetween > 0 &&
                newlinesBetweenImports !== 'always-and-inside-groups' &&
                ((distinctGroup && currentImport.rank === previousImport.rank) ||
                    (!distinctGroup && !isStartOfDistinctGroup))) {
                context.report({
                    node: previousImport.node,
                    messageId: 'noLineWithinGroup',
                    fix: removeNewLineAfterImport(context, currentImport, previousImport),
                });
            }
        }
        else if (emptyLinesBetween > 0) {
            context.report({
                node: previousImport.node,
                messageId: 'noLineBetweenGroups',
                fix: removeNewLineAfterImport(context, currentImport, previousImport),
            });
        }
        previousImport = currentImport;
    }
}
function getAlphabetizeConfig(options) {
    const alphabetize = options.alphabetize || {};
    const order = alphabetize.order || 'ignore';
    const orderImportKind = alphabetize.orderImportKind || 'ignore';
    const caseInsensitive = alphabetize.caseInsensitive || false;
    return { order, orderImportKind, caseInsensitive };
}
const defaultDistinctGroup = true;
module.exports = (0, utils_1.createRule)({
    name: 'order',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Style guide',
            description: 'Enforce a convention in module import order.',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    groups: {
                        type: 'array',
                    },
                    pathGroupsExcludedImportTypes: {
                        type: 'array',
                    },
                    distinctGroup: {
                        type: 'boolean',
                        default: defaultDistinctGroup,
                    },
                    pathGroups: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                pattern: {
                                    type: 'string',
                                },
                                patternOptions: {
                                    type: 'object',
                                },
                                group: {
                                    type: 'string',
                                    enum: [...types],
                                },
                                position: {
                                    type: 'string',
                                    enum: ['after', 'before'],
                                },
                            },
                            additionalProperties: false,
                            required: ['pattern', 'group'],
                        },
                    },
                    'newlines-between': {
                        type: 'string',
                        enum: ['ignore', 'always', 'always-and-inside-groups', 'never'],
                    },
                    alphabetize: {
                        type: 'object',
                        properties: {
                            caseInsensitive: {
                                type: 'boolean',
                                default: false,
                            },
                            order: {
                                type: 'string',
                                enum: ['ignore', 'asc', 'desc'],
                                default: 'ignore',
                            },
                            orderImportKind: {
                                type: 'string',
                                enum: ['ignore', 'asc', 'desc'],
                                default: 'ignore',
                            },
                        },
                        additionalProperties: false,
                    },
                    warnOnUnassignedImports: {
                        type: 'boolean',
                        default: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            error: '{{error}}',
            noLineWithinGroup: 'There should be no empty line within import group',
            noLineBetweenGroups: 'There should be no empty line between import groups',
            oneLineBetweenGroups: 'There should be at least one empty line between import groups',
            order: '{{secondImport}} should occur {{order}} {{firstImport}}',
        },
    },
    defaultOptions: [],
    create(context) {
        const options = context.options[0] || {};
        const newlinesBetweenImports = options['newlines-between'] || 'ignore';
        const pathGroupsExcludedImportTypes = new Set(options.pathGroupsExcludedImportTypes || [
            'builtin',
            'external',
            'object',
        ]);
        const alphabetize = getAlphabetizeConfig(options);
        const distinctGroup = options.distinctGroup == null
            ? defaultDistinctGroup
            : !!options.distinctGroup;
        let ranks;
        try {
            const { pathGroups, maxPosition } = convertPathGroupsForRanks(options.pathGroups || []);
            const { groups, omittedTypes } = convertGroupsToRanks(options.groups || defaultGroups);
            ranks = {
                groups,
                omittedTypes,
                pathGroups,
                maxPosition,
            };
        }
        catch (error) {
            return {
                Program(node) {
                    context.report({
                        node,
                        messageId: 'error',
                        data: {
                            error: error.message,
                        },
                    });
                },
            };
        }
        const importMap = new Map();
        function getBlockImports(node) {
            if (!importMap.has(node)) {
                importMap.set(node, []);
            }
            return importMap.get(node);
        }
        return {
            ImportDeclaration(node) {
                if (node.specifiers.length > 0 || options.warnOnUnassignedImports) {
                    const name = node.source.value;
                    registerNode(context, {
                        node,
                        value: name,
                        displayName: name,
                        type: 'import',
                    }, ranks, getBlockImports(node.parent), pathGroupsExcludedImportTypes);
                }
            },
            TSImportEqualsDeclaration(node) {
                let displayName;
                let value;
                let type;
                if (node.isExport) {
                    return;
                }
                if (node.moduleReference.type === 'TSExternalModuleReference' &&
                    'value' in node.moduleReference.expression &&
                    typeof node.moduleReference.expression.value === 'string') {
                    value = node.moduleReference.expression.value;
                    displayName = value;
                    type = 'import';
                }
                else {
                    value = '';
                    displayName = context.sourceCode.getText(node.moduleReference);
                    type = 'import:object';
                }
                registerNode(context, {
                    node,
                    value,
                    displayName,
                    type,
                }, ranks, getBlockImports(node.parent), pathGroupsExcludedImportTypes);
            },
            CallExpression(node) {
                if (!(0, utils_1.isStaticRequire)(node)) {
                    return;
                }
                const block = getRequireBlock(node);
                const firstArg = node.arguments[0];
                if (!block ||
                    !('value' in firstArg) ||
                    typeof firstArg.value !== 'string') {
                    return;
                }
                const name = firstArg.value;
                registerNode(context, {
                    node,
                    value: name,
                    displayName: name,
                    type: 'require',
                }, ranks, getBlockImports(block), pathGroupsExcludedImportTypes);
            },
            'Program:exit'() {
                for (const imported of importMap.values()) {
                    if (newlinesBetweenImports !== 'ignore') {
                        makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup);
                    }
                    if (alphabetize.order !== 'ignore') {
                        mutateRanksToAlphabetize(imported, alphabetize);
                    }
                    makeOutOfOrderReport(context, imported);
                }
                importMap.clear();
            },
        };
    },
});
//# sourceMappingURL=order.js.map