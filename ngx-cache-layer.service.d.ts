import { CacheLayer } from './ngx-cache-layer.layer';
import { BehaviorSubject } from 'rxjs/Rx';
import { CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem } from './ngx-cache-layer.interfaces';
export declare class CacheService {
    private config;
    cachedLayers: BehaviorSubject<Array<CacheLayer<CacheLayerItem<any>>>>;
    private static createCacheInstance<T>(layer);
    static isLocalStorageEnabled(): boolean;
    constructor(config: CacheServiceConfigInterface);
    get<T>(name: string): CacheLayer<CacheLayerItem<T>>;
    create<T>(settings: CacheLayerInterface): CacheLayer<CacheLayerItem<T>>;
    remove(layer: string): void;
    static getLayersFromLS(): Array<string>;
}
