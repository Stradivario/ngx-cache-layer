import { CacheLayer } from './ngx-cache-layer.layer';
import { BehaviorSubject } from 'rxjs/Rx';
import { CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
import { Injectable, Inject } from '@angular/core';
import { CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG } from './index';
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
            var layers = JSON.parse(localStorage.getItem('cache_layers'));
            if (layers) {
                layers.forEach(function (layer) {
                    var cachedLayer = JSON.parse(localStorage.getItem(layer));
                    if (cachedLayer) {
                        _this.cachedLayers.next(_this.cachedLayers.getValue().concat([new CacheLayer(cachedLayer)]));
                    }
                });
            }
            else {
                localStorage.setItem('cache_layers', JSON.stringify([]));
            }
        }
    }
    /**
     * @template T
     * @param {?} layer
     * @return {?}
     */
    CacheService.createCacheInstance = function (layer) {
        return new CacheLayer(layer);
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
    CacheService.prototype.get = function (name) {
        var /** @type {?} */ result = this.cachedLayers.getValue().filter(function (item) { return item.layer === name; });
        if (this.config.localStorage) {
            var /** @type {?} */ layer = (JSON.parse(localStorage.getItem(name)));
            if (layer) {
                result = [CacheService.createCacheInstance(layer)];
            }
        }
        if (!result.length) {
            throw new Error('Missing cache name: ' + name);
        }
        else {
            return result[0];
        }
    };
    /**
     * @template T
     * @param {?} settings
     * @return {?}
     */
    CacheService.prototype.create = function (settings) {
        var /** @type {?} */ exists = this.cachedLayers.getValue().filter(function (result) { return result.layer === settings.layer; });
        if (exists.length) {
            return exists[0];
        }
        settings.config = settings.config || this.config || CACHE_MODULE_DI_CONFIG;
        settings.items = settings.items || [];
        var /** @type {?} */ cacheLayer = CacheService.createCacheInstance(settings);
        if (settings.config.localStorage && CacheService.isLocalStorageEnabled()) {
            var /** @type {?} */ layer = JSON.parse(localStorage.getItem(settings.layer));
            if (layer) {
                cacheLayer = CacheService.createCacheInstance(layer);
            }
            else {
                localStorage.setItem('cache_layers', JSON.stringify(CacheService.getLayersFromLS().concat([settings.layer])));
                localStorage.setItem(settings.layer, JSON.stringify(settings));
            }
        }
        this.cachedLayers.next(this.cachedLayers.getValue().concat([cacheLayer]));
        return cacheLayer;
    };
    /**
     * @param {?} layer
     * @return {?}
     */
    CacheService.prototype.remove = function (layer) {
        if (this.config.localStorage) {
            localStorage.removeItem(layer);
            localStorage.setItem('cache_layers', JSON.stringify(CacheService.getLayersFromLS().filter(function (l) { return l !== layer; })));
        }
        this.cachedLayers.next(this.cachedLayers.getValue().filter(function (result) { return result.layer !== layer; }));
    };
    /**
     * @return {?}
     */
    CacheService.getLayersFromLS = function () {
        return (JSON.parse(localStorage.getItem('cache_layers')));
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
