import { InjectionToken } from '@angular/core';
export interface CacheLayerItem<T> {
    key: string;
    data: T;
}
export declare class CacheServiceConfigInterface {
    deleteOnExpire?: 'aggressive' | string;
    cacheFlushInterval?: number | null;
    localStorage?: boolean;
    createdAt?: string;
}
export interface CacheLayerInterface {
    name: string;
    config?: CacheServiceConfigInterface;
    items?: any;
    key?: string;
    createdAt?: number;
}
export declare const CACHE_MODULE_CONFIG: InjectionToken<CacheServiceConfigInterface>;
export declare const CACHE_MODULE_DI_CONFIG: CacheServiceConfigInterface;
