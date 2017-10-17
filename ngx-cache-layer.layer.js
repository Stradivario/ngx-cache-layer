import { BehaviorSubject } from 'rxjs/Rx';
var CacheLayer = (function () {
    /**
     * @param {?} i
     */
    function CacheLayer(i) {
        this.items = new BehaviorSubject([]);
        this.layer = i.layer;
        this.config = i.config;
        if (this.config.localStorage) {
            this.items.next(this.items.getValue().concat(i.items));
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
            var /** @type {?} */ layer = (JSON.parse(localStorage.getItem(this.layer)));
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
            var /** @type {?} */ layer = (JSON.parse(localStorage.getItem(this.layer)));
            if (layer) {
                layer.items = this.items.getValue().concat([layerItem]);
                localStorage.setItem(this.layer, JSON.stringify(layer));
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
        var /** @type {?} */ self = this;
        setTimeout(function () {
            self.removeItem(key);
        }, this.config.maxAge);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    CacheLayer.prototype.removeItem = function (key) {
        var /** @type {?} */ newLayerItems = this.items.getValue().filter(function (item) { return item['key'] !== key; });
        if (this.config.localStorage) {
            var /** @type {?} */ oldLayer = (JSON.parse(localStorage.getItem(this.layer)));
            if (oldLayer) {
                var /** @type {?} */ newLayer = ({
                    config: this.config,
                    layer: this.layer,
                    items: newLayerItems
                });
                localStorage.setItem(this.layer, JSON.stringify(newLayer));
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
    CacheLayer.prototype.layer;
    /** @type {?} */
    CacheLayer.prototype.config;
}
