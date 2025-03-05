import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { ESLintUtils } from '@typescript-eslint/utils';

function createRule(rule) {
  const _createRule = ESLintUtils.RuleCreator(
    (name) => `https://eslint.nuxt.com/packages/plugin#nuxt${name}`
  );
  return _createRule(rule);
}

const processSuffixes = /* @__PURE__ */ new Set([
  "client",
  "browser",
  "server",
  "nitro",
  "dev",
  "test",
  "prerender"
]);
const rule$1 = createRule({
  name: "prefer-import-meta",
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer using `import.meta.*` over `process.*`"
    },
    schema: [],
    messages: {
      default: "Replace `process.{{ suffix }}` with `import.meta.{{ suffix }}`."
    },
    fixable: "code"
  },
  defaultOptions: [],
  create: (context) => ({
    MemberExpression: (node) => {
      if (node.object.type === AST_NODE_TYPES.Identifier && node.object.name === "process" && node.property.type === AST_NODE_TYPES.Identifier && processSuffixes.has(node.property.name)) {
        const suffix = node.property.name;
        context.report({
          node,
          messageId: "default",
          data: {
            suffix
          },
          fix: (fixer) => fixer.replaceText(node, `import.meta.${suffix}`)
        });
      }
    }
  })
});

const OFFICIAL_MODULES = {
  client: [
    "site",
    // SEO module
    "colorMode",
    "content",
    "mdc",
    "ui"
  ],
  server: [
    "hub"
  ]
};
const ORDER_KEYS = [
  // Ids
  "appId",
  "buildId",
  // Extends
  "extends",
  "theme",
  // Extensions
  "modules",
  "plugins",
  // Env ($production, $development, $test)
  /^\$/,
  // Nuxt Core Features
  "ssr",
  "pages",
  "components",
  "imports",
  "devtools",
  // Client-side Integrations
  "app",
  "css",
  "vue",
  "router",
  "unhead",
  ...OFFICIAL_MODULES.client,
  "spaLoadingTemplate",
  // Runtime Configs
  "appConfig",
  "runtimeConfig",
  // Dirs
  "dir",
  "rootDir",
  "srcDir",
  "appDir",
  "workspaceDir",
  "serverDir",
  "buildDir",
  "modulesDir",
  "analyzeDir",
  // Resultions
  "alias",
  "extensions",
  "ignore",
  "ignoreOptions",
  "ignorePrefix",
  // Build Pipeline Configs
  "builder",
  "build",
  "generate",
  "routeRules",
  "sourcemap",
  "optimization",
  // Development
  "dev",
  "devServer",
  "watch",
  "watchers",
  // Feature flags
  "future",
  "features",
  "experimental",
  "compatibilityDate",
  // Nitro
  "nitro",
  ...OFFICIAL_MODULES.server,
  "serverHandlers",
  "devServerHandlers",
  // Tooling Integrations
  "vite",
  "webpack",
  "typescript",
  "postcss",
  // Other Integrations
  "test",
  "telemetry",
  // Logging
  "debug",
  "logLevel",
  // Hooks
  "hooks"
];

