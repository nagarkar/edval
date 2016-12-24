var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { Utils } from "../../shared/stuff/utils";
import { AccessTokenService } from "../../shared/aws/access.token.service";
import { AbstractMockService } from "../../shared/service/abstract.mock.service";
export var MockSessionService = (function (_super) {
    __extends(MockSessionService, _super);
    function MockSessionService(utils, accessProvider) {
        _super.call(this, utils, accessProvider);
        Utils.log("created staff account)");
    }
    MockSessionService.prototype.reset = function () {
        // no op
    };
    MockSessionService.prototype.setId = function (member, id) {
        return member.sessionId = id;
    };
    MockSessionService.prototype.getId = function (member) {
        return member.sessionId;
    };
    MockSessionService.prototype.mockData = function () {
        return new Map();
    };
    MockSessionService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    MockSessionService.ctorParameters = [
        { type: Utils, },
        { type: AccessTokenService, },
    ];
    return MockSessionService;
}(AbstractMockService));
//# sourceMappingURL=mock.js.map