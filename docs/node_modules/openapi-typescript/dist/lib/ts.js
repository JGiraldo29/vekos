import { parseRef } from "@redocly/openapi-core/lib/ref-utils.js";
import ts from "typescript";
export const JS_PROPERTY_INDEX_RE = /^[A-Za-z_$][A-Za-z_$0-9]*$/;
export const JS_ENUM_INVALID_CHARS_RE = /[^A-Za-z_$0-9]+(.)?/g;
export const JS_PROPERTY_INDEX_INVALID_CHARS_RE = /[^A-Za-z_$0-9]+/g;
export const SPECIAL_CHARACTER_MAP = {
    "+": "Plus",
};
export const BOOLEAN = ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
export const FALSE = ts.factory.createLiteralTypeNode(ts.factory.createFalse());
export const NEVER = ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword);
export const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());
export const NUMBER = ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
export const QUESTION_TOKEN = ts.factory.createToken(ts.SyntaxKind.QuestionToken);
export const STRING = ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
export const TRUE = ts.factory.createLiteralTypeNode(ts.factory.createTrue());
export const UNDEFINED = ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);
export const UNKNOWN = ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
const LB_RE = /\r?\n/g;
const COMMENT_RE = /\*\//g;
export function addJSDocComment(schemaObject, node) {
    if (!schemaObject || typeof schemaObject !== "object" || Array.isArray(schemaObject)) {
        return;
    }
    const output = [];
    if (schemaObject.title) {
        output.push(schemaObject.title.replace(LB_RE, "\n *     "));
    }
    if (schemaObject.summary) {
        output.push(schemaObject.summary.replace(LB_RE, "\n *     "));
    }
    if (schemaObject.format) {
        output.push(`Format: ${schemaObject.format}`);
    }
    if (schemaObject.deprecated) {
        output.push("@deprecated");
    }
    const supportedJsDocTags = ["description", "default", "example"];
    for (const field of supportedJsDocTags) {
        const allowEmptyString = field === "default" || field === "example";
        if (schemaObject[field] === undefined) {
            continue;
        }
        if (schemaObject[field] === "" && !allowEmptyString) {
            continue;
        }
        const serialized = typeof schemaObject[field] === "object" ? JSON.stringify(schemaObject[field], null, 2) : schemaObject[field];
        output.push(`@${field} ${String(serialized).replace(LB_RE, "\n *     ")}`);
    }
    if ("const" in schemaObject) {
        output.push("@constant");
    }
    if (schemaObject.enum) {
        let type = "unknown";
        if (Array.isArray(schemaObject.type)) {
            type = schemaObject.type.join("|");
        }
        else if (typeof schemaObject.type === "string") {
            type = schemaObject.type;
        }
        output.push(`@enum {${type}${schemaObject.nullable ? "|null" : ""}}`);
    }
    if (output.length) {
        let text = output.length === 1
            ? `* ${output.join("\n")} `
            : `*
 * ${output.join("\n * ")}\n `;
        text = text.replace(COMMENT_RE, "*\\/");
        ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, text, true);
    }
}
export function oapiRef(path) {
    const { pointer } = parseRef(path);
    if (pointer.length === 0) {
        throw new Error(`Error parsing $ref: ${path}. Is this a valid $ref?`);
    }
    let t = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(String(pointer[0])));
    if (pointer.length > 1) {
        for (let i = 1; i < pointer.length; i++) {
            if (i > 2 && i < pointer.length - 1 && pointer[i] === "properties") {
                continue;
            }
            t = ts.factory.createIndexedAccessTypeNode(t, ts.factory.createLiteralTypeNode(typeof pointer[i] === "number"
                ? ts.factory.createNumericLiteral(pointer[i])
                : ts.factory.createStringLiteral(pointer[i])));
        }
    }
    return t;
}
export function astToString(ast, options) {
    const sourceFile = ts.createSourceFile(options?.fileName ?? "openapi-ts.ts", options?.sourceText ?? "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
    sourceFile.statements = ts.factory.createNodeArray(Array.isArray(ast) ? ast : [ast]);
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
        removeComments: false,
        ...options?.formatOptions,
    });
    return printer.printFile(sourceFile);
}
export function stringToAST(source) {
    return ts.createSourceFile("stringInput", source, ts.ScriptTarget.ESNext, undefined, undefined).statements;
}
export function tsDedupe(types) {
    const encounteredTypes = new Set();
    const filteredTypes = [];
    for (const t of types) {
        if (!("text" in (t.literal ?? t))) {
            const { kind } = t.literal ?? t;
            if (encounteredTypes.has(kind)) {
                continue;
            }
            if (tsIsPrimitive(t)) {
                encounteredTypes.add(kind);
            }
        }
        filteredTypes.push(t);
    }
    return filteredTypes;
}
export const enumCache = new Map();
export function tsEnum(name, members, metadata, options) {
    let enumName = sanitizeMemberName(name);
    enumName = `${enumName[0].toUpperCase()}${enumName.substring(1)}`;
    let key = "";
    if (options?.shouldCache) {
        key = `${members
            .slice(0)
            .sort()
            .map((v, i) => {
            return `${metadata?.[i]?.name ?? String(v)}:${metadata?.[i]?.description || ""}`;
        })
            .join(",")}`;
        if (enumCache.has(key)) {
            return enumCache.get(key);
        }
    }
    const enumDeclaration = ts.factory.createEnumDeclaration(options ? tsModifiers({ export: options.export ?? false }) : undefined, enumName, members.map((value, i) => tsEnumMember(value, metadata?.[i])));
    options?.shouldCache && enumCache.set(key, enumDeclaration);
    return enumDeclaration;
}
export function tsArrayLiteralExpression(name, elementType, values, options) {
    let variableName = sanitizeMemberName(name);
    variableName = `${variableName[0].toLowerCase()}${variableName.substring(1)}`;
    const arrayType = options?.readonly
        ? tsReadonlyArray(elementType, options.injectFooter)
        : ts.factory.createArrayTypeNode(elementType);
    return ts.factory.createVariableStatement(options ? tsModifiers({ export: options.export ?? false }) : undefined, ts.factory.createVariableDeclarationList([
        ts.factory.createVariableDeclaration(variableName, undefined, arrayType, ts.factory.createArrayLiteralExpression(values.map((value) => {
            if (typeof value === "number") {
                if (value < 0) {
                    return ts.factory.createPrefixUnaryExpression(ts.SyntaxKind.MinusToken, ts.factory.createNumericLiteral(Math.abs(value)));
                }
                else {
                    return ts.factory.createNumericLiteral(value);
                }
            }
            else {
                return ts.factory.createStringLiteral(value);
            }
        }))),
    ], ts.NodeFlags.Const));
}
function sanitizeMemberName(name) {
    let sanitizedName = name.replace(JS_ENUM_INVALID_CHARS_RE, (c) => {
        const last = c[c.length - 1];
        return JS_PROPERTY_INDEX_INVALID_CHARS_RE.test(last) ? "" : last.toUpperCase();
    });
    if (Number(name[0]) >= 0) {
        sanitizedName = `Value${name}`;
    }
    return sanitizedName;
}
export function tsEnumMember(value, metadata = {}) {
    let name = metadata.name ?? String(value);
    if (!JS_PROPERTY_INDEX_RE.test(name)) {
        if (Number(name[0]) >= 0) {
            name = `Value${name}`.replace(".", "_");
        }
        else if (name[0] === "-") {
            name = `ValueMinus${name.slice(1)}`;
        }
        const invalidCharMatch = name.match(JS_PROPERTY_INDEX_INVALID_CHARS_RE);
        if (invalidCharMatch) {
            if (invalidCharMatch[0] === name) {
                name = `"${name}"`;
            }
            else {
                name = name.replace(JS_PROPERTY_INDEX_INVALID_CHARS_RE, (s) => {
                    return s in SPECIAL_CHARACTER_MAP ? SPECIAL_CHARACTER_MAP[s] : "_";
                });
            }
        }
    }
    let member;
    if (typeof value === "number") {
        const literal = value < 0
            ? ts.factory.createPrefixUnaryExpression(ts.SyntaxKind.MinusToken, ts.factory.createNumericLiteral(Math.abs(value)))
            : ts.factory.createNumericLiteral(value);
        member = ts.factory.createEnumMember(name, literal);
    }
    else {
        member = ts.factory.createEnumMember(name, ts.factory.createStringLiteral(value));
    }
    if (metadata.description === undefined) {
        return member;
    }
    return ts.addSyntheticLeadingComment(member, ts.SyntaxKind.SingleLineCommentTrivia, " ".concat(metadata.description.trim()), true);
}
export function tsIntersection(types) {
    if (types.length === 0) {
        return NEVER;
    }
    if (types.length === 1) {
        return types[0];
    }
    return ts.factory.createIntersectionTypeNode(tsDedupe(types));
}
export function tsIsPrimitive(type) {
    if (!type) {
        return true;
    }
    return (ts.SyntaxKind[type.kind] === "BooleanKeyword" ||
        ts.SyntaxKind[type.kind] === "NeverKeyword" ||
        ts.SyntaxKind[type.kind] === "NullKeyword" ||
        ts.SyntaxKind[type.kind] === "NumberKeyword" ||
        ts.SyntaxKind[type.kind] === "StringKeyword" ||
        ts.SyntaxKind[type.kind] === "UndefinedKeyword" ||
        ("literal" in type && tsIsPrimitive(type.literal)));
}
export function tsLiteral(value) {
    if (typeof value === "string") {
        return ts.factory.createIdentifier(JSON.stringify(value));
    }
    if (typeof value === "number") {
        const literal = value < 0
            ? ts.factory.createPrefixUnaryExpression(ts.SyntaxKind.MinusToken, ts.factory.createNumericLiteral(Math.abs(value)))
            : ts.factory.createNumericLiteral(value);
        return ts.factory.createLiteralTypeNode(literal);
    }
    if (typeof value === "boolean") {
        return value === true ? TRUE : FALSE;
    }
    if (value === null) {
        return NULL;
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return ts.factory.createArrayTypeNode(NEVER);
        }
        return ts.factory.createTupleTypeNode(value.map((v) => tsLiteral(v)));
    }
    if (typeof value === "object") {
        const keys = [];
        for (const [k, v] of Object.entries(value)) {
            keys.push(ts.factory.createPropertySignature(undefined, tsPropertyIndex(k), undefined, tsLiteral(v)));
        }
        return keys.length ? ts.factory.createTypeLiteralNode(keys) : tsRecord(STRING, NEVER);
    }
    return UNKNOWN;
}
export function tsModifiers(modifiers) {
    const typeMods = [];
    if (modifiers.export) {
        typeMods.push(ts.factory.createModifier(ts.SyntaxKind.ExportKeyword));
    }
    if (modifiers.readonly) {
        typeMods.push(ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword));
    }
    return typeMods;
}
export function tsNullable(types) {
    return ts.factory.createUnionTypeNode([...types, NULL]);
}
export function tsOmit(type, keys) {
    return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Omit"), [
        type,
        ts.factory.createUnionTypeNode(keys.map((k) => tsLiteral(k))),
    ]);
}
export function tsRecord(key, value) {
    return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Record"), [key, value]);
}
export function tsPropertyIndex(index) {
    if ((typeof index === "number" && !(index < 0)) ||
        (typeof index === "string" && String(Number(index)) === index && index[0] !== "-")) {
        return ts.factory.createNumericLiteral(index);
    }
    return typeof index === "string" && JS_PROPERTY_INDEX_RE.test(index)
        ? ts.factory.createIdentifier(index)
        : ts.factory.createStringLiteral(String(index));
}
export function tsUnion(types) {
    if (types.length === 0) {
        return NEVER;
    }
    if (types.length === 1) {
        return types[0];
    }
    return ts.factory.createUnionTypeNode(tsDedupe(types));
}
export function tsWithRequired(type, keys, injectFooter) {
    if (keys.length === 0) {
        return type;
    }
    if (!injectFooter.some((node) => ts.isTypeAliasDeclaration(node) && node?.name?.escapedText === "WithRequired")) {
        const helper = stringToAST("type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };")[0];
        injectFooter.push(helper);
    }
    return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("WithRequired"), [
        type,
        tsUnion(keys.map((k) => tsLiteral(k))),
    ]);
}
export function tsReadonlyArray(type, injectFooter) {
    if (injectFooter &&
        !injectFooter.some((node) => ts.isTypeAliasDeclaration(node) && node?.name?.escapedText === "ReadonlyArray")) {
        const helper = stringToAST("type ReadonlyArray<T> = [Exclude<T, undefined>] extends [any[]] ? Readonly<Exclude<T, undefined>> : Readonly<Exclude<T, undefined>[]>;")[0];
        injectFooter.push(helper);
    }
    return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("ReadonlyArray"), [type]);
}
//# sourceMappingURL=ts.js.map