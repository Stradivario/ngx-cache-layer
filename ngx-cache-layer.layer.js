import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
var /** @type {?} */ FRIENDLY_ERROR_MESSAGES = {
    MISSING_OBSERVABLE_ITEM: "is missing from the layer misspelled name ? as soon as you provide correct name value will be emitted!"
};
var CacheLayer = /** @class */ (function () {
    /**
     * @param {?} layer
     */
    function CacheLayer(layer) {
        var _this = this;
        this.items = new BehaviorSubject([]);
        this.map = new Map();
        this.name = layer.name;
        this.config = layer.config;
        if (this.config.localStorage) {
            layer.items.forEach(function (item) { return _this.map.set(item['key'], item); });
            if (layer.items.constructor === BehaviorSubject) {
                layer.items = layer.items.getValue() || [];
            }
            this.items.next(this.items.getValue().concat(layer.items));
        }
        this.initHook(layer);
    }
    /**
     * @param {?} config
     * @return {?}
     */
    CacheLayer.createCacheParams = function (config) {
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
    /**
     * @param {?} name
     * @return {?}
     */
    CacheLayer.prototype.get = function (name) {
        return this.map.get(name);
    };
    /**
     * @param {?} layer
     * @return {?}
     */
    CacheLayer.prototype.initHook = function (layer) {
        if (this.config.maxAge) {
            this.onExpireAll(layer);
        }
    };
    /**
     * @param {?} layer
     * @return {?}
     */
    CacheLayer.prototype.onExpireAll = function (layer) {
        var _this = this;
        layer.items.forEach(function (item) { return _this.onExpire(item['key']); });
    };
    /**
     * @param {?} layerItem
     * @return {?}
     */
    CacheLayer.prototype.putItemHook = function (layerItem) {
        if (this.config.maxAge) {
            this.onExpire(layerItem['key']);
        }
    };
    /**
     * @param {?} key
     * @return {?}
     */
    CacheLayer.prototype.getItem = function (key) {
        if (this.map.has(key)) {
            return this.get(key);
        }
        else {
            return null;
        }
    };
    /**
     * @param {?} layerItem
     * @return {?}
     */
    CacheLayer.prototype.putItem = function (layerItem) {
        this.map.set(layerItem['key'], layerItem);
        var /** @type {?} */ item = this.get(layerItem['key']);
        var /** @type {?} */ filteredItems = this.items.getValue().filter(function (item) { return item['key'] !== layerItem['key']; });
        if (this.config.localStorage) {
            localStorage.setItem(this.name, JSON.stringify(/** @type {?} */ ({
                config: this.config,
                name: this.name,
                items: filteredItems.concat([item])
            })));
        }
        this.items.next(filteredItems.concat([item]));
        this.putItemHook(layerItem);
        return layerItem;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    CacheLayer.prototype.onExpire = function (key) {
        var _this = this;
        Observable
            .create(function (observer) { return observer.next(); })
            .timeoutWith(this.config.maxAge, Observable.of(1))
            .skip(1)
            .subscribe(function (observer) { return _this.removeItem(key); });
    };
    /**
     * @param {?} key
     * @return {?}
     */
    CacheLayer.prototype.removeItem = function (key) {
        var /** @type {?} */ newLayerItems = this.items.getValue().filter(function (item) { return item['key'] !== key; });
        if (this.config.localStorage) {
            var /** @type {?} */ newLayer = ({
                config: this.config,
                name: this.name,
                items: newLayerItems
            });
            localStorage.setItem(this.name, JSON.stringify(newLayer));
        }
        this.map.delete(key);
        this.items.next(newLayerItems);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    CacheLayer.prototype.getItemObservable = function (key) {
        var _this = this;
        this.map.has(key) ? null : console.error("Key: " + key + " " + FRIENDLY_ERROR_MESSAGES.MISSING_OBSERVABLE_ITEM);
        return this.items.asObservable().filter(function () { return _this.map.has(key); }).map(function (res) { return res[0]; });
    };
    /**
     * @return {?}
     */
    CacheLayer.prototype.flushCache = function () {
        var _this = this;
        return this.items.asObservable()
            .map(function (items) {
            items.forEach(function (i) { return _this.removeItem(i['key']); });
            return true;
        });
    };
    return CacheLayer;
}());
export { CacheLayer };
function CacheLayer_tsickle_Closure_declarations() {
    /** @type {?} */
    CacheLayer.prototype.items;
    /** @type {?} */
    CacheLayer.prototype.name;
    /** @type {?} */
    CacheLayer.prototype.config;
    /** @type {?} */
    CacheLayer.prototype.map;
}
// console.log(Array.from(this.keys()))
