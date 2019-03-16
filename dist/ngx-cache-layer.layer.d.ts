import { CacheLayerInterface, CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
export declare class CacheLayer<T = {}> {
    items: BehaviorSubject<Array<T>>;
    name: string;
    config: CacheServiceConfigInterface;
    private map;
    static createCacheParams(config: any): void;
    get(name: any): T;
    constructor(layer: CacheLayerInterface);
    private initHook;
    private onExpireAll;
    private putItemHook;
    getItem(key: string): T;
    putItem(layerItem: T): T;
    private onExpire;
    removeItem(key: string): void;
    getItemObservable(key: string): Observable<T>;
    flushCache(): Observable<boolean>;
}
