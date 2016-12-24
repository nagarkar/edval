import { Metric } from "./schema";
import { Utils } from "../../shared/stuff/utils";
export var MetricIterator = (function () {
    function MetricIterator(maxMetrics, metricService, staffSet, roles) {
        this.maxMetrics = maxMetrics;
        this.metricService = metricService;
        this.staffSet = staffSet;
        this.roles = roles;
        if (staffSet == null) {
            this.staffSet = new Set();
        }
        if (roles == null) {
            this.roles = new Set();
        }
        Utils.log("IN METRIC ITERATOR with staff: {0}, roles: {1}", Utils.stringify(staffSet), Utils.stringify(roles));
        this.maxDrilldowns = this.computeMaxDrilldowns();
        var metrics = this.metricService.listCached();
        this.expandAndSetupMetricIterators(metrics);
    }
    MetricIterator.prototype.next = function (value) {
        Utils.log("In metricIterator.next, with lastRoot {0}, lastRootValue: {1}, lastMetric: {2}, lastValue: {3}", this.lastRoot.toString(), this.lastRootValue.toString(), this.lastMetric.toString(), this.lastValue.toString());
        if (!this.lastRoot) {
            return this.saveAndReturn(this.getNextIteratorResultOrDone(this.userRootIterator, this.roleRootIterator, this.orgRootIterator));
        }
        if (this.lastRoot && this.lastRoot.isHigh(this.lastRootValue)) {
            return this.saveAndReturn(this.getNextIteratorResultOrDone(this.orgRootIterator));
        }
        if (this.lastRoot /*&& this.lastRoot.isLow(this.lastRootValue) */) {
            return this.saveAndReturn(this.getNextIteratorResultOrDone(this.drilldownIteratorLookup.get(this.lastRoot), this.userRootIterator, this.roleRootIterator, this.orgRootIterator));
        }
        return this.saveAndReturn(this.getNextIteratorResultOrDone(this.userRootIterator, this.roleRootIterator, this.orgRootIterator));
    };
    MetricIterator.prototype.updateAnswer = function (value) {
        this.lastValue = value;
        if (this.lastMetric == this.lastRoot) {
            this.lastRootValue = value;
        }
    };
    MetricIterator.prototype.saveAndReturn = function (result) {
        if (result.done) {
            return result;
        }
        this.lastMetric = result.value;
        if (this.drilldownIteratorLookup.has(this.lastMetric)) {
            this.lastRoot = result.value;
        }
        return result;
    };
    MetricIterator.prototype.expandAndSetupMetricIterators = function (retrievedMetrics) {
        var metrics = this.expandMetrics(retrievedMetrics);
        this.userRootIterator = this.getRootQuestionForUsers(metrics);
        this.roleRootIterator = this.getRootQuestionsForRoles(metrics);
        this.orgRootIterator = this.getRootQuestionsForOrgs(metrics);
        this.drilldownIteratorLookup = this.getDrilldownIteratorLookup(metrics);
        // Assume a single freeform text question.
    };
    MetricIterator.prototype.getRootQuestionForUsers = function (metrics) {
        return this.getRootIterators(metrics, "staff", this.extractUserNames());
    };
    MetricIterator.prototype.getRootQuestionsForRoles = function (metrics) {
        return this.getRootIterators(metrics, "role", Array.from(this.roles));
    };
    MetricIterator.prototype.getRootQuestionsForOrgs = function (metrics) {
        return this.getRootIterators(metrics, "org", ['control']);
    };
    MetricIterator.prototype.getDrilldownIteratorLookup = function (metrics) {
        var _this = this;
        var iteratorLookup = new Map();
        var roots = metrics.filter(function (metric) {
            return !metric.parentMetricId;
        });
        roots.forEach(function (root) {
            var drilldowns = metrics.filter(function (metric) {
                return metric.parentMetricId == root.metricId
                    && metric.subject == root.subject;
            });
            drilldowns = _this.selectDrilldownMetrics(drilldowns);
            if (drilldowns.length > 0) {
                iteratorLookup.set(root, drilldowns.values());
            }
        });
        return iteratorLookup;
    };
    MetricIterator.prototype.getRootIterators = function (metrics, subjectPrefix, subjectValues) {
        var allRootMetrics = Array();
        allRootMetrics.concat(metrics.filter(function (metric) {
            return metric.subject === subjectPrefix && !metric.parentMetricId;
        }));
        if (!subjectValues) {
            return;
        }
        subjectValues.forEach(function (subjectValue) {
            var rootMetrics = metrics.filter(function (metric) {
                return metric.subject === (subjectPrefix + ":" + subjectValue) && !metric.parentMetricId;
            });
            allRootMetrics = allRootMetrics.concat(rootMetrics);
        });
        return allRootMetrics.values();
    };
    MetricIterator.prototype.getNextIteratorResultOrDone = function () {
        var iterators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            iterators[_i - 0] = arguments[_i];
        }
        var result;
        for (var i = 0; i < iterators.length; i++) {
            result = iterators[i].next();
            if (!result.done) {
                break;
            }
        }
        return result;
    };
    MetricIterator.prototype.selectDrilldownMetrics = function (drilldowns) {
        return Utils.shuffle(drilldowns)
            .slice(0, Math.min(drilldowns.length, this.maxDrilldowns));
    };
    MetricIterator.prototype.expandMetrics = function (metrics) {
        var expandedMetrics = metrics;
        this.staffSet.forEach(function (staff) {
            metrics.forEach(function (metric) {
                if (metric.hasRoleSubject() && staff.role == metric.getRoleSubject()) {
                    var expandedMetric = Object.assign(new Metric(), metric);
                    expandedMetric.setStaffSubject(staff.username);
                    expandedMetrics.push(expandedMetric);
                }
            });
        });
        return expandedMetrics;
    };
    MetricIterator.prototype.extractUserNames = function () {
        var usernames = [];
        this.staffSet.forEach(function (staff) {
            usernames.push(staff.username);
        });
        return usernames;
    };
    MetricIterator.prototype.computeMaxDrilldowns = function () {
        var mustHaveMetricsCount = 0;
        var npsRootMetrics = this.staffSet.size + this.roles.size;
        mustHaveMetricsCount += npsRootMetrics + 1 /* Control Question */;
        return Math.ceil((this.maxMetrics - mustHaveMetricsCount) / npsRootMetrics);
    };
    return MetricIterator;
}());
//# sourceMappingURL=metric.iterator.js.map