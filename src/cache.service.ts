import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CacheLayerInstance } from './cache.instance';
import {
  CacheLayerInterface,
  CacheServiceConfigInterface,
  CacheLayerItem, CACHE_MODULE_CONFIG,
  CACHE_MODULE_DI_CONFIG
} from './cache.interfaces';

import { take, map, timeoutWith, skip } from 'rxjs/operators';

const INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';

const FRIENDLY_ERROR_MESSAGES = {
  TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: ',
  // tslint:disable-next-line:max-line-length
  LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled switching to regular in-memory storage.Please relate issue if you think it is enabled and there is a problem with the library itself.'
};


@Injectable()
export class CacheService {

  public cachedLayers: BehaviorSubject<CacheLayerInstance<CacheLayerItem<any>>[]> = new BehaviorSubject([]);
  private map: Map<any, any> = new Map();

  public static getLayersFromLS(): Array<string> {
    return JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
  }

  constructor(@Inject(CACHE_MODULE_CONFIG) private config: CacheServiceConfigInterface) {
    if (this.config.localStorage && CacheService.isLocalStorageUsable()) {
      const layers: Array<string> = JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
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

  public static createCacheInstance<T>(cacheLayer): CacheLayerInstance<CacheLayerItem<T>> {
    return new CacheLayerInstance<CacheLayerItem<T>>(cacheLayer);
  }

  public static isLocalStorageUsable(): boolean {
    const error = [];
    try {
      localStorage.setItem('test-key', JSON.stringify({ key: 'test-object' }));
      localStorage.removeItem('test-key');
    } catch (e) {
      error.push(e);
      console.log(FRIENDLY_ERROR_MESSAGES.LOCAL_STORAGE_DISABLED);
    }
    return error.length ? false : true;
  }

  public getLayer<T>(name: string): CacheLayerInstance<CacheLayerItem<T>> {
    const exists = this.map.has(name);
    if (!exists) {
      return this.createLayer<T>({ name });
    }
    return this.map.get(name);
  }

  public createLayer<T>(layer: CacheLayerInterface): CacheLayerInstance<CacheLayerItem<T>> {
    const exists = this.map.has(layer.name);
    if (exists) {
      return this.map.get(layer.name);
    }
    layer.items = layer.items || [];
    layer.config = layer.config || this.config || CACHE_MODULE_DI_CONFIG;
    const cacheLayer = CacheService.createCacheInstance<T>(layer);
    if (layer.config.localStorage && CacheService.isLocalStorageUsable()) {
      // tslint:disable-next-line:max-line-length
      localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([...CacheService.getLayersFromLS().filter(l => l !== cacheLayer.name), cacheLayer.name]));
      localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
    }
    this.map.set(cacheLayer.name, cacheLayer);
    this.cachedLayers.next([...this.cachedLayers.getValue(), cacheLayer]);
    this.LayerHook<T>(cacheLayer);
    return cacheLayer;
  }

  private LayerHook<T>(layerInstance: CacheLayerInstance<CacheLayerItem<T>>): void {
    this.protectLayerFromInvaders<T>(layerInstance);
    if (layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval) {
      this.OnExpire(layerInstance);
    }
  }

  private protectLayerFromInvaders<T>(cacheLayer: CacheLayerInstance<CacheLayerItem<T>>): void {
    cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
    cacheLayer.items.constructor.prototype.unsubscribe = () => {
      console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
    };
  }

  private OnExpire<T>(layerInstance: CacheLayerInstance<CacheLayerItem<T>>): void {
    new Observable(observer => observer.next()).
      pipe(
        timeoutWith(layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval, of(1)),
        skip(1)
      ).subscribe(() => this.removeLayer(layerInstance));
  }

  public removeLayer<T>(layerInstance: CacheLayerInstance<CacheLayerItem<T>>): void {
    this.map.delete(layerInstance.name);
    if (this.config.localStorage) {
      localStorage.removeItem(layerInstance.name);
      // tslint:disable-next-line:max-line-length
      localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(layer => layer !== layerInstance.name)));
    }
    this.cachedLayers.next([...this.cachedLayers.getValue().filter(layer => layer.name !== layerInstance.name)]);
  }

  public transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayerInstance<CacheLayerItem<any>>[] {
    const oldLayer = this.getLayer(name);
    const newLayers = [];
    newCacheLayers.forEach(layerName => {
      const newLayer = this.createLayer(layerName);
      oldLayer.items.getValue().forEach(item => newLayer.putItem(item));
      newLayers.push(newLayer);
    });
    return newLayers;
  }


  public flushCache(force?: boolean): Observable<boolean> {
    let oldLayersNames: string[];
    return this.cachedLayers.pipe(
      take(1),
      map(layers => {
        oldLayersNames = layers.map(l => l.name);
        layers.forEach(layer => this.removeLayer(layer));
        if (force) {
          localStorage.removeItem(INTERNAL_PROCEDURE_CACHE_NAME);
        } else {
          oldLayersNames.forEach((l) => this.createLayer({ name: l }));
        }
        return true;
      })
    );
  }

}
