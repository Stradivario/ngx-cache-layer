import { Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CacheLayer } from './ngx-cache-layer.layer';
import { CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
import { CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG } from './index';
const /** @type {?} */ INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';
const /** @type {?} */ FRIENDLY_ERROR_MESSAGES = {
    TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: ',
    LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled switching to regular in-memory storage.Please relate issue if you think it is enabled and there is a problem with the library itself.'
};
export class CacheService extends Map {
    /**
     * @param {?} config
     */
    constructor(config) {
        super();
        this.config = config;
        this._cachedLayers = new BehaviorSubject([]);
        if (this.config.localStorage && CacheService.isLocalStorageUsable()) {
            const layers = JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
            if (layers) {
                layers.forEach(layer => {
                    const cachedLayer = JSON.parse(localStorage.getItem(layer));
                    if (cachedLayer) {
                        this.createLayer(cachedLayer);
                    }
                });
            }
            else {
                localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([]));
            }
        }
    }
    /**
     * @return {?}
     */
    get asObservable() {
        return this._cachedLayers;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    get(name) {
        return super.get(name);
    }
    /**
     * @template T
     * @param {?} cacheLayer
     * @return {?}
     */
    static createCacheInstance(cacheLayer) {
        return new CacheLayer(cacheLayer);
    }
    /**
     * @return {?}
     */
    static isLocalStorageUsable() {
        let /** @type {?} */ error = [];
        try {
            localStorage.setItem('test-key', JSON.stringify({ key: 'test-object' }));
            localStorage.removeItem('test-key');
        }
        catch (e) {
            error.push(e);
            console.log(FRIENDLY_ERROR_MESSAGES.LOCAL_STORAGE_DISABLED);
        }
        return error.length ? false : true;
    }
    /**
     * @template T
     * @param {?} name
     * @return {?}
     */
    getLayer(name) {
        const /** @type {?} */ exists = this.has(name);
        if (!exists) {
            return this.createLayer({ name: name });
        }
        return this.get(name);
    }
    /**
     * @template T
     * @param {?} layer
     * @return {?}
     */
    createLayer(layer) {
        const /** @type {?} */ exists = this.has(layer.name);
        if (exists) {
            return this.get(layer.name);
        }
        layer.items = layer.items || [];
        layer.config = layer.config || this.config || CACHE_MODULE_DI_CONFIG;
        let /** @type {?} */ cacheLayer = CacheService.createCacheInstance(layer);
        if (layer.config.localStorage && CacheService.isLocalStorageUsable()) {
            localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([...CacheService.getLayersFromLS().filter(l => l !== cacheLayer.name), cacheLayer.name]));
            localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
        }
        this.set(cacheLayer.name, cacheLayer);
        this._cachedLayers.next([...this._cachedLayers.getValue(), cacheLayer]);
        this.LayerHook(cacheLayer);
        return cacheLayer;
    }
    /**
     * @template T
     * @param {?} layerInstance
     * @return {?}
     */
    LayerHook(layerInstance) {
        this.protectLayerFromInvaders(layerInstance);
        this.OnExpire(layerInstance);
    }
    /**
     * @template T
     * @param {?} cacheLayer
     * @return {?}
     */
    protectLayerFromInvaders(cacheLayer) {
        cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
        cacheLayer.items.constructor.prototype.unsubscribe = () => {
            console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
        };
        // cacheLayer.items.constructor.prototype.subscribe = () => {
        //   return cacheLayer.items.getValue();
        // }
    }
    /**
     * @template T
     * @param {?} layerInstance
     * @return {?}
     */
    OnExpire(layerInstance) {
        Observable
            .create(observer => observer.next())
            .timeoutWith(layerInstance.config.cacheFlushInterval, Observable.of(1))
            .skip(1)
            .subscribe(observer => this.removeLayer(layerInstance));
    }
    /**
     * @template T
     * @param {?} layerInstance
     * @return {?}
     */
    removeLayer(layerInstance) {
        this.delete(layerInstance.name);
        if (this.config.localStorage) {
            localStorage.removeItem(layerInstance.name);
            localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(layer => layer !== layerInstance.name)));
        }
        this._cachedLayers.next([...this._cachedLayers.getValue().filter(layer => layer.name !== layerInstance.name)]);
    }
    /**
     * @return {?}
     */
    static getLayersFromLS() {
        return JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
    }
}
/**
 * @nocollapse
 */
CacheService.ctorParameters = () => [
    { type: CacheServiceConfigInterface, decorators: [{ type: Inject, args: [CACHE_MODULE_CONFIG,] },] },
];
function CacheService_tsickle_Closure_declarations() {
    /**
     * @nocollapse
     * @type {?}
     */
    CacheService.ctorParameters;
    /** @type {?} */
    CacheService.prototype._cachedLayers;
    /** @type {?} */
    CacheService.prototype.config;
}
