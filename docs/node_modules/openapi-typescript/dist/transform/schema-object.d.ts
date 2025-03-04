import ts from "typescript";
import type { ReferenceObject, SchemaObject, TransformNodeOptions } from "../types.js";
export default function transformSchemaObject(schemaObject: SchemaObject | ReferenceObject, options: TransformNodeOptions): ts.TypeNode;
export declare function transformSchemaObjectWithComposition(schemaObject: SchemaObject | ReferenceObject, options: TransformNodeOptions): ts.TypeNode;
