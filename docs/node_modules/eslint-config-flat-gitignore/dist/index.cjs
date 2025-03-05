'use strict';

const fs = require('node:fs');
const process = require('node:process');
const path = require('node:path');
const findUpSimple = require('find-up-simple');
const compat = require('@eslint/compat');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
const process__default = /*#__PURE__*/_interopDefaultCompat(process);
const path__default = /*#__PURE__*/_interopDefaultCompat(path);

const GITIGNORE = ".gitignore";
function ignore(options = {}) {
  const ignores = [];
  const {
    root = false,
    files: _files = root ? GITIGNORE : findUpSimple.findUpSync(GITIGNORE) || [],
    strict = true,
    cwd = process__default.cwd()
  } = options;
  const files = Array.isArray(_files) ? _files : [_files];
  for (const file of files) {
    let content = "";
    try {
      content = fs__default.readFileSync(file, "utf8");
    } catch (error) {
      if (strict)
        throw error;
      continue;
    }
    const relativePath = path__default.relative(cwd, path__default.dirname(file)).replaceAll("\\", "/");
    const globs = content.split(/\r?\n/u).filter((line) => line && !line.startsWith("#")).map((line) => compat.convertIgnorePatternToMinimatch(line)).map((glob) => relativyMinimatch(glob, relativePath, cwd)).filter((glob) => glob !== null);
    ignores.push(...globs);
  }
  if (strict && files.length === 0)
    throw new Error("No .gitignore file found");
  return {
    // `name` is still not working well in ESLint v8
    // name: options.name || 'gitignore',
    ignores
  };
}
function relativyMinimatch(pattern, relativePath, cwd) {
  if (["", ".", "/"].includes(relativePath))
    return pattern;
  const negated = pattern.startsWith("!") ? "!" : "";
  let cleanPattern = negated ? pattern.slice(1) : pattern;
  if (!relativePath.endsWith("/"))
    relativePath = `${relativePath}/`;
  const isParent = relativePath.startsWith("..");
  if (!isParent)
    return `${negated}${relativePath}${cleanPattern}`;
  if (!relativePath.match(/^(\.\.\/)+$/))
    throw new Error("The ignore file location should be either a parent or child directory");
  if (cleanPattern.startsWith("**"))
    return pattern;
  const parents = path__default.relative(path__default.resolve(cwd, relativePath), cwd).split(/[/\\]/);
  while (parents.length && cleanPattern.startsWith(`${parents[0]}/`)) {
    cleanPattern = cleanPattern.slice(parents[0].length + 1);
    parents.shift();
  }
  if (cleanPattern.startsWith("**"))
    return `${negated}${cleanPattern}`;
  if (parents.length === 0)
    return `${negated}${cleanPattern}`;
  return null;
}

module.exports = ignore;
