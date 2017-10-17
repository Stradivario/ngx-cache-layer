import { BehaviorSubject, Observable } from 'rxjs/Rx';
var CacheLayer = (function () {
    /**
     * @param {?} settings
     */
    function CacheLayer(settings) {
        this.items = new BehaviorSubject([]);
        this.name = settings.name;
        this.config = settings.config;
        if (this.config.localStorage) {
            this.items.next(this.items.getValue().concat(settings.items));
        }
    }
    /**
     * @param {?} config
     * @return {?}
     */
    CacheLayer.createCacheParams = function (config) {
        var /** @type {?} */ arrayParams = [], /** @type {?} */ data;
        if (config) {
            config.forEach(function (param) {
                arrayParams.push(config.params[param]);
                data = config.key + '/' + arrayParams.toString().replace(/[ ]*,[ ]*|[ ]+/g, '/');
            });
        }
        else {
            data = config.key;
        }
        return data;
    };
    /**
     * @param {?} layerItem
     * @return {?}
     */
    CacheLayer.prototype.instanceHook = function (layerItem) {
        this.onExpire(layerItem['key']);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    CacheLayer.prototype.getItem = function (key) {
        var /** @type {?} */ item = this.items.getValue().filter(function (i) { return i['key'] === key; });
        if (this.config.localStorage) {
            var /** @type {?} */ layer = (JSON.parse(localStorage.getItem(this.name)));
            if (layer) {
                item = layer.items.filter(function (i) { return i['key'] === key; });
            }
        }
        if (!item.length) {
            throw new Error('Missing item with key: ' + key);
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
            var /** @type {?} */ layer = (JSON.parse(localStorage.getItem(this.name)));
            if (layer) {
                layer.items = this.items.getValue().concat([layerItem]);
                localStorage.setItem(this.name, JSON.stringify(layer));
            }
        }
        this.items.next(this.items.getValue().concat([layerItem]));
        this.instanceHook(layerItem);
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
            var /** @type {?} */ oldLayer = (JSON.parse(localStorage.getItem(this.name)));
            if (oldLayer) {
                var /** @type {?} */ newLayer = ({
                    config: this.config,
                    name: this.name,
                    items: newLayerItems
                });
                localStorage.setItem(this.name, JSON.stringify(newLayer));
            }
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
