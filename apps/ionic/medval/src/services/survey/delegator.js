var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { MockSurveyService } from "./mock";
import { LiveSurveyService } from "./live";
import { DelegatingService } from "../../shared/service/delegating.service";
export var SurveyService = (function (_super) {
    __extends(SurveyService, _super);
    function SurveyService(mockService, liveService) {
        _super.call(this, mockService, liveService);
    }
    SurveyService.prototype.getId = function (member) {
        return member.id;
    };
    SurveyService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SurveyService.ctorParameters = [
        { type: MockSurveyService, },
        { type: LiveSurveyService, },
    ];
    return SurveyService;
}(DelegatingService));
//# sourceMappingURL=delegator.js.map