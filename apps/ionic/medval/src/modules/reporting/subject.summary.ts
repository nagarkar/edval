import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {ReportingSummary, SummaryMetrics} from "../../services/campaign/schema";
import {Metric} from "../../services/metric/schema";
import {NavController} from "ionic-angular";
import {CampaignTabsComponent} from "./campaign.tabs.component";

@Component({
  selector: 'role-summary',
  templateUrl: 'subject.summary.html',
})

export class SubjectSummaryComponent {

  @Input()
  metrics: SummaryMetrics;

  @Output()
  _drilldown: EventEmitter<any> = new EventEmitter<any>();

  constructor(private navctrl: NavController) {
    this._drilldown.emit({

    })
  }

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

  drilldown() {
    this.navctrl.push(CampaignTabsComponent)
  }

  meanTrendingUp() {
    let m1 = this.metrics.previousWindowStats.mean;
    let m2 = this.metrics.currentWindowStats.mean;
    return m2 > m1;
  }

  detractorTrendingUp() {
    let m1 = this.metrics.previousWindowStats.frequencies.detractor;
    let m2 = this.metrics.currentWindowStats.frequencies.detractor;
    return m2 > m1;
  }

  promoterTrendingUp() {
    let m1 = this.metrics.previousWindowStats.frequencies.promoter;
    let m2 = this.metrics.currentWindowStats.frequencies.promoter;
    return m2 > m1;
  }
}
