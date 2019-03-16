var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@angular/core", "./cache.service", "./cache.interfaces", "./cache.service", "./cache.instance", "./cache.interfaces"], function (require, exports, core_1, cache_service_1, cache_interfaces_1, cache_service_2, cache_instance_1, cache_interfaces_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    var CacheModule = /** @class */ (function () {
        function CacheModule() {
        }
        CacheModule_1 = CacheModule;
        CacheModule.forRoot = function (config) {
            return {
                ngModule: CacheModule_1,
                providers: [
                    { provide: cache_interfaces_1.CACHE_MODULE_CONFIG, useValue: config || cache_interfaces_1.CACHE_MODULE_DI_CONFIG },
                    cache_service_1.CacheService
                ]
            };
        };
        var CacheModule_1;
        CacheModule = CacheModule_1 = __decorate([
            core_1.NgModule({
                providers: [cache_service_1.CacheService]
            })
        ], CacheModule);
        return CacheModule;
    }());
    exports.CacheModule = CacheModule;
    __export(cache_service_2);
    __export(cache_instance_1);
    __export(cache_interfaces_2);
});
