"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var CacheService_1;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const cache_instance_1 = require("./cache.instance");
const cache_interfaces_1 = require("./cache.interfaces");
const operators_1 = require("rxjs/operators");
const INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';
const FRIENDLY_ERROR_MESSAGES = {
    TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: ',
    // tslint:disable-next-line:max-line-length
    LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled switching to regular in-memory storage.Please relate issue if you think it is enabled and there is a problem with the library itself.'
};
let CacheService = CacheService_1 = class CacheService {
    constructor(config) {
        this.config = config;
        this.cachedLayers = new rxjs_1.BehaviorSubject([]);
        this.map = new Map();
        if (this.config.localStorage && CacheService_1.isLocalStorageUsable()) {
            const layers = JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
            if (layers) {
                layers.forEach(layer => {
                    const cachedLayer = JSON.parse(localStorage.getItem(layer));
                    if (cachedLayer) {
                        this.create(cachedLayer);
                    }
                });
            }
            else {
                localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([]));
            }
        }
    }
    static getsFromLS() {
        return JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
    }
    static createCacheInstance(cacheLayer) {
        return new cache_instance_1.CacheLayerInstance(cacheLayer);
    }
    static isLocalStorageUsable() {
        const error = [];
        try {
            localStorage.setItem('test-key', JSON.stringify({ key: 'test-object' }));
            localStorage.removeItem('test-key');
        }
        catch (e) {
            error.push(e);
            console.log(FRIENDLY_ERROR_MESSAGES.LOCAL_STORAGE_DISABLED);
        }
        return error.length ? false : true;
    }
    get(name) {
        const exists = this.map.has(name);
        if (!exists) {
            return this.create({ name });
        }
        return this.map.get(name);
    }
    create(layer) {
        const exists = this.map.has(layer.name);
        if (exists) {
            return this.map.get(layer.name);
        }
        layer.items = layer.items || [];
        layer.config = layer.config || this.config || cache_interfaces_1.CACHE_MODULE_DI_CONFIG;
        const cacheLayer = CacheService_1.createCacheInstance(layer);
        if (layer.config.localStorage && CacheService_1.isLocalStorageUsable()) {
            // tslint:disable-next-line:max-line-length
            localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([...CacheService_1.getsFromLS().filter(l => l !== cacheLayer.name), cacheLayer.name]));
            localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
        }
        this.map.set(cacheLayer.name, cacheLayer);
        this.cachedLayers.next([...this.cachedLayers.getValue(), cacheLayer]);
        this.LayerHook(cacheLayer);
        return cacheLayer;
    }
    LayerHook(layerInstance) {
        this.protectLayerFromInvaders(layerInstance);
        if (layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval) {
            this.OnExpire(layerInstance);
        }
    }
    protectLayerFromInvaders(cacheLayer) {
        cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
        cacheLayer.items.constructor.prototype.unsubscribe = () => {
            console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
        };
    }
    OnExpire(layerInstance) {
        new rxjs_1.Observable(observer => observer.next()).
            pipe(operators_1.timeoutWith(layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval, rxjs_1.of(1)), operators_1.skip(1)).subscribe(() => this.remove(layerInstance));
    }
    remove(layerInstance) {
        this.map.delete(layerInstance.name);
        if (this.config.localStorage) {
            localStorage.removeItem(layerInstance.name);
            // tslint:disable-next-line:max-line-length
            localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService_1.getsFromLS().filter(layer => layer !== layerInstance.name)));
        }
        this.cachedLayers.next([...this.cachedLayers.getValue().filter(layer => layer.name !== layerInstance.name)]);
    }
    transferItems(name, newCacheLayers) {
        const oldLayer = this.get(name);
        const newLayers = [];
        newCacheLayers.forEach(layerName => {
            const newLayer = this.create(layerName);
            oldLayer.items.getValue().forEach(item => newLayer.put(item));
            newLayers.push(newLayer);
        });
        return newLayers;
    }
    flushCache(force) {
        let oldLayersNames;
        return this.cachedLayers.pipe(operators_1.take(1), operators_1.map(layers => {
            oldLayersNames = layers.map(l => l.name);
            layers.forEach(layer => this.remove(layer));
            if (force) {
                localStorage.removeItem(INTERNAL_PROCEDURE_CACHE_NAME);
            }
            else {
                oldLayersNames.forEach((l) => this.create({ name: l }));
            }
            return true;
        }));
    }
};
CacheService = CacheService_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(cache_interfaces_1.CACHE_MODULE_CONFIG)),
    __metadata("design:paramtypes", [cache_interfaces_1.CacheServiceConfigInterface])
], CacheService);
exports.CacheService = CacheService;
