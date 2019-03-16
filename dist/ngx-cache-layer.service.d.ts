import { BehaviorSubject, Observable } from 'rxjs';
import { CacheLayerInstance } from './ngx-cache-layer.instance';
import { CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem } from './ngx-cache-layer.interfaces';
export declare class CacheService {
    private config;
    cachedLayers: BehaviorSubject<CacheLayerInstance<CacheLayerItem<any>>[]>;
    private map;
    static getLayersFromLS(): Array<string>;
    constructor(config: CacheServiceConfigInterface);
    static createCacheInstance<T>(cacheLayer: any): CacheLayerInstance<CacheLayerItem<T>>;
    static isLocalStorageUsable(): boolean;
    getLayer<T>(name: string): CacheLayerInstance<CacheLayerItem<T>>;
    createLayer<T>(layer: CacheLayerInterface): CacheLayerInstance<CacheLayerItem<T>>;
    private LayerHook;
    private protectLayerFromInvaders;
    private OnExpire;
    removeLayer<T>(layerInstance: CacheLayerInstance<CacheLayerItem<T>>): void;
    transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayerInstance<CacheLayerItem<any>>[];
    flushCache(force?: boolean): Observable<boolean>;
}
