import { NgModule, ModuleWithProviders } from '@angular/core';
import { CacheService } from './cache.service';
import { CacheServiceConfigInterface, CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG } from './cache.interfaces';

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

export * from './cache.service';
export * from './cache.instance';
export * from './cache.interfaces';

