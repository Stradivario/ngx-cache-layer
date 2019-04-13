"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const FRIENDLY_ERROR_MESSAGES = {
    MISSING_OBSERVABLE_ITEM: `is missing from the layer misspelled name ? as soon as you provide correct name value will be emitted!`
};
class CacheLayerInstance {
    constructor(layer) {
        this.items = new rxjs_1.BehaviorSubject([]);
        this.map = new Map();
        this.name = layer.name;
        this.config = layer.config;
        this.createdAt = layer.createdAt;
        if (this.config.localStorage) {
            // tslint:disable-next-line:no-string-literal
            layer.items.forEach(item => this.map.set(item['key'], item));
            if (layer.items.constructor === rxjs_1.BehaviorSubject) {
                layer.items = layer.items.getValue() || [];
            }
            this.items.next([...this.items.getValue(), ...layer.items]);
        }
        this.initHook(layer);
    }
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
    initHook(layer) {
        if (this.config.cacheFlushInterval) {
            this.onExpireAll(layer);
        }
    }
    onExpireAll(layer) {
        // tslint:disable-next-line:no-string-literal
        layer.items.forEach(item => this.onExpire(item['key']));
    }
    putHook(layerItem) {
        if (this.config.cacheFlushInterval) {
            // tslint:disable-next-line:no-string-literal
            this.onExpire(layerItem['key']);
        }
    }
    get(key) {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        else {
            return null;
        }
    }
    put(layerItem) {
        // tslint:disable-next-line:no-string-literal
        this.map.set(layerItem['key'], layerItem);
        // tslint:disable-next-line:no-string-literal
        const item = this.map.get(layerItem['key']);
        // tslint:disable-next-line:no-string-literal
        const filteredItems = this.items.getValue().filter(i => i['key'] !== layerItem['key']);
        if (this.config.localStorage) {
            localStorage.setItem(this.name, JSON.stringify({
                createdAt: this.createdAt,
                config: this.config,
                name: this.name,
                items: [...filteredItems, item]
            }));
        }
        this.items.next([...filteredItems, item]);
        this.putHook(layerItem);
        return layerItem;
    }
    onExpire(key) {
        new rxjs_1.Observable(observer => observer.next())
            .pipe(operators_1.timeoutWith(this.config.cacheFlushInterval, rxjs_1.of(1)), operators_1.skip(1)).subscribe(() => this.removeItem(key));
    }
    removeItem(key) {
        // tslint:disable-next-line:no-string-literal
        const newLayerItems = this.items.getValue().filter(item => item['key'] !== key);
        if (this.config.localStorage) {
            const newLayer = {
                config: this.config,
                name: this.name,
                items: newLayerItems
            };
            localStorage.setItem(this.name, JSON.stringify(newLayer));
        }
        this.map.delete(key);
        this.items.next(newLayerItems);
    }
    asObservable(key) {
        if (this.map.has(key)) {
            console.error(`Key: ${key} ${FRIENDLY_ERROR_MESSAGES.MISSING_OBSERVABLE_ITEM}`);
        }
        return this.items.asObservable().pipe(operators_1.filter(() => this.map.has(key)), operators_1.map(res => res[0]));
    }
    flushCache() {
        return this.items.asObservable()
            .pipe(operators_1.map(items => {
            // tslint:disable-next-line:no-string-literal
            items.forEach(i => this.removeItem(i['key']));
            return true;
        }));
    }
    fetch(http, init, cache = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.config.localStorage && this.get(http) && cache) {
                // tslint:disable-next-line:no-string-literal
                return this.get(http)['data'];
            }
            const data = yield (yield fetch(http)).json();
            if (cache) {
                this.put({ key: http, data });
            }
            return data;
        });
    }
}
exports.CacheLayerInstance = CacheLayerInstance;
