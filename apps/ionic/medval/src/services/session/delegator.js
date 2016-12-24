var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { Session } from './schema';
import { DelegatingService } from "../../shared/service/delegating.service";
import { MockSessionService } from "./mock";
import { LiveSessionService } from "./live";
import { ErrorType } from "../../shared/stuff/error.types";
import { Utils } from "../../shared/stuff/utils";
import { SurveyNavigator } from "../survey/survey.navigator";
import { SurveyService } from "../survey/delegator";
import { MetricService } from "../metric/delegator";
export var SessionService = (function (_super) {
    __extends(SessionService, _super);
    function SessionService(mockService, liveService, surveyService, metricSvc) {
        _super.call(this, mockService, liveService);
        this.surveyService = surveyService;
        this.metricSvc = metricSvc;
    }
    SessionService.prototype.hasCurrentSession = function () {
        return this.surveyNavigator != null && this.surveyNavigator.session != null;
    };
    SessionService.prototype.getCurrentSession = function () {
        return this.surveyNavigator.session;
    };
    SessionService.prototype.newCurrentSession = function (surveyId) {
        var session = new Session();
        session.properties.surveyId = surveyId;
        this.surveyNavigator = new SurveyNavigator(session, this.surveyService.getCached(surveyId), this.metricSvc);
        _super.prototype.create.call(this, this.getCurrentSession());
        return this.getCurrentSession();
    };
    SessionService.prototype.closeCurrentSession = function () {
        this.getCurrentSession().close();
        _super.prototype.update.call(this, this.getCurrentSession());
        Utils.log("Setting session to null. Session: {0}", Utils.stringify(this.getCurrentSession()));
        this.surveyNavigator = null;
    };
    SessionService.prototype.recordNavigatedLocationInCurrentSession = function (location) {
        if (this.hasCurrentSession()) {
            this.getCurrentSession().addNavigatedLocation(location);
        }
        else {
            Utils.log("Attempted to call recordNavigatedLocationInCurrentSession with null currentSession");
        }
    };
    SessionService.prototype.addToCurrentSession = function (subject, metricValue) {
        this.getCurrentSession().addMetricValue(subject, metricValue);
    };
    SessionService.prototype.get = function (id, dontuseCache) {
        return Promise.reject(ErrorType.UnsupportedOperation("get"));
    };
    SessionService.prototype.list = function (dontuseCache) {
        return Promise.reject(ErrorType.UnsupportedOperation("list"));
    };
    SessionService.prototype.getCached = function (id) {
        throw ErrorType.UnsupportedOperation("getCached");
    };
    SessionService.prototype.listCached = function () {
        throw ErrorType.UnsupportedOperation("listCached");
    };
    SessionService.prototype.create = function (TMember) {
        return Promise.reject(ErrorType.UnsupportedOperation("create"));
    };
    SessionService.prototype.update = function (TMember) {
        return Promise.reject(ErrorType.UnsupportedOperation("update"));
    };
    SessionService.prototype.delete = function (id) {
        return Promise.reject(ErrorType.UnsupportedOperation("delete"));
    };
    SessionService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SessionService.ctorParameters = [
        { type: MockSessionService, },
        { type: LiveSessionService, },
        { type: SurveyService, },
        { type: MetricService, },
    ];
    return SessionService;
}(DelegatingService));
//# sourceMappingURL=delegator.js.map