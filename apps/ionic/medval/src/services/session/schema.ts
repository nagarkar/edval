import {MetricValue, Metric} from "../metric/schema";
import {Utils} from "../../shared/stuff/utils";

export class SessionProperties {
  patientId: string;
  surveyId?: string;
  selectedStaffUserNames: Array<string> = [];
  selectedRoles: Array<string> = []
  staffMetricValues: Map<string, MetricValue[]> = new Map<string, MetricValue[]>();
  roleMetricValues: Map<string, MetricValue[]> = new Map<string, MetricValue[]>();
  orgMetricValues: Map<string, MetricValue[]> = new Map<string, MetricValue[]>();
  endTime: number;
  aggregationProcessed: boolean;
  navigatedLocation?: string[] = [];
  reviewData: {email?: string, phone?: string, message?: string, preferredReviewSite?: string[]} = {};

  constructor() {
    this.patientId = Utils.guid("p");
  }
}

export class Session {

  customerId: string;
  sessionId: string;
  entityStatus: string;
  properties: SessionProperties = new SessionProperties();

  constructor() {
    this.sessionId = "" + Utils.getTime();
  }

  close() {
    this.entityStatus = "ACTIVE";
    this.properties.endTime = Utils.getTime();
    this.properties.aggregationProcessed = false;
  }

  equals(other: Session) {
    if (other &&
      other.sessionId == this.sessionId &&
      other.customerId == this.customerId) {

      return true;
    }
    return false;
  }

  public getAllMetricValues(): MetricValue[] {
    let returnValue: MetricValue[] = [];
    this.properties.orgMetricValues.forEach((value: MetricValue[])=> {returnValue.push(...value);});
    this.properties.staffMetricValues.forEach((value: MetricValue[])=> {returnValue.push(...value);});
    this.properties.roleMetricValues.forEach((value: MetricValue[])=> {returnValue.push(...value);});
    return returnValue;
  }

  public getAllMetricIdsAsSet(): Set<string> {
    let returnValue: Set<string> = new Set<string>();
    let doForEach = (value: MetricValue[])=> {
      value.forEach((mvalue: MetricValue)=> {
        returnValue.add(mvalue.metricId);
      })
    };
    this.properties.orgMetricValues.forEach(doForEach);
    this.properties.staffMetricValues.forEach(doForEach);
    this.properties.roleMetricValues.forEach(doForEach);
    return returnValue;
  }

  public addMetricValue(subject: string, value: MetricValue) {
    if(Metric.isRoleSubject(subject)) {
      this.addMetricValueHelper(this.properties.roleMetricValues, subject, value);
    }
    if (Metric.isStaffSubject(subject)) {
      this.addMetricValueHelper(this.properties.staffMetricValues, subject, value);
    }
    if (Metric.isOrgSubject(subject)) {
      this.addMetricValueHelper(this.properties.orgMetricValues, subject, value);
    }
  }

  setStaffUsernames(usernames: string[]) {
    this.properties.selectedStaffUserNames = usernames;
  }

  addNavigatedLocation(location: string) {
    this.properties.navigatedLocation.push(location);
  }

  public getMetricValue(subject: string, metricId: string): string {
    let returnValue: string = null;
    let mValues: MetricValue[] = this.properties.staffMetricValues.get(subject);
    if (mValues) {
      mValues.forEach((mValue: MetricValue) =>{
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
      mValues.forEach((mValue: MetricValue) =>{
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
      mValues.forEach((mValue: MetricValue) =>{
        if (mValue.metricId == metricId) {
          returnValue = mValue.metricValue;
        }
      });
    }
    if (returnValue) {
      return returnValue;
    }
    return null;
  }

  private addMetricValueHelper(subjectMetricValueMap: Map<string, MetricValue[]>, subject: string, value: MetricValue) {
    let values: MetricValue[] = subjectMetricValueMap.get(subject);
    if (!values) {
      values = [];
    }
    values.push(value);
    subjectMetricValueMap.set(subject, values);
  }

}
