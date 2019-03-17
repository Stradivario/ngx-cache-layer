"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var CacheModule_1;
const core_1 = require("@angular/core");
const cache_service_1 = require("./cache.service");
const cache_interfaces_1 = require("./cache.interfaces");
let CacheModule = CacheModule_1 = class CacheModule {
    static forRoot(config) {
        return {
            ngModule: CacheModule_1,
            providers: [
                { provide: cache_interfaces_1.CACHE_MODULE_CONFIG, useFactory: () => config || cache_interfaces_1.CACHE_MODULE_DI_CONFIG },
                cache_service_1.CacheService
            ]
        };
    }
};
CacheModule = CacheModule_1 = __decorate([
    core_1.NgModule({
        providers: [cache_service_1.CacheService]
    })
], CacheModule);
exports.CacheModule = CacheModule;
__export(require("./cache.service"));
__export(require("./cache.instance"));
__export(require("./cache.interfaces"));
