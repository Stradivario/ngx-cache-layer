var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CacheService } from './cache.service';
import { CACHE_MODULE_CONFIG, CACHE_MODULE_DI_CONFIG } from './cache.interfaces';
var CacheModule = /** @class */ (function () {
    function CacheModule() {
    }
    CacheModule_1 = CacheModule;
    CacheModule.forRoot = function (config) {
        return {
            ngModule: CacheModule_1,
            providers: [
                { provide: CACHE_MODULE_CONFIG, useValue: config || CACHE_MODULE_DI_CONFIG },
                CacheService
            ]
        };
    };
    var CacheModule_1;
    CacheModule = CacheModule_1 = __decorate([
        NgModule({
            providers: [CacheService]
        })
    ], CacheModule);
    return CacheModule;
}());
export { CacheModule };
export * from './cache.service';
export * from './cache.instance';
export * from './cache.interfaces';
