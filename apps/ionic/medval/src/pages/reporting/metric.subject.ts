import {Metric} from "../../services/metric/schema";
/**
 * Created by chinmay on 2/27/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
export class MetricAndSubject {

  constructor(public metricName: string, public subjectType, public subjectValue: string) {}

  getFullHeading() {
    return [this.getHeading(), this.getSubHeading()].join(" ");
  }

  getHeading() {
    return this.metricName;
  }

  getSubHeading() {
    if (this.subjectType == Metric.ORG_SUBJECT_TYPE) {
      return 'For Organization';
    }
    if (this.subjectType == Metric.ROLE_SUBJECT_TYPE) {
      return [Metric.ROLE_SUBJECT_TYPE, this.subjectValue].join(":");
    }
    if (this.subjectType == Metric.STAFF_SUBJECT_TYPE) {
      return ['For Staff Member:', this.subjectValue].join(":");
    }
  }

  static compare(a: MetricAndSubject, b: MetricAndSubject, asc?: boolean) {
    let aMetricName = a ? a.metricName : null;
    let bMetricName = b ? b.metricName : null;
    if (!aMetricName && !bMetricName) {
      return 0;
    }
    if (aMetricName && bMetricName) {
      if (!asc) {
        return bMetricName.localeCompare(aMetricName);
      } else {
        return aMetricName.localeCompare(bMetricName);
      }

    }
    if (!aMetricName) {
      return -1;
    }
    if (!bMetricName) {
      return 1;
    }
  }
}
