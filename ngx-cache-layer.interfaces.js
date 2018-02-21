var CacheServiceConfigInterface = /** @class */ (function () {
    function CacheServiceConfigInterface() {
        this.deleteOnExpire = 'aggressive';
        this.cacheFlushInterval = 60 * 60 * 1000;
        this.maxAge = 15 * 60 * 1000;
        this.localStorage = false;
    }
    return CacheServiceConfigInterface;
}());
export { CacheServiceConfigInterface };
function CacheServiceConfigInterface_tsickle_Closure_declarations() {
    /** @type {?} */
    CacheServiceConfigInterface.prototype.deleteOnExpire;
    /** @type {?} */
    CacheServiceConfigInterface.prototype.cacheFlushInterval;
    /** @type {?} */
    CacheServiceConfigInterface.prototype.maxAge;
    /** @type {?} */
    CacheServiceConfigInterface.prototype.localStorage;
}
