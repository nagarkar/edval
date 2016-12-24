var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { DelegatingService } from "../../shared/service/delegating.service";
import { MockMetricService } from "./mock";
import { LiveMetricService } from "./live";
import { Utils } from "../../shared/stuff/utils";
export var MetricService = (function (_super) {
    __extends(MetricService, _super);
    function MetricService(mockService, liveService) {
        var _this = this;
        _super.call(this, mockService, liveService);
        this.rootDrilldownMap = new Map();
        this.onCreate.subscribe(function (next) { return _this.createCached(next); });
        this.onDelete.subscribe(function (next) { return _this.deleteCached(next); });
    }
    MetricService.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.resetRootDrilldownMap();
    };
    MetricService.prototype.getRootMetricIds = function () {
        return this.listCached()
            .filter(function (value) { return value.isRoot(); })
            .map(function (value) { return value.metricId; });
    };
    MetricService.prototype.getRootMetricsForSubject = function (subject) {
        return this.listCached()
            .filter(function (value) { return value.isRoot() && value.subject == subject; });
    };
    MetricService.prototype.getCachedMatchingRootMetrics = function (rootMetricId) {
        var result = [];
        if (rootMetricId) {
            result.push(this.getCached(rootMetricId).metricId);
            return result;
        }
        this.rootDrilldownMap.forEach(function (value, rootMetric) { return result.push(rootMetric); });
        return result;
    };
    MetricService.prototype.getCachedNpsDrilldownMetrics = function (rootMetricId) {
        if (!rootMetricId) {
            return this.listCached()
                .filter(function (value) { return value.isNpsType() && value.parentMetricId != null; });
        }
        return this.listCached()
            .filter(function (value) { return value.isNpsType() && value.parentMetricId == rootMetricId; });
    };
    MetricService.prototype.resetRootDrilldownMap = function () {
        var _this = this;
        this.rootDrilldownMap.clear();
        var allMetrics = this.listCached();
        var rootMetrics = this.getRootMetrics(allMetrics);
        var getDrilldownMetricsForRoot = function (metrics, rootMetricId) {
            return Array.apply(void 0, metrics.filter(function (metric) { return metric.parentMetricId === rootMetricId; }));
        };
        rootMetrics.forEach(function (rootMetric) {
            _this.rootDrilldownMap.set(rootMetric.metricId, getDrilldownMetricsForRoot(allMetrics, rootMetric.metricId));
        });
    };
    MetricService.prototype.createCached = function (metric) {
        if (this.rootDrilldownMap.has(metric.metricId)) {
            return; // not really being created; not sure why this would every happen.
        }
        if (!metric.parentMetricId) {
            this.rootDrilldownMap.set(metric.metricId, []);
            return;
        }
        var drilldowns = this.rootDrilldownMap.get(metric.parentMetricId);
        drilldowns.push(metric);
        this.rootDrilldownMap.set(metric.parentMetricId, drilldowns);
    };
    MetricService.prototype.deleteCached = function (metric) {
        var map = this.rootDrilldownMap;
        if (map.has(metric.metricId) && map.get(metric.metricId) && map.get(metric.metricId).length > 0) {
            Utils.throw("Invalid state; trying to delete metric when it has drilldown children. Delete drilldowns first");
        }
        var drilldowns = map.get(metric.parentMetricId);
        var matchingMetric = null;
        drilldowns.forEach(function (dMetric, index) {
            if (dMetric.metricId == metric.metricId) {
                matchingMetric = index;
            }
        });
        drilldowns.splice(matchingMetric, 1);
        map.set(metric.parentMetricId, drilldowns);
    };
    MetricService.prototype.getRootMetrics = function (metrics) {
        return Array.apply(void 0, metrics.filter(function (metric) { return !metric.parentMetricId; }));
    };
    MetricService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    MetricService.ctorParameters = [
        { type: MockMetricService, },
        { type: LiveMetricService, },
    ];
    return MetricService;
}(DelegatingService));
//# sourceMappingURL=delegator.js.map