const rule = createRule({
  name: "nuxt-config-keys-order",
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer recommended order of Nuxt config properties"
    },
    schema: [],
    messages: {
      default: 'Expected config key "{{a}}" to come before "{{b}}"'
    },
    fixable: "code"
  },
  defaultOptions: [],
  create(context) {
    if (!context.filename.match(/nuxt\.config\.[mc]?[jt]sx?$/)) {
      return {};
    }
    return {
      ExportDefaultDeclaration(node) {
        let object;
        if (node.declaration.type === "ObjectExpression") {
          object = node.declaration;
        } else if (node.declaration.type === "CallExpression" && node.declaration.arguments[0].type === "ObjectExpression") {
          object = node.declaration.arguments[0];
        }
        if (!object) {
          return;
        }
        const hasFixes = sort(context, object);
        if (!hasFixes) {
          const envProps = object.properties.filter((i) => i.type === "Property" && i.key.type === "Identifier" && i.key.name.startsWith("$"));
          for (const prop of envProps) {
            if (prop.value.type === "ObjectExpression")
              sort(context, prop.value);
          }
        }
      }
    };
  }
});
function sort(context, node) {
  return sortAst(
    context,
    node,
    node.properties,
    (prop) => {
      if (prop.type === "Property")
        return getString(prop.key);
      return null;
    },
    sortKeys
  );
}
function sortKeys(a, b) {
  const indexA = ORDER_KEYS.findIndex((k) => typeof k === "string" ? k === a : k.test(a));
  const indexB = ORDER_KEYS.findIndex((k) => typeof k === "string" ? k === b : k.test(b));
  if (indexA === -1 && indexB !== -1)
    return 1;
  if (indexA !== -1 && indexB === -1)
    return -1;
  if (indexA < indexB)
    return -1;
  if (indexA > indexB)
    return 1;
  return a.localeCompare(b);
}
function sortAst(context, node, list, getName, sort2 = (a, b) => a.localeCompare(b), insertComma = true) {
  const firstToken = context.sourceCode.getFirstToken(node);
  const lastToken = context.sourceCode.getLastToken(node);
  if (!firstToken || !lastToken)
    return false;
  if (list.length < 2)
    return false;
  const reordered = list.slice();
  const ranges = /* @__PURE__ */ new Map();
  const names = /* @__PURE__ */ new Map();
  const rangeStart = Math.max(
    firstToken.range[1],
    context.sourceCode.getIndexFromLoc({
      line: list[0].loc.start.line,
      column: 0
    })
  );
  let rangeEnd = rangeStart;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    let name = getName(item);
    if (typeof name === "string")
      name = [name];
    names.set(item, name);
    let lastRange = item.range[1];
    const nextToken = context.sourceCode.getTokenAfter(item);
    if (nextToken?.type === "Punctuator" && nextToken.value === ",")
      lastRange = nextToken.range[1];
    const nextChar = context.sourceCode.getText()[lastRange];
    let text = getTextOf(context.sourceCode, [rangeEnd, lastRange]);
    if (nextToken === lastToken && insertComma)
      text += ",";
    if (nextChar === "\n") {
      lastRange++;
      text += "\n";
    }
    ranges.set(item, [rangeEnd, lastRange, text]);
    rangeEnd = lastRange;
  }
  const segments = [];
  let segmentStart = -1;
  for (let i = 0; i < list.length; i++) {
    if (names.get(list[i]) == null) {
      if (segmentStart > -1)
        segments.push([segmentStart, i]);
      segmentStart = -1;
    } else {
      if (segmentStart === -1)
        segmentStart = i;
    }
  }
  if (segmentStart > -1 && segmentStart !== list.length - 1)
    segments.push([segmentStart, list.length]);
  for (const [start, end] of segments) {
    reordered.splice(
      start,
      end - start,
      ...reordered.slice(start, end).sort((a, b) => {
        const nameA = names.get(a);
        const nameB = names.get(b);
        const length = Math.max(nameA.length, nameB.length);
        for (let i = 0; i < length; i++) {
          const a2 = nameA[i];
          const b2 = nameB[i];
          if (a2 == null || b2 == null || a2 === b2)
            continue;
          return sort2(a2, b2);
        }
        return 0;
      })
    );
  }
  const changed = reordered.some((prop, i) => prop !== list[i]);
  if (!changed)
    return false;
  const newContent = reordered.map((i) => ranges.get(i)[2]).join("");
  context.report({
    node,
    messageId: "default",
    data: {
      a: names.get(reordered[0])[0],
      b: names.get(reordered[1])[0]
    },
    fix(fixer) {
      return fixer.replaceTextRange([rangeStart, rangeEnd], newContent);
    }
  });
}
function getTextOf(sourceCode, node) {
  if (!node)
    return "";
  if (Array.isArray(node))
    return sourceCode.text.slice(node[0], node[1]);
  return sourceCode.getText(node);
}
function getString(node) {
  if (node.type === "Identifier")
    return node.name;
  if (node.type === "Literal")
    return String(node.raw);
  return null;
}

const rules = {
  "prefer-import-meta": rule$1,
  "nuxt-config-keys-order": rule
};

const index = {
  meta: {
    name: "@nuxt/eslint-plugin"
  },
  rules
};

export { index as default };
