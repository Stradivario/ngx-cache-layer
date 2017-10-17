import {BehaviorSubject} from 'rxjs/Rx';
import {CacheLayerInterface, CacheServiceConfigInterface} from './ngx-cache-layer.interfaces';

export class CacheLayer<T> {

  public items: BehaviorSubject<Array<T>> = new BehaviorSubject([]);
  public layer: string;
  public config: CacheServiceConfigInterface;

  static createCacheParams(config) {
    let arrayParams = [], data;
    if (config) {
      config.forEach(param => {
        arrayParams.push(config.params[param]);
        data = config.key + '/' + arrayParams.toString().replace(/[ ]*,[ ]*|[ ]+/g, '/');
      });
    } else {
      data = config.key;
    }
    return data;
  }

  constructor(i: CacheLayerInterface) {
    this.layer = i.layer;
    this.config = i.config;
    if (this.config.localStorage) {
      this.items.next([...this.items.getValue(), ...i.items]);
    }
  }

  private instanceHook(layerItem): void {
    this.onExpire(layerItem['key']);
  }

  public getItem(key: string): T {
    let item = this.items.getValue().filter(i => i['key'] === key);
    if (this.config.localStorage) {
      const layer = <CacheLayerInterface>JSON.parse(localStorage.getItem(this.layer));
      if (layer) {
        item = layer.items.filter(i => i['key'] === key);
      }
    }
    if (!item.length) {
      throw new Error('Missing item with key: ' + key);
    } else {
      return item[0];
    }
  }

  public putItem(layerItem: T): T {
    if (this.config.localStorage) {
      const layer = <CacheLayerInterface>JSON.parse(localStorage.getItem(this.layer));
      if (layer) {
        layer.items = [...this.items.getValue(), layerItem];
        localStorage.setItem(this.layer, JSON.stringify(layer));
      }
    }
    this.items.next([...this.items.getValue(), layerItem]);
    this.instanceHook(layerItem);
    return layerItem;
  }

  private onExpire(key: string): void {
    const self = this;
    setTimeout(function(){
      self.removeItem(key);
    }, this.config.maxAge);
  }

  public removeItem(key: string): void {
    let newLayerItems = this.items.getValue().filter(item => item['key'] !== key);
    if (this.config.localStorage) {
      const oldLayer = <CacheLayerInterface>JSON.parse(localStorage.getItem(this.layer));
      if (oldLayer) {
        const newLayer = <CacheLayerInterface>{
          config: this.config,
          layer: this.layer,
          items: newLayerItems
        };
        localStorage.setItem(this.layer, JSON.stringify(newLayer));
      }
    }
    this.items.next(newLayerItems);
  }

}
