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

@Injectable()
export class CacheService {

  public cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]> = new BehaviorSubject([]);

  private static createCacheInstance<T>(name): CacheLayer<CacheLayerItem<T>> {
    return new CacheLayer<CacheLayerItem<T>>(name);
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

  constructor(@Inject( CACHE_MODULE_CONFIG ) private config: CacheServiceConfigInterface) {
    if (this.config.localStorage && CacheService.isLocalStorageUsable()) {
      const layers = <Array<string>>JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
      if (layers) {
        layers.forEach(layer => {
            const cachedLayer = JSON.parse(localStorage.getItem(layer));
            if (cachedLayer) {
              this.cachedLayers.next([...this.cachedLayers.getValue(), CacheService.createCacheInstance(cachedLayer)]);
            }
        });
      } else {
        localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([]));
      }
    }
  }

  private createLayerHook<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    this.protectLayerFromInvaders<T>(layerInstance);
    this.onExpire(layerInstance.name);
  }

  public getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>> {
    let result = this.cachedLayers.getValue().filter(layer => layer.name === name);
    if (!result.length) {
      result = [this.createLayer({name: name})]
    }
    return result[0];
  }

  public createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>> {
    const exists = this.cachedLayers.getValue().filter(result => result.name === layer.name);
    if (exists.length) {
      return exists[0];
    }
    layer.items = layer.items || [];
    layer.config = layer.config || this.config || CACHE_MODULE_DI_CONFIG;
    let cacheLayer = CacheService.createCacheInstance<T>(layer);
    if (layer.config.localStorage && CacheService.isLocalStorageUsable()) {
        localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([...CacheService.getLayersFromLS(), cacheLayer.name]));
        localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
    }
    this.cachedLayers.next([...this.cachedLayers.getValue(), cacheLayer]);
    this.createLayerHook<T>(cacheLayer);
    return cacheLayer;
  }

  public removeLayer(name: string): void {
    if (this.config.localStorage) {
      localStorage.removeItem(name);
      localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(layer => layer !== name)));
    }
    this.cachedLayers.next(this.cachedLayers.getValue().filter(result => result.name !== name));
  }

  public static getLayersFromLS(): Array<string> {
    return <Array<string>>JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
  }

  private protectLayerFromInvaders<T>(cacheLayer: CacheLayer<CacheLayerItem<T>>): void {
    cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
    cacheLayer.items.constructor.prototype.unsubscribe = () => {
      console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name)
    };
  }

  private onExpire(name: string): void {
    Observable
      .create(observer => observer.next())
      .timeoutWith(this.config.cacheFlushInterval, Observable.of(1))
      .skip(1)
      .subscribe(observer => this.removeLayer(name));
  }

}
