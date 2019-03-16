import { ModuleWithProviders, InjectionToken } from '@angular/core';
import { CacheServiceConfigInterface } from './ngx-cache-layer.interfaces';
export declare const CACHE_MODULE_CONFIG: InjectionToken<CacheServiceConfigInterface>;
export declare const CACHE_MODULE_DI_CONFIG: CacheServiceConfigInterface;
export declare class CacheModule {
    static forRoot(config?: CacheServiceConfigInterface): ModuleWithProviders;
}
export * from './ngx-cache-layer.service';
export * from './ngx-cache-layer.instance';
export * from './ngx-cache-layer.interfaces';
