"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pkgUp = pkgUp;
const tslib_1 = require("tslib");
const node_fs_1 = tslib_1.__importDefault(require("node:fs"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
function findUp(filename, cwd) {
    let dir = node_path_1.default.resolve(cwd || '');
    const root = node_path_1.default.parse(dir).root;
    const filenames = [filename].flat();
    while (true) {
        const file = filenames.find(el => node_fs_1.default.existsSync(node_path_1.default.resolve(dir, el)));
        if (file) {
            return node_path_1.default.resolve(dir, file);
        }
        if (dir === root) {
            return null;
        }
        dir = node_path_1.default.dirname(dir);
    }
}
function pkgUp(opts) {
    return findUp('package.json', opts && opts.cwd);
}
//# sourceMappingURL=pkg-up.js.map