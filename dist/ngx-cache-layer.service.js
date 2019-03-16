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
define(["require", "exports", "@angular/core", "rxjs", "./ngx-cache-layer.instance", "./ngx-cache-layer.interfaces", "rxjs/operators"], function (require, exports, core_1, rxjs_1, ngx_cache_layer_instance_1, ngx_cache_layer_interfaces_1, operators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var INTERNAL_PROCEDURE_CACHE_NAME = 'cache_layers';
    var FRIENDLY_ERROR_MESSAGES = {
        TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: ',
        // tslint:disable-next-line:max-line-length
        LOCAL_STORAGE_DISABLED: 'LocalStorage is disabled switching to regular in-memory storage.Please relate issue if you think it is enabled and there is a problem with the library itself.'
    };
    var CacheService = /** @class */ (function () {
        function CacheService(config) {
            var _this = this;
            this.config = config;
            this.cachedLayers = new rxjs_1.BehaviorSubject([]);
            this.map = new Map();
            if (this.config.localStorage && CacheService.isLocalStorageUsable()) {
                var layers = JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
                if (layers) {
                    layers.forEach(function (layer) {
                        var cachedLayer = JSON.parse(localStorage.getItem(layer));
                        if (cachedLayer) {
                            _this.createLayer(cachedLayer);
                        }
                    });
                }
                else {
                    localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify([]));
                }
            }
        }
        CacheService.getLayersFromLS = function () {
            return JSON.parse(localStorage.getItem(INTERNAL_PROCEDURE_CACHE_NAME));
        };
        CacheService.createCacheInstance = function (cacheLayer) {
            return new ngx_cache_layer_instance_1.CacheLayerInstance(cacheLayer);
        };
        CacheService.isLocalStorageUsable = function () {
            var error = [];
            try {
                localStorage.setItem('test-key', JSON.stringify({ key: 'test-object' }));
                localStorage.removeItem('test-key');
            }
            catch (e) {
                error.push(e);
                console.log(FRIENDLY_ERROR_MESSAGES.LOCAL_STORAGE_DISABLED);
            }
            return error.length ? false : true;
        };
        CacheService.prototype.getLayer = function (name) {
            var exists = this.map.has(name);
            if (!exists) {
                return this.createLayer({ name: name });
            }
            return this.map.get(name);
        };
        CacheService.prototype.createLayer = function (layer) {
            var exists = this.map.has(layer.name);
            if (exists) {
                return this.map.get(layer.name);
            }
            layer.items = layer.items || [];
            layer.config = layer.config || this.config || ngx_cache_layer_interfaces_1.CACHE_MODULE_DI_CONFIG;
            var cacheLayer = CacheService.createCacheInstance(layer);
            if (layer.config.localStorage && CacheService.isLocalStorageUsable()) {
                // tslint:disable-next-line:max-line-length
                localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(function (l) { return l !== cacheLayer.name; }).concat([cacheLayer.name])));
                localStorage.setItem(cacheLayer.name, JSON.stringify(layer));
            }
            this.map.set(cacheLayer.name, cacheLayer);
            this.cachedLayers.next(this.cachedLayers.getValue().concat([cacheLayer]));
            this.LayerHook(cacheLayer);
            return cacheLayer;
        };
        CacheService.prototype.LayerHook = function (layerInstance) {
            this.protectLayerFromInvaders(layerInstance);
            if (layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval) {
                this.OnExpire(layerInstance);
            }
        };
        CacheService.prototype.protectLayerFromInvaders = function (cacheLayer) {
            cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
            cacheLayer.items.constructor.prototype.unsubscribe = function () {
                console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
            };
        };
        CacheService.prototype.OnExpire = function (layerInstance) {
            var _this = this;
            new rxjs_1.Observable(function (observer) { return observer.next(); }).
                pipe(operators_1.timeoutWith(layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval, rxjs_1.of(1)), operators_1.skip(1)).subscribe(function () { return _this.removeLayer(layerInstance); });
        };
        CacheService.prototype.removeLayer = function (layerInstance) {
            this.map.delete(layerInstance.name);
            if (this.config.localStorage) {
                localStorage.removeItem(layerInstance.name);
                // tslint:disable-next-line:max-line-length
                localStorage.setItem(INTERNAL_PROCEDURE_CACHE_NAME, JSON.stringify(CacheService.getLayersFromLS().filter(function (layer) { return layer !== layerInstance.name; })));
            }
            this.cachedLayers.next(this.cachedLayers.getValue().filter(function (layer) { return layer.name !== layerInstance.name; }).slice());
        };
        CacheService.prototype.transferItems = function (name, newCacheLayers) {
            var _this = this;
            var oldLayer = this.getLayer(name);
            var newLayers = [];
            newCacheLayers.forEach(function (layerName) {
                var newLayer = _this.createLayer(layerName);
                oldLayer.items.getValue().forEach(function (item) { return newLayer.putItem(item); });
                newLayers.push(newLayer);
            });
            return newLayers;
        };
        CacheService.prototype.flushCache = function (force) {
            var _this = this;
            var oldLayersNames;
            return this.cachedLayers.pipe(operators_1.take(1), operators_1.map(function (layers) {
                oldLayersNames = layers.map(function (l) { return l.name; });
                layers.forEach(function (layer) { return _this.removeLayer(layer); });
                if (force) {
                    localStorage.removeItem(INTERNAL_PROCEDURE_CACHE_NAME);
                }
                else {
                    oldLayersNames.forEach(function (l) { return _this.createLayer({ name: l }); });
                }
                return true;
            }));
        };
        CacheService = __decorate([
            __param(0, core_1.Inject(ngx_cache_layer_interfaces_1.CACHE_MODULE_CONFIG)),
            __metadata("design:paramtypes", [ngx_cache_layer_interfaces_1.CacheServiceConfigInterface])
        ], CacheService);
        return CacheService;
    }());
    exports.CacheService = CacheService;
});
