"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashify = hashify;
exports.hashArray = hashArray;
exports.hashObject = hashObject;
const node_crypto_1 = require("node:crypto");
function hashify(value, hash) {
    hash ??= (0, node_crypto_1.createHash)('sha256');
    if (Array.isArray(value)) {
        hashArray(value, hash);
    }
    else if (value instanceof Object) {
        hashObject(value, hash);
    }
    else {
        hash.update(JSON.stringify(value) || 'undefined');
    }
    return hash;
}
function hashArray(array, hash) {
    hash ??= (0, node_crypto_1.createHash)('sha256');
    hash.update('[');
    for (const element of array) {
        hashify(element, hash);
        hash.update(',');
    }
    hash.update(']');
    return hash;
}
function hashObject(object, hash) {
    hash ??= (0, node_crypto_1.createHash)('sha256');
    hash.update('{');
    for (const key of Object.keys(object).sort()) {
        hash.update(JSON.stringify(key));
        hash.update(':');
        hashify(object[key], hash);
        hash.update(',');
    }
    hash.update('}');
    return hash;
}
//# sourceMappingURL=hash.js.map