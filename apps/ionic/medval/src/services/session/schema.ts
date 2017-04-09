/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {MetricValue, Metric} from "../metric/schema";
import {Utils} from "../../shared/stuff/utils";
import {Type} from "class-transformer";
import {Config} from "../../shared/config";

export interface ReviewData {
  email?: string,
  phone?: string,
  message?: string,
  preferredReviewSite?: Array<string>
}

export class SessionProperties {
  patientId: string;
  surveyId?: string;
  selectedStaffUserNames: Array<string> = [];
  selectedRoles: Array<string> = [];
  @Type(() => Map)
  staffMetricValues: Map<string, MetricValue[]> = new Map<string, MetricValue[]>();
  @Type(() => Map)
  roleMetricValues: Map<string, MetricValue[]> = new Map<string, MetricValue[]>();
  @Type(() => Map)
  orgMetricValues: Map<string, MetricValue[]> = new Map<string, MetricValue[]>();
  endTime: number;
  aggregationProcessed: boolean;
  navigatedLocations?: Array<string> = [];
  reviewData: ReviewData = {};
  complaintData: ReviewData = {};
  rawFeedback: string[] = [];
  games: Array<{result:boolean, message:string}> = [];

  constructor() {
    this.patientId = Utils.guid("p");
  }
}

export class Session {

  customerId: string;
  sessionId: string;
  entityStatus: string;
  softwareVersion: string = Config.SOFTWARE_VERSION;
  @Type(() => SessionProperties)
  properties: SessionProperties = new SessionProperties();

  constructor() {
    this.sessionId = "" + Date.now();
    this.softwareVersion = Config.SOFTWARE_VERSION;
  }

  readyToSave() {
    this.entityStatus = "ACTIVE";
    this.properties.endTime = Date.now();
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

  getAllMetricValues(): MetricValue[] {
    let returnValue: MetricValue[] = [];
    this.properties.orgMetricValues.forEach((value: MetricValue[])=> {returnValue.push(...value);});
    this.properties.staffMetricValues.forEach((value: MetricValue[])=> {returnValue.push(...value);});
    this.properties.roleMetricValues.forEach((value: MetricValue[])=> {returnValue.push(...value);});
    return returnValue;
  }

  getAllMetricIdsAsSet(): Set<string> {
    let returnValue: Set<string> = new Set<string>();
    let doForEach = (value: MetricValue[], subject: string)=> {
      value.forEach((mvalue: MetricValue)=> {
        returnValue.add(mvalue.metricId);
      })
    };
    this.properties.orgMetricValues.forEach(doForEach);
    this.properties.staffMetricValues.forEach(doForEach);
    this.properties.roleMetricValues.forEach(doForEach);
    return returnValue;
  }

  getOnlyOrgMetricValueFor(metric: Metric) {
    return Session.getOnlyMetricValueFor(this.properties.orgMetricValues, metric.subject, metric.metricId);
  }

  doesNotHaveMetricValueForRoleSubject(roleSubject: string, metricId: string): boolean {
    return Session.doesNotHaveMetricValueSubjectToCondition(this.properties.roleMetricValues, metricId, (subject: string)=>{
      return roleSubject == subject;
    })
  }

  containsMetricValueForStaffSubject(staffSubject: string, metricId: string): boolean {
    return !Session.doesNotHaveMetricValueSubjectToCondition(this.properties.staffMetricValues, metricId, (subject: string)=>{
      return staffSubject == subject;
    })
  }

  containsMetricValueForRoleSubject(roleSubject: string, metricId: string): boolean {
    return !Session.doesNotHaveMetricValueSubjectToCondition(this.properties.roleMetricValues, metricId, (subject: string)=>{
      return roleSubject == subject;
    })
  }

  doesNotHaveMetricValueForAnyRoleSubject(metricId: string): boolean {
    return Session.doesNotHaveMetricValueSubjectToCondition(this.properties.roleMetricValues, metricId, (subject: string)=>{
      return Metric.isRoleSubject(subject);
    })
  }

  addMetricValue(subject: string, value: MetricValue) {
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
    this.properties.navigatedLocations.push(location);
  }

  getMetricValue(subject: string, metricId: string): string {
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

  static doesNotHaveMetricValueSubjectToCondition(
    map: Map<string, MetricValue[]>,
    metricId: string,
    needToPassTest: (subject: string, value?: MetricValue[]) => boolean, ): boolean {

    return Session.getMetricValuesSubjectToCondition(map, metricId, needToPassTest).length == 0;
  }

  static doesNotHaveMetricValueForSubject(map: Map<string, MetricValue[]>, roleSubject: string, metricId: string): boolean {
    return Session.doesNotHaveMetricValueSubjectToCondition(map, metricId, (subject: string)=>{
      return subject == roleSubject;
    })
  }

  static getMetricValuesSubjectToCondition(
    map: Map<string, MetricValue[]>,
    metricId: string,
    testPassed: (subject: string, value?: MetricValue[]) => boolean, ): MetricValue[]{

    let foundMetricValues: MetricValue[] = [];
    let doForEach = (values: MetricValue[], subject: string)=> {
      if (!testPassed(subject, values)) {
        return;
      }
      values.forEach((value: MetricValue)=>{
        if(value.metricId == metricId) {
          foundMetricValues.push(value);
        }
      })
    }
    map.forEach(doForEach);
    return foundMetricValues;
  }

  private static getOnlyMetricValueFor(map: Map<string, MetricValue[]>, subject: string, metricId: string) {
    let foundMetricValues: MetricValue[] = Session.getMetricValuesSubjectToCondition(
      map,
      metricId,
      (subject: string) => {
        return subject == subject;
      }
    )
    Utils.throwIf(foundMetricValues.length > 1, "Expected one, found more");
    if (foundMetricValues.length == 1) {
      return foundMetricValues[0]
    } else {
      return undefined;
    }

  }
}
