var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { RegisterFunction } from "./survey.navigator";
export var AllPromoters = (function () {
    function AllPromoters() {
    }
    AllPromoters.prototype.canExecute = function (navigator, params) {
        return true;
    };
    AllPromoters.prototype.execute = function (navigator, params) {
        return navigator.session.getAllMetricValues().every(function (metricValue) {
            var metric = navigator.metricSvc.getCached(metricValue.metricId);
            if (metric.parentMetricId || (metric.isNpsType() && metric.isPromoter(+metricValue.metricValue))) {
                return true;
            }
            return false;
        }).toString();
    };
    AllPromoters = __decorate([
        RegisterFunction, 
        __metadata('design:paramtypes', [])
    ], AllPromoters);
    return AllPromoters;
}());
export var AnyDetractors = (function () {
    function AnyDetractors() {
    }
    AnyDetractors.prototype.canExecute = function (navigator, params) {
        return true;
    };
    AnyDetractors.prototype.execute = function (navigator, params) {
        return (!navigator.session.getAllMetricValues().every(function (metricValue) {
            var metric = navigator.metricSvc.getCached(metricValue.metricId);
            if (metric.parentMetricId || (metric.isNpsType() && !metric.isDetractor(+metricValue.metricValue))) {
                return true;
            }
            return false;
        })).toString();
    };
    AnyDetractors = __decorate([
        RegisterFunction, 
        __metadata('design:paramtypes', [])
    ], AnyDetractors);
    return AnyDetractors;
}());
export var StrongPromoter = (function () {
    function StrongPromoter() {
    }
    StrongPromoter.prototype.canExecute = function (navigator, params) {
        if (!params.metricId) {
            return false;
        }
        var metric = navigator.metricSvc.getCached(params.metricId);
        var metricValue = navigator.session.getMetricValue(metric.subject, metric.metricId);
        return metric !== null && metricValue !== null;
    };
    StrongPromoter.prototype.execute = function (navigator, params) {
        var metric = navigator.metricSvc.getCached(params.metricId);
        var metricValue = navigator.session.getMetricValue(metric.subject, metric.metricId);
        return (metric.isNpsType() && metric.isPromoter(+metricValue)).toString();
    };
    StrongPromoter = __decorate([
        RegisterFunction, 
        __metadata('design:paramtypes', [])
    ], StrongPromoter);
    return StrongPromoter;
}());
export var StrongDetractor = (function () {
    function StrongDetractor() {
    }
    StrongDetractor.prototype.canExecute = function (navigator, params) {
        if (!params.metricId) {
            return false;
        }
        var metric = navigator.metricSvc.getCached(params.metricId);
        var metricValue = navigator.session.getMetricValue(metric.subject, metric.metricId);
        return metric !== null && metricValue !== null;
    };
    StrongDetractor.prototype.execute = function (navigator, params) {
        var metric = navigator.metricSvc.getCached(params.metricId);
        var metricValue = navigator.session.getMetricValue(metric.subject, metric.metricId);
        return (metric.isNpsType() && metric.isDetractor(+metricValue)).toString();
    };
    StrongDetractor = __decorate([
        RegisterFunction, 
        __metadata('design:paramtypes', [])
    ], StrongDetractor);
    return StrongDetractor;
}());
//# sourceMappingURL=survey.functions.js.map