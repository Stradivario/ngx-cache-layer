import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {CacheLayer} from './ngx-cache-layer.layer';
import {CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem} from './ngx-cache-layer.interfaces';

import {CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG} from './index';

const INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';

const FRIENDLY_ERROR_MESSAGES = {
  LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled switching to regular in-memory storage.Please relate issue if you think it is enabled and there is a problem with the library itself.'
};

@Injectable()
export class CacheService {

  public cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]> = new BehaviorSubject([]);

  private static createCacheInstance<T>(name): CacheLayer<CacheLayerItem<T>> {
    return new CacheLayer<CacheLayerItem<T>>(name);
  }

  public static isLocalStorageEnabled(): boolean {
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
    if (this.config.localStorage && CacheService.isLocalStorageEnabled()) {
      const layers = <Array<string>>JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
      if (layers) {
        layers.forEach(layer => {
            const cachedLayer = JSON.parse(localStorage.getItem(layer));
            if (cachedLayer) {
              this.cachedLayers.next([...this.cachedLayers.getValue(), CacheService.createCacheInstance<any>(cachedLayer)]);
            }
        });
      } else {
        localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([]));
      }
    }
  }

  public getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>> {
    let result = this.cachedLayers.getValue().filter(layer => layer.name === name);
    if (!result.length) {
      result = [this.createLayer({name: name})]
    }
    return result[0];
  }

  public createLayer<T>(settings: CacheLayerInterface): CacheLayer<CacheLayerItem<T>> {
    const exists = this.cachedLayers.getValue().filter(result => result.name === settings.name);
    if (exists.length) {
      return exists[0];
    }
    settings.config = settings.config || this.config || CACHE_MODULE_DI_CONFIG;
    settings.items = settings.items || [];
    let cacheLayer = CacheService.createCacheInstance<T>(settings);
    if (settings.config.localStorage && CacheService.isLocalStorageEnabled()) {
        const layer = JSON.parse(localStorage.getItem(settings.name));
        if (layer) {
          cacheLayer = CacheService.createCacheInstance<T>(layer);
        } else {
          localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([...CacheService.getLayersFromLS(), settings.name]));
          localStorage.setItem(settings.name, JSON.stringify(settings));
        }
    }
    this.cachedLayers.next([...this.cachedLayers.getValue(), cacheLayer]);
    this.instanceHook(settings);
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

  private instanceHook(settings: CacheLayerInterface): void {
    this.onExpire(settings.name);
  }

  private onExpire(name: string): void {
    Observable
      .create(observer => observer.next())
      .timeoutWith(this.config.cacheFlushInterval, Observable.of(1))
      .skip(1)
      .subscribe(observer => this.removeLayer(name));
  }

}
