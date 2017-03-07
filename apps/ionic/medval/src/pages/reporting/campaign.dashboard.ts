/**
 * Created by chinmay on 2/24/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {NavParams, AlertController} from "ionic-angular";
import {Component} from "@angular/core";
import {ChartService} from "./chart.service";
import {BaseChartComponent} from "./base.chart.component";
import {Metric} from "../../services/metric/schema";
import {StaffService} from "../../services/staff/delegator";
import {AccountService} from "../../services/account/delegator";
import {MetricAndSubject} from "./metric.subject";

@Component({
  selector: 'campaigndashboard',
  templateUrl: 'campaign.dashboard.html'
})
export class CampaignDashboard extends BaseChartComponent {

  section: string = 'summary';

  metricAndSubjects: Array<MetricAndSubject> = [];
  metricAndSubjectsForOrgAndRole: Array<MetricAndSubject> = [];

  constructor(alertCtrl: AlertController, svc: ChartService, asvc: AccountService, ssvc: StaffService, navParams: NavParams) {
    super(alertCtrl, svc, ssvc, asvc);
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
}
