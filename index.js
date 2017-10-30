import { NgModule, InjectionToken } from '@angular/core';
import { CacheService } from './ngx-cache-layer.service';
export const /** @type {?} */ CACHE_MODULE_CONFIG = new InjectionToken('module.config');
export const /** @type {?} */ CACHE_MODULE_DI_CONFIG = ({
    deleteOnExpire: 'aggressive',
    cacheFlushInterval: 60 * 60 * 1000,
    maxAge: 15 * 60 * 1000
});
export class CacheModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: CacheModule,
            providers: [
                { provide: CACHE_MODULE_CONFIG, useValue: config || CACHE_MODULE_DI_CONFIG },
                CacheService
            ]
        };
    }
}
CacheModule.decorators = [
    { type: NgModule },
];
/**
 * @nocollapse
 */
CacheModule.ctorParameters = () => [];
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
