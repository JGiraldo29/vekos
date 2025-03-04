import { tsEnum } from "../lib/ts.js";
import { getEntries } from "../lib/utils.js";
export default function makeApiPathsEnum(pathsObject) {
    const enumKeys = [];
    const enumMetaData = [];
    for (const [url, pathItemObject] of getEntries(pathsObject)) {
        for (const [method, operation] of Object.entries(pathItemObject)) {
            if (!["get", "put", "post", "delete", "options", "head", "patch", "trace"].includes(method)) {
                continue;
            }
            let pathName;
            if (operation.operationId) {
                pathName = operation.operationId;
            }
            else {
                pathName = (method + url)
                    .split("/")
                    .map((part) => {
                    const capitalised = part.charAt(0).toUpperCase() + part.slice(1);
                    return capitalised.replace(/{.*}|:.*|[^a-zA-Z\d_]+/, "");
                })
                    .join("");
            }
            const adaptedUrl = url.replace(/{(\w+)}/g, ":$1");
            enumKeys.push(adaptedUrl);
            enumMetaData.push({
                name: pathName,
            });
        }
    }
    return tsEnum("ApiPaths", enumKeys, enumMetaData, {
        export: true,
    });
}
//# sourceMappingURL=paths-enum.js.map