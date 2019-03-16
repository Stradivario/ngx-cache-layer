define(["require", "exports", "rxjs", "rxjs/operators"], function (require, exports, rxjs_1, operators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FRIENDLY_ERROR_MESSAGES = {
        MISSING_OBSERVABLE_ITEM: "is missing from the layer misspelled name ? as soon as you provide correct name value will be emitted!"
    };
    var CacheLayerInstance = /** @class */ (function () {
        function CacheLayerInstance(layer) {
            var _this = this;
            this.items = new rxjs_1.BehaviorSubject([]);
            this.map = new Map();
            this.name = layer.name;
            this.config = layer.config;
            if (this.config.localStorage) {
                layer.items.forEach(function (item) { return _this.map.set(item['key'], item); });
                if (layer.items.constructor === rxjs_1.BehaviorSubject) {
                    layer.items = layer.items.getValue() || [];
                }
                this.items.next(this.items.getValue().concat(layer.items));
            }
            this.initHook(layer);
        }
        CacheLayerInstance.createCacheParams = function (config) {
            if (config.params.constructor === Object) {
                return; // Todo
            }
            else if (config.constructor === String) {
                return; // Todo
            }
            else if (config.params.constructor === Number) {
                return; // Todo
            }
            else if (config.params.constructor === Array) {
                return; // Todo
            }
        };
        CacheLayerInstance.prototype.get = function (name) {
            return this.map.get(name);
        };
        CacheLayerInstance.prototype.initHook = function (layer) {
            if (this.config.maxAge) {
                this.onExpireAll(layer);
            }
        };
        CacheLayerInstance.prototype.onExpireAll = function (layer) {
            var _this = this;
            layer.items.forEach(function (item) { return _this.onExpire(item['key']); });
        };
        CacheLayerInstance.prototype.putItemHook = function (layerItem) {
            if (this.config.maxAge) {
                this.onExpire(layerItem['key']);
            }
        };
        CacheLayerInstance.prototype.getItem = function (key) {
            if (this.map.has(key)) {
                return this.get(key);
            }
            else {
                return null;
            }
        };
        CacheLayerInstance.prototype.putItem = function (layerItem) {
            this.map.set(layerItem['key'], layerItem);
            var item = this.get(layerItem['key']);
            var filteredItems = this.items.getValue().filter(function (item) { return item['key'] !== layerItem['key']; });
            if (this.config.localStorage) {
                localStorage.setItem(this.name, JSON.stringify({
                    config: this.config,
                    name: this.name,
                    items: filteredItems.concat([item])
                }));
            }
            this.items.next(filteredItems.concat([item]));
            this.putItemHook(layerItem);
            return layerItem;
        };
        CacheLayerInstance.prototype.onExpire = function (key) {
            var _this = this;
            new rxjs_1.Observable(function (observer) { return observer.next(); })
                .pipe(operators_1.timeoutWith(this.config.maxAge, rxjs_1.of(1)), operators_1.skip(1)).subscribe(function () { return _this.removeItem(key); });
        };
        CacheLayerInstance.prototype.removeItem = function (key) {
            var newLayerItems = this.items.getValue().filter(function (item) { return item['key'] !== key; });
            if (this.config.localStorage) {
                var newLayer = {
                    config: this.config,
                    name: this.name,
                    items: newLayerItems
                };
                localStorage.setItem(this.name, JSON.stringify(newLayer));
            }
            this.map.delete(key);
            this.items.next(newLayerItems);
        };
        CacheLayerInstance.prototype.getItemObservable = function (key) {
            var _this = this;
            this.map.has(key) ? null : console.error("Key: " + key + " " + FRIENDLY_ERROR_MESSAGES.MISSING_OBSERVABLE_ITEM);
            return this.items.asObservable().pipe(operators_1.filter(function () { return _this.map.has(key); }), operators_1.map(function (res) { return res[0]; }));
        };
        CacheLayerInstance.prototype.flushCache = function () {
            var _this = this;
            return this.items.asObservable()
                .pipe(operators_1.map(function (items) {
                items.forEach(function (i) { return _this.removeItem(i['key']); });
                return true;
            }));
        };
        return CacheLayerInstance;
    }());
    exports.CacheLayerInstance = CacheLayerInstance;
});
// console.log(Array.from(this.keys()))
