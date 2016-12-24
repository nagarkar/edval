import { Injectable } from "@angular/core";
import { Utils } from "../stuff/utils";
export var Config = (function () {
    function Config() {
    }
    Object.defineProperty(Config, "baseUrl", {
        get: function () {
            return Config._baseUrl;
        },
        set: function (url) {
            Config._baseUrl = url;
            Utils.log("BaseUrl set to {0} and pingUrl set to {1}", url, Config.pingUrl);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config, "pingUrl", {
        get: function () {
            return Config._baseUrl + "/api/ping";
        },
        enumerable: true,
        configurable: true
    });
    Config.isMockData = function (obj) {
        return Config.MOCK_DATA.get(Utils.getObjectName(obj));
    };
    Config.setUseMockData = function (obj, state) {
        Config.MOCK_DATA.set(Utils.getObjectName(obj), state);
    };
    Config.flipMockData = function (obj) {
        Config.MOCK_DATA.set(Utils.getObjectName(obj), !Config.isMockData(obj));
    };
    Config.useMockData = function (obj) {
        Config.MOCK_DATA.set(Utils.getObjectName(obj), true);
    };
    Config.useLiveData = function (obj) {
        Config.MOCK_DATA.set(Utils.getObjectName(obj), false);
    };
    Config._baseUrl = "http://localhost:8090";
    /* TODO this should not be hardcoded */
    Config.CUSTOMERID = "";
    Config.TIME_OUT_AFTER_SURVEY = 10000;
    Config.POOL_DATA = {
        UserPoolId: 'us-east-1_WRjTRJPkD',
        ClientId: 's8koda3rkc3rsjt3fdlvdnvia' // Your client metricId here
    };
    Config.REFRESH_ACCESS_TOKEN = 30 * 60 * 1000;
    Config.MOCK_DATA = new Map([
        ["Session", true],
        ["Metric", true],
        ["Account", true],
        ["Staff", true],
        ["Survey", true]
    ]);
    Config.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Config.ctorParameters = [];
    return Config;
}());
//# sourceMappingURL=config.js.map