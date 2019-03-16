import { CacheLayerInterface, CacheServiceConfigInterface } from './cache.interfaces';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { filter, map, timeoutWith, skip } from 'rxjs/operators';

const FRIENDLY_ERROR_MESSAGES = {
  MISSING_OBSERVABLE_ITEM: `is missing from the layer misspelled name ? as soon as you provide correct name value will be emitted!`
};

export class CacheLayerInstance<T = {}> {

  public items: BehaviorSubject<Array<T>> = new BehaviorSubject([]);
  public name: string;
  public config: CacheServiceConfigInterface;
  private map: Map<any, any> = new Map();
  static createCacheParams(config) {
    if (config.params.constructor === Object) {
      return; // Todo
    } else if (config.constructor === String) {
      return; // Todo
    } else if (config.params.constructor === Number) {
      return; // Todo
    } else if (config.params.constructor === Array) {
      return; // Todo
    }
  }

  public get(name): T {
    return this.map.get(name);
  }

  constructor(layer: CacheLayerInterface) {
    this.name = layer.name;
    this.config = layer.config;
    if (this.config.localStorage) {
      // tslint:disable-next-line:no-string-literal
      layer.items.forEach(item => this.map.set(item['key'], item));
      if (layer.items.constructor === BehaviorSubject) {
        layer.items = layer.items.getValue() || [];
      }
      this.items.next([...this.items.getValue(), ...layer.items]);
    }
    this.initHook(layer);
  }

  private initHook(layer) {
    if (this.config.maxAge) {
      this.onExpireAll(layer);
    }
  }

  private onExpireAll(layer) {
    // tslint:disable-next-line:no-string-literal
    layer.items.forEach(item => this.onExpire(item['key']));
  }

  private putItemHook(layerItem): void {
    if (this.config.maxAge) {
      // tslint:disable-next-line:no-string-literal
      this.onExpire(layerItem['key']);
    }
  }

  public getItem(key: string): T {
    if (this.map.has(key)) {
      return this.get(key);
    } else {
      return null;
    }
  }

  public putItem(layerItem: T): T {
    // tslint:disable-next-line:no-string-literal
    this.map.set(layerItem['key'], layerItem);
    // tslint:disable-next-line:no-string-literal
    const item = this.get(layerItem['key']);
    // tslint:disable-next-line:no-string-literal
    const filteredItems = this.items.getValue().filter(i => i['key'] !== layerItem['key']);
    if (this.config.localStorage) {
      localStorage.setItem(this.name, JSON.stringify({
        config: this.config,
        name: this.name,
        items: [...filteredItems, item]
      }));
    }

    this.items.next([...filteredItems, item]);
    this.putItemHook(layerItem);
    return layerItem;
  }

  private onExpire(key: string): void {
    new Observable(observer => observer.next())
      .pipe(
        timeoutWith(this.config.maxAge, of(1)),
        skip(1)
      ).subscribe(() => this.removeItem(key));
  }

  public removeItem(key: string): void {
    // tslint:disable-next-line:no-string-literal
    const newLayerItems = this.items.getValue().filter(item => item['key'] !== key);
    if (this.config.localStorage) {
      const newLayer: CacheLayerInterface = {
        config: this.config,
        name: this.name,
        items: newLayerItems
      };
      localStorage.setItem(this.name, JSON.stringify(newLayer));
    }
    this.map.delete(key);
    this.items.next(newLayerItems);
  }

  public getItemObservable(key: string): Observable<T> {
    if (this.map.has(key)) {
      console.error(`Key: ${key} ${FRIENDLY_ERROR_MESSAGES.MISSING_OBSERVABLE_ITEM}`);
    }
    return this.items.asObservable().pipe(
      filter(() => this.map.has(key)),
      map(res => res[0])
    );
  }

  public flushCache(): Observable<boolean> {
    return this.items.asObservable()
      .pipe(
        map(items => {
          // tslint:disable-next-line:no-string-literal
          items.forEach(i => this.removeItem(i['key']));
          return true;
        })
      );
  }

  async fetch(http: string, init?: RequestInit, cache = true) {
    if (this.config.localStorage && this.getItem(http) && cache) {
      return this.getItem(http)['data'];
    }
    const data = await (await fetch(http)).json();
    if (cache) {
      this.putItem(<any>{ key: http, data: data })
    }
    return data;
  }

}
