var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { AbstractService } from "../../shared/service/abstract.service";
import { Session } from "./schema";
import { Config } from "../../shared/aws/config";
import { Utils } from "../../shared/stuff/utils";
import { AccessTokenService } from "../../shared/aws/access.token.service";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
/**
 * Created by chinmay on 10/31/16.
 */
export var LiveSessionService = (function (_super) {
    __extends(LiveSessionService, _super);
    function LiveSessionService(utils, http, accessProvider) {
        _super.call(this, utils, accessProvider, http, new Session());
        Utils.log("Created LiveSessionService: " + typeof this);
    }
    LiveSessionService.prototype.getPath = function () {
        return "/api/customers" + "/" + Config.CUSTOMERID + "/session";
    };
    LiveSessionService.prototype.getId = function (member) {
        return member.sessionId;
    };
    LiveSessionService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LiveSessionService.ctorParameters = [
        { type: Utils, },
        { type: Http, },
        { type: AccessTokenService, },
    ];
    return LiveSessionService;
}(AbstractService));
//# sourceMappingURL=live.js.map