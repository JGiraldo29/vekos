import { escapePointer, parseRef } from "@redocly/openapi-core/lib/ref-utils.js";
import c from "ansi-colors";
import supportsColor from "supports-color";
import ts from "typescript";
import { tsLiteral, tsModifiers, tsPropertyIndex } from "./ts.js";
if (!supportsColor.stdout || supportsColor.stdout.hasBasic === false) {
    c.enabled = false;
}
const DEBUG_GROUPS = {
    redoc: c.cyanBright,
    lint: c.yellowBright,
    bundle: c.magentaBright,
    ts: c.blueBright,
};
export { c };
export function createDiscriminatorProperty(discriminator, { path, readonly = false }) {
    let value = parseRef(path).pointer.pop();
    if (discriminator.mapping) {
        const matchedValue = Object.entries(discriminator.mapping).find(([, v]) => (!v.startsWith("#") && v === value) || (v.startsWith("#") && parseRef(v).pointer.pop() === value));
        if (matchedValue) {
            value = matchedValue[0];
        }
    }
    return ts.factory.createPropertySignature(tsModifiers({
        readonly,
    }), tsPropertyIndex(discriminator.propertyName), undefined, tsLiteral(value));
}
export function createRef(parts) {
    let pointer = "#";
    for (const part of parts) {
        if (part === undefined || part === null || part === "") {
            continue;
        }
        const maybeRef = parseRef(String(part)).pointer;
        if (maybeRef.length) {
            for (const refPart of maybeRef) {
                pointer += `/${escapePointer(refPart)}`;
            }
        }
        else {
            pointer += `/${escapePointer(part)}`;
        }
    }
    return pointer;
}
export function debug(msg, group, time) {
    if (process.env.DEBUG &&
        (!group ||
            process.env.DEBUG === "*" ||
            process.env.DEBUG === "openapi-ts:*" ||
            process.env.DEBUG.toLocaleLowerCase() === `openapi-ts:${group.toLocaleLowerCase()}`)) {
        const groupColor = (group && DEBUG_GROUPS[group]) || c.whiteBright;
        const groupName = groupColor(`openapi-ts:${group ?? "info"}`);
        let timeFormatted = "";
        if (typeof time === "number") {
            timeFormatted = c.green(` ${formatTime(time)} `);
        }
        console.debug(`  ${c.bold(groupName)}${timeFormatted}${msg}`);
    }
}
export function error(msg) {
    console.error(c.red(` ✘  ${msg}`));
}
export function formatTime(t) {
    if (typeof t === "number") {
        if (t < 1000) {
            return `${Math.round(10 * t) / 10}ms`;
        }
        if (t < 60000) {
            return `${Math.round(t / 100) / 10}s`;
        }
        return `${Math.round(t / 6000) / 10}m`;
    }
    return t;
}
export function getEntries(obj, options) {
    let entries = Object.entries(obj);
    if (options?.alphabetize) {
        entries.sort(([a], [b]) => a.localeCompare(b, "en-us", { numeric: true }));
    }
    if (options?.excludeDeprecated) {
        entries = entries.filter(([, v]) => !(v && typeof v === "object" && "deprecated" in v && v.deprecated));
    }
    return entries;
}
export function resolveRef(schema, $ref, { silent = false, visited = [] }) {
    const { pointer } = parseRef($ref);
    if (!pointer.length) {
        return undefined;
    }
    let node = schema;
    for (const key of pointer) {
        if (node && typeof node === "object" && node[key]) {
            node = node[key];
        }
        else {
            warn(`Could not resolve $ref "${$ref}"`, silent);
            return undefined;
        }
    }
    if (node && typeof node === "object" && node.$ref) {
        if (visited.includes(node.$ref)) {
            warn(`Could not resolve circular $ref "${$ref}"`, silent);
            return undefined;
        }
        return resolveRef(schema, node.$ref, {
            silent,
            visited: [...visited, node.$ref],
        });
    }
    return node;
}
function createDiscriminatorEnum(values, prevSchema) {
    return {
        type: "string",
        enum: values,
        description: prevSchema?.description
            ? `${prevSchema.description} (enum property replaced by openapi-typescript)`
            : "discriminator enum property added by openapi-typescript",
    };
}
function patchDiscriminatorEnum(schema, ref, values, discriminator, discriminatorRef, options) {
    const resolvedSchema = resolveRef(schema, ref, {
        silent: options.silent ?? false,
    });
    if (resolvedSchema?.allOf) {
        resolvedSchema.allOf.push({
            type: "object",
            required: [discriminator.propertyName],
            properties: {
                [discriminator.propertyName]: createDiscriminatorEnum(values),
            },
        });
        return true;
    }
    else if (typeof resolvedSchema === "object" && "type" in resolvedSchema && resolvedSchema.type === "object") {
        if (!resolvedSchema.properties) {
            resolvedSchema.properties = {};
        }
        if (!resolvedSchema.required) {
            resolvedSchema.required = [discriminator.propertyName];
        }
        else if (!resolvedSchema.required.includes(discriminator.propertyName)) {
            resolvedSchema.required.push(discriminator.propertyName);
        }
        resolvedSchema.properties[discriminator.propertyName] = createDiscriminatorEnum(values, resolvedSchema.properties[discriminator.propertyName]);
        return true;
    }
    warn(`Discriminator mapping has an invalid schema (neither an object schema nor an allOf array): ${ref} => ${values.join(", ")} (Discriminator: ${discriminatorRef})`, options.silent);
    return false;
}
export function scanDiscriminators(schema, options) {
    const objects = {};
    const refsHandled = [];
    walk(schema, (obj, path) => {
        const discriminator = obj?.discriminator;
        if (!discriminator?.propertyName) {
            return;
        }
        const ref = createRef(path);
        objects[ref] = discriminator;
        if (!obj?.oneOf || !Array.isArray(obj.oneOf)) {
            return;
        }
        const oneOf = obj.oneOf;
        const mapping = {};
        for (const item of oneOf) {
            if ("$ref" in item) {
                const value = item.$ref.split("/").pop();
                if (value) {
                    if (!mapping[item.$ref]) {
                        mapping[item.$ref] = { inferred: value };
                    }
                    else {
                        mapping[item.$ref].inferred = value;
                    }
                }
            }
        }
        if (discriminator.mapping) {
            for (const mappedValue in discriminator.mapping) {
                const mappedRef = discriminator.mapping[mappedValue];
                if (!mappedRef) {
                    continue;
                }
                if (!mapping[mappedRef]?.defined) {
                    mapping[mappedRef] = { defined: [] };
                }
                mapping[mappedRef].defined?.push(mappedValue);
            }
        }
        for (const [mappedRef, { inferred, defined }] of Object.entries(mapping)) {
            if (refsHandled.includes(mappedRef)) {
                continue;
            }
            if (!inferred && !defined) {
                continue;
            }
            const mappedValues = defined ?? [inferred];
            if (patchDiscriminatorEnum(schema, mappedRef, mappedValues, discriminator, ref, options)) {
                refsHandled.push(mappedRef);
            }
        }
    });
    walk(schema, (obj, path) => {
        if (!obj || !Array.isArray(obj.allOf)) {
            return;
        }
        for (const item of obj.allOf) {
            if ("$ref" in item) {
                if (!objects[item.$ref]) {
                    return;
                }
                const ref = createRef(path);
                const discriminator = objects[item.$ref];
                const mappedValues = [];
                if (discriminator.mapping) {
                    for (const mappedValue in discriminator.mapping) {
                        if (discriminator.mapping[mappedValue] === ref) {
                            mappedValues.push(mappedValue);
                        }
                    }
                    if (mappedValues.length > 0) {
                        if (patchDiscriminatorEnum(schema, ref, mappedValues, discriminator, item.$ref, options)) {
                            refsHandled.push(ref);
                        }
                    }
                }
                objects[ref] = {
                    ...objects[item.$ref],
                };
            }
            else if (item.discriminator?.propertyName) {
                objects[createRef(path)] = { ...item.discriminator };
            }
        }
    });
    return { objects, refsHandled };
}
export function walk(obj, cb, path = []) {
    if (!obj || typeof obj !== "object") {
        return;
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            walk(obj[i], cb, path.concat(i));
        }
        return;
    }
    cb(obj, path);
    for (const k of Object.keys(obj)) {
        walk(obj[k], cb, path.concat(k));
    }
}
export function warn(msg, silent = false) {
    if (!silent) {
        console.warn(c.yellow(` ⚠  ${msg}`));
    }
}
//# sourceMappingURL=utils.js.map