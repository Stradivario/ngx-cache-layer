import { ModuleWithProviders } from '@angular/core';
import { CacheServiceConfigInterface } from './cache.interfaces';
export declare class CacheModule {
    static forRoot(config?: CacheServiceConfigInterface): ModuleWithProviders;
}
export * from './cache.service';
export * from './cache.instance';
export * from './cache.interfaces';
