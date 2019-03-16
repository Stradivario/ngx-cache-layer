"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CacheServiceConfigInterface = /** @class */ (function () {
    function CacheServiceConfigInterface() {
        this.cacheFlushInterval = 60 * 60 * 1000;
        this.maxAge = 15 * 60 * 1000;
    }
    return CacheServiceConfigInterface;
}());
exports.CacheServiceConfigInterface = CacheServiceConfigInterface;
exports.CACHE_MODULE_CONFIG = new core_1.InjectionToken('module.config');
exports.CACHE_MODULE_DI_CONFIG = {
    deleteOnExpire: 'aggressive',
    cacheFlushInterval: 60 * 60 * 1000,
    maxAge: 15 * 60 * 1000
};
