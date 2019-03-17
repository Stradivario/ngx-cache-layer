"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
class CacheServiceConfigInterface {
    constructor() {
        this.cacheFlushInterval = 60 * 60 * 1000;
        this.maxAge = 15 * 60 * 1000;
    }
}
exports.CacheServiceConfigInterface = CacheServiceConfigInterface;
exports.CACHE_MODULE_CONFIG = new core_1.InjectionToken('module.config');
exports.CACHE_MODULE_DI_CONFIG = {
    deleteOnExpire: 'aggressive',
    cacheFlushInterval: 60 * 60 * 1000,
    maxAge: 15 * 60 * 1000
};
