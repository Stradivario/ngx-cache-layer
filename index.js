import { NgModule, InjectionToken } from '@angular/core';
import { CacheService } from './ngx-cache-layer.service';
export var /** @type {?} */ CACHE_MODULE_CONFIG = new InjectionToken('module.config');
export var /** @type {?} */ CACHE_MODULE_DI_CONFIG = ({
    deleteOnExpire: 'aggressive',
    cacheFlushInterval: 60 * 60 * 1000,
    maxAge: 15 * 60 * 1000
});
var CacheModule = (function () {
    function CacheModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    CacheModule.forRoot = function (config) {
        return {
            ngModule: CacheModule,
            providers: [
                { provide: CACHE_MODULE_CONFIG, useValue: config || CACHE_MODULE_DI_CONFIG },
                CacheService
            ]
        };
    };
    return CacheModule;
}());
export { CacheModule };
CacheModule.decorators = [
    { type: NgModule },
];
/**
 * @nocollapse
 */
CacheModule.ctorParameters = function () { return []; };
function CacheModule_tsickle_Closure_declarations() {
    /** @type {?} */
    CacheModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CacheModule.ctorParameters;
}
export { CacheService } from './ngx-cache-layer.service';
export { CacheLayer } from './ngx-cache-layer.layer';
export { CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
