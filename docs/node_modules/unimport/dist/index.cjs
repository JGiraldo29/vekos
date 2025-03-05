'use strict';

const context = require('./shared/unimport.D6_N7ILk.cjs');
const vueDirectives = require('./shared/unimport.MMUMmZ45.cjs');
require('mlly');
require('node:fs');
require('node:fs/promises');
require('node:process');
require('node:url');
require('fast-glob');
require('pathe');
require('picomatch');
require('scule');
require('node:os');
require('pkg-types');
require('local-pkg');
require('node:path');
require('magic-string');
require('strip-literal');

async function installGlobalAutoImports(imports, options = {}) {
  const {
    globalObject = globalThis,
    overrides = false
  } = options;
  imports = Array.isArray(imports) ? imports : await imports.getImports();
  await Promise.all(
    imports.map(async (i) => {
      if (i.disabled || i.type)
        return;
      const as = i.as || i.name;
      if (overrides || !(as in globalObject)) {
        const module = await import(i.from);
        globalObject[as] = module[i.name];
      }
    })
  );
  return globalObject;
}

exports.builtinPresets = context.builtinPresets;
exports.createUnimport = context.createUnimport;
exports.dedupeDtsExports = context.dedupeDtsExports;
exports.normalizeScanDirs = context.normalizeScanDirs;
exports.resolveBuiltinPresets = context.resolveBuiltinPresets;
exports.resolvePreset = context.resolvePreset;
exports.scanDirExports = context.scanDirExports;
exports.scanExports = context.scanExports;
exports.scanFilesFromDir = context.scanFilesFromDir;
exports.version = context.version;
exports.addImportToCode = vueDirectives.addImportToCode;
exports.dedupeImports = vueDirectives.dedupeImports;
exports.defineUnimportPreset = vueDirectives.defineUnimportPreset;
exports.excludeRE = vueDirectives.excludeRE;
exports.getMagicString = vueDirectives.getMagicString;
exports.getString = vueDirectives.getString;
exports.importAsRE = vueDirectives.importAsRE;
exports.matchRE = vueDirectives.matchRE;
exports.normalizeImports = vueDirectives.normalizeImports;
exports.resolveIdAbsolute = vueDirectives.resolveIdAbsolute;
exports.separatorRE = vueDirectives.separatorRE;
exports.stringifyImports = vueDirectives.stringifyImports;
exports.stripCommentsAndStrings = vueDirectives.stripCommentsAndStrings;
exports.stripFileExtension = vueDirectives.stripFileExtension;
exports.toExports = vueDirectives.toExports;
exports.toImports = vueDirectives.toImports;
exports.toTypeDeclarationFile = vueDirectives.toTypeDeclarationFile;
exports.toTypeDeclarationItems = vueDirectives.toTypeDeclarationItems;
exports.toTypeReExports = vueDirectives.toTypeReExports;
exports.vueTemplateAddon = vueDirectives.vueTemplateAddon;
exports.installGlobalAutoImports = installGlobalAutoImports;
