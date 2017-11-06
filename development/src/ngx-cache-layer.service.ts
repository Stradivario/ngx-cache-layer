import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {CacheLayer} from './ngx-cache-layer.layer';
import {CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem} from './ngx-cache-layer.interfaces';

import {CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG} from './index';

const INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';

const FRIENDLY_ERROR_MESSAGES = {
  TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: ',
  LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled switching to regular in-memory storage.Please relate issue if you think it is enabled and there is a problem with the library itself.'
};


export class CacheService extends Map {

  public _cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]> = new BehaviorSubject([]);

  // --- Start Setters and Getters
  get asObservable() {
    return this._cachedLayers;
  }
  // --- END Setters and Getters
  get(name) {
    return super.get(name)
  }
  constructor(@Inject( CACHE_MODULE_CONFIG ) private config: CacheServiceConfigInterface) {
    super()
    if (this.config.localStorage && CacheService.isLocalStorageUsable()) {
      const layers = <Array<string>>JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
      if (layers) {
        layers.forEach(layer => {
            const cachedLayer = JSON.parse(localStorage.getItem(layer));
            if (cachedLayer) {
                this.createLayer(cachedLayer);
            }
        });
      } else {
        localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([]));
      }
    }
  }

  public static createCacheInstance<T>(cacheLayer): CacheLayer<CacheLayerItem<T>> {
    return new CacheLayer<CacheLayerItem<T>>(cacheLayer);
  }

  public static isLocalStorageUsable(): boolean {
    let error = [];
    try {
      localStorage.setItem('test-key', JSON.stringify({key: 'test-object'}));
      localStorage.removeItem('test-key');
    } catch (e) {
      error.push(e);
      console.log(FRIENDLY_ERROR_MESSAGES.LOCAL_STORAGE_DISABLED);
    }
    return error.length ? false : true;
  }

  public getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>> {
    const exists = this.has(name);
    if (!exists) {
      return this.createLayer<T>({name:name});
    }
    return this.get(name);
  }

  public createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>> {
    const exists = this.has(layer.name);
    if (exists) {
      return this.get(layer.name);
    }
    layer.items = layer.items || [];
    layer.config = layer.config || this.config || CACHE_MODULE_DI_CONFIG;
    let cacheLayer = CacheService.createCacheInstance<T>(layer);
    if (layer.config.localStorage && CacheService.isLocalStorageUsable()) {
        localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([...CacheService.getLayersFromLS().filter(l => l !== cacheLayer.name), cacheLayer.name]));
        localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
    }
    this.set(cacheLayer.name, cacheLayer);
    this._cachedLayers.next([...this._cachedLayers.getValue(), cacheLayer]);
    this.LayerHook<T>(cacheLayer);
    return cacheLayer;
  }

  private LayerHook<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    this.protectLayerFromInvaders<T>(layerInstance);
    this.OnExpire(layerInstance);
  }

  private protectLayerFromInvaders<T>(cacheLayer: CacheLayer<CacheLayerItem<T>>): void {
    cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
    cacheLayer.items.constructor.prototype.unsubscribe = () => {
      console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name)
    };
    // cacheLayer.items.constructor.prototype.subscribe = () => {
    //   return cacheLayer.items.getValue();
    // }
  }

  private OnExpire<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    Observable
      .create(observer => observer.next())
      .timeoutWith(layerInstance.config.cacheFlushInterval, Observable.of(1))
      .skip(1)
      .subscribe(observer => this.removeLayer(layerInstance));
  }

  public removeLayer<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    this.delete(layerInstance.name);
    if (this.config.localStorage) {
      localStorage.removeItem(layerInstance.name);
      localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(layer => layer !== layerInstance.name)));
    }
    this._cachedLayers.next([...this._cachedLayers.getValue().filter(layer => layer.name !== layerInstance.name)]);
  }

  public static getLayersFromLS(): Array<string> {
    return JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
  }

}