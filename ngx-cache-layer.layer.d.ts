import { BehaviorSubject } from 'rxjs/Rx';
import { CacheLayerInterface, CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
export declare class CacheLayer<T> {
    items: BehaviorSubject<Array<T>>;
    name: string;
    config: CacheServiceConfigInterface;
    static createCacheParams(config: any): any;
    constructor(settings: CacheLayerInterface);
    private instanceHook(layerItem);
    getItem(key: string): T;
    putItem(layerItem: T): T;
    private onExpire(key);
    removeItem(key: string): void;
}
