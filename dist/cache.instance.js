"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
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
            // tslint:disable-next-line:no-string-literal
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
        // tslint:disable-next-line:no-string-literal
        layer.items.forEach(function (item) { return _this.onExpire(item['key']); });
    };
    CacheLayerInstance.prototype.putItemHook = function (layerItem) {
        if (this.config.maxAge) {
            // tslint:disable-next-line:no-string-literal
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
        // tslint:disable-next-line:no-string-literal
        this.map.set(layerItem['key'], layerItem);
        // tslint:disable-next-line:no-string-literal
        var item = this.get(layerItem['key']);
        // tslint:disable-next-line:no-string-literal
        var filteredItems = this.items.getValue().filter(function (i) { return i['key'] !== layerItem['key']; });
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
        // tslint:disable-next-line:no-string-literal
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
        if (this.map.has(key)) {
            console.error("Key: " + key + " " + FRIENDLY_ERROR_MESSAGES.MISSING_OBSERVABLE_ITEM);
        }
        return this.items.asObservable().pipe(operators_1.filter(function () { return _this.map.has(key); }), operators_1.map(function (res) { return res[0]; }));
    };
    CacheLayerInstance.prototype.flushCache = function () {
        var _this = this;
        return this.items.asObservable()
            .pipe(operators_1.map(function (items) {
            // tslint:disable-next-line:no-string-literal
            items.forEach(function (i) { return _this.removeItem(i['key']); });
            return true;
        }));
    };
    CacheLayerInstance.prototype.fetch = function (http, init, cache) {
        if (cache === void 0) { cache = true; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.config.localStorage && this.getItem(http) && cache) {
                            return [2 /*return*/, this.getItem(http)['data']];
                        }
                        return [4 /*yield*/, fetch(http)];
                    case 1: return [4 /*yield*/, (_a.sent()).json()];
                    case 2:
                        data = _a.sent();
                        if (cache) {
                            this.putItem({ key: http, data: data });
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return CacheLayerInstance;
}());
exports.CacheLayerInstance = CacheLayerInstance;
