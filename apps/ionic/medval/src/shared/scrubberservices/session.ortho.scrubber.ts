/**
 * Created by chinmay on 4/8/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Session} from "../../services/session/schema";
import {MetricService} from "../../services/metric/delegator";
import {Metric, MetricValue} from "../../services/metric/schema";
import {Scrubber} from "./scrubber";
import {Staff} from "../../services/staff/schema";
import {StaffService} from "../../services/staff/delegator";
import {Injectable} from "@angular/core";

@Injectable()
export class SessionOrthoScrubber implements Scrubber<Session> {

  constructor(private metricSvc: MetricService, private staffSvc: StaffService) {}

  scrub(session: Session) {

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

    let orgMetric: Metric = this.metricSvc.getOnlyOrgMetric();
    let orgMetricValue: MetricValue = session.getOnlyOrgMetricValueFor(orgMetric);
    if (orgMetricValue) {
      this.copyMetricValueForOverallFavorabilityToRolesEvaluatedInSession(session, orgMetricValue.metricValue);
    }
  }

  copyMetricValuesFromStaffSubjectsToCorreponspondingRoles(session: Session, staffSubject: string, metricValue: MetricValue) {
    let metric = this.metricSvc.getMetricById(metricValue.metricId);
    if (session.containsMetricValueForRoleSubject(staffSubject, metricValue.metricId)) {
      return;
    }
    let staff: Staff = this.staffSvc.getCached(Metric.GetUserNameInSubject(staffSubject));
    if (staff) {
      let roleSubject: string = Metric.createRoleSubject(staff.role);
      if (session.containsMetricValueForRoleSubject(roleSubject, metricValue.metricId)) {
        return;
      }
      session.addMetricValue(roleSubject, new MetricValue(metric.metricId, '' + metricValue.metricValue));
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
      if (session.containsMetricValueForStaffSubject(staffSubject, metricValue.metricId)) {
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
