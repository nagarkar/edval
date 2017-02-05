import {Component, Input, Output, EventEmitter} from "@angular/core";
import {SummaryMetrics} from "../../services/campaign/schema";
import {Metric} from "../../services/metric/schema";
import {NavController} from "ionic-angular";
import {StaffService} from "../../services/staff/delegator";
import {ChartComponent, ChartType} from "./chart.component";
import {DailyDataService} from "../../services/reporting/delegator";

@Component({
  selector: 'role-summary',
  templateUrl: 'subject.summary.html',
})

export class SubjectSummaryComponent {

  _metrics: SummaryMetrics = new SummaryMetrics();

  @Input()
  set metrics(value: SummaryMetrics) {
    if (!value) {
      return;
    }
    this._metrics = value;
    this._metrics.currentWindowStats.mean = Math.round(this._metrics.currentWindowStats.mean*100)/100;
    this._metrics.previousWindowStats.mean = Math.round(this._metrics.previousWindowStats.mean*100)/100;
  };

  get metrics(): SummaryMetrics {
    return this._metrics;
  }

  @Output()
  _drilldown: EventEmitter<any> = new EventEmitter<any>();

  constructor(private navctrl: NavController, private staffsvc: StaffService, private datasvc: DailyDataService) {
    this._drilldown.emit({

    })
  }

  round(x: number): number {
    return Math.round(x);
  }

  /*
  get title(): string {
    let subject = this.metrics.metricSubject;
    if(Metric.isRoleSubject(subject)) {
      return "Role: " + Metric.getRoleInSubject(subject);
    }
    if(Metric.isOrgSubject(subject)) {
      return "Organization Wide";
    }
    return "";
  }
  */

  subjectDisplay(metricSubject: string) {
    if (Metric.isOrgSubject(metricSubject)) {
      return "Overall NPS score"
    }
    if (Metric.isRoleSubject(metricSubject)) {
      return "Role: " + Metric.getRoleInSubject(metricSubject);
    }
    if (Metric.isStaffSubject(metricSubject)) {
      return this.staffsvc.getCached(Metric.getStaffInSubject(metricSubject)).displayName;
    }
  }
  drilldown() {

    //this.datasvc.get()
    let params: any = {
      header: this.metrics.metricSubject,
      chartType: ChartType.line,
      modelDataSets: []
    };
    this.navctrl.push(ChartComponent, params);
  }

  meanTrendingUp() {
    let m1 = this._metrics.previousWindowStats.mean;
    let m2 = this._metrics.currentWindowStats.mean;
    return m2 > m1;
  }

  detractorTrendingUp() {
    let previousStats = this._metrics.previousWindowStats.frequencies;
    let currentStats = this._metrics.currentWindowStats.frequencies
    let m1 = previousStats.detractor/previousStats.totalCount;
    let m2 = currentStats.detractor/currentStats.totalCount;
    return m2 > m1;
  }

  promoterTrendingUp() {
    let previousStats = this._metrics.previousWindowStats.frequencies;
    let currentStats = this._metrics.currentWindowStats.frequencies
    let m1 = previousStats.promoter/previousStats.totalCount;
    let m2 = currentStats.promoter/currentStats.totalCount;
    return m2 > m1;
  }
}
