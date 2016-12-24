var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { AbstractService } from "../../shared/service/abstract.service";
import { Config } from "../../shared/aws/config";
import { Utils } from "../../shared/stuff/utils";
import { AccessTokenService } from "../../shared/aws/access.token.service";
import { Injectable } from "@angular/core";
import { Metric } from "./schema";
import { Http } from "@angular/http";
export var LiveMetricService = (function (_super) {
    __extends(LiveMetricService, _super);
    function LiveMetricService(utils, http, accessProvider) {
        _super.call(this, utils, accessProvider, http, new Metric());
        Utils.log("Created LiveSessionService: " + typeof this);
    }
    LiveMetricService.prototype.getPath = function () {
        return "/api/customers" + "/" + Config.CUSTOMERID + "/metric";
    };
    LiveMetricService.prototype.getId = function (member) {
        return member.metricId;
    };
    LiveMetricService.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.list();
    };
    LiveMetricService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LiveMetricService.ctorParameters = [
        { type: Utils, },
        { type: Http, },
        { type: AccessTokenService, },
    ];
    return LiveMetricService;
}(AbstractService));
//# sourceMappingURL=live.js.map