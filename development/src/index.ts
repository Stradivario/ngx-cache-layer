import {NgModule, ModuleWithProviders, InjectionToken} from '@angular/core';
import {CacheService} from './ngx-cache-layer.service';
import {CacheServiceConfigInterface} from './ngx-cache-layer.interfaces';

export const CACHE_MODULE_CONFIG = new InjectionToken< CacheServiceConfigInterface >( 'module.config' );

export const CACHE_MODULE_DI_CONFIG = <CacheServiceConfigInterface> {
  deleteOnExpire: 'aggressive',
  cacheFlushInterval: 60 * 60 * 1000,
  maxAge: 15 * 60 * 1000
};

@NgModule()
export class CacheModule {
  static forRoot(config?: CacheServiceConfigInterface): ModuleWithProviders {
    return {
      ngModule: CacheModule,
      providers: [
        { provide: CACHE_MODULE_CONFIG, useValue: config || CACHE_MODULE_DI_CONFIG },
        CacheService
      ]
    };
  }
}

export * from './ngx-cache-layer.service';
export * from './ngx-cache-layer.layer';
export * from './ngx-cache-layer.interfaces';

