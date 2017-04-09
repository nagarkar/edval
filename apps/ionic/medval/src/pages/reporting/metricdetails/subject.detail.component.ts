/**
 * Created by chinmay on 2/24/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {BaseChartComponent} from "../base.chart.component";
import {ChartService} from "../chart.service";
import {Campaign} from "../../../services/campaign/schema";
import {Input, ElementRef, ViewChild, Component} from "@angular/core";
import {CampaignService} from "../../../services/campaign/delegator";
import {Utils} from "../../../shared/stuff/utils";
import {NavParams, AlertController} from "ionic-angular";
import {AccountService} from "../../../services/account/delegator";
import {StaffService} from "../../../services/staff/delegator";
import {MetricAndSubject} from "../metric.subject";
import {QueryUtils} from "../query.utils";
import {Metric} from "../../../services/metric/schema";
import {MetricService} from "../../../services/metric/delegator";

@Component({
  selector: 'subject-detail',
  templateUrl: 'subject.detail.component.html'
})
export class SubjectDetailComponent extends BaseChartComponent {

  private selectOptions = {
    cssClass: 'fullwidth'
  }

  private _insufficientData: boolean;
  get insufficientData(): boolean {
    return this._insufficientData;
  }
  set insufficientData(value: boolean) {
    this._insufficientData = value;
    this.render();
  }

  campaign: Campaign;

  totalSessions: number;

  private _selectedMetricAndSubject: MetricAndSubject;
  @Input()
  set selectedMetricAndSubject(value: MetricAndSubject) {
    this._selectedMetricAndSubject = value;
    this.render();
  };

  get selectedMetricAndSubject() {
    return this._selectedMetricAndSubject;
  }


  @Input()
  metricAndSubjects: Array<MetricAndSubject> = [];

  @Input()
  campaignId: string = Campaign.DEFAULT_CAMPAIGN_ID;

  @ViewChild('dashboard')
  dashboard: ElementRef;
  @ViewChild('yearSlider')
  yearSlider: ElementRef;
  @ViewChild('chart')
  chart: ElementRef;
  @ViewChild('errorDiv')
  errorDiv: ElementRef;

  constructor(
    alertCtrl: AlertController,
    svc: ChartService,
    asvc: AccountService,
    ssvc: StaffService,
    campaignService: CampaignService,
    private metricSvc: MetricService,
    navParams: NavParams){

    super(alertCtrl, svc, ssvc, asvc);
    this.campaign = campaignService.getCached(Campaign.DEFAULT_CAMPAIGN_ID);
    this.metricAndSubjects = navParams.get('metricAndSubjects') || [];
  }

  ngOnInit(){
    if (this.metricAndSubjects == null || !(this.metricAndSubjects.length > 0)) {
      this.getMetricAndSubjectValues()
        .then((values)=>{
          this.metricAndSubjects = this.removeMetricsWithNoChildre(values);
          this.selectedMetricAndSubject = this.metricAndSubjects[0];
        })
        .catch((err)=>{
          Utils.error(err);
          this.insufficientData = true;
        })
    } else {
      this.selectedMetricAndSubject = this.metricAndSubjects[0];
    }
  }

  render() {
    if (this.insufficientData) {
      let div: HTMLDivElement = this.dashboard.nativeElement;
      div.innerHTML = "<h6>You have insufficient data to see reports in this section</h6>";
    } else {
      this.renderMetricSeriesChart();
    }

  }

  getDisplayValue(metricAndSubject: MetricAndSubject) {
    if (metricAndSubject.subjectType == Metric.STAFF_SUBJECT_TYPE) {
      return "Metrics For " + this.staffsvc.getCached(metricAndSubject.subjectValue).displayName;
    }
    if (metricAndSubject.subjectType == Metric.ROLE_SUBJECT_TYPE) {
      return "Metrics for Role " + metricAndSubject.subjectValue;
    }
    if (metricAndSubject.subjectType == Metric.ORG_SUBJECT_TYPE) {
      return "Metrics for Org ";
    }
  }

  emailReportDetails(){
    super.emailDetails(QueryUtils.CHILD_METRIC_QUERY(this.selectedMetricAndSubject), this.selectedMetricAndSubject.getHeading().replace(/ /g,'')+".csv");
  }

  private renderMetricSeriesChart() {
    this.renderTimeVsRatingDashboard(
      this.chart.nativeElement,
      this.dashboard.nativeElement,
      this.yearSlider.nativeElement,
      this.errorDiv.nativeElement,
      QueryUtils.CHILD_METRIC_QUERY(this.selectedMetricAndSubject),
      this.selectedMetricAndSubject.getFullHeading(),
    );
  }


  private removeMetricsWithNoChildre(values: Array<MetricAndSubject>) {
    return values.filter((value: MetricAndSubject)=>{
      let mName = value.metricName;
      let metric: Metric = this.metricSvc.getMetricByName(mName);
      let drilldowns: Metric[] = this.metricSvc.getCachedNpsDrilldownMetrics(metric.metricId);
      return drilldowns && drilldowns.length > 0;
    })
  }
}
