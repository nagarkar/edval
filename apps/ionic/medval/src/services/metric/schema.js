var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Utils } from "../../shared/stuff/utils";
import { Config } from "../../shared/aws/config";
export var Type = (function () {
    function Type() {
    }
    return Type;
}());
export var NPSType = (function (_super) {
    __extends(NPSType, _super);
    function NPSType() {
        _super.apply(this, arguments);
    }
    return NPSType;
}(Type));
export var TextType = (function (_super) {
    __extends(TextType, _super);
    function TextType() {
        _super.apply(this, arguments);
    }
    return TextType;
}(Type));
export var MetricValue = (function () {
    function MetricValue(metricId, metricValue) {
        this.metricId = metricId;
        this.metricValue = metricValue;
    }
    ;
    MetricValue.prototype.toString = function () {
        return Utils.stringify(this);
    };
    return MetricValue;
}());
export var Metric = (function () {
    function Metric(type, id, subject) {
        if (!id) {
            id = Utils.guid("m" /* prefix */);
        }
        // TODO: The following line can be safely removed from here since server will populate customerid if it's in url path.
        this.customerId = Config.CUSTOMERID;
        this.metricId = id;
        this.subject = subject;
        this.properties = {
            metricName: '',
            definition: {
                npsType: type instanceof NPSType ? type : null,
                textType: type instanceof TextType ? type : null
            }
        };
    }
    Metric.prototype.toString = function () {
        return Utils.stringify(this);
    };
    Metric.prototype.isRoot = function () {
        return this.parentMetricId == null;
    };
    Metric.prototype.isLow = function (value) {
        return this.isNpsType() && value && this.isDetractor(+value.metricValue);
    };
    /** Returns true is value is defined, a number, and greater than 8. */
    Metric.prototype.isHigh = function (value) {
        return this.isNpsType() && value && this.isPromoter(+value.metricValue);
    };
    /** Returns true is value is defined, a number, and less than 2. */
    Metric.prototype.isInMiddle = function (value) {
        return !this.isLow(value) && !this.isHigh(value);
    };
    Metric.prototype.isTextType = function () {
        return this.properties.definition.textType != null;
    };
    Metric.prototype.isNpsType = function () {
        return this.properties.definition.npsType != null;
    };
    Metric.prototype.isDetractor = function (value) {
        return value / this.properties.definition.npsType.range < 0.72727272;
    };
    Metric.prototype.isStrongDetractor = function (value) {
        return value / this.properties.definition.npsType.range < 0.72727272;
    };
    Metric.prototype.isPromoter = function (value) {
        return value / this.properties.definition.npsType.range > 0.81818181;
    };
    Metric.prototype.hasRoleSubject = function () {
        return Metric.rolePattern.test(this.subject);
    };
    Metric.isRoleSubject = function (subject) {
        return Metric.rolePattern.test(subject);
    };
    Metric.isStaffSubject = function (subject) {
        return Metric.staffPattern.test(subject);
    };
    Metric.isOrgSubject = function (subject) {
        return Metric.orgPattern.test(subject);
    };
    Metric.prototype.hasStaffSubject = function () {
        return Metric.staffPattern.test(this.subject);
    };
    Metric.prototype.getRoleSubject = function () {
        if (this.hasRoleSubject()) {
            return Metric.rolePattern.exec(this.subject)[1];
        }
        return null;
    };
    Metric.prototype.getStaffSubject = function () {
        if (this.hasStaffSubject()) {
            return Metric.staffPattern.exec(this.subject)[1];
        }
        return null;
    };
    Metric.prototype.setStaffSubject = function (username) {
        this.subject = "staff:" + username;
    };
    Metric.createStaffSubject = function (staffName) {
        return "staff:" + staffName;
    };
    Metric.createRoleSubject = function (role) {
        return "role:" + role;
    };
    // Test regex changes here: https://regex101.com/
    Metric.rolePattern = /^role:(.*)/i;
    Metric.staffPattern = /^staff:(.*)/i;
    Metric.orgPattern = /(^org$)|(^org:(.+)$)/i;
    return Metric;
}());
//# sourceMappingURL=schema.js.map