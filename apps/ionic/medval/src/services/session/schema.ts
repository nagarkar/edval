import {MetricValue, Metric} from "../metric/schema";
import {Utils} from "../../shared/stuff/utils";

export class SessionProperties {
  selectedStaffUserNames: Array<string> = [];
  selectedRoles: Array<string> = []
  staffMetricValues:Map<string, MetricValue[]> = new Map<string, MetricValue[]>();
  roleMetricValues:Map<string, MetricValue[]> = new Map<string, MetricValue[]>();
  orgMetricValues: Array<MetricValue> = [];
  endTime: number;
  aggregationProcessed: boolean;
}

export class Session {

  customerId: string;
  sessionId: string;
  patientId?: string;
  timestamp: number;
  entityStatus: string;
  properties: SessionProperties = new SessionProperties();

  constructor() {
    this.sessionId = Utils.guid("s");
    this.patientId = Utils.guid("p");
    this.timestamp = Utils.getTime();
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

  public addMetricValue(subject: string, value: MetricValue) {
    if(Metric.isRoleSubject(subject)) {
      this.addMetricValueHelper(this.properties.roleMetricValues, subject, value);
    }
    if (Metric.isStaffSubject(subject)) {
      this.addMetricValueHelper(this.properties.staffMetricValues, subject, value);
    }
    if (Metric.isOrgSubject(subject)) {
      this.addMetricValueHelper(this.properties.staffMetricValues, subject, value);
    }
  }

  setStaffUsernames(usernames: string[]) {
    this.properties.selectedStaffUserNames = usernames;
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
