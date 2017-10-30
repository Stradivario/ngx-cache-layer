import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
export class CacheLayer extends Map {
    /**
     * @param {?} layer
     */
    constructor(layer) {
        super();
        this.items = new BehaviorSubject([]);
        this.name = layer.name;
        this.config = layer.config;
        if (this.config.localStorage) {
            this.items.next([...this.items.getValue(), ...layer.items]);
        }
        this.initHook(layer);
    }
    /**
     * @param {?} config
     * @return {?}
     */
    static createCacheParams(config) {
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
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    initHook(layer) {
        this.onExpireAll(layer);
    }
    /**
     * @param {?} layer
     * @return {?}
     */
    onExpireAll(layer) {
        layer.items.forEach(item => this.onExpire(item['key']));
    }
    /**
     * @param {?} layerItem
     * @return {?}
     */
    putItemHook(layerItem) {
        this.onExpire(layerItem['key']);
    }
    /**
     * @param {?} key
     * @return {?}
     */
    getItem(key) {
        let /** @type {?} */ item = this.items.getValue().filter(item => item['key'] === key);
        if (!item.length) {
            return null;
        }
        else {
            return item[0];
        }
    }
    /**
     * @param {?} layerItem
     * @return {?}
     */
    putItem(layerItem) {
        if (this.config.localStorage) {
            localStorage.setItem(this.name, JSON.stringify(/** @type {?} */ ({
                config: this.config,
                name: this.name,
                items: [...this.items.getValue(), layerItem]
            })));
        }
        this.items.next([...this.items.getValue(), layerItem]);
        this.putItemHook(layerItem);
        return layerItem;
    }
    /**
     * @param {?} key
     * @return {?}
     */
    onExpire(key) {
        Observable
            .create(observer => observer.next())
            .timeoutWith(this.config.maxAge, Observable.of(1))
            .skip(1)
            .subscribe(observer => this.removeItem(key));
    }
    /**
     * @param {?} key
     * @return {?}
     */
    removeItem(key) {
        let /** @type {?} */ newLayerItems = this.items.getValue().filter(item => item['key'] !== key);
        if (this.config.localStorage) {
            const /** @type {?} */ newLayer = ({
                config: this.config,
                name: this.name,
                items: newLayerItems
            });
            localStorage.setItem(this.name, JSON.stringify(newLayer));
        }
        this.items.next(newLayerItems);
    }
}
function CacheLayer_tsickle_Closure_declarations() {
    /** @type {?} */
    CacheLayer.prototype.items;
    /** @type {?} */
    CacheLayer.prototype.name;
    /** @type {?} */
    CacheLayer.prototype.config;
}
// console.log(Array.from(this.keys())) 
