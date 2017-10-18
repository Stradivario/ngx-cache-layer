import {CacheLayerInterface, CacheServiceConfigInterface} from './ngx-cache-layer.interfaces';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Rx';

export class CacheLayer<T> {

  public items: BehaviorSubject<Array<T>> = new BehaviorSubject([]);
  public name: string;
  public config: CacheServiceConfigInterface;

  static createCacheParams(config) {
    let arrayParams = [], data;

      if(config.constructor === Array) {
        config.forEach(param => arrayParams.push(config.params[param]));
      } else if (config.constructor === String) {
        data = config;
      }
      data = config.key + '/' + arrayParams.toString().replace(/[ ]*,[ ]*|[ ]+/g, '/');

    data = config.key;
    return data;
  }

  constructor(settings: CacheLayerInterface) {
    this.name = settings.name;
    this.config = settings.config;
    if (this.config.localStorage) {
      this.items.next([...this.items.getValue(), ...settings.items]);
    }
  }

  private instanceHook(layerItem): void {
    this.onExpire(layerItem['key']);
  }

  public getItem(key: string): T {
    let item = this.items.getValue().filter(item => item['key'] === key);
    if (!item.length) {
      return null;
    } else {
      return item[0];
    }
  }

  public putItem(layerItem: T): T {
    if (this.config.localStorage) {
      localStorage.setItem(this.name, JSON.stringify(<CacheLayerInterface>{
        config: this.config,
        name: this.name,
        items: [...this.items.getValue(), layerItem]
      }));
    }
    this.items.next([...this.items.getValue(), layerItem]);
    this.instanceHook(layerItem);
    return layerItem;
  }

  private onExpire(key: string): void {
    Observable
      .create(observer => observer.next())
      .timeoutWith(this.config.maxAge, Observable.of(1))
      .skip(1)
      .subscribe(observer => this.removeItem(key));
  }

  public removeItem(key: string): void {
    let newLayerItems = this.items.getValue().filter(item => item['key'] !== key);
    if (this.config.localStorage) {
      const newLayer = <CacheLayerInterface>{
        config: this.config,
        name: this.name,
        items: newLayerItems
      };
      localStorage.setItem(this.name, JSON.stringify(newLayer));
    }
    this.items.next(newLayerItems);
  }

}
