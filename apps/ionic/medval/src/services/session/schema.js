import { Metric } from "../metric/schema";
import { Utils } from "../../shared/stuff/utils";
export var SessionProperties = (function () {
    function SessionProperties() {
        this.selectedStaffUserNames = [];
        this.selectedRoles = [];
        this.staffMetricValues = new Map();
        this.roleMetricValues = new Map();
        this.orgMetricValues = new Map();
        this.navigatedLocation = [];
    }
    return SessionProperties;
}());
export var Session = (function () {
    function Session() {
        this.properties = new SessionProperties();
        this.sessionId = Utils.guid("s");
        this.patientId = Utils.guid("p");
        this.timestamp = Utils.getTime();
    }
    Session.prototype.close = function () {
        this.entityStatus = "ACTIVE";
        this.properties.endTime = Utils.getTime();
        this.properties.aggregationProcessed = false;
    };
    Session.prototype.equals = function (other) {
        if (other &&
            other.sessionId == this.sessionId &&
            other.customerId == this.customerId) {
            return true;
        }
        return false;
    };
    Session.prototype.getAllMetricValues = function () {
        var returnValue = [];
        this.properties.orgMetricValues.forEach(function (value) { returnValue.push.apply(returnValue, value); });
        this.properties.staffMetricValues.forEach(function (value) { returnValue.push.apply(returnValue, value); });
        this.properties.roleMetricValues.forEach(function (value) { returnValue.push.apply(returnValue, value); });
        return returnValue;
    };
    Session.prototype.addMetricValue = function (subject, value) {
        if (Metric.isRoleSubject(subject)) {
            this.addMetricValueHelper(this.properties.roleMetricValues, subject, value);
        }
        if (Metric.isStaffSubject(subject)) {
            this.addMetricValueHelper(this.properties.staffMetricValues, subject, value);
        }
        if (Metric.isOrgSubject(subject)) {
            this.addMetricValueHelper(this.properties.orgMetricValues, subject, value);
        }
    };
    Session.prototype.setStaffUsernames = function (usernames) {
        this.properties.selectedStaffUserNames = usernames;
    };
    Session.prototype.addNavigatedLocation = function (location) {
        this.properties.navigatedLocation.push(location);
    };
    Session.prototype.getMetricValue = function (subject, metricId) {
        var returnValue = null;
        var mValues = this.properties.staffMetricValues.get(subject);
        if (mValues) {
            mValues.forEach(function (mValue) {
                if (mValue.metricId == metricId) {
                    returnValue = mValue.metricValue;
                }
            });
        }
        if (returnValue) {
            return returnValue;
        }
        mValues = this.properties.orgMetricValues.get(subject);
        if (mValues) {
            mValues.forEach(function (mValue) {
                if (mValue.metricId == metricId) {
                    returnValue = mValue.metricValue;
                }
            });
        }
        if (returnValue) {
            return returnValue;
        }
        mValues = this.properties.roleMetricValues.get(subject);
        if (mValues) {
            mValues.forEach(function (mValue) {
                if (mValue.metricId == metricId) {
                    returnValue = mValue.metricValue;
                }
            });
        }
        if (returnValue) {
            return returnValue;
        }
        return null;
    };
    Session.prototype.addMetricValueHelper = function (subjectMetricValueMap, subject, value) {
        var values = subjectMetricValueMap.get(subject);
        if (!values) {
            values = [];
        }
        values.push(value);
        subjectMetricValueMap.set(subject, values);
    };
    return Session;
}());
//# sourceMappingURL=schema.js.map