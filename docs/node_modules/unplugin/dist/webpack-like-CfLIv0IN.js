import { isAbsolute, normalize } from "node:path";

//#region src/utils/webpack-like.ts
function transformUse(data, plugin, transformLoader) {
	if (data.resource == null) return [];
	const id = normalizeAbsolutePath(data.resource + (data.resourceQuery || ""));
	if (!plugin.transformInclude || plugin.transformInclude(id)) return [{
		loader: transformLoader,
		options: { plugin },
		ident: plugin.name
	}];
	return [];
}
function normalizeAbsolutePath(path$1) {
	if (isAbsolute(path$1)) return normalize(path$1);
	else return path$1;
}

//#endregion
export { normalizeAbsolutePath, transformUse };