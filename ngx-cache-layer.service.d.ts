import { CacheLayer } from './ngx-cache-layer.layer';
import { BehaviorSubject } from 'rxjs/Rx';
import { CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem } from './ngx-cache-layer.interfaces';
export declare class CacheService {
    private config;
    cachedLayers: BehaviorSubject<Array<CacheLayer<CacheLayerItem<any>>>>;
    private static createCacheInstance<T>(layer);
    static isLocalStorageEnabled(): boolean;
    constructor(config: CacheServiceConfigInterface);
    getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>>;
    createLayer<T>(settings: CacheLayerInterface): CacheLayer<CacheLayerItem<T>>;
    removeLayer(layer: string): void;
    static getLayersFromLS(): Array<string>;
    private instanceHook(settings);
    private onExpire(layer);
}
