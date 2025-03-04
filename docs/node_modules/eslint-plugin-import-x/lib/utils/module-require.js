"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRequire = moduleRequire;
const tslib_1 = require("tslib");
const node_module_1 = tslib_1.__importDefault(require("node:module"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
function createModule(filename) {
    const mod = new node_module_1.default(filename);
    mod.filename = filename;
    mod.paths = node_module_1.default._nodeModulePaths(node_path_1.default.dirname(filename));
    return mod;
}
function moduleRequire(p) {
    try {
        const eslintPath = require.resolve('eslint');
        const eslintModule = createModule(eslintPath);
        return require(node_module_1.default._resolveFilename(p, eslintModule));
    }
    catch {
    }
    try {
        return require.main.require(p);
    }
    catch {
    }
    return require(p);
}
//# sourceMappingURL=module-require.js.map