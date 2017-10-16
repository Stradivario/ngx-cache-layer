import { BehaviorSubject } from 'rxjs/Rx';
import { CacheLayerInterface, CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
export declare class CacheLayer<T> {
    items: BehaviorSubject<Array<T>>;
    layer: string;
    config: CacheServiceConfigInterface;
    static createCacheParams(config: any): any;
    constructor(i: CacheLayerInterface);
    private instanceHook(layerItem);
    get(key: string): T;
    put(layerItem: T): T;
    private onExpire(key);
    removeItem(key: string): void;
}
