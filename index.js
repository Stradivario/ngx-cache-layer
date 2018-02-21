define(["require", "exports", "@angular/core", "./ngx-cache-layer.service", "./ngx-cache-layer.service", "./ngx-cache-layer.layer", "./ngx-cache-layer.interfaces"], function (require, exports, core_1, ngx_cache_layer_service_1, ngx_cache_layer_service_2, ngx_cache_layer_layer_1, ngx_cache_layer_interfaces_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CACHE_MODULE_CONFIG = new core_1.InjectionToken('module.config');
    exports.CACHE_MODULE_DI_CONFIG = ({
        deleteOnExpire: 'aggressive',
        cacheFlushInterval: 60 * 60 * 1000,
        maxAge: 15 * 60 * 1000
    });
    var CacheModule = /** @class */ (function () {
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
                    { provide: exports.CACHE_MODULE_CONFIG, useValue: config || exports.CACHE_MODULE_DI_CONFIG },
                    ngx_cache_layer_service_1.CacheService
                ]
            };
        };
        CacheModule.decorators = [
            { type: core_1.NgModule },
        ];
        /**
         * @nocollapse
         */
        CacheModule.ctorParameters = function () { return []; };
        return CacheModule;
    }());
    exports.CacheModule = CacheModule;
    function CacheModule_tsickle_Closure_declarations() {
        /** @type {?} */
        CacheModule.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        CacheModule.ctorParameters;
    }
    exports.CacheService = ngx_cache_layer_service_2.CacheService;
    exports.CacheLayer = ngx_cache_layer_layer_1.CacheLayer;
    exports.CacheServiceConfigInterface = ngx_cache_layer_interfaces_1.CacheServiceConfigInterface;
});
