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
import { Survey } from "./schema";
import { Http } from "@angular/http";
export var LiveSurveyService = (function (_super) {
    __extends(LiveSurveyService, _super);
    function LiveSurveyService(utils, http, accessProvider) {
        _super.call(this, utils, accessProvider, http, new Survey());
        Utils.log("created account account");
    }
    LiveSurveyService.prototype.getId = function (member) {
        return member.id;
    };
    LiveSurveyService.prototype.getPath = function () {
        return "/api/customers" + "/" + Config.CUSTOMERID + "/survey";
    };
    LiveSurveyService.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.list();
    };
    LiveSurveyService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LiveSurveyService.ctorParameters = [
        { type: Utils, },
        { type: Http, },
        { type: AccessTokenService, },
    ];
    return LiveSurveyService;
}(AbstractService));
//# sourceMappingURL=live.js.map