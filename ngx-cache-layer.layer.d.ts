import { CacheLayerInterface, CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
export declare class CacheLayer<T> extends Map {
    items: BehaviorSubject<Array<T>>;
    name: string;
    config: CacheServiceConfigInterface;
    static createCacheParams(config: any): void;
    set(key: any, data: any): this;
    get(name: any): T;
    constructor(layer: CacheLayerInterface);
    private initHook(layer);
    private onExpireAll(layer);
    private putItemHook(layerItem);
    getItem(key: string): T;
    putItem(layerItem: T): T;
    private onExpire(key);
    removeItem(key: string): void;
    getItemObservable(key: string): Observable<T>;
}
