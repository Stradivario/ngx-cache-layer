import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CacheLayer } from './ngx-cache-layer.layer';
import { CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem } from './ngx-cache-layer.interfaces';
export declare class CacheService {
    private config;
    cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]>;
    private static createCacheInstance<T>(name);
    static isLocalStorageUsable(): boolean;
    constructor(config: CacheServiceConfigInterface);
    private createLayerHook<T>(layerInstance);
    getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>>;
    createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>>;
    removeLayer(name: string): void;
    static getLayersFromLS(): Array<string>;
    private protectLayerFromInvaders<T>(cacheLayer);
    private onExpire(name);
}
