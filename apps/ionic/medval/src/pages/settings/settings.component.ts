/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {Staff} from "../../services/staff/schema";
import {Metric} from "../../services/metric/schema";
import {Config} from "../../shared/config";
import {MetricService} from "../../services/metric/delegator";
import {StaffService} from "../../services/staff/delegator";
import {AccountService} from "../../services/account/delegator";
import {SReplacerDataMap} from "../../pipes/sreplacer";
import {Utils} from "../../shared/stuff/utils";
import {SessionService} from "../../services/session/delegator";
import {Clipboard} from "ionic-native";
import {ToastController} from "ionic-angular";
import {AnyComponent} from "../any.component";

@Component({
  selector:'settings',
  templateUrl:'./settings.component.html'
})

export class SettingsComponent extends AnyComponent {

  mockData: {};
  keys: string[] = [];
  metrics: Metric[] = [];
  replacerDataWithHardcodedStaff: {[key: string] : SReplacerDataMap} = {};
  replacerDataWithoutHardcodedStaff: {[key: string] : SReplacerDataMap} = {};

  logData: Iterable<string> = Utils.logData;

  errData: Iterable<string> = Utils.errData;

  constructor(
    private toastCtrl: ToastController,
    private metricsvc: MetricService,
    private staffsvc: StaffService,
    private accountsvc: AccountService,
    private sessionsvc: SessionService) {

    super();
    this.mockData = Config.MOCK_DATA;
    this.keys = Object.keys(this.mockData);

    this.metrics = metricsvc.listCached();
    this.replacerDataWithHardcodedStaff = this.constructSReplacerMap();
    this.replacerDataWithoutHardcodedStaff = this.constructSessionReplacerMap();

    this.setupSessionAndSelectedUsers();
  }

  copyToClipboard() {
    let text = [];
    Utils.errData.forEach((value)=>{
      text.push(value);
    })
    Utils.logData.forEach((value)=>{
      text.push(value);
    })
    Clipboard.copy(text.join('\n'))
      .then(()=>Utils.presentTopToast(this.toastCtrl, "Copied text to Clipboard", 4 * 1000))
      .catch(()=>Utils.presentTopToast(this.toastCtrl, "Could not copy text to Clipboard", 4 * 1000));
  }

  private constructSessionReplacerMap(): {[key: string] : SReplacerDataMap} {
    let replacerMap: {[key: string] : SReplacerDataMap} = this.constructSReplacerMap();
    this.metrics.forEach((metric: Metric) => {
      delete replacerMap[metric.metricId].staff;
      delete replacerMap[metric.metricId].role;
    })
    return replacerMap;
  }

  private constructSReplacerMap(): {[key: string] : SReplacerDataMap} {

    // Helper to construct one object (per metric) in the map.
    let constructReplacerData = (metric: Metric, staffList: Staff[]): SReplacerDataMap =>{
      let replacerData: SReplacerDataMap = {};
      replacerData.metric = metric;
      if (metric.hasRoleSubject()) {
        replacerData.role = metric.getRoleSubject();
      } else if (metric.hasStaffSubject()) {
        let username = metric.getStaffSubject();
        let staffListForUsername: Staff[] = staffList.filter((staff: Staff) => {return staff.username == username;})
        Utils.throwIf(staffListForUsername.length != 1,
          'Missing staff for Metric {0} with missing staff username {1} in subject', metric.metricId, username);
        replacerData.staff = staffListForUsername;
      }
      return replacerData;
    }

    let replacerMap: {[key: string] : SReplacerDataMap} = {};
    this.metrics.forEach((metric: Metric) => {
      replacerMap[metric.metricId] = constructReplacerData(metric, this.staffsvc.listCached());
    })
    return replacerMap;
  }

  private setupSessionAndSelectedUsers() {
    let staffList: Staff[] = this.staffsvc.listCached();
    this.sessionsvc.newCurrentSession('default');
    let account = this.accountsvc.getCached(Config.CUSTOMERID);
    let roles: string[] = account ? account.getStandardRoles() : [];
    let usernames = [];
    roles.forEach((role: string)=>{
      let staffInRole: Staff = this.staffsvc.getOnly(role);
      if (staffInRole) {
        usernames.push(staffInRole.username);
      };
    });
    this.sessionsvc.getCurrentSession().properties.selectedStaffUserNames = usernames;
  }
}
