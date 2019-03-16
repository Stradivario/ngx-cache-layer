import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CacheService } from './ngx-cache-layer.service';
import { CacheServiceConfigInterface, CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG } from './ngx-cache-layer.interfaces';

@NgModule({
  providers: [CacheService]
})
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
export * from './ngx-cache-layer.instance';
export * from './ngx-cache-layer.interfaces';

