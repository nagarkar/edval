/**
 * Created by chinmay on 2/24/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {NavParams, AlertController, ToastController} from "ionic-angular";
import {Component, ViewChild, ElementRef} from "@angular/core";
import {ChartService} from "./chart.service";
import {BaseChartComponent} from "./base.chart.component";
import {Metric} from "../../services/metric/schema";
import {StaffService} from "../../services/staff/delegator";
import {AccountService} from "../../services/account/delegator";
import {MetricAndSubject} from "./metric.subject";
import {HttpClient} from "../../shared/stuff/http.client";
import {Http} from "@angular/http";
import {Config} from "../../shared/config";
import {Utils} from "../../shared/stuff/utils";

@Component({
  selector: 'campaigndashboard',
  templateUrl: 'campaign.dashboard.html'
})
export class CampaignDashboard extends BaseChartComponent {

  section: string = 'summary';

  metricAndSubjects: Array<MetricAndSubject> = [];
  metricAndSubjectsForOrgAndRole: Array<MetricAndSubject> = [];

  private refreshService: HttpClient<void>;

  rightIcon: string = 'refresh-circle';

  constructor(
    alertCtrl: AlertController,
    private toastCtrl: ToastController,
    svc: ChartService,
    asvc: AccountService,
    ssvc: StaffService,
    navParams: NavParams,
    http: Http) {
    super(alertCtrl, svc, ssvc, asvc);
    this.refreshService = new HttpClient<void>(http);
  }

  ngOnInit() {
    this.getMetricAndSubjectValues()
      .then((values: MetricAndSubject[])=>{
        this.metricAndSubjects = values;
        this.metricAndSubjectsForOrgAndRole = values.filter((ms: MetricAndSubject)=>{
          return ms.subjectType == Metric.ROLE_SUBJECT_TYPE || ms.subjectType == Metric.ORG_SUBJECT_TYPE;
        });
      })
  }

  hasData(): boolean {
    return this.metricAndSubjects && this.metricAndSubjects.length > 0
  }

  private static TOO_MANY_REFRESHES = false;
  refresh = (function(): Promise<boolean> {
    if (CampaignDashboard.TOO_MANY_REFRESHES) {
      return new Promise((resolve, reject)=> {
        Utils.presentTopToast(this.toastCtrl, "You'll have to wait for 30 minutes before you can refresh your data again.");
        resolve(false /* Don't navigate away from this page*/);
      });
    } else {
      Utils.showSpinner();
      return new Promise((resolve, reject)=> {
        this.refreshService.get("/api/customers/"+ Config.CUSTOMERID + "/reportrefresh/all", '')
          .then((result)=>{
            Utils.hideSpinner();
            resolve(false /* Don't navigate away from this page*/);
            this.svc.cache.clear();
            Utils.presentTopToast(this.toastCtrl, "We've refreshed your reports. Exit this screen and come back to it to see your updated data.", 10*1000);
            CampaignDashboard.TOO_MANY_REFRESHES = true;
            setTimeout(()=>{
              CampaignDashboard.TOO_MANY_REFRESHES = false;
            }, Config.REPORT_REFRESH_INTERVAL * 60 * 1000)
          })
          .catch((err)=>{
            Utils.hideSpinner();
            reject(err);
            Utils.presentTopToast(this.toastCtrl, "Oops! We could not refresh reports. Please try again or contact questions@revvolve.io. Error: " + err);
          });
      })
    }
  }).bind(this);

}
