import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
var CacheLayer = (function () {
    /**
     * @param {?} layer
     */
    function CacheLayer(layer) {
        this.items = new BehaviorSubject([]);
        this.name = layer.name;
        this.config = layer.config;
        if (this.config.localStorage) {
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
     * @param {?} layer
     * @return {?}
     */
    CacheLayer.prototype.initHook = function (layer) {
        this.onExpireAll(layer);
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
        this.onExpire(layerItem['key']);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    CacheLayer.prototype.getItem = function (key) {
        var /** @type {?} */ item = this.items.getValue().filter(function (item) { return item['key'] === key; });
        if (!item.length) {
            return null;
        }
        else {
            return item[0];
        }
    };
    /**
     * @param {?} layerItem
     * @return {?}
     */
    CacheLayer.prototype.putItem = function (layerItem) {
        if (this.config.localStorage) {
            localStorage.setItem(this.name, JSON.stringify(/** @type {?} */ ({
                config: this.config,
                name: this.name,
                items: this.items.getValue().concat([layerItem])
            })));
        }
        this.items.next(this.items.getValue().concat([layerItem]));
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
        this.items.next(newLayerItems);
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
}
