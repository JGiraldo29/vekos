"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRule = void 0;
const utils_1 = require("@typescript-eslint/utils");
const docs_url_1 = require("./docs-url");
exports.createRule = utils_1.ESLintUtils.RuleCreator(docs_url_1.docsUrl);
//# sourceMappingURL=create-rule.js.map