import { ErrorType } from "../stuff/error.types";
import { EventEmitter } from "@angular/core";
import { HttpClient } from "../stuff/http.client";
import { Utils } from "../stuff/utils";
import { Config } from "../aws/config";
export var AbstractService = (function () {
    function AbstractService(utils, accessProvider, http, instance) {
        this.utils = utils;
        this.accessProvider = accessProvider;
        this.instance = instance;
        this.timeKeeper = new Date();
        this.cache = new Map();
        this.onCreate = new EventEmitter();
        this.onUpdate = new EventEmitter();
        this.onDelete = new EventEmitter();
        this.httpClient = new HttpClient(utils, accessProvider, http, instance);
        this.lastCacheClearMillis = this.timeKeeper.getMilliseconds();
    }
    /**
     * Override this to make the cache last longer or shorter periods.
     * @returns {number} The number of milliseconds after which cache should be eliminated.
     */
    AbstractService.prototype.maxCacheAge = function () {
        return AbstractService.DEFAULT_CACHE_AGE;
    };
    AbstractService.prototype.reset = function () {
        this.cache.clear();
    };
    AbstractService.prototype.get = function (id, dontuseCache) {
        var _this = this;
        this.checkGate();
        Utils.throwIfNull(id);
        var tryuseCache = !dontuseCache;
        if (tryuseCache) {
            var cachedResult = this.getCached(id);
            if (cachedResult) {
                return Promise.resolve(cachedResult);
            }
        }
        return this.httpClient.get(this.getPath(), id)
            .then(function (value) {
            _this.updateCache(value, _this.getPath(), id);
            return value;
        });
    };
    AbstractService.prototype.list = function (dontuseCache) {
        var _this = this;
        this.checkGate();
        var tryuseCache = !dontuseCache;
        if (tryuseCache) {
            var cachedResult = this.listCached();
            if (cachedResult) {
                return Promise.resolve(cachedResult);
            }
        }
        return this.httpClient.list(this.getPath())
            .then(function (value) {
            _this.updateCache(value, _this.getPath());
            return value;
        });
    };
    AbstractService.prototype.getCached = function (id) {
        return this.getCachedValue(this.getPath(), id);
    };
    AbstractService.prototype.listCached = function () {
        return this.getCachedValue(this.getPath());
    };
    AbstractService.prototype.create = function (member) {
        var _this = this;
        this.checkGate();
        Utils.throwIfNull(member);
        return this.httpClient.post(this.getPath(), member)
            .then(function (value) {
            _this.updateCache(value, _this.getPath(), _this.getId(value));
            _this.deleteCachedValue(_this.getPath());
            _this.onCreate.emit(value);
            return value;
        });
    };
    AbstractService.prototype.update = function (member) {
        var _this = this;
        this.checkGate();
        Utils.throwIfAnyNull([member, this.getId(member)]);
        return this.httpClient.put(this.getPath(), this.getId(member), member)
            .then(function (value) {
            _this.updateCache(value, _this.getPath(), _this.getId(value));
            _this.deleteCachedValue(_this.getPath());
            _this.onUpdate.emit(value);
            return value;
        });
    };
    AbstractService.prototype.delete = function (id) {
        var _this = this;
        this.checkGate();
        return this.httpClient.delete(this.getPath(), id)
            .then(function () {
            _this.deleteCachedValue(_this.getPath(), id);
            _this.deleteCachedValue(_this.getPath());
            _this.onDelete.emit(id);
            return true;
        });
    };
    AbstractService.prototype.getInstance = function () {
        return this.instance;
    };
    AbstractService.prototype.checkGate = function () {
        if (!this.inMockMode() && !this.accessProvider.supposedToBeLoggedIn()) {
            ErrorType.throwNotLoggedIn();
        }
    };
    AbstractService.prototype.inMockMode = function () {
        return Config.isMockData(this.getInstance());
    };
    AbstractService.prototype.updateCache = function (value) {
        var pathElements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            pathElements[_i - 1] = arguments[_i];
        }
        this.cache.set(pathElements.join(), value);
    };
    AbstractService.prototype.getCachedValue = function () {
        var pathElements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pathElements[_i - 0] = arguments[_i];
        }
        if (this.cacheMaxAgeExceeded()) {
            this.clearCache();
            return null;
        }
        return this.cache.get(pathElements.join());
    };
    AbstractService.prototype.clearCache = function () {
        this.cache.clear();
        this.lastCacheClearMillis = this.timeKeeper.getMilliseconds();
    };
    AbstractService.prototype.deleteCachedValue = function () {
        var pathElements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pathElements[_i - 0] = arguments[_i];
        }
        this.cache.delete(pathElements.join());
    };
    AbstractService.prototype.cacheMaxAgeExceeded = function () {
        var nowMillis = this.timeKeeper.getMilliseconds();
        return (nowMillis - this.lastCacheClearMillis) > this.maxCacheAge();
    };
    AbstractService.DEFAULT_CACHE_AGE = 10 * 60 * 1000; // 10 minutes.
    return AbstractService;
}());
//# sourceMappingURL=abstract.service.js.map
