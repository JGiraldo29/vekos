"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleCache = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const log = (0, debug_1.default)('eslint-plugin-import-x:utils:ModuleCache');
class ModuleCache {
    constructor(map = new Map()) {
        this.map = map;
    }
    set(cacheKey, result) {
        this.map.set(cacheKey, {
            result,
            lastSeen: process.hrtime(),
        });
        log('setting entry for', cacheKey);
        return result;
    }
    get(cacheKey, settings) {
        if (this.map.has(cacheKey)) {
            const f = this.map.get(cacheKey);
            if (process.hrtime(f.lastSeen)[0] < settings.lifetime) {
                return f.result;
            }
        }
        else {
            log('cache miss for', cacheKey);
        }
    }
    static getSettings(settings) {
        const cacheSettings = {
            lifetime: 30,
            ...settings['import-x/cache'],
        };
        if (typeof cacheSettings.lifetime === 'string' &&
            ['∞', 'Infinity'].includes(cacheSettings.lifetime)) {
            cacheSettings.lifetime = Number.POSITIVE_INFINITY;
        }
        return cacheSettings;
    }
}
exports.ModuleCache = ModuleCache;
//# sourceMappingURL=module-cache.js.map