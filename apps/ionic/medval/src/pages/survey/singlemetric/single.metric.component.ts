import {Component, ViewChild} from '@angular/core';
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/rating/rating.component";
import {StaffService} from "../../../services/staff/delegator";
import { SurveyNavigator, ISurveyComponent, RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, NavController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {SurveyNavUtils} from "../SurveyNavUtils";

@Component({
  selector: 'single-metric',
  templateUrl: 'single.metric.component.html',
})

@RegisterComponent
export class SingleMetricComponent implements ISurveyComponent {

  private currentMetric: Metric; // Input()

  @ViewChild(RatingComponent) inputComponent: RatingComponent;

  constructor(
    params: NavParams,
    private navCtrl: NavController,
    private utils: Utils,
    private staffSvc: StaffService,
    private sessionSvc: SessionService,
    private metricSvc: MetricService
  ) {
    this.getMetricById(params.get("metricId"));
  }

  private getMetricById(metricId: string) {
    Utils.throwIfNull(metricId);
    this.currentMetric = this.metricSvc.getCached(metricId);
    if (!this.currentMetric) {
      this.metricSvc.get(metricId).then((value: Metric) => {
        this.currentMetric = value;
      })
    }

  }

  public onSelection(data) {
    let navigator: SurveyNavigator = this.sessionSvc.surveyNavigator;
    navigator.session.addMetricValue(this.currentMetric.subject, new MetricValue(this.currentMetric.metricId, data));
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
}
