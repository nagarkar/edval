import {MetricValue} from "../metric/schema";

export class SessionProperties {
  selectedStaffUserNames: Array<string> = [];
  selectedRoles: Array<string> = []
  staffMetricValues:Map<string, MetricValue> = new Map<string, MetricValue>();
  roleMetricValues:Map<string, MetricValue> = new Map<string, MetricValue>();
  orgMetricValues: Array<MetricValue> = [];
  endTime: number;
  aggregationsProcessed: boolean;
}

export class Session {

  customerId: string;
  sessionId: string;
  patientId?: string;
  timestamp: number;
  entityStatus: string;
  properties: SessionProperties = new SessionProperties();

  close() {
    this.entityStatus = "ACTIVE";
    this.properties.endTime = new Date().getTime();
    this.properties.aggregationsProcessed = false;
  }

  equals(other: Session) {
    if (other &&
      other.sessionId == this.sessionId &&
      other.customerId == this.customerId) {

      return true;
    }
    return false;
  }

  addMetricValue(value: MetricValue) {
    //TODO Uncomment this once we fix sessions.
    //this.properties.orgMetricValues.push(value);
  }

  addMetricValueForStaff(value: MetricValue, username: string) {
    this.properties.staffMetricValues.set("subject:" + username, value);
  }
}
