/**
 * Created by chinmay on 4/8/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Session} from "../../services/session/schema";
import {SessionScrubber} from "./session.scrubber";
import {MetricService} from "../../services/metric/delegator";
import {Metric, MetricValue} from "../../services/metric/schema";
import {Utils} from "../stuff/utils";
import {Scrubber} from "./scrubber";
import {Staff} from "../../services/staff/schema";
import {StaffService} from "../../services/staff/delegator";

export class SessionOrthoScrubber implements Scrubber<Session> {

  constructor(private metricSvc: MetricService, private staffSvc: StaffService) {}

  scrub(session: Session) {
    let orgMetric: Metric = this.metricSvc.getOnlyOrgMetric();
    let orgMetricValue: MetricValue = session.getOnlyOrgMetricValueFor(orgMetric);
    if (orgMetricValue) {
      this.copyMetricValueForOverallFavorabilityToRolesEvaluatedInSession(session, orgMetricValue.metricValue);
    }
    session.properties.staffMetricValues.forEach((metricValues: MetricValue[], staffSubject: string) => {
      metricValues.forEach((metricValue: MetricValue)=>{
        this.copyMetricValuesFromStaffSubjectsToCorreponspondingRoles(session, staffSubject, metricValue);
      })
    });
    session.properties.roleMetricValues.forEach((metricValues: MetricValue[], roleSubject: string) => {
      metricValues.forEach((metricValue: MetricValue)=>{
        this.copyMetricValuesWithRoleSubjectToStaffEvaluatedInSession(session, roleSubject, metricValue);
      })
    });

  }

  copyMetricValuesFromStaffSubjectsToCorreponspondingRoles(session: Session, staffSubject: string, metricValue: MetricValue) {
    let metric = this.metricSvc.getMetricById(metricValue.metricId);
    if (!Metric.isRoleSubject(staffSubject)) {
        return;
    }
    if (session.containsMetricValueForRoleSubject(staffSubject, metricValue.metricId)) {
      return;
    }
    let staff: Staff = this.staffSvc.getCached(Metric.GetUserNameInSubject(staffSubject));
    if (staff) {
      session.addMetricValue(Metric.createRoleSubject(staff.role), new MetricValue(metric.metricId, '' + metricValue.metricValue));
    }
  }

  copyMetricValuesWithRoleSubjectToStaffEvaluatedInSession(session: Session, roleSubject: string, metricValue: MetricValue) {
    let metric = this.metricSvc.getMetricById(metricValue.metricId);
    let role: string = metric.getRoleSubject();
    let usernames: Set<string> = this.staffSvc.getRoleUserNameMap().get(role);
    if (!usernames || usernames.size == 0) {
      return;
    }
    session.properties.selectedStaffUserNames.forEach((username: string)=> {
      if (!usernames.has(username)) {
        return;
      }
      let staffSubject: string = Metric.createStaffSubject(username);
      if (!session.containsMetricValueForStaffSubject(staffSubject, metricValue.metricId)) {
        return;
      }
      session.addMetricValue(staffSubject, new MetricValue(metric.metricId, '' + metricValue.metricValue));
    })
  }

  copyMetricValueForOverallFavorabilityToRolesEvaluatedInSession(session: Session, favorabilityValue: string) {
    let seenRoleSubjects: Set<string> = new Set<string>();
    session.properties.roleMetricValues.forEach((metricValues: MetricValue[], roleSubject: string)=>{
      if(seenRoleSubjects.has(roleSubject)) {
        return;
      }
      let metric: Metric = this.metricSvc.getOnlyRoleRootMetric(roleSubject);
      if (session.doesNotHaveMetricValueForRoleSubject(roleSubject, metric.metricId)) {
        session.addMetricValue(roleSubject, new MetricValue(metric.metricId, '' + favorabilityValue));
      }
      seenRoleSubjects.add(roleSubject);
    });
  }

}
