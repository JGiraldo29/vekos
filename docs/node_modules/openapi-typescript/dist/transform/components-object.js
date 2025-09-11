import ts from "typescript";
import * as changeCase from "change-case";
import { performance } from "node:perf_hooks";
import { NEVER, QUESTION_TOKEN, addJSDocComment, tsModifiers, tsPropertyIndex } from "../lib/ts.js";
import { createRef, debug, getEntries } from "../lib/utils.js";
import transformHeaderObject from "./header-object.js";
import transformParameterObject from "./parameter-object.js";
import transformPathItemObject from "./path-item-object.js";
import transformRequestBodyObject from "./request-body-object.js";
import transformResponseObject from "./response-object.js";
import transformSchemaObject from "./schema-object.js";
const transformers = {
    schemas: transformSchemaObject,
    responses: transformResponseObject,
    parameters: transformParameterObject,
    requestBodies: transformRequestBodyObject,
    headers: transformHeaderObject,
    pathItems: transformPathItemObject,
};
export default function transformComponentsObject(componentsObject, ctx) {
    const type = [];
    const rootTypeAliases = {};
    for (const key of Object.keys(transformers)) {
        const componentT = performance.now();
        const items = [];
        if (componentsObject[key]) {
            for (const [name, item] of getEntries(componentsObject[key], ctx)) {
                let subType = transformers[key](item, {
                    path: createRef(["components", key, name]),
                    schema: item,
                    ctx,
                });
                let hasQuestionToken = false;
                if (ctx.transform) {
                    const result = ctx.transform(item, {
                        path: createRef(["components", key, name]),
                        schema: item,
                        ctx,
                    });
                    if (result) {
                        if ("schema" in result) {
                            subType = result.schema;
                            hasQuestionToken = result.questionToken;
                        }
                        else {
                            subType = result;
                        }
                    }
                }
                const property = ts.factory.createPropertySignature(tsModifiers({ readonly: ctx.immutable }), tsPropertyIndex(name), hasQuestionToken ? QUESTION_TOKEN : undefined, subType);
                addJSDocComment(item, property);
                items.push(property);
                if (ctx.rootTypes) {
                    const componentKey = changeCase.pascalCase(singularizeComponentKey(key));
                    let aliasName = `${componentKey}${changeCase.pascalCase(name)}`;
                    let conflictCounter = 1;
                    while (rootTypeAliases[aliasName] !== undefined) {
                        conflictCounter++;
                        aliasName = `${componentKey}${changeCase.pascalCase(name)}_${conflictCounter}`;
                    }
                    const ref = ts.factory.createTypeReferenceNode(`components['${key}']['${name}']`);
                    if (ctx.rootTypesNoSchemaPrefix && key === "schemas") {
                        aliasName = aliasName.replace(componentKey, "");
                    }
                    const typeAlias = ts.factory.createTypeAliasDeclaration(tsModifiers({ export: true }), aliasName, undefined, ref);
                    rootTypeAliases[aliasName] = typeAlias;
                }
            }
        }
        type.push(ts.factory.createPropertySignature(undefined, tsPropertyIndex(key), undefined, items.length ? ts.factory.createTypeLiteralNode(items) : NEVER));
        debug(`Transformed components → ${key}`, "ts", performance.now() - componentT);
    }
    let rootTypes = [];
    if (ctx.rootTypes) {
        rootTypes = Object.keys(rootTypeAliases).map((k) => rootTypeAliases[k]);
    }
    return [ts.factory.createTypeLiteralNode(type), ...rootTypes];
}
export function singularizeComponentKey(key) {
    switch (key) {
        case "requestBodies":
            return "requestBody";
        default:
            return key.slice(0, -1);
    }
}
//# sourceMappingURL=components-object.js.map