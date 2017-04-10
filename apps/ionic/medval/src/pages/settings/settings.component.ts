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

  logs: string[] = [];

  errors: string[] = [];

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
    this.replacerDataWithHardcodedStaff = this.constructSReplacerMap(true);
    this.replacerDataWithoutHardcodedStaff = this.constructSReplacerMap();
    Utils.errData.forEach((value)=>{
      if (value) {
        this.logs.push(value);
      }
    })
    Utils.logData.forEach((value)=>{
      if (value) {
        this.errors.push(value);
      }
    })
  }

  copyToClipboard() {
    let allLogs = this.errors.concat(...this.logs).join('\n');
    Clipboard.copy(allLogs)
      .then(()=>Utils.presentTopToast(this.toastCtrl, "Copied text to Clipboard", 4 * 1000))
      .catch(()=>Utils.presentTopToast(this.toastCtrl, "Could not copy text to Clipboard", 4 * 1000));
  }

  private constructSReplacerMap(setupOnlyStaff?: boolean): {[key: string] : SReplacerDataMap} {

    // Helper to construct one object (per metric) in the map.
    let constructReplacerData = (metric: Metric, staffList: Staff[]): SReplacerDataMap =>{
      let replacerData: SReplacerDataMap = {};
      replacerData.metric = metric;
      if (!setupOnlyStaff) {
        return replacerData;
      }
      if (metric.hasRoleSubject()) {
        replacerData.role = metric.getRoleSubject();
      } else if (metric.hasStaffSubject()) {
        let username = metric.getStaffSubject();
        let staffListForUsername: Staff[] = staffList.filter((staff: Staff) => {
          return staff.username == username;
        })
        Utils.throwIf(staffListForUsername.length != 1, 'Missing staff for Metric {0} with missing staff username {1} in subject', metric.metricId, username);
        replacerData.onlyStaff = staffListForUsername[0];
      }
      return replacerData;

    }

    let replacerMap: {[key: string] : SReplacerDataMap} = {};
    this.metrics.forEach((metric: Metric) => {
      replacerMap[metric.metricId] = constructReplacerData(metric, this.staffsvc.listCached());
    })
    return replacerMap;
  }
}
