import { CacheLayer } from './ngx-cache-layer.layer';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
import { Injectable, Inject } from '@angular/core';
import { CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG } from './index';
var /** @type {?} */ INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';
var /** @type {?} */ FRIENDLY_ERROR_MESSAGES = {
    LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled please relate issue if you think it is enabled and there is a problem with library.'
};
var CacheService = (function () {
    /**
     * @param {?} config
     */
    function CacheService(config) {
        var _this = this;
        this.config = config;
        this.cachedLayers = new BehaviorSubject([]);
        if (this.config.localStorage && CacheService.isLocalStorageEnabled()) {
            var layers = JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
            if (layers) {
                layers.forEach(function (layer) {
                    var cachedLayer = JSON.parse(localStorage.getItem(layer));
                    if (cachedLayer) {
                        _this.cachedLayers.next(_this.cachedLayers.getValue().concat([CacheService.createCacheInstance(cachedLayer)]));
                    }
                });
            }
            else {
                localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([]));
            }
        }
    }
    /**
     * @template T
     * @param {?} name
     * @return {?}
     */
    CacheService.createCacheInstance = function (name) {
        return new CacheLayer(name);
    };
    /**
     * @return {?}
     */
    CacheService.isLocalStorageEnabled = function () {
        var /** @type {?} */ error = [];
        try {
            localStorage.setItem('test-key', JSON.stringify({ key: 'test-object' }));
            localStorage.removeItem('test-key');
        }
        catch (e) {
            error.push(e);
            console.log(FRIENDLY_ERROR_MESSAGES.LOCAL_STORAGE_DISABLED);
        }
        return error.length ? false : true;
    };
    /**
     * @template T
     * @param {?} name
     * @return {?}
     */
    CacheService.prototype.getLayer = function (name) {
        var /** @type {?} */ result = this.cachedLayers.getValue().filter(function (layer) { return layer.name === name; });
        if (!result.length) {
            result = [this.createLayer({ name: name })];
        }
        return result[0];
    };
    /**
     * @template T
     * @param {?} settings
     * @return {?}
     */
    CacheService.prototype.createLayer = function (settings) {
        var /** @type {?} */ exists = this.cachedLayers.getValue().filter(function (result) { return result.name === settings.name; });
        if (exists.length) {
            return exists[0];
        }
        settings.config = settings.config || this.config || CACHE_MODULE_DI_CONFIG;
        settings.items = settings.items || [];
        var /** @type {?} */ cacheLayer = CacheService.createCacheInstance(settings);
        if (settings.config.localStorage && CacheService.isLocalStorageEnabled()) {
            var /** @type {?} */ layer = JSON.parse(localStorage.getItem(settings.name));
            if (layer) {
                cacheLayer = CacheService.createCacheInstance(layer);
            }
            else {
                localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().concat([settings.name])));
                localStorage.setItem(settings.name, JSON.stringify(settings));
            }
        }
        this.cachedLayers.next(this.cachedLayers.getValue().concat([cacheLayer]));
        this.instanceHook(settings);
        return cacheLayer;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    CacheService.prototype.removeLayer = function (name) {
        if (this.config.localStorage) {
            localStorage.removeItem(name);
            localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(function (layer) { return layer !== name; })));
        }
        this.cachedLayers.next(this.cachedLayers.getValue().filter(function (result) { return result.name !== name; }));
    };
    /**
     * @return {?}
     */
    CacheService.getLayersFromLS = function () {
        return (JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME)));
    };
    /**
     * @param {?} settings
     * @return {?}
     */
    CacheService.prototype.instanceHook = function (settings) {
        this.onExpire(settings.name);
    };
    /**
     * @param {?} name
     * @return {?}
     */
    CacheService.prototype.onExpire = function (name) {
        var _this = this;
        Observable
            .create(function (observer) { return observer.next(); })
            .timeoutWith(this.config.cacheFlushInterval, Observable.of(1))
            .skip(1)
            .subscribe(function (observer) { return _this.removeLayer(name); });
    };
    return CacheService;
}());
export { CacheService };
CacheService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
CacheService.ctorParameters = function () { return [
    { type: CacheServiceConfigInterface, decorators: [{ type: Inject, args: [CACHE_MODULE_CONFIG,] },] },
]; };
function CacheService_tsickle_Closure_declarations() {
    /** @type {?} */
    CacheService.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CacheService.ctorParameters;
    /** @type {?} */
    CacheService.prototype.cachedLayers;
    /** @type {?} */
    CacheService.prototype.config;
}
