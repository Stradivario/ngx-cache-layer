import { CacheLayerInterface, CacheServiceConfigInterface } from './cache.interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
export declare class CacheLayerInstance<T = {}> {
    items: BehaviorSubject<Array<T>>;
    name: string;
    config: CacheServiceConfigInterface;
    createdAt: number;
    private map;
    static createCacheParams(config: any): void;
    constructor(layer: CacheLayerInterface);
    private initHook;
    private onExpireAll;
    private putHook;
    get(key: string): T;
    put(layerItem: any): T;
    private onExpire;
    removeItem(key: string): void;
    asObservable(key: string): Observable<T>;
    flushCache(): Observable<boolean>;
    fetch<K>(http: string, init?: RequestInit, cache?: boolean): Promise<K>;
}
