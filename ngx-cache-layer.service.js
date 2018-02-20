import { Inject } from '@angular/core';
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
var CacheService = /** @class */ (function () {
    /**
     * @param {?} config
     */
    function CacheService(config) {
        var _this = this;
        this.config = config;
        this._cachedLayers = new BehaviorSubject([]);
        this.map = new Map();
        if (this.config.localStorage && CacheService.isLocalStorageUsable()) {
            var layers = JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
            if (layers) {
                layers.forEach(function (layer) {
                    var cachedLayer = JSON.parse(localStorage.getItem(layer));
                    if (cachedLayer) {
                        _this.createLayer(cachedLayer);
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
     * @param {?} cacheLayer
     * @return {?}
     */
    CacheService.createCacheInstance = function (cacheLayer) {
        return new CacheLayer(cacheLayer);
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
     * @param {?} name
     * @return {?}
     */
    CacheService.prototype.getLayer = function (name) {
        var /** @type {?} */ exists = this.map.has(name);
        if (!exists) {
            return this.createLayer({ name: name });
        }
        return this.map.get(name);
    };
    /**
     * @template T
     * @param {?} layer
     * @return {?}
     */
    CacheService.prototype.createLayer = function (layer) {
        var /** @type {?} */ exists = this.map.has(layer.name);
        if (exists) {
            return this.map.get(layer.name);
        }
        layer.items = layer.items || [];
        layer.config = layer.config || this.config || CACHE_MODULE_DI_CONFIG;
        var /** @type {?} */ cacheLayer = CacheService.createCacheInstance(layer);
        if (layer.config.localStorage && CacheService.isLocalStorageUsable()) {
            localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(function (l) { return l !== cacheLayer.name; }).concat([cacheLayer.name])));
            localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
        }
        this.map.set(cacheLayer.name, cacheLayer);
        this._cachedLayers.next(this._cachedLayers.getValue().concat([cacheLayer]));
        this.LayerHook(cacheLayer);
        return cacheLayer;
    };
    /**
     * @template T
     * @param {?} layerInstance
     * @return {?}
     */
    CacheService.prototype.LayerHook = function (layerInstance) {
        this.protectLayerFromInvaders(layerInstance);
        this.OnExpire(layerInstance);
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
     * @template T
     * @param {?} layerInstance
     * @return {?}
     */
    CacheService.prototype.OnExpire = function (layerInstance) {
        var _this = this;
        Observable
            .create(function (observer) { return observer.next(); })
            .timeoutWith(layerInstance.config.cacheFlushInterval, Observable.of(1))
            .skip(1)
            .subscribe(function (observer) { return _this.removeLayer(layerInstance); });
    };
    /**
     * @template T
     * @param {?} layerInstance
     * @return {?}
     */
    CacheService.prototype.removeLayer = function (layerInstance) {
        this.map.delete(layerInstance.name);
        if (this.config.localStorage) {
            localStorage.removeItem(layerInstance.name);
            localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(function (layer) { return layer !== layerInstance.name; })));
        }
        this._cachedLayers.next(this._cachedLayers.getValue().filter(function (layer) { return layer.name !== layerInstance.name; }).slice());
    };
    /**
     * @param {?} name
     * @param {?} newCacheLayers
     * @return {?}
     */
    CacheService.prototype.transferItems = function (name, newCacheLayers) {
        var _this = this;
        var /** @type {?} */ oldLayer = this.getLayer(name);
        var /** @type {?} */ newLayers = [];
        newCacheLayers.forEach(function (layerName) {
            var /** @type {?} */ newLayer = _this.createLayer(layerName);
            oldLayer.items.getValue().forEach(function (item) { return newLayer.putItem(item); });
            newLayers.push(newLayer);
        });
        return newLayers;
    };
    /**
     * @return {?}
     */
    CacheService.getLayersFromLS = function () {
        return JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
    };
    /**
     * @return {?}
     */
    CacheService.prototype.flushCache = function () {
        var _this = this;
        return this._cachedLayers.take(1)
            .map(function (layers) {
            layers.forEach(function (layer) { return _this.removeLayer(layer); });
            localStorage.removeItem(INTERNAL_PROCEDURE_CACHE_NAME);
            return true;
        });
    };
    /**
     * @nocollapse
     */
    CacheService.ctorParameters = function () { return [
        { type: CacheServiceConfigInterface, decorators: [{ type: Inject, args: [CACHE_MODULE_CONFIG,] },] },
    ]; };
    return CacheService;
}());
export { CacheService };
function CacheService_tsickle_Closure_declarations() {
    /**
     * @nocollapse
     * @type {?}
     */
    CacheService.ctorParameters;
    /** @type {?} */
    CacheService.prototype._cachedLayers;
    /** @type {?} */
    CacheService.prototype.map;
    /** @type {?} */
    CacheService.prototype.config;
}
