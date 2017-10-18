import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CacheLayer } from './ngx-cache-layer.layer';
import { CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
import { CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG } from './index';
var /** @type {?} */ INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';
var /** @type {?} */ FRIENDLY_ERROR_MESSAGES = {
    TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: ',
    LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled switching to regular in-memory storage.Please relate issue if you think it is enabled and there is a problem with the library itself.'
};
var CacheService = (function () {
    /**
     * @param {?} config
     */
    function CacheService(config) {
        var _this = this;
        this.config = config;
        this.cachedLayers = new BehaviorSubject([]);
        if (this.config.localStorage && CacheService.isLocalStorageUsable()) {
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
    CacheService.isLocalStorageUsable = function () {
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
     * @param {?} layerInstance
     * @return {?}
     */
    CacheService.prototype.createLayerHook = function (layerInstance) {
        this.protectLayerFromInvaders(layerInstance);
        this.onExpire(layerInstance.name);
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
     * @param {?} layer
     * @return {?}
     */
    CacheService.prototype.createLayer = function (layer) {
        var /** @type {?} */ exists = this.cachedLayers.getValue().filter(function (result) { return result.name === layer.name; });
        if (exists.length) {
            return exists[0];
        }
        layer.items = layer.items || [];
        layer.config = layer.config || this.config || CACHE_MODULE_DI_CONFIG;
        var /** @type {?} */ cacheLayer = CacheService.createCacheInstance(layer);
        if (layer.config.localStorage && CacheService.isLocalStorageUsable()) {
            localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().concat([cacheLayer.name])));
            localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
        }
        this.cachedLayers.next(this.cachedLayers.getValue().concat([cacheLayer]));
        this.createLayerHook(cacheLayer);
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
     * @template T
     * @param {?} cacheLayer
     * @return {?}
     */
    CacheService.prototype.protectLayerFromInvaders = function (cacheLayer) {
        cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
        cacheLayer.items.constructor.prototype.unsubscribe = function () {
            console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
        };
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
