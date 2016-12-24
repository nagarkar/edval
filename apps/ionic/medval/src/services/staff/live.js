var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { Utils } from "../../shared/stuff/utils";
import { AccessTokenService } from "../../shared/aws/access.token.service";
import { AbstractService } from "../../shared/service/abstract.service";
import { Config } from "../../shared/aws/config";
import { Staff } from "./schema";
import { Http } from "@angular/http";
export var LiveStaffService = (function (_super) {
    __extends(LiveStaffService, _super);
    function LiveStaffService(utils, http, accessProvider) {
        _super.call(this, utils, accessProvider, http, new Staff());
        Utils.log("created account account");
    }
    LiveStaffService.prototype.getId = function (member) {
        return member.username;
    };
    LiveStaffService.prototype.getPath = function () {
        return "/api/customers" + "/" + Config.CUSTOMERID + "/staff";
    };
    LiveStaffService.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.list();
    };
    LiveStaffService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LiveStaffService.ctorParameters = [
        { type: Utils, },
        { type: Http, },
        { type: AccessTokenService, },
    ];
    return LiveStaffService;
}(AbstractService));
//# sourceMappingURL=live.js.map