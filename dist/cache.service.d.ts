import { BehaviorSubject, Observable } from 'rxjs';
import { CacheLayerInstance } from './cache.instance';
import { CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem } from './cache.interfaces';
export declare class CacheService {
    private config;
    cachedLayers: BehaviorSubject<CacheLayerInstance<CacheLayerItem<any>>[]>;
    private map;
    static getsFromLS(): Array<string>;
    constructor(config: CacheServiceConfigInterface);
    static createCacheInstance<T>(cacheLayer: any): CacheLayerInstance<CacheLayerItem<T>>;
    static isLocalStorageUsable(): boolean;
    get<T>(name: string): CacheLayerInstance<CacheLayerItem<T>>;
    create<T>(layer: CacheLayerInterface): CacheLayerInstance<CacheLayerItem<T>>;
    private LayerHook;
    private protectLayerFromInvaders;
    private OnExpire;
    remove<T>(layerInstance: CacheLayerInstance<CacheLayerItem<T>>): void;
    transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayerInstance<CacheLayerItem<any>>[];
    flushCache(force?: boolean): Observable<boolean>;
}
