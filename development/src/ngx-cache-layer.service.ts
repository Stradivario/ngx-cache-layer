import {CacheLayer} from './ngx-cache-layer.layer';
import {BehaviorSubject} from 'rxjs/Rx';
import {CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem} from './ngx-cache-layer.interfaces';
import {Injectable, Inject} from '@angular/core';
import {CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG} from './index';

const FRIENDLY_ERROR_MESSAGES = {
  LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled please relate issue if you think it is enabled and there is a problem with library.'
};

@Injectable()
export class CacheService {

  public cachedLayers: BehaviorSubject<Array<CacheLayer<CacheLayerItem<any>>>> = new BehaviorSubject([]);

  private static createCacheInstance<T>(layer): CacheLayer<CacheLayerItem<T>> {
    return new CacheLayer<CacheLayerItem<T>>(layer);
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
      const layers = <Array<string>>JSON.parse(localStorage.getItem('cache_layers'));
      if (layers) {
        layers.forEach(layer => {
            const cachedLayer = JSON.parse(localStorage.getItem(layer));
            if (cachedLayer) {
              this.cachedLayers.next([...this.cachedLayers.getValue(), new CacheLayer<CacheLayerItem<any>>(cachedLayer)]);
            }
        });
      } else {
        localStorage.setItem('cache_layers', JSON.stringify([]));
      }
    }
  }

  public get<T>(name: string): CacheLayer<CacheLayerItem<T>> {
    let result = this.cachedLayers.getValue().filter(item => item.layer === name);
    if (this.config.localStorage) {
      const layer = <CacheLayerInterface>JSON.parse(localStorage.getItem(name));
      if (layer) {
        result = [CacheService.createCacheInstance<T>(layer)];
      }
    }
    if (!result.length) {
      throw new Error('Missing cache name: ' + name);
    } else {
      return result[0];
    }
  }

  public create<T>(settings: CacheLayerInterface): CacheLayer<CacheLayerItem<T>> {
    const exists = this.cachedLayers.getValue().filter(result => result.layer === settings.layer);
    if (exists.length) {
      return exists[0];
    }
    settings.config = settings.config || this.config || CACHE_MODULE_DI_CONFIG;
    settings.items = settings.items || [];
    let cacheLayer = CacheService.createCacheInstance<T>(settings);
    if (settings.config.localStorage && CacheService.isLocalStorageEnabled()) {
        const layer = JSON.parse(localStorage.getItem(settings.layer));
        if (layer) {
          cacheLayer = CacheService.createCacheInstance<T>(layer);
        } else {
          localStorage.setItem('cache_layers', JSON.stringify([...CacheService.getLayersFromLS(), settings.layer]));
          localStorage.setItem(settings.layer, JSON.stringify(settings));
        }
    }
    this.cachedLayers.next([...this.cachedLayers.getValue(), cacheLayer]);
    this.instanceHook(settings);
    return cacheLayer;
  }

  public removeLayer(layer: string): void {
    if (this.config.localStorage) {
      localStorage.removeItem(layer);
      localStorage.setItem('cache_layers', JSON.stringify(CacheService.getLayersFromLS().filter(l => l !== layer)));
    }
    this.cachedLayers.next(this.cachedLayers.getValue().filter(result => result.layer !== layer));
  }

  public static getLayersFromLS(): Array<string> {
    return <Array<string>>JSON.parse(localStorage.getItem('cache_layers'));
  }

  private instanceHook(settings: CacheLayerInterface): void {
    this.onExpire(settings['layer']);
  }

  private onExpire(layer: string): void {
    const self = this;
    setTimeout(function(){
      self.removeLayer(layer);
    }, this.config.cacheFlushInterval);
  }

}
