import { InjectionToken } from '@angular/core';
var CacheServiceConfigInterface = /** @class */ (function () {
    function CacheServiceConfigInterface() {
        this.cacheFlushInterval = 60 * 60 * 1000;
        this.maxAge = 15 * 60 * 1000;
    }
    return CacheServiceConfigInterface;
}());
export { CacheServiceConfigInterface };
export var CACHE_MODULE_CONFIG = new InjectionToken('module.config');
export var CACHE_MODULE_DI_CONFIG = {
    deleteOnExpire: 'aggressive',
    cacheFlushInterval: 60 * 60 * 1000,
    maxAge: 15 * 60 * 1000
};
