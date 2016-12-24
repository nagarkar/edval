var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { MockStaffService } from "./mock";
import { LiveStaffService } from "./live";
import { DelegatingService } from "../../shared/service/delegating.service";
export var StaffService = (function (_super) {
    __extends(StaffService, _super);
    function StaffService(mockService, liveService) {
        _super.call(this, mockService, liveService);
    }
    StaffService.prototype.getId = function (member) {
        return member.username;
    };
    StaffService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    StaffService.ctorParameters = [
        { type: MockStaffService, },
        { type: LiveStaffService, },
    ];
    return StaffService;
}(DelegatingService));
//# sourceMappingURL=delegator.js.map