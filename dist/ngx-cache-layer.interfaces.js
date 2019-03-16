define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CacheServiceConfigInterface = /** @class */ (function () {
        function CacheServiceConfigInterface() {
            this.deleteOnExpire = 'aggressive';
            this.cacheFlushInterval = 60 * 60 * 1000;
            this.maxAge = 15 * 60 * 1000;
            this.localStorage = false;
        }
        return CacheServiceConfigInterface;
    }());
    exports.CacheServiceConfigInterface = CacheServiceConfigInterface;
});
