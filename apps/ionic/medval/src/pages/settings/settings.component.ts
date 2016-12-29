import {Component} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {NavController} from "ionic-angular";
import {Staff} from "../../services/staff/schema";
import {Metric} from "../../services/metric/schema";
import {Config} from "../../shared/config";
import {SessionService} from "../../services/session/delegator";
import {MetricService} from "../../services/metric/delegator";
import {StaffService} from "../../services/staff/delegator";
import {AccountService} from "../../services/account/delegator";
import {SReplacerDataMap} from "../../pipes/SReplacer";

@Component({
  selector:'settings',
  templateUrl:'settings.component.html'
})

export class SettingsComponent {

  mockData: {};
  keys: string[] = [];
  metrics: Metric[] = [];
  sReplacerData: {[key: string] : SReplacerDataMap} = {};

  constructor(
    private utils: Utils,
    private navCtrl: NavController,
    private sessionsvc: SessionService,
    private metricsvc: MetricService,
    private staffsvc: StaffService,
    private accountsvc: AccountService) {

    this.mockData = Config.MOCK_DATA;
    this.keys = Object.keys(this.mockData);

    this.metrics = metricsvc.listCached();
    this.sReplacerData = this.constructSReplacerMap();
  }

  setValue(key: string, event: any) {
    console.log('');
  }

  get serviceUrl() {
    return Config.baseUrl;
  }

  set serviceUrl(url: string) {
    Config.baseUrl = url;
  }

  private constructSReplacerMap(): {[key: string] : SReplacerDataMap} {
    let staffList = this.staffsvc.listCached();
    let replacerMap: {[key: string] : SReplacerDataMap} = {};
    this.metrics.forEach((metric: Metric) => {
      let replacerData: SReplacerDataMap = {};
      replacerData.metric = metric;
      replacerData.role = metric.getRoleSubject();
      let staffListForRole = staffList.filter((staff: Staff) => {return staff.role == replacerData.role;})
      if (staffListForRole.length > 0) {
        replacerData.staff = staffListForRole[0];
      }
      replacerMap[metric.metricId] = replacerData;
    })
    return replacerMap;
  }
}
