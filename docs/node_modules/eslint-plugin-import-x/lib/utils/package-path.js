"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextPackagePath = getContextPackagePath;
exports.getFilePackagePath = getFilePackagePath;
exports.getFilePackageName = getFilePackageName;
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const pkg_up_1 = require("./pkg-up");
const read_pkg_up_1 = require("./read-pkg-up");
function getContextPackagePath(context) {
    return getFilePackagePath(context.physicalFilename);
}
function getFilePackagePath(filename) {
    return node_path_1.default.dirname((0, pkg_up_1.pkgUp)({ cwd: filename }));
}
function getFilePackageName(filename) {
    const { pkg, path: pkgPath } = (0, read_pkg_up_1.readPkgUp)({ cwd: filename });
    if (pkg) {
        return pkg.name || getFilePackageName(node_path_1.default.resolve(pkgPath, '../..'));
    }
    return null;
}
//# sourceMappingURL=package-path.js.map