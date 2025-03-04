"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsUrl = void 0;
const tslib_1 = require("tslib");
const package_json_1 = tslib_1.__importDefault(require("../../package.json"));
const repoUrl = 'https://github.com/un-ts/eslint-plugin-import-x';
const docsUrl = (ruleName, commitish = `v${package_json_1.default.version}`) => `${repoUrl}/blob/${commitish}/docs/rules/${ruleName}.md`;
exports.docsUrl = docsUrl;
//# sourceMappingURL=docs-url.js.map